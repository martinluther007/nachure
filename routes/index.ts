import express from 'express';
import tourRoutes from './tourRoutes';
const Router = express.Router();

Router.use('/tours', tourRoutes);

export default Router;
