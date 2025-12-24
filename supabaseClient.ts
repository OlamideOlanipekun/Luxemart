
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://whccyancinkykosaoxob.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoY2N5YW5jaW5reWtvc2FveG9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1ODMxNjYsImV4cCI6MjA4MjE1OTE2Nn0.v788k-B6VY0q2btzMHoTUMjvvwRC54SqvUii9Vc4nbY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
