const db = useDatabase('mdbkn');

function updateRoomStatus(roomID, status) {
  const updateRoomStmt = db.prepare('UPDATE rooms SET roomStatus = ? WHERE id = ?');
  updateRoomStmt.run(status, roomID);
}

export default defineEventHandler(async (event) => {
  // if (event.node.req.method === 'GET') {
  //   const { rows } = await db.sql`SELECT * FROM bookings`;

  //   return {
  //     rows
  //   };
  // }
  if (event.node.req.method === 'POST') {
    const { checkOutTime, remark, payment, room } = await readBody(event);

    // Convert fields with integer types
    fields_room = parseInt(room, 10);
    updateRoomStatus(fields_room, 'Available');

    try {
      // Prepare insert statement
      const statement = db.prepare(`
        UPDATE bookings
        SET checkOutTime = ?, remark = ?, payment = ?, room = ?
        WHERE id = ?
      `);
      // const statement = db.prepare(`INSERT INTO bookings (checkOutTime, remark, payment, room) VALUES (?, ?, ?, ?)`);

      // Insert data into the database
      const result = await statement.run(checkOutTime, remark, payment, room);

      // console.log('Insert Result:', result);
      return result.success > 0 ? { success: true, message: 'Record updated successfully' } : { success: false, message: 'Update failed' };
    } catch (error) {
      console.error('Database Insert Error:', error);
      return { success: false, error: error };
    }

    // Return success response
  }
});
