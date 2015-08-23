var dataUpdate = exports;
(function(){
  dataUpdate.playerId = undefined;
  dataUpdate.x = undefined;
  dataUpdate.y = undefined;
})();

dataUpdate.encode = function() {
  // [msgType, x, y]
  var msg = [2, this.playerId, this.x, this.y];
  this.playerId = undefined;
  this.x = undefined;
  this.y = undefined;
  return msg;
};
