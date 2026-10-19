
const db = require('../config/db');

async function getAll() {
    const [rows] = await db.query(
        'SELECT * FROM categories ORDER BY category_name ASC'
    );

    return rows;
}

async function getById(id) {
    const [rows] = await db.query(
        'SELECT * FROM categories WHERE category_id = ?',
        [id]
    );

    return rows[0] || null;
}

async function create(category) {
    const [result] = await db.query(
        `INSERT INTO categories (category_name, description, status)
         VALUES (?, ?, ?)`,
        [
            category.category_name,
            category.description || null,
            category.status || 'Active'
        ]
    );

    return getById(result.insertId);
}

async function update(id, category) {
    const existingCategory = await getById(id);

    if (!existingCategory) {
        return null;
    }

    await db.query(
        `UPDATE categories
         SET category_name = ?, description = ?, status = ?
         WHERE category_id = ?`,
        [
            category.category_name,
            category.description || null,
            category.status,
            id
        ]
    );

    return getById(id);
}

async function remove(id) {
    const [result] = await db.query(
        'DELETE FROM categories WHERE category_id = ?',
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
