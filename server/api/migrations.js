export default defineEventHandler(async (event) => {
  const db = useDatabase('mdbkn');

  try {
    // Drop table if exists
    await db.sql`DROP TABLE IF EXISTS booking_payments`;

    // Create table
    await db.sql`
      CREATE TABLE IF NOT EXISTS booking_payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_number INTEGER,
        date TEXT,
        advance_amount INTEGER,
        receipt_no TEXT,
        booking_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    // Add column booking_receipt_number to booking_payments
    await db.sql`ALTER TABLE bookings ADD COLUMN booking_receipt_number TEXT;`;
    await db.sql`ALTER TABLE bookings ADD COLUMN checkout_payment TEXT;`;

    return { success: true, message: 'Migration completed and Column old_receipt_number and checkout_payment added successfully' };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

// CREATE TABLE IF NOT EXISTS expences (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           staffSalary INTEGER,
//           lightBill INTEGER,
//           waterBill INTEGER,
//           voucher TEXT,
//           extraExpenditure TEXT,
//           selectedDate TEXT,
//           paidBy TEXT,
//           amount INTEGER,
//           chequeNumber TEXT,
//           bankName TEXT,
//           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//         );
