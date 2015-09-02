var Character = require('../core/character');

InputManager = function(character){
  this.character = character;
  this.onKeyDown();
  this.onKeyUp();
  this.keysDown = [];
};

InputManager.inputType = {
  Up : 0,
  Right : 1,
  Down : 2,
  Left : 3,
  Jump: 4,
  Sprint : 5,
  AutoAttack : 6,
  Skill1 : 7,
  Skill2 : 8,
  Skill3 : 9
};

InputManager.getInputType = function(key)
{
  switch(key)
  {
    case 39:
      return InputManager.inputType.Right;
    case 37:
      return InputManager.inputType.Left;
    case 38:
      return InputManager.inputType.Up;
    case 40:
      return InputManager.inputType.Down;
    case 32:
      return InputManager.inputType.Jump;
    case 16:
      return InputManager.inputType.Sprint;
    case 70:
      return InputManager.inputType.AutoAttack;
    case 65:
      return InputManager.inputType.Skill1;
    case 83:
      return InputManager.inputType.Skill2;
    case 68:
      return InputManager.inputType.Skill3;
  }
};



InputManager.prototype.readInput = function() {

    // this will allow the charcter to walk into the correct direction based on which key's are still down,
    // in conjuction with what key was last pressed.
    // TODO: still needs to be fixed
    if (InputManager.inputType.Right in this.keysDown) {
        this.character.orientation = Character.Orientation.Right;
    }

    if (InputManager.inputType.Left in this.keysDown) {
        this.character.orientation = Character.Orientation.Left;
    }

    if (InputManager.inputType.Down in this.keysDown) {
        this.character.orientation = Character.Orientation.Down;
    }

    if (InputManager.inputType.Up in this.keysDown) {
        this.character.orientation = Character.Orientation.Up;
    }


    if (InputManager.inputType.Skill1 in this.keysDown) {
      this.character.skill1();
    }

    if (this.character.state.isAttacking && !this.character.sprite.playing) {
      this.character.state.isAttacking = false;
    }

    if (this.walkingKeysDown()) {
      if (InputManager.inputType.Sprint in this.keysDown) {
        this.character.run();
      } else {
        this.character.walk();
      }
    }

    if(this.keysDown.every(isKeyDownEmpty)){
      this.character.idle();
    }
};

InputManager.prototype.onKeyDown = function() {
  var handler = this;

  $(document).keydown(function(e){

    // space and arrow keys
    // prevent them from scrolling the page
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }

    var input = InputManager.getInputType(e.keyCode);
    handler.keysDown[input] = true;


    // this will change the users direction on input
    if (InputManager.inputType.Right == input) {
        handler.character.orientation = Character.Orientation.Right;
    }

    if (InputManager.inputType.Left == input) {
        handler.character.orientation = Character.Orientation.Left;
    }

    if (InputManager.inputType.Down == input) {
        handler.character.orientation = Character.Orientation.Down;
    }

    if (InputManager.inputType.Up == input) {
        handler.character.orientation = Character.Orientation.Up;
    }

  });

}

InputManager.prototype.onKeyUp = function(){
  var handler = this;

  $(document).keyup(function(e) {
    var input = InputManager.getInputType(e.keyCode);
    delete handler.keysDown[input];
  });
}


function isKeyDownEmpty(element)
{
   return false;
}

InputManager.prototype.walkingKeysDown = function() {
  if (InputManager.inputType.Up in this.keysDown || InputManager.inputType.Down in this.keysDown
      || InputManager.inputType.Left in this.keysDown || InputManager.inputType.Right in this.keysDown) {
      return true;
    }
  return false;
}
