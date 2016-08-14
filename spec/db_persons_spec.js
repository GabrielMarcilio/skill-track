var db = require('../source/db/database_access.js')
var test_database = "sk_test"; 

describe("Testing Database access", function() {
	beforeEach(function(done) {
		var sql_username = process.env.OPENSHIFT_MYSQL_DB_USERNAME;
		var sql_pass = process.env.OPENSHIFT_MYSQL_DB_PASSWORD;
		var port = process.env.OPENSHIFT_MYSQL_DB_PORT;

		// First you need to create a connection to the db
		this.connection = db.createConnection(sql_username, sql_pass, port, test_database);
		db.clearTable('persons', this.connection, done);
		
	});
	
	afterEach(function(done) {
		db.disconnectMysql(this.connection, done);
		
	});
	
	it("Testing Write and Read Persons", function(done){
		// Adding some persons in the db and checking if they are correctly obtained back
		var persons = [
           {
        	   'name':'Mario','email':'mario@nintendo.com', 'skills':'Running, Jumping', 'passions':'Pasta, Juventus, Karts'
           },
           {
        	   'name':'Luiggi','email':'luigi@nintendo.com', 'skills':'Running, Cooking', 'passions':'Dinossaurs, Kart, Ghosts'
           },
        ]

		var connection = this.connection;
		//Sending data
		db.writePersons(this.connection, persons, function(err, result){
			//Reading back
			db.readPersons(connection, function(err, rows){
				if(err){
					throw err;
				}
				else{
					var all_expected_data = {
						'Mario':['mario@nintendo.com', 'Running, Jumping', 'Pasta, Juventus, Karts'],
						'Luiggi':['luigi@nintendo.com', 'Running, Cooking', 'Dinossaurs, Kart, Ghosts']
					}
	
					expect(rows.length).toBe(2);
					for(var i=0; i<rows.length; i++){
						person = rows[i]
						var name_read = person.name;
						var email_read = person.email;
						var skills_read = person.skills;
						var passions_read = person.passions;
						
						var obtained_data = [email_read, skills_read, passions_read];
						expected_data = all_expected_data[name_read];
						
						for(var j=0; j<3; j++){
							expect(obtained_data[i]).toBe(expected_data[i]);
						}
						delete all_expected_data[name_read];
					}
					done();
				}
			});
		});
	});
	
it("Testing Update person", function(done){
		
		// Converting date to string to save in db
		connection = this.connection;
		person = {
	        	   'name':'Mario','email':'mario@nintendo.com', 'skills':'Running, Jumping', 'passions':'Pasta,Juventus,Karts'
        }
		
		// Writting one interaction to edit
		db.writePersons(connection, [person], function(err, result){
			if(err){
				console.log('Error:' + err)
				throw err;
			}
			var person_id = result.insertId
			
			// Forcing a some non-ascii strs
			edited_person = {
				'name':'New Mário','email':'new_mario@nintendo.com', 'skills':'Running, Jumping, poço', 'passions':'Pasta,Juventus,Karts,pokemon', 'id':person_id
			}
			
			db.updatePerson(connection, edited_person, test_database, function(err, result){
				if(err){
					console.log('Error when updating persons')
					throw err;
				}
				//Read the persons table once again and check if the expected values are retrieved
				db.readPersons(connection, function(err, rows){
					if(err){
						throw err;
					}
					else{
						expect(rows.length).toBe(1);
						person_read = rows[0]
						attrs_to_check = ['name', 'email', 'skills', 'passions', 'id'];
						var expected_values = edited_person;
						
						
						
						for(var i=0; i<attrs_to_check.length; i++){
							var attr_to_check = attrs_to_check[i];
							expect(person_read[attr_to_check]).toBe(expected_values[attr_to_check]);
						}
						
						done()
					}
				});
			});
		});
	});
});
