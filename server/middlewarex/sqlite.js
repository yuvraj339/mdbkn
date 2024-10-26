// server-middleware/sqlite.js
import sqlite3 from 'sqlite3'; // or 'better-sqlite3' if using it

const db = new sqlite3.Database('path_to_your_db_file.db');

export default (req, res, next) => {
  db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INT, name TEXT)");

    // Example of inserting data
    db.run("INSERT INTO users (id, name) VALUES (1, 'John Doe')");

    // Query the data
    db.all("SELECT * FROM users", (err, rows) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(rows));
      }
    });
  });
};
