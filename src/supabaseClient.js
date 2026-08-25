import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://smaxtumpqynedhnrcorj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtYXh0dW1wcXluZWRobnJjb3JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MjYwMjUsImV4cCI6MjEwMjAwMjAyNX0.wU1GdM4SWFmgpxyUD0qlGWCNqksREfc9LHDvjKQr3P4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
