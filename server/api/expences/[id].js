export default defineEventHandler(async (event) => {
  const db = useDatabase('mdbkn');
  const id = event.context.params?.id;
  if (event.node.req.method === 'DELETE') {
    console.log(id, 'vvvvvvvvvvvvvvvvvvvvvvvvvvvvv');
    const statement = db.prepare(`DELETE FROM expences WHERE id = ?`);
    const result = statement.run(id);

    if (result.changes > 0) {
      return { success: true, message: 'Record deleted successfully' };
    } else {
      return { success: false, message: 'Record not found or deletion failed' };
    }
  }

  return { success: false, message: 'Invalid request method' };
});
