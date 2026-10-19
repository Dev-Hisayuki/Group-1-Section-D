
const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');

function handleError(action, error, res) {
    console.error(`User ${action} error:`, error);

    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            success: false,
            message: 'Username or email already exists.'
        });
    }

    if (
        error.code === 'ER_NO_REFERENCED_ROW_2' ||
        error.code === 'ER_ROW_IS_REFERENCED_2'
    ) {
        return res.status(409).json({
            success: false,
            message: 'The selected role is invalid or is being used by another record.'
        });
    }

    return res.status(500).json({
        success: false,
        message: `Unable to ${action} user. Please try again.`
    });
}

function validateUser(body, requirePassword = false) {
    const { role_id, full_name, username, email, password, status } = body;

    if (
        !role_id ||
        !Number.isInteger(Number(role_id)) ||
        Number(role_id) < 1
    ) {
        return 'Please select a valid role.';
    }

    if (!full_name || !full_name.trim()) {
        return 'Full name is required.';
    }

    if (!username || !username.trim()) {
        return 'Username is required.';
    }

    if (username.trim().length > 50) {
        return 'Username must not exceed 50 characters.';
    }

    if (!email || !email.trim()) {
        return 'Email is required.';
    }

    if (
        email.trim().length > 100 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
        return 'Please enter a valid email address.';
    }

    if (requirePassword && !password) {
        return 'Password is required.';
    }

    if (password && password.length < 8) {
        return 'Password must be at least 8 characters long.';
    }

    if (password && password.length > 72) {
        return 'Password must not exceed 72 characters.';
    }

    if (status && !['Active', 'Inactive'].includes(status)) {
        return 'Status must be Active or Inactive.';
    }

    return null;
}

async function getAll(req, res) {
    try {
        const users = await userModel.getAll();

        return res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        return handleError('retrieve', error, res);
    }
}

async function getById(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID.'
            });
        }

        const user = await userModel.getById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        return handleError('retrieve', error, res);
    }
}

async function create(req, res) {
    try {
        const validationError = validateUser(req.body, true);

        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            });
        }

        const username = req.body.username.trim();
        const email = req.body.email.trim();

        const existingUser = await userModel.getByUsername(username);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Username already exists.'
            });
        }

        const passwordHash = await bcrypt.hash(req.body.password, 12);

        const user = await userModel.create({
            role_id: Number(req.body.role_id),
            full_name: req.body.full_name.trim(),
            username,
            email,
            password_hash: passwordHash,
            status: req.body.status || 'Active'
        });

        return res.status(201).json({
            success: true,
            message: 'User created successfully.',
            data: user
        });
    } catch (error) {
        return handleError('create', error, res);
    }
}

async function update(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID.'
            });
        }

        const validationError = validateUser(req.body, false);

        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            });
        }

        const existingUser = await userModel.getById(id);

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        let passwordHash;

        if (req.body.password) {
            passwordHash = await bcrypt.hash(req.body.password, 12);
        }

        const updatedUser = await userModel.update(id, {
            role_id: Number(req.body.role_id),
            full_name: req.body.full_name.trim(),
            username: req.body.username.trim(),
            email: req.body.email.trim(),
            password_hash: passwordHash,
            status: req.body.status || 'Active'
        });

        return res.status(200).json({
            success: true,
            message: 'User updated successfully.',
            data: updatedUser
        });
    } catch (error) {
        return handleError('update', error, res);
    }
}

async function remove(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID.'
            });
        }

        const deleted = await userModel.remove(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User deleted successfully.'
        });
    } catch (error) {
        return handleError('delete', error, res);
    }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};
