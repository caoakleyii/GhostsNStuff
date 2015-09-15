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
