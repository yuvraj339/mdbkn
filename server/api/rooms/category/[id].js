export default defineEventHandler(async (event) => {
  const db = useDatabase('mdbkn')
  const id = event.context.params?.id

  if (event.node.req.method === 'PUT' && id) {
    const { name, facility, description, normalRent, patientRent } = await readBody(event)

    const statement = db.prepare(`
      UPDATE room_category
      SET name = ?, facility = ?, description = ?, normalRent = ?, patientRent = ?
      WHERE id = ?
    `)

    const result = statement.run(name, facility, description, normalRent, patientRent, id)

    return result.changes > 0 ? { success: true, message: 'Record updated successfully' } : { success: false, message: 'Record not found or update failed' }
  }
  // Get the ID from the route parameter

  if (event.node.req.method === 'DELETE') {
    const statement = db.prepare(`DELETE FROM room_category WHERE id = ?`)
    const result = statement.run(id)

    if (result.changes > 0) {
      return { success: true, message: 'Record deleted successfully' }
    } else {
      return { success: false, message: 'Record not found or deletion failed' }
    }
  }

  return { success: false, message: 'Invalid request method' }
})
