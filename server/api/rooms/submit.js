// import { Database } from 'sqlite3';

// export default defineEventHandler(async (event) => {
//   const body = await readBody(event); // Get form data from the request body
//   const db = new Database('./database.sqlite'); // Open SQLite database
//   return new Promise((resolve, reject) => {
//     db.run(
//       'CREATE TABLE IF NOT EXISTS roomes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, position TEXT, office TEXT)',
//       (err) => {
//         if (err) return reject(err);

//         db.run(
//           'INSERT INTO roomes (name, position, office) VALUES (?, ?)',
//           [body.name, body.position, body.office],
//           function (err) {
//             if (err) return reject(err);

//             db.get(
//               'SELECT * FROM roomes WHERE id = ?',
//               [this.lastID],
//               (err, row) => {
//                 if (err) return reject(err);
//                 resolve(row); // Return the inserted data
//               }
//             );
//           }
//         );
//       }
//     );
//   });
// });
