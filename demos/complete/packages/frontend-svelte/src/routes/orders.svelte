<script>
  import OrderTable from '../lib/OrderTable.svelte';

  import { readModelStore } from '../lib/readModelStore';

  const endpointName = 'orders';
  const readModelEndpoint = 'http://127.0.0.1:3005'; // orders
  const socketIoEndpoint = 'http://127.0.0.1:3006';

  const store = readModelStore(
    endpointName,
    readModelEndpoint,
    socketIoEndpoint,
    'overview',
    'all'
  );
</script>

<OrderTable {store} />
