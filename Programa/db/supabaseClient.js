import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';
// Cliente Supabase para BACKEND (server-side)
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
