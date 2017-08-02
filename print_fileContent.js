var scheduler = require('./scheduler');
var scheduleName = 'trialers';

function killers(onFinish){
console.log("Peace sells but who buys");
onFinish();
}

//setTimeout(() => {
scheduler.agendaScheduler(scheduleName, killers, '1 seconds');
//}, 3000);
