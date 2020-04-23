var testcolors = ["#FF750F","#E84B0E","#FF381B","#E80E17"]


function loadifSignedIn(logged_in)//set condition to 'true' for profile button 'false' for sign in and log in
{
  console.log("test");
  var replace = document.getElementById("log_in_dropdown");
  if(replace!=null){
    replace.remove();
    var replacesign = document.getElementById("signup");
      if(replacesign!=null){
      replacesign.remove();
    }
  }
  var nav = document.getElementById("navigation");//make sure to rename the navbar to navigation
  var navChildren = nav.childNodes;
  navChildren["5"].setAttribute("id","navbarNavDropdown");
   nav.style.backgroundColor ="#E84B0E";
   nav.setAttribute("class","navbar navbar-expand-lg navbar-dark fixed-top");
   if(logged_in=="false"){
     nav.innerHTML += "<div class=\"dropdown\" id=\"log_in_dropdown\"><button type=\"button\" class=\"btn btn-outline-light dropdown-toggle\" data-toggle=\"dropdown\">log in</button>"
     +"<div class=\"dropdown-menu dropdown-menu-right px-1\" style=\"background-color:#E84B0E;color:white\">"
     +" <form action=\"/FoodFinder/home.html/login\" method=\"post\"><div class=\"form-group\">"
     +"     <label for=\"loginUsername\">User Name: </label>"
     +"                 <input type=\"text\" class=\"form-control\" id=\"loginUsername\" name=\"loginUsername\" placeholder=\"Name\""
     +"                   required=\"required\">"
     +"  </div><div class=\"form-group\">"
     +"                   <label for=\"loginPassword\">Password:</label>"
     +"                   <input type=\"password\" class=\"form-control\" id=\"loginPassword\" name=\"loginPassword\" placeholder=\"password\" required=\"required\">"
     +"</div><div style='margin:auto'><button type=\"submit\" id=\"loginsubmit\" class=\"btn btn-outline-light\" style=\"backgroundColor:rgb(30,201,110)\">log in </button></div>"
     +"</form><div class='dropdown-divider'></div><p> New here? </p<>"
     +"<button type=\"button\" class=\"btn btn-outline-light\" data-toggle=\"modal\" data-target=\"#signup\"> Sign up </button></div></div>";
     document.body.innerHTML +="<div class=\"modal fade\" id=\"signup\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exampleModalCenterTitle\" aria-hidden=\"true\">"
     + "       <form action=\"/FoodFinder/home.html/signup\" method=\"post\">"
     + "       <div class=\"modal-dialog modal-dialog-centered\" role=\"document\">"
     +"           <div class=\"modal-content\">"
     +"             <div class=\"modal-header\">"
     +"               <h5 class=\"modal-title\" id=\"signup title\" style=\"text-align:center\">Sign Up</h5>"
     +"               <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">"
     +"                 <span aria-hidden=\"true\">&times;</span>"
     +"               </button>"
     +"             </div>"
     +"             <div class=\"modal-body\" >"
     +"               <div class=\"form-group\" id=\"signup_form\">"
     +"                 <label for=\"Username\">User Name: </label>"
     +"                 <input type=\"text\" class=\"form-control\" name=\"username\" placeholder=\"Name\""
     +"                   required=\"required\">"
     +"                   <label for=\"email\">Email address</label>"
     +"                   <input type=\"email\" class=\"form-control\" name=\"email\" placeholder=\"youremail@email.com\">"
     +"                   <label for=\"password\">Password:</label>"
     +"                   <input type=\"password\" class=\"form-control\" id=\"password\" name = \"password\" placeholder=\"password\" required=\"required\" onclick=\"\">"
     +"                     <label for=\"Confirm_password\"> Confirm Password: </label>"
     +"                     <input type=\"password\" class=\"form-control\" id=\"Confirm_password\" placeholder=\"password\""
     +"                       required=\"required\" onchange=\"checkPasswords();\">"
     +"                     <p id=\"warning\" style=\"visibility:hidden;color:Red\">Passwords must match</p>"
     +"                       <label for=\"zip\">zip code:</label>"
     +"                       <input type=\"text\" class=\"form-control\" name=\"zip\">"
     +"             </div></div>"
     +"             <div class=\"modal-footer\">"
     +"               <button type=\"submit\" class=\"btn btn-secondary\" onclick=\"verify()\">sign up</button> </div></div></form>";
   } else if(logged_in=="true"){
      nav.innerHTML += "<div class=\"dropdown\" id=\"log_in_dropdown\">"
       + "<img src=\"https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png\" class=\"rounded-circle\" id=\"profile_photo\" width=\"38px\" height=\"38px\" data-toggle=\"dropdown\" height=\"50\" style=\"margin:0px 20px\">"
       + "<div class=\"dropdown-menu dropdown-menu-right px-1\" style=\"background-color:#E84B0E;color:white\">"
       + "<b class=\"dropdown-header font-weight-bold\" style='color:#cccccc' id=\"navbar_username_text\"> <img src=\"https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png\" id=\"profile_photo_small\" width=\"25\" height=\"25\">  default username</b>" //replace text with username from database

       + "<a class='nav-link' style='color:#eeeeee' href="/*link to profile settings page*/ + "#" + " id='profile_settings_link'> profile settings </a>"
       + "<div class='dropdown-divider'></div> <button type=\"button\" class=\"btn btn-outline-light\" id=\"log_Out_Button\" onclick=\"logOut()\"> log out </button> "
       + "</div>";
      // drop down with profile settings and log out
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


function logIn(){
  var uName = document.getElementById("log-in-Username");
  var password = document.getElementById("log-in-password");
  var test = document.getElementById("log_in_dropdown");
  var notEmpty = true;
  if(uName.value==""){
    uName.style.borderColor="red";
    notEmpty = false;
  //  setTimeout(() => {$('#log_in_dropdown').dropdown('toggle');
//                      test.setAttribute("class", "dropdown show")
  //                    test.childNodes[1].setAttribute("aria-expanded",'true')}, 100);
  } else {
     console.log("oof");
      $('#log_in_dropdown').dropdown('dispose');
  }
   if(password.value==""){
    password.style.borderColor="red";
    notEmpty=false;
  }

  if(notEmpty){
    // reload the navbar with username credentials

    // ^^ here
    loadifSignedIn('true');
  }

}

function logOut(){
  loadifSignedIn('false');


}
