import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Tour from './../../models/tourModel.js';
import User from './../../models/userModel.js';
import Review from './../../models/reviewModel.js';
import fs from 'fs';
// import ApiFeatures from '../utils/apiFeatures.js';

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose.connect(DB).then((con) => console.log('connected to database'));

const tours = JSON.parse(
  fs.readFileSync('./dev-data/data/tours.json', 'utf8'),
);
const users = JSON.parse(
  fs.readFileSync('./dev-data/data/users.json', 'utf8'),
);
const reviews = JSON.parse(
  fs.readFileSync('./dev-data/data/reviews.json', 'utf8'),
);
const importData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    await Tour.create(tours);
    await Review.create(reviews);
    console.log('data imported');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany({});
    await User.deleteMany({});
    await Review.deleteMany({});
    console.log('data deleted');
  } catch (error) {
    console.log('error');
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  console.log('delete');
  deleteData();
}

// console.log(process.argv);
