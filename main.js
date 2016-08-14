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
var sql_database = 'skilltrack'
	
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serving static files
app.use('/lib', express.static(__dirname + '/lib'));
app.use('/source', express.static(__dirname + '/source'));

app.listen(port, function(){
  //Callback triggered when server is successfully listening. Hurray!
  console.log("Server listening on: http://localhost:%s", port);
});


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/loadInteractions', function(req, res) {
	// Callback triggered when load interactions is requested
	con = sql.createConnection(sql_username, sql_pass, sql_port, sql_database)
	sql.connectMysql(con);
	
	sql.readInteractions(con, sql_database, function(err, rows){
		console.log('Loading interactions')
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
	con = sql.createConnection(sql_username, sql_pass, sql_port, sql_database)
	sql.connectMysql(con);
	
	sql.readPersons(con, function(err, rows){
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
	con = sql.createConnection(sql_username, sql_pass, sql_port, sql_database)
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
	
	con = sql.createConnection(sql_username, sql_pass, sql_port, sql_database)
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
	con = sql.createConnection(sql_username, sql_pass, sql_port, sql_database)
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

