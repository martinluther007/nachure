import server from './app';
import { Request, Response } from 'express';
const PORT = process.env.PORT || 8800;
server.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
