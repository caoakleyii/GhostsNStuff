var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var dataUtil = require('./core/data.util');
var dataCreate = require('./core/data.create');
var dataUpdate = require('./core/data.update');
var Player = require('./server/player');
var Ghost = require('./server/ghost');

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
  players[socket.id] = new Player(socket.id, new Ghost());

  socket.on('CreatePlayer', function(msg) {
    // msg [Message Type(create), (playerId), Character Type, X, Y]
    var x = 50;
    var y = 50;
    // validate messsage
    var createMsg = dataUtil.decode(msg);
    createMsg.playerId = socket.id;
    createMsg.x = x;
    createMsg.y = y;
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
      msg =  data.encode();
      socket.emit('PlayerJoined', msg);
    }
  });

  socket.on('UpdateServerPlayer', function(msg){
    var data = dataUtil.decode(msg);
    players[socket.id].character.x = data.x;
    players[socket.id].character.y = data.y;
  });
});
