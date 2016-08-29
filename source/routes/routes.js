const sql = require('../db/database_access.js')

module.exports = function(app, passport, sql_username, sql_pass, sql_port, sql_host, sql_database) {

	app.get('/', function(req, res) {
		res.render('home.ejs')
	});
	
	app.get('/showSubscribePage', function(req, res) {
		res.render('sign_up.ejs', { message: req.flash('signup_message') }); 
	});
	
	app.get('/showLogInPage', function(req, res) {
	    res.render('sign_in.ejs', { message: req.flash('login_message') }); 
	});
	
	app.get('/skilltrackNetwork', isLoggedIn, function(req, res) {
		res.render('skilltrack_network.ejs')
	});

	app.post('/signUp', passport.authenticate('local-signup', {
		successRedirect : '/skilltrackNetwork', // redirect to the secure profile section
		failureRedirect : '/showSubscribePage', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
	
	app.post('/signIn', passport.authenticate('local-signin', {
		successRedirect : '/skilltrackNetwork', // redirect to the secure profile section
		failureRedirect : '/showLogInPage', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
	
	
	app.get('/logout', function(req, res){
	    console.log('Received a logout request');
	    req.logout();
	    res.redirect('/');
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
	
	
	
};

