import { initializeContext } from './context.js';
import { runExpress } from './express.js';

const startCommandProcessor = aggregates =>
  initializeContext(aggregates).then(context => runExpress(context));

export { startCommandProcessor };
