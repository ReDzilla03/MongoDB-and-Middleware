const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

const authenticate = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(403).json({ message: 'Пользователь не авторизован' });
    }

    const decodedData = jwt.verify(token, jwtSecret, { algorithms: ['HS256'] });
    req.user = decodedData;
    next();
  } catch (e) {
    console.error(e);
    return res.status(403).json({ message: 'Пользователь не авторизован' });
  }
};

module.exports = authenticate;
