function filter(type) {
    var row = document.getElementsByClassName("card");
    if(type == 0){
        for(var i = 0; i<row.length; i++){
            row[i].style.visibility = "visible";
        }
    }
    else {
        for(var i = 0; i<row.length; i++){
            if(row[i].getAttribute("tag") == null){
                row[i].style.visibility = "hidden";
            }
            else if(row[i].getAttribute("tag") == type){
                row[i].style.visibility = "visible";
            }
            else{
                row[i].style.visibility = "hidden";
            }
        }
    }
}
