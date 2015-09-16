Warrior = function() {

  this.skill1 = function() {
    // animate character
    this.swing();

    // use skill

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

}


Warrior.prototype.create = function(stage) {
  this.stage = stage;
  this.update();
};

Warrior.prototype.update = function() {

  requestAnimationFrame(this.update.bind(this));
};

Warrior.prototype.destroy = function() {
};
