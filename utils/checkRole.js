function checkRole(role) {
    return function(req, res, next) {
        if (req.authInfo && req.authInfo.message === 'Token expirado') {
            return res.status(403).send('Acesso negado: Token expirado.');
        }
        if (req.user && (req.user.role === role || req.user.role === 'admin')) {
            next();
        } else {
            res.status(403).send('Acesso negado: Role inadequada.');
        }
    };
}

module.exports = { checkRole }