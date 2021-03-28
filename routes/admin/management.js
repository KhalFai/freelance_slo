const express = require('express')
const router = express.Router();

router.post('/potrdi-zahtevo',function(request,response) {
    let connection = request.app.get('connection');

    if (request.session.adminid == undefined) response.send({uspelo:"ni-prijave"});
    else connection.query("SELECT idadmin FROM administratorji WHERE idadmin = ?",[request.session.adminid],function(err,results,fields) {
    if (err) response.send({uspelo:false});
    else if (results.length < 1) response.send({uspelo:"ni-prijave"});
    else connection.query("SELECT idadmin FROM administratorji WHERE idadmin = ?",[request.body.idzahteve],function(err,results,fields) {
    if (err) response.send({uspelo:false});
    else if (results == undefined || results.length < 1) response.send({uspelo:"zahteve-ni"});
    else connection.query("UPDATE administratorji SET potrjen = 1 WHERE idadmin = ?",[request.body.idzahteve],function(err,results,fields) {
        if (err) response.send({uspelo:false});
        else response.send({uspelo:true});
    });
    });
    });
});

router.post('/zavrni-zahtevo',function(request,response) {
    let connection = request.app.get('connection');

    if (request.session.adminid == undefined) response.send({uspelo:"ni-prijave"});
    else connection.query("SELECT idadmin FROM administratorji WHERE idadmin = ?",[request.session.adminid],function(err,results,fields) {
    if (err) response.send({uspelo:false});
    else if (results.length < 1) response.send({uspelo:"ni-prijave"});
    else connection.query("SELECT idadmin FROM administratorji WHERE idadmin = ?",[request.body.idzahteve],function(err,results,fields) {
    if (err) response.send({uspelo:false});
    else if (results == undefined || results.length < 1) response.send({uspelo:"zahteve-ni"});
    else connection.beginTransaction(function(err) {
        if (err) {response.send({uspelo:false})}
        else connection.query("INSERT INTO administratorji_eposta_blacklist(naslov) SELECT eposta FROM administratorji WHERE idadmin = ?",[request.body.idzahteve],function(err,results,fields) {
        if (err) {
            connection.rollback();
            response.send({uspelo:false});
        }
        else {
            connection.query("DELETE FROM administratorji WHERE idadmin = ?",[request.body.idzahteve],function (err,results,fields) {
                if (err) {
                    connection.rollback();
                    response.send({uspelo:false})
                }
                else {
                    connection.commit();
                    response.send({uspelo:true});
                }
            })
        }
        });
        });
    });
    });
});

router.post('/opozori-delodajalca',function(request,response) {
    let connection = request.app.get('connection');

    //ce delo obstaja
    if (!/^[a-zžščćđA-ZŽŠĐČĆ0-9 .,:;-]+$/.test(request.body.admin_razlog)) response.send({uspelo:"tekst-narobe"});
    else if (request.session.adminid == undefined) response.send({uspelo:"ni-prijave"});
    else connection.query("SELECT idadmin FROM administratorji WHERE idadmin = ?",[request.session.adminid],function(err,results,fields) {
    if (err) response.send({uspelo:false});
    else if (results.length < 1) response.send({uspelo:"ni-prijave"});
    else connection.query("SELECT iddela FROM dela WHERE iddela = ?",[request.body.iddela],function(err,results,fields) {
    if (err) response.send({uspelo:false});  
    else if (results.length < 1) response.send({uspelo:"dela-ni"})
    else 
    connection.query("UPDATE dela SET opozorjen = 1,pojasnilo_admina = ? WHERE iddela = ?",[request.body.admin_razlog,request.body.iddela],function(err,results,fields) {
        if (err) response.send({uspelo:false});  
        else response.send({uspelo:true});
    });
    });
    });
});

router.post('/dokoncno-odstrani-delo',function(request,response) {
    let connection = request.app.get('connection');

    if (request.session.adminid == undefined) response.send({uspelo:"ni-prijave"});
    else connection.query("SELECT idadmin FROM administratorji WHERE idadmin = ?",[request.session.adminid],function(err,results,fields) {
    if (err) response.send({uspelo:false});
    else if (results.length < 1) response.send({uspelo:"ni-prijave"});
    else connection.query("SELECT iddela FROM dela WHERE iddela = ?",[request.body.iddela],function(err,results,fields) {
    if (err) response.send({uspelo:false});
    else if (results.length < 1) response.send('dela-ni');
    else if (results.length > 0) connection.query("DELETE FROM dela WHERE iddela = ?",[request.body.iddela],function(err,results,fields) {
        if (err) response.send({uspelo:false});
        else response.send({uspelo:true});
    });
    });
    });
});

