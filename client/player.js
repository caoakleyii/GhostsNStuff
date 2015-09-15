Player = function(character){
  this.character = character;
  if(character) {
    this.inputHandler = new InputManager(character);
  }
};
