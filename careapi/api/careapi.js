var request = require('request');
var req = request.defaults();
var fs = require('fs');
const uuidv1 = require('uuid/v1');
const  URL  = require('url').Url;
var userId='OTAA1WBWRM2NT930BEHI21zqQY0n8tnfa7PCF5_zj93a3PU08';
var password='NKcBhqT9D2w891Jp9lCLl7DjvE3SoxzeY';

const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://dhara:Test1234@caredatabase.cyesjekfmb7m.us-east-1.rds.amazonaws.com:5432/caredatabase';




/*
 * Response helper function for nicer code :)
 */
function respond(res, resobj) {
    console.log('Sending response');
    resobj.set('Content-Type', 'application/json');
    resobj.end(JSON.stringify(res))
}


function errorresponse(error, res) {
    console.log('Sending error response');
    var response = {
        success: false,
        errors: [
            error
        ]
    };
    res.set('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
}

var updateOfferStatus=function (req) {
    return new Promise(function (resolve,reject) {
       var offer_id=req.body.offer_id
       var status=req.body.status
        const queryObj = {
            text: 'UPDATE offers SET status=$1 where offer_id=$2 ',
            values: [status,offer_id]
        }
        const client=new pg.Client(connectionString);
        client.connect(function(err) {
            if(err) {
                reject(err)
            }
            client.query(queryObj, function(err, result) {
                if(err) {
                    reject(err)
                }
                console.log(result);
                resolve(result);
                //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
                client.end();
            });
        });

    });
}

var getSpecficSellerOffer=function (req) {
    return new Promise(function (resolve,reject) {
        var seller_emailid=req.body.email;
        var status=req.body.status;
        const queryObj = {
            text: 'select offers.buyer_name,offers.buyer_emailid,offers.offer_description from offers where offers.seller_emailid=$1 and offers.status=$2',
            values: [seller_emailid,status]
        }
        const client=new pg.Client(connectionString);
        client.connect(function(err) {
            if(err) {
                reject(err)
            }
            client.query(queryObj, function(err, result) {
                if(err) {
                    reject(err)
                }
                console.log(result);
                resolve(result);
                //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
                client.end();
            });
        });
    })
}

var getSpecficOffer=function (req) {
    return new Promise(function(resolve,reject){
        var buyer_email=req.body.email;
        var status=req.body.status;
        const queryObj = {
            text: 'select offers.first_name,offers.seller_emailid,offers.offer_id,offers.offer_description from offers where offers.buyer_emailid=$1 and offers.status=$2',
            values: [buyer_email,status]
        }
        const client=new pg.Client(connectionString);
        client.connect(function(err) {
            if(err) {
                reject(err)
            }
            client.query(queryObj, function(err, result) {
                if(err) {
                    reject(err)
                }
                console.log(result);
                resolve(result);
                //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
                client.end();
            });
        });
    });
};

var makeOffer=function (req) {
    return new Promise(function (resolve,reject) {
        var buyer_email=req.body.to;
        var seller_email=req.body.from;
        var offer_desc=req.body.offer;
        var uuid=uuidv1();
        const client=new pg.Client(connectionString);
        const queryObj = {
            text: 'INSERT INTO offers(offer_id, seller_emailid, buyer_emailid, offer_description, status) VALUES($1, $2, $3, $4, $5)',
            values: [uuid,seller_email,buyer_email,offer_desc,'PENDING' ]
        }
        client.connect(function(err) {
            if(err) {
                reject(err)
            }
            client.query(queryObj, function(err, result) {
                if(err) {
                    reject(err)
                }
                console.log(result);
                resolve(result);
                //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
                client.end();
            });
        });

        });
};

var getBuyers=function () {
    return new Promise(function (resolve,reject) {
        //const results = [];
        const client = new pg.Client(connectionString);
        client.connect(function(err) {
            if(err) {
               reject(err)
            }
            client.query('select profile.first_name,profile.email,profile.rating,materials.glass,materials.cardboard from profile,materials where profile.email=materials.email', function(err, result) {
                if(err) {
                    reject(err)
                }
                console.log(result);
                resolve(result);
                //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
                client.end();
            });
        });
    });
};

var fundTransferPush=function () {
    return new Promise(function (resolve,reject) {

        var data={
            "acquirerCountryCode": "840",
            "acquiringBin": "408999",
            "amount": "124.05",
            "businessApplicationId": "AA",
            "cardAcceptor": {
                "address": {
                    "country": "USA",
                    "county": "San Mateo",
                    "state": "CA",
                    "zipCode": "94404"
                },
                "idCode": "CA-IDCode-77765",
                "name": "Visa Inc. USA-Foster City",
                "terminalId": "TID-9999"
            },
            "localTransactionDateTime": "2018-10-21T09:47:52",
            "merchantCategoryCode": "6012",
            "pointOfServiceData": {
                "motoECIIndicator": "0",
                "panEntryMode": "90",
                "posConditionCode": "00"
            },
            "recipientName": "rohan",
            "recipientPrimaryAccountNumber": "4957030420210496",
            "retrievalReferenceNumber": "412770451018",
            "senderAccountNumber": "4653459515756154",
            "senderAddress": "901 Metro Center Blvd",
            "senderCity": "Foster City",
            "senderCountryCode": "124",
            "senderName": "Mohammed Qasim",
            "senderReference": "",
            "senderStateCode": "CA",
            "sourceOfFundsCode": "05",
            "systemsTraceAuditNumber": "451018",
            "transactionCurrencyCode": "USD",
            "transactionIdentifier": "381228649430015"
        };

        var url="https://sandbox.api.visa.com/visadirect/fundstransfer/v1/pushfundstransactions";
        req.post({
            uri:url,
            key: fs.readFileSync(__dirname+'/key.pem'),
            cert: fs.readFileSync(__dirname+'/cert.pem'),
            rejectUnauthorized: false,

            agentOptions: {
                ca: fs.readFileSync(__dirname+"/vdca.pem")
            },
            headers: {
                'Content-Type' : 'application/json',
                'Accept' : 'application/json',
                'Authorization' : 'Basic ' + new Buffer(userId + ':' + password).toString('base64')
            },
            body:data,
            json:true
        },function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body) // Print the shortened url.
                resolve(response);
            }
            else{
                console.log(error);
                reject('Error Occurred');
            }
        });
    });
}

