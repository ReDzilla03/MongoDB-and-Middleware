const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { jwtSecret } = require('../config');

const generateAccessToken = (id, role) => {
  return jwt.sign({ id, role }, jwtSecret, { expiresIn: '1h' });
};

exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 7);
    const user = new User({ username, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'Пользователь создан' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Ошибка при регистрации' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Пользователь не найден' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный пароль' });
    }

    const token = generateAccessToken(user._id, user.role);
    res.json({ token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Ошибка при входе' });
  }
};

exports.protectedRoute = (req, res) => {
  res.json({ message: 'Это защищенный маршрут, доступный только для авторизованных пользователей' });
};
