const db = useDatabase('mdbkn');

async function updateRoomStatus(roomID, status) {
  const updateRoomStmt = db.prepare('UPDATE rooms SET roomStatus = ? WHERE id = ?');
  await updateRoomStmt.run(status, roomID);
}

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'GET') {
    const bookingResult = await db.sql`
            SELECT 
                b.id,
                b.patientName,
                b.guestName,
                b.mobile,
                b.patientType,
                b.checkInTime,
                b.checkOutTime,
                b.booking_receipt_number,
                b.amenities,
                r.roomNumber,
                rc.name AS roomCategory,
                CASE 
                  WHEN b.patientType = 'cancer' THEN rc.patientRent
                  ELSE rc.normalRent
                END AS daily_rent,
                b.payment AS init_advance_payment,
                b.checkout_payment,
                CONCAT_WS(', ', b.village, b.tehsil, b.city, b.state) AS address
              FROM bookings b
              JOIN rooms r ON b.room = r.id
              JOIN room_category rc ON r.roomCategory = rc.id
            WHERE r.roomStatus = 'Available'
              AND b.checkOutTime IS NOT NULL
            ORDER BY b.id DESC
          `;

    const advancePaymentsResult = await db.sql`
              SELECT 
                booking_id,
                COALESCE(SUM(advance_amount), 0) AS advance_payment
              FROM booking_payments
              GROUP BY booking_id
            `;
    // Convert advance payments into a lookup map
    const advancePaymentsMap = {};
    advancePaymentsResult.rows.forEach((row) => {
      advancePaymentsMap[row.booking_id] = parseFloat(row.advance_payment);
    });
    // console.log('advancePaymentsMap', advancePaymentsResult);
    // 3. Process rows
    let allAdvance = 0;
    let allReceived = 0;
    let allTotalRent = 0;
    const rows = bookingResult.rows.map((row) => {
      const checkInDate = new Date(row.checkInTime);
      const checkOutDate = row.checkOutTime ? new Date(row.checkOutTime) : null;

      let effectiveCheckout = checkOutDate || new Date(); // Today if not checked out
      let totalDays = 1;

      // Check if check-in and check-out are the same date
      const isSameDay = checkInDate.toDateString() === effectiveCheckout.toDateString();

      if (isSameDay) {
        totalDays = 1;
      } else {
        // Strip time to midnight for diff
        const checkInMid = new Date(checkInDate);
        checkInMid.setHours(0, 0, 0, 0);

        const checkoutMid = new Date(effectiveCheckout);
        checkoutMid.setHours(0, 0, 0, 0);

        totalDays = Math.floor((checkoutMid - checkInMid) / (1000 * 60 * 60 * 24));

        // Add one more day if checkout time is after or at 12 PM
        if (effectiveCheckout.getHours() >= 12) {
          totalDays += 1;
        }
      }

      const totalRent = totalDays * row.daily_rent + parseFloat(row.amenities || 0);
      const advance1 = parseFloat(row.init_advance_payment || 0);
      const advance2 = advancePaymentsMap[row.id] || 0;
      console.log(advance1, advance2);
      const received = totalRent - (advance1 + advance2);

      allAdvance += !row.checkOutTime ? parseFloat(advance1) + parseFloat(advance2) : 0;
      allReceived += row.checkOutTime ? parseFloat(received) : 0;
      allTotalRent += parseFloat(totalRent);
      return {
        id: row.id,
        patientName: row.patientName,
        address: row.address,
        booking_receipt_number: parseInt(row.booking_receipt_number),
        daily_rent: row.daily_rent,
        mobile: row.mobile,
        guestName: row.guestName,
        checkInTime: row.checkInTime,
        checkOutTime: row.checkOutTime,
        roomNumber: row.roomNumber,
        checkoutPayment: parseFloat(row.checkout_payment),
        totalDays: totalDays,
        totalRent: totalRent,
        totalAdvance: advance1 + advance2,
        initAdvance: advance1,
        afterAdvance: advance2,
        payment: row.init_advance_payment,
        received: row.checkOutTime ? received : 0,
        amenities: parseFloat(row.amenities)
      };
    });

    return { rows };
  }

  if (event.node.req.method === 'POST') {
    const { checkOutTime, remark, payment, room, amenities, booking_receipt_number } = await readBody(event);
    const existingRecord = await db.prepare(`SELECT checkInTime, guestName, patientName, payment FROM bookings WHERE checkOutTime IS NULL AND room = ?`).get(room);
    console.log('Existing Record:', existingRecord);

    // let totalPayment = newPayment;
    const fields_room = parseInt(room, 10);
    if (existingRecord) {
      // Parse both payments as integers
      // const existingPayment = parseInt(existingRecord.payment, 10);
      // const additionalPayment = parseInt(newPayment, 10);

      // // Calculate total payment
      // totalPayment = existingPayment + additionalPayment;
      // console.log(totalPayment);

      try {
        // Prepare insert statement
        const statement = db.prepare(`
          UPDATE bookings
          SET checkOutTime = ?, remark = ?, checkout_payment = ?, room = ?, amenities = ?, booking_receipt_number = ?
          WHERE room = ? AND checkOutTime IS NULL
        `);
        const result = await statement.run(checkOutTime, remark, payment, room, amenities, booking_receipt_number, room);

        // const statement = db.prepare(
        //   `INSERT INTO bookings (checkInTime, guestName, patientName, checkOutTime, remark, checkout_payment, room, amenities, booking_receipt_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        // );

        // Insert data into the database
        // const result = await statement.run(
        //   existingRecord.checkInTime,
        //   existingRecord.guestName,
        //   existingRecord.patientName,
        //   checkOutTime,
        //   remark,
        //   payment,
        //   room,
        //   amenities,
        //   booking_receipt_number,
        //   room
        // );

        await updateRoomStatus(fields_room, 'Available');
        // console.log('Insert Result:', result);
        return result.success > 0 ? { success: true, message: 'Record updated successfully' } : { success: false, message: 'Update failed' };
      } catch (error) {
        console.error('Database Insert Error:', error);
        return { success: false, error: 'Something went wrong try again' };
      }
    }
    return { success: false, error: 'No record found' };
    // Return success response
  }
});
