import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import { getLogger, getStream } from '../fullstack-demo-logger/index.js';
import { createApiHandler } from './query.js';

const log = getLogger('ReadMod/HTTP');

const runExpress = context => {
  const httpPort = process.env.API_PORT || 3003;

  return new Promise((resolve, reject) => {
    const app = express();
    app.use(cors());
    app.use(morgan('dev', { stream: getStream(log.debug) }));
    app.use(bodyParser.json());

    const executeQuery = createApiHandler(context);
    for (const readModelName in context.readModels) {
      const readModel = context.readModels[readModelName];
      if (readModel.resolvers) {
        for (const resolverName in readModel.resolvers) {
          const resolver = readModel.resolvers[resolverName];
          const handler = executeQuery(
            readModelName,
            readModel,
            resolverName,
            resolver
          );
          app.post(`/query/${readModelName}/${resolverName}`, handler);
          app.get(`/query/${readModelName}/${resolverName}`, handler);
        }
      }
    }

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
