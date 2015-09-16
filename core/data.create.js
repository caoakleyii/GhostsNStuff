var dataCreate = exports;

(function() {
  dataCreate.playerId = undefined;
  dataCreate.playerName = undefined;
  dataCreate.characterType = undefined;
  dataCreate.x = undefined;
  dataCreate.y = undefined;
  dataCreate.gameWorldX = undefined;
  dataCreate.gameWorldY = undefined;
})();

dataCreate.encode = function(){
  // msg [msgType(Create), playerId, characterType, x, y]
  var msg = [1, this.playerId, this.playerName, this.characterType, this.x, this.y, this.gameWorldX, this.gameWorldY];

  this.playerId = undefined;
  this.playerName = undefined;
  this.characterType = undefined;
  this.x = undefined;
  this.y = undefined;
  this.gameWorldX = undefined;
  this.gameWorldY = undefined;
  return msg;
};
