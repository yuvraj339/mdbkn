import fs from 'fs';
import path from 'path';

const db = useDatabase('mdbkn');

function updateRoomStatus(roomID, status) {
  const updateRoomStmt = db.prepare('UPDATE rooms SET roomStatus = ? WHERE id = ?');
  updateRoomStmt.run(status, roomID);
}

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'GET') {
    const query = getQuery(event);
    const { fromDate, toDate, status, type } = query;

    try {
      // 1. Rooms that are booked and still occupied
      if (type === 'roomBooked') {
        const { rows } = await db.sql`
          SELECT bookings.*, rooms.roomNumber, rooms.roomStatus 
          FROM bookings 
          JOIN rooms ON bookings.room = rooms.id 
          WHERE rooms.roomStatus = 'Unavailable'
            AND bookings.checkOutTime IS NULL
          ORDER BY rooms.roomNumber ASC
        `;
        return { rows };
      }

      // 2. Current Bookings
      if (type === 'currentBookings') {
        if (status === 'Available') {
          const { rows } = await db.sql`
            SELECT bookings.*, rooms.roomNumber, rooms.roomStatus 
            FROM bookings 
            JOIN rooms ON bookings.room = rooms.id 
            WHERE DATE(bookings.checkOutTime) >= ${fromDate} 
              AND DATE(bookings.checkOutTime) <= ${toDate}
              AND rooms.roomStatus = 'Available'
              AND bookings.checkOutTime IS NOT NULL
            ORDER BY rooms.roomNumber ASC
          `;
          return { rows };
        } else if (status === 'Unavailable') {
          const { rows } = await db.sql`
            SELECT bookings.*, rooms.roomNumber, rooms.roomStatus 
            FROM bookings 
            JOIN rooms ON bookings.room = rooms.id 
            WHERE DATE(bookings.checkInTime) >= ${fromDate} 
              AND DATE(bookings.checkInTime) <= ${toDate}
              AND rooms.roomStatus = 'Unavailable'
              AND bookings.checkOutTime IS NULL
            ORDER BY rooms.roomNumber ASC
          `;
          return { rows };
        } else {
          const { rows } = await db.sql`
            SELECT bookings.*, rooms.roomNumber, rooms.roomStatus 
            FROM bookings 
            JOIN rooms ON bookings.room = rooms.id 
            WHERE (
                  (DATE(bookings.checkInTime) >= ${fromDate} AND DATE(bookings.checkInTime) <= ${toDate})
                  OR 
                  (DATE(bookings.checkOutTime) >= ${fromDate} AND DATE(bookings.checkOutTime) <= ${toDate})
              )
            ORDER BY rooms.roomNumber ASC
          `;
          return { rows };
        }
      }

      // 4. due Balance
      if (type === 'dueBalance') {
        const bookingResult = await db.sql`
              SELECT 
                b.id,
                b.patientName,
                b.guestName,
                b.mobile,
                b.patientType,
                b.checkInTime,
                b.checkOutTime,
                r.roomNumber,
                rc.name AS roomCategory,
                CASE 
                  WHEN b.patientType = 'cancer' THEN rc.patientRent
                  ELSE rc.normalRent
                END AS daily_rent,
                b.payment AS init_advance_payment
              FROM bookings b
              JOIN rooms r ON b.room = r.id
              JOIN room_category rc ON r.roomCategory = rc.id
              WHERE b.checkOutTime IS NULL
            `;
        // const bookingIds = bookingResult.rows.map((row) => row.id);
        // if (bookingIds.length === 0) {
        //   return { rows: [] };
        // }
        // const mappedBookingIds = bookingIds.map((id) => id).join(',');
        // 2. Get advance payments for all bookings
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
        // 3. Process rows
        const today = new Date();
        const rows = bookingResult.rows.map((row) => {
          const checkInDate = new Date(row.checkInTime);
          const diffTime = today - checkInDate;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          const totalRent = diffDays * row.daily_rent;
          const advance1 = parseFloat(row.init_advance_payment || 0);
          const advance2 = advancePaymentsMap[row.id] || 0;

          const payment = totalRent - advance1 - advance2;

          return {
            id: row.id,
            patientName: row.patientName,
            daily_rent: row.daily_rent,
            mobile: row.mobile,
            guestName: row.guestName,
            checkInTime: row.checkInTime,
            roomNumber: row.roomNumber,
            totalDays: diffDays,
            totalRent,
            totalAdvance: advance1 + advance2,
            payment
          };
        });

        return { rows };
      }

      if (type === 'cashBook') {
        let bookingResult = null;
        if (status === 'Available') {
          bookingResult = await db.sql`
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
            WHERE DATE(b.checkOutTime) >= ${fromDate} 
              AND DATE(b.checkOutTime) <= ${toDate}
              AND r.roomStatus = 'Available'
              AND b.checkOutTime IS NOT NULL
            ORDER BY r.roomNumber ASC
          `;
        } else if (status === 'Unavailable') {
          bookingResult = await db.sql`
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
            WHERE DATE(b.checkInTime) >= ${fromDate} 
              AND DATE(b.checkInTime) <= ${toDate}
              AND r.roomStatus = 'Unavailable'
              AND b.checkOutTime IS NULL
            ORDER BY r.roomNumber ASC
          `;
        } else if (status === 'advance') {
          bookingResult = await db.sql`
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
                            LEFT JOIN (
                              SELECT DISTINCT booking_id
                              FROM booking_payments
                              WHERE strftime('%Y-%m-%d', date) BETWEEN ${fromDate} AND ${toDate}
                            ) ap ON ap.booking_id = b.id
                            WHERE (
                                DATE(b.checkInTime) BETWEEN ${fromDate} AND ${toDate}
                                OR ap.booking_id IS NOT NULL
                              )
                              AND r.roomStatus = 'Unavailable'
                              AND b.checkOutTime IS NULL
                            ORDER BY r.roomNumber ASC
                          `;
          // return { rows: bookingResult.rows };
        } else if (status === 'dayBook') {
          bookingResult = await db.sql`
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
                            LEFT JOIN (
                              SELECT DISTINCT booking_id
                              FROM booking_payments
                              WHERE DATE(date) BETWEEN ${fromDate} AND ${toDate}
                            ) ap ON ap.booking_id = b.id
                            WHERE (
                                DATE(b.checkInTime) BETWEEN ${fromDate} AND ${toDate}
                                OR DATE(b.checkOutTime) BETWEEN ${fromDate} AND ${toDate}
                                OR ap.booking_id IS NOT NULL
                            )
                            ORDER BY r.roomNumber ASC
                          `;
        } else {
          bookingResult = await db.sql`
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
            WHERE (
                  (DATE(b.checkInTime) >= ${fromDate} AND DATE(b.checkInTime) <= ${toDate})
                  OR 
                  (DATE(b.checkOutTime) >= ${fromDate} AND DATE(b.checkOutTime) <= ${toDate})
              )
            ORDER BY r.roomNumber ASC
          `;
        }
        let advancePaymentsResult = null;
        if (status === 'advance' || status == 'dayBook') {
          advancePaymentsResult = await db.sql`
                SELECT
                  booking_id,
                  COALESCE(SUM(advance_amount), 0) AS advance_payment,
                  advance_amount AS today_advance,
                  date
                FROM booking_payments
                WHERE DATE(date) >= ${fromDate}
                AND DATE(date) <= ${toDate}
                GROUP BY booking_id
              `;
        } else {
          advancePaymentsResult = await db.sql`
              SELECT 
                booking_id,
                advance_amount AS today_advance,
                date,
                COALESCE(SUM(advance_amount), 0) AS advance_payment
              FROM booking_payments
              GROUP BY booking_id 
            `;
        }

        // Convert advance payments into a lookup map
        let todayAdvance = {};
        const advancePaymentsMap = {};
        advancePaymentsResult.rows.forEach((row) => {
          advancePaymentsMap[row.booking_id] = parseFloat(row.advance_payment);
          todayAdvance[row.booking_id] = parseFloat(row.today_advance);
        });
        // 3. Process rows
        let allAdvance = 0;
        let allReceived = 0;
        let allTotalRent = 0;
        const today = new Date();
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
          const today_advance = todayAdvance[row.id] || 0;
          const received = totalRent - (advance1 + advance2);

          if (status == 'dayBook') {
            const checkInDate1 = new Date(row.checkInTime).toISOString().slice(0, 10); // Format to YYYY-MM-DD
            const CheckingMatch = checkInDate1 === fromDate || checkInDate1 === toDate;

            if (CheckingMatch) {
              allAdvance += parseFloat(advance1);
            }
            if (parseFloat(advance2) > 0) {
              allAdvance += parseFloat(advance2);
            }
          } else {
            allAdvance += !row.checkOutTime ? parseFloat(advance1) + parseFloat(advance2) : 0;
          }

          allTotalRent += parseFloat(totalRent);
          allReceived += row.checkOutTime ? parseFloat(received) : 0;

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
            amenities: parseFloat(row.amenities),
            todayAdvance: today_advance
          };
        });

        return { rows, other: { allAdvance, allReceived, allTotalRent } };
      }
      // 5. Default - return all bookings
      const { rows } = await db.sql`
          SELECT bookings.*, rooms.roomNumber, rooms.roomStatus
          FROM bookings 
          JOIN rooms ON bookings.room = rooms.id 
          ORDER BY bookings.created_at DESC
      `;
      return { rows };
    } catch (err) {
      return {
        status: 500,
        message: 'Error fetching bookings.',
        error: err.message
      };
    }
  }
  if (event.node.req.method === 'POST') {
    const formData = await readMultipartFormData(event);

    let uploadPath = '';
    const fields = {};

    // Iterate over each field in formData
    if (formData) {
      for (const field of formData) {
        if (field.name === 'document' && field.type && field.type === 'application/pdf') {
          // Process file upload
          const fileName = `${Date.now()}_${field.filename}`;
          uploadPath = path.join('public', 'uploads', fileName);

          // Save file to assets/uploads folder
          fs.writeFileSync(uploadPath, field.data);
          uploadPath = path.join('\\', 'uploads', fileName);
        } else {
          // Collect other fields into the fields object
          fields[field.name] = field.data.toString(); // Convert Buffer to string
        }
      }
    }
    // Convert fields with integer types
    fields.room = parseInt(fields.room, 10);
    fields.age = parseInt(fields.age, 10);

    updateRoomStatus(fields.room, 'Unavailable');

    // Log fields and upload path to confirm data parsing
    try {
      // Prepare insert statement
      const statement = db.prepare(`
      INSERT INTO bookings (
        patientType, bookingType, checkInTime, category, room, payment, mobile,
        guestName, patientGuestRelation, document, gender, caste, age, state, city,tehsil,village,
        patientName, hospital, wardNo, guestFName, hospitalRoomNumber, hospitalBedNumber, doctorName, remark, amenities, booking_receipt_number
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

      // Insert data into the database
      const result = await statement.run(
        fields.patientType || null,
        fields.bookingType || null,
        fields.checkInTime || null,
        // fields.checkOutTime || null,
        fields.category || null,
        fields.room || null,
        fields.payment || null,
        fields.mobile || null,
        fields.guestName || null,
        fields.patientGuestRelation || null,
        uploadPath, // Store the path in the document field
        fields.gender || null,
        fields.caste || null,
        fields.age || null,
        fields.state || null,
        fields.city || null,
        fields.tehsil || null,
        fields.village || null,
        fields.patientName || null,
        fields.hospital || null,
        fields.wardNo || null,
        fields.guestFName || null,
        fields.hospitalRoomNumber || null,
        fields.hospitalBedNumber || null,
        fields.doctorName || null,
        fields.remark || null,
        fields.amenities || null,
        fields.booking_receipt_number || null
      );

      return { success: true, id: result.lastInsertRowid };
    } catch (error) {
      console.error('Database Insert Error:', error);
      return { success: false, error: error };
    }

    // Return success response
  }
});
