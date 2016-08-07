var sql = require('./db_access')

var sql_username = process.env.OPENSHIFT_MYSQL_DB_USERNAME;
var sql_pass = process.env.OPENSHIFT_MYSQL_DB_PASSWORD;
var port = process.env.OPENSHIFT_MYSQL_DB_PORT;

console.log('SQL Param:' + sql_username + ' ' + sql_pass + ' ' + port);
// First you need to create a connection to the db
var con = sql.createConnection(sql_username, sql_pass, port)
sql.connectMysql(con);


var persons = [
     {
    	'name':'Gabriel','email':'gaheris.sc@gmail.com', 'skills':'python, java, qwt', 'passions':'fiction, board game, video game'
     },
     {
    	 'name':'Karine','email':'koceano@gmail.com', 'skills':'cooking, teaching, planning', 'passions':'tripping, game of thrones, cats'
     },
]
sql.clearTable('persons', con);
sql.writePersons(persons, con);
sql.readPersons(con);
sql.disconnectMysql(con);
//var create_user_query = "CREATE USER 'paulo_alberto'@'%' IDENTIFIED BY 'paulo_alberto';";
//var add_provileges = "GRANT INSERT, SELECT ON sk_test.cities TO 'paulo_alberto'@'%';"
	
//console.log('Creating user')
//sql.execute_query(con, create_user_query);

//console.log('Adding priviledges')
//sql.execute_query(con, add_provileges);


//console.log('Disconnecting')
//con_paulo = con
//con_paulo.changeUser({user : 'paulo_alberto', password:'paulo_alberto', database:'sk_test'});
//console.log('Activating new user connection')
//console.log('Requesting query')
//sql.execute_query(con_paulo, 'SELECT * FROM cities;')
//
////var add_user_2 = create_connection("add_user", "add_user");
//var add_user_2 = con_paulo;
//add_user_2.changeUser({user : 'add_user', password:'add_user', database:'sk_test'});
//sql.execute_query(add_user_2, "DROP USER 'paulo_alberto'@'%';");
//sql.disconnect_mysql(add_user_2)


