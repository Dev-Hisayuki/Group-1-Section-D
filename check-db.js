
require('dotenv').config();

const db = require('./config/db');

async function checkDatabase() {
    try {
        const [rows] = await db.query(
            'SELECT DATABASE() AS database_name, VERSION() AS database_version'
        );

        console.log('Database connection successful!');
        console.log('Database:', rows[0].database_name);
        console.log('MariaDB/MySQL version:', rows[0].database_version);

        const [columns] = await db.query('DESCRIBE categories');

        console.log('\nCategories table columns:');
        console.table(columns);
    } catch (error) {
        console.error('Database test failed!');
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
    } finally {
        await db.end();
    }
}

checkDatabase();
