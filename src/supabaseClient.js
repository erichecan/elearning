import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ljtwkkzshbrvqrxgnuin.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqdHdra3pzaGJydnFyeGdudWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTE1NTMsImV4cCI6MjA2NjYyNzU1M30.szRhJOeWhTIh1TFnuSyeJ5sh2A8sOHKTPGpwizlZCcQ';

export const supabase = createClient(supabaseUrl, supabaseKey); 