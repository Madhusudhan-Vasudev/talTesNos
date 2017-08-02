var Agenda = require('agenda');
var connectionString = "127.0.0.1:27017/db";
var agenda = new Agenda({db: { address: connectionString, collection: 'test' }});
/*function someFunction(callback){
  console.log("hey jude don't be so sad");
callback();
}*/

function agendaScheduler(schedulerName, functionName, runTime){
  console.log('started');
  console.log('Scheduler ', schedulerName);

  agenda.define(schedulerName, function(job, done) {
    console.log("defined");
     functionName(function(err, data)
     {
       console.log("calling done");
         if(err) {
             done(err);
         } else {
             done();
         }
     });
});

agenda.every(runTime,schedulerName);

};

function startAgenda(runTime, callbacks){
console.log("startAgenda Called");
agenda.on('ready',function() {
console.log("ready to call job");
 agenda.start();
 callbacks();
});
}

// agendaScheduler('beatles_song',someFunction);

module.exports.agendaScheduler = agendaScheduler;
module.exports.startAgenda = startAgenda;
