
const db = require('../config/db');

async function getAll() {
    const [rows] = await db.query(
        'SELECT * FROM roles ORDER BY role_name ASC'
    );

    return rows;
}

async function getById(id) {
    const [rows] = await db.query(
        'SELECT * FROM roles WHERE role_id = ?',
        [id]
    );

    return rows[0] || null;
}

async function create(role) {
    const [result] = await db.query(
        `INSERT INTO roles (role_name, description)
         VALUES (?, ?)`,
        [
            role.role_name,
            role.description || null
        ]
    );

    return getById(result.insertId);
}

async function update(id, role) {
    const existingRole = await getById(id);

    if (!existingRole) {
        return null;
    }

    await db.query(
        `UPDATE roles
         SET role_name = ?, description = ?
         WHERE role_id = ?`,
        [
            role.role_name,
            role.description || null,
            id
        ]
    );

    return getById(id);
}

async function remove(id) {
    const [result] = await db.query(
        'DELETE FROM roles WHERE role_id = ?',
        [id]
    );

    return result.affectedRows > 0;
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};
