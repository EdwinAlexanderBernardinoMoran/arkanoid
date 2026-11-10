function createPaddle( level ) {
  const { h, y } = CONFIG.paddle;
  const w = CONFIG.paddle.w - ( level - 1 ) * CONFIG.levels.paddleStep;
  return { x: ( CONFIG.width - w ) / 2, y, w, h };
}

function updatePaddle( paddle ) {
  const left = input.keys.ArrowLeft || input.keys.KeyA;
  const right = input.keys.ArrowRight || input.keys.KeyD;

  if ( left || right ) {
    if ( left ) paddle.x -= CONFIG.paddle.speed;
    if ( right ) paddle.x += CONFIG.paddle.speed;
    input.mouse.moved = false;
  } else if ( input.mouse.moved ) {
    paddle.x = input.mouse.x - paddle.w / 2;
    input.mouse.moved = false;
  }

  paddle.x = Math.max( 0, Math.min( CONFIG.width - paddle.w, paddle.x ) );
}

function drawPaddle( ctx, paddle ) {
  drawSprite( ctx, 'paddle', paddle.x, paddle.y, paddle.w, paddle.h );
}
