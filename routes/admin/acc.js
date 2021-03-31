const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');

const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'freelanceslopotrditev@gmail.com',
    pass: 'geslo1231'
  }
});

const D_mailObject = require.main.require('./mail/mail-admin.js');
const passgen = require.main.require('./misc/password-generator.js');

router.post('/login',function(request,response) {
	let connection = request.app.get('connection');
	let geslo = request.body.geslo;
	let eposta = request.body.eposta;
	let hash_primerjava = undefined;

	connection.query("SELECT naslov FROM administratorji_eposta_blacklist WHERE naslov = ?",[eposta],function(err,results,fields) {
	if (err) response.render("./admin/login-register",{napake:["Napaka na strežniku."]});
	else if (results.length > 0) response.render("./admin/login-register",{napake:["Vaša prijava je bila zavrnjena."]});
	else connection.query('SELECT geslo,potrjen FROM administratorji WHERE eposta = ?;',[eposta],function(err,results,fields) {
		if (results != undefined && results.length > 0) {
        if (results[0].potrjen == 1) {
        hash_primerjava = results[0].geslo;
		bcrypt.compare(geslo, hash_primerjava, function(err, result) {
			if (err) response.render("./admin/admin-prijava",{napake:["Napaka na strežniku."]});
			else if (result) {
					connection.query("SELECT idadmin FROM administratorji WHERE eposta = ? AND potrjen=1;",[eposta],function(err,results,fields) {
						if (err) response.render("./admin/login-register",{napake:["Napaka na strežniku."]});
						else {
							request.session.adminid = results[0].idadmin;
							response.redirect('/admin/nav/potrjevanje-admin');
						}
					});
			}
			else response.render("./admin/login-register",{napake:["Napačno geslo, poskusite znova"]});
        });}
        else if (results[0].potrjen == 0) response.render("napaka",{napake:["Vaša prošnja za prijavo je bila zavrnjena."]})
        else response.render("./admin/login-register",{napake:["Vaš račun še ni sprejet s strani administratorjev."]})
		}
		else response.render("./admin/login-register",{napake:["Račun s tem e-poštnim naslovom ne obstaja."]});
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
		if (err) response.render("napaka",{napake:["Napaka na strežniku."]})
		geslo_hashed = hash;


	if (!ime || !priimek || !geslo || !eposta) 
	napake.push("Eno ali več polj je praznih. Prosim vnesite podatke v vsa polja.");

	if (! /^[a-zžščćđA-ZŽŠĐČĆ]+$/.test(ime) || ! /^[a-zđščćžA-ZĐŠČĆŽ]+$/.test(priimek)) 
	napake.push("Ime in priimek lahko vsebujeta samo črke.");

	if (! /^[A-ZĐŠČĆŽ]/.test(priimek) || ! /^[A-ZĐŠČĆŽ]/.test(ime)) 
	napake.push("Ime in priimek morata imeti veliki začetnici.");

	if (! /[\w-]+@([\w-]+\.)+[\w-]+/.test(eposta)) 
	napake.push("E-poštni naslov ni pravilno vnesen.");

	if (! /^(?=.*?[A-ZČĆŽĐ])(?=.*?[a-zčćžđš])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/.test(geslo))
	napake.push("Geslo ne ustreza pogojem, mora vsebovati vsaj eno veliko črko, majhno črko, številko, poseben znak in mora biti dolgo vsaj 8 mest.");

	connection.query("SELECT naslov FROM administratorji_eposta_blacklist WHERE naslov = ?",[eposta],function(err,results,fields) {
		if (err) response.render("./admin/login-register",{napake:["Napaka na strežniku."]});
		else if (results.length > 0) response.render("./admin/login-register",{napake:["Vaša prijava je bila zavrnjena."]});
		else connection.query ('SELECT eposta FROM administratorji WHERE eposta = ?;',[eposta],function(err,results,fields) {
		if (err) {napake.push("Prišlo je do napake v podatkovni bazi, se opravičujemo.")};
		if (results.length > 0) napake.push("Na en e-poštni naslov je lahko poslana samo ena prijava.");
		if (napake.length) {response.render("./admin/login-register",{napake:napake})}
		else {
			connection.query("INSERT INTO administratorji (eposta, geslo, ime, priimek,potrjen) VALUES (?,?,?,?,NULL);",[eposta,geslo_hashed,ime,priimek],function(err,results,fields) {
                if (err) response.render("./admin/login-register",{napake:["Napaka na strežniku."]})
			else {
				response.render("./admin/admin-prijava.ejs",{message:"Vaša prijava je uspešno poslana!"})
			}
		});
	}
    });
	});
});
})

router.get('/logout',function(request,response) {
	let connection = request.app.get('connection');
	request.session.adminid = undefined;
	response.redirect("../nav/");
});

router.post('/poslji-potrditveno',function(request,response) {
	let connection = request.app.get('connection');
	let nadomestnoGeslo = passgen.generate(10);
	let nadomestno_hash;

	bcrypt.hash(nadomestnoGeslo, 5, function(err, hash) {
		if (err) response.send({uspelo:false});
		else {
			nadomestno_hash = hash;
			
			connection.query("SELECT eposta FROM administratorji WHERE eposta = ?;",[request.body.eposta],function(err,results,fields) {
				if (err) response.send({uspelo:false});
				else if (results.length < 1) response.send({uspelo:"eposte-ni"})
				else {
					connection.query("UPDATE administratorji SET geslo = ? WHERE eposta = ?;",[nadomestno_hash,request.body.eposta],function(err,results,fields) {
						if (err) response.send({uspelo:false});
						else {
							D_mailObject.posljiGeslo(request.body.eposta,nadomestnoGeslo,connection,transporter);
							response.send({uspelo:true});
						};
					});
				};
			});
		};
	});
});

router.post('/spremeni-geslo',function(request,response) {
	let connection = request.app.get('connection');
	let hash_primerjava = undefined;

	let novoGeslo = request.body.geslo;

	if (novoGeslo == undefined || !/^(?=.*?[A-ZČĆŽĐ])(?=.*?[a-zčćžđš])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/.test(novoGeslo) ) response.render("napaka",{napake:["Geslo ne ustreza pogojem, mora vsebovati vsaj eno veliko črko, majhno črko, številko, poseben znak in mora biti dolgo vsaj 8 mest."]});
	else connection.query('SELECT geslo FROM administratorji WHERE eposta = ?;',[request.body.eposta],function(err,results,fields) {
		if (results.length > 0) {hash_primerjava = results[0].geslo;
		
		bcrypt.compare(request.body.potrditvenakoda, hash_primerjava, function(err, result) {
			if (err) response.render("./admin/geslo",{napake:["Napaka na strežniku."]})
			else if (result) {
				bcrypt.hash(novoGeslo, 5, function(err, hash) {
					if (err) response.render("./admin/geslo",{napake:["Napaka na strežniku."]});
					else {
					let nov_hash = hash;

					connection.query("UPDATE administratorji SET geslo=? WHERE eposta = ?",[nov_hash,request.body.eposta],function(err,results,fields) {
						if (err) response.render("./admin/geslo",{napake:["Napaka na strežniku."]});
						else {
							connection.query("SELECT idadmin FROM administratorji WHERE eposta = ?",[request.body.eposta],function(err,results,fields) {
							request.session.adminid = results[0].idadmin;
							response.redirect('/admin/nav/nastavitve');
							});
						}
					})
				}});
			}
			else response.render("./admin/geslo",{napake:["Napačno potrditveno geslo, poskusite znova"]});
		});
		}
		else response.render("./admin/geslo",{napake:["Račun s tem e-poštnim naslovom ne obstaja, poskusite znova."]});
	});
});

router.post('/izbris-racuna',function(request,response) {
	let connection = request.app.get('connection');
	connection.query("SELECT idadmin FROM administratorji WHERE eposta = ? AND idadmin = ?",[request.body.eposta,request.session.adminid],function(err,results,fields) {
	if (results.length  < 1) response.render("napaka.ejs",{napake:['E-poštni naslov se ne ujema z računom.']})
	else connection.query("DELETE FROM administratorji WHERE eposta = ? AND idadmin = ?",[request.body.eposta,request.session.adminid],function(err,results,fields) {
		if (err) response.render("napaka",{napake:["Napaka na strežniku."]});
		else {response.redirect("../nav/");}
	});
	});
});

router.post('/posodobi-podatke',function(request,response) {
	let connection = request.app.get('connection');

	if (! /^[a-zžščćđA-ZŽŠĐČĆ]+$/.test(request.body.ime) || ! /^[a-zđščćžA-ZĐŠČĆŽ]+$/.test(request.body.priimek)) 
	response.send({uspelo:'tekst.narobe'});

	else if (! /^[A-ZĐŠČĆŽ]/.test(request.body.priimek) || ! /^[A-ZĐŠČĆŽ]/.test(request.body.ime)) 
	response.send({uspelo:"zacetnici-narobe"});

	else connection.query("UPDATE administratorji SET ime = ?, priimek = ? WHERE idadmin = ?",[request.body.ime,request.body.priimek,request.session.adminid],function(err,results,fields) {
		if (err) response.send({uspelo:false});
		else response.send({uspelo:true});
	});

})

module.exports = router;