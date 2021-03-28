const express = require('express')
const router = express.Router();
const moment = require('moment');

router.get('/potrjevanje-admin/',function(request,response) {
    if (request.session.adminid != undefined) {
    let connection = request.app.get('connection');

    let data = {
        pageData: {
            zahteve:[],
            page:0
        }
    }

    let stranvalue = request.query.page;
    if (request.query.page == undefined || request.query.page == 0 || request.query.page == '') stranvalue = 1;
    data.pageData.page = stranvalue;

    connection.query("SELECT idadmin,eposta,geslo,ime,priimek FROM freelance_slo.administratorji WHERE potrjen IS NULL LIMIT 20 OFFSET ?;",[(stranvalue-1) * 20],function (err,results,fields) {
        if (err) response.render("napaka",{napake:['Napaka na strežniku.']})
        else {
        data.pageData.zahteve = results;
        response.render('./admin/potrjevanje-admin.ejs',data);
        }
    })}
    else response.render("napaka",{napake:["Napaka pri prijavi, poskusite znova."]})
});

router.get('/neprimerna-dela',function(request,response) {
    if (request.session.adminid != undefined) {
        let connection = request.app.get('connection');
        let data = {
            pagedata:{
                prijavljenadela:[],
                page:0
            }
        };

        let stranvalue = request.query.page;
        if (stranvalue == undefined || stranvalue == 0 || stranvalue == '') stranvalue = 1;
        data.pagedata.page = stranvalue;

        connection.query(
        `SELECT dela.iddela, dela.naziv, opis, placa, 
        nivojiizobrazbe.naziv AS nivoizobrazbe, podrocjapodjetji.imepodrocja, 
        trajanje.naziv AS nazivtrajanja, delovnik.naziv AS nazivdelovnika, vrste_plac.naziv AS nazivplace,
        besedilo_prijave, pojasnilo_admina, opozorjen, GROUP_CONCAT(spretnosti.naziv SEPARATOR ', ') AS spretnosti 
        FROM dela 
        LEFT JOIN dela_has_spretnosti ON dela.iddela = dela_has_spretnosti.iddela 
        LEFT JOIN spretnosti ON dela_has_spretnosti.idspretnosti = spretnosti.idspretnosti 
        INNER JOIN nivojiizobrazbe nivojiizobrazbe ON nivojiizobrazbe.idnivoja = dela.idizobrazbe
        INNER JOIN podrocjapodjetji ON podrocjapodjetji.idpodrocja = dela.idpodrocja INNER JOIN trajanje ON trajanje.idtrajanja = dela.idtrajanja
        INNER JOIN delovnik ON delovnik.iddelovnika = dela.iddelovnika 
        INNER JOIN vrste_plac ON vrste_plac.idplace = dela.idplace 
        INNER JOIN dela_opozorila ON dela.iddela = dela_opozorila.iddela 
        WHERE dela.opozorjen IS NULL GROUP BY dela.iddela ORDER BY dela.iddela DESC LIMIT 20 OFFSET ?;`
            ,[(stranvalue-1) * 20],function (err,results,fields) {
            if (err) response.render("napaka",{napake:['Napaka na strežniku.']})
            else {
                data.pagedata.prijavljenadela = results;
                let id_dela = [];
                
                for (delo of data.pagedata.prijavljenadela) {
                    id_dela.push(delo.iddela);
                }

                if (id_dela.length == 0) id_dela = [''];

                connection.query(
                `SELECT iddela,dela_opozorila.iddelavca,besedilo_prijave,ime,priimek 
                 FROM dela_opozorila 
                 INNER JOIN delavci ON dela_opozorila.iddelavca = delavci.iddelavca 
                 WHERE iddela IN(?);`
                 ,[id_dela],function(err,results,fields) {
                    if (err) response.render("napaka",{napake:["Napaka na strežniku."]})
                    else {
                    
                    for (let i=0;i < data.pagedata.prijavljenadela.length; i++) {
                        data.pagedata.prijavljenadela[i].prijave = [];

                        for (prijava of results) {
                            if (data.pagedata.prijavljenadela[i].iddela == prijava.iddela) {
                                data.pagedata.prijavljenadela[i].prijave.push(prijava);
                            }
                        }
                    }

                    response.render("./admin/opozorjena-dela",data)
                }
                });
            }
            });
    }
    else response.render("napaka",{napake:["Napaka pri prijavi, poskusite znova."]})
});

