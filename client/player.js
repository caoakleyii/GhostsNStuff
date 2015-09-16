Player = function(character){
  this.character = character;
  this.name = "";
  if(character) {
    this.inputHandler = new InputManager(character);
  }
};
