const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routes/authRouter');
const Role = require('./models/Role');
const { mongoUri } = require('./config');

const app = express();

app.use(express.json());

app.use('/auth', authRouter);

const createInitialRoles = async () => {
  try {
    let userRole = await Role.findOne({ name: 'user' });
    if (!userRole) {
      userRole = new Role({ name: 'user' });
      await userRole.save();
      console.log('Роль "user" успешно создана');
    }

    let adminRole = await Role.findOne({ name: 'admin' });
    if (!adminRole) {
      adminRole = new Role({ name: 'admin' });
      await adminRole.save();
      console.log('Роль "admin" успешно создана');
    }
  } catch (e) {
    console.error('Ошибка при создании ролей:', e);
  }
};  // при старте приложения мы делаем проверку есть ли у нас роли user и admin, и если нет, то создаем их, сделано это для того, что-бы не было такой ситуации, что роли может создавать только admin, а самой роли admin тоже ещё нет

const start = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('Подключение к MongoDB успешно установлено');

    await createInitialRoles();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  } catch (error) {
    console.error('Ошибка при подключении к базе данных:', error.message);
    process.exit(1);
  }
};

start();
