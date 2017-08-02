let Client = require('ssh2-sftp-client');
let sftp = new Client();
let async = require('async');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/db';
var sPath = '/uat/incoming/';
var dPath = '/Users/Madhusudhan/temp/';
var processedPath = '/uat/incoming/processed/';
var scheduler = require('./scheduler');
var scheduleName = 'sftpJob';
var fs = require('fs');
var timeInterval = '45 seconds';


function reconnect(connCallback){
  vs(function(err){
    if(err){
      reconnect(connCallback);
    }
    else{
      connCallback();
    }
  });
};

var vs = function(caller){
  sftp.connect({
    host: 'v-source.co.uk',
    port: 22,
    username: 'tescofood2',
    password: 'NavOskeud4'
      }).then((arg1, arg2) => {
          console.log("connected to sftp");
          caller();
      }).catch((err) => {
        console.log(err, 'catch error');
        caller(err);
    });
  };

var sftper = function(next){
  console.log("the sftp function has been called");
  sftp.list(sPath).then((list) => {
//     console.log(list);
     async.eachLimit(list, 10, function(obj, callback){
//       console.log(obj.name);
       var count = 0;

       if(obj.name.lastIndexOf(".DONE")>0){
         console.log("done file name:" + obj.name);
         sftp.rename(sPath + obj.name, processedPath + "Successfully_processed_" + obj.name).then(() => {
           console.log("moving .DONE to Processed folder...");
           obj.name = obj.name.slice(0,-5);
           sftp.get(sPath + obj.name).then((stream) => {
              stream.pipe(fs.createWriteStream(dPath));
            }).then(() => {
              console.log("downloaded the file");
                next(null, list);
            }).catch((err) => {
              console.log(err, 'catch error');
            });
          });
        }
      });
  }).catch((err) => {
    console.log(err, 'catch error');
    next(err);
  });


};

scheduler.startAgenda(timeInterval, function(){
  reconnect(function(){
  scheduler.agendaScheduler(scheduleName,sftper, timeInterval);
  //setInterval(sftper, 5000);
    console.log("calling scheduler");
  });
});
