
function verify_signin(){
    var signupForm = document.getElementById("signup_form");
    var children = signupForm.childNodes;
    var notAzip = /^\d{5}(?:[-\s]\d{4})?$/g; // source: https://stackoverflow.com/questions/2577236/regex-for-zip-code
    var noEmpties = true;
    var zip = children[children.length -2];
    console.log(zip.tagName, zip.value, zip.value.match(notAzip));
    if(zip.value=="" || zip.value.match(notAzip)==null){
        console.log("if");
        zip.style.borderColor="red";
        noEmpties=false;
    } else {
        zip.style.borderColor="grey";
        noEmpties=true;
    }
    for(var i=0; i<children.length-2; i++){
        if(children[i].tagName=="INPUT"){
            if(children[i].value==""){
                children[i].style.borderColor="red";
                noEmpties=false;
            } else{

                children[i].style.borderColor="grey";
            }
        }
    }
    noEmpties = noEmpties && checkPasswords();
    document.getElementById("user-warning").innerHTML = "";
    if(noEmpties){
        var usernameJSON = {username:document.getElementById("signup-username").value}
        $.get("/getUser",usernameJSON).then(function (data) {
            console.log(data);
            if (data.length != 0) {
                document.getElementById("user-warning").innerHTML = "Username already taken";
            } else {
                document.getElementById("signup_form_form").submit();
            }
        });

    }
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
        if (data.length != 0) {
            document.getElementById("user-warning").innerHTML = "Username already taken";
        } else {
        }
    });
}