const canvas = document.getElementById( 'game' );
const ctx = canvas.getContext( '2d' );

const state = {
  status: 'ready',
  level: 1,
  score: 0,
  lives: CONFIG.lives,
  paddle: createPaddle(),
  ball: createBall(),
  blocks: createBlocks( 1 ),
};

function resetGame() {
  state.status = 'ready';
  state.level = 1;
  state.score = 0;
  state.lives = CONFIG.lives;
  state.paddle = createPaddle();
  state.ball = createBall();
  state.blocks = createBlocks( state.level );
}

function update() {
  const confirm = input.pressed.Space || input.mouse.clicked;
  const pause = input.pressed.KeyP || input.pressed.Escape;

  if ( state.status === 'gameover' || state.status === 'won' ) {
    updateFinishedGame( confirm );
  } else if ( state.status === 'paused' ) {
    updatePausedGame( pause );
  } else {
    updateActiveGame( confirm, pause );
  }

  input.pressed = {};
  input.mouse.clicked = false;
}

function updateFinishedGame( confirm ) {
  if ( confirm ) resetGame();
}

function updatePausedGame( pause ) {
  if ( pause ) state.status = 'playing';
}

function updateActiveGame( confirm, pause ) {
  updatePaddle( state.paddle );

  if ( state.status === 'ready' ) {
    updateReadyGame( confirm );
  } else if ( state.status === 'playing' ) {
    updatePlayingGame( pause );
  }
}

function updateReadyGame( confirm ) {
  stickBall( state.ball, state.paddle );
  updateBlocks( state.blocks );
  if ( confirm ) {
    launchBall( state.ball );
    state.status = 'playing';
  }
}

function updatePlayingGame( pause ) {
  if ( pause ) {
    state.status = 'paused';
    return;
  }

  updateBlocks( state.blocks );
  updateBall( state.ball );
  bounceBallOnPaddle( state.ball, state.paddle );
  if ( collideBallBlocks( state.ball, state.blocks ) ) state.score += CONFIG.pointsPerBlock;

  if ( state.blocks.every( ( b ) => !b.alive && !b.exploding ) ) {
    state.status = 'won';
  } else if ( state.ball.y > CONFIG.height ) {
    state.lives--;
    state.status = state.lives > 0 ? 'ready' : 'gameover';
  }
}

function drawHud() {
  ctx.fillStyle = '#fff';
  ctx.font = '20px monospace';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillText( 'Puntaje: ' + state.score, 16, 16 );
  const size = CONFIG.ball.size;
  const gap = 6;
  const livesWidth = state.lives * size + Math.max( state.lives - 1, 0 ) * gap;
  const livesX = CONFIG.width - 16 - livesWidth;
  ctx.textAlign = 'right';
  ctx.fillText( 'Vidas:', livesX - 10, 16 );
  for ( let i = 0; i < state.lives; i++ ) {
    drawSprite( ctx, 'ball', livesX + i * ( size + gap ), 16 + 3, size, size );
  }
}

function drawOverlay( title, subtitle ) {
  ctx.fillStyle = 'rgba( 0, 0, 0, 0.7 )';
  ctx.fillRect( 0, 0, CONFIG.width, CONFIG.height );
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '48px monospace';
  ctx.fillText( title, CONFIG.width / 2, CONFIG.height / 2 - 20 );
  if ( subtitle ) {
    ctx.font = '20px monospace';
    ctx.fillText( subtitle, CONFIG.width / 2, CONFIG.height / 2 + 30 );
  }
}

function draw() {
  ctx.fillStyle = '#222';
  ctx.fillRect( 0, 0, canvas.width, canvas.height );
  drawBlocks( ctx, state.blocks );
  drawPaddle( ctx, state.paddle );
  drawBall( ctx, state.ball );
  drawHud();

  if ( state.status === 'paused' ) drawOverlay( 'PAUSA', 'P o Esc para continuar' );
  else if ( state.status === 'gameover' ) drawOverlay( 'GAME OVER', 'Espacio o clic para reiniciar' );
  else if ( state.status === 'won' ) drawOverlay( 'VICTORIA', 'Espacio o clic para reiniciar' );
}

function loop() {
  update();
  draw();
  requestAnimationFrame( loop );
}

loadSpritesheet( () => {
  requestAnimationFrame( loop );
} );
