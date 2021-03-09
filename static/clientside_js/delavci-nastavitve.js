//OSNOVNE INFORMACIJE
function posodobiInfo() {
    let status = document.getElementById("status");

    let userdata = {
        ime:document.getElementById("ime").value,
        priimek:document.getElementById("priimek").value,
        datumrojstva:document.getElementById("datumrojstva").value,
        telefon:document.getElementById("telefon").value
    }

    if (!validateName(document.getElementById("ime")) || !validateName(document.getElementById("priimek"))) {
        openStatus(status,"Ime in priimek lahko vsebujeta samo črke, imeti morata veliki začetnici.","alert-danger");
        document.getElementById("lastnostiform").prepend(status);
        document.getElementById("ime").classList.add("is-invalid");
        document.getElementById("priimek").classList.add("is-invalid");
    }
    else if (!validateBirthDate(document.getElementById("datumrojstva"))) {
        openStatus(status,"Datum rojstva ne ustreza pogojem.","alert-danger");
        document.getElementById("lastnostiform").prepend(status);
        document.getElementById("datumrojstva").classList.add("is-invalid");
    }
    else if (!validatePhoneNumber(document.getElementById("telefon"))) {
        openStatus(status,"Telefonska številka ni pravilno vpisana. Sledite formatu 000-000-000.","alert-danger");
        document.getElementById("lastnostiform").prepend(status);
        document.getElementById("telefonska").classList.add("is-invalid");
    }
    else postData("/delavci/acc/osnovne-znacilnosti",userdata).then((response) => {
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("lastnostiform").prepend(status);
        }
        if (response.uspelo == 'samo-crke') {
            openStatus(status,"Ime in priimek lahko vsebujeta samo črke.","alert-danger");
            document.getElementById("lastnostiform").prepend(status);
            document.getElementById("ime").classList.add("is-invalid");
            document.getElementById("priimek").classList.add("is-invalid");
        }
        if (response.uspelo == 'velika-zacetnica') {
            openStatus(status,"Ime in priimek imata lahko samo veliki začetnici.","alert-danger");
            document.getElementById("lastnostiform").prepend(status);
            document.getElementById("ime").classList.add("is-invalid");
            document.getElementById("priimek").classList.add("is-invalid");
        }
        if (response.uspelo == 'datum-narobe') {
            openStatus(status,"Datum rojstva ne ustreza pogojem.","alert-danger");
            document.getElementById("lastnostiform").prepend(status);
            document.getElementById("datumrojstva").classList.add("is-invalid");
        }
        if (response.uspelo == 'stevilka-narobe') {
            openStatus(status,"Telefonska številka ni pravilno vpisana. Sledite formatu 000-000-000.","alert-danger");
            document.getElementById("lastnostiform").prepend(status);
            document.getElementById("telefonska").classList.add("is-invalid");
        }
        if (response.uspelo == true) {
            openStatus(status,"Posodobitev uspešna.","alert-success");   
            document.getElementById("lastnostiform").prepend(status);
        }
    });
}

//CV
//Kratekopis
function posljiOpis() {
    let status = document.getElementById("status");
    let kratekopis = document.getElementById("kratekopis").value;
    
    if (document.getElementById("kratekopis").value.length <250)
    postData("/delavci/acc/kratek-opis",{kratekopis:kratekopis}).then((response)=>{
        if (response.uspelo == false || response.uspelo == undefined) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("kratekopisform").prepend(status);
            document.getElementById("kratekopis").classList.add("is-invalid");
        }
        if (response.uspelo == "opis-predolg") {
            openStatus(status,"Opis je predolg.","alert-danger");
            document.getElementById("kratekopisform").prepend(status);
            document.getElementById("kratekopis").classList.add("is-invalid");
        }
        if (response.uspelo == true) {
            openStatus(status,"Posodobitev uspešna.","alert-success");
            document.getElementById("kratekopisform").prepend(status);
        }
    });
    else {
        openStatus(status,"Opis je predolg.","alert-danger");
        document.getElementById("kratekopisform").prepend(status);
        document.getElementById("kratekopis").classList.add("is-invalid");
    }
}

function kratekopisCounter() {
    document.getElementById("kratekopis-dolzina").innerText = document.getElementById("kratekopis").value.length + '/250';
    if (document.getElementById("kratekopis").value.length > 250) {
        document.getElementById("kratekopis").classList.add("is-invalid");
    }
    else {
        document.getElementById("kratekopis").classList.remove("is-invalid");
    }
};

