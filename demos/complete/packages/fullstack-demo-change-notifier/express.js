import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import { Server as SocketIoServer } from 'socket.io';
import http from 'http';

import { getLogger, getStream } from '../fullstack-demo-logger/index.js';
import { createNotifier } from './notifier.js';

const log = getLogger('Changes/HTTP');

const runExpress = () => {
  const httpPort = process.env.API_PORT || 3006;

  return new Promise((resolve, reject) => {
    const app = express();
    app.use(cors());
    app.use(morgan('dev', { stream: getStream(log.debug) }));
    app.use(bodyParser.json());

    const server = http.createServer(app);
    const io = new SocketIoServer(server, {
      cors: { origin: true },
    });
    const notifier = createNotifier(io);
    app.post('/change', notifier);

    server.listen(httpPort, '0.0.0.0');
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
