function posljiKodo() {
    let eposta = document.getElementById("eposta");
    let status = document.getElementById("status");
    
    if (validateEmail(document.getElementById("eposta")) == true){
    postData("/podjetja/acc/poslji-potrditveno",{eposta:eposta.value}).then((response)=>{
        if (response.uspelo == false) openStatus(status,"Napaka na strežniku.","alert-danger");
        if (response.uspelo == "eposte-ni") openStatus(status,"E-poštni naslov ne obstaja.","alert-danger");
        if (response.uspelo == true) {
            openStatus(status,"Novo geslo je na vašem e-poštnem naslovu.","alert-success");        
        }
    });
    }
    else {
        openStatus(status,"E-poštni naslov ni pravilno vnesen.","alert-danger");
        eposta.classList.add("is-invalid");
    }
}