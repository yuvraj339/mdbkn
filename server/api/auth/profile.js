export default defineEventHandler(async (event) => {
  const db = useDatabase('mdbkn');
  //   const id = event.context.params?.id;

  if (event.node.req.method === 'PUT') {
    const { secret, name, mobile, email, password } = await readBody(event);

    const { rows } = await db.sql`SELECT * FROM users WHERE secret = ${secret}`;

    let user = rows.length ? rows[0] : null;

    if (user) {
      const statement = db.prepare(`
            UPDATE users
            SET name = ?, mobile = ?, email = ?, password = ?
            WHERE secret = ?
        `);

      const result = statement.run(name, mobile, email, password, secret);
      return result.changes > 0 ? { success: true, message: 'Record updated successfully' } : { success: false, message: 'Record not found or update failed' };
    }
    return { success: false, message: 'Please enter correct secret' };
  }
  // Get the ID from the route parameter

  //   if (event.node.req.method === 'DELETE') {
  //     const statement = db.prepare(`DELETE FROM users WHERE id = ?`);
  //     const result = statement.run(id);

  //     if (result.changes > 0) {
  //       return { success: true, message: 'Record deleted successfully' };
  //     } else {
  //       return { success: false, message: 'Record not found or deletion failed' };
  //     }
  //   }

  return { success: false, message: 'Invalid request method' };
});
