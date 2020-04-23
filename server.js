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
function log_in_variables(req, res, next){
    //onsole.log("log in variables middleware",req.cookies);
    if(req.cookies.logged_in){
        res.locals.logged_in = req.cookies.logged_in;
        if(req.cookies.logged_in=="true") // resets logged in timer
        {
            res.clearCookie("logged_in");
            res.cookie("logged_in","true", {maxAge:60000*app.locals.log_in_length});
            res.cookie("User", req.cookies.User);
            var query = 'select * from customer where username = \''+req.cookies.User+'\'';
            db.any(query).then(function(rows){
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
        res.cookie("logged_in","false");
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
    console.log(req.query)
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
            post: info[1],
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

app.post("/insertpost", function(req,res) {
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

})
app.get('/', function(req, res){
    // console.log("rendering homepage");
    res.redirect('/home')

});
app.get('/home', function(req, res){
    console.log("rendering homepage");
    var query1 = 'select * from restaurant where categoryid = 9';
    var query2 = 'select * from restaurant where categoryid = 10';
    var query3 = 'select * from restaurant where categoryid = 2';
    var query4 = 'select * from restaurant where categoryid = 13';
    var query5 = 'select * from restaurant where categoryid = 1';
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

//profile page
app.get('/view/profilePage', function(req, res){
    // console.log("rendering");
  res.redirect('/profilePage');
});

app.get('/profilePage', function(req,res) {

    var customer = 'Select restaurant."restaurantName", restaurant.restaurantid, restaurant.description, savelist.lasttimevisited, review.comment from savelist inner join review on review.reviewid = savelist.reviewid inner join restaurant on restaurant.restaurantid = savelist.restaurantid inner join customer on customer.customerid = savelist.customerid where customer.username = ' + '\''+ req.cookies.User+ '\'';


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
app.post('/profilePage', function(req,res){
    var pic = req.customer.profilePic;
    var bio = req.customer.bio;
    //query = UPDATE customer SET profileimg = pic WHERE req.cookies.User;

    db.task('get-everything', task => {
        return task.batch([
            task.any(query)
        ]);
});


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
    res.cookie("logged_in","false");
    res.clearCookie("user");
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

    db.any(query)
        .then(data=> {
            res.render('../view/pages/restaurantpage', {
                my_title:"Restaurant information",
                data:data[0]
            })
        })
        .catch(err=> {
            console.log('error',err);
            res.render('../view/pages/restaurantpage', {
                title:"Restaurant information",
                data:''
            })
        });
});


app.listen(5678);
console.log('5678 is the magic port');
