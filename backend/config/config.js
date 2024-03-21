const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qkbcoirsgjnavtmactvi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrYmNvaXJzZ2puYXZ0bWFjdHZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc3NjYwNTAsImV4cCI6MjAyMzM0MjA1MH0.7sr7RyEjWcKUuDKCsyFfusW9uol2Hvj3ROLIZLroUtY';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = {
  supabase
};
