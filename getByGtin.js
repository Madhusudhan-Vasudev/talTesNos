var readline = require('readline'),
    request  = require('request'),   
     stream  = require('stream'),
         fs  = require('fs'),
		   _ = require('lodash');


var fileName='output.csv',
    missingSet='missing.csv',
    instream = fs.createReadStream('./input.csv'),
    url = "https://product.api.tesco.com//v3/products/?",
    na="MISSING";

//var args = process.argv[2];
var token=process.argv[2],
    perRequest=process.argv[3];


// Write Output File Header    

fs.writeFile(fileName, "uniqueKey|gtin|tpnb|tpna|tpnc|description|"
  	 					  +"brand|commercialHierarchy|"
  	 					  +"subclassCode|subclassName|className|sectionName|departmentName|"
  	                      +"code|custFriendlyDesc|launchDate|authorised|deactivated|epw|"
  	                      +"rmsStatus|sellByType|"
  	                      +"isFood|isDrink|netContents|"
  	                      +"netContentsMatched|netContentsStr|missingAttrs|isBrandedInfo|"
  	                      +"gda|digitalContent|nutrition|allergenAdvice|calcNutrition|marketingText"
  	                      +"\n", 
			function (err) { if (err) return console.log(err); });

// Write missing gtin  file Header  

fs.writeFile(missingSet, "gtin" +"\n", 
			function (err) { if (err) return console.log(err); });


// Product Object construction with functions to check Attributes, get country attributes and get output

function product(obj){

	this.product   = obj;

	this.searchAttr = function (str, subStr){

						var escapeWords = ['℮'];

						var searchValue=_.chain(subStr)
						                  .upperCase()
						                  .words()
						                  .without(_.join(escapeWords,','))
						                  .value();

						var searchInString=_.chain(str)
						                     .upperCase()
						                     .words()
						                     .intersection(searchValue)
						                     .join('')
						                     .value();


					    var match = function (){ 
					    				if (searchInString.length>0) {return true}  else {return false }
					                };
						  
						return  {matched: match(), matchedString: searchInString}             
						                  
					}
	this.attrExist = function() { 
									var attrs = ['digitalContent','gda','nutrition','allergenAdvice','calcNutrition','marketingText'];
									var missingAttrs=[];

									for (attr in attrs){
										if (obj[attrs[attr]]==undefined) {missingAttrs.push (attrs[attr]);}
									}

							        if(missingAttrs.length>0) return "Missing Attributes : "+_.join(missingAttrs,",");
							        
							        else return "";
								 }

	this.getCountryAttr = function (obj,countryCode,attribute){

									var compareObj ={};
									compareObj["code"]=countryCode;
									countryObj=_.filter(obj,compareObj);
									
									if (countryObj.length>0) {return (countryObj[0][attribute]);} 
								    else { return undefined;}

							    }

	this.brandEval = function (brandVal,label){

									if (brandVal = null)
									{
										return "";
									}
									else if(label === true){
										return "Tesco branded";
									}
									else {
										return "Supplier Branded";
									}


									};

	this.output = function() { 

		                     return (obj.uniqueKey  + '|'
							 + (obj.gtin||na ) + '|'
							 + (obj.tpnb||na ) + '|'
							 + (obj.tpna||na ) + '|'
                             + (obj.tpnc||na ) + '|'
                             + (obj.description||na ) + '|'
                             + (obj.brand||na ) + '|'
                             + (JSON.stringify(obj.commercialHierarchy)||na ) + '|'  
                             + (obj.commercialHierarchy.subclassCode||na ) + '|'                                                 
                             + (obj.commercialHierarchy.subclassName||na ) + '|'+ (obj.commercialHierarchy.className||na ) + '|'
                             + (obj.commercialHierarchy.sectionName||na ) + '|'+ (obj.commercialHierarchy.departmentName||na ) + '|'
                    		 + (this.getCountryAttr(obj.country,"GB",'code')||na) + '|'
                    		 + (this.getCountryAttr(obj.country,"GB",'custFriendlyDesc')||na) + '|'
                    		 + (this.getCountryAttr(obj.country,"GB",'launchDate')||na) + '|'
                    		 + (this.getCountryAttr(obj.country,"GB",'authorised')) + '|'
							 + (this.getCountryAttr(obj.country,"GB",'deactivated')) + '|'
							 + (this.getCountryAttr(obj.country,"GB",'epw')) + '|'
 							 + (obj.rmsStatus||na) + '|'	
							 + (obj.sellByType||na) + '|'
							 + (JSON.stringify(((obj.productCharacteristics)||{}).isFood)||na) + '|'
							 + (JSON.stringify(((obj.productCharacteristics)||{}).isDrink)||na) + '|'
							 + (JSON.stringify(((obj.qtyContents)||{}).netContents)||na) + '|'							 
							 + (this.searchAttr(obj.description,((obj.qtyContents)||{}).netContents).matched) + '|'							 
							 + (this.searchAttr(obj.description,((obj.qtyContents)||{}).netContents).matchedString) + '|'
							 + (this.attrExist()||na ) + '|'
							 + (this.brandEval((obj.brand||" "),obj.isOwnLabel)) + '|'
							 + (JSON.stringify(obj.gda)||na ) + '|' 
							 + (JSON.stringify(obj.digitalContent)||na ) + '|' 
							 + (JSON.stringify(obj.nutrition)||na ) + '|' 	
							 + (JSON.stringify(obj.allergenAdvice)||na ) + '|' 		
							 + (JSON.stringify(obj.calcNutrition)||na ) + '|'
							 + (JSON.stringify(obj.marketingText)||na) 
							 ); // replacing line charecter wirh space);
                           };
}




// callinfg Readsstore API with chunked array list-------------------------------------------------------------------------------------------

function prdQueryUsingAPI(gtinArray) {

	var gtinArrayLength = gtinArray.length;

	if ( gtinArrayLength>0) {

		var concatUrl=url+"gtin="+ (_.join(gtinArray[0],"&gtin="));

    	request({
		            url :  concatUrl,
		            headers : {
		              'Authorization': 'Bearer '+ token
		            }
        		}, function (error, response) {
        
      					if (!error && response.statusCode == 200) {

								 // wrting to missing gtins to file

								fs.appendFile(missingSet,_.join(JSON.parse(response.body).missingSet,"\n") , 
								                               function (err) { if (err) return console.log(err); });

								var products = JSON.parse(response.body).products;


								for (prd in products) {

						        	   fs.appendFile(fileName,(new product(products[prd]).output()+'\n') , 
								                               function (err) { if (err) return console.log(err); });
									}
        
					            if ( gtinArrayLength>1) {
					            	    var innerArrayList =gtinArray.splice(1);
					        			prdQueryUsingAPI (innerArrayList);
					        	}

				        } else { console.log('Error : Error response ------------------- : ' + JSON.stringify(response)); }
    				});

	} else { console.log ("Array Size is Zero"); }
}



// Read gtin's line by line into a Array-------------------------------------------------------------------------------------------

function getLineCount (){

	var rl = readline.createInterface(instream, outstream),
	    outstream = new stream,
	    gtinArray =[];


	rl.on('line', function(line) { gtinArray.push(line); });

	rl.on('close', function() { 
	
		prdQueryUsingAPI ( _.chunk(gtinArray,perRequest)); 
	});
		

};

//  Calling Main Function

getLineCount();



// End