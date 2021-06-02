const mongoose = require('mongoose');
const crypto = require('crypto');
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
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;

  next();
});
userSchema.pre('save', function (next) {
  if (this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now();
  next();
});

userSchema.methods.checkPasswordHasChanged = function (JWTimestamp) {
  if (this.passwordChangedAt) {
    console.log(this.passwordChangedAt.getTime() / 1000, JWTimestamp);
    return JWTimestamp < this.passwordChangedAt.getTime() / 1000;
  }
  return false;
};

userSchema.methods.getPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  console.log(this.passwordResetExpires);
  console.log(resetToken);
  console.log(this.passwordResetToken);

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
