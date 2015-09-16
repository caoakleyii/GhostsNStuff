Mage = function() {

  this.skill1 = function() {
    // animate character
    this.swing();

    // use skill
    this.castFireball();
  };

  this.skill2 = function() {
    // animate character
    this.swing();

    // use skill
  }

  this.skill3 = function() {
    // animate character
    this.swing();

    // use skill
  }

  this.skill4 = function() {
    // animate character
    this.swing();

    // use skill
  }

  this.skill5 = function() {
    // animate character
    this.swing();

    // use skill
  }

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


Mage.prototype.create = function(stage) {
  this.stage = stage;
  this.stage.addChild(this.sprite);
  this.stage.addChild(this.healthBar);
  this.update();
};

Mage.prototype.update = function() {

  // advance animation
  this.sprite.advanceTime(1/60);

  // keep health bar above character
  this.healthBar.position.x = this.sprite.position.x - (this.sprite.width / 2 - 2);
  this.healthBar.position.y = this.sprite.position.y - 15;
  this.width = (this.currentHP / this.totalHP) * 50;

  requestAnimationFrame(this.update.bind(this));
};

Mage.prototype.destroy = function() {
  this.stage.removeChild(this.sprite);
  this.stage.removeChild(this.healthBar);
};
