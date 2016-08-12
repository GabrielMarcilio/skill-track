var mysql = require("mysql");

function createConnection(user, password, port, database){
	/**
	 * Creates a connecton object. This connection is responsible for executing queries in the 
	 * database.
	 */
	var con = mysql.createConnection({
	  host: "localhost",
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
	connection.query(
		"UPDATE "+ database + ".persons SET name = ?, email=?, skills=?, passions=? WHERE id = ?", 
		[person.name, person.email, person.skills, person.passions, person.id], callback);
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
	connection.query('INSERT INTO interactions SET ?', interaction, callback);
}

function readInteractions(connection, database, callback){
	/**
	 * Read all interactions stored in the database
	 */
	query = 'SELECT * FROM ' + database + '.interactions;'
	connection.query(query, callback);
}

function writePersons(persons, connection, callback){
	/**
	 * Writes a set os persons (JSON representation) into the table persons in dabase
	 * 
	 * @param{array} persons - An array of persons (JSON). Each person entry is composed by name, 
	 * email, skills and passions.
	 */
	var values = []
	
	for(var i=0; i<persons.length; i++){
    	current = persons[i]
    	var current_row = [current.name, current.email, current.skills, current.passions];
    	values.push(current_row);
	}
    	
    connection.query('INSERT INTO persons (name, email, skills, passions) VALUES ?', [values], callback);
	
}

function clearTable(table_name, connection, callback){
	/**
	 * Clear the persons table in the database.
	 */
	var query = 'DELETE FROM ' +table_name +';'
	connection.query(query, callback);
}

function readPersons(connection, callback){
	/**
	 * Get the persons stored in the table persons. The given callback will  be triggered with two
	 * parameters: the query status and the read rows. Each row will be a JSON repsresentation of 
	 * a person (name, email, id, skills and passions).
	 *
	 */
	query = 'SELECT * FROM persons;'
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
		updateInteraction: updateInteraction
}