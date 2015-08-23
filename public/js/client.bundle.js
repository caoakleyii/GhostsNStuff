(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
PIXI.AnimatedSprite=function(sequences,frameRate,firstSequence){
  this.sequences=sequences;
  if(firstSequence==undefined){
    for(var key in sequences){
      this.currentSequence=key;
      break;
    }
  }
  else{
    this.currentSequence=firstSequence;
  }
  PIXI.Sprite.call(this,this.sequences[this.currentSequence][0]);
  this.anchor.x=this.anchor.y=.5;
  this.frameRate=frameRate||60;
  this.onComplete=null;
  this.currentFrame=0;
  this.previousFrame;
  this.playing=false;
  this.loop=false;
  this.isGravitational = true;
}
//animatedSprite
PIXI.AnimatedSprite.constructor = PIXI.AnimatedSprite;
PIXI.AnimatedSprite.prototype = Object.create(PIXI.Sprite.prototype);

PIXI.AnimatedSprite.prototype.gotoAndPlay=function(where){
  if(Object.prototype.toString.call(where)=='[object String]'){
    this.currentFrame=0;
    this.currentSequence=where;
  }
  else{
    this.currentFrame=where;
  }
  this.playing=true;
}

PIXI.AnimatedSprite.prototype.gotoAndStop=function(where){
  if(Object.prototype.toString.call(where)=='[object String]'){
    this.currentFrame=0;
    this.currentSequence=where;
  }
  else{
    this.currentFrame=where;
  }
  this.texture = (this.sequences[this.currentSequence][this.currentFrame]);
  this.playing=false;
}

PIXI.AnimatedSprite.prototype.play=function(){
  this.playing=true;
}

PIXI.AnimatedSprite.prototype.stop=function(){
  this.playing=false;
}

PIXI.AnimatedSprite.prototype.addImpulse = function (xForce, yForce){
  if (this.hitBox){
    var hitBoxPosition = new PIXI.Point(this.hitBox.x + xForce, this.position.y + yForce);
  }

  this.position = new PIXI.Point(this.position.x + xForce, this.position.y + yForce);

  // if (!Physics.isPointOutsideFrame(hitBoxPosition))
  // {
  //
  // }
}

PIXI.AnimatedSprite.prototype.updateHitBox = function()
{
  if(this.width > 0)
    this.hitBox.x = this.position.x - (this.width / 2);
  else if (this.width < 0)
    this.hitBox.x = this.position.x + (this.width / 2);

  this.hitBox.y = this.position.y - (this.height / 2);

};

PIXI.AnimatedSprite.prototype.advanceTime=function(dt){

  if(typeof dt=="undefined"){
    dt=1/60;
  }

  if(this.playing){
    this.currentFrame+=this.frameRate*dt;

    var constrainedFrame=Math.floor(Math.min(this.currentFrame, this.sequences[this.currentSequence].length-1));
    this.texture = (this.sequences[this.currentSequence][constrainedFrame]);

    if(this.currentFrame>=this.sequences[this.currentSequence].length){
      if(this.loop){
        this.gotoAndPlay(0);
      }
      else{
        this.stop();
      }
      if(this.onComplete){
        this.onComplete(this, this.currentSequence);
      }
    }
  }
}

},{}],2:[function(require,module,exports){
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

},{"../core/character":9,"../core/data.create":10,"../core/data.update":11,"../core/data.util":12}],3:[function(require,module,exports){
Ghost = function() {
  var ghostIdleFrames = [];

  for (var i =0; i < 6; i++) {
    ghostIdleFrames.push(PIXI.Texture.fromFrame('ghost (Idle Ghost) ' + i + '.aseprite'));
  }

  var ghostWalkingRight = [];

  for (var i = 0; i < 6; i++) {
    ghostWalkingRight.push(PIXI.Texture.fromFrame('ghost (Walking Right) '+ i +'.aseprite'));
  }

  var ghostWalkingLeft = [];

  for (var i =0; i< 6; i++) {
    ghostWalkingLeft.push(PIXI.Texture.fromFrame('ghost (Walking Left) '+ i +'.aseprite'));
  }

  var ghostWalkingUp = [];

  for (var i =0; i< 6; i++) {
    ghostWalkingUp.push(PIXI.Texture.fromFrame('ghost (Walking Up) '+ i +'.aseprite'));
  }

  var ghostWalkingDown = [];

  for (var i =0; i< 6; i++) {
    ghostWalkingDown.push(PIXI.Texture.fromFrame('ghost (Walking Down) '+ i +'.aseprite'));
  }

  var sequences = {
    "idling": ghostIdleFrames,
    "walkingRight" : ghostWalkingRight,
    "walkingLeft" : ghostWalkingLeft,
    "walkingUp" : ghostWalkingUp,
    "walkingDown" : ghostWalkingDown
  };
  this.state = new State();
  this.sprite = new PIXI.AnimatedSprite(sequences);
  this.sprite.frameRate = 2;
  this.sprite.onComplete = this.ghostCompletedSequence;
  this.sprite.loop = true;
  this.sprite.play();
  this.speed = 2;

};

Ghost.prototype.ghostCompletedSequence = function(sprite, completed){
    // sprite.gotoAndPlay("idle");
  };

},{}],4:[function(require,module,exports){
InputManager = function(character){
  this.character = character;
};

InputManager.inputType = {
  Up : 0,
  Right : 1,
  Down : 2,
  Left : 3,
  Jump: 4,
  Sprint : 5,
  AutoAttack : 6,
  Skill1 : 7,
  Skill2 : 8,
  Skill3 : 9
};

InputManager.getInputType = function(key)
{
  switch(key)
  {
    case 39:
      return InputManager.inputType.Right;
    case 37:
      return InputManager.inputType.Left;
    case 38:
      return InputManager.inputType.Up;
    case 40:
      return InputManager.inputType.Down;
    case 32:
      return InputManager.inputType.Jump;
    case 16:
      return InputManager.inputType.Sprint;
    case 70:
      return InputManager.inputType.AutoAttack;
    case 65:
      return InputManager.inputType.Skill1;
    case 83:
      return InputManager.inputType.Skill2;
    case 68:
      return InputManager.inputType.Skill3;
  }
};



InputManager.prototype.readInput = function() {
    if (InputManager.inputType.Right in keysDown) {
      if (!this.character.state.isWalkingRight) {
        this.character.state.isWalkingRight = true;
        this.character.sprite.gotoAndPlay("walkingRight");
      }
      this.character.sprite.addImpulse(this.character.speed, 0);
    } else {
      this.character.state.isWalkingRight = false;
    }

    if (InputManager.inputType.Left in keysDown) {
      if (!this.character.state.isWalkingLeft) {
        this.character.state.isWalkingLeft = true;
        this.character.sprite.gotoAndPlay("walkingLeft");
      }
      this.character.sprite.addImpulse(this.character.speed * -1, 0);
    } else {
      this.character.state.isWalkingLeft = false;
    }

    if (InputManager.inputType.Down in keysDown) {
      if (!this.character.state.isWalkingDown) {
        this.character.state.isWalkingDown = true;
        this.character.sprite.gotoAndPlay("walkingDown");
      }
      this.character.sprite.addImpulse(0, this.character.speed);
    } else {
      this.character.state.isWalkingDown = false;
    }

    if (InputManager.inputType.Up in keysDown) {
      if (!this.character.state.isWalkingUp) {
        this.character.state.isWalkingUp = true;
        this.character.sprite.gotoAndPlay("walkingUp");
      }
      this.character.sprite.addImpulse(0, this.character.speed * -1);
    } else {
      this.character.state.isWalkingUp = false;
    }

    if(keysDown.every(isKeyDownEmpty)){
      if (!this.character.state.isIdling) {
        this.character.state.isIdling = true;
        this.character.sprite.gotoAndPlay("idling");
      }
    }
}

var keysDown = [];

function isKeyDownEmpty(element)
{
   return false;
}

$(document).keydown(function(e){

	// space and arrow keys
  // prevent them from scrolling the page
	if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
	  e.preventDefault();
  }

  var input = InputManager.getInputType(e.keyCode);
  keysDown[input] = true;

});

$(document).keyup(function(e) {
  var input = InputManager.getInputType(e.keyCode);
  delete keysDown[input];
});

},{}],5:[function(require,module,exports){
var animatedSprite = require('./animatedSprite');
var game = require('./game');
var ghost = require('./ghost');
var inputManager = require('./inputManager');;
var player = require('./player');
var state = require('./state');
var zombie = require('./zombie');

},{"./animatedSprite":1,"./game":2,"./ghost":3,"./inputManager":4,"./player":6,"./state":7,"./zombie":8}],6:[function(require,module,exports){
Player = function(character){
  this.character = character;
  this.inputHandler = new InputManager(character);
};

},{}],7:[function(require,module,exports){
State = function(){
  this.isWalkingLeft = false;
  this.isWalkingRight = false;
  this.isIdling = true;
}

},{}],8:[function(require,module,exports){
Zombie = function() {
  var zombieIdling = [];

  for(var i =0; i < 6; i++) {
    zombieIdling.push(PIXI.Texture.fromFrame("zombie (Idling) " + i + '.ase'));
  }

  var zombieWalkingLeft = [];

  for(var i =0; i < 6; i++) {
    zombieWalkingLeft.push(PIXI.Texture.fromFrame("zombie (Walking Left) " + i + '.ase'));
  }


  var zombieWalkingRight = [];

  for(var i =0; i < 6; i++) {
    zombieWalkingRight.push(PIXI.Texture.fromFrame("zombie (Walking Right) " + i + '.ase'));
  }

  var sequences = {
    "idling" : zombieIdling,
    "walkingRight" : zombieWalkingRight,
    "walkingLeft" : zombieWalkingLeft
  };
  this.state = new State();
  this.sprite = new PIXI.AnimatedSprite(sequences);
  this.sprite.frameRate = 6;
  this.sprite.onComplete = this.zombieCompletedSequence;
  this.sprite.loop = true;
  this.sprite.play();
  this.speed = 2;
}

Zombie.prototype.zombieCompletedSequence = function(sprite, completed) {

};

},{}],9:[function(require,module,exports){
var character = exports;

character.Types =  {
    Ghost : 1,
    Zombie : 2
};

},{}],10:[function(require,module,exports){
var dataCreate = exports;

(function() {
  dataCreate.playerId = undefined;
  dataCreate.characterType = undefined;
  dataCreate.x = undefined;
  dataCreate.y = undefined;
})();

dataCreate.encode = function(){
  // msg [msgType(Create), playerId, characterType, x, y]
  var msg = [1, this.playerId, this.characterType, this.x, this.y];
  return msg;
}

},{}],11:[function(require,module,exports){
var dataUpdate = exports;
(function(){
  dataUpdate.playerId = undefined;
  dataUpdate.x = undefined;
  dataUpdate.y = undefined;
})();

dataUpdate.encode = function() {
  // [msgType, x, y]
  var msg = [2, this.playerId, this.x, this.y];
  this.playerId = undefined;
  this.x = undefined;
  this.y = undefined;
  return msg;
};

},{}],12:[function(require,module,exports){
var dataCreate = require('./data.create'),
    dataUpdate = require('./data.update');

var dataUtil = exports;


dataUtil.MessageTypes = {
  'Delete' : 0,
  'Create' : 1,
  'Update' : 2
};

dataUtil.decode  = function(msg){
  switch(msg[0]) {
    case this.MessageTypes.Delete:
      break;
    case this.MessageTypes.Create:
      // msg [msgType(Create), playerId, characterType, x, y]
      dataCreate.playerId = msg[1];
      dataCreate.characterType = msg[2];
      dataCreate.x = msg[3];
      dataCreate.y = msg[4];
      return dataCreate;
    case this.MessageTypes.Update:
      dataUpdate.playerId = msg[1];
      dataUpdate.x = msg[2];
      dataUpdate.y = msg[3];
      return dataUpdate;
  }
};

},{"./data.create":10,"./data.update":11}]},{},[5]);
