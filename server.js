import { createServer } from 'node:http';
import { createReadStream, existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const port = Number(process.env.PORT ?? 4173);
const root = process.cwd();

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

createServer((request, response) => {
  const requestedPath = request.url === '/' ? '/index.html' : request.url ?? '/index.html';
  const normalizedPath = normalize(requestedPath.split('?')[0]).replace(/^(\.\.[/\\])+/, '');
  const filePath = join(root, normalizedPath);

  if (!existsSync(filePath)) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Arquivo nao encontrado');
    return;
  }

  response.writeHead(200, { 'Content-Type': contentTypes[extname(filePath)] ?? 'application/octet-stream' });
  createReadStream(filePath).pipe(response);
}).listen(port, () => {
  console.log(`Dashboard rodando em http://localhost:${port}`);
});
