import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Open a connection to the SQLite database
export const getConnection = async () => {
  return open({
    filename: './server/database.sqlite',
    driver: sqlite3.Database
  });
};
