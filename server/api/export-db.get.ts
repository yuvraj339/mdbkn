import { createReadStream } from 'fs';
import { join } from 'path';
import { H3Event, sendStream } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
  const dbPath = join(process.cwd(), '.data', 'db.sqlite3'); // Path to your SQLite database

  // Check if the file exists
  try {
    // Stream the file to the client
    const fileStream = createReadStream(dbPath);

    // Set response headers to indicate a file download
    const backupName = `db_backup_${new Date().toISOString()}.sqlite3`;
    event.node.res.setHeader('Content-Type', 'application/octet-stream');
    event.node.res.setHeader('Content-Disposition', `attachment; filename="${backupName}"`);

    return sendStream(event, fileStream);
  } catch (err) {
    throw createError({
      statusCode: 500,
      message: 'Failed to export database',
      data: err
    });
  }
});

// export default defineEventHandler((event) => {
//   const dbPath = join(process.cwd(), '.data', 'db.sqlite3'); // Path to your SQLite DB
//   const backupPath = join(process.cwd(), 'db_backup.sqlite3'); // Path for the backup file

//   // Copy the database to a backup file
//   return new Promise((resolve, reject) => {
//     const readStream = createReadStream(dbPath);

//     readStream.pipe(createReadStream(backupPath));
//     readStream.on('error', (err) => {
//       reject({ status: 500, message: 'Failed to export database', error: err });
//     });
//     readStream.on('close', () => {
//       resolve({ status: 200, message: 'Database exported successfully', path: backupPath });
//     });
//   });
// });
// export default defineEventHandler(async (event) => {
//   const dbPath = join(process.cwd(), '.data', 'db.sqlite3'); // Path to your SQLite DB
//   const backupName = `db_backup_${new Date().toISOString()}.sqlite3`;

//   // Return the SQLite file as a downloadable attachment
//   return sendFile(event, dbPath, 'db_backup.sqlite3');
// });
