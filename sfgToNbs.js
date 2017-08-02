var ssh = require('../../common/utils/sftp-utils.js');
var fs = require('fs');
const config = require('../../common/config');
var url = config.sftp;
var sPath = config.paths.appServer.vsIncoming;
var dPath = config.paths.vsServer.outgoing;
var processedPath = config.paths.appServer.vsProcessed;
var async = require('async');

//calling sftp function to send dat files to SFG Server
ssh.putDirFilestoRemote(url, sPath, dPath, function(err) {
    {
        if (err) {
            console.log(err)
        } else {
            //reading the directory for moving files to the processed folder
            fs.readdir(sPath, function(err, list) {
                if (err) throw err;
                async.eachLimit(list, 10, function(obj, callback) {
                    if (obj.lastIndexOf('.DONE') > 0) {
                        fs.rename(sPath + obj, processedPath + 'Successfully_processed_' + obj, function(err) {
                            if (err) {
                                console.log(err);
                            }
                            console.log('moving .DONE to Processed folder...');
                            obj = obj.slice(0, -5);
                            fs.rename(sPath + obj, processedPath + 'Successfully_processed_' + obj);
                        });
                    }
                });
            });
        }
    }
});
