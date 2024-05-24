import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dgcerzjhlhayjaauevth.supabase.co';
const supabaseKey =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnY2VyempobGhheWphYXVldnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU4NTkwMTAsImV4cCI6MjAzMTQzNTAxMH0.200y4ag_RMTqFdx_Jd62dsz-j9Njs0G5NgmL7L3gpeQ';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
