var care     = require('../api/careapi.js')

var apipath = '/api';
var initAPI = function(app) {
    app.get(apipath + "/", function (req, res) {
        res.json({status: 'ok'});

    });
    app.get(apipath+"/hello",function(req,res){
        care.sayHello(req,res);
    });
    app.post(apipath+"/pullFunds",function(req,res){
        care.pullFunds(req,res);
    });
    app.post(apipath+"/pushFunds",function(req,res){
        care.pushFunds(req,res);
    });
    app.get(apipath+"/getBuyers",function(req,res){
        care.retrievBuyers(req,res);
    });
    app.post(apipath+"/offer",function(req,res){
        care.postOffer(req,res);
    });
    app.post(apipath+"/findOffer",function(req,res){
        care.findOffer(req,res);
    });
    app.post(apipath+"/offerStatus",function(req,res){
        care.offerStatus(req,res);
    });
    app.post(apipath+"/sellerOffer",function(req,res){
        care.getSellerOffer(req,res);
    });

}
module.exports = {
    initAPI: initAPI
}



