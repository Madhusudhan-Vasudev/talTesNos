var fileName = 'products_household_20170616092642.xlsx';
var status = 'Success from MDM';
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/db';
var parameters = {filename: fileName,
                  processing_status: status};
var fs = require('fs');
var datLocPath = '/Users/Madhusudhan/temp/';
let async = require('async');

var datName = fileName.slice(0,-5);


function product(obj){


this.bwsInd = function(filname){
              var bwsIndicator;
              if (filname.includes('bws')){
                return bwsIndicator = "1";
              }
              else
              return  bwsIndicator = "0";

              }

this.declare = function(){
                return("DECLARE " + "MUT3NBS_IT_HEAD_SEQ_NEX_VAL number:=0; " + "BEGIN " + "dbms_output.enable(100000); " +
                        "SELECT MSLOAD.MUT3NBS_IT_HEAD_SEQ.nextval INTO MUT3NBS_IT_HEAD_SEQ_NEX_VAL FROM DUAL; " +
                        "dbms_output.put_line(MUT3NBS_IT_HEAD_SEQ_NEX_VAL); " +
                        "Insert into MSLOAD.MUT3NBS_ITEM_HEAD(ID, CSV_NAME, USERNAME, UPLOAD_DATE, LOADED_CNT, VALID_CNT, INTEGRATED_CNT, " +
                        "ERROR_CNT, CANCEL_CNT, LOCKED, OPERATION_TYPE, FILE_ORIGINAL_NAME,BWS_IND)Values  (MUT3NBS_IT_HEAD_SEQ_NEX_VAL," +
                        "'" + fileName + "'" + ",'admin',sysdate,0,0,0,0,0,0,'CREATE'," + "'" + fileName + "'" + "," + "'" + this.bwsInd(fileName) +
                        "'" + ");" + "\n");

                }

this.uom =    function(qtyUom){
              return (qtyUom != null? (qtyUom.toUpperCase() === "SHEET"?"SHT"
              :(qtyUom.toUpperCase()=== "Single"?"SNGL":qtyUom)) : null );

              }

this.replacer = function(str){
                if (!str){
                  return ("");
                }
                return (str = str.replace("'", "''"));


              }

this.output = function(){

              return ( "Insert into MSLOAD.MUT3NBS_ITEM(ID, HEAD_ID, PART_NUMBER, NEW_PRODUCT_VARIANT, EXISTING_TPNB,VARIANT_REASON_CODE, " +
"COUNTER_PRODUCT, SECTION, CLASS, SUB_CLASS,SHORT_DESCRIPTION, DESCRIPTION_SUFFIX, ORDER_TYPE, SALE_TYPE, SUPPLIER_NUMBER, " +
"TOTAL_BASIC_COST_UNIT, TOTAL_BASIC_COST_PER_KILO, VAT_BAND_UK, ODS_VAT_BAND, COMPOSITE_PERC_UK,RECOMMENDED_RETAIL_PRICE, " +
"CONTAINS_NO_EDIBLE_LIQUID, BASE_DESC_EFF_DATE, SUPPLIER_BRAND_OR_TESCO_BRAND, TESCO_BRAND,SUPPLIER_BRAND, PACKAGE_TYPE, CASE_TYPE, " +
"SELL_BY_TYPE, ODS_COUNTRY_OF_ORIGIN_NAME,SHELF_LIFE_DAYS, MIN_LIFE_DEPOT_DAYS, MAX_CUSTOMER_STORAGE, SEL_DESC1, SEL_DESC2,SEL_DESC3, " +
"UNIT_QTY, WEIGHT_EXCLUDING_EDIBLE_LIQUID, CONTENTS_QTY, CONTENTS_QTY_UOM,TILL_ROLL_DESC, FONT1, ISS_DESC1, ISS_DESC2, ISS_DESC3,ISS_DESC4, " +
"PRICE_MARKED_INDICATOR, PRICE_MARKED_EXCEPT_IND, EAN_AUTHORISED_IND, EAN_PLU_PEIB, PACK_QTY, BUYING_QUANTITY, TOTAL_BASIC_COST_CASE, " +
"MIN_TOLERANCE, MAX_TOLERANCE,UNITS_PER_PALLET_LAYER_TI, UNITS_PER_PALLET_HIGH_HI, CASE_DEPTH, CASE_WIDTH, CASE_HEIGHT,GROSS_WEIGHT, " +
"SUPP_PRODUCT_NET_WEIGHT, OCC_TYPE, OUTER_CASE_CODE, PACK_DESC, EXCISE_PRODUCT_TYPE, EXCISE_PRODUCT_TYPE_CODE, FISCAL_CODE, ALCOHOL_BY_VOLUME, " +
"TARIFF_CODE, DELIVERY_MODE_ELC_EXPENSES, FREIGHT,EPISEL_1, EPISEL_2, EPISEL_3, EPISEL_4, EPISEL_5, SINGLE_MULTIPACK_LINK, SINGLE_MULTIPACK_LINK_TPNB, " +
"DISTRIBUTION_TYPE, DISTRIBUTION_MODE, CREATE_DATE, STATUS,CONTACT_NUMBER,SELLABLE_ORDERABLE,SUPPLIER_CONTACT_EMAIL,SUPPLIER_CONTACT_NAME)" +
"Values(MSLOAD.MUT3NBS_IT_SEQ.nextval,MUT3NBS_IT_HEAD_SEQ_NEX_VAL,'" + this.replacer(JSON.stringify(obj.part_number)) + "','" + obj.new_product_variant + "','" +
obj.existing_tpnb + "','" + obj.variant_reason_code + "','" + this.replacer(obj.counter_product) + "','" + obj.section + "','" +  obj.class + "','" +
obj.sub_class + "','" + this.replacer(obj.short_description) + "','" + this.replacer(obj.description_suffix) + "','" + obj.order_type + "','" + obj.sale_type +
"','" + obj.supplier_number + "','" + obj.total_basic_cost_unit + "','" + obj.total_basic_cost_per_kilo + "','" +  obj.vat_band_uk + "','" +
obj.ods_vat_band + "','" +  obj.composite_perc_uk + "','" + obj.recommended_retail_price + "','" + obj.contains_no_edible_liquid + "','" +
obj.base_desc_eff_date + "','" + this.replacer(obj.supplier_brand_or_tesco_brand) + "','" + this.replacer(obj.tesco_brand) + "','" + this.replacer(obj.supplier_brand) +
"','" + this.replacer(obj.package_type) + "','" +  this.replacer(obj.case_type) + "','" +  obj.sell_by_type + "','" + this.replacer(obj.ods_country_of_origin_name) +
"','" +  obj.shelf_life_days + "','" + obj.min_life_depot_days + "','" + obj.max_customer_storage + "','" + this.replacer(obj.sel_desc1) + "','" +
this.replacer(obj.sel_desc2) + "','" +  this.replacer(obj.sel_desc3) + "','" + obj.unit_qty + "','" + obj.weight_excluding_edible_liquid + "','" + obj.contents_qty +
"','" + this.uom(obj.contents_qty_uom) + "','" + this.replacer(obj.till_roll_desc) + "','" + obj.font1 + "','" + this.replacer(obj.iss_desc1) + "','" +
this.replacer(obj.iss_desc2) + "','" + this.replacer(obj.iss_desc3) + "','" + this.replacer(obj.iss_desc4) + "','" + obj.price_marked_indicator + "','" +
obj.price_marked_except_ind + "','" + obj.ean_authorised_Ind + "','" + obj.ean_plu_peib + "','" + obj.pack_qty + "','" + obj.buying_quantity + "','" +
obj.total_basic_cost_case + "','" + obj.min_tolerance + "','" + obj.max_tolerance + "','" +
((obj.units_per_pallet_layer_ti!=null)?((obj.units_per_pallet_layer_ti<999)?obj.units_per_pallet_layer_ti:999):1) + "','" +
((obj.units_per_pallet_high_hi!=null)?((obj.units_per_pallet_high_hi<998)?obj.units_per_pallet_high_hi:998):1)+ "','" +
obj.case_depth + "','" + obj.case_width + "','" + obj.case_height + "','" + obj.gross_weight + "','" + obj.supp_product_net_weight + "','" + obj.occ_type +
"','" + obj.outer_case_code + "','" + this.replacer(obj.pack_desc) + "','" + this.replacer(obj.excise_product_type) + "','" + (obj.excise_product_code || "") +
"','" + (obj.fiscal_code || "")  + "','" + (obj.alcohol_by_volume || "")  + "','" + (obj.tariff_code || "") + "','" + this.replacer(obj.delivery_mode ) + "','" +
(obj.freight || "") + "','" + this.replacer(obj.episel1 ) + "','" + this.replacer(obj.episel2 ) + "','" + this.replacer(obj.episel3 ) + "','" +
this.replacer(obj.episel4 ) + "','" + this.replacer(obj.episel5) + "','" + (obj.single_multipack_link || "") + "','" +
(obj.single_multipack_link_TPNB || "") + "','" + this.replacer(obj.distribution_type) + "','" + this.replacer(obj.distribution_mode) +
"', sysdate" + ",'L','" + obj.Contact_Number  + "','" + obj.sellable_orderable + "','" + this.replacer(obj.supplier_contact_email) + "','" +
this.replacer(obj.supplier_contact_name) + "');" + "\n");

                        };

          }


  var findDocumentsWithFilename = function(db, parameters, callback) {
      // Get the documents collection
      db.collection('products').find({filename: parameters.filename}).toArray(function(err, docs) {
            if (err) {
              console.log('Unable to find the records in DB for specified criteria');
              callback(err, null);
            } else {
              console.log('Found the following records');
//              let returnObj = {};
//              var returnArr = [];
//              docs[0].products.forEach(function(doc) {
            fs.appendFile(datLocPath + datName + '.dat', new product().declare(), function(err){
                  if (err) {
                    console.log(err);
                  }
                  console.log("declare inserted");
                });

                async.eachLimit(docs[0].products, 10, function(doc, next){
                if (doc['processing_status'] === parameters.processing_status && doc['part_number'].length > 0) {

/*                  returnObj = {
                    transaction_id: doc.transaction_id,
                    tpna: doc.tpna,
                    tpnb: doc.tpnb,
                    tpnc: doc.tpnc,
                    gtin: doc.gtin,
                    processing_status: doc.processing_status,
                  };*/
//                  returnArr.push(returnObj);

                  fs.appendFile(datLocPath + datName + '.dat', new product(doc).output(), function(err){
                        if (err) {
                        console.log('Error:- ' + err);
                        next();
                                    }
                        console.log("data appended!!");
                        next();
                                    });

    //          console.log(returnObj);

                }
              }, function(){
                fs.appendFile(datLocPath + datName + '.dat.DONE', (""), function(err){
                    if (err) {
                    console.log('Error:- ' + err);
                    throw err;
                                }
                    console.log("DONE Created!!");
                    callback(null, docs);
                    });
                    fs.appendFile(datLocPath + datName + '.dat', ("END;"), function(err){
                        if (err) {
                        console.log('Error:- ' + err);
                        throw err;
                                    }
                        console.log("DONE Created!!");
                        callback(null, docs);
                      });

              });

        }
});
};


        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log("Unable to connect to MongoDB");
        //        callback(err,null);
            } else {
                console.log("Connected successfully to server");
        //        callback(null,db);

                  findDocumentsWithFilename(db, parameters, function(err){
                    if(err){
                    console.log(err);
                    }
                    console.log("db read and displaying");
                    db.close();

                    });
                  }
            });

//var findDocumentsWithFilename = require('../../common/utils/db-utils.js').findDocumentsWithFilename2();



/* dbConnection(function(){
if(err){
  console.log(err);
} */
