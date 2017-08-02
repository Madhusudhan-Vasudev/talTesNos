var Client = require('ssh2').Client;
let async = require('async');
var conn = new Client();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/db';
var sPath = '/uat/incoming/';
var dPath = '/Users/Madhusudhan/temp/';
var processedPath = '/uat/incoming/processed/';
var scheduler = require('./scheduler');
var scheduleName = 'sftpJob';
var Agenda = require('agenda');


//  function(finish){
  conn.on('ready', function() {
  console.log('Client :: ready');
  conn.sftp(function(err, sftp) {
    if (err) {
      console.log("connection timed out - retry again");
    };
    sftp.readdir(sPath, function(err, list) {
      if (err) throw err;
    async.eachLimit(list, 10, function(obj, callback){
      var currentdate = new Date();
//      console.log(obj.filename);
      var count = 0;

      if(obj.filename.lastIndexOf(".DONE")>0){
        sftp.rename(sPath + obj.filename, processedPath + "Successfully_processed_" + obj.filename, function(err){
          if (err){
            console.log(err);
          }
          console.log("moving .DONE to Processed folder...")

          obj.filename = obj.filename.slice(0,-5);
          sftp.fastGet(sPath + obj.filename, dPath + obj.filename, function(err){
          if (err) {
            console.log(err);
          }
          sftp.rename(sPath + obj.filename, processedPath + "Successfully_processed_" + obj.filename)
          count++;
          console.log(count + " File/s downloaded from VS");
          console.log("moving .xlsx to Processed folder...")

          var insertDocument = function(db, callback2) {
             db.collection('test').insertOne( {
                "file" : obj.filename,
                "path" : dPath,
                "inputDate" : currentdate,
                "source" : "VS",
                "status" : "Unpicked"


             }, function(err, result) {
              assert.equal(err, null);
              console.log("Inserted a document into the watched collection.");
              callback2();
            });
          };

          MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            insertDocument(db, function() {
                db.close();
            });
          });

          callback();

        });

        });
      }else {
          delete this.obj;
          console.log('A folder detected and is not a file: skipping to search file next')
          callback();
      }
      //callback();
  }, function(err){
    if(err) {
      console.log('error in : ' + err);
      finish();
    }
    console.log("shutting down sftp conn after completing the operation");

//    finish();
  });
  });
});
}).connect({
  host: 'v-source.co.uk',
  port: 22,
  username: 'tescofood2',
  password: 'NavOskeud4'
//  setTimeout: 5000
});
//}



//scheduler.agendaScheduler(scheduleName, vsSftp, '45 seconds');
