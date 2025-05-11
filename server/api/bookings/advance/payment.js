const db = useDatabase('mdbkn');

// function updateRoomStatus(roomID, status) {
//   const updateRoomStmt = db.prepare('UPDATE rooms SET roomStatus = ? WHERE id = ?');
//   updateRoomStmt.run(status, roomID);
// }
export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'GET') {
    const query = getQuery(event);
    const id = query.bookingId;
    const room_number = query.roomNumber;

    if (!id) {
      return { success: false, message: 'Booking ID is required, please try again' };
    }

    const { rows } = await db.sql`
      SELECT * FROM booking_payments 
      WHERE booking_id = ${id} AND room_number = ${room_number}
    `;

    return rows;
  }

  if (event.node.req.method === 'POST') {
    const { advanceAmount, bookingId, roomNumber, receiptNo, date } = await readBody(event);
    console.log('advanceAmount', advanceAmount, bookingId, roomNumber, receiptNo, date);
    const statement = db.prepare(`INSERT INTO booking_payments (advance_amount, booking_id, room_number, receipt_no, date) VALUES (?, ?, ?, ?, ?)`);
    const result = statement.run(advanceAmount, bookingId, roomNumber, receiptNo, date);
    return result.changes > 0 ? { success: true, message: 'Record inserted successfully' } : { success: false, message: 'Record not found or update failed' };
  }
  // Get the ID from the route parameter

  if (event.node.req.method === 'DELETE') {
    const statement = db.prepare(`DELETE FROM booking_payments WHERE id = ?`);
    const result = statement.run(id);

    if (result.changes > 0) {
      return { success: true, message: 'Record deleted successfully' };
    } else {
      return { success: false, message: 'Record not found or deletion failed' };
    }
  }

  return { success: false, message: 'Invalid request method' };
});
