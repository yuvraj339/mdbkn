// import { getConnection } from './db.js';

// (async () => {
//   const db = await getConnection();

//   // Create a table for records if it doesn't exist
//   await db.exec(`
//     CREATE TABLE IF NOT EXISTS records (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT NOT NULL,
//       email TEXT NOT NULL
//     );
//   `);

//   await db.close();
// })();
// //
