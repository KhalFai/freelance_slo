function posljiOpravicilo(item) {
    let status = document.getElementById("status");
    
    if (validateApology(document.getElementById("opravicilo")) == true){
    let pojasnilo = document.getElementById("opravicilo").value;
    postData("/delavci/acc/blokiranje-pritozba",{pojasnilo:pojasnilo}).then((response) => {
        if (response.uspelo == false) {
            openStatus(status,"Napaka na strežniku.","alert-danger");
            document.getElementById("opraviciloform").prepend(status);
            document.getElementById("opravicilo").classList.add("is-invalid");
        }
        if (response.uspelo == true) {
            openStatus(status,"Sporočilo je bilo poslano.","alert-success");   
            document.getElementById("opraviciloform").prepend(status);
        }
    });
    }
    else {
        openStatus(status,"Pritožba ne ustreza pogojem vnosa.","alert-danger");
        document.getElementById("opraviciloform").prepend(status);
        document.getElementById("opravicilo").classList.add("is-invalid");
    }
}