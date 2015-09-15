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
