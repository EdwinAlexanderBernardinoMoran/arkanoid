const SOUNDS = {
  bounce: new Audio( 'assets/sounds/ball-bounce.mp3' ),
  break: new Audio( 'assets/sounds/break-sound.mp3' ),
};

function playSound( name ) {
  const sound = SOUNDS[ name ];
  sound.currentTime = 0;
  const result = sound.play();
  result?.catch( () => {} );
}
