function Game() {

  // Set the initial config.
  this.config = {
    gameWidth: 400,
    gameHeight: 300,
    fps: 50
  };


// All state is in the variables below.
  this.lives = 3;
  this.width = 0;
  this.height = 0;
  this.gameBound = {left: 0, top: 0, right: 0, bottom: 0};

//  The state stack.
  this.stateStack = [];

//  Input/output
  this.pressedKeys = {};
  this.gameCanvas =  null;
}
/* And this is where we'll put our JS. */
var container = document.getElementById('starfield');
var starfield = new Starfield();
starfield.initialise(container);
starfield.start();


Game.prototype.currentState = function() {
  return this.stateStack.length > 0 ? this.stateStack[this.stateStack.length - 1] : null
  Game.prototype.moveToState = function(state) {

    //  Are we already in a state?
    if (this.currentState()) {

      //  Before we pop the current state, see if the
      //  state has a leave function. If it does we can call it.
      if (this.currentState().leave) {
        this.currentState().leave(game);
      }

      this.stateStack.pop();
    }

    //  If there's an enter function for the new state, call it.
    if (state.enter) {
      state.enter(game);
    }

    //  Set the current state.
    this.stateStack.push(state);
  };
  Game.prototype.pushState = function(state) {

    //  If there's an enter function for the new state, call it.
    if(state.enter) {
      state.enter(game);
    }
    //  Set the current state.
    this.stateStack.push(state);
  };

  Game.prototype.popState = function() {

    //  Leave and pop the state.
    if(this.currentState()) {
      if(this.currentState().leave) {
        this.currentState().leave(game);
      }

      //  Set the current state.
      this.stateStack.pop();
    }
  };
  // The main loop.
  function gameLoop(game) {
    var currentState = game.currentState();
    if(currentState) {

      //  Delta t is the time to update/draw.
      var dt = 1 / game.config.fps;

      //  Get the drawing context.
      var ctx = game.gameCanvas.getContext("2d");

      //  Update if we have an update function. Also draw
      //  if we have a draw function.
      if(currentState.update) {
        currentState.update(game, dt);
      }
      if(currentState.draw) {
        currentState.draw(game, dt, ctx);
      }
    }
  } ;
  function WelcomeState() {
    WelcomeState.prototype.draw = function(game, dt, ctx) {

      //  Clear the background.
      ctx.clearRect(0, 0, game.width, game.height);

      ctx.font="30px Arial";
      ctx.fillStyle = '#ffffff';
      ctx.textBaseline="center";
      ctx.textAlign="center";
      ctx.fillText("Space Invaders", game.width / 2, game.height/2 - 40);
      ctx.font="16px Arial";

      ctx.fillText("Press 'Space' to start.", game.width / 2, game.height/2);
    };
    //  Inform the game a key is down.
    Game.prototype.keyDown = function(keyCode) {
      this.pressedKeys[keyCode] = true;
      //  Delegate to the current state too.
      if(this.currentState() && this.currentState().keyDown) {
        this.currentState().keyDown(this, keyCode);
      }
    };

//  Inform the game a key is up.
    Game.prototype.keyUp = function(keyCode) {
      delete this.pressedKeys[keyCode];
      //  Delegate to the current state too.
      if(this.currentState() && this.currentState().keyUp) {
        this.currentState().keyUp(this, keyCode);
      }
    };
    /  Create the starfield.
    var container = document.getElementById('starfield');
    var starfield = new Starfield();
    starfield.initialise(container);
    starfield.start();

//  Setup the canvas.
    var canvas = document.getElementById("gameCanvas");
    canvas.width = 800;
    canvas.height = 600;

//  Create the game.
    var game = new Game();

//  Initialise it with the game canvas.
    game.initialise(canvas);

//  Start the game.
    game.start();

//  Listen for keyboard events.
    window.addEventListener("keydown", function keydown(e) {
      var keycode = e.which || window.event.keycode;
      //  Supress further processing of left/right/space (37/29/32)
      if(keycode == 37 || keycode == 39 || keycode == 32) {
        e.preventDefault();
      }
      game.keyDown(keycode);
    });
    window.addEventListener("keyup", function keydown(e) {
      var keycode = e.which || window.event.keycode;
      game.keyUp(keycode);
    });


