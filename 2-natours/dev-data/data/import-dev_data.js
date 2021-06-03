const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../model/tourModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    // .connect(process.env.DATABASE_LOCAL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Collection Successfully'));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`), 'utf-8');

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Import data successfully !!! 🚀🚀🚀');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Deleted successfully 💥💥💥');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
importData();
// deleteData();
console.log('hel0');
