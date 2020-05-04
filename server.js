var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
var cookieParser = require('cookie-parser');
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cookieParser())
var pgp = require('pg-promise')();

const dbConfig = {
    host: 'chattyinstance.cfkrsgnujhka.us-east-2.rds.amazonaws.com',
    port: 5432,
    database: 'chatty_2020',
    user: 'chatty',
    password: 'chatty2020'
};

var db = pgp(dbConfig);


///////////////////////////////////////////
//  log in stuff

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));
app.locals.log_in_length = 10; // specifies how long the server keeps you logged in (measured in minutes)
// middleware function that sets the value of logged_in to the cookie
// will run ANYTIME a request is made
function log_in_variables(req, res, next) {
    //onsole.log("log in variables middleware",req.cookies);
    if (req.cookies.logged_in) {
        res.locals.logged_in = req.cookies.logged_in;
        if (req.cookies.logged_in == "true") // resets logged in timer
        {
            res.clearCookie("logged_in");
            res.cookie("logged_in", "true", {maxAge: 60000 * app.locals.log_in_length});
            res.cookie("User", req.cookies.User, {maxAge: 60000 * app.locals.log_in_length});
            var query = 'select * from customer where username = \'' + req.cookies.User + '\'';
            db.any(query).then(function (rows) {
                res.locals.user = rows[0];
                res.locals.current_site = req.originalUrl;
                next();
            })
        } else {
            res.locals.current_site = req.originalUrl;
            next();
        }
    } else {
        res.locals.logged_in = "false";
        res.locals.user = 'null';
        res.cookie("logged_in", "false");
        res.locals.current_site = req.originalUrl;
        next();
    }
}



/* inputs a username and returns a json object of the values stored in the database
    var query = 'select * from customer where username = '${username}'';
    console.log(query);
    db.any(query).then(function(rows){
    })
*/

app.use(log_in_variables);
app.get("/getUser", function(req,res){
    // console.log(req.query)
    if(req.query == null){
        res.redirect("/");
    } else {
        var query = 'select * from customer where username = \''+req.query.username+'\'';
        // console.log(query);
        db.any(query).then(function(rows){
            res.send(rows);
        })
    }
})

///////////////////////////////////////////////////////
app.get("/test", function(req,res) {
    console.log("test");
    res.send( "boom");
})
app.get("/getEmail", function(req,res){
    // console.log(req.query)
    if(req.query == null){
        res.redirect("/");
    } else {
        var query = "SELECT emailAddress FROM customer WHERE emailAddress='"+req.query.email+"'";
        console.log(query);
        db.any(query).then(function(rows){
            console.log("rows",rows);
            res.send(rows);
        })
    }
});
app.get("/verifyEmail", function (req,res) {
    console.log(req.query)
    if(req.query == null){
        res.redirect("/");
    } else {
        var query = "SELECT * FROM customer WHERE emailAddress='"+req.query.email+"'";
        console.log(query);
        db.any(query).then(function(rows){
            console.log("rows",rows);
            res.send(rows);
        })
    }
});
app.get("/community", function(req,res) {
    var query = 'SELECT * from restaurant as r JOIN restaurantcategory as c ON r.categoryid = c.categoryid LIMIT 5';
    var query2 = 'SELECT *,TO_CHAR(posttime, \'yyyy-mm-dd hh:mm:ss\') as time from post as p JOIN customer as c ON p.customerid = c.customerid order by posttime DESC' ;
    // console.log(req.cookies)

    db.task('get-everything', task => {
        return task.batch([
            task.any(query),
            task.any(query2)
        ]);
    })
        .then(info => {
            res.render('../view/pages/community',{
                my_title: 'Community',
                data: info[0],
                post: info[1]
            })
        })
        .catch(err => {
            // display error message in case an error
            console.log('error', err);
            response.render('../view/pages/community', {
                my_title: 'Community',
                data: '',
                post: ''
            })
        });

})

app.post("/deletepost", function(req,res) {
    var message = req.body.message;
    var username = req.cookies.User; // user name itself
    var query = 'SELECT * from restaurant as r JOIN restaurantcategory as c ON r.categoryid = c.categoryid LIMIT 5';
    var insert = "INSERT INTO post(customerid, postcontent)\n" +
        "SELECT customerid as id,'"+message+"'\n" +
        "from customer where username = '"+username+"';";
    var query2 = 'SELECT *,TO_CHAR(posttime, \'yyyy-mm-dd hh:mm:ss\') as time from post as p JOIN customer as c ON p.customerid = c.customerid order by posttime DESC' ;
    db.task('get-everything', task => {
        return task.batch([
            task.any(query),
            task.any(insert),
            task.any(query2)
        ]);
    })
        .then(info => {
            res.render('../view/pages/community',{
                my_title: 'Community',
                data: info[0],
                post: info[2],
            })
        })
        .catch(err => {
            // display error message in case an error
            console.log('error', err);
            response.render('../view/pages/community', {
                my_title: 'Community',
                data: '',
                post: ''
            })
        });
    // res.redirect('/community')

})

