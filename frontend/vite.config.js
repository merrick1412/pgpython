import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
      '/orchestrator-info': 'http://localhost:5000',
      '/worker-info': 'http://localhost:5000',
      '/pool-info': 'http://localhost:5000',
      '/server-logs': 'http://localhost:5000',
    }
  }
});
