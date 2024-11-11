const authorize = (roles) => {
  return (req, res, next) => {
    if (req.method === 'OPTIONS') {
      return next();
    }

    try {
      if (!req.user) {
        return res.status(403).json({ message: 'Пользователь не авторизован' });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Нет доступа' });
      }

      next();
    } catch (e) {
      console.error(e);
      return res.status(403).json({ message: 'Пользователь не авторизован' });
    }
  };
};

module.exports = authorize;
