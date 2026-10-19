
require('dotenv').config();

const bcrypt = require('bcrypt');
const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');
const db = require('../config/db');

const rl = readline.createInterface({ input, output });

async function main() {
    try {
        console.log('\n=== Create Administrator Account ===\n');

        const fullName = (await rl.question('Full name: ')).trim();
        const username = (await rl.question('Username: ')).trim();
        const email = (await rl.question('Email: ')).trim().toLowerCase();
        const password = await rl.question('Password (minimum 8 characters): ');

        if (!fullName || !username || !email || !password) {
            throw new Error('All fields are required.');
        }

        if (username.length > 50) {
            throw new Error('Username must not exceed 50 characters.');
        }

        if (fullName.length > 100) {
            throw new Error('Full name must not exceed 100 characters.');
        }

        if (
            email.length > 100 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {
            throw new Error('Please enter a valid email address.');
        }

        if (password.length < 8 || password.length > 72) {
            throw new Error('Password must be between 8 and 72 characters.');
        }

        const [existingUsers] = await db.query(
            `SELECT user_id
             FROM users
             WHERE username = ? OR email = ?
             LIMIT 1`,
            [username, email]
        );

        if (existingUsers.length > 0) {
            throw new Error('That username or email is already registered.');
        }

        const [roles] = await db.query(
            `SELECT role_id
             FROM roles
             WHERE LOWER(role_name) = 'administrator'
             LIMIT 1`
        );

        if (roles.length === 0) {
            throw new Error('Administrator role was not found.');
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const [result] = await db.query(
            `INSERT INTO users
                (role_id, full_name, username, email, password_hash, status)
             VALUES (?, ?, ?, ?, ?, 'Active')`,
            [
                roles[0].role_id,
                fullName,
                username,
                email,
                passwordHash
            ]
        );

        console.log('\nAdministrator account created successfully!');
        console.log(`User ID: ${result.insertId}`);
        console.log(`Username: ${username}`);
        console.log(`Email: ${email}`);
        console.log('\nYou can now sign in at http://localhost:1234/login.html');
    } catch (error) {
        console.error('\nSetup failed:', error.message);
        process.exitCode = 1;
    } finally {
        rl.close();
        await db.end();
    }
}

main();
