var db = require('../source/db/database_access.js')
var supertest = require('supertest')

var test_database = "sk_test";
var server = require('../main.js')

test_ran = 0;
describe("Testing Users table access", function() {
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
		if (test_ran==2){
			// Argh! Jasmine-Node does not support afterAll, and  i can only close the server 
			//after all tests have ran
			server.close()
		}
		db.disconnectMysql(this.connection, done);
		
	});
	
	
	
	it("Testing Create user", function(done){
		var user_data = {
			'name': 'Mario',
			'email': 'mario@nintendo.com',
			'password': 'Its me! Mario!',
			'skills': 'Jumping,Running',
			'passions': 'Pasta,Juventus'
			
		}
		var connection = this.connection;
		supertest(server)
	      .post('/signUp')
	      .send({'user_info': user_data, 'database':test_database})
	      .expect(200)
	      .end(function(){
	    	  
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
						expect(created_person.skills).toBe('Jumping,Running');
						expect(created_person.passions).toBe('Pasta,Juventus');
						expect(created_person.password).toBe('Its me! Mario!');
						done()
					}
		      });
	     });
	});
	
	it("Testing Duplicated email", function(done){
		var user_data = {
			'name': 'Mario',
			'email': 'mario@nintendo.com',
			'password': 'Its me! Mario!',
			'skills': 'Jumping,Running',
			'passions': 'Pasta,Juventus'
			
		}
		var connection = this.connection;
		
		// Directly adding the user in the db
		db.writePersons(connection, [user_data], test_database, function(err, result){
			// Now attempt to register a user with the same email
			var another_data = {
				'name': 'Luigi',
				'email': 'mario@nintendo.com',
				'password': 'Its me! Luiggi!',
				'skills': 'No Skills at all',
				'passions': 'Sleeping'
				
			}
			supertest(server)
		      .post('/signUp')
		      .send({'user_info': another_data, 'database':test_database})
		      .expect(409, 'Email "mario@nintendo.com" já cadastrado.', done)
		});
	});
	
});
