import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Tour from './../../models/tourModel.js';
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
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data imported');
  } catch (error) {
    console.log('error');
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany({});
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
