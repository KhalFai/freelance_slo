const express = require('express')
const router = express.Router();

router.post('/izbrisi-spretnost',function(request,response) {
	let connection = request.app.get('connection');
	idspretnosti = request.body.idspretnosti;
	connection.query("SELECT idspretnosti FROM delavci_has_spretnosti WHERE idspretnosti = ? AND iddelavca = ?;",[idspretnosti,request.session.userid],function(err,results,fields) { 
	if (err) {response.send({uspelo:false});}
	else if (results == undefined || results.length == 0) response.send({uspelo:"napacna-vrednost"});
	else {
	connection.query("DELETE FROM delavci_has_spretnosti WHERE idspretnosti = ? AND iddelavca = ?;",[idspretnosti,request.session.userid],function(err,results,fields) { 
		if (err) {response.send({uspelo:false});}
		else response.send({uspelo:true});
	});
	}
	});
});

router.post('/dodaj-spretnost',function(request,response) {
	let connection = request.app.get('connection');
	idspretnosti = request.body.idspretnosti;
	connection.query("SELECT idspretnosti FROM delavci_has_spretnosti WHERE iddelavca = ? AND idspretnosti=?;",[request.session.userid,idspretnosti],function(err,results,fields) { 
	if (err) response.send({uspelo:false});
	else if (results.length > 0) response.send({uspelo:"duplikat"});
	else connection.query("INSERT INTO delavci_has_spretnosti VALUES(?,?);",[request.session.userid,idspretnosti],function(err,results,fields) { 
		if (err) {response.send({uspelo:false});}
		else response.send({uspelo:true});
	});
	});
});

router.post('/isci-spretnost',function(request,response) {
	let connection = request.app.get('connection');
	let iskanaspretnost = request.body.iskanaspretnost+'%';
	connection.query("SELECT naziv,idspretnosti FROM spretnosti WHERE naziv LIKE ? LIMIT 10;",[iskanaspretnost],function(err,results,fields) { 
		if (err) {response.send({uspelo:false});}
		else response.send({uspelo:results});
	});
});

router.post('/izbrisi-jezik',function(request,response) {
	let connection = request.app.get('connection');
	idjezika = request.body.idjezika;
	connection.query("SELECT idjezika FROM delavci_has_jezik WHERE idjezika = ? AND iddelavca = ?;",[idjezika,request.session.userid],function(err,results,fields) { 
	if (err) {response.send({uspelo:false});}
	else if (results == undefined || results.length == 0) response.send({uspelo:"napacna-vrednost"});
	else {
	connection.query("DELETE FROM delavci_has_jezik WHERE idjezika = ? AND iddelavca = ?;",[idjezika,request.session.userid],function(err,results,fields) { 
		if (err) {response.send({uspelo:false});}
		else response.send({uspelo:true});
	});
	}
	});
});

router.post('/dodaj-jezik',function(request,response) {
	let connection = request.app.get('connection');
	idjezika = request.body.idjezika;
	connection.query("SELECT idjezika FROM delavci_has_jezik WHERE iddelavca = ? AND idjezika=?;",[request.session.userid,idjezika],function(err,results,fields) { 
	if (err) {response.send({uspelo:false});}
	else if (results.length > 0) response.send({uspelo:"duplikat"});
	else connection.query("INSERT INTO delavci_has_jezik VALUES(?,?);",[request.session.userid,idjezika],function(err,results,fields) { 
		if (err) response.send({uspelo:false});
		else response.send({uspelo:true});
	});
	});
});

router.post('/isci-jezik',function(request,response) {
	let connection = request.app.get('connection');
	let iskanjezik = request.body.iskanjezik+'%';
	connection.query("SELECT naziv,idjezika FROM jeziki WHERE naziv LIKE ? LIMIT 10;",[iskanjezik],function(err,results,fields) { 
		if (err) {response.send({uspelo:false});}
		else response.send({uspelo:results});
	});
});


