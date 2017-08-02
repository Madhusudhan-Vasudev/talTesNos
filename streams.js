var fs = require('fs'); 
var http = require ('http'); 

http.createServer(function(request,response){
	var newFile = fs.createWriteStream("streams.md");
	var fileBytes = request.headers['content-length'];
	var uploadedBytes = 0;
	request.on('readable',function(){
		var chunk = null;
		while(null !== (chunk=request.read())){
			uploadedBytes += chunk.length;
			var progress = (uploadedBytes/fileBytes)*100;
			response.write("Progress:" + parse.Int(progress, 10) + "?%\n");

			};


			});


	request.pipe(newFile);  
	request.on('end', function(){
				response.end('File uploaded');
				});
}).listen(8081,function(){
	console.log('LISTENING ON PORT:8081');
});