//Spretnosti
function izbrisiSpretnost(item) {
    let status = document.getElementById("status");
    let idspretnosti = item.id.substring(10);
    postData("/delavci/cv/izbrisi-spretnost",{idspretnosti:idspretnosti}).then((response)=>{
        if (response.uspelo == false || response.uspelo == undefined) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("spretnostiform").prepend(status);
        }
        if (response.uspelo == "napacna-vrednost") {
            openStatus(status,"Spretnost, ki jo brišete, ni vezana na uporanbika.","alert-danger");
            document.getElementById("spretnostiform").prepend(status);
        }
        if (response.uspelo == true) {
            item.parentNode.removeChild(item.previousSibling);
            item.parentNode.removeChild(item);
        }
    });
}

function isciSpretnost(item) {
    let iskanaspretnost = item.value;
    let data = document.getElementById("data-spretnosti");
    if (iskanaspretnost.length > 1) {
    postData("/delavci/cv/isci-spretnost",{iskanaspretnost:iskanaspretnost}).then((response)=>{
        if (response.uspelo == false) { 
            document.getElementById("isci-spretnost").classList.remove("is-valid");
            document.getElementById("isci-spretnost").classList.add("is-invalid");
        }
        if (response.uspelo == undefined) {
            document.getElementById("isci-spretnost").classList.remove("is-valid");
            document.getElementById("isci-spretnost").classList.add("is-invalid");
        }
        else {
            data.innerHTML = " ";
            
            if (response.uspelo.length > 0) {
                document.getElementById("isci-spretnost").classList.remove("is-invalid");
                document.getElementById("isci-spretnost").classList.add("is-valid");
            }

            for (spretnost of response.uspelo) {
                let podatek = document.createElement('button');
                podatek.classList = "btn btn-outline-success m-1";
                podatek.value = spretnost.idspretnosti;
                podatek.innerText = spretnost.naziv;
                podatek.onclick = function() {dodajSpretnost(podatek)};
                data.appendChild(podatek);
            }
        }
    });
    }
    else {
        data.innerHTML = " ";
        document.getElementById("isci-spretnost").classList.remove("is-valid");
        document.getElementById("isci-spretnost").classList.remove("is-invalid");
    }
}

function dodajSpretnost(item) {
    let status = document.getElementById("status");

    postData("/delavci/cv/dodaj-spretnost",{idspretnosti:item.value}).then((response)=>{
        if (response.uspelo == false || response.uspelo == undefined) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("spretnostiform").prepend(status);
        }
        if (response.uspelo == "duplikat") {
            openStatus(status,"Dodana spretnost je že prisotna pri uporabniku.","alert-danger");
            document.getElementById("spretnostiform").prepend(status);
        }
        if (response.uspelo == true) {
            let gumb = document.createElement('button');
            let closeIcon = document.createElement('span');

            closeIcon.ariaHidden = true;
            closeIcon.innerHTML = '&times;';

            gumb.classList = "btn btn-success m-1"
            gumb.id = "spretnost-"+item.value;
            gumb.innerText = item.innerText+" ";
            gumb.onclick = function() {izbrisiSpretnost(gumb)};

            gumb.appendChild(closeIcon);
            document.getElementById('trenutne-spretnosti').appendChild(gumb);
        }
    });
}

//JEZIKI

function izbrisiJezik(item) {
    let idjezika = item.id.substring(6);
    let status = document.getElementById("status");

    postData("/delavci/cv/izbrisi-jezik",{idjezika:idjezika}).then((response)=>{
        if (response.uspelo == false || response.uspelo == undefined) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("jezikiform").prepend(status);
        }
        if (response.uspelo == "napacna-vrednost") {
            openStatus(status,"¸Jezik ki ga brišete, ni vezan na uporanbika.","alert-danger");
            document.getElementById("jezikiform").prepend(status);
        }
        if (response.uspelo == true) {
            item.parentNode.removeChild(item.previousSibling);
            item.parentNode.removeChild(item);
        }
    });
}

