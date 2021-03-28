
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'freelanceslopotrditev@gmail.com',
    pass: 'geslo1231'
  }
});

const P_mailObject = require.main.require('./mail/mail-podjetja.js');
const passgen = require.main.require('./misc/password-generator.js');

const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');

router.post('/register',function(request,response) {
    let connection = request.app.get('connection');

    let eposta = request.body.eposta;
    let geslo = request.body.geslo;
    let crypted_geslo = undefined;

    let ime_podjetja = request.body.imepodjetja;
    let vrsta_podjetja = request.body.vrstapodjetja;

    let napake = [];

	bcrypt.hash(geslo, 5, function(err, hash) {
	if (err) response.render("napaka",{napake:["Napaka na strežniku."]});
	else {
    crypted_geslo = hash;


    if (!eposta || !geslo || !ime_podjetja || !vrsta_podjetja) 
	napake.push("Eno ali več polj je praznih. Prosim vnesite podatke v vsa polja.");

    if (! /[\w-]+@([\w-]+\.)+[\w-]+/.test(eposta)) 
    napake.push("E-poštni naslov ni pravilno vnesen."); 
    
    if (! /^[a-zžščćđA-ZŽŠĐČĆ0-9 ]+$/.test(ime_podjetja)) 
	napake.push("Ime podjetja lahko vsebuje samo črke in številke.");

	if (! /^(?=.*?[A-ZČĆŽĐ])(?=.*?[a-zčćžđš])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/.test(geslo)) 
	napake.push("Geslo ne ustreza pogojem, mora vsebovati vsaj eno veliko črko, majhno črko, številko, poseben znak in mora biti dolgo vsaj 8 mest.");
	
	connection.query("SELECT naslov FROM podjetja_eposta_blacklist WHERE naslov = ?",[request.body.eposta],function(err,results,fields) {
		if (err) response.render("napaka",{napake:['Napaka na strežniku.']});
		else if (results.length > 0) {
			connection.query('SELECT ime FROM vrstepodjetji;',[],function(err,results,fields) {
				if (err) response.render("napaka",{napake:['Napaka na strežniku.']})
				else response.render("./podjetja/login-register.ejs",{vrstepodjetji:results,napake:["Administrator je vaš račun dokončno odstranil."]});
			});
	}
	else connection.query ('SELECT eposta FROM podjetje WHERE eposta = ?;',[eposta],function(err,results,fields) {
		if (err) {napake.push("Prišlo je do napake v podatkovni bazi, se opravičujemo.")};
		if (results.length > 0) {
			
		napake.push("Na en e-postni naslov je lahko registriran samo en račun."); 
		
		connection.query('SELECT ime FROM vrstepodjetji;',[],function(err,results,fields) {
		if (err) response.render("napaka",{napake:['Napaka na strežniku.']})
		else response.render("./podjetja/login-register.ejs",{vrstepodjetji:results,napake:napake});
		});

		}
		else {

    connection.query ('SELECT ime,idvrste FROM vrstepodjetji WHERE ime = ?;',[vrsta_podjetja],function(err,results,fields) {
        if (err) {response.render("napaka",{napake:["Napaka na strežniku!"]});}
        else {
        if (results.length > 0 && napake.length <= 0) {
            connection.query("INSERT INTO podjetje(naziv,idvrste,geslo,eposta) VALUES (?,?,?,?);",[ime_podjetja,results[0].idvrste,crypted_geslo,eposta],function(err,results,fields) {
                if (err) {response.render("napaka",{napake:["Napaka na strežniku!"]});}
                connection.query("SELECT idpodjetja FROM podjetje WHERE eposta = ?;",[eposta],function(err,results,fields) {
					if (err) {response.render("napaka",{napake:["Napaka na strežniku!"]});}
					else {
						request.session.podjetjeid = results[0].idpodjetja;
						P_mailObject.postaPotrditev(eposta,results[0].idpodjetja,connection,transporter);
						response.redirect('/podjetja/nav/feed');
					}
				});
            })
        }
        else {
            napake.push("Vrsta podjetja ni v seznamu možnih vrst.");
			
			connection.query('SELECT ime FROM vrstepodjetji;',[],function(err,results,fields) {
				if (err) response.render("napaka",{napake:['Napaka na strežniku.']})
				else response.render("./podjetja/login-register.ejs",{vrstepodjetji:results,napake:napake});
			});
        }
        }
    });}});	});
    }});
})

