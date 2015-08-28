var character = require('../core/character');
var clientCharacter = require('./clientCharacter');

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


Human = function() {

  // Load Frames
  LoadFrames();

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

  this.state = new State();
  this.sprite = new PIXI.AnimatedSprite(sequences);
  this.sprite.onComplete = this.humanCompletedSequence;
  this.sprite.loop = true;
  character.call(this);
  clientCharacter.call(this);
  this.baseFrameRate = 3;
  this.sprite.frameRate = this.baseFrameRate;
  this.sprite.play();
  this.speed = 1.5;
  this.skill1 = function() {
    this.swing();
  };


  this.swing = function() {
    if (!this.state.isAttacking) {
        this.state.isAttacking = true;
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
}

Human.prototype.humanCompletedSequence = function(sprite, completed){

}

function LoadFrames() {
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
}