router.get('/prijavljeni-delavci',function(request,response) {
    if (request.session.adminid != undefined) {
        let connection = request.app.get('connection');
        let data = {
            pagedata:{
                prijavljenidelavci:[],
                page:1
            }
        };

        let stranvalue = request.query.page;
        if (request.query.page == undefined || request.query.page == 0 || request.query.page == '') stranvalue = 1;
        data.pagedata.page = stranvalue;

        connection.query(
            `SELECT DISTINCT odgovor_delavca,delavci.iddelavca,epostapotrjena,eposta,ime,priimek,datumrojstva,telefon,kratekopis,opozorjen,admin_pojasnilo 
            FROM delavci 
            INNER JOIN delavci_opozorila ON delavci_opozorila.iddelavca = delavci.iddelavca 
            WHERE opozorjen IS NULL OR odgovor_delavca IS NOT NULL ORDER BY delavci.iddelavca LIMIT 20 OFFSET ?;`,[(stranvalue-1) * 20],function (err,results,fields) {
            if (err) response.render("napaka",{napake:['Napaka na strežniku.']})
            else {
            data.pagedata.prijavljenidelavci = results;
            //jeziki
            connection.query(`
            SELECT delavci_has_jezik.iddelavca,naziv 
            FROM freelance_slo.delavci_has_jezik 
            INNER JOIN jeziki ON jeziki.idjezika = delavci_has_jezik.idjezika 
            INNER JOIN delavci_opozorila ON delavci_opozorila.iddelavca = delavci_has_jezik.iddelavca;`
            ,[],function(err,results,fields) {
                if (err) response.render("napaka",{napake:["Napaka na strežniku."]})
                else{ 
                for (let i=0;i<data.pagedata.prijavljenidelavci.length;i++) {
                    data.pagedata.prijavljenidelavci[i].jeziki = [];
                    data.pagedata.prijavljenidelavci[i].datumrojstva = moment(data.pagedata.prijavljenidelavci[i].datumrojstva).format('yyyy-MM-DD');
                    for (let j = 0; j < results.length; j++) {
                        if (data.pagedata.prijavljenidelavci[i].iddelavca == results[j].iddelavca) {
                            data.pagedata.prijavljenidelavci[i].jeziki.push(results[j].naziv);
                        }
                    }
                }
                
                // spretnosti
                connection.query(`
                SELECT DISTINCT delavci_has_spretnosti.iddelavca,naziv 
                FROM delavci_has_spretnosti 
                INNER JOIN spretnosti ON delavci_has_spretnosti.idspretnosti = spretnosti.idspretnosti 
                INNER JOIN delavci_opozorila ON delavci_opozorila.iddelavca = delavci_has_spretnosti.iddelavca;`,[],function(err,results,fields) {
                    if (err) response.render("napaka",{napake:["Napaka na strežniku."]})
                    else{ 
                    for (let i=0;i<data.pagedata.prijavljenidelavci.length;i++) {
                        data.pagedata.prijavljenidelavci[i].spretnosti = [];
                        for (let j = 0; j < results.length; j++) {
                            if (data.pagedata.prijavljenidelavci[i].iddelavca == results[j].iddelavca) {
                                data.pagedata.prijavljenidelavci[i].spretnosti.push(results[j].naziv);
                            }
                        }
                    }
                    //delovne izkusnje
                connection.query(
                    `SELECT delovneizkusnje.iddelavca,nazivpodjetja,imemesta,datumzacetka,datumkonca,opisdela 
                    FROM delovneizkusnje 
                    INNER JOIN delavci_opozorila ON delavci_opozorila.iddelavca = delovneizkusnje.iddelavca;`,[],function(err,results,fields) {
                    if (err) response.render("napaka",{napake:["Napaka na strežniku."]})
                    else {
                        for (let i=0;i<data.pagedata.prijavljenidelavci.length;i++) {
                            data.pagedata.prijavljenidelavci[i].delovne_izkusnje = [];
                            for (let j = 0; j < results.length; j++) {
                                if (data.pagedata.prijavljenidelavci[i].iddelavca == results[j].iddelavca) {
                                    results[j].datumzacetka = moment(results[j].datumzacetka).format('yyyy-MM-DD');
                                    results[j].datumkonca = moment(results[j].datumkonca).format('yyyy-MM-DD');
                                    data.pagedata.prijavljenidelavci[i].delovne_izkusnje.push(results[j]);
                                }
                            }
                        }

                    connection.query(
                    `SELECT DISTINCT izobrazba.iddelavca,izobrazba.naziv,ustanova,opis,nivojiizobrazbe.naziv AS nivoizobrazbe,datumzacetka,datumkonca 
                    FROM izobrazba 
                    INNER JOIN nivojiizobrazbe ON nivojiizobrazbe.idnivoja = izobrazba.idnivoja 
                    INNER JOIN delavci_opozorila ON delavci_opozorila.iddelavca = izobrazba.iddelavca;`,[],function(err,results,fields) {
                    if (err) response.render("napaka",{napake:["Napaka na strežniku."]})
                    else {
                        for (let i=0;i<data.pagedata.prijavljenidelavci.length;i++) {
                            data.pagedata.prijavljenidelavci[i].izobrazba = [];
                            for (let j = 0; j < results.length; j++) {
                                if (data.pagedata.prijavljenidelavci[i].iddelavca == results[j].iddelavca) {
                                    results[j].datumzacetka = moment(results[j].datumzacetka).format('yyyy-MM-DD');
                                    results[j].datumkonca = moment(results[j].datumkonca).format('yyyy-MM-DD');
                                    data.pagedata.prijavljenidelavci[i].izobrazba.push(results[j]);
                                }
                            }
                        }

                        connection.query(
                        `SELECT delavci_opozorila.iddelavca,podjetje.idpodjetja,besedilo_prijave,naziv,vrstepodjetji.ime 
                        FROM freelance_slo.delavci_opozorila 
                        INNER JOIN podjetje ON podjetje.idpodjetja = delavci_opozorila.idpodjetja 
                        INNER JOIN vrstepodjetji ON podjetje.idvrste = vrstepodjetji.idvrste;`
                        ,[],function(err,results,fields) {
                            //send data to page
                            if (err) response.render("napaka",{napake:["Napaka na strežniku."]})
                            else {
                            for (let i=0;i<data.pagedata.prijavljenidelavci.length;i++) {
                                data.pagedata.prijavljenidelavci[i].prijave = [];
                                    for (let j = 0; j < results.length; j++) {
                                        if (data.pagedata.prijavljenidelavci[i].iddelavca == results[j].iddelavca) {
                                            data.pagedata.prijavljenidelavci[i].prijave.push(results[j]);
                                    }
                                }
                            }
                            response.render("./admin/opozorjeni-delavci.ejs",data);
                            }
                        });
                    }});
                }});

                }
                });

                }
            });

            }

            });
    }
    else response.render("napaka",{napake:["Napaka pri prijavi, poskusite znova."]})
});

