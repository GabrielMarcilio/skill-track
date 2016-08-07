var db = require('../source/db/database_access.js')

describe("Testing Database access", function() {
	beforeEach(function() {
		var sql_username = process.env.OPENSHIFT_MYSQL_DB_USERNAME;
		var sql_pass = process.env.OPENSHIFT_MYSQL_DB_PASSWORD;
		var port = process.env.OPENSHIFT_MYSQL_DB_PORT;

		// First you need to create a connection to the db
		this.connection = db.createConnection(sql_username, sql_pass, port)
		db.clearTable('persons', this.connection, 'sk_test');
		
	});
	
	afterEach(function() {
		db.disconnectMysql(this.connection);
		
	});
	
	it("Testing Write and Read Persons", function(){
		// Adding some persons in the db and checking if they are correctly obtained back
		var persons = [
           {
        	   'name':'Mario','email':'mario@nintendo.com', 'skills':'Running, Jumping', 'passions':'Pasta, Juventus, Karts'
           },
           {
        	   'name':'Luiggi','email':'luigi@nintendo.com', 'skills':'Running, Cooking', 'passions':'Dinossaurs, Kart, Ghosts'
           },
        ]

		//Sending data
		db.writePersons(persons, this.connection);
		
		//Reading back
		db.readPersons(this.connection, function(err, rows){
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
					
					var obtained_data = [name_read, email_read, skills_read, passions_read];
					expected_data = all_expected_data[name_read];
					
					expect(obtained_data).toBe(expected_data);
					delete all_expected_data[name_read];
				}
				
			}
		});
	});
});
