import express from 'express';
import {
  createTour,
  getTours,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStatistics,
  getMonthlyPlans,
} from '../controllers/tourController';
const Router = express.Router();

// admin
Router.route('/tours-stats').get(getTourStatistics);
Router.route('/monthly-plan/:year').get(getMonthlyPlans);

// users
Router.route('/top-5-cheap').get(aliasTopTours, getTours);
Router.route('/').post(createTour).get(getTours);
Router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

export default Router;
