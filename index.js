var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var dataUtil = require('./core/data.util');
var dataCreate = require('./core/data.create');
var dataUpdate = require('./core/data.update');
var Player = require('./server/player');
var Human = require('./server/human');

var character = require('./core/character');

// create static content folder public
app.use(express.static('public'));

// root dir return the index.html game
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

// listen on 3000
http.listen(3000, function() {
  console.log('listening on port 3000');
});

var players = {};
var interval = 1000/60;

gameLoop = function(){
  for(var id in players) {
    // get player
    var p = players[id];

    // encode data
    dataUpdate.playerId = p.id;
    dataUpdate.x = p.character.x;
    dataUpdate.y = p.character.y;
    dataUpdate.gameWorldX = p.character.gameWorldX;
    dataUpdate.gameWorldY = p.character.gameWorldY;
    dataUpdate.currentSequence = p.character.currentSequence;
    var msg = dataUpdate.encode();

    // send data
    io.emit('GameLoop', msg);
  }
};

setInterval(gameLoop, interval);


// accept game connection
io.on('connection', function(socket) {
  console.log(socket.id + ' user connected');
  // need to push 1 to add to the array length/count. though we don't really use that to access the player.


  socket.on('CreatePlayer', function(msg) {
    var x = 75;
    var y = 200;
    var createMsg = dataUtil.decode(msg);
    var newPlayer = new Player(socket.id);

    switch(createMsg.characterType){
        case character.Types.Human:
        newPlayer.character = new Human();
    }
    newPlayer.character.x = x;
    newPlayer.character.y = y;
    newPlayer.character.gameWorldX = x;
    newPlayer.character.gameWorldY = y;
    players[newPlayer.id] = newPlayer;

    createMsg.playerId = newPlayer.id;
    createMsg.x = x;
    createMsg.y = y;
    createMsg.gameWorldX = x;
    createMsg.gameWorldY = y;


    msg = createMsg.encode();
    socket.broadcast.emit('PlayerJoined', msg);

    // will encode this later.
    socket.emit('CreateClientPlayer', msg);

  });

  socket.on('MissingPlayer', function(msg){

    var data = dataUtil.decode(msg);
    var p = players[data.playerId];

    if (p) {
      data.characterType = p.character.type;
      data.x = p.character.x;
      data.y = p.character.y;
      data.gameWorldX = p.character.gameWorldX;
      data.gameWorldY = p.character.gameWorldY;
      msg =  data.encode();
      socket.emit('PlayerJoined', msg);
    }
  });

  socket.on('UpdateServerPlayer', function(msg){
    var data = dataUtil.decode(msg);
    players[socket.id].character.x = data.x;
    players[socket.id].character.y = data.y;
    players[socket.id].character.gameWorldX = data.gameWorldX;
    players[socket.id].character.gameWorldY = data.gameWorldY;
    players[socket.id].character.currentSequence = data.currentSequence;
  });

  socket.on('disconnect', function(msg){
    console.log('player ' + socket.id +' disconneted')
    delete players[socket.id];
    dataUpdate.playerId = socket.id;
    var msg = dataUpdate.encode();
    socket.broadcast.emit('PlayerLeft', msg);
  })
});
