let mailObject = {
    postaPotrditev: function(eposta,id,connection,transporter) {
        if (eposta != undefined && 
            id != undefined &&
            connection != undefined &&
            transporter != undefined    
        ) { 
        let potrditvenakoda = Math.floor(1000+Math.random()*8999);
        connection.query("UPDATE podjetje SET potrditvenakoda = ? WHERE idpodjetja = ?;",[potrditvenakoda,id],function(err,results,fields) {
         if (err) console.log(err);
         else {
         let nastavitvePoste = {
          from: 'freelanceslopotrditev@gmail.com',
          to: eposta,
          subject: 'Potrdite vaše FreelanceSLO podjetje!',
          text: 'Vnesite sledečo kodo v polje \"Potrditvena koda\": '+potrditvenakoda+'  in vašemu računu zagotovite pristnost!'
        };
        
        transporter.sendMail(nastavitvePoste, function(error, info){
          if (error) {
            return;
          }
        });}
        })
        }
        else return;
    },
    posljiGeslo: function (eposta,nadomestnoGeslo,connection,transporter) {   
        if (eposta != undefined && 
            connection != undefined &&
            transporter != undefined    
        ) { 
        let nastavitvePoste = {
            from: 'freelanceslopotrditev@gmail.com',
            to: eposta,
            subject: 'Nadomestno geslo za vaše podjetje.',
            text: 'Vaše začasno (potrditveno) geslo je: "'+nadomestnoGeslo+'" . Vnesite ga v primerno polje na spletni strani, da zamenjate geslo.'
            };
            
            transporter.sendMail(nastavitvePoste, function(error, info){
            if (error) {
              return;
            }
        });
        }
        else return;
    }
}

module.exports = mailObject;