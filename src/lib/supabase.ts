import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
};

export type Course = {
  id: string;
  title: string;
  description: string;
  hotmart_link: string;
  button_text: string;
  is_published: boolean;
};

export type Lesson = {
  id: string;
  course_id: string;
  title: string;
  description: string;
  video_url: string;
  order_index: number;
};
