function posljiKodo() {
    let potrditvenakoda = document.getElementById("potrditvenakoda").value;
    let status = document.getElementById("status");
    if (document.getElementById("potrditvenakoda").value == '') {
        openStatus(status,"Vnesite potrditveno kodo.","alert-warning");
        document.getElementById("potrditevform").prepend(status);
        document.getElementById("potrditvenakoda").classList.add("is-invalid");
    }
    else if (validateEmailCode(document.getElementById("potrditvenakoda"))) {
    postData("/podjetja/acc/verify-email",{potrditvenakoda:potrditvenakoda}).then((response) => {
        if (response.uspelo == "ni-kode") {
            openStatus(status,"Potrditvena koda je niz številk.","alert-danger");
            document.getElementById("potrditevform").prepend(status);
            document.getElementById("potrditvenakoda").classList.add("is-invalid");
        }
        if (response.uspelo == "narobe-koda") {
            openStatus(status,"Potrditvena koda ne ustreza računu.","alert-danger");
            document.getElementById("potrditevform").prepend(status);
            document.getElementById("potrditvenakoda").classList.add("is-invalid");     
        }
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("potrditevform").prepend(status);
            document.getElementById("potrditvenakoda").classList.add("is-invalid");
        }
        if (response.uspelo == true) {
            openStatus(status,"Posodobitev uspešna.","alert-success");
            document.getElementById("potrditevform").prepend(status);
            document.getElementById("potrditvenakoda").classList.add("is-valid");
        }
    });
    } else {
        openStatus(status,"Potrditvena koda je niz številk.","alert-danger");
        document.getElementById("potrditevform").prepend(status);
        document.getElementById("potrditvenakoda").classList.add("is-invalid");
    }

}

function posljiPodatke(item) {
    let status = document.getElementById("status");
    let vrsta_select = document.getElementById("vrsta");
    let vrsta = vrsta_select.options[vrsta_select.selectedIndex].value;
    let naziv = document.getElementById("naziv").value;

    if (!validateCompanyName(document.getElementById("naziv"))) {
        openStatus(status,"Ime podjetja lahko vsebuje samo črke in številke.","alert-danger");
        document.getElementById("lastnostiform").prepend(status);
    }
    else postData("/podjetja/acc/osnovni-podatki",{naziv:naziv,vrsta:vrsta}).then((response)=>{
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("lastnostiform").prepend(status);
        }
        if (response.uspelo == "narobe-naziv") {
            openStatus(status,"Ime podjetja lahko vsebuje samo črke in številke.","alert-danger");
            document.getElementById("lastnostiform").prepend(status);
        }
        if (response.uspelo == "narobe-vrsta") {
            openStatus(status,"Vrednost vrste podjetja ne ustreza podatkovni bazi.","alert-danger");
            document.getElementById("lastnostiform").prepend(status);
        }
        if (response.uspelo == true) {
            openStatus(status,"Posodobitev uspešna.","alert-success");
            document.getElementById("lastnostiform").prepend(status);
        }
    });
}

function isciPodrocje(item) {
    let status= document.getElementById("status");
    let rezultati = document.getElementById("iskana-podrocja");
    rezultati.innerHTML = "";

    let iskanje = item;

    if (iskanje.value.length > 1) {
    if (!/^[a-zžščćđA-ZŽŠĐČĆ0-9 ]+$/.test(iskanje.value)) {
        openStatus(status,"Iskanje lahko vsebuje samo črke in številke.","alert-danger");
        document.getElementById("podjetjeform").prepend(status);
        iskanje.classList.add("is-invalid");
    }

    else postData("/podjetja/acc/isci-podrocje",{iskanje:iskanje.value}).then((response) => {
        if (response.uspelo == "narobe-iskanje") {
            openStatus(status,"Iskanje lahko vsebuje samo črke in številke.","alert-danger");
            document.getElementById("podjetjeform").prepend(status);
            iskanje.classList.add("is-invalid");
        }
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("podjetjeform").prepend(status);
        }
        if (response.uspelo == true) {
            if (response.podrocja.length < 1) {
                openStatus(status,"Iskanje ni vrnilo področji.","alert-danger");
                document.getElementById("podjetjeform").prepend(status);
                iskanje.classList.add("is-invalid");
            }
            else {
                removeElement(status);
                iskanje.classList.remove("is-invalid");
                iskanje.classList.add("is-valid");
            }

            for (podrocje of response.podrocja) {
            let podatek = document.createElement('button');

            podatek.classList = "btn btn-outline-primary ml-1 mr-1 mt-2 mb-2";

            podatek.value = podrocje.idpodrocja;
            podatek.innerText = podrocje.imepodrocja;
            podatek.onclick = function() {dodajPodrocje(podatek)};
            rezultati.appendChild(podatek);
            }

        }
    });
    }
    else {
        rezultati.innerHTML = "";
        iskanje.classList.remove("is-invalid");
        iskanje.classList.remove("is-valid");
    }
}

