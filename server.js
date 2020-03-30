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
app.locals.log_in_length = 10; // specifies how long the server keeps you logged in (measured in minutes)
// middleware function that sets the value of logged_in to the cookie
// will run ANYTIME a request is made
function log_in_variables(req, res, next){
    console.log("log in variables middleware",req.cookies);
    if(req.cookies.logged_in){
        res.locals.logged_in = req.cookies.logged_in;
        if(req.cookies.logged_in=="true") // resets logged in timer
        {
            res.clearCookie("logged_in");
            res.cookie("logged_in","true", {maxAge:60000*app.locals.log_in_length});
        }
    } else {
        res.locals.logged_in = "false";
        res.cookie("logged_in","false");
    }

    res.locals.current_site = req.originalUrl;
    next();
}


app.use(log_in_variables);

///////////////////////////////////////////////////////


app.get('/', function(req, res){
    console.log("rendering");
    res.render('../view/home'
    );
});

app.get('/view/profilePage', function(req, res){
    console.log("rendering");
  res.render('../view/profilePage',{ root: __dirname});
});

app.post('/login', function(req, res){
    console.log(req.body.currSite);
    var user_name = req.body.loginUsername;
    var password = req.body.loginPassword;
    var c = req.body.currSite;
    var query = "select * from account where username = '"+ user_name + "' AND password ='" +password+"';";
    console.log(query);
    db.any(query)
        .then(function (rows, c) {
            console.log("test");
            if(rows.length>0){
                console.log("e");
                res.cookie("logged_in","true", {maxAge:60000*app.locals.log_in_length});
                res.redirect(req.body.currSite);
            }else{
                console.log("ee");
            }
        })
        .catch(function (err) {
            // display error message in case an error
            console.log('error', err);
            return
        })
    // Problem: need to address failures;

});
app.post('/signup', function(req, res){
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var zip = req.body.zip;
    query1 = "INSERT INTO customer (\"username\", \"emailAddress\",\"zip\") VALUES ('"+username+"','"+password+"','"+zip+"');";
    query2 = "INSERT INTO account(\"username\", \"password\") VALUES ('"+username+"','"+password+"');";
    console.log(query1);
    console.log(query2);

    db.task('get-everything', task => {
        return task.batch([
            task.any(query1),
            // Problem: Need to solve when username already exist in the customer table.
            task.any(query2),
            res.redirect('/')
        ]);

        // Problem: need to address failures;
    })
});

app.get("/logout",function (req,res) {
    res.cookie("logged_in","false");
    res.redirect('/');
});
app.listen(5678);
console.log('5678 is the magic port');
