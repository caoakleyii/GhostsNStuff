Character = function() {
  this.x = 0;
  this.y = 0;
  this.totalHP = 100;
  this.currentHP = 100;
  this.baseFrameRate = 2;
  this.speed = 2;
  this.backgroundGameWorld = undefined;
  this.foregroundGameWorld = undefined;
  this.orientation = Character.Orientation.Right;

  this.walk = function(frameRate, speedModifier) {

    if(!frameRate) {
      frameRate = this.baseFrameRate;
    }

    if(!speedModifier) {
      speedModifier = 1;
    }

    var backgroundTransitionSpeed = (this.speed * speedModifier);

    if (!this.state.isAttacking) {
      this.sprite.frameRate = frameRate;

      switch(this.orientation){
        case Character.Orientation.Right:
          if (this.sprite.currentSequence != "walkingRight") {
            this.sprite.gotoAndPlayLoop("walkingRight");
          }
          if (this.sprite.x >= 865) {
            this.backgroundGameWorld.addImpulse(backgroundTransitionSpeed * -1 , 0);
            this.foregroundGameWorld.addImpulse(backgroundTransitionSpeed * -1 , 0);
          } else {
            this.sprite.addImpulse(this.speed * speedModifier, 0);
          }
          break;
        case Character.Orientation.Left:
          if (this.sprite.currentSequence != "walkingLeft") {
            this.sprite.gotoAndPlayLoop("walkingLeft");
          }
          if (this.sprite.x <= 165) {
              this.backgroundGameWorld.addImpulse(backgroundTransitionSpeed, 0);
              this.foregroundGameWorld.addImpulse(backgroundTransitionSpeed, 0);
          } else {
            this.sprite.addImpulse((this.speed * speedModifier) * -1, 0);
          }
          break;
        case Character.Orientation.Down:
          if (this.sprite.currentSequence != "walkingDown") {
            this.sprite.gotoAndPlayLoop("walkingDown");
          }
          if (this.sprite.y >= 645 ) {
              this.backgroundGameWorld.addImpulse(0, backgroundTransitionSpeed * -1);
              this.foregroundGameWorld.addImpulse(0, backgroundTransitionSpeed * -1);
          } else {
            this.sprite.addImpulse(0, this.speed * speedModifier);
          }
          break;
        case Character.Orientation.Up:
          if (this.sprite.currentSequence != "walkingUp") {
            this.sprite.gotoAndPlayLoop("walkingUp");
          }
          if (this.sprite.y <= 125) {
              this.backgroundGameWorld.addImpulse(0, backgroundTransitionSpeed);
              this.foregroundGameWorld.addImpulse(0, backgroundTransitionSpeed);
          } else {
            this.sprite.addImpulse(0, (this.speed * speedModifier) * -1);
          }
          break;
      }
    }
  }; // end of walk function

  this.run = function() {
    this.walk(this.baseFrameRate * 2, this.speed * 1.1);
  }

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
}

Character.Types =  {
    Human : 0,
    Ghost : 1
};

Character.Orientation = {
  Right : 1,
  Left: 2,
  Up : 3,
  Down: 4
};

module.exports = Character;
