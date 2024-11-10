import fs from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  const db = useDatabase('mdbkn');
  const id = event.context.params?.id;

  if (event.node.req.method === 'POST' && id) {
    const formData = await readMultipartFormData(event);

    let uploadPath = '';
    const fields = {};
    // console.log('fff: ', formData);

    // Iterate over each field in formData
    if (formData) {
      for (const field of formData) {
        if (field.name === 'document' && field.type && field.type.startsWith('image/')) {
          const fileName = `${Date.now()}_${field.filename}`;
          uploadPath = path.join('assets', 'uploads', fileName);
          fs.writeFileSync(uploadPath, field.data);
        } else {
          const value = field.data.toString();
          // Convert 'null' string to actual null value
          fields[field.name] = value === 'null' ? null : value;
        }
      }
    }

    // Convert fields with integer types
    fields.room = fields.room ? parseInt(fields.room, 10) : null;
    fields.age = fields.age ? parseInt(fields.age, 10) : null;

    // Retrieve existing record to preserve values for missing fields
    const existingRecord = await db.prepare(`SELECT * FROM bookings WHERE id = ?`).get(id);

    // Check if the record exists
    if (!existingRecord) {
      return { success: false, message: 'Record not found' };
    }

    // Use existing values for fields that were not provided in formData
    const updatedFields = {
      patientType: fields.patientType || existingRecord.patientType,
      bookingType: fields.bookingType || existingRecord.bookingType,
      checkInTime: fields.checkInTime || existingRecord.checkInTime,
      checkOutTime: fields.checkOutTime || existingRecord.checkOutTime,
      category: fields.category || existingRecord.category,
      room: fields.room !== null ? fields.room : existingRecord.room,
      payment: fields.payment || existingRecord.payment,
      mobile: fields.mobile || existingRecord.mobile,
      guestName: fields.guestName || existingRecord.guestName,
      patientGuestRelation: fields.patientGuestRelation || existingRecord.patientGuestRelation,
      document: uploadPath || existingRecord.document, // Use new path if file uploaded
      gender: fields.gender || existingRecord.gender,
      caste: fields.caste || existingRecord.caste,
      age: fields.age !== null ? fields.age : existingRecord.age,
      state: fields.state || existingRecord.state,
      city: fields.city || existingRecord.city,
      patientName: fields.patientName || existingRecord.patientName,
      hospital: fields.hospital || existingRecord.hospital,
      wardNo: fields.wardNo || existingRecord.wardNo,
      remark: fields.remark || existingRecord.remark
    };
    console.log('updatedFields', updatedFields);
    const statement = db.prepare(`
      UPDATE bookings
      SET patientType = ?, bookingType = ?, checkInTime = ?, checkOutTime = ?, category = ?, room = ?, payment = ?, mobile = ?, guestName = ?, patientGuestRelation = ?, document = ?, gender = ?, caste = ?, age = ?, state = ?, city = ?, patientName = ?, hospital = ?, wardNo = ?, remark = ?
      WHERE id = ?
    `);

    const result = await statement.run(
      updatedFields.patientType,
      updatedFields.bookingType,
      updatedFields.checkInTime,
      updatedFields.checkOutTime,
      updatedFields.category,
      updatedFields.room,
      updatedFields.payment,
      updatedFields.mobile,
      updatedFields.guestName,
      updatedFields.patientGuestRelation,
      updatedFields.document,
      updatedFields.gender,
      updatedFields.caste,
      updatedFields.age,
      updatedFields.state,
      updatedFields.city,
      updatedFields.patientName,
      updatedFields.hospital,
      updatedFields.wardNo,
      updatedFields.remark,
      id
    );
    console.log('result', result);
    return result.success > 0 ? { success: true, message: 'Record updated successfully' } : { success: false, message: 'Update failed' };
  }
  // Get the ID from the route parameter

  if (event.node.req.method === 'DELETE') {
    const statement = db.prepare(`DELETE FROM bookings WHERE id = ?`);
    const result = statement.run(id);

    if (result.changes > 0) {
      return { success: true, message: 'Record deleted successfully' };
    } else {
      return { success: false, message: 'Record not found or deletion failed' };
    }
  }

  return { success: false, message: 'Invalid request method' };
});