var fundTransferPull=function () {

    return new Promise(function (resolve,reject) {

        var data={
            "acquirerCountryCode": "840",
            "acquiringBin": "408999",
            "amount": "124.02",
            "businessApplicationId": "AA",
            "cardAcceptor": {
                "address": {
                    "country": "USA",
                    "county": "081",
                    "state": "CA",
                    "zipCode": "94404"
                },
                "idCode": "ABCD1234ABCD123",
                "name": "Visa Inc. USA-Foster City",
                "terminalId": "ABCD1234"
            },
            "cavv": "0700100038238906000013405823891061668252",
            "foreignExchangeFeeTransaction": "11.99",
            "localTransactionDateTime": "2018-10-20T22:14:15",
            "retrievalReferenceNumber": "330000550000",
            "senderCardExpiryDate": "2015-10",
            "senderCurrencyCode": "USD",
            "senderPrimaryAccountNumber": "4895142232120006",
            "surcharge": "11.99",
            "systemsTraceAuditNumber": "451001",
            "nationalReimbursementFee": "11.22",
            "cpsAuthorizationCharacteristicsIndicator": "Y",
            "addressVerificationData": {
                "street": "XYZ St",
                "postalCode": "12345"
            }
        };

        var url="https://sandbox.api.visa.com/visadirect/fundstransfer/v1/pullfundstransactions";
        req.post({
            uri:url,
            key: fs.readFileSync(__dirname+'/key.pem'),
            cert: fs.readFileSync(__dirname+'/cert.pem'),
            rejectUnauthorized: false,

            agentOptions: {
                ca: fs.readFileSync(__dirname+"/vdca.pem")
            },
            headers: {
                'Content-Type' : 'application/json',
                'Accept' : 'application/json',
                'Authorization' : 'Basic ' + new Buffer(userId + ':' + password).toString('base64')
            },
            body:data,
            json:true
        },function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body) // Print the shortened url.
                resolve(response);
            }
            else{
                console.log(error);
                reject('Error Occurred');
            }
        });
    });
}

var helloVisa=function(){
    return new Promise(function(resolve,reject){
        console.log(__dirname);
        console.log(fs.readFileSync(__dirname+'/key.pem'));
        var url='https://sandbox.api.visa.com/vdp/helloworld';
        req.get({
            uri:url,
            key: fs.readFileSync(__dirname+'/key.pem'),
            cert: fs.readFileSync(__dirname+'/cert.pem'),
            rejectUnauthorized: false,

            agentOptions: {
                ca: fs.readFileSync(__dirname+"/vdca.pem")
            },
            headers: {
                'Content-Type' : 'application/json',
                'Accept' : 'application/json',
                'Authorization' : 'Basic ' + new Buffer(userId + ':' + password).toString('base64')
            }
        },function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body) // Print the shortened url.
                resolve(response);
            }
            else{
                console.log(error);
                reject('Error Occurred');
            }
        });
    });
};



var sayHello=function(req,res) {
    console.log("In testing VISA API");
    helloVisa().then(function (result) {
        var response={result}
        respond(response,res);
    }).catch(function(error){
        errorresponse(error,res);
    });
};


var pullFunds=function(req,res){
    console.log("In Pull VISA API");
    fundTransferPull().then(function (result) {
        var response={result}
        respond(response.result.body,res);
    }).catch(function(error){
        errorresponse(error,res);
    });
};

var pushFunds=function(req,res){
    console.log("In Pull VISA API");
    fundTransferPush().then(function (result) {
        var response={result}
        respond(response.result.body,res);
    }).catch(function(error){
        errorresponse(error,res);
    });
};
var retrievBuyers=function(req,res){
    console.log("In Pull Buyer API");
    getBuyers().then(function (result) {
        var response={result}
        respond(response.result.rows,res);
    }).catch(function(error){
        console.log(error);
        errorresponse(error,res);
    });
}

var postOffer=function(req,res){
    console.log("In Pull Buyer API");
    makeOffer(req).then(function (result) {
        var response={result}
        respond(response,res);
    }).catch(function(error){
        console.log(error);
        errorresponse(error,res);
    });
}
var findOffer=function(req,res){
    console.log("In Pull Buyer API");
    getSpecficOffer(req).then(function (result) {
        var response={result}
        respond(response.result.rows,res);
    }).catch(function(error){
        console.log(error);
        errorresponse(error,res);
    });
}
var offerStatus=function(req,res){
    console.log("In Pull Buyer API");
    updateOfferStatus(req).then(function (result) {
        var response={result}
        respond(response.result.rowCount,res);
    }).catch(function(error){
        console.log(error);
        errorresponse(error,res);
    });
}

var getSellerOffer=function(req,res){
    getSpecficSellerOffer(req).then(function (result) {
        var response={result}
        respond(response.result.rows,res);
    }).catch(function(error){
        console.log(error);
        errorresponse(error,res);
    });
}
module.exports={
    sayHello:sayHello,
    pullFunds:pullFunds,
    retrievBuyers:retrievBuyers,
    postOffer:postOffer,
    findOffer:findOffer,
    offerStatus:offerStatus,
    getSellerOffer:getSellerOffer,
    pushFunds:pushFunds
}