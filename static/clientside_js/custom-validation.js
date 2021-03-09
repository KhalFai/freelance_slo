function validateEmail(item) {
    let status = document.getElementById("status");

    if (item.value == '') {
        if (item.classList.contains("is-invalid")) item.classList.remove("is-invalid");
        if (item.classList.contains("is-valid")) item.classList.remove("is-valid");
        return "no-input";
    }
    else if (/[\w-]+@([\w-]+\.)+[\w-]+/.test(item.value)) {
        if (item.classList.contains("is-invalid")) item.classList.remove("is-invalid");
        item.classList.add("is-valid")
        return true;
    }
    else {
        if (item.classList.contains("is-valid")) item.classList.remove("is-valid");
        item.classList.add("is-invalid")
        return false;
    }
}

function validatePassword(item) {


    if (item.value == '') {
        if (item.classList.contains("is-invalid")) item.classList.remove("is-invalid");
        if (item.classList.contains("is-valid")) item.classList.remove("is-valid");
        return "no-input";
    }
    else if (/^(?=.*?[A-ZČĆŽĐ])(?=.*?[a-zčćžđš])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/.test(item.value)) {
        if (item.classList.contains("is-invalid")) item.classList.remove("is-invalid")
        item.classList.add("is-valid")
        return true;
    }
    else {
        if (item.classList.contains("is-valid")) item.classList.remove("is-valid")
        item.classList.add("is-invalid");
        return false;
    }
}

function validatePasswordCode(item) {
    if (item.value == '') {
        if (item.classList.contains("is-invalid")) item.classList.remove("is-invalid");
        if (item.classList.contains("is-valid")) item.classList.remove("is-valid");
        return "no-input";
    }
    else if (/^[A-Za-z0-9]{10}$/.test(item.value)) {
        if (item.classList.contains("is-invalid")) item.classList.remove("is-invalid")
        item.classList.add("is-valid")
        return true;
    }
    else {
        if (item.classList.contains("is-valid")) item.classList.remove("is-valid")
        item.classList.add("is-invalid")
        return false;
    }
}

function validateName(item) {
    if (item.value == '') {
        if (item.classList.contains("is-invalid")) item.classList.remove("is-invalid");
        if (item.classList.contains("is-valid")) item.classList.remove("is-valid");
        return "no-input";
    }
    else if (/^[A-ZĐŠČĆŽ]/.test(item.value) && /^[a-zžščćđA-ZŽŠĐČĆ]+$/.test(item.value)) {
        if (item.classList.contains("is-invalid")) item.classList.remove("is-invalid")
        item.classList.add("is-valid")
        return true;
    }
    else {
        if (item.classList.contains("is-valid")) item.classList.remove("is-valid")
        item.classList.add("is-invalid")
        return false;
    }
}

function validateCompanyName(item) {
    if (item.value == '') {
        if (item.classList.contains("is-invalid")) item.classList.remove("is-invalid");
        if (item.classList.contains("is-valid")) item.classList.remove("is-valid");
        return "no-input";
    }
    else if (/^[a-zžščćđA-ZŽŠĐČĆ0-9 ]+$/.test(item.value)) {
        if (item.classList.contains("is-invalid")) item.classList.remove("is-invalid")
        item.classList.add("is-valid")
        return true;
    }
    else {
        if (item.classList.contains("is-valid")) item.classList.remove("is-valid")
        item.classList.add("is-invalid")
        return false;
    }
}

function validateApology(item) {
    if (item.value == '') {
        if (item.classList.contains("is-invalid")) item.classList.remove("is-invalid");
        if (item.classList.contains("is-valid")) item.classList.remove("is-valid");
        return "no-input";
    }
    else if (/^[1-9a-zžščćđA-ZŽŠĐČĆ. -,:;']+$/.test(item.value)) {
        if (item.classList.contains("is-invalid")) item.classList.remove("is-invalid")
        item.classList.add("is-valid")
        return true;
    }
    else {
        if (item.classList.contains("is-valid")) item.classList.remove("is-valid")
        item.classList.add("is-invalid")
        return false;
    }
}

function validatePhoneNumber(item) {
    if (item.value == '') {
        if (item.classList.contains("is-invalid")) item.classList.remove("is-invalid");
        if (item.classList.contains("is-valid")) item.classList.remove("is-valid");
        return "no-input";
    }
    else if (/^(?=.{9})[0-9]{3}-{1}[0-9]{3}-{1}[0-9]{3}$/g.test(item.value)) {
        if (item.classList.contains("is-invalid")) item.classList.remove("is-invalid")
        item.classList.add("is-valid")
        return true;
    }
    else {
        if (item.classList.contains("is-valid")) item.classList.remove("is-valid")
        item.classList.add("is-invalid")
        return false;
    }
}

function validateBirthDate(item) {
    let datum_string = item.value;

    if (item.value == '') {
        if (item.classList.contains("is-invalid")) item.classList.remove("is-invalid");
        if (item.classList.contains("is-valid")) item.classList.remove("is-valid");
        return "no-input";
    }
    else if (Date.parse(datum_string) < Date.now()) {
        if (item.classList.contains("is-invalid")) item.classList.remove("is-invalid")
        item.classList.add("is-valid")
        return true;
    }
    else {
        if (item.classList.contains("is-valid")) item.classList.remove("is-valid")
        item.classList.add("is-invalid")
        return false;
    }
}

function validateEmailCode(item) {
    if (item.value == '') {
        if (item.classList.contains("is-invalid")) item.classList.remove("is-invalid");
        if (item.classList.contains("is-valid")) item.classList.remove("is-valid");
        return "no-input";
    }
    else if (/^[0-9]{4}$/.test(item.value)) {
        if (item.classList.contains("is-invalid")) item.classList.remove("is-invalid")
        item.classList.add("is-valid")
        return true;
    }
    else {
        if (item.classList.contains("is-valid")) item.classList.remove("is-valid")
        item.classList.add("is-invalid")
        return false;
    }
}

function checkForm(item) {
    let status = document.getElementById("status");
    let form = item;

    if (item.value == '') {
        if (item.classList.contains("is-invalid")) item.classList.remove("is-invalid");
        if (item.classList.contains("is-valid")) item.classList.remove("is-valid");
    }

    else if (form.getElementsByClassName("is-valid").length == form.getElementsByClassName("gf-to-validate").length) {
        form.submit();
    }
    else {
        openStatus(status,"V obrazcu so napake oz. mankajoči podatki. Poskusite znova.","alert-warning")        
    }
}

function removeElement(item) {
    item.classList.remove("d-block")
    item.classList.add("d-none")
}

function openStatus(item,statusText,statusClass) {
    item.classList.remove("d-none")

    document.getElementById('status-text').innerText = statusText;
    item.setAttribute("class", "fadein alert "+statusClass)

}