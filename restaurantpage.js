app.get('/restaurant_info/post', function(req,res) {
  var restaurant_id= select restaurantName from restaurant ;
  var location = select address,city,state  from restaurant ;
  var reviews = select comment from review;
  var phonenumber= select phonenumber from restaurant ;
  db.task('get-everything', task=>{
    return task.batch ([
      task.any(restaurant_id),
      task.any(location),
      task.any(review),
      task.any(phonenumber)
    ]);
  })
  .then(data=> {
    res.render('pages/restaurant_info', {
      my_title:"Restaurant information",
      data: data[0],
      restaurant: restaurant_id,
      Location: location,
      Reviews: review,
      Phonenumbers: phonenumber,
    })
  })
  .catch(err=> {
    console.log('error',err);
    res.render('pages/restaurant_info/select_restaurant', {
      title:"Restaurant information",
      data: '',
      singleplayer:'',
      games_played:''
      restaurant:'',
      Location: '',
      Reviews: '',
      Phonenumbers: '',
      hours: '',
    })
  });
});
