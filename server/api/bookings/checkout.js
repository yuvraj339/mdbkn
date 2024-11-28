const db = useDatabase('mdbkn');

async function updateRoomStatus(roomID, status) {
  const updateRoomStmt = db.prepare('UPDATE rooms SET roomStatus = ? WHERE id = ?');
  await updateRoomStmt.run(status, roomID);
}

export default defineEventHandler(async (event) => {
  // if (event.node.req.method === 'GET') {
  //   const { rows } = await db.sql`SELECT * FROM bookings`;

  //   return {
  //     rows
  //   };
  // }
  if (event.node.req.method === 'POST') {
    const { checkOutTime, remark, payment: newPayment, room, amenities } = await readBody(event);
    const existingRecord = await db.prepare(`SELECT payment FROM bookings WHERE checkOutTime IS NULL AND room = ?`).get(room);
    let totalPayment = newPayment;
    const fields_room = parseInt(room, 10);
    if (existingRecord) {
      // Parse both payments as integers
      const existingPayment = parseInt(existingRecord.payment, 10);
      const additionalPayment = parseInt(newPayment, 10);

      // Calculate total payment
      totalPayment = existingPayment + additionalPayment;
      console.log(totalPayment);
    }

    try {
      // Prepare insert statement
      const statement = db.prepare(`
        UPDATE bookings
        SET checkOutTime = ?, remark = ?, payment = ?, room = ?, amenities = ?
        WHERE room = ? AND checkOutTime IS NULL
      `);
      // const statement = db.prepare(`INSERT INTO bookings (checkOutTime, remark, payment, room) VALUES (?, ?, ?, ?)`);

      // Insert data into the database
      const result = await statement.run(checkOutTime, remark, totalPayment, room, amenities, room);
      await updateRoomStatus(fields_room, 'Available');
      // console.log('Insert Result:', result);
      return result.success > 0 ? { success: true, message: 'Record updated successfully' } : { success: false, message: 'Update failed' };
    } catch (error) {
      console.error('Database Insert Error:', error);
      return { success: false, error: error };
    }

    // Return success response
  }
});
