let fs = require('fs');
let json2csv = require('json2csv');
let jsonFile = require('jsonfile');
let file = '/Users/Madhusudhan/PLM_MDM/isOwnLabel.json';
let fields = ['brand','gtin','isOwnLabel'];

jsonFile.readFile(file, function(err,obj)
{
    if(!err)
    {
        var csv = json2csv({data: obj, fields: fields});
        fs.writeFile("./output/isOwnLabel",csv,'utf-8',function(error){
            if (error)
            {
                console.log("error writing file ito the specified path : " + error);
            }
            else
            {
                console.log("csv file created successfully");
            }
        });

    }
    else
    {
        console.log("Error reading file:" + err);
    }
});

