var character = require('../core/character');
module = module.exports =

Ghost = function() {
  this.type = character.Types.Ghost;
  character.call(this);
  this.x = 0;
  this.y = 0;
};
