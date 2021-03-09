function potrdiPrijavo(item) {
    let iddelavca = item.value;
    let status = document.getElementById("status");
    let pojasnilo = document.getElementById("prijava-razlaga-"+iddelavca).value;

    if (!/^[a-zžščćđA-ZŽŠĐČĆ0-9 .,:;-]+$/.test(pojasnilo)) {
        openStatus(status,"Besedilo prijave lahko vsebuje samo črke, številke in ločila.","alert-danger");
        document.getElementById("prijava-"+iddelavca).before(status);
        document.getElementById("prijava-razlaga-"+iddelavca).classList.remove('is-valid')
        document.getElementById("prijava-razlaga-"+iddelavca).classList.add('is-invalid')
    }
    else postData("/admin/management/blokiraj-delavca",{iddelavca:iddelavca,pojasnilo:pojasnilo}).then((response) => {
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("prijava-"+iddelavca).before(status);
        }
        if (response.uspelo == "ni-prijave") {
            openStatus(status,"Niste prijavljeni, poskusite znova.","alert-danger");
            document.getElementById("prijava-"+iddelavca).before(status);
        }
        if (response.uspelo == "delavca-ni") {
            openStatus(status,"Delavec ne obstaja.","alert-danger");
            document.getElementById("prijava-"+iddelavca).before(status);
        }
        if (response.uspelo == "tekst-narobe") {
            openStatus(status,"Besedilo pojasnila lahko vsebuje samo črke, številke in ločila.","alert-danger");
            document.getElementById("prijava-"+iddelavca).before(status);
        }
        if (response.uspelo == true) {
            document.getElementById("prijava-razlaga-"+iddelavca).classList.remove('is-invalid')
            document.getElementById("prijava-razlaga-"+iddelavca).classList.add('is-valid')

            openStatus(status,"Posodobitev uspešna.","alert-success");
            document.getElementById("prijava-"+iddelavca).before(status);

            document.getElementById("prijava-"+iddelavca).parentNode.removeChild(document.getElementById("prijava-"+iddelavca));
        }
    });
}

function dokoncnoPotrdi(item) {
    let iddelavca = item.value;
    let status = document.getElementById("status");

    postData("/admin/management/dokoncno-blokiraj-delavca",{iddelavca:iddelavca}).then((response) => {
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("prijava-"+iddelavca).before(status);
        }
        if (response.uspelo == "ni-prijave") {
            openStatus(status,"Niste prijavljeni, poskusite znova.","alert-danger");
            document.getElementById("prijava-"+iddelavca).before(status);
        }
        if (response.uspelo == "delavca-ni") {
            openStatus(status,"Delavec ne obstaja.","alert-danger");
            document.getElementById("prijava-"+iddelavca).before(status);
        }
        if (response.uspelo == true) {
            openStatus(status,"Posodobitev uspešna.","alert-success");
            document.getElementById("prijava-"+iddelavca).before(status);

            document.getElementById("prijava-"+iddelavca).parentNode.removeChild(document.getElementById("prijava-"+iddelavca));
        }
    });
}

function opustiPrijavo(item) {
    let iddelavca = item.value;
    let status = document.getElementById("status");

    postData("/admin/management/opusti-prijavo-delavca",{iddelavca:iddelavca}).then((response) => {
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("prijava-"+iddelavca).before(status);
        }
        if (response.uspelo == "ni-prijave") {
            openStatus(status,"Niste prijavljeni, poskusite znova.","alert-danger");
            document.getElementById("prijava-"+iddelavca).before(status);
        }
        if (response.uspelo == "delavca-ni") {
            openStatus(status,"Delavec ne obstaja.","alert-danger");
            document.getElementById("prijava-"+iddelavca).before(status);
        }
        if (response.uspelo == true) {
            openStatus(status,"Posodobitev uspešna","alert-success");
            document.getElementById("prijava-"+iddelavca).before(status);

            document.getElementById("prijava-"+iddelavca).parentNode.removeChild(document.getElementById("prijava-"+iddelavca));
        }
    });
}