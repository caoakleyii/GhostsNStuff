var dataCreate = exports;

(function() {
  dataCreate.playerId = undefined;
  dataCreate.characterType = undefined;
  dataCreate.x = undefined;
  dataCreate.y = undefined;
})();

dataCreate.encode = function(){
  // msg [msgType(Create), playerId, characterType, x, y]
  var msg = [1, this.playerId, this.characterType, this.x, this.y];
  return msg;
}
