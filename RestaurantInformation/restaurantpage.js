app.get('/restaurant_info', function(req,res) {
    var id = req.query.id;
    var query = "select * from restaurant where restaurantid =" + id;
    var reviewquery = "select * from review INNER JOIN customer on review.customerid = customer.customerid where review.restaurantid= " + id;
    console.log(query)
    db.task('get-everything', task=>{
        return task.batch ([
            task.any(query),
            task.any(reviewquery),
        ]);
    })
        .then(data=> {
            console.log(data[0])
            res.render('../view/pages/restaurantpage', {
                my_title:"Restaurant information",
                data:data[0],
                reviewdata:data[1],
            })
        })
        .catch(err=> {
            console.log('error',err);
            res.render('../view/pages/restaurantpage', {
                title:"Restaurant information",
                data:'',
                reviewdata: ""
            })
        });
});
app.post("/postReview", function(req,res) {
    var message = req.body.message;
    var username = res.locals.user.customerid;
    var querynumber= req.body.reviews;
    console.log(message);
    console.log(username);
    console.log(querynumber);
    var restaurantid= req.body.Bob;
    console.log( "hello",restaurantid);
    var query = "INSERT INTO review (restaurantid,customerid,star,comment) VALUES ("+restaurantid+","+username+","+querynumber+",'"+message+"');";
    console.log(query);
    db.any(query)
        .then(info => {
            console.log("before link");
            var link= '/restaurant_info?id='+ req.body.Bob;
            console.log(link);
            res.redirect(link);
        })
        .catch(err => {
            // display error message in case an error
            console.log('error', err);
            response.render('../view/pages/restaurantpage', {
                my_title: 'Review',
                data: '',
                post: ''
            })
        });
 })
