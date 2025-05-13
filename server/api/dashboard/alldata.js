export default defineEventHandler(async (event) => {
  const db = useDatabase('mdbkn');

  if (event.node.req.method === 'GET') {
    const query = getQuery(event);
    const { fromDate, toDate } = query;

    // const roomCategory = await db.sql`SELECT * FROM room_category`;
    const roomsResult = await db.sql`SELECT * FROM rooms`;
    const dueBalanceResult = await db.sql`SELECT 
                        b.id AS booking_id,
                        b.patientName,
                        b.guestName,
                        b.patientType,
                        b.checkInTime,
                        b.checkOutTime,
                        r.roomNumber,
                        rc.name AS roomCategory,
                        CASE 
                          WHEN b.patientType = 'cancer' THEN rc.patientRent
                          ELSE rc.normalRent
                        END AS daily_rent,
                        bp.advance_amount as advance_payment,
                        b.payment AS init_advance_payment
                      FROM bookings b
                      JOIN rooms r ON b.room = r.id
                      JOIN room_category rc ON r.roomCategory = rc.id
                      LEFT JOIN booking_payments bp 
                        ON b.id = bp.booking_id
                      WHERE b.checkOutTime IS NULL;`;

    const bookingsResult = await db.sql`SELECT * FROM bookings`;

    // Access the rows array from the result
    const bookings = bookingsResult.rows;
    const rooms = roomsResult.rows;

    //   const roomCategoryStmt = db.prepare('SELECT * FROM room_category');
    //   const roomsStmt = db.prepare('SELECT * FROM rooms');
    //   const bookingsStmt = db.prepare('SELECT * FROM bookings');

    //   const roomCategory = roomCategoryStmt.all();
    //   const rooms = roomsStmt.all();
    //   const bookings = bookingsStmt.all();
    // Calculating the summary data
    // console.log('Bookings data type:', typeof bookings);
    // console.log('Bookings data:', bookings);
    const currentBookingsCount = bookings.length;
    const roomDatabaseCount = rooms.length;
    const todayBookingsCount = bookings.filter((booking) => isToday(new Date(booking.checkInTime))).length;
    const roomBookedCount = bookings.filter((booking) => booking.room).length;
    const todayCheckoutsCount = bookings.filter((booking) => isToday(new Date(booking.checkOutTime))).length;

    const today = new Date();
    let totalDueAmount = 0;
    const dueBalance = dueBalanceResult.rows.map((row) => {
      const checkInDate = new Date(row.checkInTime);

      // Calculate days between check-in and today (inclusive of current day)
      const diffTime = today - checkInDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const totalRent = diffDays * row.daily_rent;
      const advance1 = parseFloat(row.init_advance_payment || 0);
      const advance2 = parseFloat(row.advance_payment || 0);

      const dueAmount = totalRent - advance1 - advance2;
      totalDueAmount += dueAmount;
      return {
        totalDays: diffDays,
        totalRent,
        totalAdvance: advance1 + advance2,
        dueAmount
      };
    });
    // const lastDueBalance = dueBalance.at(0);

    return {
      currentBookings: currentBookingsCount,
      roomDatabase: roomDatabaseCount,
      todayBookings: todayBookingsCount,
      roomBooked: roomBookedCount,
      todayCheckouts: todayCheckoutsCount,
      dueBalance: { dueAmount: totalDueAmount }
    };
  }
});

// Helper function to check if a date is today
function isToday(date) {
  const today = new Date();
  return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
}