app.post("/editpost", function(req,res,next) {
    var post = req.body.myModal_body;
    var id = req.body.modal_id;
    var username = req.cookies.User; // user name itself
    var query = 'UPDATE post SET postcontent = \''+post+'\' WHERE postid = '+id;
    db.task('get-everything', task => {
        return task.batch([
            task.any(query)
        ]);
    })
        .then(info => {
            res.redirect('/community');
        })
        .catch(err => {
            // display error message in case an error
            console.log('error', err);
            response.render('../view/pages/community', {
                my_title: 'Community',
                data: '',
                post: ''
            })
        });
})


app.post("/delete", function(req,res,next) {
    var post = req.body.myModal_body;
    var id = req.body.modal_id;
    var username = req.cookies.User; // user name itself
    var query = 'UPDATE post SET postcontent = \''+post+'\' WHERE postid = '+id;
    db.task('get-everything', task => {
        return task.batch([
            task.any(query)
        ]);
    })
        .then(info => {
            res.redirect('/community');
        })
        .catch(err => {
            // display error message in case an error
            console.log('error', err);
            response.render('../view/pages/community', {
                my_title: 'Community',
                data: '',
                post: ''
            })
        });
})

app.get('/', function(req, res){
    // console.log("rendering homepage");
    res.redirect('/home')

});
app.get('/home', function(req, res){
    console.log("rendering homepage");
    var query1 = 'select restaurant.*, restaurantcategory.categoryname, restaurantcategory.category_img from restaurant left join restaurantcategory on restaurant.categoryid=restaurantcategory.categoryid where restaurant.categoryid = 9';
    var query2 = 'select restaurant.*, restaurantcategory.categoryname, restaurantcategory.category_img from restaurant left join restaurantcategory on restaurant.categoryid=restaurantcategory.categoryid where restaurant.categoryid = 10';
    var query3 = 'select restaurant.*, restaurantcategory.categoryname, restaurantcategory.category_img from restaurant left join restaurantcategory on restaurant.categoryid=restaurantcategory.categoryid where restaurant.categoryid = 2';
    var query4 = 'select restaurant.*, restaurantcategory.categoryname, restaurantcategory.category_img from restaurant left join restaurantcategory on restaurant.categoryid=restaurantcategory.categoryid where restaurant.categoryid = 13';
    var query5 = 'select restaurant.*, restaurantcategory.categoryname, restaurantcategory.category_img from restaurant left join restaurantcategory on restaurant.categoryid=restaurantcategory.categoryid where restaurant.categoryid = 1';
    db.task('get-everything', task => {
        return task.batch([
            task.any(query1),
            task.any(query2),
            task.any(query3),
            task.any(query4),
            task.any(query5)
        ]);
    })
        .then(data => {
            res.render('../view/pages/home',{
                my_title: "Home page",
                result_1: data[0], // mexican
                result_2: data[1], // italian
                result_3: data[2], // chinese
                result_4: data[3], // breakfast
                result_5: data[4]  // American
            })
        })
        .catch(err => {
            console.log('error', err);
            res.render('../view/pages/home',{
                my_title: "Home page",
                result_1: '',
                result_2: '',
                result_3: '',
                result_4: '',
                result_5: ''
            })
        });
});
app.post("/insertpost", function(req,res) {
    var message = req.body.message;
    var username = req.cookies.User; // user name itself
    var query = 'SELECT * from restaurant as r JOIN restaurantcategory as c ON r.categoryid = c.categoryid LIMIT 5';
    var insert = "INSERT INTO post(customerid, postcontent)\n" +
        "SELECT customerid as id,'" + message + "'\n" +
        "from customer where username = '" + username + "';";
    var query2 = 'SELECT *,TO_CHAR(posttime, \'yyyy-mm-dd hh:mm:ss\') as time from post as p JOIN customer as c ON p.customerid = c.customerid order by posttime DESC';
    db.task('get-everything', task => {
        return task.batch([
            task.any(query),
            task.any(insert),
            task.any(query2)
        ]);
    })
        .then(info => {
            res.render('../view/pages/community', {
                my_title: 'Community',
                data: info[0],
                post: info[2],
            })
        })
        .catch(err => {
            // display error message in case an error
            console.log('error', err);
            response.render('../view/pages/community', {
                my_title: 'Community',
                data: '',
                post: ''
            })
        });
})

