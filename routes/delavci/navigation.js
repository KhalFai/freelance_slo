const express = require('express')
const router = express.Router();
const moment = require('moment');

//	-- ROUTANJE PREK STRANI: --
router.get('/login-register', function(request,response) {
	response.render("./delavci/login-register.ejs",{napake:[]});
})

router.get('/feed', function(request,response) {
	let connection = request.app.get('connection');

	data = {
		trenutnadela:[],
		pagedata: {
			nivojiizobrazbe: [],
			trajanja: [],
			delovniki: [],
			vrste_place: [],
			page:0
		}
	};

	let stranvalue = request.query.page;
	console.log(stranvalue);

	if (stranvalue == undefined || !/^[0-9]+$/.test(stranvalue)) stranvalue=1; 

	data.pagedata.page = stranvalue;

	if (request.session.userid!=undefined) {
		connection.query("SELECT iddelavca FROM delavci WHERE iddelavca = ?",[request.session.userid],function (err,results,fields) {
			if (err) response.render("napaka.ejs",{napake:["Napaka na strežniku."]})
			else if (results.length == 0) response.render("napaka.ejs",{napake:["Administrator je dokončno odstranil vaš račun."]})
            else connection.query("SELECT * FROM nivojiizobrazbe;",[],function(err,results,fields) {
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
							connection.query("SELECT dela.idpodjetja, dela.iddela, dela.naziv, dela.opis, placa, nivojiizobrazbe.naziv AS nivoizobrazbe, podrocjapodjetji.imepodrocja, trajanje.naziv AS nazivtrajanja, delovnik.naziv AS nazivdelovnika, vrste_plac.naziv AS nazivplace, dela_opozorila.besedilo_prijave,admin_pojasnilo, dela.opozorjen, GROUP_CONCAT(DISTINCT spretnosti.naziv SEPARATOR ', ') AS spretnosti FROM dela INNER JOIN podjetje ON podjetje.idpodjetja = dela.idpodjetja LEFT JOIN podjetja_opozorila ON podjetja_opozorila.idpodjetja = dela.idpodjetja LEFT JOIN dela_has_spretnosti ON dela.iddela = dela_has_spretnosti.iddela INNER JOIN spretnosti ON dela_has_spretnosti.idspretnosti = spretnosti.idspretnosti INNER JOIN izobrazba ON izobrazba.idnivoja = dela.idizobrazbe INNER JOIN nivojiizobrazbe ON nivojiizobrazbe.idnivoja = dela.idizobrazbe INNER JOIN podrocjapodjetji ON podrocjapodjetji.idpodrocja = dela.idpodrocja INNER JOIN trajanje ON trajanje.idtrajanja = dela.idtrajanja INNER JOIN delovnik ON delovnik.iddelovnika = dela.iddelovnika INNER JOIN vrste_plac ON vrste_plac.idplace = dela.idplace LEFT JOIN dela_prijave ON dela.iddela = dela_prijave.iddela LEFT JOIN dela_opozorila ON dela_opozorila.iddela = dela.iddela WHERE dela.iddela IN (SELECT iddela FROM dela_has_spretnosti INNER JOIN delavci_has_spretnosti ON dela_has_spretnosti.idspretnosti = delavci_has_spretnosti.idspretnosti WHERE iddelavca = ?) AND (dela_prijave.iddelavca != ? OR dela_prijave.iddelavca IS NULL)  AND (dela_opozorila.iddelavca != ? OR dela_opozorila.iddelavca IS NULL) AND (dela.opozorjen != 1 OR dela.opozorjen IS NULL) AND (podjetje.opozorjen IS NULL) AND (podjetja_opozorila.iddelavca != ? OR podjetja_opozorila.iddelavca IS NULL) GROUP BY dela.iddela ORDER BY dela.iddela DESC LIMIT 20 OFFSET ?;",[request.session.userid,request.session.userid,request.session.userid,request.session.userid,(stranvalue-1) * 20],function(err,results,fields) {
								console.log(err);
								if (err) response.render('./napaka',{napake:["Napaka na strežniku, poskusite znova."]});
								else {
									data.trenutnadela = results;
									response.render('./delavci/feed.ejs',data);
								}
							});
                            });
                    });
                });
            });
		});
            }
	else {
		response.render('./napaka',{napake:["Napaka pri prijavi, poskusite znova."]});
	}
});

