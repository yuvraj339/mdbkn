export default defineEventHandler(async (event) => {
  const db = useDatabase('mdbkn');

  if (event.node.req.method === 'GET') {
    const roomCategory = await db.sql`SELECT * FROM room_category`;
    const roomsResult = await db.sql`SELECT * FROM rooms`;
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
    const dueBalanceCount = bookings.filter((booking) => booking.payment > 0).length;

    return {
      currentBookings: currentBookingsCount,
      roomDatabase: roomDatabaseCount,
      todayBookings: todayBookingsCount,
      roomBooked: roomBookedCount,
      todayCheckouts: todayCheckoutsCount,
      dueBalance: dueBalanceCount
    };
  }
});

// Helper function to check if a date is today
function isToday(date) {
  const today = new Date();
  return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
}
