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

var handleConnection = function(req) {
    var reqIp = req.httpRequest&&req.httpRequest.connection&&req.httpRequest.connection.remoteAddress.replace(/([ a-zA-Z:]+)(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/,'$2');
    var reqMac = req.httpRequest&&req.httpRequest.headers&&req.httpRequest.headers['sec-websocket-protocol'];

    var connection = _.extend(req.accept(null, req.origin),{ip:reqIp,req:req,mac:reqMac});
    console.log('Connection made by',reqIp,req.requestedProtocols);


    connection.on('message', function(message) {

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
      removeClient(connection);
      console.log('Client disconnected!');
    });


    console.log('Looking for client with mac:',connection.mac);
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
    blastAll: blastAll
  };
};