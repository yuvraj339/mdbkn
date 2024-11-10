// import { defineEventHandler } from 'h3';
// import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  try {
    // Path to the SQLite database file
    // const dbPath = path.resolve('.data/db.sqlite'); // Adjust to your actual path
    const dbPath = path.join(process.resourcesPath, 'resources', 'db.sqlite');

    // Check if the database file exists
    if (!fs.existsSync(dbPath)) {
      return { success: false, message: 'Database file not found' };
    }

    // Read the database file
    const dbFile = fs.readFileSync(dbPath);

    // Set response headers to force download
    event.node.res.setHeader('Content-Type', 'application/octet-stream');
    event.node.res.setHeader('Content-Disposition', 'attachment; filename="database.sqlite"');

    // Send the file content as the response
    event.node.res.end(dbFile);
  } catch (error) {
    console.error('Error exporting database:', error);
    return {
      success: false,
      message: 'An error occurred while exporting the database'
    };
  }
});
