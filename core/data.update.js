var dataUpdate = exports;
(function(){
  dataUpdate.playerId = undefined;
  dataUpdate.x = undefined;
  dataUpdate.y = undefined;
  dataUpdate.currentSequence = undefined;
  dataUpdate.keysDown = undefined;
  dataUpdate.gameWorldX = undefined;
  dataUpdate.gameWorldY = undefined;
})();

dataUpdate.encode = function() {
  // [msgType, x, y]
  var msg = [2, this.playerId, this.x, this.y, this.currentSequence, this.keysDown, this.gameWorldX, this.gameWorldY];
  this.playerId = undefined;
  this.x = undefined;
  this.y = undefined;
  this.currentSequence = undefined;
  this.keysDown = undefined;
  this.gameWorldX = undefined;
  this.gameWorldY = undefined;
  return msg;
};
