const express = require('express')
const router = express.Router();
const moment = require('moment');

router.post('/isci-spretnost',function(request,response) {
	let connection = request.app.get('connection');
	let iskanaspretnost = request.body.iskanaspretnost+'%';
	connection.query("SELECT naziv,idspretnosti FROM spretnosti WHERE naziv LIKE ? LIMIT 10;",[iskanaspretnost],function(err,results,fields) { 
		if (err) {response.send({uspelo:false});}
		
    else if(results.length > 0) response.send({uspelo:results});
    else response.send({uspelo:undefined});
	});
});

router.post('/isci-podrocje',function(request,response) {
    let connection = request.app.get('connection');

    if (request.body.iskanje.length > 0) { 
    if (! /^[a-zžščćđA-ZŽŠĐČĆ0-9 ]+$/.test(request.body.iskanje)) response.send({uspelo:"narobe-iskanje"});
    else {
      connection.query("SELECT imepodrocja,idpodrocja FROM podrocjapodjetji WHERE imepodrocja LIKE ?;", [request.body.iskanje+'%'], function(err,results,fields) {//validate vrstopodjetja 
        if (err) response.send({uspelo:false});
        else {
          response.send({uspelo:true, podrocja:results});
        }
      });
    }}
  });

router.post('/dodaj-delo',function(request,response) {
    let connection = request.app.get('connection');
    //odstrani duplikate iz spretnosti
    let sanirane_spretnosti = new Set(request.body.spretnosti);
    sanirane_spretnosti = [...sanirane_spretnosti];

    let iddela = undefined;
    //naziv črke številke 
    //opis črke številke
    if (request.session.podjetjeid == undefined) response.send({uspelo:"seja-narobe"})

    else if (!/^[a-zžščćđA-ZŽŠĐČĆ0-9 .,:;-]+$/.test(request.body.naziv) || !/^[a-zžščćđA-ZŽŠĐČĆ0-9 .,:;-]+$/.test(request.body.opis)) response.send({uspelo:"naziv-opis-narobe"});
    //plača večja od 0
    else if (request.body.placa <= 0) response.send({uspelo:"placa-narobe"})
    //področje je v bazi
    else connection.query("SELECT opozorjen FROM podjetje WHERE idpodjetja=? AND opozorjen = 1",[request.session.podjetjeid],function(err,results,fields) {
      if (err) response.send({uspelo:false});
      else if (results.length > 0) response.send({uspelo:"opozorjen"});
      else connection.query("SELECT idpodrocja FROM podrocjapodjetji WHERE imepodrocja = ?",[request.body.podrocje],function(err,results,fields) {
      console.log(err);
      if (err) response.send({uspelo:false})
      else if (results.length < 1) response.send({uspelo:"podrocje-narobe"})
      else {
        request.body.podrocje = results[0].idpodrocja;
        //nivoizobrazbe je v bazi
        connection.query("SELECT idnivoja FROM nivojiizobrazbe WHERE idnivoja = ?",[request.body.nivoizobrazbe],function(err,results,fields) {
          console.log(err);
          if (err) response.send({uspelo:false})
          else if (results.length < 1) response.send({uspelo:"nivoizobrazbe-narobe"})
          else {
            //trajanje je v bazi
            connection.query("SELECT idtrajanja FROM trajanje WHERE idtrajanja = ?",[request.body.trajanje],function(err,results,fields) {
              console.log(err);
              if (err) response.send({uspelo:false})
              else if (results.length < 1) response.send({uspelo:"trajanje-narobe"})
              else {
                connection.query("SELECT iddelovnika FROM delovnik WHERE iddelovnika = ?",[request.body.delovnik],function(err,results,fields) {
                //delovnik je v bazi
                console.log(err);
                if (err) response.send({uspelo:false})
                else if (results.length < 1) response.send({uspelo:"delovnik-narobe"})
                else {
                  if (sanirane_spretnosti.length > 0) {
                  connection.query("SELECT idplace FROM vrste_plac WHERE idplace = ?",[request.body.vrstaplace],function(err,results,fields) {
                    console.log(err);
                    if (err) response.send({uspelo:false})
                    else if (results.length < 1) response.send({uspelo:"vrsta-place-narobe"})
                    else {
                      //vstavi delo
                      connection.beginTransaction(function(err) {
                      if (err) {response.send({uspelo:false});return connection.rollback()}
                      connection.query("INSERT INTO dela(idpodjetja,idizobrazbe,idpodrocja,idplace,idtrajanja,iddelovnika,naziv,opis,placa) VALUES(?,?,?,?,?,?,?,?,?);",[request.session.podjetjeid,request.body.nivoizobrazbe,request.body.podrocje,request.body.vrstaplace,request.body.trajanje,request.body.delovnik,request.body.naziv,request.body.opis,request.body.placa],function(err,results,fields) {
                        if (err) {response.send({uspelo:false});return connection.rollback()}
                        else {
                          //preglej dela, če so ok jih vstavi, naredi array napačnih del da jih serviraš nazaj uporabniku
                         connection.query("SELECT IF (COUNT(*) > ?, true, false) AS pravilnost FROM spretnosti WHERE naziv IN (?);",[sanirane_spretnosti.length-1,sanirane_spretnosti],function(err,results,fields) {
                          console.log(err);
                          if (err) {response.send({uspelo:false}); return connection.rollback();}
                          if (results[0].pravilnost == false) {response.send({uspelo:'spretnost-narobe'});return connection.rollback();}
                          else if(results[0].pravilnost == true) {
                            connection.query("SELECT MAX(iddela) AS iddela FROM dela",[],function(err,results,fields) {
                              console.log(err);
                              if (err || results.length < 1) {response.send({uspelo:false});return connection.rollback();}
                              else {
                            iddela = results[0].iddela;
                            //Vstavi spretnosti
                            connection.query("INSERT INTO dela_has_spretnosti (iddela, idspretnosti) SELECT ?, idspretnosti FROM spretnosti WHERE naziv IN (?) GROUP BY idspretnosti;",[iddela,sanirane_spretnosti],function(err,results,fields) {
                              console.log(err);
                              if (err) {response.send({uspelo:false});return connection.rollback();}
                            else {
                              connection.commit(function(err) {
                                console.log(err);
                                if (err) {response.send({uspelo:false});return connection.rollback();}
                                else {response.send({uspelo:true,iddela:iddela})}
                              });
                            }
                            });
                          }});
                        }
                      });
                    }});});
                    }
                  });
                }}
                });
              }
            });
          }
        });
      }
    });
  });
})

