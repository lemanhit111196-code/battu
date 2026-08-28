/* Server tĩnh cho trang Lá Số Bát Tự — luôn gửi bản mới nhất (no-store với HTML) */
const http = require('http');
const fs = require('fs');
const path = require('path');
const root = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.md': 'text/markdown; charset=utf-8'
};

http.createServer((req, res) => {
  let p;
  try { p = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch (e) { p = '/'; }
  if (p === '/') p = '/index.html';
  const file = path.normalize(path.join(root, p));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end('403'); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('404 Not Found'); }
    const ext = path.extname(file).toLowerCase();
    const isHtml = ext === '.html' || ext === '.md';
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      // HTML & tài liệu: luôn tải lại (tránh trình duyệt dùng bản cũ trong cache)
      // tài nguyên có ?v=: cache 5 phút
      'Cache-Control': isHtml ? 'no-store, must-revalidate' : 'public, max-age=300',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(data);
  });
}).listen(8000, '0.0.0.0', () => console.log('Bát Tự web chạy tại http://localhost:8000'));
