import adapter from '@sveltejs/adapter-auto';

let { PREFIX, CACHE_POSTFIX } = process.env;

if (!PREFIX || !CACHE_POSTFIX) {
  // We should throw an exception here to indicate that the startup
  // process is not configured correctly. However, it turns out that
  // this confuses the Svelte integration in VS Code (it shows the
  // exception message for any script tag in any component...). So we set
  // default values instead which point into the "complete" demo.
  PREFIX = 'demos/complete';
  CACHE_POSTFIX = 'demos-complete';
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    appDir: `${PREFIX}/packages/frontend-svelte/_app`,
    files: {
      assets: `${PREFIX}/packages/frontend-svelte/static`,
      hooks: `${PREFIX}/packages/frontend-svelte/src/hooks`,
      lib: `${PREFIX}/packages/frontend-svelte/src/lib`,
      params: `${PREFIX}/packages/frontend-svelte/src/params`,
      routes: `${PREFIX}/packages/frontend-svelte/src/routes`,
      serviceWorker: `${PREFIX}/packages/frontend-svelte/src/service-worker`,
      template: `${PREFIX}/packages/frontend-svelte/src/app.html`,
    },
    outDir: `${PREFIX}/packages/frontend-svelte/.svelte-kit`,
    package: {
      dir: `${PREFIX}/packages/frontend-svelte/package`,
    },
    vite: {
      cacheDir: `node_modules/.vite-svelte-${CACHE_POSTFIX}`,
      server: {
        port: 3010,
        host: '0.0.0.0',
      },
    },
  },
};

export default config;
