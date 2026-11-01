import { defineConfig, type Plugin } from 'vite';
import { resolve } from 'node:path';

// The theatre imports productions from ../productions, so Vite may serve files from the repository root.
// That folder is outside the Vite root, so Vite does not watch it. Without this plugin a running dev server
// never sees a new show: its repertoire glob stays as it was at start.
function watchProductions(): Plugin {
  return {
    name: 'watch-productions',
    configureServer(server) {
      server.watcher.add(resolve(import.meta.dirname, '../productions'));
    },
  };
}

export default defineConfig({
  plugins: [watchProductions()],
  server: { port: 5199, fs: { allow: ['..'] } },
  build: { target: 'es2022', assetsInlineLimit: 0, chunkSizeWarningLimit: 2000 },
});
