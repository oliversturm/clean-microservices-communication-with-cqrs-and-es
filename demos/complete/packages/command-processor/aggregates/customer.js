import { doesntExist, exists, has } from './validate.js';

const createHelper = (requiredFields, eventType) => (aggregate, payload) => {
  doesntExist(aggregate);
  requiredFields.map(f => {
    has(payload, f);
  });
  return { type: eventType, payload };
};

export default {
  initial: () => ({}),

  commands: {
    CREATE: createHelper(['name'], 'CUSTOMER_CREATED'),

    //   (aggregate, payload) => {
    //   doesntExist(aggregate);
    //   has(payload, 'name');
    //   return { type: 'CUSTOMER_CREATED', payload };
    // },

    UPDATE: (aggregate, payload) => {
      exists(aggregate);
      has(payload, 'name');
      return { type: 'CUSTOMER_UPDATED', payload };
    },
  },

  projections: {
    CUSTOMER_CREATED: (aggregate, { timestamp }) => ({
      ...aggregate,
      creationTimestamp: timestamp,
    }),
  },
};
