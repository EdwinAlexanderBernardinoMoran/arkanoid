function createBlocks() {
  const { rows, cols, w, h, offsetX, offsetY } = CONFIG.blocks;
  const blocks = [];

  for ( let r = 0; r < rows; r++ ) {
    for ( let c = 0; c < cols; c++ ) {
      blocks.push( {
        x: offsetX + c * w,
        y: offsetY + r * h,
        w,
        h,
        color: CONFIG.rowColors[ r ],
        alive: true,
        exploding: false,
        explodeTick: 0,
      } );
    }
  }

  return blocks;
}

// Devuelve el bloque golpeado (o null). Un bloque por frame.
function collideBallBlocks( ball, blocks ) {
  for ( const block of blocks ) {
    if ( !block.alive ) continue;

    const overlapX = Math.min( ball.x + ball.size, block.x + block.w ) - Math.max( ball.x, block.x );
    const overlapY = Math.min( ball.y + ball.size, block.y + block.h ) - Math.max( ball.y, block.y );
    if ( overlapX <= 0 || overlapY <= 0 ) continue;

    if ( overlapX < overlapY ) ball.vx = -ball.vx;
    else ball.vy = -ball.vy;

    block.alive = false;
    block.exploding = true;
    block.explodeTick = 0;
    return block;
  }

  return null;
}

function drawBlocks( ctx, blocks ) {
  for ( const block of blocks ) {
    if ( !block.alive ) continue;
    drawSprite( ctx, 'block_' + block.color, block.x, block.y, block.w, block.h );
  }
}
