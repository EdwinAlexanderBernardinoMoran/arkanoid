const input = {
  debug: false, // log en consola
  keys: {},
  pressed: {}, // true desde el keydown (sin repetición) hasta que un consumidor lo limpie
  mouse: { x: CONFIG.width / 2, y: 0, moved: false, clicked: false }, // moved / clicked: true hasta que un consumidor los limpie
};

const INPUT_KEYS = new Set( [ 'ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD', 'Space', 'KeyP', 'Escape' ] );

window.addEventListener( 'keydown', ( e ) => {
  if ( !INPUT_KEYS.has( e.code ) ) return;
  e.preventDefault();
  if ( !e.repeat ) input.pressed[ e.code ] = true;
  input.keys[ e.code ] = true;
  if ( input.debug ) console.log( 'keydown', e.code );
} );

window.addEventListener( 'keyup', ( e ) => {
  if ( !INPUT_KEYS.has( e.code ) ) return;
  input.keys[ e.code ] = false;
} );

window.addEventListener( 'mousemove', ( e ) => {
  const rect = document.getElementById( 'game' ).getBoundingClientRect();
  input.mouse.x = ( e.clientX - rect.left ) * ( CONFIG.width / rect.width );
  input.mouse.y = ( e.clientY - rect.top ) * ( CONFIG.height / rect.height );
  input.mouse.moved = true;
  if ( input.debug ) console.log( 'mouse', Math.round( input.mouse.x ), Math.round( input.mouse.y ) );
} );

window.addEventListener( 'mousedown', () => {
  input.mouse.clicked = true;
  if ( input.debug ) console.log( 'click' );
} );
