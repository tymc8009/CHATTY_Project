function addCard(id){
  var ranId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
   var card = $('<div class="card" id="'+ranId+'" ><div class="card-body">'+
   '<img class="card-img-left" src="https://upserve.com/media/sites/2/kaboompics_Bar-in-the-eclectically-designed-interior-1-e1515709265222.jpg"'+
   'alt="Card image" height="200px"></div></div>');
   card.appendTo(document.getElementById(id));
}
