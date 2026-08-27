import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://wlbgdlolgjccvbuvutiw.supabase.co',
  'sb_publishable_MTFbAqD0o2TyKdXFZn_8lg_4e7KLKrG'
);

async function test() {
  const { data, error } = await supabase.from('gallery_images').select('*');
  console.log('Data:', data);
  console.log('Error:', error);
}

test();
