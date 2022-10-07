<script>
  import { page } from '$app/stores';
  import CustomerForm from '../../lib/CustomerForm.svelte';
  import { readModelStore } from '../../lib/readModelStore';

  const endpointName = 'customers';
  const readModelEndpoint = 'http://127.0.0.1:3003'; // customers

  $: store = readModelStore(
    endpointName,
    readModelEndpoint,
    null,
    'editing',
    'byId',
    {
      id: $page.params.id,
    }
  );
</script>

<CustomerForm
  dataId={$page.params.id}
  data={$store.isEmpty
    ? { newObject: true, name: '', location: '' }
    : $store.singleItem}
/>
