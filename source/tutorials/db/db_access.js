var mysql = require("mysql");

function createConnection(user, password, port){
	var con = mysql.createConnection({
	  host: "localhost",
	  user: user,
	  password: password,
	  database:'sk_test',
	  port:port
	});
	
	return con
	
}

function connectMysql(connection){
	connection.connect(function(err){
	  if(err){
	    console.log('Error connecting to Db' + err);
	    throw err;
	  }
	  console.log('Connection established');
	});

}

function disconnectMysql(connection){
	connection.end(function(err) {
		if(err){
			console.log('Erro ao desconectar.' + err)
			throw err;
		}
		else{
			console.log('Desconectado');
		}
	});
}

function writePersons(persons, connection)
{

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
    console.log('Query:\n' + add_persons_query)
    
    connection.query(add_persons_query, function(err, rows){
		console.log('Add person send to db')
		if(err){
			console.log('Erro ao escrever pessoas: ' + err)
			throw err;
		}
		else{
			console.log('Sucesso ao escrever pessoas ');
		}
	});
   
	
}

function clearTable(table_name, connection){
	var query = 'DELETE FROM ' +table_name +';'
	console.log('Clear query:\n' + query)
	connection.query(query, function(err, rows){
		if(err){
			console.log('Error while clearing table: ' + err)
			throw err;
		}
		else{
			console.log('Table cleared: ' + table_name);
		}
	});
}

function readPersons(connection){
	query = 'SELECT * FROM persons;'
	connection.query(query, function(err, rows){
		if(err){
			console.log('Error while reading persons: ' + err)
			throw err;
		}
		else{
			console.log('Data read: ');
			for(var i=0; i<rows.length; i++){
				person = rows[i]
				console.log('Person read:');
				console.log('Name: ' + person.name);
				console.log('email: ' + person.email);
				console.log('id: ' + person.id);
				console.log('skills: ' + person.skills);
				console.log('passions: ' + person.passions);
				console.log('>>>>>>>>>>>>>>\n')
			}
		}
	});
}
//function execute_query(connection, query_command){
//	connection.query(query_command, function(err, rows){
//		console.log('Execute query callback: ' + query_command)
//		if(err){
//			console.log('Erro ao executar:' + query_command + " " + err)
//			throw err;
//		}
//		else{
//			console.log('Sucess '+ query_command);
//			console.log(rows)
//		}
//	});
//}

module.exports ={
		createConnection: createConnection,
		connectMysql: connectMysql,
		disconnectMysql: disconnectMysql,
		writePersons: writePersons,
		clearTable: clearTable,
		readPersons: readPersons,
}


