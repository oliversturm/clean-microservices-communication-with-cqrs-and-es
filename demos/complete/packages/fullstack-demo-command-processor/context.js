import { createAggregateStore } from './aggregateStore.js';
import { createEventStore } from './eventStore.js';
import { createEventBus } from './eventBus.js';

const initializeContext = aggregates =>
  Promise.all([createAggregateStore(aggregates), createEventStore()])
    .then(([aggregateStore, eventStore]) => ({
      aggregates,
      aggregateStore,
      eventStore,
    }))
    .then(context =>
      createEventBus().then(eventBus => ({ ...context, eventBus })),
    )
    .then(context => context.eventStore.replay(context).then(() => context));

export { initializeContext };
