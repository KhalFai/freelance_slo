function posljiOdziv(item) {
    let status= document.getElementById("status");
    let iddela = item.value;
    let tekstprijave = document.getElementById("prijava-"+iddela).value;

    if (!/^[0-9a-zžščćđA-ZŽŠĐČĆ. -,:;']+$/.test(tekstprijave)) {
        openStatus(status,"Besedilo prijave lahko vsebuje samo črke, številke in ločila.","alert-danger");
        document.getElementById("delovlogaform"+iddela).prepend(status);
        document.getElementById("prijava-"+iddela).classList.remove("is-valid");
        document.getElementById("prijava-"+iddela).classList.add("is-invalid");
    }
    else if (tekstprijave.length == undefined || tekstprijave.length < 20) {
        openStatus(status,"Prijava mora biti daljša od dvajsetih znakov.","alert-danger");
        document.getElementById("delovlogaform"+iddela).prepend(status);
        document.getElementById("prijava-"+iddela).classList.remove("is-valid");
        document.getElementById("prijava-"+iddela).classList.add("is-invalid");
    }
    else postData("/delavci/dela/poslji-prijavo",{iddela:iddela,tekstprijave:tekstprijave}).then((response)=>{
            if (response.uspelo == "opozorjen") {
            openStatus(status,"Ko ste opozorjeni, ne morete sprejemati del.","alert-danger");
            document.getElementById("delovlogaform"+iddela).prepend(status);
            }    
            if (response.uspelo == "dvojna-prijava") {
                openStatus(status,"Na delo se lahko prijavite samo enkrat.","alert-danger");
                document.getElementById("delovlogaform"+iddela).prepend(status);
            }
            if (response.uspelo == "prijava-narobe") {
                openStatus(status,"Besedilo prijave ni pravilno oblikovano, vsebuje lahko samo črke, številke in ločila in mora biti daljše od dvajsetih znakov.","alert-danger");
                document.getElementById("delovlogaform"+iddela).prepend(status);
            }
            if (response.uspelo == "iddela-ni") {
                openStatus(status,"Delo, na katerega se prijavljate, ne obstaja.","alert-danger");
                document.getElementById("delovlogaform"+iddela).prepend(status);
            }
            if (response.uspelo == false) {
                openStatus(status,"Napaka na strežniku, poskusite znova.","alert-danger");
                document.getElementById("delovlogaform"+iddela).prepend(status);
            }
            if (response.uspelo == true) {
                openStatus(status,"Vloga poslana.","alert-success");
                document.getElementById("trenutna-dela").prepend(status);

                let container = document.getElementById("delo-container"+iddela);
                container.parentNode.removeChild(container);
            }
        });
}

function vlogaCounter(iddela) {
    let vnos = document.getElementById("prijava-"+iddela);
    let counter = document.getElementById("vloga-counter"+iddela);

    if (vnos.value.length < 20) {
    vnos.classList.remove("is-valid");
    vnos.classList.add("is-invalid")
    counter.classList = "text-danger";
    counter.innerText = "Vnesite še " + (20-vnos.value.length) + " znakov.";
    }
    else {
    vnos.classList.remove("is-invalid");
    counter.innerText = vnos.value.length;
    counter.classList = "text-success";

    if (/^[0-9a-zžščćđA-ZŽŠĐČĆ. -,:;']+$/.test(vnos.value))  {
        vnos.classList.remove("is-invalid");
        vnos.classList.add("is-valid");
    }
    else {
        vnos.classList.remove("is-valid");
        vnos.classList.add("is-invalid");
    }
    
    }
}

function isci() {
    let status=document.getElementById("status");

    let iskanje = {};

    iskanje.naziv = document.getElementById("iskanje-naziv").value;
    iskanje.trajanje = document.getElementById("trajanje").options[document.getElementById('trajanje').selectedIndex].value;
    iskanje.delovnik = document.getElementById("delovniki").options[document.getElementById('delovniki').selectedIndex].value;
    iskanje.vrstaplace = document.getElementById("vrste_place").options[document.getElementById('vrste_place').selectedIndex].value;
    iskanje.podrocje = document.getElementById("isci-podrocje").value;
    iskanje.spretnosti = [];

    iskanje.minplaca = document.getElementById("iskanje-min-placa").value;
    iskanje.maxplaca = document.getElementById("iskanje-max-placa").value;

    if (!/^[a-zžščćđA-ZŽŠĐČĆ0-9 .,:;-]+$/.test(iskanje.naziv) && iskanje.naziv.length > 0) {
        openStatus(status,"Iskanje lahko vsebuje samo črke, številke in ločila.","alert-danger");
        document.getElementById("iskanje-del").prepend(status);    
        document.getElementById("iskanje-naziv").classList.add("is-invalid");
    }

    else {
    for (spretnost of document.getElementById("izbrana-spretnost").childNodes) {
        iskanje.spretnosti.push(spretnost.innerText);
    }

    postData("/delavci/dela/isci-dela",iskanje).then((response)=>{ 
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("iskanje-del").prepend(status);
        }
        if (response.uspelo == "trajanje-narobe") {
            openStatus(status,"Vnos trajanja se ne ujema s podatkovno bazo.","alert-danger");
            document.getElementById("iskanje-del").prepend(status);
        }
        if (response.uspelo == "delovnik-narobe") {
            openStatus(status,"Vnos delovnika se ne ujema s podatkovno bazo.","alert-danger");
            document.getElementById("iskanje-del").prepend(status);
        }
        if (response.uspelo == "vrsta-place-narobe") {
            openStatus(status,"Vnos vrste plače se ne ujema s podatkovno bazo.","alert-danger");
            document.getElementById("iskanje-del").prepend(status);
        }
        if (response.uspelo == "spretnost-narobe") {
            openStatus(status,"Vnos spretnosti se ne ujema s podatkovno bazo.","alert-danger");
            document.getElementById("iskanje-del").prepend(status);
        }
        if (response.uspelo == "naziv-narobe") {
            openStatus(status,"Naziv lahko vsebuje samo črke, številke in ločila.","alert-danger");
            document.getElementById("iskanje-del").prepend(status);
        }
        if (response.uspelo == true) {
            openStatus(status,"Našli smo sledeča dela.","alert-success");
            document.getElementById("iskanje-del").prepend(status);
            document.getElementById("iskanje-naziv").classList.remove("is-invalid");
        
            document.getElementById("trenutna-dela").innerHTML = " ";

            for (delo of response.dela) {            
            let deloContainer = document.createElement("div");
            deloContainer.classList = "card mt-3 shadow-sm";
            deloContainer.id = "delo-container"+delo.iddela;

            let cardBody = document.createElement("div");
            cardBody.classList = "card-body";

            let nazivHeading = document.createElement("h5");
            nazivHeading.classList = "card-title delo-header";
            nazivHeading.innerText = delo.naziv;
            
            cardBody.appendChild(nazivHeading);

            let podrocjeHeading = document.createElement("h6");
            podrocjeHeading.classList = "card-subtitle mb-2 text-muted";
            podrocjeHeading.innerText = delo.imepodrocja;

            cardBody.appendChild(podrocjeHeading);

            let placaHeading = document.createElement("h6");
            placaHeading.classList = "card-subtitle mb-2 text-muted";
            placaHeading.innerText = delo.placa + "€" + " / " + delo.nazivplace;
            
            cardBody.appendChild(placaHeading);
        
            let hrOne = document.createElement("hr");

            cardBody.appendChild(hrOne);

            let opisParagraph = document.createElement("p");
            opisParagraph.classList = "card-text";
            opisParagraph.innerText = delo.opis;

            cardBody.appendChild(opisParagraph);

            let hrTwo = document.createElement("hr");

            cardBody.appendChild(hrTwo);

            let descriptionRow = document.createElement("div");
            descriptionRow.classList = "row";

            cardBody.appendChild(descriptionRow);

            let colOne = document.createElement("div");
            colOne.classList = "col-sm";

            cardBody.appendChild(colOne);

            let izobrazbaParagraph = document.createElement("p");
            izobrazbaParagraph.innerText = "Izobrazba: "+delo.nivoizobrazbe;
            izobrazbaParagraph.classList = "delo-details card-text text-muted";

            let spretnostiParagraph = document.createElement("p");
            spretnostiParagraph.innerText = "Spretnosti: "+delo.spretnosti;
            spretnostiParagraph.classList = "delo-details card-text text-muted";

            colOne.appendChild(izobrazbaParagraph);
            colOne.appendChild(spretnostiParagraph);

            let colTwo = document.createElement("div");
            colTwo.classList = "col-sm";

            let trajanjeParagraph = document.createElement("p");
            trajanjeParagraph.innerText = "Trajanje: "+delo.nazivtrajanja;
            trajanjeParagraph.classList = "delo-details card-text text-muted";
            
            colTwo.appendChild(trajanjeParagraph);

            let delovnikParagraph = document.createElement("p");
            delovnikParagraph.innerText = "Delovnik: "+delo.nazivdelovnika;
            delovnikParagraph.classList = "delo-details card-text text-muted";

            colTwo.appendChild(delovnikParagraph);

            descriptionRow.appendChild(colOne);
            descriptionRow.appendChild(colTwo);
            
            cardBody.appendChild(descriptionRow);
       
            let hrThree = document.createElement("hr");

            cardBody.appendChild(hrThree);

            let podjetjeButton = document.createElement("button");
            podjetjeButton.classList = "btn btn-sm btn-success m-1";
            podjetjeButton.setAttribute("data-toggle","modal");
            podjetjeButton.setAttribute("data-target","#podjetje-modal");
            podjetjeButton.value = delo.idpodjetja;
            podjetjeButton.setAttribute('onclick','podjetjePodatki(this)');
            podjetjeButton.innerText = "Podatki o podjetju";

            let prijavaButton = document.createElement("button");
            prijavaButton.classList = "btn btn-sm btn-success m-1";
            prijavaButton.setAttribute("type","button");
            prijavaButton.setAttribute("data-toggle","collapse");
            prijavaButton.setAttribute("data-target","#collapseDelo"+delo.iddela);
            prijavaButton.setAttribute("aria-expanded","false");
            prijavaButton.setAttribute("aria-controls","collapseDelo"+delo.iddela);
            prijavaButton.innerText = "Prijavi se!";

            let neprimernoButton = document.createElement("button");
            neprimernoButton.classList = "btn btn-sm btn-danger m-1";
            neprimernoButton.setAttribute("type","button");
            neprimernoButton.setAttribute("data-toggle","collapse");
            neprimernoButton.setAttribute("data-target","#collapseDeloPrijava"+delo.iddela);
            neprimernoButton.setAttribute("aria-expanded","false");
            neprimernoButton.setAttribute("aria-controls","collapseDeloPrijava"+delo.iddela);
            neprimernoButton.innerText = "Prijavi neprimerno vsebino!";


            cardBody.appendChild(podjetjeButton);
            cardBody.appendChild(prijavaButton);
            cardBody.appendChild(neprimernoButton);

            let prijavaCollapseDiv = document.createElement("div");
            prijavaCollapseDiv.classList = "collapse";
            prijavaCollapseDiv.id = "collapseDelo"+delo.iddela;

            let vlogaFormDiv = document.createElement("div");
            vlogaFormDiv.classList = "mt-2 p-2 border";
            vlogaFormDiv.id = "delovlogaform"+delo.iddela;

            let vlogaLabel = document.createElement("label");
            vlogaLabel.for = "oddaja"+delo.iddela;
            vlogaLabel.innerText="Vloga:";

            vlogaFormDiv.appendChild(vlogaLabel);

            let vlogaTextarea = document.createElement("textarea");
            vlogaTextarea.classList = "form-control gf-to-validate";
            vlogaTextarea.name = "oddaja"+delo.iddela;
            vlogaTextarea.placeholder = "Za delo sem dobra izbira, saj...";
            vlogaTextarea.id = "prijava-"+delo.iddela;
            vlogaTextarea.setAttribute("oninput","vlogaCounter("+delo.iddela+")");

            vlogaFormDiv.appendChild(vlogaTextarea);

            let vlogaSmall = document.createElement("small");
            vlogaSmall.classList = "text-muted";
            vlogaSmall.innerText = "Besedilo prijave lahko vsebuje samo črke, števila in ločila."

            vlogaFormDiv.appendChild(vlogaSmall);

            let vlogaBr = document.createElement("br");
            vlogaFormDiv.appendChild(vlogaBr);

            let vlogaCounter = document.createElement("small");
            vlogaCounter.id = "vloga-counter"+delo.iddela;
            vlogaCounter.classList = "text-muted";

            vlogaFormDiv.appendChild(vlogaCounter);

            vlogaFormDiv.appendChild(vlogaBr);

            let vlogaSubmit = document.createElement("button");
            vlogaSubmit.classList = "btn btn-sm btn-success mt-2";
            vlogaSubmit.value = delo.iddela;
            vlogaSubmit.setAttribute("onclick","posljiOdziv(this)")
            vlogaSubmit.innerText = "Pošlji odziv.";

            vlogaFormDiv.appendChild(vlogaSubmit);

            prijavaCollapseDiv.appendChild(vlogaFormDiv);

            cardBody.appendChild(prijavaCollapseDiv);

            /* 
                <label for="prijava<%=delo.iddela%>">Pritožba:</label>    
                <textarea name="prijava<%=delo.iddela%>" class="form-control" id="prijava-tekst-<%=delo.iddela%>" placeholder="Delo ni primerno, saj..."></textarea>
                <button class="btn btn-sm btn-danger mt-2" value=<%=delo.iddela%> onclick="prijaviDelo(this)">Prijavi neprimerno vsebino</button>
            */

            let neprimernoCollapseDiv = document.createElement("div");
            neprimernoCollapseDiv.classList = "collapse";
            neprimernoCollapseDiv.id = "collapseDeloPrijava"+delo.iddela;

            let neprimernoFormDiv = document.createElement("div");
            neprimernoFormDiv.id = "delopritozbaform"+delo.iddela;
            neprimernoFormDiv.classList = "mt-2 p-2 border";

            let neprimernoLabel = document.createElement("label");
            neprimernoLabel.for = "prijava"+delo.iddela;
            neprimernoLabel.innerText = "Pritožba";
            
            neprimernoFormDiv.appendChild(neprimernoLabel);

            let neprimernoTextarea = document.createElement("textarea");
            neprimernoTextarea.name = "prijava"+delo.iddela;
            neprimernoTextarea.classList = "form-control";
            neprimernoTextarea.id = "prijava-tekst-"+delo.iddela;
            neprimernoTextarea.placeholder = "Delo ni primerno, saj..."

            neprimernoFormDiv.appendChild(neprimernoTextarea);

            let neprimernoConButton = document.createElement("button");
            neprimernoConButton.classList = "btn btn-sm btn-danger mt-2";
            neprimernoConButton.value = delo.iddela;
            neprimernoConButton.setAttribute("onclick","prijaviDelo(this)");
            neprimernoConButton.innerText = "Prijavi neprimerno vsebino.";

            neprimernoFormDiv.appendChild(neprimernoConButton);

            neprimernoCollapseDiv.appendChild(neprimernoFormDiv);
            cardBody.appendChild(neprimernoCollapseDiv);

            deloContainer.appendChild(cardBody);

            document.getElementById("trenutna-dela").prepend(deloContainer);
            }
        }
    });
    }
}

function isciSpretnost(item) {
    let iskanaspretnost = item.value;
    let data = document.getElementById("najdena-spretnost");
    let status = document.getElementById("status");

    if (iskanaspretnost.length > 1) {
    postData("/podjetja/dela/isci-spretnost",{iskanaspretnost:iskanaspretnost}).then((response)=>{
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("naprednoIskanje").prepend(status);
        }
        if (response.uspelo == undefined) {
            openStatus(status,"Iskana spretnost ne obstaja.","alert-danger");
            document.getElementById("naprednoIskanje").prepend(status);

            document.getElementById("isci-spretnost").classList.remove("is-valid");
            document.getElementById("isci-spretnost").classList.add("is-invalid");
        }
        else {
            document.getElementById("isci-spretnost").classList.remove("is-invalid");
            document.getElementById("isci-spretnost").classList.add("is-valid");

            data.innerHTML = " ";
            for (spretnost of response.uspelo) {
                let podatek = document.createElement('button');
                podatek.value = spretnost.idspretnosti;
                podatek.classList = "btn btn-outline-success m-1";
                podatek.innerText = spretnost.naziv;
                podatek.onclick = function() {
                    dodajSpretnost(this);
                }
                data.appendChild(podatek);
            }
        }
    });
    }
    else {
        data.innerHTML = " ";
        document.getElementById("isci-spretnost").classList.remove("is-invalid");
        document.getElementById("isci-spretnost").classList.remove("is-valid");
    }
}

