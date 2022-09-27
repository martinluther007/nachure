import express from 'express';
import { Request, Response } from 'express';
import path from 'path';
import morgan from 'morgan';
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.get('/', (req: Request, res: Response) => {
  res.status(200).send("It's all good baby baby");
});
export default app;
