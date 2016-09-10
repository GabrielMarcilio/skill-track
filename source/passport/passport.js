// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
const sql = require('../db/database_access.js')

module.exports = function(passport, sql_info) {


    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
    	con = sql.createConnection(sql_info.host, sql_info.user, sql_info.password, sql_info.port, sql_info.database)
    	sql.connectMysql(con);
    	sql.readPersonById(con, id, function(err, rows){
    		if(err){
    			console.log('Sql error when desserializing user: ' + err)
    			done('Usuario não encontrado', {})
    		}
    		if((rows == undefined) || (rows.length == 0)){
    			done('Usuario não encontrado', {})
    		}
    		var user_row = rows[0];
    		
    		done(null, user_row)
    	});
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
    	con = sql.createConnection(sql_info.host, sql_info.user, sql_info.password, sql_info.port, sql_info.database)
    	
    	var name = req.body.name;
    	var confirmed_password = req.body.password_confirm;
    	
    	var parameter_allert = sql.validateAccountParameters(name, email, password, confirmed_password)
        if(parameter_allert.length > 0){
        	return done(null, false, req.flash('signup_message', parameter_allert))
        }
    	
    	
    	sql.connectMysql(con);

    	// Read the users table to check if the passed email is not in use
    	sql.readPersonByEmail(con, email, function(err, rows){
    		if(err){
				sql.disconnectMysql(con);
				return done(err);
			}
    		
    		if(rows.length >0){
    			sql.disconnectMysql(con);
    			return done(null, false, req.flash('signup_message', 'Email "' + email + '" já cadastrado.'))
    		}
    		else{
    			var password_to_store = password.hashCode()
    			
    			var new_user = {
    				'name':req.body.name,
    				'email':email,
    				'password':password_to_store,
    				'skills':'',
    				'passions':'',
    			}
    			sql.writePersons(con, [new_user], sql_info.database, function(err, result){
    				if(err){
    					sql.disconnectMysql(con);
    					return done(err);
    				}
    				var user_id = result.insertId
    				new_user.id = user_id
    				sql.disconnectMysql(con);
    				return done(null, new_user);
    			});
    		}
    	});
    }));
    
    // =========================================================================
    // LOCAL SIGNIN ============================================================
    // =========================================================================
    passport.use('local-signin', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
    	console.log('Usuario entrando: ' + email)
    	con = sql.createConnection(sql_info.host, sql_info.user, sql_info.password, sql_info.port, sql_info.database)
    	sql.connectMysql(con);

    	// Read the users table to check if the passed email is not in use
    	sql.readPersonByEmail(con, email, function(err, rows){
    		if(err){
				sql.disconnectMysql(con);
				return done(err);
			}
    		
    		if(rows.length !==1){
    			sql.disconnectMysql(con);
    			console.log('Login invalido (usuario nao encontrado)')
    			return done(null, false, req.flash('login_message', 'Usuário ou senha invalidos.'))
    		}
    		else{
    			var user_row = rows[0]
    			var password_to_check = password.hashCode()
    			var loaded_user = {
    				'name':user_row['name'],
    				'email':user_row['email'],
    				'password':user_row['password'],
    				'skills':user_row['skills'],
    				'passions':user_row['passions'],
    				'id':user_row['id']
    			} 
    			if(loaded_user.password == password_to_check){
    				sql.disconnectMysql(con);
    				console.log('Usuario logado')
        			return done(null, loaded_user)
    			}
    			else{
    				sql.disconnectMysql(con);
    				console.log('Password invalido')
        			return done(null, false, req.flash('login_message', 'Usuário ou senha invalidos.'))
    			}
    		}
    	});
    }));
};
