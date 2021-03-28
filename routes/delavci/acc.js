//DELETE NAPAKEHANDLER

const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'freelanceslopotrditev@gmail.com',
    pass: 'geslo1231'
  }
});

const D_mailObject = require.main.require('./mail/mail-delavci.js');
const passgen = require.main.require('./misc/password-generator.js');

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

router.post('/login',function(request,response) {
	let connection = request.app.get('connection');
	let geslo = request.body.geslo;
	let eposta = request.body.eposta;
	let hash_primerjava = undefined;

	connection.query("SELECT eposta FROM delavci_eposta_blacklist WHERE eposta = ?",[request.body.eposta],function(err,results,fields) {	
		if (err) {napake.push("Prišlo je do napake v podatkovni bazi, se opravičujemo.");}
		else if (results.length > 0) {response.render("./delavci/login-register.ejs",{napake:["Administrator je vaš račun dokončno odstranil."]});}
		else connection.query('SELECT geslo FROM delavci WHERE eposta = ?;',[eposta],function(err,results,fields) {
		if (results.length > 0) {hash_primerjava = results[0].geslo;
		
		bcrypt.compare(geslo, hash_primerjava, function(err, result) {
			if (err) response.render("./delavci/login-register.ejs",{napake:["Napaka na strežniku."]});
			else if (result) {
							connection.query("SELECT iddelavca FROM delavci WHERE eposta = ?",[request.body.eposta],function (err,results,fields) {
							if (err) response.render("./delavci/login-register.ejs",{napake:["Napaka na strežniku."]});
							else if (results.length < 1) response.render("./delavci/login-register.ejs",{napake:["Administrator je vaš račun dokončno odstranil."]});
							else {
								request.session.userid = results[0].iddelavca;
								response.redirect('/delavci/nav/feed');
							}
							});
			}
			else response.render("./delavci/login-register.ejs",{napake:["Napačno geslo, poskusite znova"]});
		});
		}
		else response.render("./delavci/login-register.ejs",{napake:["Račun s tem e-poštnim naslovom ne obstaja, poskusite znova."]});
	});
	});
});

router.post('/register',function(request,response) {
	let connection = request.app.get('connection');
	let ime = request.body.ime;
	let priimek = request.body.priimek;
	let eposta = request.body.eposta;
	let geslo = request.body.geslo;
	let geslo_hashed = undefined;
	let napake = [];
	
	bcrypt.hash(geslo, 5, function(err, hash) {
		if (err) response.render("napaka",{napake:["Napaka na strežniku."]});
		geslo_hashed = hash;


	if (!ime || !priimek || !geslo || !eposta) 
	napake.push("Eno ali več polj je praznih. Prosim vnesite podatke v vsa polja.");

	if (! /^[a-zžščćđA-ZŽŠĐČĆ]+$/.test(ime) || ! /^[a-zđščćžA-ZĐŠČĆŽ]+$/.test(priimek)) 
	napake.push("Ime in priimek lahko vsebujeta samo črke."); 

	if (! /^[A-ZĐŠČĆŽ]/.test(priimek) || ! /^[A-ZĐŠČĆŽ]/.test(ime)) 
	napake.push("Ime in priimek morata imeti veliki začetnici."); i

	if (! /[\w-]+@([\w-]+\.)+[\w-]+/.test(eposta)) 
	napake.push("E-poštni naslov ni pravilno vnesen."); 

	if (! /^(?=.*?[A-ZČĆŽĐ])(?=.*?[a-zčćžđš])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/.test(geslo))
	napake.push("Geslo ne ustreza pogojem, mora vsebovati vsaj eno veliko črko, majhno črko, številko, poseben znak in mora biti dolgo vsaj 8 mest.");
	
	else connection.query("SELECT eposta FROM delavci_eposta_blacklist WHERE eposta = ?",[request.body.eposta],function(err,results,fields) {	

	if (err) {napake.push("Prišlo je do napake v podatkovni bazi, se opravičujemo.");}
	else if (results.length > 0) {response.render("./delavci/login-register.ejs",{napake:["Administrator je vaš račun dokončno odstranil."]});}

	else connection.query ('SELECT eposta FROM delavci WHERE eposta = ?;',[eposta],function(err,results,fields) { //preveri če je e-pošta še neregistrirana
	if (err) {napake.push("Prišlo je do napake v podatkovni bazi, se opravičujemo.")};
	if (results.length > 0) napake.push("Na en e-postni naslov je lahko registriran samo en račun.");

	if (napake.length) {response.render("./delavci/login-register.ejs",{napake:napake})}
	else {
			connection.query("INSERT INTO delavci (eposta, geslo, ime, priimek) VALUES (?,?,?,?);",[eposta,geslo_hashed,ime,priimek],function(err,results,fields) {
			if (err) response.render("./delavci/login-register.ejs",{napake:["Napaka na strežniku."]});
			else {
				connection.query("SELECT iddelavca FROM delavci WHERE eposta = ?;",[eposta],function(err,results,fields) {
					if (err) response.render("./delavci/login-register.ejs",{napake:["Napaka na strežniku."]});
					else {
						request.session.userid = results[0].iddelavca;
						D_mailObject.postaPotrditev(eposta,results[0].iddelavca,connection,transporter);
						response.redirect('/delavci/nav/feed');
					}
				});
			}
		});
	}
    });
	});
});
})