router.post('/izbrisi-delo',function(request,response) {
  let connection = request.app.get('connection');

  if (request.session.podjetjeid == undefined) response.send({uspelo:"seja-narobe"})
  else connection.query("SELECT iddela FROM dela WHERE iddela = ? AND idpodjetja=?",[request.body.iddela,request.session.podjetjeid],function(err,results,fields) {
  console.log(err);
  if (err) response.send({uspelo:false});
  else if (results < 1) response.send({uspelo:'dela-ni'})
  else connection.query("DELETE FROM dela WHERE iddela = ? AND idpodjetja=?",[request.body.iddela,request.session.podjetjeid],function(err,results,fields) {
    console.log(err);
    if (err) response.send({uspelo:false});
    else response.send({uspelo:true});
  });
  });
})

router.get('/pokazi-odzive/:iddela',function(request,response) {
  console.log(request.params.iddela);
  let connection = request.app.get('connection');

  if (request.session.podjetjeid == undefined) response.send({uspelo:"ni-prijave"})
  else connection.query("SELECT iddela FROM dela_prijave WHERE iddela=?;",[request.params.iddela],function(err,results,fields) {
  if (err) response.send({uspelo:false});
  else if (results.length < 0) response.send({uspelo:"dela-ni"})
  else {
      connection.query("SELECT opozorjen FROM podjetje WHERE idpodjetja=? AND opozorjen = 1",[request.session.podjetjeid],function(err,results,fields) {
      if (err) response.send({uspelo:false});
      else if (results.length > 0) response.send({uspelo:"opozorjen"});
      else connection.query("SELECT dela_prijave.iddelavca,dela_prijave.opis,delavci.ime,delavci.priimek FROM dela_prijave INNER JOIN dela ON dela_prijave.iddela = dela.iddela INNER JOIN delavci ON dela_prijave.iddelavca  = delavci.iddelavca LEFT JOIN delavci_opozorila ON dela_prijave.iddelavca = delavci_opozorila.iddelavca WHERE (delavci_opozorila.idpodjetja != ? OR delavci_opozorila.idpodjetja IS NULL) AND delavci.opozorjen IS NULL AND dela_prijave.iddela=? AND dela.idpodjetja = ? AND dela_prijave.sprejet IS NULL;",[request.session.podjetjeid,request.params.iddela,request.session.podjetjeid],function(err,results,fields) {
      console.log(err);
      if (err) response.send({uspelo:false});
      else if (results.length < 1) response.send({uspelo:'odzivov-ni'});
      else response.send({uspelo:true,odzivi:results});
    });
  });
  }
  });
});