function isciJezik(item) {
    let iskanjezik = item.value;
    let data = document.getElementById("data-jezik");
    let status = document.getElementById("status");
    
    if (iskanjezik.length > 1) {
    postData("/delavci/cv/isci-jezik",{iskanjezik:iskanjezik}).then((response)=>{
        if (response.uspelo == false) { 
            document.getElementById("isci-jezik").classList.remove("is-valid");
            document.getElementById("isci-jezik").classList.add("is-invalid");
        }
        if (response.uspelo == undefined) {
            document.getElementById("isci-jezik").classList.remove("is-valid");
            document.getElementById("isci-jezik").classList.add("is-invalid");
        }
        else {
            data.innerHTML = " ";
            
            if (response.uspelo.length > 0) {
                document.getElementById("isci-jezik").classList.remove("is-invalid");
                document.getElementById("isci-jezik").classList.add("is-valid");
            }

            for (jezik of response.uspelo) {
                let podatek = document.createElement('button');
                podatek.classList = "btn btn-outline-success m-1";
                podatek.value = jezik.idjezika;
                podatek.innerText = jezik.naziv;
                podatek.onclick = function() {dodajJezik(podatek)};
                data.appendChild(podatek);
            }
        }
    });
    }
    else {
        document.getElementById("isci-jezik").classList.remove("is-valid");
        document.getElementById("isci-jezik").classList.remove("is-invalid");
        data.innerHTML = " ";
    }
}

function dodajJezik(item) {
    let status = document.getElementById("status");

    postData("/delavci/cv/dodaj-jezik",{idjezika:item.value}).then((response)=>{
        if (response.uspelo == false || response.uspelo == undefined) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("jezikiform").prepend(status);
        }
        if (response.uspelo == "duplikat") {
            openStatus(status,"Dodan jezik je že prisoten pri uporabniku.","alert-danger");
            document.getElementById("jezikiform").prepend(status);
        }
        if (response.uspelo == true) {

            let gumb = document.createElement('button');
            let closeIcon = document.createElement('span');

            closeIcon.ariaHidden = true;
            closeIcon.innerHTML = '&times;';

            gumb.classList = "btn btn-success m-1"
            gumb.id = "jezik-"+item.value;
            gumb.innerText = item.innerText+" ";
            gumb.onclick = function() {izbrisiSpretnost(gumb)};

            gumb.appendChild(closeIcon);
            document.getElementById('trenutne-jezik').appendChild(gumb);
        }
    });
}
//izobrazba
function izobrazbaCounter() {
    document.getElementById("opisizobrazbe-length").innerText = document.getElementById("opisizobrazbe").value.length + '/500';
    if (document.getElementById("opisizobrazbe").value.length > 500) {
        document.getElementById("opisizobrazbe").classList.add("is-invalid");
    }
    else {
        document.getElementById("opisizobrazbe").classList.remove("is-invalid");
    }
}

