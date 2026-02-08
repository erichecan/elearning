import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function addIsApprovedColumn() {
    const client = await pool.connect();
    try {
        console.log('Adding is_approved column to words table...');

        // Check if column exists
        const checkQuery = `
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'words' AND column_name = 'is_approved'
        `;
        const checkResult = await client.query(checkQuery);

        if (checkResult.rows.length > 0) {
            console.log('Column is_approved already exists.');
            return;
        }

        // Add the column
        await client.query(`
            ALTER TABLE words 
            ADD COLUMN is_approved BOOLEAN DEFAULT false
        `);

        console.log('✅ Column is_approved added successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

addIsApprovedColumn();
