function isciPodrocje(item) {
    let status = document.getElementById("status");
    let rezultati = document.getElementById("najdeno-podrocje");
    rezultati.innerHTML = "";

    let iskanje = item.value;

    if (!/^[a-zžščćđA-ZŽŠĐČĆ0-9 ]+$/.test(iskanje) && iskanje.length >= 1) {
        openStatus(status,"Področja podjetji ne vsebujejo posebnih znakov, samo črke in številke.","alert-danger");
        document.getElementById("dodajdeloformtop").prepend(status);

        item.classList.add("is-invalid");
    }
    if (iskanje.length > 1) {
    postData("/podjetja/dela/isci-podrocje",{iskanje:iskanje}).then((response) => {
        if (response.uspelo == "narobe-iskanje") {
            openStatus(status,"Področja podjetji ne vsebujejo posebnih znakov, samo črke in številke.","alert-danger");
            document.getElementById("dodajdeloformtop").prepend(status);
        }
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("dodajdeloformtop").prepend(status);
        }
        if (response.uspelo == true) {
            if (response.podrocja.length < 1) {
            openStatus(status,"Vaše iskanje ni vrnilo rezultatov.","alert-danger");
            document.getElementById("dodajdeloformtop").prepend(status);

            item.classList.remove("is-valid");
            item.classList.add("is-invalid");
            }
            else {
            item.classList.remove("is-invalid");
            item.classList.add("is-valid");
            }
            for (podrocje of response.podrocja) {
            let podatek = document.createElement('button');
            podatek.classList = "btn btn-outline-primary mr-2 mt-2 mb-2";
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
    }
}

function isciSpretnost(item) {
    let status = document.getElementById("status");
    let iskanaspretnost = item.value;
    let data = document.getElementById("najdena-spretnost");
    if (iskanaspretnost.length > 1) {
    postData("/podjetja/dela/isci-spretnost",{iskanaspretnost:iskanaspretnost}).then((response)=>{
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("dodajdeloformtop").prepend(status);

            item.classList.remove("is-valid");
            item.classList.add("is-invalid");
        }
        if (response.uspelo == undefined) {
            openStatus(status,"Iskana spretnost ne obstaja.","alert-danger");
            document.getElementById("dodajdeloformtop").prepend(status);

            item.classList.remove("is-valid");
            item.classList.add("is-invalid");
        }
        else {
            data.innerHTML = " ";

            if (response.uspelo.length > 0) {
                item.classList.remove("is-invalid");
                item.classList.add("is-valid");
            }

            for (spretnost of response.uspelo) {
                let podatek = document.createElement('button');
                podatek.value = spretnost.idspretnosti;
                podatek.innerText = spretnost.naziv;
                podatek.classList = "btn btn-outline-primary mr-2 mb-2 mt-2";
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
    }
}

function dodajSpretnost(item) {
    let entry = document.createElement("button");

    entry.name = "spretnost";
    entry.innerText = item.innerText;
    entry.value = item.value;
    entry.onclick = function() {izbrisiSpretnost(this);}
    entry.classList = "btn btn-primary mr-2 mt-2 mb-2";

    document.getElementById("izbrana-spretnost").appendChild(entry);
}

function izbrisiSpretnost(item) {
    item.parentNode.removeChild(item);
};

function posljiDelo() {
    let status = document.getElementById("status");
    let delo = {}

    delo.naziv = document.getElementById("delo-naziv").value;
    delo.opis = document.getElementById("delo-opis").value;
    delo.placa = document.getElementById("delo-placa").value;
    delo.podrocje = document.getElementById("isci-podrocje").value;

    delo.nivoizobrazbe = document.getElementById("nivoizobrazbe").options[document.getElementById('nivoizobrazbe').selectedIndex].value;
    let nazivizobrazbe = document.getElementById("nivoizobrazbe").options[document.getElementById('nivoizobrazbe').selectedIndex].innerText;

    delo.trajanje = document.getElementById("trajanje").options[document.getElementById('trajanje').selectedIndex].value;
    let nazivtrajanja = document.getElementById("trajanje").options[document.getElementById('trajanje').selectedIndex].innerText;

    delo.delovnik = document.getElementById("delovniki").options[document.getElementById('delovniki').selectedIndex].value;
    let nazivdelovnika = document.getElementById("delovniki").options[document.getElementById('delovniki').selectedIndex].innerText;

    delo.vrstaplace = document.getElementById("vrste_place").options[document.getElementById('vrste_place').selectedIndex].value;
    let nazivvrsteplace = document.getElementById("vrste_place").options[document.getElementById('vrste_place').selectedIndex].innerText;
    
    delo.spretnosti = [];

    for (spretnost of document.getElementById("izbrana-spretnost").childNodes) {
        if (spretnost.childNodes[0] != undefined) {
            delo.spretnosti.push(spretnost.innerText)
        }
    }
    if (delo.naziv == "" || delo.naziv == undefined ||
        delo.opis == "" || delo.opis == undefined ||
        delo.placa == "" || delo.placa == undefined ||
        delo.podrocje == "" || delo.podrocje == undefined ||
        delo.nivoizobrazbe == "" || delo.nivoizobrazbe == undefined ||
        delo.trajanje == "" || delo.trajanje == undefined ||
        delo.delovnik == "" || delo.delovnik == undefined ||
        delo.vrstaplace == "" || delo.vrstaplace == undefined ||
        delo.spretnosti.length < 1
        ) {
            openStatus(status,"Izpolnite celoten obrazec.","alert-warning");
            document.getElementById("dodajdeloformtop").prepend(status);
        }
    //naziv
    else if (!/^[a-zžščćđA-ZŽŠĐČĆ0-9 .,:;-]+$/.test(delo.naziv) || !/^[a-zžščćđA-ZŽŠĐČĆ0-9 .,:;-]+$/.test(delo.opis)) {
        openStatus(status,"Opis ali naziv dela ni pravilno vpisan, mora vsebovati samo črke, številke in ločila","alert-danger");
        document.getElementById("dodajdeloformtop").prepend(status);

        document.getElementById("delo-opis").classList.add("is-invalid");
        document.getElementById("delo-naziv").classList.add("is-invalid");
    }
    //ali je obrazec izpolnjen?
    else postData("/podjetja/dela/dodaj-delo",delo).then((response)=>{
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("dodajdeloformtop").prepend(status);
        }
        if (response.uspelo == "seja-narobe") {
            openStatus(status,"Niste prijavljeni. Poskusite znova.","alert-danger");
            document.getElementById("dodajdeloformtop").prepend(status);
        }
        if (response.uspelo == "opozorjen") { 
            openStatus(status,"Ko ste opozorjeni, ne smete ustvarjati novih del.","alert-danger");
            document.getElementById("dodajdeloformtop").prepend(status);
        }
        if (response.uspelo == "naziv-opis-narobe") {
            openStatus(status,"Opis ali naziv dela ni pravilno vpisan, mora vsebovati samo črke, številke in ločila","alert-danger");
            document.getElementById("dodajdeloformtop").prepend(status);
        }
        if (response.uspelo == "placa-narobe") {
            openStatus(status,"Plača mora biti večja od 0.","alert-danger");
            document.getElementById("dodajdeloformtop").prepend(status);

            document.getElementById("delo-placa").classList.add("is-invalid");
        }
        if (response.uspelo == "podrocje-narobe") {
            openStatus(status,"Področje dela se ne ujema s podatkovno bazo.","alert-danger");
            document.getElementById("dodajdeloformtop").prepend(status);

            document.getElementById("isci-podrocje").classList.add("is-invalid");
        }
        if (response.uspelo == "nivoizobrazbe-narobe") {
            openStatus(status,"Nivo izobrazbe se ne ujema s podatkovno bazo.","alert-danger");
            document.getElementById("dodajdeloformtop").prepend(status);

            document.getElementById("nivoizobrazbe").classList.add("is-invalid");
        }
        if (response.uspelo == "trajanje-narobe") {
            openStatus(status,"Trajanje dela se ne ujema s podatkovno bazo.","alert-danger");
            document.getElementById("dodajdeloformtop").prepend(status);

            document.getElementById("trajanje").classList.add("is-invalid");
        }
        if (response.uspelo == "delovnik-narobe") {
            openStatus(status,"Delovnik se ne ujema s podatkovno bazo.","alert-danger");
            document.getElementById("dodajdeloformtop").prepend(status);

            document.getElementById("delovniki").classList.add("is-invalid");
        }
        if (response.uspelo == "vrsta-place-narobe") {
            openStatus(status,"Vrsta plače se ne ujema s podatkovno bazo.","alert-danger");
            document.getElementById("dodajdeloformtop").prepend(status);

            document.getElementById("vrste_place").classList.add("is-invalid");
        }
        if (response.uspelo == "spretnost-narobe") {
            openStatus(status,"Spretnosti se ne ujemajo s podatkovno bazo.","alert-danger");
            document.getElementById("dodajdeloformtop").prepend(status);

            document.getElementById("isci-spretnost").classList.add("is-invalid");
        }
        if (response.uspelo == true) {
            openStatus(status,"Delo ustvarjeno.","alert-success");
            document.getElementById("dodajdeloformtop").prepend(status);

            if (document.getElementById("empty-feed") != null) document.getElementById("empty-feed").parentNode.removeChild(document.getElementById("empty-feed"));

            document.getElementById("delo-opis").classList.remove("is-invalid");
            document.getElementById("delo-placa").classList.remove("is-invalid");

            let deloDiv = document.createElement("div");
            deloDiv.classList = "card mt-3 shadow-sm";
            deloDiv.id = "delo-container-"+response.iddela;

            let deloCard = document.createElement("div");
            deloCard.classList = "card-body";
            
            let headerRow = document.createElement("div");
            headerRow.classList = "row";

            let headerCol = document.createElement("div");
            headerCol.classList = "col";

            let nazivHeader = document.createElement("h5");
            nazivHeader.classList = "card-title delo-header";
            nazivHeader.id="prikaz-naziv-"+response.iddela;
            nazivHeader.innerText = delo.naziv;
            headerCol.appendChild(nazivHeader);

            let podrocjeHeader = document.createElement("h6");
            podrocjeHeader.classList = "card-subtitle mb-2 text-muted";
            podrocjeHeader.id="prikaz-podrocje-"+response.iddela;
            podrocjeHeader.innerText = delo.podrocje;
            headerCol.appendChild(podrocjeHeader);

            let placaHeader = document.createElement("h6");
            placaHeader.classList = "card-subtitle mb-2 text-muted";
            placaHeader.innerText = delo.placa + " / " + nazivvrsteplace;
            placaHeader.id="prikaz-placa-"+response.iddela;
            headerCol.appendChild(placaHeader);

            headerRow.appendChild(headerCol);

            let headerCol2 = document.createElement("div");
            headerCol2.classList = "col justify-content-end d-flex";

            let urediButton = document.createElement("button");
            urediButton.type = "button";
            urediButton.classList = "btn btn-primary mt-4 mb-4";
            urediButton.setAttribute("data-toggle","modal");
            urediButton.setAttribute("data-target","#dodajdeloModal");
            urediButton.setAttribute("onclick","modalUredi(this)");
            urediButton.innerText = "Uredi";
            urediButton.value = response.iddela;

            headerCol2.appendChild(urediButton);

            headerRow.appendChild(headerCol2);
            deloCard.appendChild(headerRow);

            let hr = document.createElement("hr");
            deloCard.appendChild(hr);

            let opisParagraph = document.createElement("p");
            opisParagraph.classList = "card-text";
            opisParagraph.innerText = delo.opis;
            opisParagraph.id = "prikaz-opis-"+response.iddela;
            deloCard.appendChild(opisParagraph);

            let hr2 = document.createElement("hr");
            deloCard.appendChild(hr2);

            let sanirane_spretnosti = new Set(delo.spretnosti);
            sanirane_spretnosti = [...sanirane_spretnosti];

            let row = document.createElement("div");
            row.classList = "row";

            let colOne = document.createElement("div");
            colOne.classList = "col-sm";

            let izobrazbaParagraph = document.createElement("p");
            izobrazbaParagraph.classList = "card-text text-muted delo-details";
            izobrazbaParagraph.innerText = "Izobrazba: "+nazivizobrazbe;
            izobrazbaParagraph.id = "prikaz-izobrazba-"+response.iddela;

            let spretnostiParagraph = document.createElement("p");
            spretnostiParagraph.classList = "card-text text-muted delo-details";
            spretnostiParagraph.innerText = "Spretnosti: "+sanirane_spretnosti.join(", ");
            spretnostiParagraph.id = "prikaz-spretnosti-"+response.iddela;

            colOne.appendChild(izobrazbaParagraph);
            colOne.appendChild(spretnostiParagraph);

            row.appendChild(colOne);

            let colTwo = document.createElement("div");
            colTwo.classList = "col-sm";

            let trajanjeParagraph = document.createElement("p");
            trajanjeParagraph.classList = "card-text text-muted delo-details";
            trajanjeParagraph.innerText = "Trajanje: "+nazivtrajanja;
            trajanjeParagraph.id = "prikaz-trajanje-"+response.iddela;


            let delovnikParagraph = document.createElement("p");
            delovnikParagraph.classList = "card-text text-muted delo-details";
            delovnikParagraph.innerText = "Delovnik: " + nazivdelovnika;
            delovnikParagraph.id = "prikaz-delovnik-"+response.iddela;
            
            colTwo.appendChild(trajanjeParagraph);
            colTwo.appendChild(delovnikParagraph);

            row.appendChild(colTwo);

           /*
             <button class="btn btn-primary btn-sm m-1" type="button" data-toggle="collapse" data-target="#collapseOdzivi<%=delo.iddela%>" aria-expanded="false" aria-controls="collapseOdzivi<%=delo.iddela%>" value=<%=delo.iddela%> onclick="pokaziOdzive(this)">Pokaži odzive</button> 
             <button class="btn btn-danger btn-sm m-1" value=<%=delo.iddela%> onclick="izbrisiDelo(this)">Izbriši</button>

    <div class="collapse" id="collapseOdzivi<%=delo.iddela%>">
        <div id="odzivi-<%=delo.iddela%>"></div>
    </div>
            */

           deloCard.appendChild(row);

            let btnOdzivi = document.createElement("button");
            btnOdzivi.classList = "btn btn-primary btn-sm mr-1 mb-1 mt-3";
            btnOdzivi.type = "button";
            btnOdzivi.setAttribute("data-toggle","collapse");
            btnOdzivi.setAttribute("data-target","#collapseOdzivi"+response.iddela);
            btnOdzivi.value = response.iddela;
            btnOdzivi.setAttribute("onclick",'pokaziOdzive(this)');
            btnOdzivi.innerText = "Pokaži odzive";

            deloCard.appendChild(btnOdzivi);

            let btnIzbriši = document.createElement("button");
            btnIzbriši.classList = "btn btn-danger btn-sm mr-1 mb-1 mt-3";
            btnIzbriši.type = "button";
            btnIzbriši.setAttribute("value",response.iddela);
            btnIzbriši.setAttribute("onclick","izbrisiDelo(this)");
            btnIzbriši.innerText = "Izbriši";

            deloCard.appendChild(btnIzbriši);

            let odziviDivWrapper = document.createElement('div');
            odziviDivWrapper.id = "collapseOdzivi"+response.iddela;
            odziviDivWrapper.class = "collapse";

            let odziviDiv = document.createElement('div');
            odziviDiv.id = "odzivi-"+response.iddela;
            odziviDivWrapper.appendChild(odziviDiv);

            deloCard.appendChild(odziviDivWrapper);

            deloDiv.appendChild(deloCard);
            document.getElementById("trenutna-dela").prepend(deloDiv);
        }
    });
}

function izbrisiDelo(item) {
    let status = document.getElementById("status");

    postData("/podjetja/dela/izbrisi-delo",{iddela:item.value}).then((response)=>{
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("trenutna-dela").prepend(status);
        }
        if (response.uspelo == "seja-narobe") {
            openStatus(status,"Niste prijavljeni. Poskusite znova.","alert-danger");
            document.getElementById("trenutna-dela").prepend(status);
        }
        if (response.uspelo == "dela-ni") {
            openStatus(status,"Delo, ki ga brišete, ne obstaja.","alert-danger");
            document.getElementById("trenutna-dela").prepend(status);
        }
        if (response.uspelo == true) {
            let container = item.parentNode.parentNode;
            container.parentNode.removeChild(container);
        }
    });
}

function delavecInfo(item) {
    let iddela = item.id.slice(8);
    let iddelavca = item.value;
    let status = document.getElementById("status");

    getData("/podjetja/dela/o-delavcu/"+iddelavca).then((response) => {
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("delavec-modal").prepend(status);
        }
        if (response.uspelo == "spretnosti-ni") {
            openStatus(status,"Delo mora imeti spretnosti.","alert-danger");
            document.getElementById("dodajdeloformtop").prepend(status);
        }
        if (response.uspelo == "delavca-ni") { 
            openStatus(status,"Iskan delavec ne obstaja.","alert-danger");
            document.getElementById("delavec-modal").prepend(status);
        }
        if (response.uspelo == true) {        
        document.getElementById("delavec-ime").innerText  = response.delavec.info[0].ime+" "+response.delavec.info[0].priimek;
        document.getElementById("delavec-eposta").innerText  = response.delavec.info[0].eposta;

        if (response.delavec.info[0].telefon !=null) document.getElementById("delavec-telefon").innerText = response.delavec.info[0].telefon;
        else document.getElementById("delavec-telefon").innerText = "Ni podatka";

        if (response.delavec.info[0].kratekopis !=null) document.getElementById("delavec-kratekopis").innerText  = response.delavec.info[0].kratekopis;
        else document.getElementById("delavec-kratekopis").innerText = "Podatka ni.";
        
        if (response.delavec.info[0].datumrojstva == 'Invalid date') response.delavec.info[0].datumrojstva = "Podatka ni."
        if (response.delavec.info[0].datumrojstva != null) document.getElementById("delavec-datumrojstva").innerText  = response.delavec.info[0].datumrojstva;

        if (response.delavec.info[0].epostapotrjena == null || response.delavec.info[0].epostapotrjena == 0)
        document.getElementById("delavec-potrjen").innerText = "Račun ni potrjen, lahko gre za robota.";
        
        if (response.delavec.info[0].epostapotrjena == 1)
        document.getElementById("delavec-potrjen").innerText = "Račun je potrjen.";

        document.getElementById("delavec-izobrazba").innerHTML = " ";

        for (izobrazba of response.delavec.izobrazba) {
            let card = document.createElement("div");
            card.classList = "card mt-3 shadow-sm";

            let cardBody = document.createElement("div");
            cardBody.classList = "card-body";

            let naziv = document.createElement("h5");
            naziv.classList = "card-title";
            naziv.innerText = izobrazba.naziv;
            cardBody.appendChild(naziv);

            let ustanova = document.createElement("h6");
            ustanova.innerText = izobrazba.ustanova;
            ustanova.classList = "card-subtitle mb-3 text-muted";
            cardBody.appendChild(ustanova);

            let nivoizobrazbe = document.createElement("h6");
            nivoizobrazbe.innerText = izobrazba.nivoizobrazbe;
            nivoizobrazbe.classList = "card-subtitle mb-2 text-muted";
            cardBody.appendChild(nivoizobrazbe);

            let opis = document.createElement("p");
            opis.innerText = izobrazba.opis;
            opis.classList = "card-text";
            cardBody.appendChild(opis);

            let datumi = document.createElement("p");
            datumi.innerText = izobrazba.datumzacetka + " - " + izobrazba.datumkonca;
            datumi.classList = "card-text";
            cardBody.appendChild(datumi);

            card.appendChild(cardBody);
            document.getElementById("delavec-izobrazba").appendChild(card);
        }

        document.getElementById("delavec-delovneizkusnje").innerHTML = " ";

        for (izkusnja of response.delavec.delovneizkusnje) {
            let card = document.createElement("div");
            card.classList = "card mt-3 shadow-sm";

            let cardBody = document.createElement("div");
            cardBody.classList = "card-body";
            
            let imemesta = document.createElement("h5");
            imemesta.innerText = izkusnja.imemesta;
            cardBody.appendChild(imemesta);

            let nazivpodjetja = document.createElement("h6");
            nazivpodjetja.innerText = izkusnja.nazivpodjetja;
            cardBody.appendChild(nazivpodjetja);

            let opisdela = document.createElement("p");
            opisdela.innerText = izkusnja.opisdela;
            cardBody.appendChild(opisdela);

            let datumi = document.createElement("p");
            datumi.innerText = izkusnja.datumzacetka + " - " + izkusnja.datumkonca;
            cardBody.appendChild(datumi);

            card.appendChild(cardBody);
            document.getElementById("delavec-delovneizkusnje").appendChild(card);
        }

        document.getElementById("delavec-spretnosti").innerHTML = " ";

        for (spretnost of response.delavec.spretnosti) {
            let DOMspretnost = document.createElement("button");
            DOMspretnost.classList = "btn btn-outline-primary mr-2 mt-1";
            DOMspretnost.innerText = spretnost.naziv;
            document.getElementById("delavec-spretnosti").appendChild(DOMspretnost);
        }

        document.getElementById("delavec-jeziki").innerHTML = " ";

        for (jezik of response.delavec.jeziki) {
            let DOMjezik = document.createElement("button");
            DOMjezik.classList = "btn btn-outline-primary mr-2 mt-1";
            DOMjezik.innerText = jezik.naziv;
            document.getElementById("delavec-jeziki").appendChild(DOMjezik);
        }

        //naredi div za gumba
        document.getElementById("gumbi-div").innerHTML = " ";
        document.getElementById("neprimerno-div").innerHTML = " ";
        let DOMizbira = document.createElement("div");

        //dodaj oba gumba
        let sprejmiGumb = document.createElement("button");
        sprejmiGumb.innerText = "Sprejmi";
        sprejmiGumb.classList = "mr-1 mt-1 mb-1 btn btn-primary";
        sprejmiGumb.id = "sprejmi-"+odziv.iddelavca;
        sprejmiGumb.value = iddela;
        sprejmiGumb.onclick = function () {sprejmiDelavca(sprejmiGumb)};

        let zavrniGumb = document.createElement("button");
        zavrniGumb.id = "zavrni-"+odziv.iddelavca;
        zavrniGumb.classList = "m-1 btn btn-danger";
        zavrniGumb.innerText = "Zavrni";
        zavrniGumb.value = iddela;
        zavrniGumb.onclick = function () {zavrniDelavca(zavrniGumb)}

        let DOMneprimerno = document.createElement("div");

        let prijaviGumb = document.createElement("button");
        prijaviGumb.id = "prijavi-"+iddela;
        prijaviGumb.innerText = "Oddaj prijavo";
        prijaviGumb.value = odziv.iddelavca;
        prijaviGumb.onclick = function () {prijaviDelavca(prijaviGumb)}
        prijaviGumb.classList = "mt-2 btn-sm btn btn-danger";

        let prijaviTekstLabel = document.createElement("label");
        prijaviTekstLabel.classList = "mt-3";
        prijaviTekstLabel.for = "prijava-tekst"+odziv.iddelavca;
        prijaviTekstLabel.innerText = "Besedilo prijave:";
        DOMneprimerno.appendChild(prijaviTekstLabel);

        let prijaviTekst = document.createElement("textarea");
        prijaviTekst.classList = "form-control w-100";
        prijaviTekst.id = "prijava-tekst-"+odziv.iddelavca;
        prijaviTekst.name = "prijava-tekst-"+odziv.iddelavca;

        DOMizbira.appendChild(sprejmiGumb);
        DOMizbira.appendChild(zavrniGumb);

        DOMneprimerno.appendChild(prijaviTekst);
        DOMneprimerno.appendChild(prijaviGumb);

        document.getElementById("gumbi-div").appendChild(DOMizbira);
        document.getElementById("neprimerno-div").appendChild(DOMneprimerno);
        
    }
});
}

function pokaziOdzive(item) {
    let status = document.getElementById("status");
    let iddela = item.value;
    let odzivi = document.getElementById("odzivi-"+iddela);

    openStatus(status,"","alert-primary");
    document.getElementById("delo-container-"+iddela).after(status);

    odzivi.innerHTML = " "; 

    getData("/podjetja/dela/pokazi-odzive/"+iddela).then((response) => {
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("odzivi-"+iddela).prepend(status);
        }
        if (response.uspelo == 'dela-ni') {
            openStatus(status,"Delo ne obstaja.","alert-danger");
            document.getElementById("odzivi-"+iddela).prepend(status);
        }
        if (response.uspelo == 'odzivov-ni') {
            item.innerHTML = '<img class="gf-nav-icon" src="/icon/refresh.svg"></img><span> Prikaži odzive</span>';
            openStatus(status,"Delo nima odzivov.","alert-warning");
            document.getElementById("odzivi-"+iddela).prepend(status);
        }
        if (response.uspelo == 'opozorjen') {
            let odzivTekst = document.createElement("p");
            odzivTekst.classList = "text-muted";
            odzivTekst.innerText = "Ogled odzivov je nemogoč, ko ste opozorjeni.";
            odzivi.appendChild(odzivTekst);   

            openStatus(status,"Ogled odzivov je nemogoč, ko ste opozorjeni...","alert-danger");
            document.getElementById("odzivi-"+iddela).prepend(status);
        }
        if (response.uspelo == true) {
            openStatus(status,"Našli smo sledeče odzive...","alert-success");
            document.getElementById("odzivi-"+iddela).prepend(status);

            item.innerHTML = '<img class="gf-nav-icon" src="/icon/refresh.svg"></img><span> Prikaži odzive</span>';

            for (odziv of response.odzivi) {
                let odzivContainer = document.createElement("div");
                odzivContainer.id = "odzivContainer"+odziv.iddelavca;
                odzivContainer.classList = "card p-2 mt-3";

                let contentContainer = document.createElement("div");
                contentContainer.classList = "card-body";

                let odzivHeader = document.createElement("h6");
                odzivHeader.innerText = odziv.ime + " " + odziv.priimek;
                odzivHeader.classList = "text-dark";
                contentContainer.appendChild(odzivHeader);

                let odzivTekst = document.createElement("p");
                odzivTekst.innerText = odziv.opis;

                let odzivbr = document.createElement("hr");
                contentContainer.appendChild(odzivbr);

                let sprejmiGumb = document.createElement("button");
                sprejmiGumb.innerText = "Sprejmi";
                sprejmiGumb.id = "sprejmi-"+odziv.iddelavca;
                sprejmiGumb.classList = "btn btn-primary btn-sm mr-1 mt-1 mb-1";
                sprejmiGumb.value = iddela;
                sprejmiGumb.onclick = function () {sprejmiDelavca(sprejmiGumb)};

                let zavrniGumb = document.createElement("button");
                zavrniGumb.id = "zavrni-"+odziv.iddelavca;
                zavrniGumb.innerText = "Zavrni";
                zavrniGumb.classList = "btn btn-danger btn-sm m-1";
                zavrniGumb.value = iddela;
                zavrniGumb.onclick = function () {zavrniDelavca(zavrniGumb)}

                let oDelavcu = document.createElement("button");
                oDelavcu.innerText = "Podatki o delavcu";
                oDelavcu.value = odziv.iddelavca;
                oDelavcu.id = "podatki-"+iddela;
                oDelavcu.classList = "btn btn-primary btn-sm m-1";
                oDelavcu.onclick = function() {delavecInfo(oDelavcu)};
                oDelavcu.setAttribute("data-toggle","modal");
                oDelavcu.setAttribute("data-target","#delavec-modal");

                contentContainer.appendChild(odzivTekst);
                contentContainer.appendChild(sprejmiGumb);
                contentContainer.appendChild(zavrniGumb);
                contentContainer.appendChild(oDelavcu);

                odzivContainer.appendChild(contentContainer);

                odzivi.appendChild(odzivContainer);   
            }
        }
    });
}

function prijaviDelavca(item) {
    let status = document.getElementById("status");
    let iddelavca = item.value;
    let prijava = document.getElementById("prijava-tekst-"+iddelavca).value
    
    //črke in številke
    if (!/^[a-zžščćđA-ZŽŠĐČĆ0-9 .,-:;_]+$/.test(prijava)) {
        openStatus(status,"Dovoljene so samo črke, številke in ločila.","alert-danger");
        document.getElementById("neprimerno-div").prepend(status);

        document.getElementById("prijava-tekst-"+iddelavca).classList.add("is-invalid");
    }
    else postData("/podjetja/dela/prijavi-delavca",{iddelavca:iddelavca,pojasnilo:prijava}).then((response)=>{ 
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("neprimerno-div").prepend(status);
        }
        if (response.uspelo == "seja-narobe") {
            openStatus(status,"Niste prijavljeni. Poskusite znova.","alert-danger");
            document.getElementById("neprimerno-div").prepend(status);
        }
        if (response.uspelo == "opozorjen") { 
            openStatus(status,"Ne smete prijavljati delavcev, ko ste opozorjeni.","alert-danger");
            document.getElementById("neprimerno-div").prepend(status);
        }
        if (response.uspelo == "delavca-ni") {
            openStatus(status,"Delo ali delavec ne obstajata.","alert-danger");
            document.getElementById("neprimerno-div").prepend(status);
        }
        if (response.uspelo == "besedilo-narobe") {
            openStatus(status,"Besedilo prijave lahko vsebuje samo črke, številke in ločila.","alert-danger");
            document.getElementById("neprimerno-div").prepend(status);
        }
        if (response.uspelo == "seja-narobe") {
            openStatus(status,"Niste prijavljeni, poskusite znova.","alert-danger");
            document.getElementById("neprimerno-div").prepend(status);
        }
        if (response.uspelo == "ze-prijavljen") {
            openStatus(status,"Delavec je že prijavljen, njegovi odzivi na vaša dela so ponovno izbrisani. Osvežite prikaz odzivov.","alert-danger");
            document.getElementById("neprimerno-div").prepend(status);

            document.getElementById("odzivContainer"+iddelavca).parentNode.removeChild(document.getElementById("odzivContainer"+iddelavca))
        }
        if (response.uspelo == true) { 
            document.getElementById("prijava-tekst-"+iddelavca).classList.remove("is-invalid");

            openStatus(status,"Prijava uspešna!.","alert-success");
            document.getElementById("neprimerno-div").prepend(status);

            document.getElementById("odzivContainer"+iddelavca).parentNode.removeChild(document.getElementById("odzivContainer"+iddelavca))
        };
    });

}

function sprejmiDelavca(item) {
    let iddela = item.value;
    let iddelavca = item.id.slice(8);
    let status = document.getElementById("status");
    postData("/podjetja/dela/sprejmi-delavca",{iddela:iddela,iddelavca:iddelavca}).then((response)=>{
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("odzivi-"+iddela).prepend(status);
        }
        if (response.uspelo == "ni-podatkov") {
            openStatus(status,"Delo ali delavec ne obstajata.","alert-danger");
            document.getElementById("odzivi-"+iddela).prepend(status);
        }
        if (response.uspelo == "seja-narobe") {
            openStatus(status,"Niste prijavljeni. Poskusite znova.","alert-danger");
            document.getElementById("odzivi-"+iddela).prepend(status);
        }
        if (response.uspelo == "opozorjen") { 
            openStatus(status,"Ne smete sprejemati delavcev, ko ste opozorjeni.","alert-danger");
            document.getElementById("odzivi-"+iddela).prepend(status);
        }
        if (response.uspelo == true) {
            openStatus(status,"Sprejem uspešen.","alert-success");
            document.getElementById("odzivi-"+iddela).prepend(status);

            let row = document.getElementById("odzivContainer"+iddelavca).parentNode;
            row.removeChild(document.getElementById("odzivContainer"+iddelavca));
        }
    });
}

