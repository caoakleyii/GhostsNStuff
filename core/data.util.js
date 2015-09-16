var dataCreate = require('./data.create'),
    dataUpdate = require('./data.update');

var dataUtil = exports;


dataUtil.MessageTypes = {
  'Delete' : 0,
  'Create' : 1,
  'Update' : 2
};

dataUtil.decode  = function(msg){
  switch(msg[0]) {
    case this.MessageTypes.Delete:
      break;
    case this.MessageTypes.Create:
      // msg [msgType(Create), playerId, characterType, x, y]
      dataCreate.playerId = msg[1];
      dataCreate.playerName = msg[2];
      dataCreate.characterType = msg[3];
      dataCreate.x = msg[4];
      dataCreate.y = msg[5];
      dataCreate.gameWorldX = msg[6];
      dataCreate.gameWorldY = msg[7];
      return dataCreate;
    case this.MessageTypes.Update:
      dataUpdate.playerId = msg[1];
      dataUpdate.playerName = msg[2];
      dataUpdate.x = msg[3];
      dataUpdate.y = msg[4];
      dataUpdate.currentSequence = msg[5];
      dataUpdate.keysDown = msg[6];
      dataUpdate.gameWorldX = msg[7];
      dataUpdate.gameWorldY = msg[8];
      return dataUpdate;
  }
};
