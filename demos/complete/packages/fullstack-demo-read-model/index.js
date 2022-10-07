import { initializeContext } from './context.js';
import { runExpress } from './express.js';

const startReadModel = readModels =>
  initializeContext(readModels).then(context => runExpress(context));

export { startReadModel };
