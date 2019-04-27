import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import http from 'http';
import winston from 'winston';
import path from 'path';

import errorHandler from './utils/errorHandler';
import routes from './routes'

dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3029;

// Allow Cross-Origin
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

winston.configure({
  transports: [
    new (winston.transports.File)({ filename: 'server.log' })
  ]
});

global.winston = winston;

app.use(routes);
app.use(errorHandler());

app.get('/*', (req, res) => res.status(200).send("This endpoint doesn't exist yet, checkback sometime in future an we may have it"));

server.listen(port, () => {
  winston.log('info', 'listening...');
});

export default app;
