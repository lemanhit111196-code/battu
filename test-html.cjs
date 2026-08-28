/* Kiểm toán cấu trúc HTML của mọi khối render — phát hiện tag lệch, thiếu ô */
const fs = require('fs');

class El {
  constructor(tag) { this.tag = tag; this.children = []; this.attrs = {}; this.dataset = {}; this.listeners = {}; this._innerHTML = ''; this.hidden = false; this.value = ''; this.textContent = ''; this.className = ''; this.classList = {
    add: c => { this.className = this.className.split(' ').concat(c).join(' '); },
    remove: c => { this.className = this.className.split(' ').filter(x => x !== c).join(' '); },
    toggle: (c, f) => { f ? this.classList.add(c) : this.classList.remove(c); },
    contains: c => this.className.split(' ').includes(c)
  }; }
  set innerHTML(v) { this._innerHTML = String(v); }
  get innerHTML() { return this._innerHTML; }
  set innerText(v) { this.textContent = v; }
  appendChild(c) { this.children.push(c); return c; }
  append(o) { this.children.push(o); }
  querySelector() { return null; }
  addEventListener(ev, fn) { (this.listeners[ev] = this.listeners[ev] || []).push(fn); }
  click() { (this.listeners.click || []).forEach(f => f({ target: this })); }
  scrollIntoView() { }
  select() { }
  remove() { this.children = []; }
  get parentElement() { return null; }
  setAttribute(k, v) { this.attrs[k] = v; }
}
const els = {};
const getOrCreate = s => (els[s] = els[s] || new El('div'));
global.document = {
  querySelector: s => getOrCreate(s),
  querySelectorAll: () => [],
  createElement: t => new El(t),
  addEventListener: (e, f) => { if (e === 'DOMContentLoaded') f(); },
  body: new El('body')
};
global.window = global;
global.location = new URL('http://x/?birth=1990-06-15-10-nu&phut=30&tz=7');
global.history = { replaceState: () => { } };
global.navigator = {};
global.Battu = require('./assets/battu-core.js');
global.BattuLuanGiai = require('./assets/battu-luangiai.js');
eval(fs.readFileSync('./assets/app.js', 'utf8'));

/* --------- Bộ kiểm tra tag cân bằng --------- */
const VOID = new Set(['br', 'hr', 'img', 'input', 'meta', 'link']);
function kiemTraCanBang(name, html) {
  const stack = [];
  const re = /<(\/?)([a-zA-Z0-9]+)([^>]*?)>/g;
  let m, err = null;
  while ((m = re.exec(html))) {
    const dong = m[1] === '/';
    const tag = m[2].toLowerCase();
    if (VOID.has(tag)) continue;
    if (m[3].endsWith('/')) continue;
    if (!dong) stack.push(tag);
    else {
      const top = stack.pop();
      if (top !== tag) { err = `</${tag}> đóng khi đang mở <${top}> (vị trí ${m.index})`; break; }
    }
  }
  if (!err && stack.length) err = `chưa đóng: ${stack.join(', ')}`;
  return err;
}
function kiemTraBang(name, html, soCot) {
  // mỗi <tr> phải có đúng soCot ô (td/th), tính cả ô nhãn
  const rows = html.match(/<tr>[\s\S]*?<\/tr>/g) || [];
  const errs = [];
  rows.forEach((r, i) => {
    const soO = (r.match(/<(td|th)[ >]/g) || []).length;
    if (soO !== soCot) errs.push(`dòng ${i + 1}: ${soO} ô (kỳ vọng ${soCot})`);
    const e = kiemTraCanBang(name, r);
    if (e) errs.push(`dòng ${i + 1}: ${e}`);
  });
  return errs;
}

setTimeout(() => {
  const ketQua = [];
  const frag = {
    'tru-table': getOrCreate('#tru-table').innerHTML,
    'dv-table': getOrCreate('#dv-table').innerHTML,
    'ln-table': getOrCreate('#ln-table').innerHTML,
    'sat-table': getOrCreate('#sat-table').innerHTML,
    'info-grid': getOrCreate('#info-grid').innerHTML,
    'hanh-bars': getOrCreate('#hanh-bars').innerHTML,
    'luan-giai-body': getOrCreate('#luan-giai-body').innerHTML,
    'huong-grid': getOrCreate('#huong-grid').innerHTML,
    'cung-grid': getOrCreate('#cung-grid').innerHTML,
    'cong-thuc-body': getOrCreate('#cong-thuc-body').innerHTML,
    'dv-detail': getOrCreate('#dv-detail').innerHTML,
    'truong-legend': getOrCreate('#legend-tt').innerHTML,
    'hanh-note': getOrCreate('#hanh-note').innerHTML,
    'quai-note': getOrCreate('#quai-note').innerHTML
  };
  for (const [k, v] of Object.entries(frag)) {
    const e = kiemTraCanBang(k, v);
    ketQua.push([`Cân bằng tag #${k}`, !e, e || '']);
  }
  for (const [k, n] of [['tru-table', 5], ['dv-table', 6], ['ln-table', 11], ['sat-table', 3]]) {
    const errs = kiemTraBang(k, frag[k], n);
    ketQua.push([`Bảng #${k} đủ ${n} ô/dòng`, errs.length === 0, errs.join('; ')]);
  }
  // nội dung tối thiểu
  const minim = [
    ['#luan-giai-body có 10 mục h3', (frag['luan-giai-body'].match(/<h3>/g) || []).length === 10],
    ['#info-grid đủ 7 ô', (frag['info-grid'].match(/info-item/g) || []).length === 7],
    ['#huong-grid đủ 8 hướng', (frag['huong-grid'].match(/huong-item/g) || []).length === 8]
  ];
  for (const [n, ok] of minim) ketQua.push([n, ok, '']);

  let fail = 0;
  for (const [n, ok, msg] of ketQua) { if (!ok) fail++; console.log(ok ? '✅' : '❌', n, msg ? '— ' + msg : ''); }
  console.log(fail ? `=== ${fail} LỖI CẤU TRÚC ===` : '=== CẤU TRÚC HTML HOÀN TOÀN SẠCH ===');
  process.exit(fail ? 1 : 0);
}, 300);
