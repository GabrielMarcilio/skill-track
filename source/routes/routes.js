const sql = require('../db/database_access.js')

module.exports = function(app, passport, sql_username, sql_pass, sql_port, sql_host, sql_database) {

	app.get('/', function(req, res) {
		res.render('home.ejs', { is_logged: req.isAuthenticated(), message: req.flash('login_message') });
	});
	
	
	app.get('/userInfo', isLoggedIn, function(req, res){
		var user_id = req.session.passport.user;
		
		var con = sql.createConnection(sql_host, sql_username, sql_pass, sql_port, sql_database)
		sql.connectMysql(con);
		
		sql.readPersonById(con, user_id, function(err, rows){
    		if(rows.length == 0){
    			var user_name = undefined;
    			var user_type = undefined;
    		}
    		else{
    			var user_name = rows[0].name;
    			var user_type = rows[0].type;
    		}
    		
    		var user_info = {
    			'name':user_name,
    			'user_id': user_id,
    			'type': user_type,
    		}
    		sql.disconnectMysql(con);
    		res.json(user_info);
    	});
		
	});
	
	app.get('/showSubscribePage', function(req, res) {
		res.render('sign_up.ejs', { message: req.flash('signup_message'), is_logged: req.isAuthenticated() }); 
	});
	
	app.get('/showUpdateProfile', isLoggedIn, function(req, res) {
		var user_id = req.session.passport.user;
		
		var con = sql.createConnection(sql_host, sql_username, sql_pass, sql_port, sql_database)
		sql.connectMysql(con);
		
		sql.readPersonById(con, user_id, function(err, rows){
    		if(rows.length == 0){
    			var user_email = undefined
    		}
    		else{
    			var user_email = rows[0].email;
    		}
    		
    		var user_info = {
    			'user_email':user_email,
    			'user_id': user_id
    		}
    		sql.disconnectMysql(con);
    		res.render('update_account.ejs', { 
    				error_message: req.flash('update_error_message'), 
    				success_message:req.flash('update_success_message'),
    				user_email:user_email
    			}
    		)
		});
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
		failureRedirect : '/',
		failureFlash : true // allow flash messages
	}));
	
	
	app.get('/logout', function(req, res){
		console.log('Usuario Saindo.')
	    req.logout();
	    res.redirect('/');
	});
	

	function isLoggedIn(req, res, next) {
		/**
		 * Redirect not logged calls to root
		 */
	    if (req.isAuthenticated()){
	        return next();
	    }
		
	    // if they aren't redirect them to the home page
	    res.redirect('/');
	}

	app.get('/loadInteractions', function(req, res) {
		// Callback triggered when load interactions is requested
		var con = sql.createConnection(sql_host, sql_username, sql_pass, sql_port, sql_database)
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
		var con = sql.createConnection(sql_host, sql_username, sql_pass, sql_port, sql_database)
		sql.connectMysql(con);
		
		sql.readPersons(con, sql_database, function(err, rows){
			// Once connected and the rows were read, we can send then to the client
			if(err){
				sql.disconnectMysql(con);
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
		console.log('Storing interaction ' + interaction.person_id + ' : ' + interaction.skill_name)
		var con = sql.createConnection(sql_host, sql_username, sql_pass, sql_port, sql_database)
		sql.connectMysql(con);
		sql.writeInteraction(con, interaction, sql_database, function(err, rows){
			if(err){
				console.log('Interaction Store fail')
				throw err;
			}
			else{
				console.log('Interaction store success')
				res.json({});
				sql.disconnectMysql(con);
			}
		});
	});


	app.post('/storePerson', function(req, res) {
		var person = req.body.person;
		
		var con = sql.createConnection(sql_host, sql_username, sql_pass, sql_port, sql_database)
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
		var user_id = req.session.passport.user;

		// Either editing current user, or an admin is updating another user
		console.log('Session:' + req.session)
		var updating_current_user = user_id == person.id;
			
		console.log('Update person request.' + person.name + ' : ' +  person.skills + ' : ' +  person.passions)
		var con = sql.createConnection(sql_host, sql_username, sql_pass, sql_port, sql_database)
		sql.connectMysql(con);
		
		sql.readPersonById(con, user_id, function(err, rows){
			if(rows.length == 0){
    			var user_type = undefined
    		}
    		else{
    			var user_type = rows[0].type;
    		}
			
			var is_admin = user_type == 'admin';
			
			console.log('Is admin? ' + is_admin + ' Is current? ' + updating_current_user);
			if(is_admin || updating_current_user){
				sql.updatePerson(con, person, sql_database, function(err, rows){
					if(err){
						console.log('Update person error: ' + err);
						throw err;
					}
					else{
						console.log('Update sucessfull')
						res.json({});
						sql.disconnectMysql(con);
					}
				});
			}
			else {
				console.log('Failed to updated user: ' + person.id + ' from: ' + user_id)
				sql.disconnectMysql(con);
				throw 'Permissão negada para editar usuario'
			} 
				
		});
	});
	
	app.post('/updateProfile', function(req, res) {
		var name = req.body.name;
    	var confirmed_password = req.body.password_confirm;
    	var password = req.body.password
    	var email = req.body.email
    	var user_id = req.session.passport.user;
    	
    	var parameter_allert = sql.validateAccountParameters(name, email, password, confirmed_password)
        if(parameter_allert.length > 0){
        	req.flash('update_error_message', parameter_allert)
        	sql.disconnectMysql(con);
        	res.redirect('/showUpdateProfile');
        	return
        }
        else{
        	console.log('Running else')
        	// Checking if the given email is not in use
        	var con = sql.createConnection(sql_host, sql_username, sql_pass, sql_port, sql_database)
    		sql.connectMysql(con);
        	
        	sql.readPersonByEmail(con, email, function(err, rows){
        		if(err){
        			req.flash('update_error_message', 'Erro ao acessar base de dados: ' + err);
        			sql.disconnectMysql(con);
        			res.redirect('/showUpdateProfile');
        			return;
    			}
        		else if(rows.length >1){
        			req.flash('update_error_message', 'Multiplos usuarios com email: ' + email);
        			sql.disconnectMysql(con);
        			res.redirect('/showUpdateProfile');
        			return;
        		}
        		else if(rows.length ==1){
        			var user_with_email = rows[0].id
        			if(user_with_email != user_id){
        				console.log('Invalid email')
        				req.flash('update_error_message', 'Já existe um usuário com o email: ' + email);
        				sql.disconnectMysql(con);
        				res.redirect('/showUpdateProfile');
        				return;
        			}
        		}

        		// If the code arrived at this point, we can update the user profile
        		var person = {
        			id:user_id,
        			email:email,
        			password:password.hashCode(),
        		}
        		var con = sql.createConnection(sql_host, sql_username, sql_pass, sql_port, sql_database)
        		sql.connectMysql(con);
        		
        		sql.updatePerson(con, person, sql_database, function(err, rows){
        			if(err){
        				req.flash('update_error_message', 'Erro a acessar base de dados');
        				sql.disconnectMysql(con);
        				res.redirect('/showUpdateProfile');
        				return
        			}
        			else{
        				req.flash('update_success_message', 'Dados Atualizados')
        				sql.disconnectMysql(con);
        				res.redirect('/showUpdateProfile');
        				return
        			}
        		});
        		
        	});
        }
    	
	});
	
	
	
};

