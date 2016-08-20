var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
var sql = require('./source/db/database_access.js')

var app = express();

var port = process.env.OPENSHIFT_NODEJS_PORT  || 8080;
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

var sql_username = process.env.OPENSHIFT_MYSQL_DB_USERNAME;
var sql_pass = process.env.OPENSHIFT_MYSQL_DB_PASSWORD;
var sql_port = process.env.OPENSHIFT_MYSQL_DB_PORT;
var sql_host = process.env.OPENSHIFT_MYSQL_DB_HOST || "127.0.0.1"
var sql_database = 'skilltrack'
	
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serving static files
app.use('/lib', express.static(__dirname + '/lib'));
app.use('/source', express.static(__dirname + '/source'));

server = app.listen(port, ipaddress, function(){
  //Callback triggered when server is successfully listening. Hurray!
	console.log('Server listening por: ' + port)
});


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/home.html'));
});

app.get('/showSubscribePage', function(req, res) {
	res.sendFile(path.join(__dirname + '/sign_up.html'));
});

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


app.post('/signUp', function(req, res) {
	var user_info = req.body.user_info;
	
	// In tests we might specify a different database
	var database = req.body.database;
	if(database == undefined){
		database = sql_database;
	}
	con = sql.createConnection(sql_host, sql_username, sql_pass, sql_port, database)
	sql.connectMysql(con);
	
	// Read the users table to check if the passed email is not in use
	sql.readPersons(con, database, function(err, rows){
		var used_emails = [];
		for(var i=0; i<rows.length; i++){
			var user = rows[i];
			used_emails.push(user.email);
		}
		
		if(used_emails.indexOf(user_info.email) > -1){
			//Email already in use
			 res.status(409).send('Email "' + user_info.email + '" já cadastrado.');
			 sql.disconnectMysql(con);
		}
		else{
			
			sql.writePersons(con, [user_info], database, function(err, result){
				if(err){
					res.status(409).send('Não foi possivel cadastrar usuário');;
					sql.disconnectMysql(con);
				}
				sql.disconnectMysql(con);
				res.json({'name':user_info.name});
			
			});
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

module.exports = server;