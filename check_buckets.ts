
import { supabase } from '../src/lib/database';

async function listBuckets() {
    console.log('Checking Supabase Storage buckets...');
    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
        console.error('Error listing buckets:', error);
    } else {
        console.log('Buckets:', data);
    }
}

listBuckets();
