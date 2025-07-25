import pool from '../../../lib/db'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
    const resolved = searchParams.get('resolved')
    
  let query = `
    SELECT incidents.*, cameras.name as camera_name, cameras.location as camera_location
    FROM incidents
    JOIN cameras ON incidents.camera_id = cameras.id
  `
  const params = []
    if (resolved !== null) {
    query += ' WHERE incidents.resolved = $1'
    params.push(resolved === 'true')
    }
  query += ' ORDER BY incidents.ts_start DESC'

  const { rows } = await pool.query(query, params)
  return Response.json(rows)
}