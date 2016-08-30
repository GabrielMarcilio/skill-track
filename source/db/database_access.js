var mysql = require("mysql");

function createConnection(host, user, password, port, database){
	/**
	 * Creates a connecton object. This connection is responsible for executing queries in the 
	 * database.
	 */
	var con = mysql.createConnection({
	  host: host,
	  user: user,
	  password: password,
	  database:database,
	  port:port
	});
	
	return con
	
}

function connectMysql(connection, callback){
	/**
	 * Connects a connection object to the database.
	 */
	connection.connect(callback);

}

function disconnectMysql(connection, callback){
	/**
	 * Disconnects from the connected database. It will wait for any pending query before terminate 
	 * the connection.
	 */
	connection.end(callback);
}


function updatePerson(connection, person, database, callback){
	/**
	 * Updates the given person data into the database
	 */
	update_query = 'UPDATE '+ database+'.persons SET ? WHERE ?'
	
	connection.query(update_query, [person, {'id':person.id}], callback);
}

function updateInteraction(connection, interaction, database, callback){
	/**
	 * Updates the given interaction (json) in the database
	 */
	connection.query('UPDATE interactions SET ? WHERE ?', [interaction, {'interaction_id':interaction.interaction_id}], callback);
}
		  

function writeInteraction(connection, interaction, database, callback){
	/**
	 * stores the given interaction (json) in the database
	 */
	date = interaction.date
	
	if (typeof date === 'string' || date instanceof String){
		// Replacing a string with a date object (jquery might have converted it)
		interaction.date = new Date(interaction.date)
	}
	
	if(interaction.reporter == ''){
		// Replacing an empty string with undefined (jquery might have converted it)
		interaction.reporter = undefined
	}
	connection.query('INSERT INTO interactions SET ?', interaction, callback);
}


function readInteractions(connection, database, callback){
	/**
	 * Read all interactions stored in the database
	 */
	query = 'SELECT * FROM ' + database + '.interactions;'
	connection.query(query, callback);
}

function writePersons(connection, persons, database, callback){
	/**
	 * Writes a set os persons (JSON representation) into the table persons in dabase
	 * 
	 * @param{array} persons - An array of persons (JSON). Each person entry is composed by name, 
	 * email, skills and passions.
	 */
	var values = []
	
	for(var i=0; i<persons.length; i++){
    	current = persons[i]
    	var current_row = [current.name, current.email, current.skills, current.passions, current.password];
    	values.push(current_row);
	}
    
	var query = 'INSERT INTO ' + database + '.persons (name, email, skills, passions, password) VALUES ?'
    connection.query(query, [values], callback);
	
}

function clearTable(table_name, connection, callback){
	/**
	 * Clear the persons table in the database.
	 */
	var query = 'DELETE FROM ' +table_name +';'
	connection.query(query, callback);
}

function readPersons(connection, database, callback){
	/**
	 * Get the persons stored in the table persons. The given callback will  be triggered with two
	 * parameters: the query status and the read rows. Each row will be a JSON repsresentation of 
	 * a person (name, email, id, skills and passions).
	 *
	 */
	query = 'SELECT * FROM '+ database+'.persons;'
	connection.query(query, callback);
}


function readPersonByEmail(connection, email, callback){
	query = "SELECT * FROM persons where email = '" +email +"';" 
	connection.query(query, callback);
}

function readPersonById(connection, id, callback){
	query = "SELECT * FROM persons where id = '" +id +"';" 
	connection.query(query, callback);
}
module.exports ={
		createConnection: createConnection,
		connectMysql: connectMysql,
		disconnectMysql: disconnectMysql,
		writePersons: writePersons,
		clearTable: clearTable,
		readPersons: readPersons,
		updatePerson:updatePerson,
		writeInteraction:writeInteraction,
		readInteractions:readInteractions,
		updateInteraction: updateInteraction,
		readPersonByEmail:readPersonByEmail,
		readPersonById:readPersonById
}