export default defineEventHandler(async (event) => {
  const db = useDatabase('mdbkn');

  if (event.node.req.method === 'GET') {
    const { rows } = await db.sql`SELECT id, roomNumber FROM rooms where roomStatus = 'Available'`;
    return rows;
  }
});