function dodajSpretnost(item) {
    let podvojen = false;
    let status=document.getElementById("status");

    for (spretnost of document.getElementById("izbrana-spretnost").childNodes) {
        if (spretnost.innerText == item.innerText) podvojen = true;
    }

    if (podvojen == false) {
    let gumb = document.createElement('button');

    gumb.classList = "btn btn-success m-1"
    gumb.name = "spretnost";
    gumb.innerText = item.innerText;
    gumb.value=item.value
    gumb.onclick = function() {izbrisiSpretnost(gumb)};

    document.getElementById("izbrana-spretnost").appendChild(gumb);}
    else {
        openStatus(status,"Spretnost je že v seznamu iskanja.","alert-danger");
        document.getElementById("naprednoIskanje").prepend(status);
    }
}

function izbrisiSpretnost(item) {
    item.parentNode.removeChild(item);
};

function isciPodrocje(item) {
    let status = document.getElementById("status");
    let rezultati = document.getElementById("najdeno-podrocje");
    rezultati.innerHTML = "";

    let iskanje = item.value;

    if (!/^[a-zžščćđA-ZŽŠĐČĆ0-9 ]+$/.test(iskanje) && iskanje.length > 1) {
        openStatus(status,"Področja podjetji vsebujejo samo črke in številke.","alert-danger");
        document.getElementById("naprednoIskanje").prepend(status);

        item.classList.remove("is-valid");
        item.classList.add("is-invalid");
    }
    else if (iskanje.length > 1) {
    postData("/podjetja/dela/isci-podrocje",{iskanje:iskanje}).then((response) => {
        if (response.uspelo == "narobe-iskanje") {
            openStatus(status,"Področja podjetji vsebujejo samo črke in številke.","alert-danger");
            document.getElementById("naprednoIskanje").prepend(status);

            item.classList.remove("is-valid");
            item.classList.add("is-invalid");
        }
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("naprednoIskanje").prepend(status);

            item.classList.remove("is-valid");
            item.classList.add("is-invalid");
        } 
        if (response.uspelo == true) {
            if (response.podrocja.length > 0) {
            item.classList.remove("is-invalid");
            item.classList.add("is-valid");
            }
            else {
                item.classList.remove("is-valid");
                item.classList.add("is-invalid");
            }

            for (podrocje of response.podrocja) {
            let podatek = document.createElement('button');
            podatek.classList = "btn btn-outline-success mr-1 mt-2 mb-2";
            podatek.innerText = podrocje.imepodrocja;
            podatek.onclick = function() {
                document.getElementById("isci-podrocje").value = podatek.innerText;
                document.getElementById("najdeno-podrocje").innerHTML = "";
            };
            rezultati.appendChild(podatek);
            }

        }
    });
    }
    else {
        rezultati.innerHTML = "";
        item.classList.remove("is-invalid");
        item.classList.remove("is-valid");
    }
}

