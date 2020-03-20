var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var pgp = require('pg-promise')();

const dbConfig = {
    host: 'chattyinstance.cfkrsgnujhka.us-east-2.rds.amazonaws.com',
    port: 5432,
    database: 'chatty_2020',
    user: 'chatty',
    password: 'chatty2020'
};

var db = pgp(dbConfig);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));

app.get('/', function(req, res){
    res.sendFile('/view/home.html', { root: __dirname});
});


app.post('/view/home.html/login', function(req, res){
    var user_name = req.body.loginUsername;
    var password = req.body.loginPassword;
    query = "select * from account where username = '"+ user_name + "' AND password ='" +password+"';";
    console.log(query);
    db.any(query)
        .then(function (rows) {
            if(rows.length>0){
                res.redirect('/view/home_success.html')
            }else{
                res.redirect('/view/home.html', onerror("wrong"))
            }
        })
        .catch(function (err) {
            // display error message in case an error
            console.log('error', err);
        })
    // Problem: need to address failures;

});
app.post('/view/home.html/signup', function(req, res){
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
            res.redirect('/view/home.html')
        ]);

        // Problem: need to address failures;
    })
});


app.listen(5678);
console.log('5678 is the magic port');
