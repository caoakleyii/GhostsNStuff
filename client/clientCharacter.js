ClientCharacter = function(){
  this.healthBar = new PIXI.Graphics();
  this.healthBar.beginFill(0xFF0000)
  this.healthBar.lineStyle(1, 0xFFFFFF);
  this.healthBar
  .drawRect(this.sprite.position.x - (this.sprite.width / 2 - 2),
  this.sprite.position.y - 15,
  (this.currentHP / this.totalHP) * 50,
  5);
  this.drawUpdate = function(){
    this.healthBar.position.x = this.sprite.position.x - (this.sprite.width / 2 - 2);
    this.healthBar.position.y = this.sprite.position.y - 15;
    this.width = (this.currentHP / this.totalHP) * 50;
  };
  this.client = true;
  this.backgroundGameWorld = undefined;
  this.foregroundGameWorld = undefined;

  this.worldX = function(){
    return this.sprite.x - this.backgroundGameWorld.x;
  };
  this.worldY = function(){
    return this.sprite.y - this.backgroundGameWorld.y;
  };

  this.clientWalk = function (frameRate, speedModifier) {
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
}


module.exports = ClientCharacter;