function delaSprejet(item) {
    let status = document.getElementById("status");
    document.getElementById("dela-sprejet").innerHTML = "";

    document.getElementById("dela-sprejet").classList.remove("fadein");

    getData("/delavci/dela/sprejet-dela",{}).then((response) => {
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("dela-sprejet").prepend(status);
        }
        if (response.uspelo == "opozorjen") {
            openStatus(status,"Prijave na dela niso vidne, ko ste opozorjeni.","alert-danger");
            document.getElementById("dela-sprejet").prepend(status);
        }
        if (response.uspelo == "seje-ni") {
            openStatus(status,"Vaša seja je potekla, prijavite se znova.","alert-danger");
            document.getElementById("dela-sprejet").appendChild(status);
        }
        if (response.uspelo == true) {
            document.getElementById("dela-sprejet").classList.add("fadein");

            /*
              <div id="delo-container<%=delo.iddela%>" class="card mt-3 shadow-sm">
              <div class="card-body">
                <h5 class="card-title delo-header"><%=delo.naziv%></h5>
                <h6 class="card-subtitle mb-2 text-muted"><%=delo.imepodrocja%></h6>
                <h6 class="card-subtitle mb-2 text-muted"><%=delo.placa%>€ / <%=delo.nazivplace%></h6>
                <hr>
                <p class="card-text"><%=delo.opis%></p>
                <hr>
                <div class="row">
                  <div class="col-sm">
                <p class="card-text text-muted delo-details">Izobrazba: <%=delo.nivoizobrazbe%></p>
                <p class="card-text text-muted delo-details">Spretnosti: <%=delo.spretnosti%></p>
                  </div>
                  <div class="col-sm">
                <p class="card-text text-muted delo-details">Trajanje: <%=delo.nazivtrajanja%></p>
                <p class="card-text text-muted delo-details">Delovnik: <%=delo.nazivdelovnika%></p>
                  </div>
                </div>
                <hr>
            */

            item.innerHTML = '<img class="gf-nav-icon mr-2" style="width:15px;height:15px;" src="/icon/refresh_black.svg"></img><span> Zaposlitve</span>';

            if (response.dela.length == 0 ) {
                let div1 = document.createElement('div');
                div1.id = "empty-responses";
                div1.classList = "card mt-3 shadow-sm";

                let div2 = document.createElement('div');
                div2.classList = "card-body";

                let image = document.createElement('img');
                image.classList = "rounded mx-auto d-block gf-empty-icon";
                image.src = "/icon/empty.svg";

                let header = document.createElement('h6');
                header.classList = "text-center mt-3 mb-3";
                header.innerText = "Za zdaj nimate zaposlitev...";

                div2.appendChild(image);
                div2.appendChild(header);
                div1.appendChild(div2);

                document.getElementById("dela-sprejet").appendChild(div1);

            }
            else {
            document.getElementById("dela-sprejet").innerHTML = "";

            for (delo of response.dela) {
            
            let deloContainer = document.createElement("div");
            deloContainer.classList = "card mt-3 shadow-sm";
            deloContainer.name = "delo-container"+delo.iddela;
            
            let deloCard = document.createElement("div");
            deloCard.classList = "card-body";

            let naziv = document.createElement("h5");
            naziv.classList = "card-title delo-header";
            naziv.innerText = delo.naziv;

            deloCard.appendChild(naziv);

            let imepodrocja = document.createElement("h6");
            imepodrocja.innerText = delo.imepodrocja;
            imepodrocja.classList = "card-subtitle mb-2 text-muted";
            deloCard.appendChild(imepodrocja);

            let placa = document.createElement("h6");
            placa.classList = "card-subtitle mb-2 text-muted";
            placa.innerText = delo.placa+"€ /"+delo.nazivplace;
            deloCard.appendChild(placa);

            let hr = document.createElement("hr");
            deloCard.appendChild(hr);

            let opis = document.createElement("p");
            opis.classList = "card-text"
            opis.innerText = delo.opis;
            deloCard.appendChild(opis);
            
            deloCard.appendChild(hr);

            let row = document.createElement("div");
            row.classList = "row";

            let colOne = document.createElement("div");
            colOne.classList = "col-sm";

            let nivoizobrazbe = document.createElement("p");
            nivoizobrazbe.innerText = "Izobrazba: " + delo.nivoizobrazbe;
            nivoizobrazbe.classList = "text-muted card-text delo-details"
            colOne.appendChild(nivoizobrazbe);

            let spretnosti = document.createElement("p");
            spretnosti.innerText = "Spretnosti: " + delo.spretnosti;
            spretnosti.classList = "text-muted card-text delo-details"

            colOne.appendChild(spretnosti);

            let colTwo = document.createElement("div");
            colTwo.classList = "col-sm";

            let nazivtrajanja = document.createElement("p");
            nazivtrajanja.innerText = "Trajanje: " + delo.nazivtrajanja;
            nazivtrajanja.classList = "text-muted card-text delo-details";
            colTwo.appendChild(nazivtrajanja);

            let nazivdelovnika = document.createElement("p");
            nazivdelovnika.innerText = "Delovnik: " + delo.nazivdelovnika;
            nazivdelovnika.classList = "text-muted card-text delo-details";
            colTwo.appendChild(nazivdelovnika);
            
            row.appendChild(colOne);
            row.appendChild(colTwo);
            deloCard.appendChild(row);

            let hr2 = document.createElement("hr");
            deloCard.appendChild(hr2);    

            let eposta = document.createElement("p");
            eposta.innerText = "Eposta: " + delo.eposta;
            deloCard.appendChild(eposta);

            let telefon = document.createElement("p");
            if (delo.telefonska != null) telefon.innerText = "Telefon: " + delo.telefonska;
            else telefon.innerText = "Podatka ni.";
            deloCard.appendChild(telefon);

            let hr3 = document.createElement("hr");
            deloCard.appendChild(hr3);
            
            let podjetjeButton = document.createElement("button");
            podjetjeButton.classList = "btn btn-sm btn-success m-1";
            podjetjeButton.setAttribute("data-toggle","modal");
            podjetjeButton.setAttribute("data-target","#podjetje-modal");
            podjetjeButton.value = delo.idpodjetja;
            podjetjeButton.setAttribute('onclick','podjetjePodatki(this)');
            podjetjeButton.innerText = "Podatki o podjetju";

            deloCard.appendChild(podjetjeButton);

            deloContainer.appendChild(deloCard);

            document.getElementById("dela-sprejet").appendChild(deloContainer);
            }}
        }
    });
}

