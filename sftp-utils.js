var Client = require('ssh2').Client;

var conn = new Client();
const config = require('../../common/config');


var SSH2Utils = require('ssh2-utils');
var ssh = new SSH2Utils();


//download remote file to local path
module.exports.getRemoteFile = (url, sourcePath, destinationPath, fileName, callback) => {
    ssh.getFile(url, sourcePath + fileName, destinationPath + fileName, function(err) {
        if (err) {
            console.log(err);
            callback();
        } else {
            console.log("downloaded");
            callback();
        }
    });
};

//upload file to remote server
module.exports.putFiletoRemote = (url, sourcePath, destinationPath, fileName, callback) => {
    ssh.putFile(url, sourcePath + fileName, destinationPath + fileName, function(err) {
        if (err) {
            console.log(err);
            callback();
        } else {
            console.log("uploaded file");
            callback();
        }
    });
};

//upload all files from a local directory to the remote Server
module.exports.putDirFilestoRemote = (url, sourceDirectory, destinationDirectory, callback) => {
    ssh.putDir(url, sourceDirectory, destinationDirectory, function(err) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            console.log("uploaded directory");
            callback();
        }
    });
};
