var db = require('../source/db/database_access.js')
var test_database = "sk_test"; 

describe("Testing Interactions table access", function() {
	beforeEach(function(done) {
		var sql_username = process.env.OPENSHIFT_MYSQL_DB_USERNAME;
		var sql_pass = process.env.OPENSHIFT_MYSQL_DB_PASSWORD;
		var port = process.env.OPENSHIFT_MYSQL_DB_PORT;
		var host = process.env.OPENSHIFT_MYSQL_DB_HOST || "127.0.0.1";
		
		// First you need to create a connection to the db
		this.connection = db.createConnection(host, sql_username, sql_pass, port, test_database);
		db.clearTable('interactions', this.connection, done);
		
	});

	afterEach(function(done) {
		db.disconnectMysql(this.connection, done);
		
	});
	
	
	it("Testing Write and Read interactions", function(done){
		
		// Converting date to string to save in db
		var date_to_store = new Date(1988, 10, 30);
		
		var new_interaction = {
				'person_id':12, 'skill_name':'Acrobacy', 'date':date_to_store, 'description':'Amazing lessons!', 'reporter':23
		}
		
		connection = this.connection;
		db.writeInteraction(this.connection, new_interaction, test_database, function(err, rows){
			if(err){
				console.log('Error:' + error)
				throw err;
			}
			
			// Read the interactions just set
			db.readInteractions(connection, test_database, function(err, rows){
				if(err){
					throw err;
				}
				else{
					expect(rows.length).toBe(1);
					interaction_read = rows[0]
					attrs_to_check = ['person_id', 'skill_name', 'date', 'description', 'reporter'];
					var expected_values = new_interaction;
					
					// Coonverting the dates to strs to ease the comparison.
					expected_values['date'] = new Date(1988, 10, 30).toISOString();
					interaction_read['date'] = interaction_read['date'].toISOString();
					
					
					for(var i=0; i<attrs_to_check.length; i++){
						var attr_to_check = attrs_to_check[i];
						expect(interaction_read[attr_to_check]).toBe(expected_values[attr_to_check]);
					}
					
					done()
				}
			});
		});
	});
	
	it("Testing Update interactions", function(done){
		
		// Converting date to string to save in db
		var date_to_store = new Date(1988, 10, 30);
		var new_interaction = {
				'person_id':12, 'skill_name':'Acrobacy', 'date':date_to_store, 'description':'Amazing lessons!', 'reporter':23
		}
		connection = this.connection;
		
		// Writting one interaction to edit
		db.writeInteraction(this.connection, new_interaction, test_database, function(err, result){
			if(err){
				console.log('Error:' + err)
				throw err;
			}
			var interaction_id = result.insertId
			
			edited_interaction = {
				'person_id':70, 'skill_name':'Edit', 'date':date_to_store, 'description':'Edit is better!', 'reporter':80, 'interaction_id':interaction_id
			}
			
			db.updateInteraction(connection, edited_interaction, test_database)
			
			//Read the interaction table once again and check if the expected values are retrieved
			db.readInteractions(connection, test_database, function(err, rows){
				if(err){
					throw err;
				}
				else{
					expect(rows.length).toBe(1);
					interaction_read = rows[0]
					attrs_to_check = ['person_id', 'skill_name', 'date', 'description', 'reporter'];
					var expected_values = edited_interaction;
					
					// Coonverting the dates to strs to ease the comparison.
					expected_values['date'] = new Date(1988, 10, 30).toISOString();
					interaction_read['date'] = interaction_read['date'].toISOString();
					
					
					for(var i=0; i<attrs_to_check.length; i++){
						var attr_to_check = attrs_to_check[i];
						expect(interaction_read[attr_to_check]).toBe(expected_values[attr_to_check]);
					}
					
					done()
				}
			});
		});
	});
});