app.post('/login', function(req, res){
    console.log("logging in");
    var user_name = req.body.loginUsername;
    var password = req.body.loginPassword;
    //var c = req.body.currSite;
    // console.log(req);
    var query = "select * from account where username ='"+ user_name + "' AND password ='" +password+"';";
    // console.log(query);
    db.any(query)
        .then(function (rows) {
            if(rows.length>0){
                res.cookie("logged_in","true", {maxAge:60000*app.locals.log_in_length});
                res.cookie("User", rows[0].username, {maxAge:60000*app.locals.log_in_length});
            }
            res.send(rows[0]);
        })
        .catch(function (err) {
            // display error message in case an error
            console.log('error', err);
            return
        })
    // Problem: need to address failures;

});
app.post('/signup', function(req, res){
    console.log("signing up");
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var zip = req.body.zip;
    var first = req.body.first_name;
    var lastName = req.body.last_name;
    query1 = "INSERT INTO customer (\"username\", \"emailaddress\",\"zip\",\"firstname\",\"lastname\") VALUES ('"+username+"','"+email+"','"+zip+"','"+first+"','"+lastName+"');";
    query2 = "INSERT INTO account(\"username\", \"password\") VALUES ('"+username+"','"+password+"');";
    console.log(query1);
    console.log(query2);

    db.task('get-everything', task => {
        return task.batch([
            task.any(query2),
            task.any(query1)
        ]);
    }).then(function(){
        res.cookie("logged_in","true", {maxAge:60000*app.locals.log_in_length});
        res.cookie("User", req.body.username, {maxAge:60000*app.locals.log_in_length});
        res.redirect('/profilepage')
    });

    // Problem: need to address failures;
});

app.get("/logout",function (req,res) {
    res.cookie("User","None");
    res.cookie("logged_in","false");
    res.redirect('/');
});


app.get("/results", function (req,res) {
    // console.log("rendering");
    var temp = req.query.search_query;
    // capitalize the search query
    var search_query = temp.toUpperCase();
    var db_query = "select restaurant.*, restaurantcategory.categoryname, restaurantcategory.category_img " +
        "from restaurant left join restaurantcategory " +
        "on restaurant.categoryid=restaurantcategory.categoryid " +
        "where \"restaurantName\" like '%" + search_query + "%';";
    db.any(db_query)
        .then(function (info) {
            res.render('../view/pages/searchResult',{
                my_title: "Result Page",
                data: info
            })
        })
        .catch(function (err) {
            // display error message in case an error
            console.log('error', err);
            response.render('../view/pages/home', {
                title: 'Home Page',
                data: ''
            })
        })
});

app.get('/restaurant_info', function(req,res) {
    var id = req.query.id;
    var query = "select * from restaurant where restaurantid =" + id;
    var reviewquery = "select * from review INNER JOIN customer on review.customerid = customer.customerid where review.restaurantid= " + id;
    db.task('get-everything', task=>{
        return task.batch ([
            task.any(query),
            task.any(reviewquery),
        ]);
    })
        .then(data=> {
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
    var restaurantid= req.body.Bob;
    var query = "INSERT INTO review (restaurantid,customerid,star,comment) VALUES ("+restaurantid+","+username+","+querynumber+",'"+message+"');";
    db.any(query)
        .then(info => {
            var link= '/restaurant_info?id='+ req.body.Bob;
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

app.get('/profilePage', function(req,res) {

    var customer = 'Select restaurant."restaurantName", restaurant.restaurantid, restaurant.description, savelist.lasttimevisited from savelist inner join restaurant on restaurant.restaurantid = savelist.restaurantid inner join customer on customer.customerid = savelist.customerid where customer.username = ' + '\''+ req.cookies.User+ '\'';

    // console.log(customer)
    db.task('get-everything', task=>{
        return task.batch ([
            task.any(customer)
        ]);
    })
        .then(data=> {
            res.render('../view/pages/profilePage', {
                data: data
            })
        })
});
// app.post('/profilePage', function(req,res) {
//     var pic = req.customer.profilePic;
//     var bio = req.customer.bio;
//     //query = UPDATE customer SET profileimg = pic WHERE req.cookies.User;
//
//     db.task('get-everything', task => {
//         return task.batch([
//             task.any(query)
//         ]);
//     });
// })



app.listen(5678);
console.log('5678 is the magic port');