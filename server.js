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
    if(req.cookies.logged_in){ // use this for testing if user is logged in (server side)
        res.locals.logged_in = req.cookies.logged_in; // logged_in can bue used in ejs files
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
    console.log(req.query)
    if(req.query == null){
        res.redirect("/");
    } else {
        var query = `select * from customer where username = '${req.query.username}'`;
        console.log(query);
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

// home page
app.get('/home', function(req, res){
    console.log("rendering homepage");
    var query = 'select * from restaurant where zip = 80007';
    db.any(query)
        .then(function (rows){
            res.render('pages/home',{
                    my_title: "Home page",
                    data: rows,
                    // restaurantid: '',
                    // restaurantName: '',
                    // categroy: '',
                    // city: '',
                    // state: '',
                    // zip: '',
                    // description: '',
                    // price: '',
                    // phonenumber: '',
                    // logo_img: '',
                    // menu: ''
                })
            console.log(rows);
            })
        .catch(function (err) {

        }
    );
});

app.post()

app.get('/view/profilePage', function(req, res){
    console.log("rendering");
  res.render('pages/profilePage',{ root: __dirname});
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
    console.log(req.body);
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var zip = req.body.zip;
    query1 = "INSERT INTO customer (\"username\", \"emailAddress\",\"zip\") VALUES ('"+username+"','"+email+"','"+zip+"');";
    query2 = "INSERT INTO account(\"username\", \"password\") VALUES ('"+username+"','"+password+"');";
    console.log(query1);
    console.log(query2);

    db.task('get-everything', task => {
        return task.batch([
            task.any(query1),
            task.any(query2)
        ]);
    }).then(function(){
            res.cookie("logged_in","true", {maxAge:60000*app.locals.log_in_length});
            res.cookie("User", req.body.username, {maxAge:60000*app.locals.log_in_length});
            res.redirect('pages/profilepage')
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
