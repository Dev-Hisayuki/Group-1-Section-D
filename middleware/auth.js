
function requireAuth(req, res, next) {
    if (!req.session || !req.session.user) {
        if (req.path.startsWith('/api/')) {
            return res.status(401).json({
                success: false,
                message: 'Please log in to continue.'
            });
        }

        return res.redirect('/login.html');
    }

    next();
}

function requireAdmin(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(401).json({
            success: false,
            message: 'Please log in to continue.'
        });
    }

    const roleName = String(req.session.user.role_name || '')
        .trim()
        .toLowerCase();

    if (!['admin', 'administrator'].includes(roleName)) {
        return res.status(403).json({
            success: false,
            message: 'Administrator access is required.'
        });
    }

    next();
}

module.exports = {
    requireAuth,
    requireAdmin
};