function podjetjePodatki(item) {
    let status = document.getElementById("status");
    getData("/delavci/dela/podatki-podjetje/"+item.value,{}).then((response) => {
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku","alert-danger");
            document.getElementById("podjetje-modal").prepend(status);
        }
        if (response.uspelo == "podjetja-ni") {
            openStatus(status,"Iskano podjetje ne obstaja.","alert-danger");
            document.getElementById("podjetje-modal").prepend(status);
        }
        if (response.uspelo == true) {
            document.getElementById("podjetje-naziv").innerText = response.podjetje.naziv + " " + response.podjetje.vrstapodjetja;
            
            if (response.podjetje.imepodrocja != null) document.getElementById("podjetje-podrocje").innerText = response.podjetje.imepodrocja;
            else document.getElementById("podjetje-podrocje").innerText = "Podatka ni.";

            if (response.podjetje.naslov != null) document.getElementById("podjetje-naslov").innerText = response.podjetje.naslov;
            else document.getElementById("podjetje-naslov").innerText = "Podatka ni.";

            if (response.podjetje.velikost != null) document.getElementById("podjetje-velikost").innerText = response.podjetje.velikost + " zaposlenih";
            else document.getElementById("podjetje-velikost").innerText = "Podatka ni.";

            if (response.podjetje.datum_ustanovitve != null) document.getElementById("podjetje-ustanovitev").innerText = response.podjetje.datum_ustanovitve;
            else document.getElementById("podjetje-ustanovitev").innerText = "Podatka ni.";

            document.getElementById("podjetje-email").innerText = response.podjetje.eposta;

            if (response.podjetje.telefonska != null) document.getElementById("podjetje-telefon").innerText = response.podjetje.telefonska;
            else document.getElementById("podjetje-telefon").innerText = "Podatka ni.";

            document.getElementById("prijavi-podjetje").value = response.podjetje.idpodjetja;
        }
    });
}

