

var http = require('http');

var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

var serve = serveStatic("./");

var port = process.env.OPENSHIFT_NODEJS_PORT  || 8080;
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

var server = http.createServer(function(req, res) {
	
    var done = finalhandler(req, res);
    serve(req, res, done);
});

console.log('Serving: ' + ipaddress + ' ' + port)
server.listen(port, ipaddress);