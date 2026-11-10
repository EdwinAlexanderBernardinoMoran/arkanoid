// Cada fila tiene 10 caracteres. '.' = hueco.
// r = red, y = yellow, c = cyan, m = magenta, h = hotpink, g = green
const LEVEL_COLORS = {
  r: 'red',
  y: 'yellow',
  c: 'cyan',
  m: 'magenta',
  h: 'hotpink',
  g: 'green',
};

const LEVELS = [
  {
    name: 'Nivel 1',
    rows: [
      'rrrrrrrrrr',
      'yyyyyyyyyy',
      'cccccccccc',
      'mmmmmmmmmm',
      'hhhhhhhhhh',
      'gggggggggg',
    ],
  },
  {
    name: 'Nivel 2',
    rows: [
      'r.r.r.r.r.',
      '.y.y.y.y.y',
      'c.c.c.c.c.',
      '.m.m.m.m.m',
      'h.h.h.h.h.',
      '.g.g.g.g.g',
    ],
  },
  {
    name: 'Nivel 3',
    rows: [
      '....rr....',
      '...yyyy...',
      '..cccccc..',
      '.mmmmmmmm.',
      'hhhhhhhhhh',
    ],
  },
  {
    name: 'Nivel 4',
    rows: [
      'rrr....rrr',
      'yyy.mm.yyy',
      'ccc.mm.ccc',
      'mmm.mm.mmm',
      'hhh....hhh',
      'gggggggggg',
    ],
  },
  {
    name: 'Nivel 5',
    rows: [
      'rrrrrrrrrr',
      'y.yyyyyy.y',
      'cccccccccc',
      'm.mmmmmm.m',
      'hhhhhhhhhh',
      'g.gggggg.g',
      'rrrrrrrrrr',
      'y.y.yy.y.y',
    ],
  },
];
