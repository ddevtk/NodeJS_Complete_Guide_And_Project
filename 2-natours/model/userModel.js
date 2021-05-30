const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: { type: String, require: [true, 'Please tell us your name'] },
  email: {
    type: String,
    require: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'please provide a valid email'],
  },
  photo: { type: String },
  password: {
    type: String,
    require: [true, 'Please provide your password'],
    minlength: 8,
  },
  confirmPassword: {
    type: String,
    require: [true, 'Please confirm your password'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
