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
        const dueBalanceResult = await db.sql`
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
                          COALESCE(SUM(bp.advance_amount), 0) AS advance_payment,
                          b.payment AS init_advance_payment
                        FROM bookings b
                        JOIN rooms r ON b.room = r.id
                        JOIN room_category rc ON r.roomCategory = rc.id
                        LEFT JOIN booking_payments bp ON b.id = bp.booking_id
                        WHERE b.checkOutTime IS NULL
                        GROUP BY 
                          b.id, b.patientName, b.guestName, b.mobile, b.patientType, 
                          b.checkInTime, b.checkOutTime, r.roomNumber, rc.name, rc.patientRent, 
                          rc.normalRent, b.payment;
           `;
        const today = new Date();
        const rows = dueBalanceResult.rows.map((row) => {
          const checkInDate = new Date(row.checkInTime);

          // Calculate days between check-in and today (inclusive of current day)
          const diffTime = today - checkInDate;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          const totalRent = diffDays * row.daily_rent;
          const advance1 = parseFloat(row.init_advance_payment || 0);
          const advance2 = parseFloat(row.advance_payment || 0);

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
    // await db.sql`DROP TABLE IF EXISTS bookings`;
    // //   // Create table if it doesn't exist
    // await db.sql`CREATE TABLE IF NOT EXISTS bookings (
    //   id INTEGER PRIMARY KEY AUTOINCREMENT,
    //   patientType TEXT,
    //   bookingType TEXT,
    //   checkInTime TEXT,
    //   checkOutTime TEXT,
    //   category TEXT,
    //   room INTEGER,
    //   payment TEXT,
    //   mobile TEXT,
    //   guestName TEXT,
    //   patientGuestRelation TEXT,
    //   document TEXT,
    //   gender TEXT,
    //   caste TEXT,
    //   age INTEGER,
    //   state TEXT,
    //   city TEXT,
    //   tehsil TEXT,
    //   village TEXT,
    //   patientName TEXT,
    //   hospital TEXT,
    //   wardNo TEXT,
    //   guestFName TEXT,
    //   hospitalRoomNumber TEXT,
    //   hospitalBedNumber TEXT,
    //   doctorName TEXT,
    //   remark TEXT,
    //   amenities TEXT,
    //   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    //   FOREIGN KEY (room) REFERENCES rooms(id)
    // );`;
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
    // console.log('Parsed Fields:', fields);
    // console.log('Upload Path:', uploadPath);
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

      // console.log('Insert Result:', result);
      return { success: true, id: result.lastInsertRowid };
    } catch (error) {
      console.error('Database Insert Error:', error);
      return { success: false, error: error };
    }

    // Return success response
  }
});