function zavrniDelavca(item) {
    let status = document.getElementById("status");
    let iddela = item.value;
    let iddelavca = item.id.slice(7);
    postData("/podjetja/dela/zavrni-delavca",{iddelavca:iddelavca,iddela:iddela}).then((response)=>{
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("odzivi-"+iddela).prepend(status);
        }
        if (response.uspelo == "opozorjen") { 
            openStatus(status,"Ne smete zavračati delavcev, ko ste opozorjeni.","alert-danger");
            document.getElementById("odzivi-"+iddela).prepend(status);
        }
        if (response.uspelo == "ni-podatkov") {
            openStatus(status,"Delo ali delavec ne obstajata.","alert-danger");
            document.getElementById("odzivi-"+iddela).prepend(status);
        }
        if (response.uspelo == "seja-narobe") {
            openStatus(status,"Niste prijavljeni. Poskusite znova.","alert-danger");
            document.getElementById("odzivi-"+iddela).prepend(status);
        }
        if (response.uspelo == true) {
            openStatus(status,"Zavračanje uspešno.","alert-success");
            document.getElementById("odzivi-"+iddela).prepend(status);

            let row = document.getElementById("odzivContainer"+iddelavca).parentNode;
            row.removeChild(document.getElementById("odzivContainer"+iddelavca));
        }
    });
}

