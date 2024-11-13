import fs from 'fs';
import path from 'path';

const db = useDatabase('mdbkn');

function updateRoomStatus(roomID, status) {
  const updateRoomStmt = db.prepare('UPDATE rooms SET roomStatus = ? WHERE id = ?');
  updateRoomStmt.run(status, roomID);
}

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'GET') {
    const { rows } = await db.sql`SELECT * FROM bookings`;

    return {
      rows
    };
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
    //   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    //   FOREIGN KEY (room) REFERENCES rooms(id)
    // );`;
    const formData = await readMultipartFormData(event);

    let uploadPath = '';
    const fields = {};

    // Iterate over each field in formData
    if (formData) {
      for (const field of formData) {
        if (field.name === 'document' && field.type && field.type.startsWith('image/')) {
          // Process file upload
          const fileName = `${Date.now()}_${field.filename}`;
          uploadPath = path.join('assets', 'uploads', fileName);

          // Save file to assets/uploads folder
          fs.writeFileSync(uploadPath, field.data);
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
        patientName, hospital, wardNo, guestFName, hospitalRoomNumber, hospitalBedNumber, doctorName, remark
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        fields.remark || null
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
