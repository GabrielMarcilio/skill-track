const express = require('express');
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

require('./source/routes/routes')(app, passport, sql_username, sql_pass, sql_port, sql_host, sql_database)

function close(){
	sessionStore.close()
	server.close();
}

module.exports ={
		close: close,
		server:server
}