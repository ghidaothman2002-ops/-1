import { defineConfig } from 'vite';

// Set this to the hostname of the actual cloud preview, without a scheme or path.
// Keep Vite's host validation enabled instead of accepting arbitrary hosts.
const previewHost = process.env.MIN_HUNA_PREVIEW_HOST?.trim();
const allowedHosts = previewHost ? [previewHost] : [];

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
    allowedHosts,
  },
});
