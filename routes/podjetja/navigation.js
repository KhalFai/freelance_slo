const express = require('express')
const router = express.Router();
const moment = require('moment');

router.get('/login-register', function(request,response) {
    //dobie vse vrste podjetji
    let connection = request.app.get('connection');
    connection.query('SELECT ime FROM vrstepodjetji;',[],function(err,results,fields) {
    if (err) response.render("napaka",{napake:['Napaka na strežniku.']})
	else response.render("./podjetja/login-register.ejs",{vrstepodjetji:results,napake:[]});
    });
});

router.get('/feed', function(request,response) {
    if (request.session.podjetjeid != undefined) {
        let connection = request.app.get('connection');
        let data = {
            trenutnadela: [
                {
                    iddela:0,
                    naziv:"Napaka na strežniku.",
                    opis:"Kontaktirajte administratorja.",
                    placa:0,
                    nivoizobrazbe:"--",
                    imepodrocja:"--",
                    nazivtrajanja:"--",
                    nazivdelovnika:"--",
                    nazivplace:"--"
                }
            ],
            userdata: {},
            pagedata: {
                nivojiizobrazbe: [],
                trajanja: [],
                delovniki: [],
                vrste_place: [],
                page:0
            }
        }

        let stranvalue = request.query.page;
        console.log(stranvalue);

        if (stranvalue == undefined || !/^[0-9]+$/.test(stranvalue)) stranvalue=1; 

        data.pagedata.page = stranvalue;

		connection.query("SELECT idpodjetja FROM podjetje WHERE idpodjetja = ?",[request.session.podjetjeid],function (err,results,fields) {
			if (err) response.render("napaka.ejs",{napake:["Napaka na strežniku."]})
			else if (results.length == 0) response.render("napaka.ejs",{napake:["Administrator je dokončno odstranil vaš račun."]})
            else connection.query("SELECT dela.iddela, dela.naziv, opis, placa, nivojiizobrazbe.naziv AS nivoizobrazbe, podrocjapodjetji.imepodrocja, trajanje.naziv AS nazivtrajanja, delovnik.naziv AS nazivdelovnika, vrste_plac.naziv AS nazivplace, pojasnilo_admina, opozorjen, GROUP_CONCAT(spretnosti.naziv SEPARATOR ', ') AS spretnosti FROM dela LEFT JOIN dela_has_spretnosti ON dela.iddela = dela_has_spretnosti.iddela LEFT JOIN spretnosti ON dela_has_spretnosti.idspretnosti = spretnosti.idspretnosti INNER JOIN nivojiizobrazbe nivojiizobrazbe ON nivojiizobrazbe.idnivoja = dela.idizobrazbe INNER JOIN podrocjapodjetji ON podrocjapodjetji.idpodrocja = dela.idpodrocja INNER JOIN trajanje ON trajanje.idtrajanja = dela.idtrajanja INNER JOIN delovnik ON delovnik.iddelovnika = dela.iddelovnika INNER JOIN vrste_plac ON vrste_plac.idplace = dela.idplace WHERE idpodjetja = ? GROUP BY dela.iddela ORDER BY dela.iddela DESC LIMIT 20 OFFSET ?;",[request.session.podjetjeid,(stranvalue-1) * 20],function(err,results,fields) {
            console.log(err);
            if (err) response.render('napaka.ejs',{napake:["Napaka na strežniku."]})
            else {
            data.trenutnadela = results;
            console.log(results);
            connection.query("SELECT * FROM nivojiizobrazbe;",[],function(err,results,fields) {
                if (err) response.render('napaka.ejs',{napake:["Napaka na strežniku."]})
                data.pagedata.nivojiizobrazbe = results;
                connection.query("SELECT * FROM trajanje;",[],function(err,results,fields) {
                    if (err) response.render('napaka.ejs',{napake:["Napaka na strežniku."]})
                    data.pagedata.trajanja = results
                    connection.query("SELECT * FROM delovnik;",[],function(err,results,fields) {
                        if (err) response.render('napaka.ejs',{napake:["Napaka na strežniku."]})
                        data.pagedata.delovniki = results;
                            connection.query("SELECT * FROM vrste_plac;",[],function(err,results,fields) {
                            if (err) response.render('napaka.ejs',{napake:["Napaka na strežniku."]})
                            data.pagedata.vrste_place = results;
                            response.render('./podjetja/feed.ejs',data)
                            });
                    });
                });
            });
            }
        });});
    }
    else response.render("napaka.ejs",{napake:["Napaka pri prijavi, poskusite znova."]});
});

