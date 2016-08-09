var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser')

const PORT=9090; 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(PORT, function(){
	  //Callback triggered when server is successfully listening. Hurray!
	  console.log("Server listening on: http://localhost:%s", PORT);
	});


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/test_page.html'));
});

app.get('/jquery.js', function(req, res) {
	res.sendFile(path.join(__dirname + '/jquery.js'));
});
app.get('/utils.js', function(req, res) {
	console.log('Obtaining jquery')
	res.sendFile(path.join(__dirname + '/utils.js'));
});
app.get('/sum', function(req, res) {
	console.log('Received req' + req)
	
	karine = {
		"name":"Mario", 
		"email":"mario@nintendo.com"
	};
	
	gabriel = {
		"name":"Luigi", 
		"email":"luigi@nintendo.com"
	}
	
	couple = [karine, gabriel]
	res.json(couple);
});

app.post('/postingpersons', function(req, res) {
    var persons = req.body.persons;
    
    for(var i=0; i<persons.length; i++){
    	var current = persons[i];
    	console.log('Read:' + current.name + " " + current.email);
    }
    
});