router.post('/login',function(request,response) {
  let connection = request.app.get('connection');
	let geslo = request.body.geslo;
	let eposta = request.body.eposta;
	let hash_primerjava = undefined;

	connection.query("SELECT naslov FROM podjetja_eposta_blacklist WHERE naslov = ?",[request.body.eposta],function(err,results,fields) {
	if (err) response.render("napaka",{napake:['Napaka na strežniku.']});
	else if (results.length > 0) {
		connection.query('SELECT ime FROM vrstepodjetji;',[],function(err,results,fields) {
			if (err) response.render("napaka",{napake:['Napaka na strežniku.']})
			else response.render("./podjetja/login-register.ejs",{vrstepodjetji:results,napake:["Administrator je vaš račun dokončno odstranil."]});
		});
	}
	else {
	connection.query('SELECT geslo,idpodjetja FROM podjetje WHERE eposta = ?;',[eposta],function(err,results,fields) {
		if (results.length > 0) {hash_primerjava = results[0].geslo;
		bcrypt.compare(geslo, hash_primerjava, function(err, result) {
			if (err) response.render("napaka",{napake:["Napaka na strežniku!"]});
			else if (result) {
						request.session.podjetjeid = results[0].idpodjetja;
						response.redirect('/podjetja/nav/feed');
			}
			else {
				connection.query('SELECT ime FROM vrstepodjetji;',[],function(err,results,fields) {
					if (err) response.render("napaka",{napake:['Napaka na strežniku.']})
					else response.render("./podjetja/login-register.ejs",{vrstepodjetji:results,napake:["Napačno geslo. Poskusite znova."]});
				});
			}
		});
		}
		else {
			connection.query('SELECT ime FROM vrstepodjetji;',[],function(err,results,fields) {
				if (err) response.render("napaka",{napake:['Napaka na strežniku.']})
				else response.render("./podjetja/login-register.ejs",{vrstepodjetji:results,napake:["Račun s tem e-poštnim naslovom ne obstaja, poskusite znova."]});
			});
		}
	});
	}
	});
});

router.post('/osnovni-podatki',function(request,response) {
  let connection = request.app.get('connection');
  
  if (! /^[a-zžščćđA-ZŽŠĐČĆ0-9 ]+$/.test(request.body.naziv)) response.send({uspelo:"narobe-naziv"})
  else {
  connection.query("SELECT idvrste FROM vrstepodjetji WHERE idvrste=?;", [request.body.vrsta], function(err,results,fields) {
  if (err) response.send({uspelo:false});
  else if (results.length > 0) {
  connection.query("UPDATE podjetje SET naziv=?,idvrste=? WHERE idpodjetja = ?;", [request.body.naziv,request.body.vrsta,request.session.podjetjeid], function(err,results,fields) {
    if (err) response.send({uspelo:false});
    else {
      response.send({uspelo:true});
  }
  });}
  else response.send({uspelo:"narobe-vrsta"});
  });
  }
});

router.post('/podatki-podjetja',function(request,response) {
  let connection = request.app.get('connection');
  if (request.body.naslov == '' || request.body.telefonska == '' || request.body.datumzacetka == '') response.send({uspelo:'ni-podatkov'});

  else connection.query("SELECT idvelikosti FROM velikostipodjetji WHERE idvelikosti = ?;", [request.body.velikost], function(err,results,fields) {
  if (err) response.send({uspelo:false});
  else {
    if (results.length > 0) {

      if (! /^[a-zžščćđA-ZŽŠĐČĆ0-9 ]+$/.test(request.body.naslov)) response.send({uspelo:"narobe-naslov"});

      else if (! /^(?=.{9})[0-9]{3}-{1}[0-9]{3}-{1}[0-9]{3}$/.test(request.body.telefonska)) response.send({uspelo:"narobe-telefonska"});

      else if (Date.parse(request.body.datumzacetka) > Date.now()) response.send({uspelo:"datum-narobe"})

      else {
        connection.query("UPDATE podjetje SET naslov=?,velikost=?,telefonska=?,datum_ustanovitve=? WHERE idpodjetja = ?;", [request.body.naslov,request.body.velikost,request.body.telefonska,request.body.datumzacetka,request.session.podjetjeid], function(err,results,fields) {
          if (err) response.send({uspelo:false});
          else response.send({uspelo:true});
       });
    }
  }
  else response.send({uspelo:"velikost-narobe"});
  }
  });
})

