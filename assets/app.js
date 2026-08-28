/* =========================================================================
 * APP.JS — Giao diện Lập Lá Số Bát Tự & Luận giải
 * ========================================================================= */
(function () {
'use strict';
const B = window.Battu;
const L = window.BattuLuanGiai;
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const state = { so: null, lg: null, order: 0, selDV: 0 };

const HANH_MAU = B.HANH_COLOR;
const fmtNum = (n) => n.toFixed(0);
const pad2 = n => String(n).padStart(2, '0');

/* ---------------- Khởi tạo form ---------------- */
function initForm() {
  const namHienTai = new Date().getFullYear();
  const fill = (id, from, to, desc) => {
    const sel = $(id);
    for (let v = from; v <= to; v++) {
      const o = document.createElement('option');
      o.value = v; o.textContent = desc ? desc(v) : v;
      sel.appendChild(o);
    }
  };
  fill('#f-ngay', 1, 31);
  fill('#f-thang', 1, 12);
  for (let y = namHienTai + 1; y >= 1900; y--) {
    const o = document.createElement('option');
    o.value = y; o.textContent = y;
    $('#f-nam').appendChild(o);
  }
  fill('#f-gio', 0, 23, v => `${pad2(v)} giờ (${B.CHI[Math.floor(((v + 1) % 24) / 2)]})`);
  fill('#f-phut', 0, 59, v => pad2(v));
  const tzs = [
    [7, 'GMT+7 · Việt Nam'], [8, 'GMT+8 · Trung Quốc, Singapore (VN trước 1975: miền Bắc)'],
    [9, 'GMT+9 · Nhật, Hàn'], [5.5, 'GMT+5:30 · Ấn Độ'], [4, 'GMT+4'],
    [3, 'GMT+3 · Nga, Thổ'], [2, 'GMT+2 · Đông Âu'], [1, 'GMT+1 · Tây Âu'],
    [0, 'GMT+0 · Anh'], [-3, 'GMT−3 · Brazil'], [-5, 'GMT−5 · Mỹ Đông'], [-6, 'GMT−6 · Mỹ Trung'],
    [-8, 'GMT−8 · Mỹ Tây'], [-9.5, 'GMT−9:30'], [10, 'GMT+10 · Úc Đông'], [12, 'GMT+12']
  ];
  for (const [v, t] of tzs) {
    const o = document.createElement('option');
    o.value = v; o.textContent = t;
    $('#f-tz').appendChild(o);
  }
  $('#f-tz').value = '7';
  $('#f-ngay').value = 13; $('#f-thang').value = 3; $('#f-nam').value = 2024;
  $('#f-gio').value = 0; $('#f-phut').value = 0;

  $('#btn-tao').addEventListener('click', taoLaSo);
  $$('.switch-order .chip').forEach(c => c.addEventListener('click', () => {
    $$('.switch-order .chip').forEach(x => x.classList.remove('active'));
    c.classList.add('active');
    state.order = +c.dataset.order;
    renderTruTable();
  }));
  $('#btn-in').addEventListener('click', () => window.print());
  $('#btn-copy').addEventListener('click', copyDuLieu);
  $('#btn-link').addEventListener('click', copyLink);
}

function docInput() {
  const gt = document.querySelector('input[name="gt"]:checked').value;
  return {
    gioitinh: gt,
    ngay: +$('#f-ngay').value, thang: +$('#f-thang').value, nam: +$('#f-nam').value,
    gio: +$('#f-gio').value, phut: +$('#f-phut').value,
    tz: parseFloat($('#f-tz').value)
  };
}

/* URL: ?birth=YYYY-MM-DD-HH-nam|nu&phut=MM&tz=7 (tương thích kabala) */
function docURL() {
  const q = new URLSearchParams(location.search);
  const birth = q.get('birth');
  if (!birth) return null;
  const m = birth.match(/^(\d{4})-(\d{1,2})-(\d{1,2})-(\d{1,2})-(nam|nu)$/);
  if (!m) return null;
  return {
    gioitinh: m[5], nam: +m[1], thang: +m[2], ngay: +m[3], gio: +m[4],
    phut: +(q.get('phut') || 0), tz: parseFloat(q.get('tz') || '7')
  };
}
function ganURL(inp) {
  $('#f-ngay').value = inp.ngay; $('#f-thang').value = inp.thang; $('#f-nam').value = inp.nam;
  $('#f-gio').value = inp.gio; $('#f-phut').value = inp.phut; $('#f-tz').value = String(inp.tz);
  const r = document.querySelector(`input[name="gt"][value="${inp.gioitinh}"]`);
  if (r) r.checked = true;
}

/* ---------------- Tạo lá số ---------------- */
function taoLaSo() {
  const inp = docInput();
  const so = B.lapLaSo(inp);
  const lg = L.luanGiai(so, new Date().getFullYear());
  state.so = so; state.lg = lg; state.selDV = 0;
  $('#result').hidden = false;
  renderAll();
  $('#result').scrollIntoView({ behavior: 'smooth' });
  // cập nhật URL
  const u = new URL(location.href);
  u.searchParams.set('birth', `${inp.nam}-${pad2(inp.thang)}-${pad2(inp.ngay)}-${pad2(inp.gio)}-${inp.gioitinh}`);
  u.searchParams.set('phut', inp.phut);
  u.searchParams.set('tz', inp.tz);
  history.replaceState(null, '', u);
}

function renderAll() {
  renderInfo();
  renderTruTable();
  renderHanh();
  renderLuanGiai();
  renderDaiVan();
  renderLuuNien();
  renderHuong();
  renderSat();
  renderCung();
  renderCongThuc();
}

/* ---------------- Thẻ thông tin ---------------- */
function renderInfo() {
  const so = state.so;
  const p = so.pillars;
  const al = so.amLich;
  const tk = so.tietKhiHienTai;
  const tkLocal = B.jdToLocal(tk.jd, so.input.tz);
  $('#so-id').textContent = '#' + new Date().toISOString().slice(0, 14).replace(/[-T:]/g, '');
  $('#info-tomtat').textContent =
    `${so.input.gioitinh === 'nam' ? 'Nam' : 'Nữ'} · ${pad2(so.input.ngay)}/${pad2(so.input.thang)}/${so.input.nam} · ${pad2(so.input.gio)}:${pad2(so.input.phut)} (GMT${so.input.tz >= 0 ? '+' : ''}${so.input.tz}) — ${B.CAN[p[2].can]} ${B.CHI[p[2].chi]} ngày chủ`;
  const items = [
    ['Giờ sinh (giờ chi)', `${pad2(so.input.gio)}:${pad2(so.input.phut)} — giờ ${B.CHI[so.chiGio]} (trụ giờ: ${B.CAN[p[3].can]} ${B.CHI[p[3].chi]})`],
    ['Ngày can chi', `${B.CAN[p[2].can]} ${B.CHI[p[2].chi]}${so.sangNgaySau ? ' (sinh sau 23:00 → trụ ngày của hôm sau)' : ''}`],
    ['Âm lịch', `${al.ngay}/${al.thang}${al.nhuan ? ' nhuận' : ''}/${al.nam}`],
    ['Tiết khí hiện tại', `${tk.ten} (${pad2(tkLocal.d)}/${pad2(tkLocal.m)} ${pad2(tkLocal.h)}:${pad2(tkLocal.mi)})`],
    ['Mệnh (nạp âm năm)', `${p[0].napAm.ten}`],
    ['Ngày chủ (Nhật chủ)', `${B.CAN[p[2].can]} — hành ${B.CAN_HANH(p[2].can)}, ${p[2].can % 2 === 0 ? 'Dương' : 'Âm'}`],
    ['Đại vận', `${so.daiVan.thuan ? 'Thuận hành' : 'Nghịch hành'} — khởi vận ${so.daiVan.tuoiKhoiVan} tuổi ${so.daiVan.thangKhoiVan} tháng (từ ~${so.daiVan.namBatDau})`]
  ];
  $('#info-grid').innerHTML = items.map(([k, v]) =>
    `<div class="info-item"><div class="k">${k}</div><div class="v">${v}</div></div>`).join('');

  // cảnh báo
  const w = [];
  if (so.sangNgaySau) w.push('Sinh trong khoảng 23:00–24:00: theo quy tắc truyền thống, giờ Tý muộn được tính cho ngày hôm sau (trụ ngày & trụ giờ đã áp dụng).');
  const kcTruoc = so.jd - tk.jd; // giờ sinh cách tiết gần nhất bao lâu
  if (Math.abs(kcTruoc) < 1) w.push('Giờ sinh trong vòng 24 giờ kể từ thời điểm chuyển tiết khí — lá số có thể nhạy với múi giờ/độ chính xác của thời gian sinh, nên kiểm tra lại giờ sinh.');
  const wx = $('#info-warning');
  wx.hidden = w.length === 0;
  wx.innerHTML = w.map(x => '⚠️ ' + x).join('<br>');
}

/* ---------------- Bảng tứ trụ ---------------- */
function hanhTag(h) { return `<span class="hanh-tag" style="background:${HANH_MAU[h]}20;color:${HANH_MAU[h]};border:1px solid ${HANH_MAU[h]}55">${h}</span>`; }
function canCell(canIdx, tt, big) {
  const h = B.CAN_HANH(canIdx);
  return `<div class="${big ? 'can-big' : ''}" style="color:${HANH_MAU[h]}">${B.CAN[canIdx]}</div>
    <div><span class="pole">${B.CAN_AMDUONG(canIdx)}</span>${hanhTag(h)}</div>
    <div class="tt-small">${tt}</div>`;
}
function renderTruTable() {
  const so = state.so;
  const order = [0, 1, 2, 3];
  const cols = state.order === 0 ? order : order.slice().reverse();
  const p = so.pillars;
  const al = so.amLich;
  const dl = [`<b>${so.input.nam}</b>`, `<b>${so.input.thang}</b>`, `<b>${so.input.ngay}</b>`, `<b>${so.input.gio}:${pad2(so.input.phut)}</b>`];
  const alr = [`<b>${al.nam}</b>`, `<b>${al.thang}${al.nhuan ? 'N' : ''}</b>`, `<b>${al.ngay}</b>`, `—`];
  const nl = [`<b>${so.input.nam}</b>`, `<b>${so.tietThang.ten}</b>`, `<b>${al.ngay}</b>`, `—`];
  const head = cols.map(i => `<th>${p[i].ten.toUpperCase()}<div class="tt-small">${B.canChi(p[i].idx60)}</div></th>`).join('');
  const row = (label, cells) => `<tr><td class="rowlab">${label}</td>${cols.map(i => `<td>${cells[i]}</td>`).join('')}</tr>`;

  const canRow = p.map((x, i) => canCell(x.can, i === 2 ? '<b>Nhật Chủ</b>' : B.thapThan(so.dayCan, x.can), true));
  const chiRow = p.map(x => {
    const h = B.CHI_HANH[x.chi];
    return `<div class="can-big">${B.CHI[x.chi]}</div><div><span class="pole">${B.CHI_AMDUONG(x.chi)}</span>${hanhTag(h)}</div>`;
  });
  const tangRow = p.map(x => `<div class="tang">${x.tangCan.map(t =>
    `<div>${B.TT_VIET_TAT[t.tt]} <b style="color:${HANH_MAU[B.CAN_HANH(t.can)]}">${B.CAN[t.can]}</b> <span class="pole">${B.CAN_AMDUONG(t.can)}</span>${hanhTag(B.CAN_HANH(t.can))}</div>`).join('')}</div>`);
  const naRow = p.map(x => `<div class="napam">${x.napAm.ten}</div>`);
  const tsRow = p.map(x => `<div class="ts">${x.thanSat.length ? x.thanSat.map(s => `<span class="sat-pill" data-sat="${s}">${s}</span>`).join('') : '—'}</div>`);

  $('#tru-table').innerHTML = `
    <tr><td style="width:92px"></td>${head}</tr>
    ${row('DƯƠNG LỊCH', dl)}
    ${row('ÂM LỊCH', alr)}
    ${row('NÔNG LỊCH', nl)}
    ${row('THIÊN CAN', canRow)}
    ${row('ĐỊA CHI', chiRow)}
    ${row('TÀNG CAN', tangRow)}
    ${row('NẠP ÂM', naRow)}
    ${row('TRƯỜNG SINH', p.map(x => `<div class="ts">${x.truongSinh}</div>`))}
    ${row('THẦN SÁT', tsRow)}
  `;
  $('#legend-tt').innerHTML = 'Thập thần: ' + Object.entries(B.TT_VIET_TAT).map(([t, v]) => `<b>${v}</b>: ${t}`).join(' · ') +
    '. Nhấn vào <b>Thần Sát</b> để xem giải thích.';
  $$('#tru-table .sat-pill').forEach(el => el.addEventListener('click', () => showSat(el.dataset.sat)));
}

/* ---------------- Ngũ hành ---------------- */
function renderHanh() {
  const so = state.so, lg = state.lg;
  const d = so.diemNguHanh;
  const tong = Object.values(d).reduce((a, b) => a + b, 0);
  const max = Math.max(...Object.values(d));
  $('#hanh-bars').innerHTML = B.HANH.map(h => {
    const pct = Math.round(d[h] / tong * 100);
    return `<div class="hanh-row"><div class="hanh-name" style="color:${HANH_MAU[h]}">${h}</div>
      <div class="hanh-track"><div class="hanh-fill" style="width:${(d[h] / max * 100).toFixed(1)}%;background:${HANH_MAU[h]}"></div></div>
      <div class="hanh-val">${d[h].toFixed(1)} điểm · ${pct}%</div></div>`;
  }).join('');
  const bh = lg.bh;
  $('#hanh-note').innerHTML = `Tổng quan: ngày chủ <b style="color:${HANH_MAU[bh.dmHanh]}">${B.CAN[so.dayCan]} (${bh.dmHanh})</b> — ${bh.luc}; tỉ lệ "thể" (hành ngày chủ + hành sinh ngày chủ) = <b>${(bh.tyLe * 100).toFixed(0)}%</b>.
    ${bh.thieu.length ? ' Hành vắng/nhẹ gần như vắng: <b>' + bh.thieu.join(', ') + '</b>.' : ' Các hành đều có mặt.'}
    Dụng thần sơ bộ (hành cần bổ sung/cân bằng): <b>${bh.dung.join(', ')}</b>.`;
}

/* ---------------- Luận giải ---------------- */
function renderLuanGiai() {
  const so = state.so, lg = state.lg;
  const p = so.pillars;
  const kn = lg.khuyenNghi;
  const html = [];

  html.push(`<h3>1. Nhật chủ — chất người</h3>
    <p><b>${lg.ngayChu.t}</b></p><p>${lg.ngayChu.nd}</p>
    <p>Ngồi trên chi ${B.CHI[p[2].chi]} (hành ${B.CHI_HANH[p[2].chi]}) — giai đoạn ${p[2].truongSinh}: ${L.TRUONG_SINH_GIAI[p[2].truongSinh] || ''}</p>`);

  html.push(`<h3>2. Ngũ hành & thân cường – nhược</h3>
    <p>${lg.bh.danhGia}</p>
    <p>Thứ tự mạnh → yếu: ${lg.bh.muc.map(([h, v]) => `<b style="color:${HANH_MAU[h]}">${h}</b> (${v.toFixed(1)})`).join(' → ')}.
    ${lg.bh.thieu.length ? 'Lá số <b>thiếu hành ' + lg.bh.thieu.join(', ') + '</b> — những đặc tính của hành này ít thể hiện, nên chủ động bù (màu sắc, hướng, nghề phía dưới).' : ''}</p>`);

  html.push(`<h3>3. Tính cách (qua Thập thần)</h3><p>${lg.tinhCach}</p>`);
  html.push(`<div class="pill-row">${lg.tt.map(([t, v]) => `<span class="sat-pill">${t} × ${v % 1 ? v.toFixed(1) : v}</span>`).join('')}</div>`);

  html.push(`<h3>4. Tình duyên — gia đạo</h3>${lg.tinhDuyen.map(x => `<p>• ${x}</p>`).join('')}`);

  html.push(`<h3>5. Sự nghiệp & tài lộc</h3>${lg.suNghiep.map(x => `<p>• ${x}</p>`).join('')}`);

  html.push(`<h3>6. Sức khỏe</h3><p>${lg.sucKhoe}</p>`);

  html.push(`<h3>7. Quan hệ Can – Chi trong tứ trụ</h3>${lg.qh.map(x => `<p>• ${x}</p>`).join('')}`);

  html.push(`<h3>8. Thần sát hiện diện trong tứ trụ</h3>
    <div class="pill-row">${lg.satNoiBat.length ? lg.satNoiBat.map(s => `<span class="sat-pill" data-sat="${s}">${s}</span>`).join('') : '<span class="legend">Không có thần sát đặc biệt nào nằm đúng vị trí trên tứ trụ.</span>'}</div>`);

  html.push(`<h3>9. Khuyến nghị cân bằng Ngũ hành (dụng thần sơ bộ: ${kn.dung.join(' + ')})</h3>
    <ul>
      <li><b>Màu sắc hợp:</b> ${kn.mau}. <b>Màu nên hạn chế:</b> ${kn.mauTranh}.</li>
      <li><b>Hướng tốt (ngũ hành):</b> ${kn.huong}. Kết hợp thêm bảng Phương Hướng Bát Trạch phía dưới.</li>
      <li><b>Ngành nghề phù hợp:</b> ${kn.nghe}.</li>
      ${kn.thieu.length ? `<li><b>Hành thiếu:</b> ${kn.thieu.join(', ')} — nên bổ qua màu áo, vật phẩm, không gian sống và lĩnh vực hoạt động.</li>` : ''}
    </ul>`);

  const dvNow = lg.dv.filter(x => x.hienTai)[0];
  if (dvNow) {
    html.push(`<h3>10. Vận thời hiện tại (${new Date().getFullYear()})</h3>
      <p>Bạn đang trong <b>Đại vận ${dvNow.tuoi} tuổi (${dvNow.namBatDau}–${dvNow.namBatDau + 9})</b>: ${B.CAN[dvNow.can]} ${B.CHI[dvNow.chi]} (${dvNow.thapThanCan} — ${L.VAN_THEO_THAP_THAN[dvNow.thapThanCan]})</p>`);
  } else {
    html.push(`<h3>10. Vận thời hiện tại</h3><p>Chưa vào đại vận đầu tiên (khởi vận ${so.daiVan.tuoiKhoiVan} tuổi) — giai đoạn tiên thiên, chịu ảnh hưởng mạnh bởi gia đình, cha mẹ.</p>`);
  }

  $('#luan-giai-body').innerHTML = html.join('');
  $$('#luan-giai-body .sat-pill[data-sat]').forEach(el => el.addEventListener('click', () => showSat(el.dataset.sat)));
}

/* ---------------- Đại vận ---------------- */
function renderDaiVan() {
  const so = state.so;
  $('#dv-badge').textContent = `${so.daiVan.thuan ? 'Thuận hành' : 'Nghịch hành'} · khởi vận ${so.daiVan.tuoiKhoiVan} tuổi · tiết ${so.daiVan.tietChuan} (cách ${so.daiVan.soNgay.toFixed(1)} ngày ÷ 3)`;
  const rows = [];
  const head = ['TUỔI', 'ĐẠI VẬN', 'TÀNG CAN', 'NẠP ÂM', 'TRƯỜNG SINH', 'THẦN SÁT'];
  const body = so.daiVan.list.map(dv => {
    const canCellTxt = `${B.TT_VIET_TAT[dv.thapThanCan]} | <b style="color:${HANH_MAU[B.CAN_HANH(dv.can)]}">${B.CAN[dv.can]}</b> ${B.CAN_AMDUONG(dv.can)}${hanhTag(B.CAN_HANH(dv.can))}<br><b style="color:${HANH_MAU[B.CHI_HANH[dv.chi]]}">${B.CHI[dv.chi]}</b> ${B.CHI_AMDUONG(dv.chi)}${hanhTag(B.CHI_HANH[dv.chi])}`;
    const tang = dv.tangCan.map(t => `${B.TT_VIET_TAT[t.tt]} <b style="color:${HANH_MAU[B.CAN_HANH(t.can)]}">${B.CAN[t.can]}</b>`).join('<br>');
    return `<tr data-dv="${dv.k - 1}" class="${dv.hienTai ? 'sel' : ''}">
      <td><b>${dv.tuoi}</b><div class="tt-small">(${dv.namBatDau})</div></td>
      <td>${canCellTxt}</td><td class="tang">${tang}</td>
      <td class="napam">${dv.napAm.ten}</td><td class="ts">${dv.truongSinh}</td>
      <td class="ts">${dv.thanSat.length ? dv.thanSat.join(', ') : '—'}</td></tr>`;
  }).join('');
  rows.push(`<tr>${head.map(h => `<th>${h}</th>`).join('')}</tr>${body}`);
  $('#dv-table').innerHTML = rows.join('');
  $$('#dv-table tr[data-dv]').forEach(tr => tr.addEventListener('click', () => {
    state.selDV = +tr.dataset.dv;
    showDVDetail();
  }));
  showDVDetail();
}

function showDVDetail() {
  const dv = state.lg.dv[state.selDV];
  $$('#dv-table tr[data-dv]').forEach(tr => {
    if (+tr.dataset.dv === state.selDV) tr.classList.add('sel');
    else if (!state.lg.dv[+tr.dataset.dv].hienTai) tr.classList.remove('sel');
  });
  const ln = dv.luuNien.map(x =>
    `<span class="sat-pill" data-ln="${x.nam}"><b>${x.nam}</b> ${B.CAN[x.can]} ${B.CHI[x.chi]}</span>`).join('');
  $('#dv-detail').innerHTML = `
    <h4>Đại vận ${dv.tuoi} tuổi (${dv.namBatDau}–${dv.namBatDau + 9}) — ${B.CAN[dv.can]} ${B.CHI[dv.chi]} ${dv.hienTai ? '· ĐANG DIỄN BIẾN' : ''}</h4>
    <p>${dv.giai}</p>
    <p class="legend">Thần sát vận: ${dv.thanSat.length ? dv.thanSat.join(', ') : '—'} · Nạp âm: ${dv.napAm.ten}</p>
    <div style="margin-top:8px"><b>Lưu niên:</b></div>
    <div class="pill-row">${ln}</div>`;
  $$('#dv-detail .sat-pill[data-ln]').forEach(el => el.addEventListener('click', () => showLN(+el.dataset.ln)));
}

/* ---------------- Lưu niên grid ---------------- */
function renderLuuNien() {
  const so = state.so;
  let html = '<tr><th>10 năm Đại Vận</th>';
  for (const dv of so.daiVan.list) html += `<th>${dv.tuoi} tuổi<br><span class="tt-small">${dv.namBatDau} ${B.canChi(dv.idx60)}</span></th>`;
  html += '</tr>';
  for (let i = 0; i < 10; i++) {
    html += `<tr><td class="ln-head">Năm ${i + 1}</td>`;
    for (const dv of so.daiVan.list) {
      const ln = dv.luuNien[i];
      const isNow = ln.nam === new Date().getFullYear();
      html += `<td data-ln="${ln.nam}" class="${isNow ? 'sel' : ''}">${ln.nam}<br><b>${B.CAN[ln.can]} ${B.CHI[ln.chi]}</b></td>`;
    }
    html += '</tr>';
  }
  $('#ln-table').innerHTML = html;
  $$('#ln-table td[data-ln]').forEach(td => td.addEventListener('click', () => showLN(+td.dataset.ln)));
}

function showLN(nam) {
  const so = state.so;
  const idx = B.truNam(nam);
  const can = idx % 10, chi = idx % 12;
  const tt = B.thapThan(so.dayCan, can);
  const chiNgay = so.pillars[2].chi;
  const xung = B.CHI_LUC_XUNG.some(([a, b]) => (a === chi && b === chiNgay) || (b === chi && a === chiNgay));
  const hop = B.CHI_LUC_HOP.some(([a, b]) => (a === chi && b === chiNgay) || (b === chi && a === chiNgay));
  const tamHopNua = B.CHI_TAM_HOP.some(g => g.includes(chi) && g.includes(chiNgay));
  const dv = so.daiVan.list.find(d => nam >= d.namBatDau && nam < d.namBatDau + 10);
  const pt = [];
  pt.push(`Năm ${nam} — <b>${B.CAN[can]} ${B.CHI[chi]}</b> (nạp âm ${B.napAmOf(idx).ten}); can năm mang thập thần <b>${tt}</b> so với nhật chủ: ${L.VAN_THEO_THAP_THAN[tt]}`);
  if (xung) pt.push(`Chi năm ${B.CHI[chi]} <b>xung</b> với chi ngày ${B.CHI[chiNgay]}: năm dễ biến động, xáo trộn nơi ở, công việc, quan hệ.`);
  if (hop) pt.push(`Chi năm ${B.CHI[chi]} <b>hợp</b> với chi ngày ${B.CHI[chiNgay]}: năm có duyên lãi, hợp tác, hôn nhân.`);
  if (tamHopNua) pt.push(`Chi năm nằm trong bộ tam hợp với chi ngày: khí tương trợ, việc thuận.`);
  if (dv) pt.push(`Nằm trong đại vận ${dv.tuoi} tuổi ${B.CAN[dv.can]} ${B.CHI[dv.chi]} (${dv.namBatDau}–${dv.namBatDau + 9}).`);
  $('#ln-detail').innerHTML = `<h4>Chi tiết lưu niên</h4>${pt.map(x => `<p>• ${x}</p>`).join('')}`;
  $('#ln-detail').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ---------------- Bát trạch ---------------- */
function renderHuong() {
  const so = state.so;
  const q = so.menhQuai;
  const [tenQ, hanhQ, viTri] = B.QUAI[q];
  $('#quai-note').innerHTML = `Mệnh quái: <b>${tenQ} (${hanhQ})</b> — ${so.input.gioitinh === 'nam' ? 'nam' : 'nữ'} sinh năm ${so.input.nam} (mệnh quái tính theo năm dương lịch sinh). Bảng 8 hướng theo Đại Du Niên — 4 hướng TỐT nên lựa chọn cho phòng ngủ, bàn làm việc, hướng nhà; 4 hướng XẤU nên tránh hoặc hóa giải:`;
  const bt = so.batTrach;
  const tenTot = ['Sinh Khí', 'Thiên Y', 'Diên Niên', 'Phục Vị'];
  const items = [];
  for (const [ten, quaiNum] of Object.entries(bt)) {
    const [t, h, vi] = B.QUAI[quaiNum];
    const good = tenTot.includes(ten);
    items.push(`<div class="huong-item ${good ? 'good' : 'bad'}">
      <div><span class="${good ? 'tag-g' : 'tag-b'}">${good ? 'TỐT' : 'XẤU'}</span>
      <div class="h-name">${ten}</div></div>
      <div class="h-dir"><b>${vi}</b><br>${t} · ${h}</div></div>`);
  }
  $('#huong-grid').innerHTML = items.join('');
}

/* ---------------- Thần sát ---------------- */
function showSat(ten) {
  const g = L.THAN_SAT_GIAI[ten];
  $('#sat-detail').innerHTML = `<h4>${ten}</h4><p>${g || 'Thần sát phụ trợ — xem bảng quy tắc trong mục Công thức.'}</p>`;
  $('#sat-detail').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function renderSat() {
  const so = state.so;
  const tenList = [...new Set(so.thanSat.map(s => s.ten))];
  const rows = [];
  rows.push('<tr><th>Thần Sát</th><th>Theo Trụ Ngày</th><th>Theo Trụ Năm</th></tr>');
  for (const ten of tenList) {
    const vN = so.thanSat.filter(s => s.ten === ten && s.nguon === 'ngay').map(s => s.loai === 'can' ? B.CAN[s.vi] : B.CHI[s.vi]);
    const vY = so.thanSat.filter(s => s.ten === ten && s.nguon === 'nam').map(s => s.loai === 'can' ? B.CAN[s.vi] : B.CHI[s.vi]);
    if (!vN.length && !vY.length) continue;
    rows.push(`<tr><td class="rowlab">${ten}</td>
      <td><b>${vN.join(', ') || '—'}</b></td>
      <td><b>${vY.join(', ') || '—'}</b></td></tr>`);
  }
  $('#sat-table').innerHTML = rows.join('');
}

/* ---------------- Thai cung / Mệnh cung ---------------- */
function renderCung() {
  const so = state.so;
  const mc = so.menhCung, tc = so.thaiCung;
  const items = [
    ['Mệnh Cung (trụ tháng lùi 1)', `${B.CAN[mc.can]} ${B.CHI[mc.chi]}`],
    ['Thai Cung (can ngày +2, chi ngày +6)', `${B.CAN[tc.can]} ${B.CHI[tc.chi]}`]
  ];
  $('#cung-grid').innerHTML = items.map(([k, v]) => `<div class="cung-item"><div class="k">${k}</div><div class="v">${v}</div></div>`).join('');
  $('#cung-note').textContent = 'Công thức trùng khớp cách tính của battu.kabala.vn: Mệnh Cung = trụ tháng lùi lại 1 cung (can −1, chi −1); Thai Cung = can trụ ngày cộng 2, chi trụ ngày cộng 6.';
}

/* ---------------- Copy ---------------- */
function duLieuText() {
  const so = state.so;
  const p = so.pillars;
  const al = so.amLich;
  const line = '='.repeat(50);
  const tr = p.map(x => {
    const tang = x.tangCan.map(t => `${B.CAN[t.can]}(${t.tt})`).join(', ');
    return `- ${x.ten}: ${B.CAN[x.can]} ${B.CHI[x.chi]} | Tàng can: ${tang} | Nạp âm: ${x.napAm.ten} | Trường sinh: ${x.truongSinh} | Thần sát: ${x.thanSat.join(', ') || 'không có'}`;
  }).join('\n');
  const dv = so.daiVan.list.map(d => `- ${d.tuoi} tuổi (${d.namBatDau}): ${B.CAN[d.can]} ${B.CHI[d.chi]}`).join('\n');
  return `${line}
DỮ LIỆU LÁ SỐ BÁT TỰ (Tứ Trụ - Tử Bình)
${line}
Giới tính: ${so.input.gioitinh === 'nam' ? 'Nam' : 'Nữ'}
Dương lịch: ${pad2(so.input.ngay)}/${pad2(so.input.thang)}/${so.input.nam} ${pad2(so.input.gio)}:${pad2(so.input.phut)} (GMT${so.input.tz})
Âm lịch: ${al.ngay}/${al.thang}${al.nhuan ? ' nhuận' : ''}/${al.nam}
Tiết khí: ${so.tietKhiHienTai.ten} | Trụ tháng bắt đầu từ tiết ${so.tietThang.ten}
${line}
TỨ TRỤ:
${tr}
${line}
Ngày chủ: ${B.CAN[p[2].can]} (${B.CAN_HANH(p[2].can)}) | Mệnh nạp âm: ${p[0].napAm.ten}
Ngũ hành: ${B.HANH.map(h => `${h}=${so.diemNguHanh[h].toFixed(1)}`).join(' ')}
Thân cường nhược: ${state.lg.bh.luc} | Dụng thần sơ bộ: ${state.lg.bh.dung.join(', ')}
Đại vận: ${so.daiVan.thuan ? 'thuận' : 'nghịch'} hành, khởi vận ${so.daiVan.tuoiKhoiVan} tuổi ${so.daiVan.thangKhoiVan} tháng
${dv}
${line}
Mệnh cung: ${B.CAN[so.menhCung.can]} ${B.CHI[so.menhCung.chi]} | Thai cung: ${B.CAN[so.thaiCung.can]} ${B.CHI[so.thaiCung.chi]}
Mệnh quái: ${B.QUAI[so.menhQuai][0]} — hướng Sinh Khí: ${B.QUAI[so.batTrach['Sinh Khí']][2]}
(Công thức tham chiếu battu.kabala.vn — chỉ mang tính tham khảo, nghiên cứu)
`;
}
function copyText(txt, btn, msg) {
  const done = () => { const old = btn.textContent; btn.textContent = msg; setTimeout(() => btn.textContent = old, 1500); };
  if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done).catch(() => fallbackCopy(txt, done));
  else fallbackCopy(txt, done);
}
function fallbackCopy(txt, done) {
  const ta = document.createElement('textarea');
  ta.value = txt; document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); } catch (e) { }
  ta.remove(); done();
}
function copyDuLieu() { if (state.so) copyText(duLieuText(), $('#btn-copy'), '✓ Đã copy!'); }
function copyLink() { copyText(location.href, $('#btn-link'), '✓ Đã copy link!'); }

/* ---------------- Công thức (accordion tĩnh) ---------------- */
function renderCongThuc() {
  const items = [
    ['① Trụ NĂM — mốc Lập Xuân, (năm − 4) mod 60',
      `Năm Bát Tự bắt đầu tại tiết <code>Lập Xuân</code> (kinh độ Mặt Trời 315°), không phải 1/1 dương lịch. Sinh trước Lập Xuân → tính năm trước đó. Sau đó: <code>chi số hoa giáp = (năm − 4) mod 60</code> (0 = Giáp Tý).`],
    ['② Trụ THÁNG — chi theo 12 tiết, can theo Ngũ Hổ Đốn',
      `Chi tháng đổi tại mỗi <b>tiết</b> (Lập Xuân = tháng Dần, Kinh Trập = Mão, Thanh Minh = Thìn, …, Tiểu Hàn = Sửu). Can tháng = Ngũ Hổ Đốn từ can năm:<br>
      <code>can tháng = ((can năm mod 5) × 2 + số tháng kể từ Dần + 2) mod 10</code><br>
      (Giáp/Kỷ năm → tháng Dần bắt đầu Bính; Ất/Canh → Mậu; Bính/Tân → Canh; Đinh/Nhâm → Nhâm; Mậu/Quý → Giáp.)`],
    ['③ Trụ NGÀY — (JDN + 49) mod 60',
      `Số ngày Julius của ngày sinh (lưu ý: sinh 23:00–24:00 dùng ngày hôm sau vì giờ Tý muộn thuộc về ngày kế): <code>trụ ngày = (JDN + 49) mod 60</code>, 0 = Giáp Tý. Đối chiếu: 13/03/2024 = Bính Tý.`],
    ['④ Trụ GIỜ — chi giờ 2 tiếng, can theo Ngũ Thử Đốn',
      `Giờ Tý = 23:00–00:59, Sửu = 1–3h, Dần = 3–5h … Hợi = 21–23h. Can giờ từ can ngày:<br>
      <code>can giờ = ((can ngày mod 5) × 2 + chỉ số chi giờ) mod 10</code><br>
      (Giáp/Kỷ ngày → giờ Tý là Giáp Tý; Bính/Tân ngày → giờ Tý là Mậu Tý …)`],
    ['⑤ Tàng can (12 chi)',
      `Tý: Quý · Sửu: Kỷ,Quý,Tân · Dần: Giáp,Bính,Mậu · Mão: Ất · Thìn: Mậu,Ất,Quý · Tỵ: Bính,Canh,Mậu · Ngọ: Đinh,Kỷ · Mùi: Kỷ,Đinh,Ất · Thân: Canh,Nhâm,Mậu · Dậu: Tân · Tuất: Mậu,Tân,Đinh · Hợi: Nhâm,Giáp. Mỗi tàng can được gán Thập thần so với ngày chủ.`],
    ['⑥ Thập thần (10 quan hệ với ngày chủ)',
      `Cùng hành cùng âm dương = <b>Tỷ Kiên</b>; cùng hành khác âm dương = <b>Kiếp Tài</b>. Ngày chủ sinh ra: cùng cực = <b>Thực Thần</b>, khác = <b>Thương Quan</b>. Sinh vào ngày chủ: cùng = <b>Thiên Ấn</b>, khác = <b>Chính Ấn</b>. Ngày chủ khắc: cùng = <b>Thiên Tài</b>, khác = <b>Chính Tài</b>. Khắc ngày chủ: cùng = <b>Thất Sát</b>, khác = <b>Chính Quan</b>.`],
    ['⑦ Nạp âm (30 cặp hoa giáp)',
      `Mỗi 2 hoa giáp liền kề chia 30 cặp: Giáp Tý–Ất Sửu = Hải Trung Kim, Bính Dần–Đinh Mão = Lư Trung Hỏa … Nhâm Tuất–Quý Hợi = Đại Hải Thủy. Công thức: <code>chỉ số cặp = floor(hoa giáp / 2) mod 30</code>.`],
    ['⑧ Trường sinh (12 giai đoạn) — tính cho từng trụ',
      `Mỗi trụ: đối chiếu <b>can trụ</b> với <b>chi trụ</b>. Điểm Trường Sinh: Giáp→Hợi, Ất→Ngọ, Bính/Mậu→Dần, Đinh/Kỷ→Dậu, Canh→Tỵ, Tân→Tý, Nhâm→Thân, Quý→Mão. Dương can <b>thuận hành</b>, âm can <b>nghịch hành</b> qua 12 giai đoạn: Trường Sinh → Mộc Dục → Quan Đới → Lâm Quan → Đế Vượng → Suy → Bệnh → Tử → Mộ → Tuyệt → Thai → Dưỡng. (Kiểm chứng: Giáp Thìn → Suy, Đinh Mão → Bệnh, Bính Tý → Thai, Mậu Tý → Thai — trùng bảng kabala.)`],
    ['⑨ Thần sát',
      `Nhóm tam hợp chi (Thân-Tý-Thìn / Dần-Ngọ-Tuất / Tỵ-Dậu-Sửu / Hợi-Mão-Mùi) làm gốc: Tướng Tinh, Hoa Cái, Kiếp Sát, Đào Hoa, Thiên Mã, Cô Thần/Quả Tú. Theo chi: Hồng Loan, Thiên Hỷ. Theo can (ngày & năm): Thiên Ất Quý Nhân, Văn Xương, Học Đường, Thập Can Lộc, Dương Nhận. Theo chi tháng: Nguyệt Đức, Thiên Đức. Không Vong: 2 chi khuyết của cặp hoa giáp trụ ngày.`],
    ['⑩ Đại vận & khởi vận (3 ngày = 1 năm)',
      `Hướng: nam sinh năm dương can / nữ năm âm can → <b>thuận</b>; ngược lại → <b>nghịch</b>. Thuận: đếm số ngày từ giờ sinh tới <b>tiết kế tiếp</b>; Nghịch: từ <b>tiết trước</b> tới giờ sinh. Quy đổi <b>3 ngày = 1 năm, 1 ngày = 4 tháng, 2 giờ = 5 ngày</b>. Chuỗi đại vận: lấy trụ tháng cộng (thuận) / trừ (nghịch) từng hoa giáp, mỗi vận 10 năm kèm 10 lưu niên.`],
    ['⑪ Mệnh Cung · Thai Cung',
      `Mệnh Cung = <b>trụ tháng lùi 1</b> (can −1, chi −1). Thai Cung = <b>can ngày +2, chi ngày +6</b>. (Kiểm chứng kabala: tháng Đinh Mão → Mệnh Cung Bính Dần; ngày Bính Tý → Thai Cung Mậu Ngọ.)`],
    ['⑫ Bát trạch mệnh quái (Phương hướng)',
      `Tổng các chữ số năm sinh rút về 1 chữ số s: nam = <code>11 − s</code>, nữ = <code>s + 4</code> (rút về 1–9; số 5: nam → Khôn, nữ → Cấn). Bảng 8 hướng (Đại Du Niên): Sinh Khí, Thiên Y, Diên Niên, Phục Vị (Tốt) — Họa Hại, Ngũ Quỷ, Lục Sát, Tuyệt Mệnh (Xấu).`],
    ['⑬ Tiết khí & Âm lịch (nền thiên văn)',
      `Tiết khí = 24 thời điểm kinh độ hoàng đạo Mặt Trời đạt k × 15° (tính theo Meeus + ΔT + nutation, sai số ±7 phút). Âm lịch = thuật toán Hồ Ngọc Đức: tháng 11 âm lịch là tháng chứa Đông Chí; tháng nhuận = tháng không chứa trung khí đầu tiên sau tháng 11 (múi giờ GMT+7).`],
    ['⑭ Ngũ hành & luận giải',
      `Điểm ngũ hành = tổng trọng số: thiên can ×1.0, tàng can chính khí ×0.7, trung khí ×0.3, dư khí ×0.15 (chi tháng ×1.3). Thân vượng khi (hành ngày chủ + hành sinh ngày chủ) ≥ 50%. Dụng thần sơ bộ: thân mạnh → dùng hành khắc/tiêu tiết; thân yếu → hành sinh/tương trợ. Các mục luận giải (tính cách, tình duyên, sự nghiệp, sức khỏe, đại vận) suy diễn từ phân bố thập thần, thần sát và ngũ hành.`
    ]
  ];
  $('#cong-thuc-body').innerHTML = items.map(([t, b]) => `
    <div class="acc-item"><div class="acc-head"><span>${t}</span><span>▾</span></div><div class="acc-body">${b}</div></div>`).join('');
  $$('.acc-item .acc-head').forEach(h => h.addEventListener('click', () => h.parentElement.classList.toggle('open')));
}

/* ---------------- Khởi động ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  initForm();
  renderCongThuc();
  const fromURL = docURL();
  if (fromURL) { ganURL(fromURL); taoLaSo(); }
});
})();
