const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routes/authRouter');
const { mongoUri } = require('./config');

const app = express();

app.use(express.json());

app.use('/auth', authRouter);

const start = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('Подключение к MongoDB успешно установлено');

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