router.post('/isci-podrocje',function(request,response) {
  let connection = request.app.get('connection');

  if (request.body.iskanje.length > 0) { 
  if (! /^[a-zžščćđA-ZŽŠĐČĆ0-9 ]+$/.test(request.body.iskanje)) response.send({uspelo:"narobe-iskanje"});
  else {
    connection.query("SELECT imepodrocja,idpodrocja FROM podrocjapodjetji WHERE imepodrocja LIKE ?;", [request.body.iskanje+'%'], function(err,results,fields) {
      if (err) response.send({uspelo:false});
      else {
        response.send({uspelo:true, podrocja:results});
      }
    });
  }}
});

router.post('/spremeni-podrocje',function(request,response) {
  let connection = request.app.get('connection');

  if (! /^[0-9]+$/.test(request.body.idpodrocja)) response.send({uspelo:"narobe-dodaj"});
  else {
  connection.query("UPDATE podjetje SET podrocje=? WHERE idpodjetja=?;", [request.body.idpodrocja,request.session.podjetjeid], function(err,results,fields) {
    if (err) response.send({uspelo:false});
    else {
      response.send({uspelo:true})
    }
  });
  }
});

router.post('/verify-email', function(request,response) {
	let connection = request.app.get('connection');
	if (/^[0-9]*$/.test(request.body.potrditvenakoda))
	connection.query('SELECT potrditvenakoda FROM podjetje WHERE idpodjetja = ?',[request.session.podjetjeid],function(err,results,fields) {
		if (results.length > 0) {
      if (results[0].potrditvenakoda == request.body.potrditvenakoda) {
				connection.query('UPDATE podjetje SET epostapotrjena=1 WHERE idpodjetja = ?',[request.session.podjetjeid],function(err,results,fields) {
					response.send({uspelo:true});
				})
			}
			else response.send({uspelo:"narobe-koda"});
		}
		else response.send({uspelo:"ni-kode"});
	})
	else response.send({uspelo:false});
});

router.get('/eposta-spet',function(request,response) {
	let connection = request.app.get('connection');
	connection.query('SELECT eposta FROM podjetje WHERE idpodjetja = ?',[request.session.podjetjeid],function(err,results,fields) {
        if (err) {
            response.end();
        }
        else {
			P_mailObject.postaPotrditev(request.body.eposta,results[0].idpodjetja,connection,transporter);
            response.send({uspelo:true});
        }
    });
});

router.get('/logout',function(request,response) {
	let connection = request.app.get('connection');
	request.session.podjetjeid = undefined;
	response.redirect("../nav/login-register");
});

router.post('/izbris-racuna',function(request,response) {
  let connection = request.app.get('connection');
	connection.query("SELECT idpodjetja FROM podjetje WHERE eposta = ? AND idpodjetja = ?",[request.body.eposta,request.session.podjetjeid],function(err,results,fields) {
  if (err) {response.render("napaka.ejs",{napake:['Napaka na strežniku.']})}
  else  if (results == undefined || results.length  < 1) response.render("napaka.ejs",{napake:['E-poštni naslov se ne ujema z računom.']})
	else connection.query("DELETE FROM podjetje WHERE eposta = ? AND idpodjetja = ?",[request.body.eposta,request.session.podjetjeid],function(err,results,fields) {
    if (err) {response.render("napaka.ejs",{napake:['Napaka na strežniku.']})}
		else {response.redirect("../nav/login-register");}
	});
	});
});

