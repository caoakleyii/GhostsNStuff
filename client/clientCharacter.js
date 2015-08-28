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
}


module.exports = ClientCharacter;
