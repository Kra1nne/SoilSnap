export const requireAdmin = (req, res, next) => {
    try {
        // Ensure user is authenticated first
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // Check if user has admin role
        if (req.user.role !== 'Admin') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }

        next();
    } catch (error) {
        console.error('Role middleware error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const requireAdminOrSelf = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // Allow if user is admin or accessing their own data
        const isAdmin = req.user.role === 'Admin';
        const isSelf = req.user._id.toString() === req.params.id;

        if (!isAdmin && !isSelf) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You can only access your own data."
            });
        }

        next();
    } catch (error) {
        console.error('Role middleware error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
