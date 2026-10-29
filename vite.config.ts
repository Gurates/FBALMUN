import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { handleApplicationRequest } from './server/application-api';

function applicationApiPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'application-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        let pathname: string;
        try { pathname = decodeURIComponent(new URL(req.url || '/', 'http://localhost').pathname).toLowerCase(); }
        catch { res.writeHead(400); res.end(); return; }
        if (/(^|\/)\.env[^/]*(\/|$)|(^|\/)\.git(\/|$)|^\/(server|scripts|netlify)(\/|$)|\.(pem|key|crt|sql)$/.test(pathname) || pathname === '/__open-in-editor') {
          res.writeHead(403, { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' });
          res.end('Forbidden');
          return;
        }
        next();
      });
      server.middlewares.use('/api', async (req, res) => {
        if (new URL(req.url || '/', 'http://localhost').pathname !== '/applications') {
          res.writeHead(404, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
          res.end(JSON.stringify({ error: 'Not found.' }));
          return;
        }
        let body = '';
        let size = 0;
        let oversized = false;
        for await (const chunk of req) {
          size += Buffer.byteLength(chunk);
          if (size > 65536) { oversized = true; break; }
          body += chunk;
        }
        if (oversized) {
          res.writeHead(413, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Application is too large.' }));
          return;
        }
        const headers = Object.fromEntries(Object.entries(req.headers).map(([key, value]) => [key, Array.isArray(value) ? value.join(',') : value]));
        const result = await handleApplicationRequest(req.method, headers, body, { ...env, ...loadEnv('', process.cwd(), '') });
        res.writeHead(result.statusCode, result.headers);
        res.end(result.body);
      });
    }
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), applicationApiPlugin(loadEnv(mode, process.cwd(), ''))],
  server: {
    port: 5173, host: true,
    cors: false,
    fs: { deny: ['**/.env*', '**/.git/**', '**/server/**', '**/scripts/**', '**/netlify/**', '**/*.{pem,key,crt,sql}'] }
  }
}));
