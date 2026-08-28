/* Test đối chiếu engine với lá số chuẩn của battu.kabala.vn */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const B = require('./assets/battu-core.js');

const fails = [];
function eq(name, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) fails.push(`${name}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  console.log(`${ok ? '✅' : '❌'} ${name} = ${JSON.stringify(actual)}${ok ? '' : ' (kỳ vọng ' + JSON.stringify(expected) + ')'}`);
}

/* ---------- 1. Lá số chuẩn của kabala: nam 13/03/2024 00:00 ---------- */
const so = B.lapLaSo({ gioitinh: 'nam', nam: 2024, thang: 3, ngay: 13, gio: 0, phut: 0, tz: 7 });
const p = so.pillars;
eq('Trụ Năm', B.canChi(p[0].idx60), 'Giáp Thìn');
eq('Trụ Tháng', B.canChi(p[1].idx60), 'Đinh Mão');
eq('Trụ Ngày', B.canChi(p[2].idx60), 'Bính Tý');
eq('Trụ Giờ', B.canChi(p[3].idx60), 'Mậu Tý');
eq('Âm lịch', [so.amLich.ngay, so.amLich.thang, so.amLich.nam, so.amLich.nhuan], [4, 2, 2024, 0]);
eq('Tiết khí hiện tại', so.tietKhiHienTai.ten, 'Kinh Trập');
eq('Nạp âm năm', p[0].napAm.ten, 'Phú Đăng Hỏa');
eq('Nạp âm tháng', p[1].napAm.ten, 'Lư Trung Hỏa');
eq('Nạp âm ngày', p[2].napAm.ten, 'Giản Hạ Thủy');
eq('Nạp âm giờ', p[3].napAm.ten, 'Tích Lịch Hỏa');
eq('Trường sinh 4 trụ (theo từng trụ)', p.map(x => x.truongSinh), ['Suy', 'Bệnh', 'Thai', 'Thai']);
eq('Tàng can năm (thập thần)', p[0].tangCan.map(t => B.CAN[t.can] + '/' + t.tt), ['Mậu/Thực Thần', 'Ất/Chính Ấn', 'Quý/Chính Quan']);
eq('Thập thần can năm', B.thapThan(2, 0), 'Thiên Ấn');
eq('Thập thần can tháng', B.thapThan(2, 3), 'Kiếp Tài');
eq('Thập thần can giờ', B.thapThan(2, 4), 'Thực Thần');
eq('Hoa Cái ở trụ năm', p[0].thanSat.includes('Hoa Cái'), true);
eq('Nguyệt Đức ở trụ năm', p[0].thanSat.includes('Nguyệt Đức'), true);
eq('Tướng Tinh ở trụ ngày/giờ', p[2].thanSat.includes('Tướng Tinh') && p[3].thanSat.includes('Tướng Tinh'), true);
eq('Đại vận thuận', so.daiVan.thuan, true);
eq('Tuổi khởi vận', so.daiVan.tuoiKhoiVan, 7);
eq('Đại vận 1', B.canChi(so.daiVan.list[0].idx60), 'Mậu Thìn');
eq('Đại vận 2', B.canChi(so.daiVan.list[1].idx60), 'Kỷ Tỵ');
eq('Đại vận 9', B.canChi(so.daiVan.list[8].idx60), 'Bính Tý');
eq('Năm bắt đầu đại vận 1', so.daiVan.list[0].namBatDau, 2031);
eq('Tuổi đại vận 2 (kabala: 17)', so.daiVan.list[1].tuoi, 17);
eq('Năm bắt đầu đại vận 2', so.daiVan.list[1].namBatDau, 2041);
eq('Lưu niên 2041 (đại vận 2)', B.canChi(so.daiVan.list[1].luuNien[0].idx60), 'Tân Dậu');
eq('Mệnh Cung', B.CAN[so.menhCung.can] + ' ' + B.CHI[so.menhCung.chi], 'Bính Dần');
eq('Thai Cung', B.CAN[so.thaiCung.can] + ' ' + B.CHI[so.thaiCung.chi], 'Mậu Ngọ');
eq('Mệnh quái (Chấn)', so.menhQuai, 3);
eq('Bát trạch Chấn: Sinh Khí ở Ly', so.batTrach['Sinh Khí'], 9);
eq('Bát trạch Chấn: Tuyệt Mệnh ở Đoài', so.batTrach['Tuyệt Mệnh'], 7);

/* Lưu niên 2031-2040 của đại vận 1 */
eq('Lưu niên 2031', B.canChi(so.daiVan.list[0].luuNien[0].idx60), 'Tân Hợi');
eq('Lưu niên 2040', B.canChi(so.daiVan.list[0].luuNien[9].idx60), 'Canh Thân');

/* ---------- 2. Kiểm tra tiết khí 2024 (theo bảng tinhmenhdo.com, giờ VN, dung sai 12 phút) ---------- */
function fmt(jd) { const d = B.jdToLocal(jd, 7); return `${String(d.d).padStart(2,'0')}/${String(d.m).padStart(2,'0')}/${d.y} ${String(d.h).padStart(2,'0')}:${String(d.mi).padStart(2,'0')}`; }
function jdOf(y, m, d, h, mi) { return B.jdUTC(y, m, d, h - 7, mi); } // bảng giờ VN -> UTC
const tk2024 = B.tietKhiNam(2024);
const byName = Object.fromEntries(tk2024.map(x => [x.ten, x.jd]));
console.log('\n— Tiết khí 2024 (so với bảng chính xác, dung sai 12 phút):');
const chuan = [
  ['Đại Hàn', jdOf(2024, 1, 20, 21, 7)], ['Lập Xuân', jdOf(2024, 2, 4, 15, 27)],
  ['Kinh Trập', jdOf(2024, 3, 5, 9, 22)], ['Xuân Phân', jdOf(2024, 3, 20, 10, 6)],
  ['Thanh Minh', jdOf(2024, 4, 4, 14, 2)], ['Hạ Chí', jdOf(2024, 6, 21, 3, 51)],
  ['Lập Thu', jdOf(2024, 8, 7, 7, 9)], ['Thu Phân', jdOf(2024, 9, 22, 19, 43)],
  ['Đông Chí', jdOf(2024, 12, 21, 16, 20)]
];
void chuan;
for (const [ten, jdChuan] of chuan) {
  const lechPhut = Math.round((byName[ten] - jdChuan) * 24 * 60);
  const ok = Math.abs(lechPhut) <= 12;
  if (!ok) fails.push(`Tiết khí ${ten} lệch ${lechPhut} phút`);
  console.log(`${ok ? '✅' : '❌'} ${ten}: engine ${fmt(byName[ten])} (chuẩn ${fmt(jdChuan)}) lệch ${lechPhut}p`);
}

/* ---------- 3. Âm lịch thêm mẫu ---------- */
console.log('\n— Âm lịch thêm:');
eq('Tết 2024 (10/02/2024)', [B.dl2al(10, 2, 2024, 7).ngay, B.dl2al(10, 2, 2024, 7).thang], [1, 1]);
eq('28/01/2025 là 29 tháng Chạp năm Giáp Thìn', [B.dl2al(28, 1, 2025, 7).ngay, B.dl2al(28, 1, 2025, 7).thang, B.dl2al(28, 1, 2025, 7).nam], [29, 12, 2024]);
const al = B.dl2al(1, 4, 2023, 7); // tháng nhuận? 2023 có tháng 2 nhuận: 22/03/2023 = 1/2 nhuận
console.log('  01/04/2023 âm lịch:', JSON.stringify(B.dl2al(22, 3, 2023, 7)));
eq('22/03/2023 là 1 tháng 2 nhuận', [B.dl2al(22, 3, 2023, 7).ngay, B.dl2al(22, 3, 2023, 7).thang, B.dl2al(22, 3, 2023, 7).nhuan], [1, 2, 1]);

/* ---------- 4. Trụ ngày mốc khác ---------- */
eq('01/01/1900 là ngày Giáp Tuất', B.canChi(B.truNgayJDN(B.jdn(1900, 1, 1))), 'Giáp Tuất');
// 23:00 -> sang ngày sau
const so23 = B.lapLaSo({ gioitinh: 'nu', nam: 2000, thang: 1, ngay: 1, gio: 23, phut: 30, tz: 7 });
eq('Sinh 23:30 01/01/2000 -> trụ ngày của 02/01/2000', B.canChi(so23.pillars[2].idx60) === B.canChi(B.truNgayJDN(B.jdn(2000, 1, 2))), true);

/* ---------- 5. Nữ âm thuận / nghịch ---------- */
// nữ 1990 (Canh Ngọ - dương can) => nghịch
const nu90 = B.lapLaSo({ gioitinh: 'nu', nam: 1990, thang: 6, ngay: 15, gio: 10, tz: 7 });
eq('Nữ năm dương can => đại vận nghịch', nu90.daiVan.thuan, false);
const nam90 = B.lapLaSo({ gioitinh: 'nam', nam: 1990, thang: 6, ngay: 15, gio: 10, tz: 7 });
eq('Nam năm dương can => đại vận thuận', nam90.daiVan.thuan, true);

/* ---------- 6. Thần sát bảng 2 cột (kiểm tra với kabala) ---------- */
// theo trụ ngày Bính Tý: Quý nhân Hợi/Dậu, Văn Xương Thân, Học Đường Dần, Đào Hoa Dậu, Thiên Mã Dần, Hồng Loan Mão, Cô Thần Dần, Quả Tú Tuất, Kiếp Sát Tỵ
const satNgay = {};
for (const s of so.thanSat) if (s.nguon === 'ngay') { (satNgay[s.ten] = satNgay[s.ten] || []).push(s.vi); }
eq('Quý nhân (theo ngày Bính)', satNgay['Quý Nhân'], [11, 9]);
eq('Văn Xương (theo ngày Bính)', satNgay['Văn Xương'], [8]);
eq('Học Đường (theo ngày Bính)', satNgay['Học Đường'], [2]);
eq('Đào Hoa (theo ngày Tý)', satNgay['Đào Hoa'], [9]);
eq('Thiên Mã', satNgay['Thiên Mã'], [2]);
eq('Hồng Loan (theo ngày Tý)', satNgay['Hồng Loan'], [3]);
eq('Cô Thần', satNgay['Cô Thần'], [2]);
eq('Quả Tú', satNgay['Quả Tú'], [10]);
eq('Kiếp Sát', satNgay['Kiếp Sát'], [5]);
const satNam = {};
for (const s of so.thanSat) if (s.nguon === 'nam') { (satNam[s.ten] = satNam[s.ten] || []).push(s.vi); }
eq('Quý nhân (theo năm Giáp)', satNam['Quý Nhân'], [1, 7]);
eq('Hồng Loan (theo năm Thìn)', satNam['Hồng Loan'], [11]);

console.log(fails.length ? `\n=== ${fails.length} LỖI ===\n` + fails.join('\n') : '\n=== TẤT CẢ PASS ===');
process.exit(fails.length ? 1 : 0);