function dodajIzobrazbo(item) {
    let status = document.getElementById("status");

    let izobrazba = {
        naziv:document.getElementById("nazivizobrazbe").value,
        ustanova:document.getElementById("ustanovaizobrazbe").value,
        nivoIzobrazbe:document.getElementById("nivoizobrazbe").value,
        nazivNivoja:document.getElementById("nivoizobrazbe").options[document.getElementById('nivoizobrazbe').selectedIndex].text,
        zacetek: document.getElementById("zacetekizobrazbe").value,
        konec: document.getElementById("konecizobrazbe").value,
        opis: document.getElementById("opisizobrazbe").value
    }
    if (izobrazba.naziv == undefined || izobrazba.naziv == '' || izobrazba.ustanova == undefined || izobrazba.ustanova == '' || izobrazba.nivoIzobrazbe == undefined || izobrazba.nivoIzobrazbe == "" || izobrazba.nazivNivoja == undefined || izobrazba.nazivNivoja == ''
        || izobrazba.zacetek == undefined || izobrazba.zacetek == '' || izobrazba.konec == undefined || izobrazba.konec == '' || izobrazba.opis == undefined || izobrazba.opis == '') {
            openStatus(status,"Obrazec ni popolnoma izpolnjen.","alert-warning");
            document.getElementById("izobrazevanjaform").prepend(status);
        }
    else if (!/^[-1-9a-zžščćđA-ZŽŠĐČĆ ,.:;]+$/.test(izobrazba.naziv) || !/^[-1-9a-zžščćđA-ZŽŠĐČĆ ,.:;]+$/.test(izobrazba.ustanova)) {
        document.getElementById("izobrazevanjaform").prepend(status);
        openStatus(status,"Naziv izobrazbe in ime ustanove lahko vsebuejta samo črke, številke in ločila.","alert-danger");
    }
    else  if (! (Date.parse(izobrazba.zacetek) < Date.parse(izobrazba.konec))) {
        document.getElementById("izobrazevanjaform").prepend(status);
        openStatus(status,"Izobrazba se mora začeti, preden se konča.","alert-danger");
        document.getElementById("zacetekizobrazbe").classList.add("is-invalid");
        document.getElementById("konecizobrazbe").classList.add("is-invalid");
    }
    else if(Date.now() <  Date.parse(izobrazba.zacetek)) {
        document.getElementById("izobrazevanjaform").prepend(status);
        openStatus(status,"Izobrazba se ne sme začeti po današnjem datumu.","alert-danger");
        document.getElementById("zacetekizobrazbe").classList.add("is-invalid");
        document.getElementById("konecizobrazbe").classList.add("is-invalid"); 
    }
    else if (izobrazba.opis.length >500) {
        document.getElementById("izobrazevanjaform").prepend(status);
        openStatus(status,"Opis izobrazbe mora biti krajši od petstotih črk.","alert-danger");
    }
    else postData("/delavci/cv/dodaj-izobrazbo",izobrazba).then((response)=>{
            if (response.uspelo == false) {
                document.getElementById("izobrazevanjaform").prepend(status);
                openStatus(status,"Napaka na strežniku.","alert-danger");
            }
            if (response.uspelo == "zacetek-narobe") {
                document.getElementById("izobrazevanjaform").prepend(status);
                openStatus(status,"Izobrazba se ne sme začeti po današnjem datumu.","alert-danger");
                document.getElementById("zacetekizobrazbe").classList.add("is-invalid");
                document.getElementById("konecizobrazbe").classList.add("is-invalid"); 
            }
            if (response.uspelo == "zacetek-manjsi") {
                document.getElementById("izobrazevanjaform").prepend(status);
                openStatus(status,"Izobrazba se mora začeti, preden se konča.","alert-danger");
                document.getElementById("zacetekizobrazbe").classList.add("is-invalid");
                document.getElementById("konecizobrazbe").classList.add("is-invalid");
            }
            if (response.uspelo == "samo-crke") {
                document.getElementById("izobrazevanjaform").prepend(status);
                openStatus(status,"Naziv izobrazbe in ime ustanove lahko vsebuejta samo črke, številke in ločila.","alert-danger");
            }
            if (response.uspelo == "napacna-vrednost")  {
                document.getElementById("izobrazevanjaform").prepend(status);
                openStatus(status,"Naveden nivo izobrazbe ni pravilen.","alert-danger");
                document.getElementById("nivoizobrazbe").classList.add("is-invalid");
            }
            if (response.uspelo == "prevec-izobrazb") {
                openStatus(status,"Vpisali ste preveliko količino izobraževanj, dovoljeno število je 10.","alert-danger");
                document.getElementById("izobrazevanjaform").prepend(status);
            }
            if (response.uspelo == true) {
                openStatus(status,"Posodobitev uspešna.","alert-success");
                document.getElementById("izobrazevanjaform").prepend(status);

                if (document.getElementById("zacetekizobrazbe").classList.contains("is-invalid") || document.getElementById("konecizobrazbe").classList.contains("is-invalid")) {
                document.getElementById("zacetekizobrazbe").classList.remove("is-invalid");
                document.getElementById("konecizobrazbe").classList.remove("is-invalid");
                document.getElementById("zacetekizobrazbe").classList.add("is-valid");
                document.getElementById("konecizobrazbe").classList.add("is-valid");
                }
 
                let cardContainer = document.createElement("div");
                let cardBody = document.createElement("div");
                let nazivHeading = document.createElement("h5");
                let ustanovaHeading = document.createElement("h6");
                let nivoHeading = document.createElement("h6");
                let opisParagraf = document.createElement("p");
                let datumParagraf = document.createElement("p");
                let deleteButton = document.createElement("button");

                cardContainer.classList = "card mt-3 shadow-sm";
                cardBody.classList = "card-body";
                nazivHeading.classList = "card-subtitle mb-2 text-muted";
                ustanovaHeading.classList = "card-subtitle mb-2 text-muted";
                nivoHeading.classList = "card-subtitle mb-2 text-muted";
                opisParagraf.classList = "card-text";
                datumParagraf.classList = "card-text"
                deleteButton.classList = "btn btn-success";

                
                nazivHeading.innerText = izobrazba.naziv;
                ustanovaHeading.innerText = izobrazba.ustanova;
                datumParagraf.innerText = izobrazba.zacetek + " - " + izobrazba.konec;
                nivoHeading.innerText = izobrazba.nazivNivoja;
                opisParagraf.innerText = izobrazba.opis;
                deleteButton.id="izobrazba-"+response.vstavljenid;
                deleteButton.innerText = "Izbriši ";

                let deleteButtonIcon = document.createElement('span');
                deleteButtonIcon.innerHTML = "&times;";

                deleteButton.onclick = function(){
                    odstraniIzobrazbo(this);
                };
                deleteButton.appendChild(deleteButtonIcon);

                cardBody.appendChild(nazivHeading);
                cardBody.appendChild(ustanovaHeading);
                cardBody.appendChild(nivoHeading);
                cardBody.appendChild(opisParagraf);
                cardBody.appendChild(datumParagraf);
                cardBody.appendChild(deleteButton);

                cardContainer.appendChild(cardBody);                
                document.getElementById("trenutne-izobrazbe").appendChild(cardContainer);
            }
        });
    }

