function odstraniDelo(item) {
    let iddela = item.value;
    let status = document.getElementById("status");
    let admin_razlog = document.getElementById("razlog-"+iddela).value;

    if (!/^[a-zžščćđA-ZŽŠĐČĆ0-9 .,:;-]+$/.test(admin_razlog)) {
        openStatus(status,"Besedilo prijave lahko vsebuje samo črke, številke in ločila.","alert-danger");
        document.getElementById("delo-"+iddela).before(status);
        document.getElementById("razlog-"+iddela).classList.remove('is-valid')
        document.getElementById("razlog-"+iddela).classList.add('is-invalid')
    }
    else postData("/admin/management/opozori-delodajalca",{iddela:iddela,admin_razlog:admin_razlog}).then((response)=>{
        if (response.uspelo == "dela-ni") {
            openStatus(status,"Iskano delo ne obstaja.","alert-danger");
            document.getElementById("delo-"+iddela).before(status);
        }
        if (response.uspelo == "ni-prijave") {
            openStatus(status,"Niste prijavljeni, poskusite znova.","alert-danger");
            document.getElementById("delo-"+iddela).before(status);
        }
        if (response.uspelo == "tekst-narobe") {
            openStatus(status,"Besedilo prijave lahko vsebuje samo črke, števila in ločila.","alert-danger");
            document.getElementById("delo-"+iddela).before(status);
        }
        if (response.uspelo == true) {
            document.getElementById("razlog-"+iddela).classList.remove('is-invalid')
            document.getElementById("razlog-"+iddela).classList.add('is-valid')

            openStatus(status,"Delo je odstranjeno.","alert-success");
            document.getElementById("delo-"+iddela).before(status);
            document.getElementById("delo-"+iddela).parentNode.removeChild(document.getElementById("delo-"+iddela));
        }
    });
}

function prekiniPrijavo(item) {
    let iddela = item.value;
    let status = document.getElementById("status");

    postData("/admin/management/prekini-prijavo-dela",{iddela:iddela}).then((response)=>{
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("delo-"+iddela).before(status);
        }
        if (response.uspelo == "ni-prijave") {
            openStatus(status,"Niste prijavljeni, poskusite znova.","alert-danger");
            document.getElementById("delo-"+iddela).before(status);
        }
        if (response.uspelo == "dela-ni") {
            openStatus(status,"Delo ne obstaja.","alert-danger");
            document.getElementById("delo-"+iddela).before(status);
        }
        if (response.uspelo == true) {
            openStatus(status,"Delo je pomiloščeno.","alert-success");
            document.getElementById("delo-"+iddela).before(status);

            document.getElementById("delo-"+iddela).parentNode.removeChild(document.getElementById("delo-"+iddela));
        }
    });
}

function dokoncnoIzbrisi(item) {
    let iddela = item.value;
    let status = document.getElementById("status");

    postData("/admin/management/dokoncno-odstrani-delo",{iddela:iddela}).then((response)=>{
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("delo-"+iddela).before(status);
        }
        if (response.uspelo == "ni-prijave") {
            openStatus(status,"Niste prijavljeni, poskusite znova.","alert-danger");
            document.getElementById("delo-"+iddela).before(status);
        }
        if (response.uspelo == "dela-ni") {
            openStatus(status,"Delo ne obstaja.","alert-danger");
            document.getElementById("delo-"+iddela).before(status);
        }
        if (response.uspelo == true) {
            openStatus(status,"Delo je dokončno izbrisano.","alert-success");
            document.getElementById("delo-"+iddela).before(status);

            document.getElementById("delo-"+iddela).parentNode.removeChild(document.getElementById("delo-"+iddela));
        }
    });

}