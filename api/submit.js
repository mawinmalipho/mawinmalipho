import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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

  // Check if credentials exist
  if (!supabaseUrl || !supabaseServiceKey) {
    return response.status(500).json({ 
      message: 'ระบบยังไม่ได้ระบุคีย์สำหรับเชื่อมต่อฐานข้อมูล (โปรดระบุ SUPABASE_URL และ SUPABASE_SERVICE_ROLE_KEY ใน Vercel)' 
    });
  }

  try {
    // 1. Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 2. Insert lead row into the 'leads' table
    const { data, error } = await supabase
      .from('leads')
      .insert([
        { name, contact, details }
      ]);

    if (error) {
      throw error;
    }

    // 3. Return success response
    return response.status(200).json({ message: 'บันทึกข้อมูลเรียบร้อยแล้ว' });
  } catch (error) {
    console.error('Supabase Database Error:', error);
    return response.status(500).json({ 
      message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลลง Supabase', 
      error: error.message 
    });
  }
}