router.post('/verify-email', function(request,response) {
	let connection = request.app.get('connection');
	if (/^[0-9]{4}$/.test(request.body.potrditvenakoda))
	connection.query('SELECT potrditvenakoda FROM delavci WHERE iddelavca = ?',[request.session.userid],function(err,results,fields) {
		if (results.length > 0) {
			if (err) response.send(false);
			if (results[0].potrditvenakoda == request.body.potrditvenakoda) {
				connection.query('UPDATE delavci SET epostapotrjena=1 WHERE iddelavca = ?',[request.session.userid],function(err,results,fields) {
					if (err) response.send(false);
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
	connection.query('SELECT eposta FROM delavci WHERE iddelavca = ?',[request.session.userid],function(err,results,fields) {
        if (err) {
            response.end();
        }
        else {
            D_mailObject.postaPotrditev(results[0].eposta,request.session.userid,connection,transporter);
            response.send();
        }
    });
});

router.get('/logout',function(request,response) {
	let connection = request.app.get('connection');
	request.session.userid = undefined;
	response.redirect("../nav/login-register");
});

router.post('/izbris-racuna',function(request,response) {
	let connection = request.app.get('connection');
	connection.query("SELECT iddelavca FROM delavci WHERE eposta = ? AND iddelavca = ?",[request.body.eposta,request.session.userid],function(err,results,fields) {
	if (results.length  < 1) response.render("napaka.ejs",{napake:['E-poštni naslov se ne ujema z računom.']})
	else connection.query("DELETE FROM delavci WHERE eposta = ? AND iddelavca = ?",[request.body.eposta,request.session.userid],function(err,results,fields) {
		if (err) response.render("napaka",{napake:["Napaka na strežniku."]});
		else {response.redirect("../nav/login-register");}
	});
	});
});

router.post('/osnovne-znacilnosti',function(request,response){
	let connection = request.app.get('connection');
	//preveri ime & priimek
	if (! /^[a-zžščćđA-ZŽŠĐČĆ]+$/.test(request.body.ime) || ! /^[a-zđščćžA-ZĐŠČĆŽ]+$/.test(request.body.priimek)) 
	response.send({uspelo:'samo-crke'});
 
	else if (! /^[A-ZĐŠČĆŽ]/.test(request.body.priimek) || ! /^[A-ZĐŠČĆŽ]/.test(request.body.ime)) 
	response.send({uspelo:'velika-zacetnica'});

	//preveri datum rojstva
	else if(Date.parse(request.body.datumrojstva) > Date.now())
	response.send({uspelo:'datum-narobe'})

	//preveri telefonsko
	else if(!/^(?=.{9})[0-9]{3}-{1}[0-9]{3}-{1}[0-9]{3}$/g.test(request.body.telefon))
	response.send({uspelo:'stevilka-narobe'})

	else connection.query("UPDATE delavci SET ime=?,priimek=?,datumrojstva=?,telefon=? WHERE iddelavca = ?",[request.body.ime,request.body.priimek,request.body.datumrojstva,request.body.telefon,request.session.userid],function (err,results,fields) {
		if (err) response.send({uspelo:false});
		else response.send({uspelo:true});
	});
})

router.post('/kratek-opis',function(request,response) {
	let connection = request.app.get('connection');
	if (request.body.kratekopis.length > 250) response.send({uspelo:"opis-predolg"});
	else connection.query("UPDATE delavci SET kratekopis = ? WHERE iddelavca = ?;",[request.body.kratekopis,request.session.userid],function(err,results,fields) { 
		if (err) {response.send({uspelo:false});}
		else response.send({uspelo:true});
	});
});

router.post('/poslji-potrditveno',function(request,response) {
	let connection = request.app.get('connection');
	let nadomestnoGeslo = passgen.generate(10);
	let nadomestno_hash;

	//set geslo to a random string of characters
	bcrypt.hash(nadomestnoGeslo, 5, function(err, hash) {
		if (err) response.send({uspelo:false});
		else {
			nadomestno_hash = hash;
			
			connection.query("SELECT eposta FROM delavci WHERE eposta = ?;",[request.body.eposta],function(err,results,fields) {
				if (err) response.send({uspelo:false});
				else if (results.length < 1) response.send({uspelo:"eposte-ni"})
				else {
					connection.query("UPDATE delavci SET geslo = ? WHERE eposta = ?;",[nadomestno_hash,request.body.eposta],function(err,results,fields) {
						if (err) response.send({uspelo:false});
						else {
							//send the new geslo via email
							D_mailObject.posljiGeslo(request.body.eposta,nadomestnoGeslo,connection,transporter);
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
	else connection.query("SELECT eposta FROM delavci_eposta_blacklist WHERE eposta = ?;",[request.body.eposta],function (err,results,fields) {
		if (err) response.render("napaka",{napake:"Napaka na strežniku."})
		if (results.length > 0) response.render("./delavci/geslo",{napake:["Vaš račun je bil dokončno odstranjen."]});
		else connection.query('SELECT geslo FROM delavci WHERE eposta = ?;',[request.body.eposta],function(err,results,fields) {
		if (results.length > 0) {hash_primerjava = results[0].geslo;
		
		bcrypt.compare(request.body.potrditvenakoda, hash_primerjava, function(err, result) {
			if (err) response.render("./delavci/geslo",{napake:["Napaka na strežniku."]})
			else if (result) {
				bcrypt.hash(novoGeslo, 5, function(err, hash) {
					if (err) response.render("./delavci/geslo",{napake:["Napaka na strežniku."]});
					else {
					let nov_hash = hash;

					connection.query("UPDATE delavci SET geslo=? WHERE eposta = ?",[nov_hash,request.body.eposta],function(err,results,fields) {
						if (err) response.render("./delavci/geslo",{napake:["Napaka na strežniku."]})
						else {
							connection.query("SELECT iddelavca FROM delavci WHERE eposta = ?",[request.body.eposta],function(err,results,fields) {
								if (err) response.render("./delavci/geslo",{napake:["Napaka na strežniku."]});
								else if (results.length < 1) response.render("./delavci/geslo",{napake:["Račun s tem e-poštnim naslovom ne obstaja."]});
								else {
								request.session.userid = results[0].iddelavca;
								response.redirect('/delavci/nav/feed');
								}
						});
						}
					})
				}});
			}
			else response.render("./delavci/geslo",{napake:["Napačno potrditveno geslo, poskusite znova"]});
		});
		}
		else response.render("./delavci/geslo",{napake:["Račun s tem e-poštnim naslovom ne obstaja, poskusite znova."]});
	});
	});
});

router.post('/blokiranje-pritozba',function(request,response) {
	let connection = request.app.get('connection');

	connection.query("UPDATE delavci SET odgovor_delavca=? WHERE iddelavca = ?;",[request.body.pojasnilo,request.session.userid],function(err,results,fields) {
		if (err) response.send({uspelo:false});
		else response.send({uspelo:true});
	});
});

module.exports = router;