router.post('/poslji-potrditveno',function(request,response) {
	let connection = request.app.get('connection');
	let nadomestnoGeslo = passgen.generate(10);
	let nadomestno_hash;

	bcrypt.hash(nadomestnoGeslo, 5, function(err, hash) {
		if (err) response.send({uspelo:false});
		else {
			nadomestno_hash = hash;
			
			connection.query("SELECT idpodjetja,eposta FROM podjetje WHERE eposta = ?;",[request.body.eposta],function(err,results,fields) {
				if (err) response.send({uspelo:false});
				else if (results.length < 1) response.send({uspelo:"eposte-ni"})
				else {
					
					let idpodjetje = results[0].idpodjetja;

					connection.query("UPDATE podjetje SET geslo = ? WHERE eposta = ?;",[nadomestno_hash,request.body.eposta],function(err,results,fields) {
						if (err) response.send({uspelo:false});
						else {
							P_mailObject.posljiGeslo(request.body.eposta,connection,transporter);
							response.send({uspelo:true});
						}
					})
				}
			})
		}
	})
});

router.post('/spremeni-geslo',function(request,response) {
	let connection = request.app.get('connection');
	let hash_primerjava = undefined;

	let novoGeslo = request.body.geslo;

	if (novoGeslo == undefined || ! /^(?=.*?[A-ZČĆŽĐ])(?=.*?[a-zčćžđš])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/.test(novoGeslo) ) response.render("napaka",{napake:["Geslo ne ustreza pogojem, mora vsebovati vsaj eno veliko črko, majhno črko, številko, poseben znak in mora biti dolgo vsaj 8 mest."]});
	else connection.query("SELECT naslov FROM podjetja_eposta_blacklist WHERE naslov = ?;",[request.body.eposta],function (err,results,fields) {
		if (err) response.render("napaka",{napake:"Napaka na strežniku."})
		else if (results.length > 0) response.render("./delavci/geslo",{napake:["Vaš račun je bil dokončno odstranjen."]});
		else connection.query('SELECT geslo FROM podjetje WHERE eposta = ?;',[request.body.eposta],function(err,results,fields) {
		if (results.length > 0) {hash_primerjava = results[0].geslo;
		
		bcrypt.compare(request.body.potrditvenakoda, hash_primerjava, function(err, result) {
			if (err) response.render("napaka",{napake:["Napaka na strežniku."]})
			else if (result) {
				bcrypt.hash(novoGeslo, 5, function(err, hash) {
					if (err) response.render("napaka",{napake:["Napaka na strežniku."]});
					else {
					let nov_hash = hash;

					connection.query("UPDATE podjetje SET geslo=? WHERE eposta = ?",[nov_hash,request.body.eposta],function(err,results,fields) {
						if (err) response.render("napaka",{napake:["Napaka na strežniku."]})
						else {
							connection.query("SELECT opozorjen,idpodjetja FROM podjetje WHERE eposta = ?",[request.body.eposta],function(err,results,fields) {
							request.session.podjetjeid = results[0].idpodjetja;

							if (results[0].opozorjen == 1) {
								connection.query("SELECT idpodjetja FROM podjetja_opozorila WHERE idpodjetja = ?;",[request.session.podjetjeid],function(err,results,fields) {
								if (err) response.render("napaka",{napake:["Napaka na strežniku."]})
								else if (results.length > 0) response.redirect('/podjetja/nav/feed');
								else response.render("napaka",{napake:["Vaš račun je bil dokončno odstranjen."]})
								});
							}
							else {
								response.redirect('/podjetja/nav/feed');
							}
							});
						}
					});
				}});
			}
			else response.render("./podjetje/geslo",{napake:["Napačno potrditveno geslo, poskusite znova"]});
		});
		}
		else response.render("./podjetja/geslo",{napake:["Račun s tem e-poštnim naslovom ne obstaja, poskusite znova."]});
	});});
});

router.post('/blokiranje-pritozba',function(request,response) {
	let connection = request.app.get('connection');

	connection.query("UPDATE podjetje SET odgovor_podjetja=? WHERE idpodjetja = ?;",[request.body.pojasnilo,request.session.podjetjeid],function(err,results,fields) {
		if (err) response.send({uspelo:false});
		else response.send({uspelo:true});
	});
});




module.exports = router;