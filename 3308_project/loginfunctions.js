function loadifSignedIn(condition)//set condition to 'true' for profile button 'false' for sign in and log in
{
  console.log("test");
  var nav = document.getElementById("navigation");//make sure to rename the navbar to navigation
  var navChildren = nav.childNodes;
  navChildren["5"].setAttribute("id","navbarNavDropdown");
   nav.style.backgroundColor = "rgb(30,201,110)";
   if(condition=="false"){
     nav.innerHTML += "<button type=\"button\" class=\"btn btn-outline-light\" data-toggle=\"modal\" data-target=\"#signup\"> Sign up </button>"
     +"<div class=\"dropdown\" id=\"log_in_dropdown\"><button type=\"button\" class=\"btn btn-outline-light dropdown-toggle\" data-toggle=\"dropdown\">log in</button>"
     +"<div class=\"dropdown-menu dropdown-menu-right\" style=\"background-color=rgb(30,201,110)\">"
     +" <div class=\"form-group\" style=\"background-color=rgb(30,201,110)\">"
     +"     <label for=\"Log-in-Username\">User Name: </label>"
     +"                 <input type=\"text\" class=\"form-control\" id=\"log-in-Username\" placeholder=\"Name\""
     +"                   required=\"required\">"
     +"  </div><div class=\"form-group\">"
     +"                   <label for=\"log-in-password\">Password:</label>"
     +"                   <input type=\"password\" class=\"form-control\" id=\"log-in-password\" placeholder=\"password\" required=\"required\" onclick=\"\">"
     +"<button type=\"button\" class=\"btn btn-outline-dark\" style=\"backgroundColor:rgb(30,201,110)\" onclick=\"log_in()\">log in </button>"
     +"</div></div></div>"
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
   } else if(condition=="true"){
      nav.innerHTML += "<img src=\"https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png\" class=\"rounded-circle\" id=\"profile_photo\" width=\"50\" onclick=\"alert(\"wow\");\" height=\"50\" style=\"margin:0px 20px\">"
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


function log_in(){
  var uName = document.getElementById("log-in-Username");
  var password = document.getElementById("log-in-password");
  if(uName.value==""){
    uName.style.borderColor="red";
    $("log_in_dropdown").dropdown(toggle);
  }
   if(password.value==""){
    password.style.borderColor="red";
  }
}