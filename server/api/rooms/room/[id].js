export default defineEventHandler(async (event) => {
  const db = useDatabase('mdbkn');
  const id = event.context.params?.id;

  if (event.node.req.method === 'GET') {
    const { rows } = await db.sql`SELECT 
    room_category.name, 
    room_category.normalRent, 
    room_category.patientRent,
    bookings.payment, 
    bookings.id, 
    bookings.booking_receipt_number, 
    bookings.guestName, 
    bookings.state, 
    bookings.city, 
    bookings.tehsil, 
    bookings.village, 
    bookings.checkInTime, 
    bookings.checkOutTime,
    bookings.patientType
    FROM 
        rooms 
    JOIN 
        room_category 
    ON 
        room_category.id = rooms.roomCategory 
    JOIN 
        bookings
    ON 
        bookings.room = rooms.id
    WHERE 
        rooms.id = ${id} 
        AND bookings.room = ${id} 
        AND bookings.checkOutTime IS NULL;`;

    let booking_payments = null;
    if (rows.length >= 1) {
      booking_payments = await db.sql`SELECT COALESCE(SUM(bp.advance_amount), 0) AS advance_payment from booking_payments bp where bp.booking_id = ${rows[0].id};`;
    }
    if (booking_payments.rows.length >= 0) {
      return { rows: rows[0], advance_paid: booking_payments.rows[0].advance_payment };
    }
    return { rows, advance_paid: booking_payments };
    // on bookings.category == rooms.roomCategory // removed because he changing room category
  }
  // jagdish, 114 madanlal
  // 125 sultan guest name27th

  if (event.node.req.method === 'PUT' && id) {
    const { floorNumber, roomNumber, roomCategory, guestCapacity, roomStatus, amenities, remarks } = await readBody(event);

    const statement = db.prepare(`
      UPDATE rooms
      SET floorNumber = ?, roomNumber = ?, roomCategory = ?, guestCapacity = ?, roomStatus = ?, amenities = ?, remarks = ?
      WHERE id = ?
    `);

    const result = statement.run(floorNumber, roomNumber, roomCategory, guestCapacity, roomStatus, amenities, remarks, id);

    return result.changes > 0 ? { success: true, message: 'Record updated successfully' } : { success: false, message: 'Record not found or update failed' };
  }
  // Get the ID from the route parameter

  if (event.node.req.method === 'DELETE') {
    const statement = db.prepare(`DELETE FROM rooms WHERE id = ?`);
    const result = statement.run(id);

    if (result.changes > 0) {
      return { success: true, message: 'Record deleted successfully' };
    } else {
      return { success: false, message: 'Record not found or deletion failed' };
    }
  }

  return { success: false, message: 'Invalid request method' };
});
