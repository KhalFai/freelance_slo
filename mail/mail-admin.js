let mailObject = {
    posljiGeslo: function (eposta,nadomestnoGeslo,connection,transporter) {   
        if (eposta != undefined && 
            connection != undefined &&
            transporter != undefined    
        ) { 
        let nastavitvePoste = {
         from: 'freelanceslopotrditev@gmail.com',
         to: eposta,
         subject: 'Nadomestno geslo za vaš admin račun freelanceSLO.',
         text: 'Vaše začasno (potrditveno) geslo je: "'+nadomestnoGeslo+'" . Vnesite ga v primerno polje na spletni strani, da zamenjate geslo.'
       };
       
       transporter.sendMail(nastavitvePoste, function(error, info){
         if (error) {
           return;
         }
       });
      } else return;
    }
}

module.exports = mailObject;