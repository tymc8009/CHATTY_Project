function saveChanges(){
    var pic = document.getElementById("profilePicture");
    var bio = document.getElementById("bio");

    if(pic == null && bio != null){
        document.getElementById("display-bio").innerHTML = bio;
    }
    else if(pic != null && bio == null){
        document.getElementById("display-pic").innerHTML = pic;
    }
    else if(pic != null && bio != null){
        document.getElementById("display-bio").innerHTML = bio;
        document.getElementById("display-pic").innerHTML = pic;
    }
}