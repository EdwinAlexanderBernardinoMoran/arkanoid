function createBall() {
  return { x: 0, y: 0, vx: 0, vy: 0, size: CONFIG.ball.size };
}

function stickBall( ball, paddle ) {
  ball.x = paddle.x + ( paddle.w - ball.size ) / 2;
  ball.y = paddle.y - ball.size;
  ball.vx = 0;
  ball.vy = 0;
}

function launchBall( ball ) {
  const angle = 30 * Math.PI / 180;
  const dir = Math.random() < 0.5 ? -1 : 1;
  ball.vx = dir * CONFIG.ball.speed * Math.sin( angle );
  ball.vy = -CONFIG.ball.speed * Math.cos( angle );
}

function updateBall( ball ) {
  ball.x += ball.vx;
  ball.y += ball.vy;

  if ( ball.x < 0 ) {
    ball.x = 0;
    ball.vx = -ball.vx;
    playSound( 'bounce' );
  } else if ( ball.x + ball.size > CONFIG.width ) {
    ball.x = CONFIG.width - ball.size;
    ball.vx = -ball.vx;
    playSound( 'bounce' );
  }

  if ( ball.y < 0 ) {
    ball.y = 0;
    ball.vy = -ball.vy;
    playSound( 'bounce' );
  }
}

function bounceBallOnPaddle( ball, paddle ) {
  const overlaps = ball.x + ball.size > paddle.x && ball.x < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y && ball.y < paddle.y + paddle.h;
  if ( ball.vy <= 0 || !overlaps ) return;

  const ballCenter = ball.x + ball.size / 2;
  const paddleCenter = paddle.x + paddle.w / 2;
  const hit = Math.max( -1, Math.min( 1, ( ballCenter - paddleCenter ) / ( paddle.w / 2 ) ) );
  const angle = hit * CONFIG.ball.maxBounceAngle * Math.PI / 180;

  ball.vx = CONFIG.ball.speed * Math.sin( angle );
  ball.vy = -CONFIG.ball.speed * Math.cos( angle );
  ball.y = paddle.y - ball.size;
  playSound( 'bounce' );
}

function drawBall( ctx, ball ) {
  drawSprite( ctx, 'ball', ball.x, ball.y, ball.size, ball.size );
}
