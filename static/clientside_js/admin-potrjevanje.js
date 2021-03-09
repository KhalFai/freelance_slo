function potrdiZahtevo(item) {
    let idzahteve = item.value;
    let status = document.getElementById("status");

    postData("/admin/management/potrdi-zahtevo",{idzahteve:idzahteve}).then((response)=>{
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("zahteva-"+idzahteve).before(status);
        }
        if (response.uspelo == "zahteve-ni") {
            openStatus(status,"Zahteve, na katero se odzivate, ni.","alert-danger");
            document.getElementById("zahteva-"+idzahteve).before(status);
        }
        if (response.uspelo == true) {
            openStatus(status,"Posodobitev uspešna.","alert-success");
            document.getElementById("zahteva-"+idzahteve).before(status);

            let div = document.getElementById("zahteva-"+idzahteve);
            div.parentNode.removeChild(div);
        }
    });
}

function zavrniZahtevo(item) {
    let status = document.getElementById("status");
    let idzahteve = item.value;
    postData("/admin/management/zavrni-zahtevo",{idzahteve:idzahteve}).then((response)=>{
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("zahteva-"+idzahteve).before(status);
        }
        if (response.uspelo == "zahteve-ni") {
            openStatus(status,"Zahteve, na katero se odzivate, ni.","alert-danger");
            document.getElementById("zahteva-"+idzahteve).before(status);
        }
        if (response.uspelo == true) {
            openStatus(status,"Posodobitev uspešna.","alert-success");
            document.getElementById("zahteva-"+idzahteve).before(status);

            let div = document.getElementById("zahteva-"+idzahteve);
            div.parentNode.removeChild(div);
        }
    });
}