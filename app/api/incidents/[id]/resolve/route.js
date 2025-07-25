import pool from '../../../../../lib/db'

export async function PATCH(request, context) {
  const { id } = await context.params
    if (!id) {
    return Response.json({ error: 'Incident ID is required' }, { status: 400 })
    }
    
  // Get current resolved state
  const { rows: currentRows } = await pool.query(
    'SELECT resolved FROM incidents WHERE id = $1',
    [id]
  )
  if (currentRows.length === 0) {
    return Response.json({ error: 'Incident not found' }, { status: 404 })
    }
  const newResolved = !currentRows[0].resolved
    
  // Update and return the updated row with camera details
  const { rows } = await pool.query(`
    UPDATE incidents
    SET resolved = $1
    WHERE id = $2
    RETURNING *,
      (SELECT name FROM cameras WHERE cameras.id = incidents.camera_id) as camera_name,
      (SELECT location FROM cameras WHERE cameras.id = incidents.camera_id) as camera_location
  `, [newResolved, id])

  return Response.json(rows[0])
}