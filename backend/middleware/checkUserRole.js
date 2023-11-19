// middleware/checkUserRole.js

const checkUserRole = (allowedRoles) => {
    return (req, res, next) => {
        console.log(req.body);
        // Assuming user's role is stored in req.user.role
        if (allowedRoles.includes(req.body.data.role)) {
            next();
        } else {
            res.status(403).json({ message: "Access Denied: You do not have the required role" });
        }
    };
};

module.exports = checkUserRole;
