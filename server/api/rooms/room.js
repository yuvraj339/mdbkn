export default defineEventHandler(async (event) => {
  const db = useDatabase('mdbkn');

  if (event.node.req.method === 'GET') {
    const { rows } = await db.sql`SELECT * FROM rooms`;

    return {
      rows
    };
  }

  if (event.node.req.method === 'POST') {
    // Create table
    // await db.sql`DROP TABLE IF EXISTS rooms`;
    // await db.sql`CREATE TABLE IF NOT EXISTS rooms (
    //                 id INTEGER PRIMARY KEY AUTOINCREMENT,
    //                 floorNumber INTEGER,
    //                 roomNumber INTEGER,
    //                 roomCategory INTEGER,
    //                 amenities TEXT,
    //                 guestCapacity INTEGER,
    //                 roomStatus TEXT,
    //                 remarks TEXT
    //                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    //                 FOREIGN KEY (roomCategory) REFERENCES room_category(id)
    //               );`;
    const { floorNumber, roomNumber, roomCategory, amenities, guestCapacity, roomStatus, remarks } = await readBody(event);

    const statement = db.prepare(`
          INSERT INTO rooms ('floorNumber','roomNumber','roomCategory','amenities','guestCapacity','roomStatus','remarks')
          VALUES (?, ?, ?, ?, ?, ?, ?)
          `);

    const result = statement.run(floorNumber, roomNumber, roomCategory, amenities, guestCapacity, roomStatus, remarks);

    return { success: true, id: result.lastInsertRowid };
  }
});
