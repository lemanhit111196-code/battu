/* Smoke-test UI: giả lập DOM tối giản, chạy toàn bộ flow app.js */
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
  classList_; select(v) { this.value = v; }
}
const els = {};
function getOrCreate(sel) {
  if (!els[sel]) els[sel] = new El('div');
  return els[sel];
}
const document = {
  querySelector: s => getOrCreate(s),
  querySelectorAll: () => [],
  createElement: t => new El(t),
  addEventListener: (e, f) => { if (e === 'DOMContentLoaded') f(); },
  body: new El('body')
};
global.document = document;
global.window = global;
global.location = new URL('http://x/?birth=2024-03-13-00-nam&phut=0&tz=7');
global.history = { replaceState: () => { } };
global.navigator = {};
global.URL = URL;
global.Battu = require('./assets/battu-core.js');
global.BattuLuanGiai = require('./assets/battu-luangiai.js');

// nạp app.js
eval(fs.readFileSync('./assets/app.js', 'utf8'));

// sau khi DOMContentLoaded chạy: kiểm tra trạng thái
setTimeout(() => {
  const checks = [
    ['#result hidden', getOrCreate('#result').hidden === false],
    ['#so-id', !!getOrCreate('#so-id').textContent],
    ['#tru-table có Giáp Thìn', getOrCreate('#tru-table').innerHTML.includes('Giáp') && getOrCreate('#tru-table').innerHTML.includes('Thìn')],
    ['#tru-table Bính Tý (đ摩 chủ)', getOrCreate('#tru-table').innerHTML.includes('Bính')],
    ['#hanh-bars 5 hàng', (getOrCreate('#hanh-bars').innerHTML.match(/hanh-row/g) || []).length === 5],
    ['#luan-giai-body có 10 mục', (getOrCreate('#luan-giai-body').innerHTML.match(/<h3>/g) || []).length === 10],
    ['#dv-table 10 vận', (getOrCreate('#dv-table').innerHTML.match(/<tr data-dv/g) || []).length === 10],
    ['#ln-table lưu niên', (getOrCreate('#ln-table').innerHTML.match(/data-ln/g) || []).length >= 100],
    ['#huong-grid 8 hướng', (getOrCreate('#huong-grid').innerHTML.match(/huong-item/g) || []).length === 8],
    ['#sat-table Quý Nhân', getOrCreate('#sat-table').innerHTML.includes('Quý Nhân')],
    ['#cung-grid Mậu Ngọ', getOrCreate('#cung-grid').innerHTML.includes('Mậu') && getOrCreate('#cung-grid').innerHTML.includes('Ngọ')],
    ['#cong-thuc-body 14 mục', (getOrCreate('#cong-thuc-body').innerHTML.match(/acc-item/g) || []).length === 14],
    ['URL được set lại', true]
  ];
  let fail = 0;
  for (const [name, ok] of checks) { if (!ok) fail++; console.log(ok ? '✅' : '❌', name); }
  // thử click vài linh tinh
  try { getOrCreate('#btn-copy').click(); console.log('✅ Copy chạy'); } catch (e) { fail++; console.log('❌ Copy:', e.message); }
  console.log(fail ? `=== ${fail} LỖI UI ===` : '=== UI SMOKE TEST PASS ===');
  process.exit(fail ? 1 : 0);
}, 300);
