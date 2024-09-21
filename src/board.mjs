
import { Move } from "./constants.mjs";

class Board {
  constructor(board = null) {
    this.board = null;
    this.n = 0;
    this.rowMerges = new Map();
    this.colMerges = new Map();
    // this.emptyCellsInRow = new Map();
    // this.emptyCellsInCol = new Map();

    if (board) {
      if (!Array.isArray(board)) {
        board = board.board;
      }
      this.board = [];
      this.n = board.n || board.length;
      for (let i = 0; i < board.length; i++) {
        this.rowMerges.set(i, [ 0 ]);
        this.colMerges.set(i, [ 0 ]);
        // this.emptyCellsInRow.set(i, []);
        // this.emptyCellsInCol.set(i, []);
      }

      for (let i = 0; i < this.n; i++) {
        this.board[i] = [];
        for (let j = 0; j < this.n; j++) {
          this.board[i][j] = board[i][j];
        }
      }
    }
  }

  /**
   * Check if two boards are equal.
   *
   * @param {Board} otherBoard
   * @returns {Boolean} true if equal otherwise, false.
   */
  equals(otherBoard) {
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        if (this.board[i][j] !== otherBoard.board[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Simulate a 2048 game move.
   *
   * @param {Number} move the move to make
   */
  simulateMove(move) {
    // console.log(this.board);
    
    switch (move) {
      case Move.UP:
        for (let j = this.n - 1; j >= 0; j--) {
          let i = 0, availableSpace = i, sum;
          while (i < this.n - 1) {
            if (this.board[i][j] === 0) {
              // availableSpace = i;
              i++;
            }
            // find adjacent
            let k = i + 1;
            while (k < this.n) {
              if (this.board[k][j] !== 0) {
                break;
              }
              k++;
            }
            if (k === this.n) {
              sum = this.board[i][j];
              this.board[i][j] = 0;
              this.board[availableSpace][j] = sum;
              break;
            }
                // console.log(i, j, k);
                // console.log(this.board[i], this.board[k]);
            
            
            if (this.board[i][j] === this.board[k][j]) {
              sum = this.board[i][j] * 2;
              this.board[k][j] = 0;
              this.board[i][j] = 0;
              this.board[availableSpace][j] = sum;
              availableSpace += 1;
              i = k + 1;
              // counting merges
              this.colMerges.get(j)[0] = sum;
            } else {
              let temp1 = this.board[i][j], temp2 = this.board[k][j];
              this.board[i][j] = 0;
              this.board[k][j] = 0;
              this.board[availableSpace][j] = temp1;
              this.board[availableSpace + 1][j] = temp2;
              i = k + 1;
              availableSpace += 2;
            }
          }
        }
        break;
      case Move.RIGHT:
        for (let i = this.n - 1; i >= 0; i--) {
          let j = this.n - 1, availableSpace = j, sum;
          while (j > 0) {
            if (this.board[i][j] === 0) {
              // availableSpace = j;
              j--;
            }
            // find adjacent
            let k = j - 1;
            while (k >= 0) {
              if (this.board[i][k] !== 0) {
                break;
              }
              k--;
            }
            if (k < 0) {
              sum = this.board[i][j];
              this.board[i][j] = 0;
              this.board[i][availableSpace] = sum;
              break;
            }
            if (this.board[i][j] === this.board[i][k]) {
              sum = this.board[i][j] * 2;
              this.board[i][k] = 0;
              this.board[i][j] = 0;
              this.board[i][availableSpace] = sum;
              availableSpace -= 1;
              j = k - 1;
              // counting merges
              this.rowMerges.get(i)[0] = sum;
            } else {
              let temp1 = this.board[i][j], temp2 = this.board[i][k];
              this.board[i][k] = 0;
              this.board[i][j] = 0;
              this.board[i][availableSpace] = temp1;
              this.board[i][availableSpace - 1] = temp2;
              j = k - 1;
              availableSpace -= 2;
            }
          }
        }
        break;
      case Move.DOWN:
        for (let j = this.n - 1; j >= 0; j--) {
          let i = this.n - 1, availableSpace = i, sum;
          while (i > 0) {
            if (this.board[i][j] === 0) {
              // availableSpace = i;
              i--;
            }
            // find adjacent
            let k = i - 1;
            while (k >= 0) {
              if (this.board[k][j] !== 0) {
                break;
              }
              k--;
            }
            if (k < 0) {
              sum = this.board[i][j];
              this.board[i][j] = 0;
              this.board[availableSpace][j] = sum;
              break;
            }
            if (this.board[i][j] === this.board[k][j]) {
              sum = this.board[i][j] * 2;
              this.board[k][j] = 0;
              this.board[i][j] = 0;
              this.board[availableSpace][j] = sum;
              availableSpace -= 1;
              i = k - 1;
              // counting merges
              this.colMerges.get(j)[0] = sum;
            } else {
              let temp1 = this.board[i][j], temp2 = this.board[k][j];
              this.board[i][j] = 0;
              this.board[k][j] = 0;
              this.board[availableSpace][j] = temp1;
              this.board[availableSpace - 1][j] = temp2;
              i = k - 1;
              availableSpace -= 2;
            }
          }
        }
        break;
      case Move.LEFT:
        for (let i = this.n - 1; i >= 0; i--) {
          let j = 0, availableSpace = j, sum;
          while (j < this.n - 1) {
            if (this.board[i][j] === 0) {
              // availableSpace = j;  
              j++;
            }
            // find adjacent
            let k = j + 1;
            while (k < this.n) {
              if (this.board[i][k] !== 0) {
                break;
              }
              k++;
            }
            if (k === this.n) {
              sum = this.board[i][j];
              this.board[i][j] = 0;
              this.board[i][availableSpace] = sum;
              break;
            }
            if (this.board[i][j] === this.board[i][k]) {
              sum = this.board[i][j] * 2;
              this.board[i][k] = 0;
              this.board[i][j] = 0;
              this.board[i][availableSpace] = sum;
              availableSpace += 1;
              j = k + 1;
              // counting merges
              this.rowMerges.get(i)[0] = sum;
            } else {
              let temp1 = this.board[i][j], temp2 = this.board[i][k];
              this.board[i][k] = 0;
              this.board[i][j] = 0;
              this.board[i][availableSpace] = temp1;
              this.board[i][availableSpace + 1] = temp2;
              j = k + 1;
              availableSpace += 2;
            }
          }
        }
        break;
    }
  }

  emptyCellsInRow(row) {
    return this.board[row].filter(e => e).length;
  }

  emptyCellsInCol(col) {
    let count = 0;
    for (let row = 0; row < this.n; row++) {
      count += (this.board[row][col] === 0 ? 1 : 0);
    }
    return count;
  }

  sumInRow(row) {
    return this.board[row].reduce((a, e) => a + e, 0);
  }

  sumInCol(col) {
    let sum = 0;
    for (let row = 0; row < this.n; row++) {
      sum += this.board[row][col];
    }
    return sum;
  }

  leftMonotonicityInRow(row) {
    let monotonicity = 0;
    for (let col = 1; col < this.n; col++) {
      if (this.board[row][col] > this.board[row][col - 1]) {
        monotonicity += this.board[row][col] - this.board[row][col - 1];
      }
    }
    return monotonicity;
  }

  rightMonotonicityInRow(row) {
    let monotonicity = 0;
    for (let col = 1; col < this.n; col++) {
      if (this.board[row][col] < this.board[row][col - 1]) {
        monotonicity += this.board[row][col - 1] - this.board[row][col];
      }
    }
    return monotonicity;
  }

  leftMonotonicityInCol(col) {
    let monotonicity = 0;
    for (let row = 1; row < this.n; row++) {
      if (this.board[row][col] > this.board[row - 1][col]) {
        monotonicity += this.board[row][col] - this.board[row - 1][col];
      }
    }
    return monotonicity;
  }

  rightMonotonicityInCol(col) {
    let monotonicity = 0;
    for (let row = 1; row < this.n; row++) {
      if (this.board[row][col] < this.board[row - 1][col]) {
        monotonicity += this.board[row - 1][col] - this.board[row][col];
      }
    }
    return monotonicity;
  }
}

export default Board;