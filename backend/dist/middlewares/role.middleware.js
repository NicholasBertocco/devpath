"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = void 0;
const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            res.status(403).json({ error: 'Acesso negado. Você não tem permissão para esta ação.' });
            return;
        }
        next();
    };
};
exports.authorizeRole = authorizeRole;
