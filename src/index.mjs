import express from "express";
import cors from "cors";
import { existsSync, readFileSync, writeFileSync } from "fs";

// import { createDbConnection, getScore, insert, updateScore } from "./db.mjs";
import { moves, Scores } from "./constants.mjs";
import Board from "./board.mjs";

let finalEmptyCells = 0;

// init transportation table
const transportationTableFile = "data-store/transportation-table.json";
// const transportationTable = "transportation"
// let ttDb = await createDbConnection(transportationTableFile);
let transportationTable = new Map();
// if (existsSync(transportationTableFile)) {
//   transportationTable = new Map(JSON.parse(readFileSync(transportationTableFile)));
// } else {
//   transportationTable = new Map();
// }

function handleInterruption() {
  writeFileSync(
    transportationTableFile,
    JSON.stringify(Array.from(transportationTable.entries()))
  );
  // ttDb.close();
  process.exit(0);
}

process.on('SIGINT', handleInterruption);  // CTRL + C
process.on('SIGQUIT', handleInterruption);  // Keyboard Quit
process.on('SIGTERM', handleInterruption);  // `kill` command

const app = express();

app.use(cors({
  origin: true
}));

app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Server is listening on ${process.env.PORT}`);
});

app.use('/', (req, res, next) => {
  if (!req.query.state) {
    return res.status(400).send("Query param 'state' is missing!");
  }
  let board = [];
  let i= 0, state = req.query.state.split(",");

  for (let i = 0; i < 4; i++) {
    board[i] = [];
    for (let j = 0; j < 4; j++) {
      board[i].push(parseInt(state[4 * j + i]));
    }
  }
  // while (state.length) {
  //   board[i++] = state.splice(0, 4).map(Number);
  // }
  board = new Board(board);
  const bestMove = determineBestMove(board);
  if (!bestMove) {
    return res.send((parseInt(Math.random() * 10) % 4).toString());
  }
  return res.send(bestMove.toString());
});

/**
 * This function finds the best possible move for the given board
 * by speculating the game for the next few rounds.
 *
 * @param {Board} board
 * @returns {Number} the best move determined by the algorithm
 */
function determineBestMove(board) {
  let bestMove = null, bestScore = 0;
  let bRepr = board.board.toString();
  if (!transportationTable.has(bRepr)) {
    transportationTable.set(bRepr, [null, null, null, null]);
  }

  for (const move of moves) {
    let score = transportationTable.get(bRepr)[move];
    // let score = await getScore(ttDb, transportationTable, bRepr, move);
    if (!score && score !== 0) {
      score = calculateScore(board, move);
      transportationTable.get(bRepr)[move] = score;
      // updateScore(ttDb, transportationTable, bRepr, move, score);
    }
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
    // console.log(move, score);
  }
  finalEmptyCells = 0;

  return bestMove;
}

/**
 * To calculate the score for a given board and move.
 *
 * @param {Board} board the current game board
 * @param {Number} move the move to make
 */
function calculateScore(board, move) {
  let newBoard = new Board(board);
  newBoard.simulateMove(move);

  if (board.equals(newBoard)) {
    return 0;
  }
  // generate score for the new board, starting with a depth of 0
  // and, a max depth of 3.
  return generateScore(newBoard, 0, 3);
}

/**
 * To generate score for a given move on a game board.
 *
 * @param {Board} board the current game board
 * @param {Number} currentDepth current depth in the recursive tree
 * @param {Number} depthLimit maximum depth limit to explore
 * @returns {Number} the score for the given move on the board
 */
function generateScore(board, currentDepth, depthLimit) {
  if (currentDepth >= depthLimit) {
    return calculateFinalScore(board);
  }

  let totalScore = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board.board[i][j] !== 0) {
        continue;
      }
      // Simulate placing '2' or '4' in this cell
      let newBoard2 = board;
      newBoard2.board[i][j] = 2;
      let moveScore2 = calculateMoveScore(newBoard2, currentDepth, depthLimit);

      let newBoard4 = board;
      newBoard4.board[i][j] = 4;
      let moveScore4 = calculateMoveScore(newBoard4, currentDepth, depthLimit);

      // '2' has 90% chance of appearing and '4' has 10%.
      totalScore += 0.9 * moveScore2 + 0.1 * moveScore4;
    }
  }
  return totalScore;
}

/**
 * @param {Board} board
 */
function calculateMoveScore(board, currentDepth, depthLimit) {
  let bestScore = 0, bRepr = board.board.toString();
  if (!transportationTable.has(bRepr)) {
    transportationTable.set(bRepr, [null, null, null, null]);
  }

  for (const move of moves) {
    let score = transportationTable.get(bRepr)[move];
    // let score = await getScore(ttDb, transportationTable, bRepr, move);
    if (!score && score !== 0) {
      let newBoard = new Board(board);
      newBoard.simulateMove(move);

      if (!board.equals(newBoard)) {
        let score = generateScore(newBoard, currentDepth + 1, depthLimit);
        transportationTable.get(bRepr)[move] = score;
        // updateScore(ttDb, transportationTable, bRepr, move, score);
        bestScore = Math.max(score, bestScore);
      }
    } else {
      bestScore = Math.max(score, bestScore);
    }
  }
  return bestScore;
}

/**
 * Returns score on the moves and position of the game board
 * @param {Board} board the current game board
 */
function calculateFinalScore(board) {
  let score = 0, emptyCells = 0;

  for (let row = 0; row < board.n; row++) {
    score += Scores.FIXED;
    score += Scores.EMPTY * board.emptyCellsInRow(row);
    score += Scores.MERGES * board.rowMerges.get(row)[0];
    score -= Scores.SUM * board.sumInRow(row);
    // Handle monotonicity score
    score += Scores.MONOTONICITY * Math.max(board.leftMonotonicityInRow(row),
      board.rightMonotonicityInRow(row));

    emptyCells += board.emptyCellsInRow(row);
  }
  for (let col = 0; col < board.n; col++) {
    score += Scores.FIXED;
    score += Scores.EMPTY * board.emptyCellsInCol(col);
    score += Scores.MERGES * board.colMerges.get(col)[0];
    score -= Scores.SUM * board.sumInCol(col);
    // Handle monotonicity score
    score += Scores.MONOTONICITY * Math.max(board.leftMonotonicityInCol(col),
      board.rightMonotonicityInCol(col));
  }

  if (emptyCells > finalEmptyCells) {
    finalEmptyCells = emptyCells;
  }
  return score;
}