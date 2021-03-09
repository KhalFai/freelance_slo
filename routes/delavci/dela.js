const express = require('express')
const router = express.Router();
const moment = require('moment');

router.post('/poslji-prijavo',function(request,response) { 
    let connection = request.app.get('connection');
    //besedilo prijave
    if (request.body.tekstprijave != undefined && request.body.tekstprijave.length > 20 && !/^[a-zžščćđA-ZŽŠĐČĆ0-9 .,:;-]+$/.test(request.body.tekstprijave)) response.send({uspelo:'prijava-narobe'})
    else connection.query("SELECT iddelavca FROM delavci WHERE iddelavca = ? AND opozorjen = 1",[request.session.userid],function(err,results,fields) {
    if (err) response.send({uspelo:false});
    else if (results.length > 0) response.send({uspelo:"opozorjen"}) 
    else connection.query("SELECT iddela FROM dela WHERE iddela = ?;", [request.body.iddela], function(err,results,fields) {
        if (err) response.send({uspelo:false});
        if (results.length < 1) response.send({uspelo:"iddela-ni"});
        else {
        //iddelavca
        connection.query("SELECT iddela FROM dela_prijave WHERE iddela = ? AND iddelavca = ?;", [request.body.iddela,request.session.userid], function(err,results,fields) {
            console.log(err);
            if (err) response.send({uspelo:false});
            if (results.length < 1) 
                connection.query("INSERT INTO dela_prijave (iddelavca,iddela,opis,sprejet) VALUES (?,?,?,NULL);", [request.session.userid,request.body.iddela,request.body.tekstprijave], function(err,results,fields) {
                console.log(err);
                if (err) response.send({uspelo:false});
                else response.send({uspelo:true});
            });
            else response.send({uspelo:"dvojna-prijava"});
        });
        }
        });
    })

});

