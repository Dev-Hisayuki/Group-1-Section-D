
const bcrypt = require('bcrypt');
const db = require('../config/db');

function getSessionUser(user) {
    return {
        user_id: user.user_id,
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        role_id: user.role_id,
        role_name: user.role_name,
        status: user.status
    };
}

async function login(req, res) {
    try {
        const identifier = String(req.body.identifier || '').trim();
        const password = req.body.password;

        if (!identifier || typeof password !== 'string' || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username/email and password are required.'
            });
        }

        if (identifier.length > 100 || password.length > 72) {
            return res.status(400).json({
                success: false,
                message: 'Invalid login credentials.'
            });
        }

        const [rows] = await db.query(
            `SELECT
                u.user_id,
                u.role_id,
                u.full_name,
                u.username,
                u.email,
                u.password_hash,
                u.status,
                r.role_name
             FROM users u
             INNER JOIN roles r ON r.role_id = u.role_id
             WHERE u.username = ? OR u.email = ?
             LIMIT 1`,
            [identifier, identifier]
        );

        const user = rows[0];

        if (
            !user ||
            user.status !== 'Active' ||
            !(await bcrypt.compare(password, user.password_hash))
        ) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials or inactive account.'
            });
        }

        const sessionUser = getSessionUser(user);

        req.session.regenerate((error) => {
            if (error) {
                console.error('Session regeneration failed:', error);

                return res.status(500).json({
                    success: false,
                    message: 'Unable to start your session.'
                });
            }

            req.session.user = sessionUser;

            req.session.save((saveError) => {
                if (saveError) {
                    console.error('Session save failed:', saveError);

                    return res.status(500).json({
                        success: false,
                        message: 'Unable to save your session.'
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: 'Login successful.',
                    user: sessionUser,
                    redirect: '/dashboard.html'
                });
            });
        });
    } catch (error) {
        console.error('Login error:', error);

        return res.status(500).json({
            success: false,
            message: 'Unable to log in right now.'
        });
    }
}

function me(req, res) {
    if (!req.session || !req.session.user) {
        return res.status(401).json({
            success: false,
            message: 'You are not logged in.'
        });
    }

    return res.json({
        success: true,
        user: req.session.user
    });
}

function logout(req, res) {
    if (!req.session) {
        res.clearCookie('library.sid');
        return res.json({
            success: true,
            message: 'Logged out successfully.'
        });
    }

    req.session.destroy((error) => {
        if (error) {
            console.error('Logout error:', error);

            return res.status(500).json({
                success: false,
                message: 'Unable to log out.'
            });
        }

        res.clearCookie('library.sid', {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/'
        });

        return res.json({
            success: true,
            message: 'Logged out successfully.'
        });
    });
}

module.exports = {
    login,
    me,
    logout
};
