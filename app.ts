import express from 'express';
import { Request, Response } from 'express';

const app = express();
app.get('/', (req: Request, res: Response) => {
  res.status(200).send("It's all good baby baby");
});
export default app;
