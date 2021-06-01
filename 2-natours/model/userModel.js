const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
  role: {
    type: String,
    enum: ['admin', 'guide', 'lead-guide', 'user'],
    default: 'user',
  },
  password: {
    type: String,
    require: [true, 'Please provide your password'],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    require: [true, 'Please confirm your password'],
    validate: {
      validator: function (cfPassword) {
        return cfPassword === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: { type: Date },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
  next();
});
userSchema.methods.isCorrectPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.checkPasswordHasChanged = function (JWTimestamp) {
  if (this.passwordChangedAt) {
    console.log(this.passwordChangedAt.getTime() / 1000, JWTimestamp);
    return JWTimestamp < this.passwordChangedAt.getTime() / 1000;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;