function potrdiPrijavo(item) {
    let idpodjetja = item.value;
    let pojasnilo = document.getElementById("prijava-razlaga-"+idpodjetja).value;
    let status = document.getElementById("status");

    if (!/^[a-zžščćđA-ZŽŠĐČĆ0-9 .,:;-]+$/.test(pojasnilo)) {
        openStatus(status,"Besedilo prijave lahko vsebuje samo črke, številke in ločila.","alert-danger");
        document.getElementById("prijava-"+idpodjetja).before(status);
        document.getElementById("prijava-razlaga-"+idpodjetja).classList.remove('is-valid')
        document.getElementById("prijava-razlaga-"+idpodjetja).classList.add('is-invalid')
    }
    else postData("/admin/management/blokiraj-podjetje",{idpodjetja:idpodjetja,pojasnilo:pojasnilo}).then((response) => {
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("prijava-"+idpodjetja).before(status);
        }
        if (response.uspelo == "podjetja-ni") {
            openStatus(status,"Podjetje ne obstaja.","alert-danger");
            document.getElementById("prijava-"+idpodjetja).before(status);
        }
        if (response.uspelo == "tekst-narobe") {
            openStatus(status,"Besedilo prijave lahko vsebuje samo črke, številke in ločila.","alert-danger");
            document.getElementById("prijava-"+idpodjetja).before(status);
        }
        if (response.uspelo == "ni-prijave") {
            openStatus(status,"Niste prijavljeni, poskusite znova.","alert-danger");
            document.getElementById("prijava-"+idpodjetja).before(status);
        }
        if (response.uspelo == true) {
            document.getElementById("prijava-razlaga-"+idpodjetja).classList.remove('is-invalid')
            document.getElementById("prijava-razlaga-"+idpodjetja).classList.add('is-valid')

            openStatus(status,"Posodobitev uspešna.","alert-success");
            document.getElementById("prijava-"+idpodjetja).before(status);

            document.getElementById("prijava-"+idpodjetja).parentNode.removeChild(document.getElementById("prijava-"+idpodjetja));
        }
    });
}

function dokoncnoPotrdi(item) {
    let idpodjetja = item.value;
    let status = document.getElementById("status");

    postData("/admin/management/dokoncno-blokiraj-podjetje",{idpodjetja:idpodjetja}).then((response) => {
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("prijava-"+idpodjetja).before(status);
        }
        if (response.uspelo == "podjetja-ni") {
            openStatus(status,"Podjetje ne obstaja.","alert-danger");
            document.getElementById("prijava-"+idpodjetja).before(status);
        }
        if (response.uspelo == "ni-prijave") {
            openStatus(status,"Niste prijavljeni, poskusite znova.","alert-danger");
            document.getElementById("prijava-"+idpodjetja).before(status);
        }
        if (response.uspelo == true) {
            openStatus(status,"Posodobitev uspešna.","alert-success");
            document.getElementById("prijava-"+idpodjetja).before(status);

            document.getElementById("prijava-"+idpodjetja).parentNode.removeChild(document.getElementById("prijava-"+idpodjetja));
        }
    });
}

function opustiPrijavo(item) {
    let idpodjetja = item.value;
    let status = document.getElementById("status");
    
    postData("/admin/management/opusti-prijavo-podjetje",{idpodjetja:idpodjetja}).then((response) => {
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("prijava-"+idpodjetja).before(status);
        }
        if (response.uspelo == "podjetja-ni") {
            openStatus(status,"Podjetje ne obstaja.","alert-danger");
            document.getElementById("prijava-"+idpodjetja).before(status);
        }
        if (response.uspelo == "ni-prijave") {
            openStatus(status,"Niste prijavljeni, poskusite znova.","alert-danger");
            document.getElementById("prijava-"+idpodjetja).before(status);
        }
        if (response.uspelo == true) {
            openStatus(status,"Posodobitev je uspešna.","alert-success");
            document.getElementById("prijava-"+idpodjetja).before(status);

            document.getElementById("prijava-"+idpodjetja).parentNode.removeChild(document.getElementById("prijava-"+idpodjetja));
        }
    });
}