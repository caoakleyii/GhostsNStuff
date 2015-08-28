PIXI.Sprite.prototype.addImpulse = function (xForce, yForce){
  this.position = new PIXI.Point(this.position.x + xForce, this.position.y + yForce);
}
