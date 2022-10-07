import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import { getLogger, getStream } from '../fullstack-demo-logger/index.js';
import { createApiHandler } from './commands.js';

const log = getLogger('CmdProc/HTTP');

const runExpress = context => {
  const httpPort = process.env.API_PORT || 3001;

  return new Promise((resolve, reject) => {
    const app = express();
    app.use(cors());
    app.use(morgan('dev', { stream: getStream(log.debug) }));
    app.use(bodyParser.json());

    const processCommand = createApiHandler(context);
    app.post('/api/command', processCommand);

    const server = app.listen(httpPort, '0.0.0.0');
    server.on('listening', resolve);
    server.on('error', reject);
  })
    .catch(err => {
      log.error(`Can't run HTTP server: ${err}`);
    })
    .then(() => {
      log.info(`HTTP API listening on port ${httpPort}`);
    });
};

export { runExpress };
