import { createStore } from './storage.js';
import { createEventBus } from './eventBus.js';
import { createProjectionHandler } from './projections.js';
import { createSideEffectsHandler } from './sideEffects.js';
import { createChangeNotificationHandler } from './changeNotification.js';
import { createCommandHandler } from './commands.js';

const initializeContext = readModels =>
  createStore()
    .then(storage => ({ storage, readModels }))
    .then(context =>
      context.storage
        .readLastProjectedEventTimestamps(readModels)
        .then(() => context)
    )
    .then(context =>
      createCommandHandler(context).then(commands => ({
        ...context,
        commands,
      }))
    )
    .then(context =>
      createSideEffectsHandler().then(sideEffects => ({
        ...context,
        sideEffects,
      }))
    )
    .then(context =>
      createChangeNotificationHandler().then(changeNotification => ({
        ...context,
        changeNotification,
      }))
    )
    .then(context =>
      createProjectionHandler(context).then(projectionHandler => ({
        ...context,
        projectionHandler,
      }))
    )
    .then(context => createEventBus(context).then(() => context));

export { initializeContext };
