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
