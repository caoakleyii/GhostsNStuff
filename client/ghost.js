var character = require('../core/character');
var clientCharacter = require('./clientCharacter');

Ghost = function() {
  var ghostIdleFrames = [];

  for (var i = 0; i < 6; i++) {
    ghostIdleFrames.push(PIXI.Texture.fromFrame('ghost (Idle Ghost) ' + i + '.aseprite'));
  }

  var ghostWalkingRight = [];

  for (i = 0; i < 6; i++) {
    ghostWalkingRight.push(PIXI.Texture.fromFrame('ghost (Walking Right) '+ i +'.aseprite'));
  }

  var ghostWalkingLeft = [];

  for (i = 0; i < 6; i++) {
    ghostWalkingLeft.push(PIXI.Texture.fromFrame('ghost (Walking Left) '+ i +'.aseprite'));
  }

  var ghostWalkingUp = [];

  for (i = 0; i < 6; i++) {
    ghostWalkingUp.push(PIXI.Texture.fromFrame('ghost (Walking Up) '+ i +'.aseprite'));
  }

  var ghostWalkingDown = [];

  for (i = 0; i < 6; i++) {
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
  character.call(this);
  // has to be called after character.call because of references to hp, etc.
  clientCharacter.call(this);
  this.sprite.play();
  this.speed = 2;

};

Ghost.prototype.ghostCompletedSequence = function(sprite, completed){
    // sprite.gotoAndPlay("idle");
  };