function odstraniIzobrazbo(item) {
    let status = document.getElementById("status");
    let idIzobrazbe = item.id.substring(10);
    postData("/delavci/cv/izbrisi-izobrazbo",{idizobrazbe:idIzobrazbe}).then((response)=>{
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("tabela-izobrazbe-status").appendChild(status);
        }
        if (response.uspelo == true) {
            openStatus(status,"Posodobitev uspešna.","alert-success");
            document.getElementById("tabela-izobrazbe-status").appendChild(status);
            let td = item.parentNode;
            let row = td.parentNode;
            document.getElementById("trenutne-izobrazbe").removeChild(row);
        }
    });
}

//izkusnje

function dodajIzkusnjo(item) {
    let status = document.getElementById("status");
    let izkusnja = {
        nazivpodjetja:document.getElementById("nazivpodjetja").value,
        imemesta:document.getElementById("imemesta-izkusnja").value,
        datumzacetka:document.getElementById("datumzacetka-izkusnja").value,
        datumkonca:document.getElementById("datumkonca-izkusnja").value,
        opisdela:document.getElementById("opisdela").value,
    }
    if (izkusnja.nazivpodjetja == undefined || izkusnja.imemesta == undefined || izkusnja.datumzacetka == undefined || izkusnja.datumkonca == undefined || izkusnja.opisdela == undefined ||
        izkusnja.nazivpodjetja == '' || izkusnja.imemesta == '' || izkusnja.datumzacetka == '' || izkusnja.datumkonca == '' || izkusnja.opisdela == '' ) {
            openStatus(status,"Obrazec ni popolnoma izpolnjen.","alert-warning");
            document.getElementById("izkusnjeform").prepend(status);
    }
    //zacetek konec
    else if (Date.parse(izkusnja.datumzacetka) > Date.parse(izkusnja.datumkonca)) {
        openStatus(status,"Začetek mora priti pred koncem delovne izkušnje.","alert-danger");
        document.getElementById("izkusnjeform").prepend(status);
    }
    //zacetek cez trenuten datum
    else if (Date.now() < Date.parse(izkusnja.datumzacetka)) {
        openStatus(status,"Začetek dela ne sme slediti trenutnemu datumu.","alert-danger");
        document.getElementById("izkusnjeform").prepend(status);
    }
    //naziv podjetja in mesto v podjetju
    else if (!/^[1-9a-zžščćđA-ZŽŠĐČĆ. -,:;]+$/.test(izkusnja.nazivpodjetja) || !/^[1-9a-zžščćđA-ZŽŠĐČĆ. -,:;]+$/.test(izkusnja.imemesta)) {
        openStatus(status,"Ime podjetja in mesto lahko vseubjeta samo črke, številke in ločila.","alert-danger");
        document.getElementById("izkusnjeform").prepend(status);
    }
    else postData("/delavci/cv/dodaj-izkusnjo",izkusnja).then((response)=>{
         if (response.uspelo == "zacetek-konec") {
            openStatus(status,"Začetek mora priti pred koncem delovne izkušnje.","alert-danger");
            document.getElementById("izkusnjeform").prepend(status);
            }
         else if (response.uspelo == "zacetek-narobe") {
            openStatus(status,"Začetek dela ne sme slediti trenutnemu datumu.","alert-danger");
            document.getElementById("izkusnjeform").prepend(status);
            }
         else if (response.uspelo == "prevec-izkusenj") {
            openStatus(status,"Vpišete lahko samo dvajset delovnih izkušenj.","alert-danger");
            document.getElementById("izkusnjeform").prepend(status);
         }
         else if (response.uspelo == "napacne-crke") {
            openStatus(status,"Ime podjetja in mesto lahko vseubjeta samo črke, številke in ločila.","alert-danger");
            document.getElementById("izkusnjeform").prepend(status);
         }
         else if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("izkusnjeform").prepend(status);
         }
         else if (response.uspelo == true) {
                openStatus(status,"Posodobitev uspešna.","alert-success");
                document.getElementById("izkusnjeform").prepend(status);

            /*
                    <div class="card mt-3 shadow-sm" id="trenutne-izkusnje">
                    <div class="card-body">
                    <h5 class="card-title"><%=izkusnja.nazivpodjetja %></h5>
                    <h6 class="card-subtitle mb-2 text-muted"><%=izkusnja.imemesta %></h6>
                    <p class="card-text"><%=izkusnja.datumzacetka %> - <%=izkusnja.datumkonca %></p>
                    <p class="card-text"><%=izkusnja.opisdela%></p>
                    <button class="btn btn-success" id="izkusnja-<%=izkusnja.iddelovneizkusnje %>" onClick="odstraniIzkusnjo(this)">Izbriši <span>&times;</span></button>
                    </div>
                    </div>
            */

                let cardContainer = document.createElement("div");
                let cardBody = document.createElement("div");

                let headingNaziv = document.createElement("h6");

                let headingMesto = document.createElement("h5");
                let paragraphDate = document.createElement("p");
                let paragraphOpis = document.createElement("p");
                
                let deleteButton = document.createElement("button");
                let deleteButtonIcon = document.createElement("span");

                cardContainer.classList = "card mt-3 shadow-sm";
                cardBody.classList = "card-body";
                headingNaziv.classList = "card-title";
                headingMesto.classList = "card-subtitle mb-2 text-muted";
                paragraphDate.classList = "card-text";
                paragraphOpis.classList = "card-text";
                deleteButton.classList = "btn btn-success";

                headingNaziv.innerText = izkusnja.nazivpodjetja;
                headingMesto.innerText = izkusnja.imemesta;
                paragraphDate.innerText = izkusnja.datumzacetka + " - " + izkusnja.datumkonca;
                paragraphOpis.innerText = izkusnja.opisdela;

                deleteButton.innerText = "Izbriši ";
                deleteButtonIcon.innerHTML = "&times;";
                deleteButton.id="izkusnja-"+response.vstavljenid;
                deleteButton.onclick = function(){
                    odstraniIzkusnjo(this);
                };
                deleteButton.appendChild(deleteButtonIcon);

                cardBody.appendChild(headingNaziv);
                cardBody.appendChild(headingMesto);
                cardBody.appendChild(paragraphOpis);
                cardBody.appendChild(paragraphDate);
                cardBody.appendChild(deleteButton);

                cardContainer.appendChild(cardBody);

                document.getElementById("trenutne-izkusnje").appendChild(cardContainer);
            }
        });
}

function odstraniIzkusnjo(item) {
    let status = document.getElementById("status");
    let idizkusnje = item.id.substring(9);

    postData("/delavci/cv/izbrisi-izkusnjo",{idizkusnje:idizkusnje}).then((response)=>{
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("tabela-izkusnje-status").prepend(status);
        }
        if (response.uspelo == true) {
            openStatus(status,"Posodobitev uspešna.","alert-success");
            document.getElementById("tabela-izkusnje-status").prepend(status);

            let td = item.parentNode;
            let row = td.parentNode;
            document.getElementById("trenutne-izkusnje").removeChild(row);
        }
    });
}

function posljiKodo() {
    let potrditvenakoda = document.getElementById("potrditvenakoda").value;
    let status = document.getElementById("status");
    if (document.getElementById("potrditvenakoda").value == '') {
        openStatus(status,"Vnesite potrditveno kodo.","alert-warning");
        document.getElementById("potrditevform").prepend(status);
        document.getElementById("potrditvenakoda").classList.add("is-invalid");
    }
    else if (validateEmailCode(document.getElementById("potrditvenakoda"))) {
    postData("/delavci/acc/verify-email",{potrditvenakoda:potrditvenakoda}).then((response) => {
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