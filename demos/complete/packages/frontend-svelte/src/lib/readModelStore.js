import { readable } from 'svelte/store';
import io from 'socket.io-client';

// Exactly the same function used in the React project
const query =
  endpoint =>
  (readModelName, resolverName, params = {}) => {
    const url = new URL(`/query/${readModelName}/${resolverName}`, endpoint);
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Fetch error: ${res.status}/${res.statusText}`);
        }
        return res;
      })
      .then(res => res.json())
      .catch(err => {
        console.error(
          `Can't query ${url} with params ${JSON.stringify(params)}: ${err}`
        );
      });
  };

const applyChange = (data, changeInfo) => {
  switch (changeInfo.changeKind) {
    case 'addRow':
      return data.concat(changeInfo.details);

    case 'updateRow':
      return data.map(row =>
        row.id === changeInfo.details.id
          ? { ...row, ...changeInfo.details }
          : row
      );

    case 'deleteRow':
      return data.filter(row => row.id !== changeInfo.details.id);

    default:
      return data;
  }
};

const createData = data => ({
  data,
  isEmpty: !data || data.length === 0,
  singleItem: data.length === 1 ? data[0] : undefined,
});

export const readModelStore = (
  endpointName,
  endpoint,
  socketIoEndpoint,
  readModelName,
  resolverName,
  params = {}
) => {
  const store = readable({ data: [], isEmpty: true }, set => {
    query(endpoint)(readModelName, resolverName, params).then(loadedData => {
      let data = loadedData;
      set(createData(data));

      if (socketIoEndpoint) {
        const socket = io(socketIoEndpoint);
        socket.on('connect', () => {
          socket.emit('register', [
            { endpointName, readModelName, resolverName },
          ]);
        });
        socket.on('change', changeInfo => {
          if (changeInfo.changeKind === 'all') {
            query(endpoint)(readModelName, resolverName, params).then(
              newData => {
                data = newData;
                set(createData(data));
              }
            );
          } else {
            data = applyChange(data, changeInfo);
            set(createData(data));
          }
        });
      }
    });
  });
  return store;
};
