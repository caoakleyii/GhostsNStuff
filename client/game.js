$(document).ready(function() {

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
      .add('assets/fireballUp.json')
      .add('assets/fireballDown.json')
      .add('assets/fireballLeft.json')
      .add('assets/fireballRight.json')
      .load(onAssetsLoaded);

  var dataUtil = require('../core/data.util');
  var dataCreate = require('../core/data.create');
  var dataUpdate = require('../core/data.update');
  var character = require('../core/character');
  var map = require('../core/gameWorld');
  var Physics = require('../core/physics');

  var renderer = new PIXI.CanvasRenderer(1024, 768, { autoResize : true, backgroundColor : 0x99FF00  });

  $('#canvasDiv').append(renderer.view);

  var stage = new PIXI.Container();
  var players = {};
  var socket = io();

  var player;
  var joinedPlayer;
  var foregroundGameWorld;
  var backgroundGameWorld;

  function onAssetsLoaded(){
    var backgroundGameWorldTexture = new PIXI.Texture.fromImage('images/backgroundGameWorld.png');
    backgroundGameWorld = new PIXI.Sprite(backgroundGameWorldTexture);
    stage.addChild(backgroundGameWorld);
    window.Physics = new Physics(backgroundGameWorld);
    var foregroundGameWorldTexture = new PIXI.Texture.fromImage('images/foregroundGameWorld.png');
    foregroundGameWorld = new PIXI.Sprite(foregroundGameWorldTexture);
    stage.addChild(foregroundGameWorld);

    $('.character-select-screen').show();

    animate();
  }


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
      joinedPlayer.character.sprite.x = data.gameWorldX;
      joinedPlayer.character.sprite.y = data.gameWorldY;
      players[data.playerId] = joinedPlayer;
      joinedPlayer.character.create(stage);
    }
  });

  socket.on('PlayerLeft', function(msg) {
    console.log('player quit');
    var data = dataUtil.decode(msg);
    var p = players[data.playerId];
    if(p) {
      delete players[data.playerId];
      p.character.destroy();
    }
  });

  socket.on('CreateClientPlayer', function(msg){
    var data = dataUtil.decode(msg);
    player.id = data.playerId;
    player.character.sprite.x = data.gameWorldX;
    player.character.sprite.y = data.gameWorldY;
    player.character.create(stage);
  });

  socket.on('GameLoop', function(msg) {
    var data = dataUtil.decode(msg);

    var p = players[data.playerId];
    if (p && data.playerId != player.id) {
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

  function animate() {
    if (player) {
      player.inputHandler.readInput();
      sendUpdatePlayer();
    }
    renderer.render(stage);
    stage.setChildIndex(foregroundGameWorld, stage.children.length - 1);
    requestAnimationFrame(animate);
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

  $('input#txtCharacterName.form-control').on('click', function(e) {
    e.stopPropagation();
    console.log('test');
    return false;
  });

  $('div .mage-class-screen').on('click', function(e) {
    if (!$('div .mage-class-screen').hasClass('flipped')) {
        $('.mage-class-screen').html($('.back-of-class-screen').html());
        $('div .mage-class-screen').addClass('flipped');
    }

    if ($(e.target).is(".character-create-submit")) {
      var playerName = $('#txtCharacterName').val();
      showHud(playerName);
      createMage(playerName);
    }

  });
  function showHud(playerName){
    $('.player-info').html(playerName);
    $('.player-hud').show();
  }
  function createMage(playerName){
    $('.character-select-screen').hide();
    var mage = new Mage();
    Human.call(mage);
    player = new Player(mage);
    player.name = playerName;
    player.character.backgroundGameWorld = backgroundGameWorld;
    player.character.foregroundGameWorld = foregroundGameWorld;
    dataCreate.characterType = character.Types.Human;
    var msg = dataCreate.encode();
    socket.emit('CreatePlayer', msg);
    return false;
  }
});