router.post('/prekini-prijavo-dela',function(request,response) {
    let connection = request.app.get('connection');

    if (request.session.adminid == undefined) response.send({uspelo:"ni-prijave"});
    else connection.query("SELECT idadmin FROM administratorji WHERE idadmin = ?",[request.session.adminid],function(err,results,fields) {
    if (err) response.send({uspelo:false});
    else if (results.length < 1) response.send({uspelo:"ni-prijave"});
    else connection.query("SELECT dela.iddela FROM dela INNER JOIN dela_prijave WHERE dela.iddela = ?",[request.body.iddela],function(err,results,fields) {
        if (err) response.send({uspelo:false});  
        else if (results.length < 1) response.send({uspelo:"dela-ni"})
        else connection.beginTransaction(function(err) {
            if (err) {response.send({uspelo:false});}
            else connection.query("UPDATE dela SET opozorjen = NULL, pojasnilo_admina = NULL WHERE iddela = ?",[request.body.iddela],function(err,results,fields) {
            if (err) {
                connection.rollback();
                response.send({uspelo:false});
            }  
            else {
                connection.query("DELETE FROM dela_opozorila WHERE iddela = ?",[request.body.iddela],function (err,results,fields) {
                    if (err) {
                        connection.rollback();
                        response.send({uspelo:false});
                    }
                    else {
                        connection.commit();
                        response.send({uspelo:true});
                    }
                })
            }
        });
        });
    });
    });
});

router.post('/blokiraj-delavca',function(request,response) {
let connection = request.app.get('connection');

if (!/^[a-zžščćđA-ZŽŠĐČĆ0-9 .,:;-]+$/.test(request.body.pojasnilo)) response.send({uspelo:"tekst-narobe"});
if (request.session.adminid == undefined) response.send({uspelo:"ni-prijave"});
else connection.query("SELECT idadmin FROM administratorji WHERE idadmin = ?",[request.session.adminid],function(err,results,fields) {
if (err) response.send({uspelo:false});
else if (results.length < 1) response.send({uspelo:"ni-prijave"});
else connection.query("SELECT iddelavca FROM delavci WHERE iddelavca = ?",[request.body.iddelavca],function(err,results,fields) {
    if (err) response.send({uspelo:false})
    else if (results.length < 1) response.send({uspelo:"delavca-ni"});
    else {
        connection.query("UPDATE delavci SET opozorjen = 1,admin_pojasnilo = ? WHERE iddelavca = ?",[request.body.pojasnilo,request.body.iddelavca],function(err,results,fields) {
            if (err) response.send({uspelo:false});
            else response.send({uspelo:true});
        })
    }
});
});
});

router.post('/dokoncno-blokiraj-delavca',function(request,response) {
    let connection = request.app.get('connection');
    
    if (request.session.adminid == undefined) response.send({uspelo:"ni-prijave"});
    else connection.query("SELECT idadmin FROM administratorji WHERE idadmin = ?",[request.session.adminid],function(err,results,fields) {
    if (err) response.send({uspelo:false});
    else if (results.length < 1) response.send({uspelo:"ni-prijave"});
    else connection.query("SELECT iddelavca FROM delavci WHERE iddelavca = ?",[request.body.iddelavca],function(err,results,fields) {
        if (err) response.send({uspelo:false})
        else if (results.length < 1) response.send({uspelo:"delavca-ni"});
        else {
            connection.beginTransaction(function(err) {
                if (err) {response.send({uspelo:false})}
                else connection.query("INSERT INTO delavci_eposta_blacklist (eposta) (SELECT eposta FROM delavci WHERE iddelavca = ?)",[request.body.iddelavca],function(err,results,fields) {
                        if (err) {
                            connection.rollback();
                            response.send({uspelo:false});
                        }
                        else {
                            connection.query("DELETE FROM delavci WHERE iddelavca = ?",[request.body.iddelavca],function(err,results,fields) {
                                if (err) {
                                    connection.rollback();
                                    response.send({uspelo:false});
                                }
                                else {
                                    connection.commit();
                                    response.send({uspelo:true});
                                }
                        });
                    }
            });
        });
        }
});});
});

router.post('/opusti-prijavo-delavca',function(request,response) {
let connection = request.app.get('connection');

if (request.session.adminid == undefined) response.send({uspelo:"ni-prijave"});
else connection.query("SELECT idadmin FROM administratorji WHERE idadmin = ?",[request.session.adminid],function(err,results,fields) {
if (err) response.send({uspelo:false});
else if (results.length < 1) response.send({uspelo:"ni-prijave"});
else connection.query("SELECT iddelavca FROM delavci WHERE iddelavca = ?",[request.body.iddelavca],function(err,results,fields) {
    if (err) response.send({uspelo:false})
    else if (results.length < 1) response.send({uspelo:"delavca-ni"});
    else {
        connection.beginTransaction(function(err) {
            if (err) { 
                connection.rollback();
                response.send({uspelo:false});
            }
            else connection.query("UPDATE delavci SET opozorjen = NULL,odgovor_delavca=NULL,admin_pojasnilo=NULL WHERE iddelavca = ?",[request.body.iddelavca],function(err,results,fields) {
            if (err) {
                connection.rollback();
                response.send({uspelo:false});
            }
            else connection.query("DELETE FROM delavci_opozorila WHERE iddelavca = ?",[request.body.iddelavca],function(err,results,fields) {
                if (err) {
                    connection.rollback();
                    response.send({uspelo:false});
                }
                else {
                    connection.commit();
                    response.send({uspelo:true});
                }
            })
        })
        });
    }
});});
});

