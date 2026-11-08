const canvas = document.getElementById( 'game' );
const ctx = canvas.getContext( '2d' );

const state = {
  status: 'ready',
  paddle: createPaddle(),
  ball: createBall(),
};

function update() {
  updatePaddle( state.paddle );

  if ( state.status === 'ready' ) {
    stickBall( state.ball, state.paddle );
    if ( input.keys.Space || input.mouse.clicked ) {
      launchBall( state.ball );
      state.status = 'playing';
    }
  } else if ( state.status === 'playing' ) {
    updateBall( state.ball );
    bounceBallOnPaddle( state.ball, state.paddle );
  }

  input.mouse.clicked = false;
}

function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect( 0, 0, canvas.width, canvas.height );
  drawPaddle( ctx, state.paddle );
  drawBall( ctx, state.ball );
}

function loop() {
  update();
  draw();
  requestAnimationFrame( loop );
}

loadSpritesheet( () => {
  requestAnimationFrame( loop );
} );
