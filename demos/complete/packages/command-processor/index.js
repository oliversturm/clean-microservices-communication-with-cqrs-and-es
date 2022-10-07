import { startCommandProcessor } from '../fullstack-demo-command-processor/index.js';
import * as aggregates from './aggregates/index.js';

startCommandProcessor(aggregates);