router.get('/prijavljena-podjetja',function(request,response) {
    if (request.session.adminid != undefined) {
    let connection = request.app.get('connection');

    let data = {
        pagedata: {
            podjetja:[],
            page:0
        }
    }

    let stranvalue = request.query.page;
    if (request.query.page == undefined || request.query.page == 0 || request.query.page == '') stranvalue = 1;
    data.pagedata.page = stranvalue;

    connection.query(
        `SELECT DISTINCT podjetje.idpodjetja,naziv,naslov,eposta,telefonska,datum_ustanovitve,imepodrocja,velikostipodjetji.velikost,odgovor_podjetja,admin_pojasnilo,epostapotrjena 
        FROM podjetje 
        LEFT JOIN velikostipodjetji ON podjetje.velikost = velikostipodjetji.idvelikosti 
        LEFT JOIN podrocjapodjetji ON podjetje.podrocje = podrocjapodjetji.idpodrocja 
        WHERE (opozorjen IS NULL OR odgovor_podjetja IS NOT NULL) 
        AND idpodjetja IN (SELECT idpodjetja FROM podjetja_opozorila) 
        ORDER BY podjetje.idpodjetja 
        LIMIT 20 OFFSET ?;`
        ,[(stranvalue-1) * 20],function(err,results,fields) {
        if (err) response.render("napaka",{napake:["Napaka na strežniku!"]});
        else {
            data.pagedata.podjetja = results;
            connection.query("SELECT DISTINCT * FROM freelance_slo.podjetja_opozorila INNER JOIN delavci ON delavci.iddelavca = podjetja_opozorila.iddelavca;",[],function(err,results,fields) {
                if (err) response.render("napaka",{napake:["Napaka na strežniku!"]});
                else {
                for (let i=0;i<data.pagedata.podjetja.length;i++) {
                    data.pagedata.podjetja[i].prijave = [];
                    for (let j=0;j<results.length;j++) {
                        if (data.pagedata.podjetja[i].idpodjetja == results[j].idpodjetja) {
                            data.pagedata.podjetja[i].prijave.push(results[j]);
                        }
                    }
                }

                for (let i=0;i< data.pagedata.podjetja.length; i++) {
                    data.pagedata.podjetja[i].datum_ustanovitve = moment(data.pagedata.podjetja[i].datum_ustanovitve).format('yyyy-MM-DD')
                }
                response.render("./admin/opozorjena-podjetja.ejs",data);
                }
            })
        }
    });}
    else response.render("napaka",{napake:["Napaka pri prijavi, poskusite znova."]})
});

router.get('/',function(request,response) {
    response.render("./admin/login-register.ejs",{napake:[]});
});

router.get('/geslo',function(request,response) {
    response.render('./admin/geslo.ejs',{napake:[]});
});

router.get('/nastavitve',function(request,response) {
    let connection = request.app.get('connection');

    let data = {
        pagedata: {
            ime:"Ime",
            priimek:"Priimek"
        }
    }
    if (request.session.adminid != undefined) {
    connection.query("SELECT ime,priimek FROM administratorji WHERE idadmin = ?",[request.session.adminid],function(err,results,fields) {
        if (err) response.render("napaka",{napake:["Napaka na strežniku!"]});
        else {
            data.pagedata.ime = results[0].ime;
            data.pagedata.priimek = results[0].priimek;
            response.render('./admin/nastavitve.ejs',data);
        }
    });
    }
    else response.render("napaka",{napake:["Napaka pri prijavi!"]});
});

router.get('brisanje-admin',function(request,response) {
    
});

module.exports = router;