router.post('/isci-dela',function(request,response) {
    let connection = request.app.get('connection');

    let sanirane_spretnosti = new Set(request.body.spretnosti);
    sanirane_spretnosti = [...sanirane_spretnosti];
    console.log(sanirane_spretnosti);
    //naziv
    if (!/^[a-zžščćđA-ZŽŠĐČĆ0-9 .,:;-]+$/.test(request.body.naziv) && request.body.naziv.length > 0) response.send({uspelo:"naziv-narobe"});
    else {
    if (request.body.naziv == '') request.body.naziv  = '%';
    //trajnaje
    connection.query("SELECT idtrajanja FROM trajanje WHERE idtrajanja = ?",[request.body.trajanje],function(err,results,fields) {
        if (err) response.send({uspelo:false});
        else if (request.body.trajanje != '%' && results.length < 1) response.send({uspelo:"trajanje-narobe"})
        else {
        //delovnik
        connection.query("SELECT iddelovnika FROM delovnik WHERE iddelovnika = ?",[request.body.delovnik],function(err,results,fields) {
            //delovnik je v bazi
            console.log(err);
            if (err) response.send({uspelo:false})
            else if (results.length < 1 && request.body.delovnik != '%') response.send({uspelo:"delovnik-narobe"})
            else {
            //vrstaplace
            connection.query("SELECT idplace FROM vrste_plac WHERE idplace = ?",[request.body.vrstaplace],function(err,results,fields) {
                console.log(err);
                if (err) response.send({uspelo:false})
                else if (results.length < 1 && request.body.vrstaplace != '%') response.send({uspelo:"vrsta-place-narobe"})
                else {
                    //podrocje
                    connection.query("SELECT idpodrocja FROM podrocjapodjetji WHERE imepodrocja = ?",[request.body.podrocje],function(err,results,fields) {
                        console.log(err);
                        if (err) response.send({uspelo:false})
                        else {

                            if (request.body.minplaca == "" || request.body.minplaca == undefined) request.body.minplaca = 0;
                            if (request.body.maxplaca == "" || request.body.maxplaca == undefined) request.body.maxplaca = null;

                            if (results.length < 1) request.body.podrocje = '%';
                            if (sanirane_spretnosti.length > 0)
                            connection.query("SELECT IF (COUNT(*) > ?, true, false) AS pravilnost FROM spretnosti WHERE naziv IN (?);",[sanirane_spretnosti.length-1,sanirane_spretnosti],function(err,results,fields) {
                                console.log(err);
                                if (err) {response.send({uspelo:false});}
                                if (results[0].pravilnost == false) response.send({uspelo:'spretnost-narobe'});
                                else if(results[0].pravilnost == true) {
                                    connection.query("SELECT DISTINCT dela.idpodjetja, dela.opozorjen, dela.iddela, dela.naziv, dela.opis, placa, nivojiizobrazbe.naziv AS nivoizobrazbe, podrocjapodjetji.imepodrocja, trajanje.naziv AS nazivtrajanja, delovnik.naziv AS nazivdelovnika, vrste_plac.naziv AS nazivplace, GROUP_CONCAT(DISTINCT spretnosti.naziv SEPARATOR ', ') AS spretnosti FROM dela LEFT JOIN dela_opozorila ON dela.iddela = dela_opozorila.iddela INNER JOIN podjetje ON podjetje.idpodjetja = dela.idpodjetja LEFT JOIN dela_has_spretnosti ON dela.iddela = dela_has_spretnosti.iddela INNER JOIN spretnosti ON dela_has_spretnosti.idspretnosti = spretnosti.idspretnosti INNER JOIN izobrazba ON izobrazba.idnivoja = dela.idizobrazbe INNER JOIN nivojiizobrazbe ON nivojiizobrazbe.idnivoja = dela.idizobrazbe AND izobrazba.idnivoja = nivojiizobrazbe.idnivoja INNER JOIN podrocjapodjetji ON podrocjapodjetji.idpodrocja = dela.idpodrocja INNER JOIN trajanje ON trajanje.idtrajanja = dela.idtrajanja INNER JOIN delovnik ON delovnik.iddelovnika = dela.iddelovnika INNER JOIN vrste_plac ON vrste_plac.idplace = dela.idplace LEFT JOIN dela_prijave ON dela.iddela = dela_prijave.iddela LEFT JOIN podjetja_opozorila ON podjetja_opozorila.idpodjetja = dela.idpodjetja WHERE (dela_opozorila.iddelavca != ? OR dela_opozorila.iddelavca IS NULL) AND dela.naziv LIKE ? AND (podjetja_opozorila.iddelavca != ? OR podjetja_opozorila.iddelavca IS NULL) AND dela.idtrajanja LIKE ? AND dela.iddelovnika LIKE ? AND dela.idplace LIKE ? AND podrocjapodjetji.imepodrocja LIKE ? AND (dela_prijave.iddelavca != ? OR dela_prijave.iddelavca IS NULL) AND dela.iddela IN (SELECT iddela FROM dela_has_spretnosti INNER JOIN spretnosti ON spretnosti.idspretnosti = dela_has_spretnosti.idspretnosti WHERE naziv IN (?)) AND (dela.opozorjen != 1 OR dela.opozorjen IS NULL) AND (podjetje.opozorjen IS NULL) AND (dela.placa BETWEEN IFNULL(?, 0) AND IFNULL(?, ~ 0)) GROUP BY iddela ORDER BY dela.iddela ASC LIMIT 20;",[request.session.userid,'%'+request.body.naziv+'%',request.session.userid,request.body.trajanje,request.body.delovnik,request.body.vrstaplace,request.body.podrocje,request.session.userid,sanirane_spretnosti,request.body.minplaca,request.body.maxplaca],function(err,results,fields) {
                                        console.log(err);
                                        if (err) response.send({uspelo:false})
                                        else response.send({uspelo:true,dela:results});
                                    });
                                }
                            });
                            else {
                                connection.query("SELECT DISTINCT dela.idpodjetja,dela.opozorjen,dela.iddela, dela.naziv, dela.opis, placa, nivojiizobrazbe.naziv AS nivoizobrazbe, podrocjapodjetji.imepodrocja, trajanje.naziv AS nazivtrajanja, delovnik.naziv AS nazivdelovnika, vrste_plac.naziv AS nazivplace, GROUP_CONCAT(DISTINCT spretnosti.naziv SEPARATOR ', ') AS spretnosti FROM dela LEFT JOIN dela_opozorila ON dela.iddela = dela_opozorila.iddela INNER JOIN podjetje ON podjetje.idpodjetja = dela.idpodjetja LEFT JOIN dela_has_spretnosti ON dela.iddela = dela_has_spretnosti.iddela LEFT JOIN spretnosti ON dela_has_spretnosti.idspretnosti = spretnosti.idspretnosti INNER JOIN izobrazba ON izobrazba.idnivoja = dela.idizobrazbe INNER JOIN nivojiizobrazbe ON nivojiizobrazbe.idnivoja = dela.idizobrazbe AND izobrazba.idnivoja = nivojiizobrazbe.idnivoja INNER JOIN podrocjapodjetji ON podrocjapodjetji.idpodrocja = dela.idpodrocja INNER JOIN trajanje ON trajanje.idtrajanja = dela.idtrajanja INNER JOIN delovnik ON delovnik.iddelovnika = dela.iddelovnika INNER JOIN vrste_plac ON vrste_plac.idplace = dela.idplace LEFT JOIN dela_prijave ON dela.iddela = dela_prijave.iddela LEFT JOIN podjetja_opozorila ON podjetja_opozorila.idpodjetja = dela.idpodjetja WHERE (dela_opozorila.iddelavca != ? OR dela_opozorila.iddelavca IS NULL) AND dela.naziv LIKE ? AND (podjetja_opozorila.iddelavca  != ? OR podjetja_opozorila.iddelavca IS NULL) AND dela.idtrajanja LIKE ? AND dela.iddelovnika LIKE ? AND dela.idplace LIKE ? AND podrocjapodjetji.imepodrocja LIKE ? AND (dela_prijave.iddelavca != ? OR dela_prijave.iddelavca IS NULL) AND (dela.opozorjen != 1 OR dela.opozorjen IS NULL) AND (podjetje.opozorjen IS NULL) AND (dela.placa BETWEEN ifnull(?,0) AND ifnull(?,~0)) GROUP BY dela.iddela ORDER BY dela.iddela ASC LIMIT 20;",[request.session.userid,'%'+request.body.naziv+'%',request.session.userid,request.body.trajanje,request.body.delovnik,request.body.vrstaplace,request.body.podrocje,request.session.userid,request.body.minplaca,request.body.maxplaca],function(err,results,fields) {
                                    console.log(results);
                                    console.log(err);
                                    if (err) response.send({uspelo:false})
                                    else response.send({uspelo:true,dela:results});
                                });
                            }
                    }});
                }});
            }});
        }});
    }
});

