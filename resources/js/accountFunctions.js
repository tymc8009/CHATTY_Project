function signUpTest(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
       if (this.readyState == 4 && this.status == 200) {
        console.log("response",this.responseText);
      }
    }
    var username = document.getElementById("signup-username").value;
    request.open("GET", "userinfo.php?q="+username+"&pass=chatty2020", true);
    request.send();
}


function hi(){
    console.log("hi");
}

function login_test(){
  console.log("F off")
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
     if (this.readyState == 4 && this.status == 200) {
      console.log("response",this.responseText);
    }
  }
  request.open("GET","/getUserdata",true);
  console.log(request);
  request.send();
}
