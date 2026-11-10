const CONFIG = {
  width: 800,
  height: 600,
  paddle: { w: 128, h: 14, y: 560, speed: 8 }, // px/frame
  ball: { size: 16, speed: 6, maxBounceAngle: 60 }, // grados desde la vertical
  blocks: { rows: 6, cols: 10, w: 64, h: 32, offsetX: 80, offsetY: 80, explosionTicks: Math.round( EXPLOSION_DURATION / 1000 * 60 ) },
  rowColors: [ 'red', 'yellow', 'cyan', 'magenta', 'hotpink', 'green' ],
  levels: { speedStep: 0.5, paddleStep: 16 }, // incremento por nivel (px/frame y px)
  lives: 3,
  pointsPerBlock: 10,
};
