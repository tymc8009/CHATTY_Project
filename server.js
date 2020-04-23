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
    console.log("log in variables middleware",);
    if(req.cookies.logged_in){
        res.locals.logged_in = req.cookies.logged_in;
        if(req.cookies.logged_in=="true") // resets logged in timer
        {
            res.clearCookie("logged_in");
            res.cookie("logged_in","true", {maxAge:60000*app.locals.log_in_length});
            res.cookie("User", req.cookies.User);
            var query = `select * from customer where username = '${req.cookies.User}'`;
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
    var query = `select * from customer where username = '${username}'`;
    console.log(query);
    db.any(query).then(function(rows){

    })
*/

app.use(log_in_variables);
app.get("/getUser", function(req,res){
    console.log(req.query == undefined);
    if(req.query.username == undefined){
        res.redirect("/");
    } else {
        var query = `select username from customer where username = '${req.query.username}'`;
        console.log(query);
        db.any(query).then(function(rows){
            res.send(rows);
        })
    }
});

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
///////////////////////////////////////////////////////
// useless get function, can be used to test $.get requests
app.get("/test", function(req,res) {
    console.log("test");
    res.send( "boom");
});

app.get('/', function(req, res){
    console.log("rendering homepage");
    res.render('../view/home'
    );
});

app.get('/view/profilePage',function(req,res){
    res.redirect("/profilePage");
});

app.get('/profilePage', function(req, res){
    console.log("rendering");
  res.render('../view/profilePage',{ root: __dirname});
});

app.post('/login', function(req, res){
    console.log("logging in");
    var user_name = req.body.loginUsername;
    var password = req.body.loginPassword;
    //var c = req.body.currSite;
    console.log(req);
    var query = "select * from account where username = '"+ user_name + "' AND password ='" +password+"';";
    console.log(query);
    db.any(query)
        .then(function (rows, c) {
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
app.listen(5678);
console.log('5678 is the magic port');
