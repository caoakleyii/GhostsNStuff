$(document).ready(function() {
  var dataUtil = require('../core/data.util');
  var dataCreate = require('../core/data.create');
  var dataUpdate = require('../core/data.update');
  var character = require('../core/character');

  var renderer = new PIXI.CanvasRenderer(1024, 768, { autoResize : true, backgroundColor : 0x99FF00  });

  $('#canvasDiv').append(renderer.view);

  var stage = new PIXI.Container();
  var players = {};
  var socket = io();

  var player;
  var joinedPlayer;

  socket.on('PlayerJoined', function(msg) {
    // create OTHER player class
    console.log('player joined');
    var data = dataUtil.decode(msg);
    var p = players[data.playerId];
    if(!p) {
      joinedPlayer = new Player();
      if (data.characterType = character.Types.Ghost) {
        joinedPlayer.character = new Ghost();
      }
      if (data.characterType = character.Types.Zombie) {
        joinedPlayer.character = new Zombie();
      }
      joinedPlayer.character.sprite.x = data.x;
      joinedPlayer.character.sprite.y = data.y;
      players[data.playerId] = joinedPlayer;
      stage.addChild(joinedPlayer.character.sprite);
    }
  });

  socket.on('CreateClientPlayer', function(msg){
    // will decode this later.
    var data = dataUtil.decode(msg);
    player.id = data.playerId;
    player.character.sprite.x = data.x;
    player.character.sprite.y = data.y;
    stage.addChild(player.character.sprite);
  });

  socket.on('GameLoop', function(msg) {
    var data = dataUtil.decode(msg);

    var p = players[data.playerId];
    if (p) {
      p.character.sprite.x = data.x;
      p.character.sprite.y = data.y;
      players[data.playerId] = p;
    } else if (player && player.id && data.playerId != player.id) {
      // ask for player creation

      dataCreate.playerId = data.playerId;
      msg = dataCreate.encode();
      socket.emit('MissingPlayer', msg);
    }

  });

  PIXI.loader
      .add('assets/ghostIdle.json')
      .add('assets/ghostWalkingRight.json')
      .add('assets/ghostWalkingLeft.json')
      .add('assets/ghostWalkingUp.json')
      .add('assets/ghostWalkingDown.json')
      .add('assets/zombieIdling.json')
      .add('assets/zombieWalkingRight.json')
      .add('assets/zombieWalkingLeft.json')
      .load(onAssetsLoaded);

  function onAssetsLoaded(){
    // showe GUI
    userSelectedCharacter();
    animate();
  }

  function animate() {
    player.character.sprite.advanceTime(1/60);
    for(var id in players) {
      var p  = players[id];
      if (p) {
        p.character.sprite.advanceTime(1/60);
      }
    }
    player.inputHandler.readInput();
    sendUpdatePlayer();
    renderer.render(stage);
    requestAnimationFrame(animate);
  }

  function sendUpdatePlayer(){
    // msg [msgType(update), (x), (y)]
    dataUpdate.x = player.character.sprite.x;
    dataUpdate.y = player.character.sprite.y;
    var msg = dataUpdate.encode();
    socket.emit('UpdateServerPlayer', msg);
  }

  function userSelectedCharacter() {
    player = new Player(new Ghost());
    dataCreate.characterType = character.Types.Ghost;
    var msg = dataCreate.encode();

    socket.emit('CreatePlayer', msg);
  }


});
