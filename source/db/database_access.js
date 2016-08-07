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

function writePersons(persons, connection, callback){
	/**
	 * Writes a set os persons (JSON representation) into the table persons in dabase
	 * 
	 * @param{array} persons - An array of persons (JSON). Each person entry is composed by name, 
	 * email, skills and passions.
	 */
    var query_lines = [
        'INSERT INTO persons (name, email, skills, passions)',
        'VALUES',
    ]
	
    for(var i=0; i<persons.length; i++){
    	current = persons[i]
    	query_line = "('"+current.name+"' , '" + current.email + "' , '" + current.skills+"' , '" + current.passions+"')"
    	
    	if( i==persons.length-1){
    		query_line +=';' 
    	}
    	else{
    		query_line +=','
    	}
    	
    	query_lines.push(query_line)
    }
    
    var add_persons_query = query_lines.join('\n');
    connection.query(add_persons_query, callback);
	
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
}