function prijaviDelo(item) {
    let iddela = item.value;
    let prijava_tekst = document.getElementById("prijava-tekst-"+iddela).value;
    let status = document.getElementById("status");
    if (!/^[0-9a-zžščćđA-ZŽŠĐČĆ. -,:;'?!*]+$/.test(prijava_tekst)) {
        openStatus(status,"Besedilo prijave lahko vsebuje samo črke, številke in ločila.","alert-danger");
        document.getElementById("delopritozbaform"+iddela).prepend(status);
        document.getElementById("prijava-tekst-"+iddela).classList.add("is-invalid");
    }
    else postData("/delavci/dela/prijavi-neprimerno",{iddela:iddela,prijava_tekst:prijava_tekst}).then((response) => {
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("delopritozbaform"+iddela).prepend(status);
        }
        if (response.uspelo == "opozorjen") {
            openStatus(status,"Ko ste opozorjeni, ne morete prijavljati del.","alert-danger");
            document.getElementById("delopritozbaform"+iddela).prepend(status);
        }    
        if (response.uspelo == "dela-ni") {
            openStatus(status,"Delo ne obstaja.","alert-danger");
            document.getElementById("delopritozbaform"+iddela).prepend(status);
        }
        if (response.uspelo == "tekst-narobe") {
            openStatus(status,"Besedilo prijave lahko vsebuje samo črke, številke in ločila.","alert-danger");
            document.getElementById("delopritozbaform"+iddela).prepend(status);
            document.getElementById("prijava-tekst-"+iddela).classList.add("is-invalid");
        }
        if (response.uspelo == true) {
            openStatus(status,"Delo je prijavljeno.","alert-success");
            document.getElementById("trenutna-dela").prepend(status);

            let container = document.getElementById("delo-container"+iddela);
            container.parentNode.removeChild(container);
        }
    });
};