router.post('/sprejmi-delavca',function(request,response) {
  console.log(request.body)
  let connection = request.app.get('connection');
 
  if (request.session.podjetjeid == undefined) response.send({uspelo:"seja-narobe"})
  else connection.query("SELECT iddelavca,dela_prijave.iddela,idpodjetja FROM dela_prijave INNER JOIN dela ON dela.iddela = dela_prijave.iddela WHERE dela_prijave.iddelavca = ? AND dela_prijave.iddela = ? AND dela.idpodjetja = ?;",[request.body.iddelavca,request.body.iddela,request.session.podjetjeid],function (err,results,fields) {
    console.log(err);
    if (err) response.send({uspelo:false});
    else if (results.length < 1) response.send({uspelo:"ni-podatkov"})
    else {
      //izbriši zahtevo delavca
      connection.query("SELECT opozorjen FROM podjetje WHERE idpodjetja=? AND opozorjen = 1",[request.session.podjetjeid],function(err,results,fields) {
        if (err) response.send({uspelo:false});
        else if (results.length > 0) response.send({uspelo:"opozorjen"});
        else connection.query("UPDATE dela_prijave SET sprejet=1 WHERE iddela = ? AND iddelavca = ?;",[request.body.iddela,request.body.iddelavca],function(err,results,fields) {
        console.log(err);
        if (err) response.send({uspelo:false});
        else response.send({uspelo:true});
      });
      });
    }
  });
});

router.post('/zavrni-delavca',function(request,response) {
  console.log(request.body)
  let connection = request.app.get('connection');

  if (request.session.podjetjeid == undefined) response.send({uspelo:"seja-narobe"})
  else connection.query("SELECT iddelavca,dela_prijave.iddela,idpodjetja FROM dela_prijave INNER JOIN dela ON dela.iddela = dela_prijave.iddela WHERE dela_prijave.iddelavca = ? AND dela_prijave.iddela = ? AND dela.idpodjetja = ?;",[request.body.iddelavca,request.body.iddela,request.session.podjetjeid],function (err,results,fields) {
    console.log(err);
    if (err) response.send({uspelo:false});
    else if (results.length < 1) response.send({uspelo:"ni-podatkov"})
    else {
      //izbriši zahtevo delavca
      connection.query("SELECT opozorjen FROM podjetje WHERE idpodjetja=? AND opozorjen = 1",[request.session.podjetjeid],function(err,results,fields) {
        if (err) response.send({uspelo:false});
        else if (results.length > 0) response.send({uspelo:"opozorjen"});
        else connection.query("UPDATE dela_prijave SET sprejet=0 WHERE iddela = ? AND iddelavca = ?;",[request.body.iddela,request.body.iddelavca],function(err,results,fields) {
        console.log(err);
        if (err) response.send({uspelo:false});
        else response.send({uspelo:true});
      });
    });
    }
  });
});

router.post('/prijavi-delavca',function(request,response) { 
  let connection = request.app.get('connection');
  if (request.session.podjetjeid == undefined) response.send({uspelo:"seja-narobe"})
  //validiraj tekst
  else if (! /^[a-zžščćđA-ZŽŠĐČĆ0-9 .,-:;_]+$/.test(request.body.pojasnilo)) response.send({uspelo:"besedilo-narobe"});
  //če je delavec
  else connection.query("SELECT opozorjen FROM podjetje WHERE idpodjetja=? AND opozorjen = 1",[request.session.podjetjeid],function(err,results,fields) {
    if (err) response.send({uspelo:false});
    else if (results.length > 0) response.send({uspelo:"opozorjen"});
    else connection.query("SELECT iddelavca FROM delavci_opozorila WHERE iddelavca = ? AND idpodjetja = ?",[request.body.iddelavca,request.session.podjetjeid],function(err,results,fields) {
    if (err) response.send({uspelo:false});
    else if (results.length > 0 ) {
    connection.query("DELETE FROM dela_prijave WHERE iddelavca = ? AND iddela IN (SELECT iddela FROM dela WHERE idpodjetja = ?);",[request.body.iddelavca,request.session.podjetjeid],function(err,results,fields) {
      console.log(err);
      if (err) response.send({uspelo:false});
      else response.send({uspelo:"ze-prijavljen"});
      });
  }
  else connection.query("SELECT iddelavca FROM delavci WHERE iddelavca = ?",[request.body.iddelavca],function (err,results,fields) {
    console.log(err);
    if (err) response.send({uspelo:false});
    else if (results.length < 1) response.send({uspelo:"delavca-ni"})
    else connection.query("INSERT INTO delavci_opozorila(idpodjetja,iddelavca,besedilo_prijave) VALUES (?,?,?)",[request.session.podjetjeid,request.body.iddelavca,request.body.pojasnilo],function (err,results,fields) {
      console.log(err);
      if (err) response.send({uspelo:false})
      else connection.query("DELETE FROM dela_prijave WHERE iddelavca = ? AND iddela IN (SELECT iddela FROM dela WHERE idpodjetja = ?);",[request.body.iddelavca,request.session.podjetjeid],function(err,results,fields) {
        console.log(err);
        if (err) response.send({uspelo:false})
        else response.send({uspelo:true});
        });
      });
    });
    });
  })
});