router.post('/blokiraj-podjetje',function(request,response) {
    let connection = request.app.get('connection');
    
    if (request.session.adminid == undefined) response.send({uspelo:"ni-prijave"});
    else connection.query("SELECT idadmin FROM administratorji WHERE idadmin = ?",[request.session.adminid],function(err,results,fields) {
    if (err) response.send({uspelo:false});
    else if (results.length < 1) response.send({uspelo:"ni-prijave"});
    else connection.query("SELECT idpodjetja FROM podjetje WHERE idpodjetja = ?",[request.body.idpodjetja],function(err,results,fields) {
        if (err) response.send({uspelo:false})
        else if (results.length < 1) response.send({uspelo:"podjetja-ni"});
        else {
            connection.query("UPDATE podjetje SET opozorjen = 1,admin_pojasnilo = ? WHERE idpodjetja = ?",[request.body.pojasnilo,request.body.idpodjetja],function(err,results,fields) {
                if (err) response.send({uspelo:false});
                else response.send({uspelo:true});
            })
        }
    });});
    });
    
    router.post('/dokoncno-blokiraj-podjetje',function(request,response) {
        //NAREDI DA DELAVCI NISO VIDNI KO SO PRIJAVLJENI
        let connection = request.app.get('connection');
        
        if (request.session.adminid == undefined) response.send({uspelo:"ni-prijave"});
        else connection.query("SELECT idadmin FROM administratorji WHERE idadmin = ?",[request.session.adminid],function(err,results,fields) {
        if (err) response.send({uspelo:false});
        else if (results.length < 1) response.send({uspelo:"ni-prijave"});
        else connection.query("SELECT idpodjetja FROM podjetje WHERE idpodjetja = ?",[request.body.idpodjetja],function(err,results,fields) {
            if (err) response.send({uspelo:false})
            else if (results.length < 1) response.send({uspelo:"podjetja-ni"});
            else {
                connection.beginTransaction(function(err) {
                if (err) { 
                    connection.rollback();
                    response.send({uspelo:false});
                }
                else connection.query("INSERT INTO podjetja_eposta_blacklist (naslov) (SELECT eposta FROM podjetje WHERE idpodjetja = ?)",[request.body.idpodjetja],function(err,results,fields) {
                    if (err) {
                        connection.rollback();
                        response.send({uspelo:false});
                    }
                    else {
                        connection.query("DELETE FROM podjetje WHERE idpodjetja = ?",[request.body.idpodjetja],function(err,results,fields) {
                            if (err) {
                                connection.rollback();
                                response.send({uspelo:false});
                            }
                            else {
                                connection.commit();
                                response.send({uspelo:true});
                            }
                    });
                }
            });
            });
        }
    });});
});
    
    router.post('/opusti-prijavo-podjetje',function(request,response) {
    //odstrani prijavo, set opozorjen to null
    let connection = request.app.get('connection');
    
    if (request.session.adminid == undefined) response.send({uspelo:"ni-prijave"});
    else connection.query("SELECT idadmin FROM administratorji WHERE idadmin = ?",[request.session.adminid],function(err,results,fields) {
    if (err) response.send({uspelo:false});
    else if (results.length < 1) response.send({uspelo:"ni-prijave"});
    else connection.query("SELECT idpodjetja FROM podjetje WHERE idpodjetja = ?",[request.body.idpodjetja],function(err,results,fields) {
        if (err) response.send({uspelo:false})
        else if (results.length < 1) response.send({uspelo:"podjetja-ni"});
        else {
            connection.beginTransaction(function(err) {
                if (err) { 
                    connection.rollback();
                    response.send({uspelo:false});
                }
                else connection.query("UPDATE podjetje SET opozorjen = NULL,admin_pojasnilo = NULL,odgovor_podjetja = NULL WHERE idpodjetja = ?",[request.body.idpodjetja],function(err,results,fields) {
                if (err) {
                    connection.rollback();
                    response.send({uspelo:false});
                }
                else connection.query("DELETE FROM podjetja_opozorila WHERE idpodjetja = ?",[request.body.idpodjetja],function(err,results,fields) {
                    if (err) {
                        connection.rollback();
                        response.send({uspelo:false});
                    }
                    else {
                        connection.commit();
                        response.send({uspelo:true});
                    }
                });
            });
        });}
    });
    });
});
    

module.exports = router;