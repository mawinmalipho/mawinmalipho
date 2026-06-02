import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  // Parse body data
  const { name, contact, details } = request.body;

  // Simple validation
  if (!name || !contact || !details) {
    return response.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  try {
    // 1. Automatically create table if it doesn't exist yet
    await sql`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        contact VARCHAR(255) NOT NULL,
        details TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Insert user lead into database
    await sql`
      INSERT INTO leads (name, contact, details)
      VALUES (${name}, ${contact}, ${details});
    `;

    // 3. Return success response
    return response.status(200).json({ message: 'บันทึกข้อมูลเรียบร้อยแล้ว' });
  } catch (error) {
    console.error('Database Error:', error);
    return response.status(500).json({ message: 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล', error: error.message });
  }
}
