<script>
  import { v4 as uuid } from 'uuid';

  import Button from '../lib/Button.svelte';
  import CustomerTable from '../lib/CustomerTable.svelte';

  import { readModelStore } from '../lib/readModelStore';

  const endpointName = 'customers';
  const readModelEndpoint = 'http://127.0.0.1:3003'; // customers
  const socketIoEndpoint = 'http://127.0.0.1:3006';

  const store = readModelStore(
    endpointName,
    readModelEndpoint,
    socketIoEndpoint,
    'overview',
    'all'
  );
</script>

<CustomerTable {store} />
<Button kind="separate" text="New Customer" target={`/customer/${uuid()}`} />
