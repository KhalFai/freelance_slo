function posodobiPodatke() {
    let ime = document.getElementById("admin-ime").value;
    let priimek = document.getElementById("admin-priimek").value;
    let status = document.getElementById("status");

    if (! /^[a-zžščćđA-ZŽŠĐČĆ]+$/.test(ime) || ! /^[a-zđščćžA-ZĐŠČĆŽ]+$/.test(priimek)) {
        openStatus(status,"Ime in priimek lahko vsebujeta samo črke.","alert-danger");
        document.getElementById("podatkiform").prepend(status);
    }
    else if(! /^[A-ZĐŠČĆŽ]/.test(priimek) || ! /^[A-ZĐŠČĆŽ]/.test(ime)) {
        openStatus(status,"Ime in priimek morata imeti veliki začetnici.","alert-danger");
        document.getElementById("podatkiform").prepend(status);
    }
    else    postData("/admin/acc/posodobi-podatke",{ime:ime,priimek:priimek}).then((response)=>{
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("podatkiform").prepend(status);
        }
        if (response.uspelo == "tekst-narobe") {
            openStatus(status,"Ime in priimek lahko vsebujeta samo črke.","alert-danger");
            document.getElementById("podatkiform").prepend(status);
        }
        if (response.uspelo == "zacetnici-narobe") {
            openStatus(status,"Ime in priimek morata imeti veliki začetnici.","alert-danger");
            document.getElementById("podatkiform").prepend(status);
        }
        if (response.uspelo == true) {
            openStatus(status,"Posodobitev uspešna.","alert-success");
            document.getElementById("podatkiform").prepend(status);
        }
    });
}