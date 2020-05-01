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
