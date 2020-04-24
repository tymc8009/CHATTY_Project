
function verify_signin(){
    var signupForm = document.getElementById("signup_form");
    var children = signupForm.childNodes;
    var notAzip = /^\d{5}(?:[-\s]\d{4})?$/g; // source: https://stackoverflow.com/questions/2577236/regex-for-zip-code
    var noEmpties = true;
    var zip = document.getElementById("zip");
    noEmpties = (zip.value!="" && notAzip.test(zip.value));
    console.log("zip changed noEmpties to", noEmpties);
    warn(zip,noEmpties,"invalid zip")
    for(var i=0; i<children.length-4; i++){
        if(children[i].tagName=="INPUT"){
            if(children[i].value===""){
                children[i].style.borderColor="red";
                noEmpties=false;
                console.log(children[i]);
            } else{

                children[i].style.borderColor="#1aaa1a";;
            }
        }
    }
    noEmpties = checkPasswords() && noEmpties;
    console.log("no Empties after check password:",noEmpties);
    noEmpties = validatePasswordRequirements(document.getElementById("password")) && noEmpties;
    document.getElementById("user-warning").innerHTML = "";
    document.getElementById("email-warning").innerText = "";
    console.log("no Empties:",noEmpties);
    if(noEmpties){
        console.log("username and password validation");
        var responses = ["",""];
        var usernameJSON = {username:document.getElementById("signup-username").value}
        $.get("/getUser",usernameJSON).then(function (data) {
            console.log(data);
            if (data.length !== 0) {
                document.getElementById("signup-username").style.borderColor = "red";
                document.getElementById("user-warning").innerHTML = "Username already taken";
                responses[0] = "false";
            } else {
                responses[0] = "true";

                var emailJSON = {email: document.getElementById("signup-email").value};
                $.get("/getEmail", emailJSON).then(function (data) {
                    if (data.length !== 0) {
                        document.getElementById("signup-email").style.borderColor = "red";
                        document.getElementById("email-warning").innerHTML = "Email in use";
                        responses[1] = "false";
                    } else {
                        responses[0] = "true";
                        document.getElementById("signup_form_form").submit();

                    }
                    console.log("email response made")
                });
            }
        });
        //while(responses[0]== "" || responses[1]=="");
        console.log("ok");
        //
    }
}

function validatePasswordRequirements(input){
    console.log("validating requrements");
    var requirements = /([A-Z]+.*[a-z]+)|([a-z]+.*[A-Z])/;
    var passwordtext = input.previousElementSibling;

    passwordtext.innerHTML = "password:";
    console.log(/[\d]/.test(input.value));
    if(!requirements.test(input.value)){
        passwordtext.innerHTML += ` <br><span style="color:red">password must contain both upper and lower case letters</span>`;
        input.style.borderColor="red";
        return requirements.test(input.value);
    } else if(input.value.length < 8) {
        passwordtext.innerHTML += ` <br><span style="color:red">password must have at least 8 characters</span>`;
        input.style.borderColor="red";
        return false;
    } else if(/[\d]/.test(input.value) == false){
        passwordtext.innerHTML += ` <br><span style="color:red">password must contain a number</span>`;
        input.style.borderColor="red";
        return false;
    } else {
        passwordtext.innerHTML += ` <span style="color:#2EEE2E">&#10003</span>`
        input.style.borderColor= "#2EEE2E";
    }

    console.log(requirements.test(input.value));
    return true;
}

function checkPasswords(){
    var pass = document.getElementById("password").value;

    var pass2 = document.getElementById("Confirm_password");
    warn(pass2,pass==pass2.value, "Passwords must match");
    return pass2.value===pass;

}

function log_in(){
    console.log(document.forms.namedItem("log-in-form"));
    var getobject = {loginUsername: document.getElementById("loginUsername").value, loginPassword: document.getElementById("loginPassword").value};
    $.post("/login", getobject).then(function (data) {
        if(data == ""){
            document.getElementById("loginPassword").value = "";
            document.getElementById("login_warning").innerHTML = "Username or password was incorrect";
        }
        else{
            location.reload();
            return false;
        }
    });
}

function testUsername() {
    var usernameJSON = {username:document.getElementById("signup-username").value}
    $.get("/getUser",usernameJSON).then(function (data) {
        console.log(data);
        var input = document.getElementById("signup-username")
        warn(input,data.length==0,"Username already taken")
    });
}


function testEmail() {

    var emailJSON = {email:document.getElementById("signup-email").value}
    if(/@./.test(document.getElementById("signup-email").value))
    {
        $.get("/getEmail", emailJSON).then(function (data) {
            console.log(data)
            warn(document.getElementById("signup-email"), data.length == 0, "email in use")
        });
    } else {
        warn(document.getElementById("signup-email"), false, "")

    }

}

function warn(input, condition, warning){
    if(condition){
        input.style.borderColor = "#2EEE2E";
        input.nextElementSibling.innerHTML = "";
    } else {
        input.style.borderColor = "red";
        input.nextElementSibling.innerHTML = warning;
    }
    if(input.value == ""){
        input.style.borderColor = "red";
    }
}