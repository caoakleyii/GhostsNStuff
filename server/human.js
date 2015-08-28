var character = require('../core/character');
module = module.exports =

Human = function() {
  this.type = character.Types.Human;
  character.call(this);
  this.x = 0;
  this.y = 0;
};
