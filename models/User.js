const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' } // я здесь для простоты роли задал просто в модели User, но по правильному да, их вынести отдельно
});

module.exports = mongoose.model('User', userSchema);