import server from './app';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import chalk from 'chalk';
dotenv.config({ path: './config.env' });
let DB_STRING: string = process.env.DB_CONNECTION_STRING!;
DB_STRING = DB_STRING.replace('<password>', process.env.DB_PASSWORD!);
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

const PORT = process.env.PORT || 8800;
server.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
