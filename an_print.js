var http = require('http');

http.createServer(function(request,response){
	response.writeHead('200');
	response.write('Hello this is your first Node local server');
	setTimeout(function(){
		response.write(" . Waiting just like that for 5secs as instructed!");
		response.end(); },5000); 
}).listen(8081, function(){
	console.log('listening on port 8081');
});