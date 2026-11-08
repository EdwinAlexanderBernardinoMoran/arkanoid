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
  } else if ( ball.x + ball.size > CONFIG.width ) {
    ball.x = CONFIG.width - ball.size;
    ball.vx = -ball.vx;
  }

  if ( ball.y < 0 ) {
    ball.y = 0;
    ball.vy = -ball.vy;
  }
}

function drawBall( ctx, ball ) {
  drawSprite( ctx, 'ball', ball.x, ball.y, ball.size, ball.size );
}
