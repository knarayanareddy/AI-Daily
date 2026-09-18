import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const runtimeEnv = (globalThis as { process?: { env?: Record<string, string> } }).process?.env || {};
  return {
  base: env.GITHUB_ACTIONS === 'true' || runtimeEnv.GITHUB_ACTIONS === 'true' ? '/AI-Daily/' : '/',
  plugins: [react()],
  server: { host: '0.0.0.0', port: 4173, allowedHosts: true },
  build: { target: 'es2022', sourcemap: true },
  };
});
