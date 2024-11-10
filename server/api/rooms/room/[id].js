export default defineEventHandler(async (event) => {
  const db = useDatabase('mdbkn');
  const id = event.context.params?.id;

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
