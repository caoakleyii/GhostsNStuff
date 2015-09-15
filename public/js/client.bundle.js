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

PIXI.AnimatedSprite.prototype.gotoAndPlayOnce =function(where){
  this.loop = false;
  if(Object.prototype.toString.call(where)=='[object String]'){
    this.currentFrame=0;
    this.currentSequence=where;
  }
  else{
    this.currentFrame=where;
  }
  this.playing=true;
}


PIXI.AnimatedSprite.prototype.gotoAndPlayLoop =function(where){
  this.loop = true;
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

PIXI.AnimatedSprite.prototype.addImpulse = function (xForce, yForce, gamePosition) {
  var futurePosition =  new PIXI.Point(this.position.x + xForce, this.position.y + yForce);
  if (gamePosition) {
    gamePosition.x += xForce;
    gamePosition.y += yForce;
    if(Physics.outOfGameWorld(gamePosition))
    {
      return;
    }
  }
  this.position = futurePosition;
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
ClientCharacter = function(){
  // inherit from GameObject
  GameObject.call(this);

  this.healthBar = new PIXI.Graphics();
  this.healthBar.beginFill(0xFF0000)
  this.healthBar.lineStyle(1, 0xFFFFFF);
  this.healthBar.drawRect(this.sprite.position.x - (this.sprite.width / 2 - 2),  this.sprite.position.y - 15,  (this.currentHP / this.totalHP) * 50,  5);

  this.clientWalk = function (frameRate, speedModifier) {
    var backgroundTransitionSpeed = (this.speed * speedModifier);
    var gamePosition  = new PIXI.Point(this.worldX(), this.worldY());
    if (!this.state.isAttacking) {
      this.sprite.frameRate = frameRate;

      switch(this.orientation){
        case Character.Orientation.Right:
        if (this.sprite.currentSequence != "walkingRight") {
          this.sprite.gotoAndPlayLoop("walkingRight");
        }
        if (this.sprite.x >= 865 && this.worldX() <= (this.backgroundGameWorld.width - 159)) {
          this.backgroundGameWorld.addImpulse(backgroundTransitionSpeed * -1 , 0);
          this.foregroundGameWorld.addImpulse(backgroundTransitionSpeed * -1 , 0);
        } else {
          this.sprite.addImpulse(this.speed * speedModifier, 0, gamePosition);
        }
        break;
        case Character.Orientation.Left:
        if (this.sprite.currentSequence != "walkingLeft") {
          this.sprite.gotoAndPlayLoop("walkingLeft");
        }
        if (this.sprite.x <= 165  && this.worldX() >= 165) {
          this.backgroundGameWorld.addImpulse(backgroundTransitionSpeed, 0);
          this.foregroundGameWorld.addImpulse(backgroundTransitionSpeed, 0);
        } else {
          this.sprite.addImpulse((this.speed * speedModifier) * -1, 0, gamePosition);
        }
        break;
        case Character.Orientation.Down:
        if (this.sprite.currentSequence != "walkingDown") {
          this.sprite.gotoAndPlayLoop("walkingDown");
        }
        if (this.sprite.y >= 645 && this.worldY() <= (this.backgroundGameWorld.height - 123)) {
          this.backgroundGameWorld.addImpulse(0, backgroundTransitionSpeed * -1);
          this.foregroundGameWorld.addImpulse(0, backgroundTransitionSpeed * -1);
        } else {
          this.sprite.addImpulse(0, this.speed * speedModifier, gamePosition);
        }
        break;
        case Character.Orientation.Up:
        if (this.sprite.currentSequence != "walkingUp") {
          this.sprite.gotoAndPlayLoop("walkingUp");
        }
        if (this.sprite.y <= 125 && this.worldY() >= 125) {
          this.backgroundGameWorld.addImpulse(0, backgroundTransitionSpeed);
          this.foregroundGameWorld.addImpulse(0, backgroundTransitionSpeed);
        } else {
          this.sprite.addImpulse(0, (this.speed * speedModifier) * -1, gamePosition);
        }
        break;
      }
    }
  };

  this.idle = function(){
    if (!this.state.isAttacking) {
      switch(this.orientation) {
        case Character.Orientation.Right:
        this.sprite.gotoAndPlayLoop("idlingRight");
        break;
        case Character.Orientation.Left:
        this.sprite.gotoAndPlayLoop("idlingLeft");
        break;
        case Character.Orientation.Up:
        this.sprite.gotoAndPlayLoop("idlingUp");
        break;
        case Character.Orientation.Down:
        this.sprite.gotoAndPlayLoop("idlingDown");
        break;
      }
    }
  }; // end of idle function
};

},{}],3:[function(require,module,exports){
PIXI.Sprite.prototype.addImpulse = function (xForce, yForce){
  this.position = new PIXI.Point(this.position.x + xForce, this.position.y + yForce);
}

},{}],4:[function(require,module,exports){
var fireballRightFrames = [];
var fireballLeftFrames = [];
var fireballUpFrames = [];
var fireballDownFrames = [];
var assetsLoaded = false;

Fireball = function(orientation) {
  // Load Frames
  LoadFrames(this);

  //inherit from gameObject
  GameObject.call(this);

  this.speed = 5;

  switch(orientation) {
    case Character.Orientation.Right:
    this.orientation = orientation;
    this.sprite.gotoAndPlayLoop("fireballRight");
    break;
    case Character.Orientation.Left:
    this.orientation = orientation;
    this.sprite.gotoAndPlayLoop("fireballLeft");
    break;
    case Character.Orientation.Up:
    this.orientation = orientation;
    this.sprite.gotoAndPlayLoop("fireballUp");
    break;
    case Character.Orientation.Down:
    this.orientation = orientation;
    this.sprite.gotoAndPlayLoop("fireballDown");
    break;
  }
}

Fireball.prototype.completedSequence = function(sprite, completed){

}

Fireball.prototype.create = function(stage) {
  this.stage = stage;
  this.stage.addChild(this.sprite);

  this.update();
};

Fireball.prototype.update = function() {
  // advance animation
  this.sprite.advanceTime(1/60);

  // move fireball
  switch(this.orientation) {
    case Character.Orientation.Right:
    this.sprite.addImpulse(this.speed, 0)
    break;
    case Character.Orientation.Left:
    this.sprite.addImpulse(this.speed * -1, 0)
    break;
    case Character.Orientation.Up:
    this.sprite.addImpulse(0, this.speed * -1)
    break;
    case Character.Orientation.Down:
    this.sprite.addImpulse(0, this.speed)
    break;
  }

  requestAnimationFrame(this.update.bind(this));
};

Fireball.prototype.destroy = function() {

};


function LoadFrames(fireball) {

  var sequences = {
    "fireballRight" : fireballRightFrames,
    "fireballLeft" : fireballLeftFrames,
    "fireballUp" : fireballUpFrames,
    "fireballDown" : fireballDownFrames
  };

  if (!assetsLoaded) {
    for (var i = 0; i < 6; i++) {
      fireballUpFrames.push(PIXI.Texture.fromFrame('fireball (Fireball Up) ' + i +'.ase'));
    }

    for (var i = 0; i < 6; i++) {
      fireballDownFrames.push(PIXI.Texture.fromFrame('fireball (Fireball Down) ' + i +'.ase'));
    }

    for (var i = 0; i < 6; i++) {
      fireballLeftFrames.push(PIXI.Texture.fromFrame('fireball (Fireball Left) ' + i +'.ase'));
    }

    for (var i = 0; i < 6; i++) {
      fireballRightFrames.push(PIXI.Texture.fromFrame('fireball (Fireball Right) ' + i +'.ase'));
    }
    assetsLoaded = true;
  }

  fireball.state = new State();
  fireball.sprite = new PIXI.AnimatedSprite(sequences);
  fireball.sprite.onComplete = fireball.completedSequence;
  fireball.sprite.frameRate = 10;
  fireball.sprite.loop = true;

}

},{}],5:[function(require,module,exports){
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

    userSelectedCharacter();
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
    player.inputHandler.readInput();
    sendUpdatePlayer();
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

  function userSelectedCharacter() {
    player = new Player(new Human());
    player.character.backgroundGameWorld = backgroundGameWorld;
    player.character.foregroundGameWorld = foregroundGameWorld;
    dataCreate.characterType = character.Types.Human;
    var msg = dataCreate.encode();
    socket.emit('CreatePlayer', msg);
  }
});

},{"../core/character":12,"../core/data.create":13,"../core/data.update":14,"../core/data.util":15,"../core/gameWorld":16,"../core/physics":17}],6:[function(require,module,exports){
GameObject = function() {
  this.client = true;
  this.backgroundGameWorld = undefined;
  this.foregroundGameWorld = undefined;
  this.worldX = function(){
    return this.sprite.x - this.backgroundGameWorld.x;
  };
  this.worldY = function(){
    return this.sprite.y - this.backgroundGameWorld.y;
  };
};

},{}],7:[function(require,module,exports){
var character = require('../core/character');

var humanIdleUpFrames = [];
var humanIdleDownFrames = [];
var humanIdleLeftFrames = [];
var humanIdleRightFrames = [];
var humanWalkUpFrames = [];
var humanWalkDownFrames = [];
var humanWalkLeftFrames = [];
var humanWalkRightFrames = [];
var humanSwingUpFrames = [];
var humanSwingDownFrames = [];
var humanSwingLeftFrames = [];
var humanSwingRightFrames = [];
var assetsLoaded = false;

Human = function() {
  // init Load Frames
  LoadFrames(this);

  // inherit from Character and Client Character
  character.call(this);
  ClientCharacter.call(this);

  this.baseFrameRate = 3;
  this.sprite.frameRate = this.baseFrameRate;
  this.sprite.play();
  this.speed = 1.5;

  this.skill1 = function() {
    this.swing();
    this.castFireball();
  };

  this.swing = function() {
    if (!this.state.isAttacking) {
      this.state.isAttacking = true;
      console.log("swing");
      switch(this.orientation){
        case Character.Orientation.Right:
        this.sprite.gotoAndPlayOnce("swingingRight");
        break;
        case Character.Orientation.Left:
        this.sprite.gotoAndPlayOnce("swingingLeft");
        break;
        case Character.Orientation.Up:
        this.sprite.gotoAndPlayOnce("swingingUp");
        break;
        case Character.Orientation.Down:
        this.sprite.gotoAndPlayOnce("swingingDown");
        break;
      }
    }
  };

  this.castFireball = function() {
    if (!this.state.isCasting) {
      this.state.isCasting = true;
      var fireball = new Fireball(this.orientation);
      fireball.sprite.x = this.sprite.x;
      fireball.sprite.y = this.sprite.y;
      fireball.create(this.stage);
    }
  };
}

Human.prototype.create = function(stage) {
  this.stage = stage;
  this.stage.addChild(this.sprite);
  this.stage.addChild(this.healthBar);

  this.update();
};

Human.prototype.update = function() {
  // advance animation
  this.sprite.advanceTime(1/60);

  // keep health bar above character
  this.healthBar.position.x = this.sprite.position.x - (this.sprite.width / 2 - 2);
  this.healthBar.position.y = this.sprite.position.y - 15;
  this.width = (this.currentHP / this.totalHP) * 50;

  requestAnimationFrame(this.update.bind(this));
};

Human.prototype.destroy = function() {
  this.stage.removeChild(this.sprite);
  this.stage.removeChild(this.healthBar);
};

Human.prototype.humanCompletedSequence = function(sprite, completed){

}

function LoadFrames(human) {

  var sequences = {
    "idlingDown" : humanIdleDownFrames,
    "idlingUp" : humanIdleUpFrames,
    "idlingLeft" : humanIdleLeftFrames,
    "idlingRight" : humanIdleRightFrames,
    "walkingUp" : humanWalkUpFrames,
    "walkingDown" : humanWalkDownFrames,
    "walkingLeft" : humanWalkLeftFrames,
    "walkingRight" : humanWalkRightFrames,
    "swingingUp" : humanSwingUpFrames,
    "swingingDown" : humanSwingDownFrames,
    "swingingLeft" : humanSwingLeftFrames,
    "swingingRight" : humanSwingRightFrames
  };


  if (!assetsLoaded) {

    // Idle Frames
    for (var i = 0; i < 1; i++) {
      humanIdleUpFrames.push(PIXI.Texture.fromFrame('Player (Idling Up) ' + i +'.ase'));
    }

    for (var i = 0; i < 1; i++) {
      humanIdleDownFrames.push(PIXI.Texture.fromFrame('Player (Idling Down) ' + i +'.ase'));
    }

    for (var i = 0; i < 1; i++) {
      humanIdleLeftFrames.push(PIXI.Texture.fromFrame('Player (Idling Left) ' + i +'.ase'));
    }

    for (var i = 0; i < 1; i++) {
      humanIdleRightFrames.push(PIXI.Texture.fromFrame('Player (Idling Right) ' + i +'.ase'));
    }


    // Walk Frames
    for (var i = 0; i < 4; i++) {
      humanWalkUpFrames.push(PIXI.Texture.fromFrame('Player (Walking Up) ' + i + '.ase'));
    }

    for (var i = 0; i < 4; i++) {
      humanWalkDownFrames.push(PIXI.Texture.fromFrame('Player (Walking Down) ' + i + '.ase'));
    }

    for (var i = 0; i < 4; i++) {
      humanWalkLeftFrames.push(PIXI.Texture.fromFrame('Player (Walking Left) ' + i + '.ase'));
    }

    for (var i = 0; i < 4; i++) {
      humanWalkRightFrames.push(PIXI.Texture.fromFrame('Player (Walking Right) ' + i + '.ase'));
    }

    // Swinging Frames
    for (var i = 0; i < 4; i++){
      humanSwingUpFrames.push(PIXI.Texture.fromFrame('Player (Swinging Up) ' + i + '.ase'));
    }

    for (var i = 0; i < 4; i++){
      humanSwingDownFrames.push(PIXI.Texture.fromFrame('Player (Swinging Down) ' + i + '.ase'));
    }

    for (var i = 0; i < 4; i++){
      humanSwingLeftFrames.push(PIXI.Texture.fromFrame('Player (Swinging Left) ' + i + '.ase'));
    }

    for (var i = 0; i < 4; i++){
      humanSwingRightFrames.push(PIXI.Texture.fromFrame('Player (Swinging Right) ' + i + '.ase'));
    }
    assetsLoaded = true;
  }

  human.state = new State();
  human.sprite = new PIXI.AnimatedSprite(sequences);
  human.sprite.onComplete = human.humanCompletedSequence;
  human.sprite.loop = true;
}

},{"../core/character":12}],8:[function(require,module,exports){
var Character = require('../core/character');

InputManager = function(character){
  this.character = character;
  this.onKeyDown();
  this.onKeyUp();
  this.keysDown = [];
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

  // this will allow the charcter to walk into the correct direction based on which key's are still down,
  // in conjuction with what key was last pressed.
  // TODO: still needs to be fixed
  if (InputManager.inputType.Right in this.keysDown) {
    this.character.orientation = Character.Orientation.Right;
  }

  if (InputManager.inputType.Left in this.keysDown) {
    this.character.orientation = Character.Orientation.Left;
  }

  if (InputManager.inputType.Down in this.keysDown) {
    this.character.orientation = Character.Orientation.Down;
  }

  if (InputManager.inputType.Up in this.keysDown) {
    this.character.orientation = Character.Orientation.Up;
  }

  if (InputManager.inputType.Skill1 in this.keysDown) {
    this.character.skill1();
  }

  if (this.character.state.isAttacking && !this.character.sprite.playing) {
    this.character.state.isAttacking = false;
    this.character.state.isCasting = false;
  }

  if (this.walkingKeysDown()) {
    if (InputManager.inputType.Sprint in this.keysDown) {
      this.character.run();
    } else {
      this.character.walk();
    }
  }

  if(this.keysDown.every(isKeyDownEmpty)){
    this.character.idle();
  }
};

InputManager.prototype.onKeyDown = function() {
  var handler = this;
  if(handler.character) {
    $(document).keydown(function(e){

      // space and arrow keys
      // prevent them from scrolling the page
      if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
      }

      var input = InputManager.getInputType(e.keyCode);
      handler.keysDown[input] = true;
      if( input == 7) {
      console.log('skill 1 was added');
      }

      // this will change the users direction on input
      if (InputManager.inputType.Right == input) {
        handler.character.orientation = Character.Orientation.Right;
      }

      if (InputManager.inputType.Left == input) {
        handler.character.orientation = Character.Orientation.Left;
      }

      if (InputManager.inputType.Down == input) {
        handler.character.orientation = Character.Orientation.Down;
      }

      if (InputManager.inputType.Up == input) {
        handler.character.orientation = Character.Orientation.Up;
      }

      return false;
    });
  }
}

InputManager.prototype.onKeyUp = function(){
  var handler = this;

  $(document).keyup(function(e) {
    var input = InputManager.getInputType(e.keyCode);
    if (input == 7) {
      console.log('skill 1 was deleted');
    }
    delete handler.keysDown[input];
  });
}

function isKeyDownEmpty(element)
{
  return false;
}

InputManager.prototype.walkingKeysDown = function() {
  if (InputManager.inputType.Up in this.keysDown || InputManager.inputType.Down in this.keysDown
    || InputManager.inputType.Left in this.keysDown || InputManager.inputType.Right in this.keysDown) {
      return true;
    }
    return false;
  }

},{"../core/character":12}],9:[function(require,module,exports){
var animatedSprite = require('./animatedSprite');
var game = require('./game');
var inputManager = require('./inputManager');
var gameObject = require('./gameObject');
var fireball = require('./fireball');
var player = require('./player');
var state = require('./state');
var clientCharacter = require('./clientCharacter');
var human = require('./human');
var extensions = require('./extensions');

},{"./animatedSprite":1,"./clientCharacter":2,"./extensions":3,"./fireball":4,"./game":5,"./gameObject":6,"./human":7,"./inputManager":8,"./player":10,"./state":11}],10:[function(require,module,exports){
Player = function(character){
  this.character = character;
  if(character) {
    this.inputHandler = new InputManager(character);
  }
};

},{}],11:[function(require,module,exports){
State = function(){
  this.isWalkingLeft = false;
  this.isWalkingRight = false;
  this.isWalkingUp = false;
  this.isWalkingDown = false;
  this.isIdling = true;
};
},{}],12:[function(require,module,exports){
Character = function() {
  this.x = 0;
  this.y = 0;
  this.totalHP = 100;
  this.currentHP = 100;
  this.baseFrameRate = 2;
  this.speed = 2;
  this.gameWorldX = 0;
  this.gameWorldY = 0;


  this.orientation = Character.Orientation.Right;

  this.walk = function(frameRate, speedModifier) {

    if(!frameRate) {
      frameRate = this.baseFrameRate;
    }

    if(!speedModifier) {
      speedModifier = 1;
    }

    if (this.client) {
      this.clientWalk(frameRate, speedModifier);
    } else {
      switch(this.orientation) {
        case Character.Orientation.Right:
          this.addImpulse(this.speed * speedModifier, 0);
          break;
        case Character.Orientation.Left:
          this.addImpulse((this.speed * speedModifier) * -1, 0);
          break;
        case Character.Orientation.Down:
          this.addImpulse(0, this.speed * speedModifier);
          break;
        case Character.Orientation.Up:
          this.addImpulse(0, (this.speed * speedModifier) * -1);
          break;
      }
    }
  }; // end of walk function

  this.run = function() {
    this.walk(this.baseFrameRate * 2, this.speed * 1.1);
  }

  this.addImpulse = function(xForce, yForce) {
    this.gameWorldX = this.gameWorldX + xForce;
    this.gameWorldY = this.gameWorldY + yForce;
  }

}

Character.Types =  {
  Human : 0
};

Character.Orientation = {
  Right : 1,
  Left: 2,
  Up : 3,
  Down: 4
};

module.exports = Character;

},{}],13:[function(require,module,exports){
var dataCreate = exports;

(function() {
  dataCreate.playerId = undefined;
  dataCreate.characterType = undefined;
  dataCreate.x = undefined;
  dataCreate.y = undefined;
  dataCreate.gameWorldX = undefined;
  dataCreate.gameWorldY = undefined;
})();

dataCreate.encode = function(){
  // msg [msgType(Create), playerId, characterType, x, y]
  var msg = [1, this.playerId, this.characterType, this.x, this.y, this.gameWorldX, this.gameWorldY];

  this.playerId = undefined;
  this.characterType = undefined;
  this.x = undefined;
  this.y = undefined;
  this.gameWorldX = undefined;
  this.gameWorldY = undefined;
  return msg;
};

},{}],14:[function(require,module,exports){
var dataUpdate = exports;
(function(){
  dataUpdate.playerId = undefined;
  dataUpdate.x = undefined;
  dataUpdate.y = undefined;
  dataUpdate.currentSequence = undefined;
  dataUpdate.keysDown = undefined;
  dataUpdate.gameWorldX = undefined;
  dataUpdate.gameWorldY = undefined;
})();

dataUpdate.encode = function() {
  // [msgType, x, y]
  var msg = [2, this.playerId, this.x, this.y, this.currentSequence, this.keysDown, this.gameWorldX, this.gameWorldY];
  this.playerId = undefined;
  this.x = undefined;
  this.y = undefined;
  this.currentSequence = undefined;
  this.keysDown = undefined;
  this.gameWorldX = undefined;
  this.gameWorldY = undefined;
  return msg;
};

},{}],15:[function(require,module,exports){
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
      dataCreate.gameWorldX = msg[5];
      dataCreate.gameWorldY = msg[6];
      return dataCreate;
    case this.MessageTypes.Update:
      dataUpdate.playerId = msg[1];
      dataUpdate.x = msg[2];
      dataUpdate.y = msg[3];
      dataUpdate.currentSequence = msg[4];
      dataUpdate.keysDown = msg[5];
      dataUpdate.gameWorldX = msg[6];
      dataUpdate.gameWorldY = msg[7];
      return dataUpdate;
  }
};

},{"./data.create":13,"./data.update":14}],16:[function(require,module,exports){
var TileMaps = {};
(function(name,data){
 if(typeof onTileMapLoaded === 'undefined') {
  if(typeof TileMaps === 'undefined') TileMaps = {};
  TileMaps[name] = data;
 } else {
  onTileMapLoaded(name,data);
 }})("gameWorld",
{ "height":50,
 "layers":[
        {
         "compression":"zlib",
         "data":"eJztwwEJAAAMBKFL8f2jLsdAwVVTVVVVVVVVVVXV5w\/1etbZ",
         "encoding":"base64",
         "height":50,
         "name":"Background",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":50,
         "x":0,
         "y":0
        },
        {
         "compression":"zlib",
         "data":"eJzt1DEOgzAMBdBs7cIF2i5coEzc\/2qIoQtItQekOOg96U9ebDnx3O5h7d3ARR7JPHs1mPRO5tOrwaTsHHsq72UJMspepqD+amPMMQf1UeaI7u63nd9XdNsqO+7lXyozRy2\/f5IJAAAAAAAAALEN7d8M2g==",
         "encoding":"base64",
         "height":50,
         "name":"World",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":50,
         "x":0,
         "y":0
        },
        {
         "compression":"zlib",
         "data":"eJzt00EKgCAQAED\/\/zODnqDQT1IQ8lBWN4UZWNyVPSiuIVxyiVjiaHVdU8tjWEsa7O9hvfvc6d8H\/qjzv3X5U8\/M6vnr\/OdWj\/78zPJ7CwAAAAAAAAAAH52XVxJg",
         "encoding":"base64",
         "height":50,
         "name":"Trees",
         "opacity":1,
         "properties":
            {
             "collidable":"true"
            },
         "type":"tilelayer",
         "visible":true,
         "width":50,
         "x":0,
         "y":0
        },
        {
         "compression":"zlib",
         "data":"eJzt0zEKgDAMBdDef\/dQKh5BxZu4FLpUVJRi63sQ\/pIhJCSEZIg5ZqomS8w1Uy358m26G70t3oYy+nD+A1OJQR6aQ\/qB\/qBnKzTLW+aYNez\/itr2DwAAAAAAAAB\/tQPmkhY2",
         "encoding":"base64",
         "height":50,
         "name":"Layered Trees",
         "opacity":1,
         "properties":
            {
             "collidable":"true"
            },
         "type":"tilelayer",
         "visible":true,
         "width":50,
         "x":0,
         "y":0
        },
        {
         "compression":"zlib",
         "data":"eJztwQENAAAAwqD3T20ON6AAAAAAAAAAAADg3wAnEAAB",
         "encoding":"base64",
         "height":50,
         "name":"Shadow",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":50,
         "x":0,
         "y":0
        },
        {
         "compression":"zlib",
         "data":"eJzt0wEJAAAIA0H7BzWHIQRFuUvwDBYBwGW5HfCcfaHHhwAAAAAAAIBJBXh0ArM=",
         "encoding":"base64",
         "height":50,
         "name":"Barrels",
         "opacity":1,
         "properties":
            {
             "collidable":"true"
            },
         "type":"tilelayer",
         "visible":true,
         "width":50,
         "x":0,
         "y":0
        },
        {
         "compression":"zlib",
         "data":"eJztwQENAAAAwqD3T20ON6AAAAAAAAAAAADg3wAnEAAB",
         "encoding":"base64",
         "height":50,
         "name":"Buildings",
         "opacity":1,
         "properties":
            {
             "collidable":"true"
            },
         "type":"tilelayer",
         "visible":true,
         "width":50,
         "x":0,
         "y":0
        }],
 "nextobjectid":1,
 "orientation":"orthogonal",
 "properties":
    {

    },
 "renderorder":"right-down",
 "tileheight":64,
 "tilesets":[
        {
         "firstgid":1,
         "image":"..\/..\/..\/Users\/Chris\/Desktop\/RPG pack (230 assets)\/RPG pack (230 assets)\/Spritesheet\/RPGpack_sheet.png",
         "imageheight":832,
         "imagewidth":1280,
         "margin":0,
         "name":"RPG Pack",
         "properties":
            {

            },
         "spacing":0,
         "tilecount":260,
         "tileheight":64,
         "tilewidth":64
        }],
 "tilewidth":64,
 "version":1,
 "width":50
});
gameWorld = TileMaps;
module.exports = gameWorld;

},{}],17:[function(require,module,exports){
function Physics(gameWorld) {
  this.gameWorld = gameWorld;
}

Physics.prototype.outOfRectangle = function(rectangle, position) {
  if (position.x >= (rectangle.x + rectangle.width) || position.x <= rectangle.x){
      return true;
  }

  if (position.y >= (rectangle.y + rectangle.height) || position.y < rectangle.y) {
    return true;
  }

  return false;
}

Physics.prototype.outOfGameWorld = function(position){
  if (position.x >= (this.gameWorld.width) || position.x <= 0){
      return true;
  }

  if (position.y >= (this.gameWorld.height) || position.y < 0) {
    return true;
  }

  return false;
}

module.exports = Physics;

},{}]},{},[9]);
