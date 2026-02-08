import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '.env') });
const sql = neon(process.env.DATABASE_URL!);
async function main() {
  const result = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'words' ORDER BY ordinal_position`;
  console.table(result);
}
main().catch(console.error);
