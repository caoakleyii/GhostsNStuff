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
      dataCreate.characterType = msg[2];
      dataCreate.x = msg[3];
      dataCreate.y = msg[4];
      dataCreate.gameWorldX = msg[5];
      dataCreate.gameWorldY = msg[6];
      return dataCreate;
    case this.MessageTypes.Update:
      dataUpdate.playerId = msg[1];
      dataUpdate.x = msg[2];
      dataUpdate.y = msg[3];
      dataUpdate.currentSequence = msg[4];
      dataUpdate.keysDown = msg[5];
      dataUpdate.gameWorldX = msg[6];
      dataUpdate.gameWorldY = msg[7];
      return dataUpdate;
  }
};