function dodajPodrocje(item) {
    let idpodrocja = item.value;
    let status = document.getElementById("status");

    postData("/podjetja/acc/spremeni-podrocje",{idpodrocja:idpodrocja}).then((response) => {
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("podjetjeform").prepend(status);
        }
        if (response.uspelo == "narobe-dodaj") {
            openStatus(status,"Vrednost področja ne ustreza pogojem.","alert-danger");
            document.getElementById("podjetjeform").prepend(status);
        }
        if (response.uspelo == true) {
            openStatus(status,"Področje posodobljeno.","alert-success");
            document.getElementById("podjetjeform").prepend(status);
            document.getElementById("iskanje-podrocja").value = item.innerText;
        }
    });
}

function posljiPodrobnosti(item) {
    let velikost_select = document.getElementById("velikost");
    let status = document.getElementById("status");

    let podatki = {
    velikost:velikost_select.options[velikost_select.selectedIndex].value,
    naslov:document.getElementById("naslov").value,
    telefonska:document.getElementById("telefonska").value,
    datumzacetka:document.getElementById("datumzacetka").value
    }

    if (podatki.velikost == "" || podatki.velikost == undefined || podatki.naslov == "" || podatki.naslov == undefined || podatki.telefonska == undefined || podatki.telefonska == "" || 
        podatki.datumzacetka == "" || podatki.datumzacetka == undefined) {
            openStatus(status,"Obrazec ni popolnoma izpolnjen","alert-warning");
            document.getElementById("podjetjeform").prepend(status);
    }

    else if (Date.parse(podatki.datumzacetka) > Date.now()) {
        openStatus(status,"Datum ustanovitve ne sme biti večji od trenutnega datuma.","alert-danger");
        document.getElementById("podjetjeform").prepend(status);
    }

    else if (!validatePhoneNumber(document.getElementById("telefonska"))) {
        openStatus(status,"Telefonska številka ne sledi formatu.","alert-danger");
        document.getElementById("podjetjeform").prepend(status);
    }

    else if (!validateCompanyName(document.getElementById("naslov"))) {
        openStatus(status,"Naslov lahko vsebuje samo številke in črke.","alert-danger");
        document.getElementById("podjetjeform").prepend(status);
    }
    else postData("/podjetja/acc/podatki-podjetja",podatki).then((response) => {
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("podjetjeform").prepend(status);
        }
        if (response.uspelo == "velikost-narobe") {
            openStatus(status,"Velikost podjetja ne ustreza podatkovni bazi.","alert-danger");
            document.getElementById("podjetjeform").prepend(status);
        }
        if (response.uspelo == "datum-narobe") {
            openStatus(status,"Datum ustanovitve ne sme biti večji od trenutnega datuma.","alert-danger");
            document.getElementById("podjetjeform").prepend(status);
        }
        if (response.uspelo == "narobe-telefonska") {
            openStatus(status,"Telefonska številka ni pravilno vpisana, upoštevajte format 000-000-000.","alert-danger");
            document.getElementById("podjetjeform").prepend(status);
        }
        if (response.uspelo == "narobe-naslov") {
            openStatus(status,"Naslov je napačno vpisan, uporabljajte samo številke in črke.","alert-danger");
            document.getElementById("podjetjeform").prepend(status);
        }
        if (response.uspelo == "ni-podatkov") {
            openStatus(status,"V celoti izpolnite obrazec.","alert-danger");
            document.getElementById("podjetjeform").prepend(status);
        }
        if (response.uspelo == true) {
            openStatus(status,"Posodobitev uspešna.","alert-success");
            document.getElementById("podjetjeform").prepend(status);
        }
    });

}