function urediDelo(item) {
    let status = document.getElementById("status");
    let delo = {}

    delo.iddela = item.value;
    delo.naziv = document.getElementById("delo-naziv").value;
    delo.opis = document.getElementById("delo-opis").value;
    delo.placa = document.getElementById("delo-placa").value;
    delo.podrocje = document.getElementById("isci-podrocje").value;

    delo.nivoizobrazbe = document.getElementById("nivoizobrazbe").options[document.getElementById('nivoizobrazbe').selectedIndex].value;
    let nazivizobrazbe = document.getElementById("nivoizobrazbe").options[document.getElementById('nivoizobrazbe').selectedIndex].innerText;

    delo.trajanje = document.getElementById("trajanje").options[document.getElementById('trajanje').selectedIndex].value;
    let nazivtrajanja = document.getElementById("trajanje").options[document.getElementById('trajanje').selectedIndex].innerText;

    delo.delovnik = document.getElementById("delovniki").options[document.getElementById('delovniki').selectedIndex].value;
    let nazivdelovnika = document.getElementById("delovniki").options[document.getElementById('delovniki').selectedIndex].innerText;

    delo.vrstaplace = document.getElementById("vrste_place").options[document.getElementById('vrste_place').selectedIndex].value;
    let nazivvrsteplace = document.getElementById("vrste_place").options[document.getElementById('vrste_place').selectedIndex].innerText;
    
    delo.spretnosti = [];

    for (spretnost of document.getElementById("izbrana-spretnost").childNodes) {
        if (spretnost.childNodes[0] != undefined) {
            delo.spretnosti.push(spretnost.innerText)
        }
    }
    if (delo.naziv == "" || delo.naziv == undefined ||
        delo.opis == "" || delo.opis == undefined ||
        delo.placa == "" || delo.placa == undefined ||
        delo.podrocje == "" || delo.podrocje == undefined ||
        delo.nivoizobrazbe == "" || delo.nivoizobrazbe == undefined ||
        delo.trajanje == "" || delo.trajanje == undefined ||
        delo.delovnik == "" || delo.delovnik == undefined ||
        delo.vrstaplace == "" || delo.vrstaplace == undefined ||
        delo.spretnosti.length < 1
        ) {
            openStatus(status,"Izpolnite celoten obrazec.","alert-warning");
            document.getElementById("dodajdeloformtop").prepend(status);
    }
    else {
        postData("/podjetja/dela/uredi-delo",{delo:delo}).then((response)=>{
            if (response.uspelo == false) {
                openStatus(status,"Napaka na strežniku.","alert-danger");
                document.getElementById("dodajdeloformtop").prepend(status);
            }
            if (response.uspelo == "seja-narobe") {
                openStatus(status,"Niste prijavljeni. Poskusite znova.","alert-danger");
                document.getElementById("dodajdeloformtop").prepend(status);
            }
            if (response.uspelo == "opozorjen") { 
                openStatus(status,"Ko ste opozorjeni, ne smete urejati del.","alert-danger");
                document.getElementById("dodajdeloformtop").prepend(status);
            }
            if (response.uspelo == "naziv-opis-narobe") {
                openStatus(status,"Opis ali naziv dela ni pravilno vpisan, mora vsebovati samo črke, številke in ločila","alert-danger");
                document.getElementById("dodajdeloformtop").prepend(status);
            }
            if (response.uspelo == "placa-narobe") {
                openStatus(status,"Plača mora biti večja od 0.","alert-danger");
                document.getElementById("dodajdeloformtop").prepend(status);
    
                document.getElementById("delo-placa").classList.add("is-invalid");
            }
            if (response.uspelo == "podrocje-narobe") {
                openStatus(status,"Področje dela se ne ujema s podatkovno bazo.","alert-danger");
                document.getElementById("dodajdeloformtop").prepend(status);
    
                document.getElementById("isci-podrocje").classList.add("is-invalid");
            }
            if (response.uspelo == "nivoizobrazbe-narobe") {
                openStatus(status,"Nivo izobrazbe se ne ujema s podatkovno bazo.","alert-danger");
                document.getElementById("dodajdeloformtop").prepend(status);
    
                document.getElementById("nivoizobrazbe").classList.add("is-invalid");
            }
            if (response.uspelo == "trajanje-narobe") {
                openStatus(status,"Trajanje dela se ne ujema s podatkovno bazo.","alert-danger");
                document.getElementById("dodajdeloformtop").prepend(status);
    
                document.getElementById("trajanje").classList.add("is-invalid");
            }
            if (response.uspelo == "delovnik-narobe") {
                openStatus(status,"Delovnik se ne ujema s podatkovno bazo.","alert-danger");
                document.getElementById("dodajdeloformtop").prepend(status);
    
                document.getElementById("delovniki").classList.add("is-invalid");
            }
            if (response.uspelo == "vrsta-place-narobe") {
                openStatus(status,"Vrsta plače se ne ujema s podatkovno bazo.","alert-danger");
                document.getElementById("dodajdeloformtop").prepend(status);
    
                document.getElementById("vrste_place").classList.add("is-invalid");
            }
            if (response.uspelo == "spretnost-narobe") {
                openStatus(status,"Spretnosti se ne ujemajo s podatkovno bazo.","alert-danger");
                document.getElementById("dodajdeloformtop").prepend(status);
    
                document.getElementById("isci-spretnost").classList.add("is-invalid");
            }
            if (response.uspelo == "spretnosti-ni") {
                openStatus(status,"Delo mora imeti spretnosti.","alert-danger");
                document.getElementById("dodajdeloformtop").prepend(status);
            }
            if (response.uspelo == true) { 
                openStatus(status,"Posodobitev uspešna.","alert-success");
                document.getElementById("dodajdeloformtop").prepend(status);

                document.getElementById("prikaz-naziv-"+item.value).innerText = delo.naziv;
                document.getElementById("prikaz-podrocje-"+item.value).innerText = delo.podrocje;
                document.getElementById("prikaz-opis-"+item.value).innerText = delo.opis;
                document.getElementById("prikaz-placa-"+item.value).innerText = delo.placa+" / "+document.getElementById("vrste_place").options[document.getElementById('vrste_place').selectedIndex].innerText;

                document.getElementById("prikaz-izobrazba-"+item.value).innerText =  "Izobrazba: "+document.getElementById("nivoizobrazbe").options[document.getElementById('nivoizobrazbe').selectedIndex].innerText;

                document.getElementById("prikaz-trajanje-"+item.value).innerText = "Trajanje: "+document.getElementById("trajanje").options[document.getElementById('trajanje').selectedIndex].innerText;
            
                document.getElementById("prikaz-delovnik-"+item.value).innerText =  "Delovnik: "+document.getElementById("delovniki").options[document.getElementById('delovniki').selectedIndex].innerText;

                document.getElementById("prikaz-spretnosti-"+item.value).innerText =  "Spretnosti: "+delo.spretnosti.join(", ");
            }
        });
    }


}

