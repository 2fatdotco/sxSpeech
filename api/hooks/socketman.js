var async = require('async');
var WebSocketServer = require('websocket').server;
var http = require('http');
var _ = require('lodash');

var httpServer;
var wsServer;
var clients = [];

// Todo: build proper module for Lamps with effects as prototype methods.

var removeClient = function(newClient){
  var oldLength = clients.length;
  clients = _.without(clients,{ip:newClient.ip,mac:newClient.mac});
};

var setupServer = function(callback){

  httpServer = http.createServer(function(req, res) {
    console.log('something!');
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
  console.log('Im blastin:',someString);
  clients.forEach(function(oneClient){
    oneClient.send(someString);
  });

};

var blastThese = function(someString,arrayOfClients){
  console.log('Im blastin:',someString);
  arrayOfClients.forEach(function(oneClient){
    if (!!oneClient){
      oneClient.send(someString);
    }
  });
};


var setFreakLevel = function(someVal){
  blastAll('{"setFreakLevel":'+someVal+'}');
};

var level = function(someVal){
  blastAll('{"level":'+someVal+'}');
};

var freakout = function(someVal){
  blastAll('{"freakout":'+someVal+'}');
};

var setWhite = function(someVal){
  blastAll('{"setWhite":true}');
};

var setRed = function(someVal){
  blastAll('{"setRed":true}');
};

var pulse = function(someVal){
  blastAll('{"pulse":'+someVal+'}');
};

var fadeup = function(someVal){
  blastAll('{"fadeup":'+someVal+'}');
};

var fadedown = function(someVal){
  blastAll('{"fadedown":'+someVal+'}');
};

var toggleColor = function(someVal){
  blastAll('{"toggleColor":true}');
};

var blastRandom = function(){
  var randEffect = Math.round(Math.random()*3+1);
  var randDuration = Math.round(Math.random()*2500+500);

  switch (randEffect){
    case 1:
      blastAll("{\"fadeup\":"+randDuration+"}");
    break;
    case 2:
      blastAll("{\"pulse\":"+randDuration+"}");
    break;
    case 3:
      blastAll("{\"fadedown\":"+randDuration+"}");
    break;
    case 4:
      blastAll("{\"toggleColor\":true}");
    break;
    default:break;
  }
};


var colChase = function(){

};

var rowChase = function(duration,callback){

  async.auto({
    'getLamps': [function(next,results){

      Lamp
      .find()
      .exec(function(err,lamps){
        if (err){
          sails.log('Error fetching lamps');
          return next(err);
        }
        return next(null,_.sortBy(lamps,'position'));
      });

    }],
    'buildMatrix': ['getLamps',function(next,results){

      var matrix = [];
      var missingClients = [];

      var lampsPerRow = sails.hooks.socketman.matrixConfig.cols;
      var sortedLamps = results.getLamps;

      var currentRow = [];

      while(sortedLamps.length){
        var grabLamp = sortedLamps.pop();
        var findClient = _.find(clients,{mac:grabLamp.mac}) || null;

        if (!findClient){
          missingClients.push(grabLamp.position);
        }

        if (currentRow.length < lampsPerRow){
          currentRow.push(findClient);
        }

        else if (currentRow.length === lampsPerRow){
          currentRow.push(findClient);
          matrix.push(currentRow);
          currentRow = [];
        }

        if (!sortedLamps.length){
          matrix.push(currentRow);
          delete currentRow;
        }

      } 

      return next(null,{matrix:matrix,missingClients:missingClients});
    }],
    'triggerEffect': ['buildMatrix',function(next,results){
      var matrix = results.buildMatrix.matrix;

      console.log('There are currently:',results.buildMatrix.missingClients.length,'missing lamps');
      console.log('and',matrix.length,'rows of',(matrix[0]&&matrix[0].length));

      var msPerRow = Math.round(duration / matrix.length);

      var changeInterval;

      var grabRow;
      var theRest = [];
      var hotRow = 0;

      var doChange = function(){
        if (!matrix.length){
          clearInterval(changeInterval);
        }
        else {

          matrix.forEach(function(oneRow,index){
            if (index === hotRow){
              grabRow = oneRow;
            }
            else {
              theRest = theRest.concat(oneRow);
            }
            hotRow++;
          });

          blastThese('{"level":140}',grabRow);
          blastThese('{"level":10}',theRest);
        }

      }

      changeInterval = setInterval(doChange,msPerRow);

      return next();
    }],
  }, function(err,results){
    if (err){
      sails.log('Error with lighting effect');
      return;
    }

    return callback();

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


var setMatrix = function(){

};

var positionAt = function(){

};

var handleConnection = function(req) {
    var reqIp = req.httpRequest&&req.httpRequest.connection&&req.httpRequest.connection.remoteAddress.replace(/([ a-zA-Z:]+)(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/,'$2');
    var reqMac = req.httpRequest&&req.httpRequest.headers&&req.httpRequest.headers['sec-websocket-protocol'];

    var connection = _.extend(req.accept(null, req.origin),{ip:reqIp,req:req,mac:reqMac});
    console.log('http connection made by',reqIp);

    Lamp
    .find()
    .exec(function(err,lamps){
      if (err){
        sails.log('Error finding lamps:',lamps);
      }

      var grabLamp = _.find(lamps,{mac:reqMac});

      var sortedLamps = _.sortBy(lamps,'position');

      var posOfLast = sortedLamps[sortedLamps.length-1] && sortedLamps[sortedLamps.length-1]['position'];
console.log('position of last:',posOfLast);
      if (!grabLamp){
        Lamp
        .create({
          ip: reqIp,
          mac: reqMac,
          position: posOfLast ? posOfLast + 1 : 1
        })
        .exec(function(err,lamp){
          if (err){
            sails.log('Error creating lamp record');
            return;
          }

          sails.log('Created new lamp record for lamp number',(lamps[0] && lamps[0]['position']));
          return;
        });
      }

    });

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

          if (jsonData.firstConnect && jsonData.firstConnect === true){
            // setTimeout(function(){
            //   blastAll("{\"freakout\":2000}");
            // },1000);
          }

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
    testAll: testAll,
    blastRandom: blastRandom,
    setFreakLevel: setFreakLevel,
    level: level,
    freakout: freakout,
    setWhite: setWhite,
    setRed: setRed,
    pulse: pulse,
    fadedown: fadeup,
    fadeup: fadedown,
    toggleColor: toggleColor,
    setMatrix: setMatrix,
    positionAt: positionAt,
    matrixConfig: {
      cols: 8,
      rows: 10
    },
    matrix: [],
    rowChase: rowChase,
    tweets: true
  };
};