router.get('/sprejet-dela',function(request,response) {
    let connection = request.app.get('connection');
    if (request.session.userid == undefined) response.send({uspelo:"seje-ni"})
    connection.query("SELECT iddelavca FROM delavci WHERE iddelavca = ? AND opozorjen = 1",[request.session.userid],function(err,results,fields) {
        if (err) response.send({uspelo:false});
        else if (results.length > 0) response.send({uspelo:"opozorjen"}) 
        else connection.query("SELECT podjetje.idpodjetja,dela.iddela, dela.naziv, dela.opis, placa, nivojiizobrazbe.naziv AS nivoizobrazbe, podrocjapodjetji.imepodrocja, trajanje.naziv AS nazivtrajanja, delovnik.naziv AS nazivdelovnika, vrste_plac.naziv AS nazivplace, podjetje.eposta, podjetje.telefonska, GROUP_CONCAT(DISTINCT spretnosti.naziv SEPARATOR ', ') AS spretnosti FROM dela LEFT JOIN dela_has_spretnosti ON dela.iddela = dela_has_spretnosti.iddela LEFT JOIN spretnosti ON dela_has_spretnosti.idspretnosti = spretnosti.idspretnosti INNER JOIN izobrazba ON izobrazba.idnivoja = dela.idizobrazbe INNER JOIN nivojiizobrazbe ON nivojiizobrazbe.idnivoja = dela.idizobrazbe AND izobrazba.idnivoja = nivojiizobrazbe.idnivoja INNER JOIN podrocjapodjetji ON podrocjapodjetji.idpodrocja = dela.idpodrocja INNER JOIN trajanje ON trajanje.idtrajanja = dela.idtrajanja INNER JOIN delovnik ON delovnik.iddelovnika = dela.iddelovnika INNER JOIN vrste_plac ON vrste_plac.idplace = dela.idplace LEFT JOIN dela_prijave ON dela.iddela = dela_prijave.iddela INNER JOIN podjetje ON podjetje.idpodjetja = dela.idpodjetja WHERE dela_prijave.iddelavca = ? AND dela_prijave.sprejet = 1 GROUP BY dela.iddela ORDER BY dela.iddela DESC;",[request.session.userid],function(err,results,fields) {
        if (err) response.send({uspelo:false});
        else response.send({uspelo:true,dela:results})
    });
    });
});