function modalUredi(item) {
    let status = document.getElementById("status");
    let gumbDiv = document.getElementById("modal-button-div");
    gumbDiv.innerHTML = "";

    let urediButton  = document.createElement("button");
    urediButton.classList = "btn btn-primary";
    urediButton.value = item.value;
    urediButton.onclick = function() {urediDelo(urediButton)};
    urediButton.innerText= "Uredi";

    gumbDiv.appendChild(urediButton);

    document.getElementById("delo-naziv").value = document.getElementById("prikaz-naziv-"+item.value).innerText;
    document.getElementById("delo-opis").value = document.getElementById("prikaz-opis-"+item.value).innerText;
    document.getElementById("delo-naziv").value = document.getElementById("prikaz-naziv-"+item.value).innerText;
    
    document.getElementById("delo-placa").value = document.getElementById("prikaz-placa-"+item.value).innerText.match(/.+?(?= \/ )/);
    
    let getIndex = 0;

    for (let i=0;i<document.getElementById("vrste_place").options.length;i++) {
        if (document.getElementById("vrste_place").options[i].text == document.getElementById("prikaz-placa-"+item.value).innerText.match(/(?<= \/ ).*/)) {
            document.getElementById("vrste_place").selectedIndex = i;
        }
    }

    for (let i=0;i<document.getElementById("trajanje").options.length;i++) {
        if (document.getElementById("trajanje").options[i].text == document.getElementById("prikaz-trajanje-"+item.value).innerText.slice(10)) {
            document.getElementById("trajanje").selectedIndex = i;
        }
    }

    for (let i=0;i<document.getElementById("delovniki").options.length;i++) {
        if (document.getElementById("delovniki").options[i].text == document.getElementById("prikaz-delovnik-"+item.value).innerText.slice(10)) {
            document.getElementById("delovniki").selectedIndex = i;
        }
    }

    for (let i=0;i<document.getElementById("nivoizobrazbe").options.length;i++) {
        if (document.getElementById("nivoizobrazbe").options[i].text == document.getElementById("prikaz-izobrazba-"+item.value).innerText.slice(11)) {
            document.getElementById("nivoizobrazbe").selectedIndex = i;
        }
    }

    let spretnosti = document.getElementById("prikaz-spretnosti-"+item.value).innerText.slice(12).split(", ");

    document.getElementById("izbrana-spretnost").innerHTML = "";

    postData("/podjetja/dela/isci-spretnost-edit",{iskanaspretnost:spretnosti}).then((response)=>{
        if (response.uspelo != false && response.uspelo != undefined) {
        for (respretnost of response.uspelo) {
            let spretnostGumb = document.createElement("button");
           spretnostGumb.value = respretnost.idspretnosti;
           spretnostGumb.name = "spretnost";
           spretnostGumb.innerText = respretnost.naziv;
           spretnostGumb.onclick = function() {izbrisiSpretnost(this);}
           spretnostGumb.classList = "btn btn-primary mr-2 mt-2 mb-2";
           document.getElementById("izbrana-spretnost").appendChild(spretnostGumb);
            }
        }
        else {
            openStatus(status,"Iskane spretnosti ne obstajajo.","alert-danger");
            document.getElementById("dodajdeloformtop").prepend(status);
        }
    });

    //odstrani invalide
    openStatus(status,"Vklopljen način za urejanje.","alert-primary");
    document.getElementById("dodajdeloformtop").prepend(status);

    if (document.getElementById("delo-placa").classList.contains("is-invalid")) document.getElementById("delo-placa").classList.remove("is-invalid");
    if (document.getElementById("delo-naziv").classList.contains("is-invalid")) document.getElementById("delo-naziv").classList.remove("is-invalid");
    if (document.getElementById("delo-opis").classList.contains("is-invalid")) document.getElementById("delo-opis").classList.remove("is-invalid");
    if (document.getElementById("isci-podrocje").classList.contains("is-invalid")) document.getElementById("isci-podrocje").classList.remove("is-invalid");
    if (document.getElementById("nivoizobrazbe").classList.contains("is-invalid")) document.getElementById("nivoizobrazbe").classList.remove("is-invalid");
    if (document.getElementById("trajanje").classList.contains("is-invalid")) document.getElementById("trajanje").classList.remove("is-invalid");
    if (document.getElementById("delovniki").classList.contains("is-invalid")) document.getElementById("delovniki").classList.remove("is-invalid");
    if (document.getElementById("vrste_place").classList.contains("is-invalid")) document.getElementById("vrste_place").classList.remove("is-invalid");
    if (document.getElementById("isci-spretnost").classList.contains("is-invalid")) document.getElementById("isci-spretnost").classList.remove("is-invalid");

    if (document.getElementById("isci-spretnost").classList.contains("is-valid")) document.getElementById("isci-spretnost").classList.remove("is-valid");
    if (document.getElementById("isci-podrocje").classList.contains("is-valid")) document.getElementById("isci-podrocje").classList.remove("is-valid");

    document.getElementById("isci-podrocje").value = document.getElementById("prikaz-podrocje-"+item.value).innerText;
}

