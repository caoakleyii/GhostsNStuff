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
      return dataCreate;
    case this.MessageTypes.Update:
      dataUpdate.playerId = msg[1];
      dataUpdate.x = msg[2];
      dataUpdate.y = msg[3];
      return dataUpdate;
  }
};