router.get('/podatki-podjetje/:idpodjetja',function(request,response) {
    let connection = request.app.get('connection');
    connection.query("SELECT podjetje.idpodjetja,vrstepodjetji.ime AS vrstapodjetja, naziv,naslov,eposta,telefonska,datum_ustanovitve,imepodrocja,velikostipodjetji.velikost AS velikost FROM freelance_slo.podjetje LEFT JOIN vrstepodjetji ON podjetje.idvrste = vrstepodjetji.idvrste LEFT JOIN podrocjapodjetji ON podrocjapodjetji.idpodrocja = podjetje.podrocje LEFT JOIN velikostipodjetji ON velikostipodjetji.idvelikosti = podjetje.velikost WHERE idpodjetja = ?;",[request.params.idpodjetja],function(err,results,fields) {
        console.log(results);
        if (err) response.send({uspelo:false});
        else if (results.length < 1) response.send({uspelo:"podjetja-ni"});
        else {
            if (results[0].datum_ustanovitve != null) results[0].datum_ustanovitve = moment(results[0].datum_ustanovitve).format('yyyy-MM-DD');
            response.send({uspelo:true,podjetje:results[0]});
        }
    });
});

router.post('/prijavi-neprimerno',function(request,response) {
    let connection = request.app.get('connection');

    if (!/^[a-zžščćđA-ZŽŠĐČĆ0-9 .,-;:?!*]+$/.test(request.body.prijava_tekst)) response.send({response:"tekst-narobe"}) 
    else connection.query("SELECT iddelavca FROM delavci WHERE iddelavca = ? AND opozorjen = 1",[request.session.userid],function(err,results,fields) {
        console.log(err);
        if (err) response.send({uspelo:false});
        else if (results.length > 0) response.send({uspelo:"opozorjen"}) 
        else connection.query("SELECT iddela FROM dela WHERE iddela = ?",[request.body.iddela],function(err,results,fields) {
        if (err) response.send({uspelo:false})
        else if (results.length < 1) response.send({uspelo:"dela-ni"})
        else connection.query("INSERT INTO dela_opozorila(iddelavca,iddela,besedilo_prijave) VALUES (?,?,?)",[request.session.userid,request.body.iddela,request.body.prijava_tekst],function(err,results,fields) {
            console.log(err);
            if (err) response.send({uspelo:false});
            else response.send({uspelo:true});
        });
    });
    });
});

router.post('/prijavi-podjetje',function(request,response) {
    let connection = request.app.get('connection');

    if (request.session.userid == undefined) response.send({uspelo:"seje-ni"})
    //validiraj tekst
    if (! /^[a-zžščćđA-ZŽŠĐČĆ0-9 .,-:;_]+$/.test(request.body.pojasnilo)) response.send({uspelo:"besedilo-narobe"});
    //če je delavec
    connection.query("SELECT iddelavca FROM delavci WHERE iddelavca = ? AND opozorjen = 1",[request.session.userid],function(err,results,fields) {
        if (err) response.send({uspelo:false});
        else if (results.length > 0) response.send({uspelo:"opozorjen"}) 
        else connection.query("SELECT idpodjetja FROM podjetje WHERE idpodjetja = ?",[request.body.idpodjetja],function (err,results,fields) {
      if (err) response.send({uspelo:false});
      else if (results.length < 1) response.send({uspelo:"podjetja-ni"})
      else connection.query("SELECT idpodjetja FROM podjetja_opozorila WHERE idpodjetja = ? AND iddelavca = ?",[request.body.idpodjetja,request.session.userid],function(err,results,fields) {
        if (err) response.send({uspelo:false})
        else if (results.length > 0) response.send({uspelo:"ze-prijavljen"})
        else  connection.query("INSERT INTO podjetja_opozorila(idpodjetja,besedilo_prijave,iddelavca) VALUES (?,?,?)",[request.body.idpodjetja,request.body.pojasnilo,request.session.userid],function (err,results,fields) {
            if (err) response.send({uspelo:false})
            else response.send({uspelo:true});
        });
      }) 
    })
    });
});

module.exports = router;