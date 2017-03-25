// Configuring env variable required for testing
var test_database = "sk_test";
process.env.MYSQL_DATABASE_NAME =test_database

var db = require('../source/db/database_access.js')
var supertest = require('supertest')

var app = require('../main.js')

test_ran = 0;
total_tests = 3;

describe("Test app services", function() {
	beforeEach(function(done) {
		// Starting the server
		var sql_username = process.env.OPENSHIFT_MYSQL_DB_USERNAME;
		var sql_pass = process.env.OPENSHIFT_MYSQL_DB_PASSWORD;
		var port = process.env.OPENSHIFT_MYSQL_DB_PORT;
		var host = process.env.OPENSHIFT_MYSQL_DB_HOST || "127.0.0.1";
		
		// First you need to create a connection to the db
		this.connection = db.createConnection(host, sql_username, sql_pass, port, test_database);
		var connection = this.connection
		
		// Clearing the tables used
		db.clearTable('persons', connection, done);
		test_ran +=1
	});
	

	afterEach(function(done) {
		//Shuting down server and terminating sql connection
		if (test_ran==total_tests){
			// Argh! Jasmine-Node does not support afterAll, and  i can only close the server 
			//after all tests have ran
			app.close()
		}
		db.disconnectMysql(this.connection, done);
		
	});
	
	it("Testing Create user", function(done){
		var name= 'Mario';
		var email= 'mario@nintendo.com';
		var password = 'Its me! Mario!';
		
		var connection = this.connection;
		
		supertest(app.server)
	      .post('/signUp')
	      .send({'name': name, 'email':email, 'password':password, 'password_confirm':password, 'class_id': 2})
	      .end(function(err, res){
	    	  
	    	  // At this point we expect one person to be added in the persons table
	    	  db.readPersons(connection, test_database, function(err, rows){
					if(err){
						done.fail(err)
					}
					else{
						expect(rows.length).toBe(1);
						var created_person = rows[0];
						expect(created_person.name).toBe('Mario');
						expect(created_person.email).toBe('mario@nintendo.com');
						expect(created_person.skills).toBe('');
						expect(created_person.passions).toBe('');
						expect(created_person.class_id).toBe(2);
						
						var expected_password = 'Its me! Mario!'.hashCode().toString()
						expect(created_person.password).toBe(expected_password);
						done()
					}
		      });
	     });
	});
	
	it("Testing Duplicated email", function(done){
		var password = 'Its me! Mario!'
		var user_data = {
			'name': 'Mario',
			'email': 'mario@nintendo.com',
			'password': password.hashCode(),
			'skills': 'Jumping,Running',
			'passions': 'Pasta,Juventus',
			'class_id': 1
			
		}
		var connection = this.connection;
		
		// Directly adding the user in the db
		db.writePersons(connection, [user_data], test_database, function(err, result){
			// Now attempt to register a user with the same email
			supertest(app.server)
		      .post('/signUp')
		      .send({'name': 'Luigi', 'email':'mario@nintendo.com', 'password':'Its me! Luiggi!', 'password_confirm':'Its me! Luiggi!'})
		      .expect(302, 'Moved Temporarily. Redirecting to /showSubscribePage', done)
		});
	});

	
	it("Testing LogIn", function(done){
		var password = 'Its me! Mario!'
		var user_data = {
			'name': 'Mario',
			'email': 'mario@nintendo.com',
			'password': password.hashCode(),
			'skills': 'Jumping,Running',
			'passions': 'Pasta,Juventus',
			'class_id': 3
					
		}
		var connection = this.connection;
		
		// Directly adding the user in the db
		db.writePersons(connection, [user_data], test_database, function(err, result){
			// Now attempt to log in with the created user info
			supertest(app.server)
			.post('/signIn')
			.send({'email': 'mario@nintendo.com', 'password':'Its me! Mario!'})
			.expect(302, 'Moved Temporarily. Redirecting to /skilltrackNetwork') // Redirecting to protected content
			.end(done)
		});
	});	
});
