export default defineEventHandler(async (event) => {
  //   const db = new Database("./path-to-your-database.db");
  const db = useDatabase('mdbkn');

  return new Promise((resolve, reject) => {
    // const statement = db.prepare(`ALTER TABLE expences ADD COLUMN amenities DEFAULT NULL`);
    // statement.run();
    db.sql`DROP TABLE IF EXISTS expences`;
    db.sql`
        CREATE TABLE IF NOT EXISTS expences (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          staffSalary INTEGER,
          lightBill INTEGER,
          waterBill INTEGER,
          voucher TEXT,
          extraExpenditure TEXT,
          selectedDate TEXT,
          paidBy TEXT,
          amount INTEGER,
          chequeNumber TEXT,
          bankName TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
  });
});
