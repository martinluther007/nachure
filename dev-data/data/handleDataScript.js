import fs from 'fs';
import chalk from 'chalk';
import dotenv from 'dotenv';
import { Schema, model } from 'mongoose';
import mongoose from 'mongoose';
const tourSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    startDates: [Date],
  },
  { timestamps: true }
);

const Tour = model('Tour', tourSchema);
dotenv.config({ path: '../../config.env' });
const data = JSON.parse(fs.readFileSync('./tours-simple.json', 'utf-8'));
let DB_STRING = process.env.DB_CONNECTION_STRING;
DB_STRING = DB_STRING.replace('<password>', process.env.DB_PASSWORD);
mongoose
  .connect(DB_STRING)
  .then(({ connection }) => {
    console.log(
      chalk.green(
        `---------------------------${connection.host} ------------------------------`
      )
    );
  })
  .catch((error) => {
    console.log(
      chalk.red(
        `---------------------------${error} ---------------------------`
      )
    );
  });

const deleteAllData = async (req, res) => {
  try {
    await Tour.deleteMany();
    console.log('All tours deleted successfully');
  } catch (error) {}
};

const importData = async (req, res) => {
  try {
    console.log('first');
    await Tour.create(data);
    console.log('All data imported successfully');
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === '--delete') {
  await deleteAllData();
  process.exit();
} else if (process.argv[2] === '--import') {
  await importData();
  process.exit();
}

console.log(process.argv);
