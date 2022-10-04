import Tour from '../models/tourModel';
import { Request, Response, NextFunction } from 'express';

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
    const queryObj = { ...query };
    //exclude fields from query while filtering
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // advanced filtering for $gte $lte type queries
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gt|lt|gte|lte)\b/g,
      (matched: string) => `$${matched}`
    );
    let tourQuery = Tour.find(JSON.parse(queryString));

    // adding sorting
    if (req.query.sort) {
      // the + sign adds white space without the code
      // @ts-ignore
      tourQuery = tourQuery.sort(req.query.sort);
    } else {
      tourQuery = tourQuery.sort('-createdAt');
    }

    // adding limiting fields
    if (req.query.fields) {
      console.log(req.query.fields);
      // @ts-ignore
      tourQuery = tourQuery.select(req.query.fields);
    }

    //adding pagination
    //   @ts-ignore
    const limit = req.query.limit * 1 || 5; //   @ts-ignore
    const page = req.query.page * 1 || 1;
    //   @ts-ignore
    const skip = (page - 1) * limit;
    tourQuery = tourQuery.skip(skip).limit(limit);
    // consuming chained query
    const tours = await tourQuery;
    res.status(200).json({
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

export const deleteTour = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Tour.findByIdAndDelete(id);
    res.status(200).json({
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
