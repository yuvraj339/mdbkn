// import { defineEventHandler } from 'h3';
// import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  const db = useDatabase('mdbkn'); // Initialize your database

  // Set the path where you want to save the exported database
  const exportPath = 'backup.sqlite'; // Define the path for the backup

  try {
    // Path to the SQLite database file
    const dbPath = path.resolve('.data/db.sqlite'); // Adjust to your actual path
    console.log(dbPath, 'dbPath');
    // Check if the file exists
    if (!fs.existsSync(dbPath)) {
      return { success: false, message: 'Database file not found' };
    }

    // Read the database file
    const dbFile = fs.readFileSync(dbPath);

    // Set the response headers to force a download
    event.node.res.setHeader('Content-Type', 'application/octet-stream');
    event.node.res.setHeader('Content-Disposition', 'attachment; filename="database.sqlite"');

    // Send the file content as the response
    return 'success';
  } catch (error) {
    console.error('Error exporting database:', error);
    return {
      success: false,
      message: 'An error occurred while exporting the database'
    };
  }
});
