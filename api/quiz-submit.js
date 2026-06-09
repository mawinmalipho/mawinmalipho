import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(request, response) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  // Parse body data
  const { dominant_type, awareness_level, scores } = request.body;

  // Simple validation
  if (dominant_type === undefined || !awareness_level || !scores) {
    return response.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
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

    // 2. Insert row into the 'quiz_results' table
    const { data, error } = await supabase
      .from('quiz_results')
      .insert([
        { 
          dominant_type: parseInt(dominant_type), 
          awareness_level, 
          scores 
        }
      ]);

    if (error) {
      throw error;
    }

    // 3. Return success response
    return response.status(200).json({ message: 'บันทึกข้อมูลผลกรรมเรียบร้อยแล้ว' });
  } catch (error) {
    console.error('Supabase Database Error:', error);
    return response.status(500).json({ 
      message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลลง Supabase', 
      error: error.message 
    });
  }
}
