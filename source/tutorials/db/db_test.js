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
    	'name':'Dummy','email':'dummy@gmail.com', 'skills':'python, java, qwt', 'passions':'fiction, board game, video game'
     },
     {
    	 'name':'Dummy 2','email':'dummy2@gmail.com', 'skills':'cooking, teaching, planning', 'passions':'tripping, game of thrones, cats'
     },
]
sql.clearTable('persons', con);
sql.writePersons(persons, con);

person = {
		'name':'New Name','email':'new@gmail.com', 'skills':' new python, java, qwt', 'passions':' new fiction, board game, video game','id':'80'
}
database = 'sk_test'
sql.editPerson(con, person, database)
sql.readPersons(con);
sql.disconnectMysql(con);