router.post('/dodaj-izobrazbo',function(request,response) {
	let connection = request.app.get('connection');
	if (request.body.zacetek > Date.now()) response.send("zacetek-narobe");
	else if (Date.parse(request.body.konec) < Date.parse(request.body.zacetek)) response.send("zacetek-manjsi");
	else if (!/^[-1-9a-zžščćđA-ZŽŠĐČĆ ,.:;]+$/.test(request.body.naziv) && !/^[-1-9a-zžščćđA-ZŽŠĐČĆ ,.:;]+$/.test(request.body.ustanova)) response.send("samo-crke");
	else if (request.body.opis.length > 500) response.send('opis-predolg')
	else connection.query("SELECT idnivoja FROM nivojiizobrazbe WHERE idnivoja = ?",[request.body.nivoIzobrazbe],function(err,results,fields) {
	if (results.length == 0 || results.length == undefined) response.send({uspelo:"napacna-vrednost"});
	else {
		connection.query("SELECT COUNT(idizobrazbe) as stetje FROM izobrazba WHERE iddelavca = ?",[request.session.userid],function(err,results,fields) {
		if (results[0].stetje < 10) {
		connection.query("INSERT INTO izobrazba(iddelavca,naziv,ustanova,idnivoja,datumzacetka,datumkonca,opis) VALUES (?,?,?,?,?,?,?);",[request.session.userid,request.body.naziv,request.body.ustanova,request.body.nivoIzobrazbe,request.body.zacetek,request.body.konec,request.body.opis],function(err,results,fields) { 
		if (err) {response.send({uspelo:false});}
		else {
		connection.query("SELECT MAX(idizobrazbe) as stetje FROM izobrazba WHERE iddelavca = ?",[request.session.userid],function(err,results,fields) {

			if (err) {response.send({uspelo:false});}
			else response.send({uspelo:true,vstavljenid:results[0].stetje});
			
			});
		}
		});
		}
		else response.send({uspelo:"prevec-izobrazb"});
	});}
	});
});

router.post('/izbrisi-izobrazbo',function(request,response) {
	let connection = request.app.get('connection');
	connection.query("SELECT idizobrazbe FROM izobrazba WHERE iddelavca = ?;",[request.session.userid],function(err,results,fields) {
	if (err ||results.length < 1) response.send({uspelo:false})
	else{
	connection.query("DELETE FROM izobrazba WHERE idizobrazbe = ? AND iddelavca = ?;",[request.body.idizobrazbe,request.session.userid],function(err,results,fields){
		if (err) response.send({uspelo:false})
		else {
			response.send({uspelo:true});
		}
	});
	}
	});
});


router.post('/dodaj-izkusnjo',function(request,response) {
	let connection = request.app.get('connection');

    if (request.body.datumzacetka > Date.now()) response.send({uspelo:"zacetek-narobe"})

    else if (Date.parse(request.body.datumzacetka) > Date.parse(request.body.datumkonca)) response.send({uspelo:"zacetek-konec"})

    else if (
        !/^[1-9a-zžščćđA-ZŽŠĐČĆ. -,:;]+$/.test(request.body.nazivpodjetja) &&
        !/^[1-9a-zžščćđA-ZŽŠĐČĆ. -,:;]+$/.test(request.body.imemesta)
    ) response.send({uspelo:"napacne-crke"});

    else {
    connection.query("SELECT COUNT(iddelovneizkusnje) as stetje FROM delovneizkusnje WHERE iddelavca = ?",[request.session.userid],function(err,results,fields) {
    if (results[0].stetje < 20) {
    connection.query("INSERT INTO delovneizkusnje(iddelavca,nazivpodjetja,imemesta,datumzacetka,datumkonca,opisdela) VALUES (?,?,?,?,?,?);",[request.session.userid,request.body.nazivpodjetja,request.body.imemesta,request.body.datumzacetka,request.body.datumkonca,request.body.opisdela],function(err,results,fields) { 
    if (err) {response.send({uspelo:false});}
    else {
    connection.query("SELECT MAX(iddelovneizkusnje) as zadnjiid FROM delovneizkusnje WHERE iddelavca = ?",[request.session.userid],function(err,results,fields) {

        if (err) {response.send({uspelo:false});}
        else response.send({uspelo:true,vstavljenid:results[0].zadnjiid});
        
        });
    }
});}
else response.send({uspelo:"prevec-izkusenj"});
});
}
})

router.post('/izbrisi-izkusnjo',function(request,response) {
	let connection = request.app.get('connection');
	connection.query("SELECT iddelovneizkusnje FROM delovneizkusnje WHERE iddelavca = ?;",[request.session.userid],function(err,results,fields) {
		if (err ||results.length < 1) response.send({uspelo:false})
		else{
		connection.query("DELETE FROM delovneizkusnje WHERE iddelovneizkusnje = ? AND iddelavca = ?;",[request.body.idizkusnje,request.session.userid],function(err,results,fields){
			if (err) response.send({uspelo:false})
			else {
				response.send({uspelo:true});
			}
		});
		}
		});
})


module.exports = router;