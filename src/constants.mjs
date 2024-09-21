const Move = Object.freeze({
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3
});

const moves = [ Move.UP, Move.RIGHT, Move.DOWN, Move.LEFT ];

const Scores = Object.freeze({
  FIXED: 10,
  EMPTY: 10,
  MERGES: 20,
  SUM: 5,
  MONOTONICITY: 30
});

export { Move, moves, Scores };