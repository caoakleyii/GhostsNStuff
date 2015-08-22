Ghost = function() {
  var ghostIdleFrames = [];

  for (var i =0; i < 6; i++) {
    ghostIdleFrames.push(PIXI.Texture.fromFrame('ghost (Layer 1) ' + i + '.aseprite'));
  }

  var ghostWalkingRight = [];

  for (var i = 0; i < 6; i++) {
    ghostWalkingRight.push(PIXI.Texture.fromFrame('ghost (Walking Right) '+ i +'.aseprite'));
  }

  var ghostWalkingLeft = [];

  for (var i =0; i< 6; i++) {
    ghostWalkingLeft.push(PIXI.Texture.fromFrame('ghost (Walking Left) '+ i +'.aseprite'));
  }

  var sequences = {
    "idling": ghostIdleFrames,
    "walkingRight" : ghostWalkingRight,
    "walkingLeft" : ghostWalkingLeft
  };
  this.state = new State();
  this.sprite = new PIXI.AnimatedSprite(sequences);
  this.sprite.position.x = 50;
  this.sprite.position.y = 50;
  this.sprite.frameRate = 2;
  this.sprite.onComplete = ghostCompletedSequence;
  this.sprite.loop = true;
  this.sprite.play();
  this.speed = 2;

}

ghostCompletedSequence = function(sprite, completed){
    // sprite.gotoAndPlay("idle");
  };
