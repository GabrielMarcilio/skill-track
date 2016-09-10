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


function validateAccountParameters(name, email, password, confirmed_password){
	/**
	 * Checks if the account data provided by the user is valid
	 * 
	 * @returns{String} A sting with the data pendencies found (or an empty string if the data is valid).
	 */
	var alerts =[];
	var pendencies = '';
		
	if(name == ''){
    	alerts.push('Insira um nome para o usuário');
    }
    
    if(email == ''){
    	alerts.push('Insira um email');
    }

    if(password.length < 5){
    	alerts.push('A senha deve ter no mínimo 5 caracteres');
    }
    
    else if(password !== confirmed_password){
    	alerts.push('Erro ao confirmar a senha');
    }
    
    if(alerts.length > 0){
    	pendencies = alerts.join('\n')
    }
    
    return pendencies;
	
}

String.prototype.hashCode = function() {
	/**
	* Generate a hash representation for the given string
    */
    var hash = 0, i, chr, len;
    if (this.length === 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr   = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
     return hash;
};

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
		readPersonById:readPersonById,
		validateAccountParameters:validateAccountParameters
}