router.get('/o-delavcu/:iddelavca',function(request,response) {
  console.log(request.body)
  let connection = request.app.get('connection');

  let delavec = {
    //osnoven info
    info:{},
    jeziki:[],
    spretnosti:[],
    delovneizkusnje:[],
    izobrazba:[]
  };

  connection.query("SELECT epostapotrjena,eposta,ime,priimek,datumrojstva,telefon,kratekopis FROM delavci WHERE iddelavca = ?;",[request.params.iddelavca],function(err,results,fields) {
    console.log(err);
    if (err) response.send({uspelo:false});
    if (results.length < 1) response.send({uspelo:'delavca-ni'})
    else {
      delavec.info = results;
      delavec.info[0].datumrojstva = moment(delavec.info[0].datumrojstva).format('yyyy-MM-DD');

      connection.query("SELECT naziv FROM freelance_slo.delavci_has_jezik INNER JOIN jeziki ON jeziki.idjezika = delavci_has_jezik.idjezika WHERE iddelavca = ?;",[request.params.iddelavca],function(err,results,fields) {
        console.log(err);
        if (err) response.send({uspelo:false});
        else {
          delavec.jeziki = results;
          connection.query("SELECT naziv FROM delavci_has_spretnosti INNER JOIN spretnosti ON delavci_has_spretnosti.idspretnosti = spretnosti.idspretnosti WHERE iddelavca = ?;",[request.params.iddelavca],function(err,results,fields) {
            console.log(err);
            if (err) response.send({uspelo:false});
            else {
            delavec.spretnosti = results;

            connection.query("SELECT nazivpodjetja,imemesta,datumzacetka,datumkonca,opisdela FROM delovneizkusnje WHERE iddelavca = ? ORDER BY iddelovneizkusnje DESC;",[request.params.iddelavca],function(err,results,fields) {
              console.log(err);
              if (err) response.send({uspelo:false});
              else {
                delavec.delovneizkusnje = results;

                for (let i=0;i<delavec.delovneizkusnje.length;i++) {
                  delavec.delovneizkusnje[i].datumzacetka = moment(delavec.delovneizkusnje[i].datumzacetka).format('yyyy-MM-DD');
                  delavec.delovneizkusnje[i].datumkonca = moment(delavec.delovneizkusnje[i].datumkonca).format('yyyy-MM-DD');
                }

                connection.query("SELECT izobrazba.naziv,ustanova,opis,nivojiizobrazbe.naziv AS nivoizobrazbe,datumzacetka,datumkonca FROM izobrazba INNER JOIN nivojiizobrazbe ON nivojiizobrazbe.idnivoja = izobrazba.idnivoja WHERE iddelavca=?;",[request.params.iddelavca],function(err,results,fields) {
                  console.log(err);
                  if (err) response.send({uspelo:false});
                  else {
                    delavec.izobrazba = results;

                    for (let i=0;i<delavec.izobrazba.length;i++) {
                      delavec.izobrazba[i].datumzacetka = moment(delavec.izobrazba[i].datumzacetka).format('yyyy-MM-DD');
                      delavec.izobrazba[i].datumkonca = moment(delavec.izobrazba[i].datumkonca).format('yyyy-MM-DD');
                    }

                    response.send({uspelo:true,delavec:delavec});
                  }
                });
              }
            });
            }
          });
        }
      });
    }
  })
  
});

module.exports = router;