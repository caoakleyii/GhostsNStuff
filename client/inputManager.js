InputManager = function(character){
  this.character = character;
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
    if (InputManager.inputType.Right in keysDown) {
      if (!this.character.state.isWalkingRight) {
        this.character.state.isWalkingRight = true;
        this.character.sprite.gotoAndPlay("walkingRight");
      }
      this.character.sprite.addImpulse(this.character.speed, 0);
    } else {
      this.character.state.isWalkingRight = false;
    }

    if (InputManager.inputType.Left in keysDown) {
      if (!this.character.state.isWalkingLeft) {
        this.character.state.isWalkingLeft = true;
        this.character.sprite.gotoAndPlay("walkingLeft");
      }
      this.character.sprite.addImpulse(this.character.speed * -1, 0);
    } else {
      this.character.state.isWalkingLeft = false;
    }

    if (InputManager.inputType.Down in keysDown) {
      if (!this.character.state.isWalkingDown) {
        this.character.state.isWalkingDown = true;
        this.character.sprite.gotoAndPlay("walkingDown");
      }
      this.character.sprite.addImpulse(0, this.character.speed);
    } else {
      this.character.state.isWalkingDown = false;
    }

    if (InputManager.inputType.Up in keysDown) {
      if (!this.character.state.isWalkingUp) {
        this.character.state.isWalkingUp = true;
        this.character.sprite.gotoAndPlay("walkingUp");
      }
      this.character.sprite.addImpulse(0, this.character.speed * -1);
    } else {
      this.character.state.isWalkingUp = false;
    }

    if(keysDown.every(isKeyDownEmpty)){
      if (!this.character.state.isIdling) {
        this.character.state.isIdling = true;
        this.character.sprite.gotoAndPlay("idling");
      }
    }
}

var keysDown = [];

function isKeyDownEmpty(element)
{
   return false;
}

$(document).keydown(function(e){

	// space and arrow keys
  // prevent them from scrolling the page
	if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
	  e.preventDefault();
  }

  var input = InputManager.getInputType(e.keyCode);
  keysDown[input] = true;

});

$(document).keyup(function(e) {
  var input = InputManager.getInputType(e.keyCode);
  delete keysDown[input];
});
