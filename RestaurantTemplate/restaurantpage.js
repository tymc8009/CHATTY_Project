app.get('/restaurant_info/post', function(req,res) {
  var restaurant_id= //  get restaurant id
  var location = // location id select * ;
  var reviews = // reviews select* probably
  var phonenumber= // phone number select * from table;
  var hours = // hours select * from table;
  db.task('get-everything', task=>{
    return task.batch ([
      task.any(restaurant_id),
      task.any(location),
      task.any(review)
      task.any(phonenumber),
      task.any(hour)
    ]);
  })
  .then(data=> {
    res.render('pages/restaurant_info', {
      my_title:"Restaurant information",
      data: data[0],
      restaurant:// data
      Location: //data
      Reviews: //data
      Phonenumbers: //data
      hours: // data
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
