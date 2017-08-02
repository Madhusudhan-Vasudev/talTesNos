let Client = require('ssh2-sftp-client');
let sftp = new Client();

sftp.connect({
  host: 'v-source.co.uk',
  port: 22,
  username: 'tescofood2',
  password: 'NavOskeud4'
}).then(() => {
    return sftp.list('/uat/incoming/');
    console.log("read dir");
}).then((data) => {
  console.log(data);
     sftp.rename('/uat/incoming/products_household_20170616092642.xlsx', '/uat/incoming/processed/products_household_20170616092642.xlsx').then(() => {
      console.log("moved the file");
    });
}).catch((err) => {
    console.log(err, 'catch error');
});
