
const roleModel = require('../models/role.model');

function handleError(action, error, res) {
    console.error(`Error ${action}:`, error);

    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            success: false,
            error: {
                code: 'DUPLICATE_ROLE',
                message: 'That role name already exists.'
            }
        });
    }

    return res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to ${action} role.`
        }
    });
}

async function getAll(req, res) {
    try {
        const roles = await roleModel.getAll();

        res.json({
            success: true,
            data: roles
        });
    } catch (error) {
        handleError('retrieve', error, res);
    }
}

async function getById(req, res) {
    try {
        const role = await roleModel.getById(req.params.id);

        if (!role) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'ROLE_NOT_FOUND',
                    message: 'Role not found.'
                }
            });
        }

        res.json({
            success: true,
            data: role
        });
    } catch (error) {
        handleError('retrieve', error, res);
    }
}

async function create(req, res) {
    try {
        const { role_name, description } = req.body;

        if (!role_name || !role_name.trim()) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Role name is required.'
                }
            });
        }

        const role = await roleModel.create({
            role_name: role_name.trim(),
            description
        });

        res.status(201).json({
            success: true,
            message: 'Role created successfully.',
            data: role
        });
    } catch (error) {
        handleError('create', error, res);
    }
}

async function update(req, res) {
    try {
        const { role_name, description } = req.body;

        if (!role_name || !role_name.trim()) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Role name is required.'
                }
            });
        }

        const role = await roleModel.update(req.params.id, {
            role_name: role_name.trim(),
            description
        });

        if (!role) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'ROLE_NOT_FOUND',
                    message: 'Role not found.'
                }
            });
        }

        res.json({
            success: true,
            message: 'Role updated successfully.',
            data: role
        });
    } catch (error) {
        handleError('update', error, res);
    }
}

async function remove(req, res) {
    try {
        const deleted = await roleModel.remove(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'ROLE_NOT_FOUND',
                    message: 'Role not found.'
                }
            });
        }

        res.json({
            success: true,
            message: 'Role deleted successfully.'
        });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                success: false,
                error: {
                    code: 'ROLE_IN_USE',
                    message: 'This role is assigned to users and cannot be deleted.'
                }
            });
        }

        handleError('delete', error, res);
    }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};
