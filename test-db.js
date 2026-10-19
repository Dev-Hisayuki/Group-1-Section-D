
const db = require('./config/db');

async function testConnection() {
    try {
        const connection = await db.getConnection();
        console.log('Database connected successfully!');
        connection.release();
    } catch (error) {
        console.error('Database connection failed:', error.message);
    } finally {
        await db.end();
    }
}

testConnection();
