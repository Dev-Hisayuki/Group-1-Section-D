
const db = require('../config/db');

async function getAll() {
    const [rows] = await db.query(`
        SELECT
            u.user_id,
            u.role_id,
            u.full_name,
            u.username,
            u.email,
            u.status,
            u.created_at,
            u.updated_at,
            r.role_name
        FROM users u
        INNER JOIN roles r ON u.role_id = r.role_id
        ORDER BY u.full_name ASC
    `);

    return rows;
}

async function getById(id) {
    const [rows] = await db.query(`
        SELECT
            u.user_id,
            u.role_id,
            u.full_name,
            u.username,
            u.email,
            u.status,
            u.created_at,
            u.updated_at,
            r.role_name
        FROM users u
        INNER JOIN roles r ON u.role_id = r.role_id
        WHERE u.user_id = ?
    `, [id]);

    return rows[0] || null;
}

async function getByUsername(username) {
    const [rows] = await db.query(
        'SELECT * FROM users WHERE username = ?',
        [username]
    );

    return rows[0] || null;
}

async function create(user) {
    const [result] = await db.query(`
        INSERT INTO users
            (role_id, full_name, username, email, password_hash, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `, [
        user.role_id,
        user.full_name,
        user.username,
        user.email,
        user.password_hash,
        user.status || 'Active'
    ]);

    return getById(result.insertId);
}

async function update(id, user) {
    const existingUser = await getById(id);

    if (!existingUser) {
        return null;
    }

    if (user.password_hash) {
        await db.query(`
            UPDATE users
            SET role_id = ?,
                full_name = ?,
                username = ?,
                email = ?,
                password_hash = ?,
                status = ?
            WHERE user_id = ?
        `, [
            user.role_id,
            user.full_name,
            user.username,
            user.email,
            user.password_hash,
            user.status,
            id
        ]);
    } else {
        await db.query(`
            UPDATE users
            SET role_id = ?,
                full_name = ?,
                username = ?,
                email = ?,
                status = ?
            WHERE user_id = ?
        `, [
            user.role_id,
            user.full_name,
            user.username,
            user.email,
            user.status,
            id
        ]);
    }

    return getById(id);
}

async function remove(id) {
    const [result] = await db.query(
        'DELETE FROM users WHERE user_id = ?',
        [id]
    );

    return result.affectedRows > 0;
}

module.exports = {
    getAll,
    getById,
    getByUsername,
    create,
    update,
    remove
};
