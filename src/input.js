const input = {
  debug: true, // log en consola; poner false al terminar de probar
  keys: {},
  mouse: { x: CONFIG.width / 2, y: 0 },
};

const INPUT_KEYS = new Set( [ 'ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD', 'Space', 'KeyP', 'Escape' ] );

window.addEventListener( 'keydown', ( e ) => {
  if ( !INPUT_KEYS.has( e.code ) ) return;
  e.preventDefault();
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
  if ( input.debug ) console.log( 'mouse', Math.round( input.mouse.x ), Math.round( input.mouse.y ) );
} );