router.get('/nastavitve', function(request,response) {
    if (request.session.podjetjeid != undefined) {
    let connection = request.app.get('connection');
    
    data = {
        userdata: {
            idpodjetja: 100,
            naziv: "Napaka na strežniku.",
            naslov: "Napaka na strežniku.",
            eposta: "Napaka na strežniku.",
            telefonska:"000-000-000",
            datum_ustanovitve: "1999-01-01",
            ime:"Napaka na strežniku.",
            podrocje:"Napaka na strežniku.",
            imepodrocje:"Napaka na strežniku.",
            velikost: "0",
            epostapotrjena:true
        },
        pagedata: {
            vrste:[{idvrste: 0,vrsta: "0"}],
            velikosti:[{idvelikosti:0,velikost:"0"}]
        }
    }

    connection.query("SELECT idpodjetja FROM podjetje WHERE idpodjetja = ?",[request.session.podjetjeid],function (err,results,fields) {
        if (err) response.render("napaka.ejs",{napake:["Napaka na strežniku."]})
        else if (results.length == 0) response.render("napaka.ejs",{napake:["Administrator je dokončno odstranil vaš račun."]})
        else connection.query('SELECT admin_pojasnilo,odgovor_podjetja,opozorjen,podjetje.idpodjetja,naziv,vrstepodjetji.ime,naslov,eposta,telefonska,velikostipodjetji.velikost,datum_ustanovitve,podrocje,imepodrocja,epostapotrjena FROM podjetje LEFT JOIN podrocjapodjetji ON podjetje.podrocje = podrocjapodjetji.idpodrocja LEFT JOIN vrstepodjetji ON vrstepodjetji.idvrste = podjetje.idvrste LEFT JOIN velikostipodjetji ON velikostipodjetji.idvelikosti = podjetje.velikost WHERE podjetje.idpodjetja = ?;',[request.session.podjetjeid],function(err,results,fields) {
        console.log(err);
        if (err) response.render("napaka",{napake:["Napaka na strežniku."]})
        else if (results.length == 0) response.render('napaka.ejs',{napake:['Administrator je dokončno odstranil vaš račun.']})
        else {
            data.userdata = results[0];
            data.userdata.datum_ustanovitve = moment(results[0].datum_ustanovitve).format('yyyy-MM-DD');
            connection.query('SELECT * FROM vrstepodjetji;',[],function(err,results,fields) {
                console.log(err);
                if (err) response.render("napaka",{napake:["Napaka na strežniku."]})
                else {
                data.pagedata.vrste = results;
                connection.query('SELECT * FROM velikostipodjetji;',[],function(err,results,fields) {
                console.log(err);
                if (err) response.render("napaka",{napake:["Napaka na strežniku."]})
                else {
                    if (err) response.render("napaka",{napake:["Napaka na strežniku."]})
                    else {
                    data.pagedata.velikosti = results;
                    response.render("./podjetja/nastavitve.ejs",data);
                    }
                }
                });
                }
            })
        }
    });});}
    else response.render("napaka.ejs",{napake:["Napaka pri prijavi, poskusite znova."]})
})

router.get("/geslo",function(request,response) {
	response.render('./podjetja/geslo.ejs',{napake:[]});
});

module.exports = router;