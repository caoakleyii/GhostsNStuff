$(document).ready(function() {
  var renderer = new PIXI.CanvasRenderer(1024, 768, { autoResize : true, backgroundColor : 0x000000 });

  $('#canvasDiv').append(renderer.view);

  var stage = new PIXI.Container();

  var player;

  PIXI.loader
      .add('assets/ghostIdle.json')
      .add('assets/ghostWalkingRight.json')
      .add('assets/ghostWalkingLeft.json')
      .load(onAssetsLoaded);

  function onAssetsLoaded(){
    player = new Player(new Ghost());
    stage.addChild(player.character.sprite);
    animate();
  }

  function animate() {
    player.character.sprite.advanceTime(1/60);
    player.inputHandler.readInput();
    renderer.render(stage);
    requestAnimationFrame(animate);
  }
});
