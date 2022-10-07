import { MongoClient } from 'mongodb';

import { getLogger } from '../fullstack-demo-logger/index.js';

const log = getLogger('ReadMod/Store');

const wrapCalls = (dbContext, names) =>
  names.reduce(
    (r, v) => ({
      ...r,
      [v]: (collection, ...args) =>
        dbContext.db.collection(collection)[v](...args),
    }),
    {}
  );

const createStore = () => {
  // 1. Consider a complete URL in
  //    process.env.STORE_MONGODB_URL
  // 2. If the parts USER, PWD, URL_SCHEME, SERVER and
  //    URL_PATH (all with STORE_MONGODB_ prefix)
  //    are available, put together the URL like
  //    SCHEME://USER:PWD@SERVER/PATH
  // 3. Fall back to 'mongodb://127.0.0.1:27017'
  const url = process.env.STORE_MONGODB_URL
    ? process.env.STORE_MONGODB_URL
    : process.env.STORE_MONGODB_USER &&
      process.env.STORE_MONGODB_PWD &&
      process.env.STORE_MONGODB_URL_SCHEME &&
      process.env.STORE_MONGODB_SERVER &&
      process.env.STORE_MONGODB_URL_PATH
    ? `${process.env.STORE_MONGODB_URL_SCHEME}://${process.env.STORE_MONGODB_USER}:${process.env.STORE_MONGODB_PWD}@${process.env.STORE_MONGODB_SERVER}/${process.env.STORE_MONGODB_URL_PATH}`
    : 'mongodb://127.0.0.1:27017';

  const database = process.env.STORE_DATABASE || 'readmodel';

  return MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .catch(err => {
      log.error(`Can't connect to MongoDB at ${url}: ${err}`);
    })
    .then(client => ({ client, db: client.db(database) }))
    .then(dbContext => ({
      close: () => dbContext.client.close(),
      updateLastProjectedEventTimestamps: (rmNames, timestamp) =>
        rmNames.length
          ? dbContext.db
              .collection('readmodel.state')
              // Can't use updateMany here, because it only ever upserts
              // one document even if multiple are matched using e.g. $in
              .bulkWrite(
                rmNames.map(rmName => ({
                  updateOne: {
                    filter: { name: rmName },
                    update: {
                      $set: { lastProjectedEventTimestamp: timestamp },
                    },
                    upsert: true,
                  },
                }))
              )
              .then(r => {
                log.debug(
                  `Updated last projected event timestamps for ${JSON.stringify(
                    rmNames
                  )}. Matched ${r.matchedCount}, upserted ${r.upsertedCount}.`
                );
              })
          : Promise.resolve(),
      readLastProjectedEventTimestamps: readModels =>
        Promise.all(
          Object.keys(readModels).map(rmName =>
            dbContext.db
              .collection('readmodel.state')
              .find({ name: rmName }, { lastProjectedEventTimestamp: 1 })
              .toArray()
              .then(result => {
                if (result && result.length === 1)
                  readModels[rmName].lastProjectedEventTimestamp =
                    result[0].lastProjectedEventTimestamp;
              })
          )
        ),
      ...wrapCalls(dbContext, [
        'insertOne',
        'insertMany',
        'updateOne',
        'updateMany',
        'deleteOne',
        'deleteMany',
        'findOneAndUpdate',
        'findOneAndDelete',
        'findOneAndReplace',
        'bulkWrite',
        'find',
      ]),
    }));
};

export { createStore };
