const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const passport = require('passport')  
const session = require('express-session')  
const MySQLStore = require('express-mysql-session')(session);
const sql = require('./source/db/database_access.js')
const flash    = require('connect-flash');
const app = express();

var port = process.env.OPENSHIFT_NODEJS_PORT  || 8080;
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

var sql_username = process.env.OPENSHIFT_MYSQL_DB_USERNAME;
var sql_pass = process.env.OPENSHIFT_MYSQL_DB_PASSWORD;
var sql_port = process.env.OPENSHIFT_MYSQL_DB_PORT;
var sql_host = process.env.OPENSHIFT_MYSQL_DB_HOST || "127.0.0.1"
var sql_database = process.env.MYSQL_DATABASE_NAME ||'skilltrack'
	
var sql_info = {
    host: sql_host,
    port: sql_port,
    user: sql_username,
    password: sql_pass,
    database: sql_database
};
	 
var sessionStore = new MySQLStore(sql_info);

require('./source/passport/passport')(passport, sql_info); // pass passport for configuration

app.use(session({
    secret: 'session_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize())  
app.use(passport.session())  
app.use(flash());
app.set('view engine', 'ejs'); // set up ejs for templating

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serving static files
app.use('/lib', express.static(__dirname + '/lib'));
app.use('/source', express.static(__dirname + '/source'));

server = app.listen(port, ipaddress, function(){
	console.log('Server listening port: ' + port)
});


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/home.html'));
});

app.get('/showSubscribePage', function(req, res) {
	res.render('sign_up.ejs', { message: req.flash('signup_message') }); 
});

app.get('/showLogInPage', function(req, res) {
    res.render('sign_in.ejs', { message: req.flash('login_message') }); 
});

app.get('/skilltrackNetwork', isLoggedIn, function(req, res) {
	res.sendFile(path.join(__dirname + '/logged.html'));
});



function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()){
        return next();
    }
	
    // if they aren't redirect them to the home page
    res.redirect('/');
}

app.get('/loadInteractions', function(req, res) {
	// Callback triggered when load interactions is requested
	con = sql.createConnection(sql_host, sql_username, sql_pass, sql_port, sql_database)
	sql.connectMysql(con);
	
	sql.readInteractions(con, sql_database, function(err, rows){
		// Once connected and the rows were read, we can send then to the client
		if(err){
			throw err;
		}
		else{
			res.json(rows);
			sql.disconnectMysql(con);
		}
	});
});

app.get('/loadPersons', function(req, res) {
	// Callback triggered when load persons is requested
	con = sql.createConnection(sql_host, sql_username, sql_pass, sql_port, sql_database)
	sql.connectMysql(con);
	
	sql.readPersons(con, sql_database, function(err, rows){
		// Once connected and the rows were read, we can send then to the client
		if(err){
			throw err;
		}
		else{
			res.json(rows);
			sql.disconnectMysql(con);
		}
	});
});


app.post('/storeInteraction', function(req, res) {
	var interaction = req.body.interaction;
	con = sql.createConnection(sql_host, sql_username, sql_pass, sql_port, sql_database)
	sql.connectMysql(con);
	sql.writeInteraction(con, interaction, sql_database, function(err, rows){
		if(err){
			throw err;
		}
		else{
			sql.disconnectMysql(con);
		}
	});
});


app.post('/storePerson', function(req, res) {
	var person = req.body.person;
	
	con = sql.createConnection(sql_host, sql_username, sql_pass, sql_port, sql_database)
	sql.connectMysql(con);
	
	sql.writePersons(con, [person], sql_database, function(err, rows){
		if(err){
			throw err;
		}
		else{
			sql.disconnectMysql(con);
		}
	});
});

app.post('/updatePerson', function(req, res) {
	var person = req.body.person;
	con = sql.createConnection(sql_host, sql_username, sql_pass, sql_port, sql_database)
	sql.connectMysql(con);
	
	sql.updatePerson(con, person, sql_database, function(err, rows){
		if(err){
			throw err;
		}
		else{
			sql.disconnectMysql(con);
		}
	});
});

require('./source/routes/routes')(app, passport)

function close(){
	sessionStore.close()
	server.close();
}

module.exports ={
		close: close,
		server:server
}