router.get('/nastavitve',function(request,response){
	let connection = request.app.get('connection');
	let renderdata = {
		userdata: {
		id:request.session.userid,
		ime:"Ime",
		priimek:"Priimek",
		epostapotrjena:false,
		eposta:"test.test@test.si",
		kratekopis:'Kratek opis delavca...',
		datumrojstva:'0000-00-00',
		telefon: '+(123) - 456-78-90',
		jezikiUporabnika:['napaka na strežniku'],
		delovneIzkusnjeUporabnika:['napaka na strežniku'],
		izobrazbaUporabnika: [],
		//adminstuff
		opozorjen: false,
		besedilo_prijave: "Napaka na strežniku.",
		pojasnilo_admina: "Napaka na strežniku",
		odgovor_delavca: "Napaka na strežniku"
		},
		
		pagedata: {
			spretnosti:['Napaka na strežniku'],
			jeziki:['Napak na strežniku'],
			nivoizobrazbe:['Napaka na strežbiku']
		}
	};

	if (request.session.userid != undefined)
	connection.query("SELECT admin_pojasnilo,odgovor_delavca,opozorjen,ime,priimek,epostapotrjena,kratekopis,datumrojstva,telefon,eposta FROM delavci WHERE delavci.iddelavca = ?",[request.session.userid],function(err,results,fields) {
			console.log(err);
			if (err) response.render("napaka.ejs",{napake:['Napaka pri prijavi, poskusite znova.']});
			else if (results.length == 0) response.render('napaka.ejs',{napake:['Administrator je dokončno odstranil vaš račun.']})
			else {
				renderdata.userdata.ime = results[0].ime;
				renderdata.userdata.priimek = results[0].priimek;
				renderdata.userdata.epostapotrjena = results[0].epostapotrjena;
				renderdata.userdata.kratekopis = results[0].kratekopis;
				renderdata.userdata.datumrojstva = moment(results[0].datumrojstva).format('yyyy-MM-DD');
				renderdata.userdata.telefon = results[0].telefon;
				renderdata.userdata.eposta = results[0].eposta;

				renderdata.userdata.opozorjen = results[0].opozorjen;
				renderdata.userdata.besedilo_prijave = results[0].besedilo_prijave;
				renderdata.userdata.admin_pojasnilo = results[0].admin_pojasnilo;
				renderdata.userdata.odgovor_delavca = results[0].odgovor_delavca;

						//get nivoji izobrazbe
						connection.query("SELECT * FROM nivojiizobrazbe",[],function(err,results,fields) {
							if (err) response.render("napaka.ejs",{napake:['Napaka na strežniku.']});
							else renderdata.pagedata.nivoizobrazbe = results;
							//get spretnosti delavca
							connection.query("SELECT * FROM spretnosti INNER JOIN delavci_has_spretnosti ON delavci_has_spretnosti.idspretnosti = spretnosti.idspretnosti WHERE iddelavca = ?;",[request.session.userid],function(err,results,fields) { 
								renderdata.userdata.spretnostiUporabnika = results;
								if (err) response.render("napaka.ejs",{napake:['Napaka na strežniku.']});
								else {
									//get jeziki
									connection.query("SELECT * FROM jeziki INNER JOIN delavci_has_jezik ON jeziki.idjezika = delavci_has_jezik.idjezika WHERE iddelavca = ?",[request.session.userid],function(err,results,fields) { 
										if (err) response.render("napaka.ejs",{napake:['Napaka na strežniku.']});
										else {
											renderdata.userdata.jezikiUporabnika = results;
											//get delovne izkusnje
											connection.query("SELECT * FROM delovneizkusnje WHERE iddelavca = ?;",[request.session.userid],function(err,results,fields) { 
												if (err) response.render("napaka.ejs",{napake:['Napaka na strežniku.']});
												else {
													for (let i=0;i<results.length;i++) {
														results[i].datumzacetka = moment(results[i].datumzacetka).format('yyyy-MM-DD');
														results[i].datumkonca = moment(results[i].datumkonca).format('yyyy-MM-DD');
													}

													renderdata.userdata.delovneIzkusnjeUporabnika = results;
													
													connection.query("SELECT idizobrazbe,izobrazba.naziv AS nazivIzobrazbe,ustanova,datumzacetka,datumkonca,opis,nivojiizobrazbe.naziv AS nivoizobrazbe FROM izobrazba INNER JOIN nivojiizobrazbe ON nivojiizobrazbe.idnivoja = izobrazba.idnivoja WHERE iddelavca = ?;",[request.session.userid],function(err,results,fields) { 
														if (err) response.render("napaka",{napake:["Napaka na strežniku."]});
														else {
													for (let i=0;i<results.length;i++) {
														results[i].datumzacetka = moment(results[i].datumzacetka).format('yyyy-MM-DD');
														results[i].datumkonca = moment(results[i].datumkonca).format('yyyy-MM-DD');
													}
													renderdata.userdata.izobrazbaUporabnika = results;
													response.render("./delavci/nastavitve.ejs",renderdata);
													}
												});
												}
											});
										}
										});
									}
							});
						});
			}
	});
	else {
		response.render("napaka.ejs",{napake:['Napaka pri prijavi, poskusite znova.']})
	}
})

router.get("/geslo",function(request,response) {
	response.render('./delavci/geslo.ejs',{napake:[]})
});

module.exports = router;