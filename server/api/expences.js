export default defineEventHandler(async (event) => {
  const db = useDatabase('mdbkn');

  if (event.node.req.method === 'GET') {
    const { rows } = await db.sql`SELECT * from expences`;

    return {
      rows
    };
  }

  if (event.node.req.method === 'POST') {
    try {
      // Create table if it doesn't exist
      await db.sql`
        CREATE TABLE IF NOT EXISTS expences (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          staffSalary INTEGER,
          lightBill INTEGER,
          waterBill INTEGER,
          voucher TEXT,
          extraExpenditure TEXT,
          selectedDate TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      // Read body data
      const { selectedDate, staffSalary, lightBill, waterBill, voucher, extraExpenditure } = await readBody(event);

      // Insert data into the table
      const statement = db.prepare(`
        INSERT INTO expences (selectedDate, staffSalary, lightBill, waterBill, voucher, extraExpenditure)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      const result = statement.run(selectedDate, staffSalary, lightBill, waterBill, voucher, extraExpenditure);

      // Return success response
      return { success: true, id: result.lastInsertRowid };
    } catch (error) {
      // Handle errors
      return { success: false, error: error.message };
    }
  }
});
