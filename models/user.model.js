const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  // gender: {
  //   type: String,
  //   enum: ['male', 'femel'],
  //   default: 'pending'
  // }
});

const User = mongoose.model('Task', userSchema);

module.exports = User;
