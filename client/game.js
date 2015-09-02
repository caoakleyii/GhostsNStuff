$(document).ready(function() {
  var dataUtil = require('../core/data.util');
  var dataCreate = require('../core/data.create');
  var dataUpdate = require('../core/data.update');
  var character = require('../core/character');
  var map = require('../core/gameWorld');

  var renderer = new PIXI.CanvasRenderer(1024, 768, { autoResize : true, backgroundColor : 0x99FF00  });

  $('#canvasDiv').append(renderer.view);

  var stage = new PIXI.Container();
  var players = {};
  var socket = io();

  var player;
  var joinedPlayer;
  var foregroundGameWorld;
  var backgroundGameWorld;


  socket.on('PlayerJoined', function(msg) {
    // create OTHER player class
    console.log('player joined');
    var data = dataUtil.decode(msg);
    var p = players[data.playerId];
    if(!p) {
      joinedPlayer = new Player();
      if (data.characterType == character.Types.Human) {
        joinedPlayer.character = new Human();
      }
      if (data.characterType == character.Types.Ghost) {
        joinedPlayer.character = new Ghost();
      }
      joinedPlayer.character.sprite.x = data.gameWorldX;
      joinedPlayer.character.sprite.y = data.gameWorldY;
      players[data.playerId] = joinedPlayer;
      stage.addChild(joinedPlayer.character.sprite);
      stage.addChild(joinedPlayer.character.healthBar);
    }
  });

  socket.on('CreateClientPlayer', function(msg){
    // will decode this later.
    var data = dataUtil.decode(msg);
    player.id = data.playerId;
    player.character.sprite.x = data.gameWorldX;
    player.character.sprite.y = data.gameWorldY;
    stage.addChild(player.character.sprite);
    stage.addChild(player.character.healthBar);
  });

  socket.on('GameLoop', function(msg) {
    var data = dataUtil.decode(msg);

    var p = players[data.playerId];
    if (p) {
      p.character.sprite.x = player.character.backgroundGameWorld.x + data.gameWorldX;
      p.character.sprite.y = player.character.backgroundGameWorld.y + data.gameWorldY;
      if (p.character.sprite.currentSequence  != data.currentSequence) {
        p.character.sprite.gotoAndPlay(data.currentSequence);
      }
      players[data.playerId] = p;
    } else if (player && player.id && data.playerId != player.id) {
      // ask for player creation
      dataCreate.playerId = data.playerId;
      msg = dataCreate.encode();
      socket.emit('MissingPlayer', msg);
    }

  });

  PIXI.loader
      .add('assets/playerIdlingUp.json')
      .add('assets/playerIdlingDown.json')
      .add('assets/playerIdlingLeft.json')
      .add('assets/playerIdlingRight.json')
      .add('assets/playerWalkingUp.json')
      .add('assets/playerWalkingDown.json')
      .add('assets/playerWalkingLeft.json')
      .add('assets/playerWalkingRight.json')
      .add('assets/playerSwingingUp.json')
      .add('assets/playerSwingingDown.json')
      .add('assets/playerSwingingLeft.json')
      .add('assets/playerSwingingRight.json')
      .add('assets/ghostIdle.json')
      .add('assets/ghostWalkingRight.json')
      .add('assets/ghostWalkingLeft.json')
      .add('assets/ghostWalkingUp.json')
      .add('assets/ghostWalkingDown.json')
      .load(onAssetsLoaded);



  function onAssetsLoaded(){
    var backgroundGameWorldTexture = new PIXI.Texture.fromImage('images/backgroundGameWorld.png');
    backgroundGameWorld = new PIXI.Sprite(backgroundGameWorldTexture);
    stage.addChild(backgroundGameWorld);

    var foregroundGameWorldTexture = new PIXI.Texture.fromImage('images/foregroundGameWorld.png');
    foregroundGameWorld = new PIXI.Sprite(foregroundGameWorldTexture);
    stage.addChild(foregroundGameWorld);

    userSelectedCharacter();
    animate();
  }

  function animate() {
    player.character.sprite.advanceTime(1/60);
    player.character.drawUpdate();
    for(var id in players) {
      var p  = players[id];
      if (p) {
        p.character.sprite.advanceTime(1/60);
        p.character.drawUpdate();
      }
    }
    player.inputHandler.readInput();
    sendUpdatePlayer();
    renderer.render(stage);
    requestAnimationFrame(animate);

    stage.setChildIndex(foregroundGameWorld, stage.children.length - 1);
  }

  function sendUpdatePlayer(){
    // msg [msgType(update), (x), (y)]
    dataUpdate.x = player.character.sprite.x;
    dataUpdate.y = player.character.sprite.y;
    dataUpdate.gameWorldX = player.character.worldX();
    dataUpdate.gameWorldY = player.character.worldY();
    dataUpdate.currentSequence = player.character.sprite.currentSequence;
    var msg = dataUpdate.encode();
    socket.emit('UpdateServerPlayer', msg);
  }

  function userSelectedCharacter() {
    player = new Player(new Human());
    player.character.backgroundGameWorld = backgroundGameWorld;
    player.character.foregroundGameWorld = foregroundGameWorld;
    dataCreate.characterType = character.Types.Human;
    var msg = dataCreate.encode();
    socket.emit('CreatePlayer', msg);
  }
});
