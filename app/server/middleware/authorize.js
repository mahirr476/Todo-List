const userService = require('../services/userService');

const authorize = (allowedRoles, requiredPermission = null) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.id;
            const userRole = await userService.getUserRole(userId);

            // If the user's role is in the allowed roles list
            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({ message: 'Access denied: Role not permitted' });
            }

            // If a specific permission is required, check if the user has it
            if (requiredPermission) {
                const userPermissions = await userService.getUserPermissions(userId);
                if (!userPermissions.includes(requiredPermission)) {
                    return res.status(403).json({ message: 'Permission denied' });
                }
            }

            next();
        } catch (error) {
            console.error('Authorization error:', error);
            res.status(500).json({ message: 'Authorization error' });
        }
    };
};

module.exports = authorize;
