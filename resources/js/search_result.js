function filter(type) {
    var row = document.getElementsByClassName("card");
    if(type == 0){
        for(var i = 0; i<row.length; i++){
            row[i].classList.remove("hidden");

        }
    }
    else {
        for(var i = 0; i<row.length; i++){
            if(row[i].getAttribute("tag") == null){
                row[i].classList.add("hidden");

            }
            else if(row[i].getAttribute("tag") == type){
                row[i].classList.remove("hidden");

            }
            else{
                row[i].classList.add("hidden");

            }
        }
    }
}
