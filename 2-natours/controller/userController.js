const multer = require('multer');
const sharp = require('sharp');
const User = require('../model/userModel');
const appError = require('../utils/appError');
const catchAsyncFn = require('../utils/catchAsyncFn');
const handlerFactory = require('./handlerFactory');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1]; // extension
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });
const multerStorage = multer.memoryStorage();

const multerFiler = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new appError('Not an image! Please upload only image 🙏🙏🙏', 400),
      false
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFiler,
}).single('photo');

exports.uploadUserPhoto = upload;

exports.resizeUserPhoto = catchAsyncFn(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

// UPDATE USER'S DATA
exports.updateMe = catchAsyncFn(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new appError(
        'This route is not for password update. Please use /updatePassword.',
        400
      )
    );
  }
  const filterBodyHandler = (obj, ...allowedFields) => {
    let allowObj = {};
    Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el)) allowObj[el] = obj[el];
    });
    return allowObj;
  };
  const filterBodyObj = filterBodyHandler(req.body, 'name', 'email');
  if (req.file) filterBodyObj.photo = req.file.filename;
  const updateUser = await User.findByIdAndUpdate(req.user._id, filterBodyObj, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
    },
  });
});

// DELETE USER
exports.deleteMe = catchAsyncFn(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

module.exports.getAllUsers = handlerFactory.getAll(User);
module.exports.getUser = handlerFactory.getOne(User);
module.exports.updateUser = handlerFactory.updateOne(User);
module.exports.deleteUser = handlerFactory.deleteOne(User);
