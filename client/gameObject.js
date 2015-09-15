GameObject = function() {
  this.client = true;
  this.backgroundGameWorld = undefined;
  this.foregroundGameWorld = undefined;
  this.worldX = function(){
    return this.sprite.x - this.backgroundGameWorld.x;
  };
  this.worldY = function(){
    return this.sprite.y - this.backgroundGameWorld.y;
  };
};