function prijaviPodjetje(item) {
    let status = document.getElementById("status");
    let idpodjetja = item.value;
    let pojasnilo = document.getElementById("podjetje-prijava").value;

    if (!/^[0-9a-zžščćđA-ZŽŠĐČĆ. -,:;'?!*]+$/.test(pojasnilo)) {
        openStatus(status,"Besedilo prijave lahko vsebuje samo črke, števila in ločila.","alert-danger");
        document.getElementById("podjetjeprijavaform").prepend(status);
        document.getElementById("podjetje-prijava").classList.add('is-invalid')
    }
    else postData("/delavci/dela/prijavi-podjetje",{idpodjetja:idpodjetja,pojasnilo:pojasnilo}).then((response) => {
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("podjetjeprijavaform").prepend(status);
        }
        if (response.uspelo == "opozorjen") {
            openStatus(status,"Ko ste opozorjeni, ne morete prijavljati podjetji.","alert-danger");
            document.getElementById("podjetjeprijavaform").prepend(status);
        }    
        if (response.uspelo == "ze-prijavljen") {
            openStatus(status,"Podjetje je že prijavljeno, neprimerna vsebina bo v kratkem odstranjena.","alert-danger");
            document.getElementById("podjetjeprijavaform").prepend(status);
        }    
        if (response.uspelo == "besedilo-narobe") {
            openStatus(status,"Besedilo prijave lahko vsebuje samo črke, števila in ločila.","alert-danger");
            document.getElementById("podjetjeprijavaform").prepend(status);
        }
        if (response.uspelo == "podjetja-ni") {
            openStatus(status,"Podjetje ne obstaja.","alert-danger");
            document.getElementById("podjetjeprijavaform").prepend(status);
        }
        if (response.uspelo == "seje-ni") {
            openStatus(status,"Niste prijavljeni, poskusite znova.","alert-danger");
            document.getElementById("podjetjeprijavaform").prepend(status);
        }
        if (response.uspelo == true) {
            openStatus(status,"Podjetje je prijavljeno.","alert-success");
            document.getElementById("podjetjeprijavaform").prepend(status);
        }
    });
}