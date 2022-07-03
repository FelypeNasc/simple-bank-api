import express from 'express';
import { router } from './routes';
import config from './config';

const port = config.port;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
