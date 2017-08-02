var listener = require('mongo-watcher');


var options = {
  database: 'db',
	collection: 'test'
};

var changeStream = listener.listen(options);

changeStream.on('data', function(data) {
  console.log(data);
	console.log("New file name and path inserted");
});