function modalDodaj() {
    let gumbDiv = document.getElementById("modal-button-div");
    let status = document.getElementById("status");
    
    gumbDiv.innerHTML = "";

    let createButton = document.createElement("button");
    //<button class="btn btn-primary" onclick="posljiDelo()">Ustvari</button>

    createButton.classList = "btn btn-primary";
    createButton.onclick = function(){posljiDelo()};
    createButton.innerText = "Ustvari";

    openStatus(status,"Vklopljen način za dodajanje.","alert-primary");
    document.getElementById("dodajdeloformtop").prepend(status);

    document.getElementById("delo-naziv").value = "";
    document.getElementById("delo-opis").value = "";
    document.getElementById("delo-placa").value = "";
    document.getElementById("isci-podrocje").value = "";
    document.getElementById("izbrana-spretnost").innerHTML = "";

    if (document.getElementById("delo-placa").classList.contains("is-invalid")) document.getElementById("delo-placa").classList.remove("is-invalid");
    if (document.getElementById("delo-naziv").classList.contains("is-invalid")) document.getElementById("delo-naziv").classList.remove("is-invalid");
    if (document.getElementById("delo-opis").classList.contains("is-invalid")) document.getElementById("delo-opis").classList.remove("is-invalid");
    if (document.getElementById("isci-podrocje").classList.contains("is-invalid")) document.getElementById("isci-podrocje").classList.remove("is-invalid");
    if (document.getElementById("nivoizobrazbe").classList.contains("is-invalid")) document.getElementById("nivoizobrazbe").classList.remove("is-invalid");
    if (document.getElementById("trajanje").classList.contains("is-invalid")) document.getElementById("trajanje").classList.remove("is-invalid");
    if (document.getElementById("delovniki").classList.contains("is-invalid")) document.getElementById("delovniki").classList.remove("is-invalid");
    if (document.getElementById("vrste_place").classList.contains("is-invalid")) document.getElementById("vrste_place").classList.remove("is-invalid");
    if (document.getElementById("isci-spretnost").classList.contains("is-invalid")) document.getElementById("isci-spretnost").classList.remove("is-invalid");

    if (document.getElementById("isci-spretnost").classList.contains("is-valid")) document.getElementById("isci-spretnost").classList.remove("is-valid");
    if (document.getElementById("isci-podrocje").classList.contains("is-valid")) document.getElementById("isci-podrocje").classList.remove("is-valid");

    gumbDiv.appendChild(createButton);
}