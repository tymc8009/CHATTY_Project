function loadifSignedIn(condition){
  console.log("test");
  var nav = document.getElementById("navigation");//make sure to rename the navbar to navigation
   nav.style.backgroundColor = "rgb(30,201,110)";
   if(true){
     nav.innerHTML += "<button type=\"button\" class=\"btn btn-outline-light\" data-toggle=\"modal\" data-target=\"#signup\"> Sign up </button>"
     +"<div class=\"modal fade\" id=\"signup\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exampleModalCenterTitle\" aria-hidden=\"true\">"
     + "       <div class=\"modal-dialog modal-dialog-centered\" role=\"document\">"
     +"           <div class=\"modal-content\">"
     +"             <div class=\"modal-header\">"
     +"               <h5 class=\"modal-title\" id=\"signup title\" style=\"text-align:center\">Sign Up</h5>"
     +"               <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">"
     +"                 <span aria-hidden=\"true\">&times;</span>"
     +"               </button>"
     +"             </div>"
     +"             <div class=\"modal-body\">"
     +"               <div class=\"form-group\" id=\"signup_form\">"
     +"                 <label for=\"Username\">User Name: </label>"
     +"                 <input type=\"text\" class=\"form-control\" name=\"Username\" placeholder=\"Name\""
     +"                   required=\"required\">"
     +"                   <label for=\"email\">Email address</label>"
     +"                   <input type=\"email\" class=\"form-control\" name=\"email\" placeholder=\"youremail@email.com\">"
     +"                   <label for=\"password\">Password:</label>"
     +"                   <input type=\"password\" class=\"form-control\" id=\"password\" placeholder=\"password\" required=\"required\" onclick=\"\">"
     +"                     <label for=\"Confirm_password\"> Confirm Password: </label>"
     +"                     <input type=\"password\" class=\"form-control\" id=\"Confirm_password\" placeholder=\"password\""
     +"                       required=\"required\" onchange=\"checkPasswords();\">"
     +"                     <p id=\"warning\" style=\"visibility:hidden;color:Red\">Passwords must match</p>"
     +"                       <label for=\"zip\">zip code:</label>"
     +"                       <input type=\"text\" class=\"form-control\" name=\"zip\">"
     +"             </div></div>"
     +"             <div class=\"modal-footer\">"
     +"               <button type=\"button\" class=\"btn btn-secondary\" onclick=\"verify()\">sign up</button> </div></div></div>";
   }
}


function checkPasswords(){
      var pass = document.getElementById("password").value;

      var pass2 = document.getElementById("Confirm_password").value;
      var warn = document.getElementById("warning");
      console.log(pass==pass2);
      if(pass===pass2){
        warn.style.visibility="hidden";
        return true;
      } else {

      warn.style.visibility="visible";
      return false;
    }

}

function verify(){
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

  if(noEmpties){
    $('#signup').modal('toggle');

  }
}
