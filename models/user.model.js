const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  age: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
  }
});

const User = mongoose.model('users', userSchema);

module.exports = User;
