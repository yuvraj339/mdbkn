export default defineEventHandler(async (event) => {
  const db = useDatabase('mdbkn');

  if (event.node.req.method === 'GET') {
    const { rows } = await db.sql`SELECT * FROM room_category`;

    return {
      rows
    };
  }

  if (event.node.req.method === 'POST') {
    // Create table
    // await db.sql`DROP TABLE IF EXISTS room_category`;
    await db.sql`CREATE TABLE IF NOT EXISTS room_category (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                facility TEXT,
                description TEXT,
                normalRent INTEGER,
                patientRent INTEGER
                );`;

    const { name, facility, description, normalRent, patientRent } = await readBody(event);

    const statement = db.prepare(`
        INSERT INTO room_category (name, facility, description, normalRent, patientRent)
        VALUES (?, ?, ?, ?, ?)
        `);

    const result = statement.run(name, facility, description, normalRent, patientRent);

    return { success: true, id: result.lastInsertRowid };
  }
});
