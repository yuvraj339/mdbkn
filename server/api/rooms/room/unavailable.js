export default defineEventHandler(async (event) => {
  const db = useDatabase('mdbkn');

  if (event.node.req.method === 'GET') {
    // const { rows } = await db.sql`SELECT id, roomNumber FROM rooms where roomStatus = 'Unavailable'`;
    const { rows } =
      await db.sql`SELECT rooms.*, name FROM rooms join room_category on rooms.roomCategory == room_category.id where rooms.roomStatus = 'Unavailable' order by rooms.roomNumber`;
    return { rows };
  }
});
