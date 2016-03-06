var async = require('async');
var WebSocketServer = require('websocket').server;
var http = require('http');
var _ = require('lodash');

var httpServer;
var wsServer;
var clients = [];

var removeClient = function(newClient){
  var oldLength = clients.length;
  clients = _.without(clients,{ip:newClient.ip,mac:newClient.mac});
};

var setupServer = function(callback){

  httpServer = http.createServer(function(req, res) {
      res.writeHead(404);
      res.end();
  });

  httpServer.listen(1440, function() {
    sails.log('Raw websocket server opened on port 1440');
  });

  wsServer = new WebSocketServer({
    httpServer: httpServer,
    autoAcceptConnections: false
  });

  wsServer.on('request', handleConnection);

  return callback(true);
};

var blastAll = function(someString){

  clients.forEach(function(oneClient){
    oneClient.send(someString);
  });

};

var testAll = function(options){

  var timeInMs = options.minutes * 60 * 60;

  var startTime = new Date().getTime();
  var battery;

  battery = function(callback){
    var timeElapsed = new Date().getTime() - startTime;

    console.log('Time Elapsed:',timeElapsed);
    if (timeElapsed >= timeInMs){
      return;
    }
    else {
      async.auto({
        'sendSomeLevels': [function(next){
          var numbers = Array.apply(null, {length: 144}).map(Number.call, Number);

          async.eachSeries(numbers,function(someNumber,go){
            blastAll("{\"level\":"+someNumber+"}");
            setTimeout(go,250);
          },next);
        }],
        'freakOutSome': ['sendSomeLevels',function(next){
            blastAll("{\"freakout\":5000}");
            return next()
        }],
        'pulseForMe': ['freakOutSome',function(next){  
          var numbers = Array.apply(null, {length: 5}).map(Number.call, Number);

          async.eachSeries(numbers,function(someNumber,go){
            var randNum = Math.floor(Math.random()*3000+500);
            blastAll("{\"pulse\":"+randNum+"}");
            setTimeout(go,3000);
          },next);

        }],
        'nowFadeUp': ['pulseForMe',function(next){
          var numbers = Array.apply(null, {length: 5}).map(Number.call, Number);

          async.eachSeries(numbers,function(someNumber,go){
            var randNum = Math.floor(Math.random()*2000+500);

            blastAll("{\"fadeup\":"+randNum+"}");
            setTimeout(go,3000);
          },next);

        }],
        'downNowBaby': ['nowFadeUp',function(next){
          var numbers = Array.apply(null, {length: 5}).map(Number.call, Number);
          async.eachSeries(numbers,function(someNumber,go){
            var randNum = Math.floor(Math.random()*2000+500);
            blastAll("{\"fadedown\":"+randNum+"}");
            setTimeout(go,3000);
          },next);

        }],
        'nowBringItHome': ['downNowBaby',function(next){
          blastAll("{\"info\":true}");
          next();
        }]
      },function(){
        battery.call();
      });
    }
  };

  battery.call();

};

var saveInEventLog = function(record){

  if (record.description&&(typeof record.description == "object")){
    try {
      record.description = JSON.stringify(record.description);
    } catch (nope){
      console.log('something went wrong parsing a thing:',nope);
    }
  }

  sails
  .models['log']
  .create(record)
  .exec(function(err,savedRecord){
    if (err){
      console.log('Error writing to event log:',err);
    }
    console.log('Lamp event logged',record);
    return;
  });

};

var handleConnection = function(req) {
    var reqIp = req.httpRequest&&req.httpRequest.connection&&req.httpRequest.connection.remoteAddress.replace(/([ a-zA-Z:]+)(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/,'$2');
    var reqMac = req.httpRequest&&req.httpRequest.headers&&req.httpRequest.headers['sec-websocket-protocol'];

    var connection = _.extend(req.accept(null, req.origin),{ip:reqIp,req:req,mac:reqMac});
    console.log('http connection made by',reqIp);


    // connection.on('connection', function())

    connection.on('message', function(message) {

      var record = {
        ip: this.ip,
        mac: this.mac,
        eventName: 'message',
        description: message
      };

      saveInEventLog(record);

      if (message.type === 'utf8') {
        console.log('Received Message from ',connection.ip,'saying',message.utf8Data);

        var jsonData;

        try {
          jsonData = JSON.parse(message.utf8Data);
        }
        catch (parseErr) {
          console.log('Could not parse message',parseErr);
        }

        if (!!jsonData){

          if (jsonData.role){
            console.log(connection.ip,'has sent their mac address:',jsonData.role.mac)
          }

        }

      }
    });

    connection.on('close', function(reasonCode, description) {
      var record = {
        ip: this.ip,
        mac: this.mac,
        eventName: 'close',
        description: 'Reason:'+reasonCode+' - '+description
      };

      saveInEventLog(record);

      removeClient(connection);
      console.log('Client disconnected!');
    });

    if (!!_.find(clients,{mac:connection.mac})){
      removeClient(connection);
    }

    clients.push(connection);

};


var callRole = function(){

};

module.exports = function socketman(sails) {
  return {

    initialize: function (done) {
      sails.after('hook:orm:loaded', function() {
        setupServer(function(){
          sails.log('Websocket manager loaded');
        });
      });
      return done();
    },
    callRole: callRole,
    httpServer: httpServer,
    wsServer: wsServer,
    clients: clients,
    blastAll: blastAll,
    testAll: testAll
  };
};