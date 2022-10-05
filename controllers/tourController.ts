import Tour from '../models/tourModel';
import { Request, Response, NextFunction } from 'express';
import ApiFeatures from '../utils/ApiFeatures';
export const aliasTopTours = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage price';
  req.query.fields = 'name price ratingsAverage difficulty summary';
  next();
};

export const createTour = async (req: Request, res: Response) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Some error occured',
    });
    console.log(error);
  }
};

export const getTours = async (req: Request, res: Response) => {
  try {
    const { query } = req;
    // consuming chained query
    const tourApiFeatures = new ApiFeatures(Tour.find(), query)
      .filtering()
      .sorting()
      .limitFields()
      .paginate();
    const tours = await tourApiFeatures.query;

    res.status(201).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Some error occured',
    });
    console.log(error);
  }
};
export const getTour = async (req: Request, res: Response) => {
  try {
    const {
      params: { id },
    } = req;
    const tour = await Tour.findById(id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Some error occured',
    });
    console.log(error);
  }
};

export const updateTour = async (req: Request, res: Response) => {
  try {
    const {
      params: { id },
      body,
    } = req;
    const tour = await Tour.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Some error occured',
    });
    console.log(error);
  }
};

export const deleteTour = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Tour.findByIdAndDelete(id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Some error occured',
    });
    console.log(error);
  }
};

export const getTourStatistics = async (req: Request, res: Response) => {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: '$difficulty',
          numOfTours: { $sum: 1 },
          numOfRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      { $sort: { avgPrice: 1 } },
    ]);
    res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Some error occured',
    });
    console.log(error);
  }
};

export const getMonthlyPlans = async (req: Request, res: Response) => {
  try {
    const {
      params: { year },
    } = req;

    const plan = await Tour.aggregate([
      // open up the array of start dates to individual objects
      { $unwind: '$startDates' },
      {
        // run filtering based on start dates specs

        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        // run grouping based on start dates specs

        $group: {
          _id: { $month: '$startDates' },
          numOfToursInYear: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      { $addFields: { month: '$_id' } },
      { $project: { _id: 0 } },
      { $sort: { numOfToursInYear: -1 } },
      { $limit: 12 },
    ]);
    res.status(200).json({
      status: 'success',
      data: plan,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Some error occured',
    });
    console.log(error);
  }
};
