function Physics(gameWorld) {
  this.gameWorld = gameWorld;
}

Physics.prototype.outOfRectangle = function(rectangle, position) {
  if (position.x >= (rectangle.x + rectangle.width) || position.x <= rectangle.x){
      return true;
  }

  if (position.y >= (rectangle.y + rectangle.height) || position.y < rectangle.y) {
    return true;
  }

  return false;
}

Physics.prototype.outOfGameWorld = function(position){
  if (position.x >= (this.gameWorld.width) || position.x <= 0){
      return true;
  }

  if (position.y >= (this.gameWorld.height) || position.y < 0) {
    return true;
  }

  return false;
}

module.exports = Physics;
