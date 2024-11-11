const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/Role');
const { jwtSecret } = require('../config');

class AuthController {
generateAccessToken = (id, role) => {
  return jwt.sign({ id, role }, jwtSecret, { expiresIn: '1h', algorithm: 'HS256' });  // указываем алгоритм, по-другому ошибка, как я понял из-за того, что токены по-разным алгоритмам генерируются 
};

generateRefreshToken = (id) => {
  return jwt.sign({ id }, jwtSecret, { expiresIn: '7d', algorithm: 'HS256' });
};

// Обновление access token с использованием refresh token
refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: 'Нет токена' });
  }

  try {
    const decoded = jwt.verify(refreshToken, jwtSecret, { algorithms: ['HS256'] });  // проверяем refresh token
    const user = await User.findById(decoded.id).populate('role');  // получаем пользователя и его роль

    if (!user) {
      return res.status(400).json({ message: 'Пользователь не найден' });
    }

    const accessToken = this.generateAccessToken(user._id, user.role.name);  // генерируем новый access token с ролью
    res.json({ accessToken });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ message: 'Ошибка при обновлении токена' });
  }
};

  register = async (req, res) => {
    try {
      const { username, password, role } = req.body;
      const roleRecord = await Role.findOne({ name: role });
      if (!roleRecord) {
        return res.status(400).json({ message: 'Указанная роль не найдена' });
      }

      const hashedPassword = await bcrypt.hash(password, 7);
      const user = new User({
        username,
        password: hashedPassword,
        role: roleRecord._id
      });

      await user.save();
      res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Ошибка при регистрации' });
    }
  };

  login = async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username }).populate('role');
      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Неверный пароль' });
      }

      const accessToken = this.generateAccessToken(user._id, user.role.name);
      const refreshToken = this.generateRefreshToken(user._id);
      res.json({ accessToken, refreshToken });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Ошибка при входе' });
    }
  };

  protectedRoute = (req, res) => {
    res.json({ message: 'Это защищенный маршрут, доступный только для авторизованных пользователей' });
  };

  createRole = async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Необходимо указать имя роли' });
      }

      const existingRole = await Role.findOne({ name });
      if (existingRole) {
        return res.status(400).json({ message: 'Такая роль уже существует' });
      }

      const role = new Role({ name });
      await role.save();
      res.status(201).json({ message: `Роль ${name} успешно создана` });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Ошибка при создании роли' });
    }
  };
}

module.exports = new AuthController();
