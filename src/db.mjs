
// import sqlite3 from "sqlite3";
// import { existsSync } from "fs";

// function createDbConnection(filepath) {
//   return new Promise((resolve, reject) => {
//     if (existsSync(filepath)) {
//       return new sqlite3.Database(filepath);
//     }
//     const db = new sqlite3.Database(filepath, (error) => {
//       if (error) {
//         return reject(error);
//       }
//       createTable(db);
//       return resolve(db);
//     });
//     // console.log("Connection with SQLite has been established for file ", filepath);
//     // return resolve(db);
//   });
// }

// function createTable(db) {
//   console.log("Create table");
  
//   db.exec(`
//     CREATE TABLE transportation
//     (
//       board VARCHAR(50) NOT NULL,
//       move  INTEGER NOT NULL,
//       score NUMERIC NOT NULL,
//       PRIMARY KEY (board, move)
//     );
//   `); 
//   db.exec(`CREATE  INDEX transportation_board_idx ON transportation(board)`);
// }

// function insert(db, table, cols, values) {
//   return new Promise((resolve, reject) => {
//     db.run(
//       `INSERT INTO ${table} (${cols}) VALUES (?, ?, ?)`,
//       values,
//       function (error) {
//         if (error) {
//           return reject(error);
//         }
//         return resolve();
//         // console.log(`Inserted a row with the ID: ${this.lastID}`);
//       }
//     );
//   });
// }

// function updateScore(db, table, board, move, score) {
//   return new Promise((resolve, reject) => {
//     let insertQuery = `INSERT INTO ${table} (board, move, score) VALUES ("${board}", ${move}, ${score})`;
//     let updateQuery = `UPDATE SET score = ${score} WHERE board = "${board}" AND move = ${move}`;
//     let sqlQuery = insertQuery +
//       ` ON CONFLICT (board, move) DO ` +  
//       updateQuery;
    
//     db.run(
//       sqlQuery,
//       function (error) {
//         if (error) {
//           return reject(error);
//         }
//         return resolve();
//         // console.log(`Row ${id} has been updated`);
//       }
//     );
//   });
// }

// function getScore(db, table, board, move) {
//   return new Promise((resolve, reject) => {
//     let query = `SELECT * FROM ${table} WHERE board = "${board}" AND move = ${move}`;

//     db.run(query, function (error, row) {
//       if (error) {
//         return reject(error);
//       }
//       if (row) {
//         return resolve(row.score);
//       }
//       return resolve(null);
//     });
//   });
// }

// export { createDbConnection, insert, updateScore, getScore };