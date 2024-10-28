export default defineEventHandler(async (event) => {
  const db = useDatabase('mdbkn')

  if (event.node.req.method === 'GET') {
    const { rows } = await db.sql`SELECT * FROM rooms`

    return {
      rows
    }
  }

  if (event.node.req.method === 'POST') {
    // Create table
    // await db.sql`DROP TABLE IF EXISTS room`;
    await db.sql`CREATE TABLE IF NOT EXISTS rooms (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    floorNumber INTEGER,
                    roomNumber INTEGER,
                    roomCategory TEXT,
                    bookedDate DATE,
                    isBooked BOOLEAN,
                    guestCapacity INTEGER,
                    roomStatus TEXT,
                    guestName TEXT,
                    remarks TEXT
                  );`

    const { floorNumber, roomNumber, roomCategory, bookedDate, isBooked, guestCapacity, roomStatus, guestName, remarks } = await readBody(event)

    const statement = db.prepare(`
          INSERT INTO rooms ('floorNumber','roomNumber','roomCategory','bookedDate','isBooked','guestCapacity','roomStatus','guestName','remarks')
          VALUES (?, ?, ?, ?, ?)
          `)

    const result = statement.run(floorNumber, roomNumber, roomCategory, bookedDate, isBooked, guestCapacity, roomStatus, guestName, remarks)

    return { success: true, id: result.lastInsertRowid }
  }
})
