PIXI.AnimatedSprite=function(sequences,frameRate,firstSequence){
  this.sequences=sequences;
  if(firstSequence==undefined){
    for(var key in sequences){
      this.currentSequence=key;
      break;
    }
  }
  else{
    this.currentSequence=firstSequence;
  }
  PIXI.Sprite.call(this,this.sequences[this.currentSequence][0]);
  this.anchor.x=this.anchor.y=.5;
  this.frameRate=frameRate||60;
  this.onComplete=null;
  this.currentFrame=0;
  this.previousFrame;
  this.playing=false;
  this.loop=false;
  this.isGravitational = true;
}
//animatedSprite
PIXI.AnimatedSprite.constructor = PIXI.AnimatedSprite;
PIXI.AnimatedSprite.prototype = Object.create(PIXI.Sprite.prototype);

PIXI.AnimatedSprite.prototype.gotoAndPlay=function(where){
  if(Object.prototype.toString.call(where)=='[object String]'){
    this.currentFrame=0;
    this.currentSequence=where;
  }
  else{
    this.currentFrame=where;
  }
  this.playing=true;
}

PIXI.AnimatedSprite.prototype.gotoAndStop=function(where){
  if(Object.prototype.toString.call(where)=='[object String]'){
    this.currentFrame=0;
    this.currentSequence=where;
  }
  else{
    this.currentFrame=where;
  }
  this.texture = (this.sequences[this.currentSequence][this.currentFrame]);
  this.playing=false;
}

PIXI.AnimatedSprite.prototype.play=function(){
  this.playing=true;
}

PIXI.AnimatedSprite.prototype.stop=function(){
  this.playing=false;
}

PIXI.AnimatedSprite.prototype.addImpulse = function (xForce, yForce){
  if (this.hitBox){
    var hitBoxPosition = new PIXI.Point(this.hitBox.x + xForce, this.position.y + yForce);
  }

  this.position = new PIXI.Point(this.position.x + xForce, this.position.y + yForce);

  // if (!Physics.isPointOutsideFrame(hitBoxPosition))
  // {
  //
  // }
}

PIXI.AnimatedSprite.prototype.updateHitBox = function()
{
  if(this.width > 0)
    this.hitBox.x = this.position.x - (this.width / 2);
  else if (this.width < 0)
    this.hitBox.x = this.position.x + (this.width / 2);

  this.hitBox.y = this.position.y - (this.height / 2);

};

PIXI.AnimatedSprite.prototype.advanceTime=function(dt){

  if(typeof dt=="undefined"){
    dt=1/60;
  }

  if(this.playing){
    this.currentFrame+=this.frameRate*dt;

    var constrainedFrame=Math.floor(Math.min(this.currentFrame, this.sequences[this.currentSequence].length-1));
    this.texture = (this.sequences[this.currentSequence][constrainedFrame]);

    if(this.currentFrame>=this.sequences[this.currentSequence].length){
      if(this.loop){
        this.gotoAndPlay(0);
      }
      else{
        this.stop();
      }
      if(this.onComplete){
        this.onComplete(this, this.currentSequence);
      }
    }
  }
}
