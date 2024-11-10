export default defineEventHandler(async (event) => {
  const db = useDatabase('mdbkn');

  if (event.node.req.method === 'GET') {
    const { rows } = await db.sql`SELECT id, roomNumber FROM rooms where roomStatus = 'Available'`;
    // 'Available', Unavailable
    // const categories = rows.map((row) => ({
    //   id: row.id,
    //   name: row.name
    // }));

    return rows;
  }
});
