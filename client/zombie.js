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
