/* =========================================================================
 * BATTU-CORE.JS — Engine lập Lá Số Bát Tự (Tứ Trụ / Tử Bình)
 * Công thức tham chiếu theo battu.kabala.vn (đối chiếu lá số mẫu
 * 13/03/2024 00:00 nam: Giáp Thìn / Đinh Mão / Bính Tý / Mậu Tý)
 * Bao gồm:
 *  - Lịch Julian, mặt trời (kinh độ hoàng đạo), tiết khí 24 cửa
 *  - Sóc (ngày đầu tháng âm), chuyển đổi Dương lịch <-> Âm lịch (múi 7)
 *  - Bốn trụ Năm-Tháng-Ngày-Giờ (can chi)
 *  - Tàng can, Thập thần, Nạp âm, Trường sinh (12 giai đoạn)
 *  - Thần sát, Đại vận + Lưu niên, Mệnh cung, Thai cung, Bát trạch
 * ========================================================================= */
(function (global) {
'use strict';

/* ------------------------------ Hằng số ------------------------------ */
const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const HANH = ['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy'];
const HANH_COLOR = { Mộc: '#58b368', Hỏa: '#ef5350', Thổ: '#d3a24a', Kim: '#dfe3e8', Thủy: '#54b8e8' };

const CAN_HANH = i => HANH[Math.floor(i / 2)];            // GiápẤt=Mộc ... NhâmQuý=Thủy
const CHI_HANH = [4, 3, 0, 0, 3, 1, 1, 3, 2, 2, 3, 4].map(i => HANH[i]); // Tý=Thủy...
const CAN_AMDUONG = i => (i % 2 === 0 ? '+' : '-');       // + dương, - âm
const CHI_AMDUONG = i => (i % 2 === 0 ? '+' : '-');

/* Nạp âm 30 cặp hoa giáp (đúng thứ tự cặp: GiápTý/ẤtSửu ... NhâmTuất/QuýHợi) */
const NAP_AM = [
  'Hải Trung Kim', 'Lư Trung Hỏa', 'Đại Lâm Mộc', 'Lộ Bàng Thổ', 'Kiếm Phong Kim',
  'Sơn Đầu Hỏa', 'Giản Hạ Thủy', 'Thành Đầu Thổ', 'Bạch Lạp Kim', 'Dương Liễu Mộc',
  'Tỉnh Tuyền Thủy', 'Ốc Thượng Thổ', 'Tích Lịch Hỏa', 'Tùng Bá Mộc', 'Trường Lưu Thủy',
  'Sa Trung Kim', 'Sơn Hạ Hỏa', 'Bình Địa Mộc', 'Bích Thượng Thổ', 'Kim Bạch Kim',
  'Phú Đăng Hỏa', 'Thiên Hà Thủy', 'Đại Dịch Thổ', 'Thoa Xuyến Kim', 'Tang Đố Mộc',
  'Đại Khê Thủy', 'Sa Trung Thổ', 'Thiên Thượng Hỏa', 'Thạch Lựu Mộc', 'Đại Hải Thủy'
];
const NAP_AM_HANH = ['Kim', 'Hỏa', 'Mộc', 'Thổ', 'Kim', 'Hỏa', 'Thủy', 'Thổ', 'Kim', 'Mộc',
  'Thủy', 'Thổ', 'Hỏa', 'Mộc', 'Thủy', 'Kim', 'Hỏa', 'Mộc', 'Thổ', 'Kim',
  'Hỏa', 'Thủy', 'Thổ', 'Kim', 'Mộc', 'Thủy', 'Thổ', 'Hỏa', 'Mộc', 'Thủy'];

/* Tàng can: [chính khí, trung khí, dư khí] (chỉ số can, -1 = không có) */
const TANG_CAN = [
  [9],           // Tý: Quý
  [5, 9, 7],     // Sửu: Kỷ, Quý, Tân
  [0, 2, 4],     // Dần: Giáp, Bính, Mậu
  [1],           // Mão: Ất
  [4, 1, 9],     // Thìn: Mậu, Ất, Quý
  [2, 6, 4],     // Tỵ: Bính, Canh, Mậu
  [3, 5],        // Ngọ: Đinh, Kỷ
  [5, 3, 1],     // Mùi: Kỷ, Đinh, Ất
  [6, 8, 4],     // Thân: Canh, Nhâm, Mậu
  [7],           // Dậu: Tân
  [4, 7, 3],     // Tuất: Mậu, Tân, Đinh
  [8, 0]         // Hợi: Nhâm, Giáp
];

/* Thập thần (đối chiếu ngày chủ) */
const THAP_THAN = ['Tỷ Kiên', 'Kiếp Tài', 'Thực Thần', 'Thương Quan', 'Chính Tài',
  'Thiên Tài', 'Chính Quan', 'Thất Sát', 'Chính Ấn', 'Thiên Ấn'];
const TT_VIET_TAT = { 'Tỷ Kiên': 'TK', 'Kiếp Tài': 'KT', 'Thực Thần': 'TH', 'Thương Quan': 'TQ',
  'Chính Tài': 'CT', 'Thiên Tài': 'TT', 'Chính Quan': 'CQ', 'Thất Sát': 'TS',
  'Chính Ấn': 'CA', 'Thiên Ấn': 'TA' };

/* Trường sinh 12 giai đoạn + điểm trường sinh của 10 can
 * (Giáp sinh Hợi, Ất sinh Ngọ, Bính/Mậu sinh Dần, Đinh/Kỷ sinh Dậu,
 *  Canh sinh Tỵ, Tân sinh Tý, Nhâm sinh Thân, Quý sinh Mão.
 *  Dương can thuận hành, âm can nghịch hành — trùng khớp bảng tra của battu.kabala.vn) */
const TRUONG_SINH = ['Trường Sinh', 'Mộc Dục', 'Quan Đới', 'Lâm Quan', 'Đế Vượng',
  'Suy', 'Bệnh', 'Tử', 'Mộ', 'Tuyệt', 'Thai', 'Dưỡng'];
const SINH_TAI = [11, 6, 2, 9, 2, 9, 5, 0, 8, 3]; // chi trường sinh của từng can

function truongSinhCanChi(canIdx, chiIdx) {
  const start = SINH_TAI[canIdx];
  const dir = canIdx % 2 === 0 ? 1 : -1; // dương thuận, âm nghịch
  const k = (((chiIdx - start) * dir) % 12 + 12) % 12;
  return TRUONG_SINH[k];
}

/* --------------------------- Thiên văn ------------------------------- */
const RAD = Math.PI / 180;
const mod360 = x => ((x % 360) + 360) % 360;

/* Ngày Julius (số nguyên, trưa 12h) từ dương lịch */
function jdn(y, m, d) {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy +
    Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}
/* JD (thực, theo giờ UTC) */
function jdUTC(y, m, d, h, mi) {
  return jdn(y, m, d) - 0.5 + (h + (mi || 0) / 60) / 24;
}
/* Đổi JDUTC -> (năm, tháng, ngày, giờ, phút) múi giờ tz */
function jdToLocal(dt, tz) {
  dt += tz / 24;
  const z = Math.floor(dt + 0.5);
  const f = dt + 0.5 - z;
  let a = z;
  if (z >= 2299161) { const alpha = Math.floor((z - 1867216.25) / 36524.25); a = z + 1 + alpha - Math.floor(alpha / 4); }
  const b = a + 1524, c = Math.floor((b - 122.1) / 365.25), d0 = Math.floor(365.25 * c), e = Math.floor((b - d0) / 30.6001);
  const day = b - d0 - Math.floor(30.6001 * e);
  const month = e < 14 ? e - 1 : e - 13;
  const year = month > 2 ? c - 4716 : c - 4715;
  const dayFrac = f * 24;
  let hh = Math.floor(dayFrac); let mmn = Math.round((dayFrac - hh) * 60);
  if (mmn === 60) { mmn = 0; hh++; }
  return { y: year, m: month, d: day, h: hh, mi: mmn };
}

/* ΔT (giây) — xấp xỉ Espenak & Meeus */
function deltaT(year) {
  let t;
  if (year < 1600 || year > 2160) { const u = (year - 1820) / 100; return -20 + 32 * u * u; }
  if (year >= 1900 && year < 1920) { t = year - 1900; return -2.79 + 1.494119 * t - 0.0598939 * t * t + 0.0061966 * t ** 3 - 0.000197 * t ** 4; }
  if (year < 1941) { t = year - 1920; return 21.20 + 0.84493 * t - 0.076100 * t * t + 0.0020936 * t ** 3; }
  if (year < 1961) { t = year - 1950; return 29.07 + 0.407 * t - t * t / 233 + t ** 3 / 2547; }
  if (year < 1986) { t = year - 1975; return 45.45 + 1.067 * t - t * t / 260 - t ** 3 / 718; }
  if (year < 2005) { t = year - 2000; return 63.86 + 0.3345 * t - 0.060374 * t * t + 0.0017275 * t ** 3 + 0.000651814 * t ** 4 + 0.00002373599 * t ** 5; }
  if (year < 2050) { t = year - 2000; return 62.92 + 0.32217 * t + 0.005589 * t * t; }
  return -20 + 32 * ((year - 1820) / 100) ** 2 - 0.5628 * (2150 - year);
}

/* Kinh độ hoàng đạo biểu kiến của Mặt Trời (độ) tại jd (thời gian động học TT) — Meeus + nutation */
function sunLongitude(jdTT) {
  const T = (jdTT - 2451545.0) / 36525;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M * RAD) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M * RAD) +
    0.000289 * Math.sin(3 * M * RAD);
  const omega = 125.04 - 1934.136 * T;
  // Nutation kinh độ (Meeus 22, công thức rút gọn)
  const Lsun = 280.4665 + 36000.7698 * T;
  const Lmoon = 218.3165 + 481267.8813 * T;
  const dPsi = (-17.20 * Math.sin(omega * RAD) - 1.32 * Math.sin(2 * Lsun * RAD) -
    0.23 * Math.sin(2 * Lmoon * RAD) + 0.21 * Math.sin(2 * omega * RAD)) / 3600;
  return mod360(L0 + C - 0.00569 - 0.00478 * Math.sin(omega * RAD) + dPsi);
}
function sunLongitudeUTC(jdUTCv) {
  const dt = jdToLocal(jdUTCv, 0);
  return sunLongitude(jdUTCv + deltaT(dt.y) / 86400);
}

/* Thời điểm Mặt Trời đạt kinh độ target (độ) — trả về JD(UTC).
 * Tìm trong khoảng [jdStart, jdStart + 370] */
function sunLongitudeCrossing(jdStart, target) {
  let lo = jdStart, hi;
  let prev = mod360(sunLongitudeUTC(lo) - target);
  if (prev > 180) prev -= 360; // đưa về (-180,180], đang tiến dần đến 0
  for (let day = 1; day <= 372; day++) {
    const t = jdStart + day;
    let cur = mod360(sunLongitudeUTC(t) - target);
    if (cur > 180) cur -= 360;
    if (prev < 0 && cur >= 0) { // vượt qua target trong (t-1, t]
      hi = t; lo = t - 1;
      for (let i = 0; i < 50; i++) { // chia đôi
        const mid = (lo + hi) / 2;
        const v = mod360(sunLongitudeUTC(mid) - target);
        const w = v > 180 ? v - 360 : v;
        if (w < 0) lo = mid; else hi = mid;
      }
      return (lo + hi) / 2;
    }
    prev = cur;
  }
  return null;
}

/* Danh sách 24 tiết khí của một năm dương lịch (theo giờ địa phương tz)
 * Trả về mảng {jd, vi (độ), ten, loai: 'tiet'|'trungkhi'} sắp xếp theo thời gian */
const TIET_KHI_LIST = [
  [285, 'Tiểu Hàn', 'tiết'], [300, 'Đại Hàn', 'trung khí'], [315, 'Lập Xuân', 'tiết'],
  [330, 'Vũ Thủy', 'trung khí'], [345, 'Kinh Trập', 'tiết'], [0, 'Xuân Phân', 'trung khí'],
  [15, 'Thanh Minh', 'tiết'], [30, 'Cốc Vũ', 'trung khí'], [45, 'Lập Hạ', 'tiết'],
  [60, 'Tiểu Mãn', 'trung khí'], [75, 'Mang Chủng', 'tiết'], [90, 'Hạ Chí', 'trung khí'],
  [105, 'Tiểu Thử', 'tiết'], [120, 'Đại Thử', 'trung khí'], [135, 'Lập Thu', 'tiết'],
  [150, 'Xử Thử', 'trung khí'], [165, 'Bạch Lộ', 'tiết'], [180, 'Thu Phân', 'trung khí'],
  [195, 'Hàn Lộ', 'tiết'], [210, 'Sương Giáng', 'trung khí'], [225, 'Lập Đông', 'tiết'],
  [240, 'Tiểu Tuyết', 'trung khí'], [255, 'Đại Tuyết', 'tiết'], [270, 'Đông Chí', 'trung khí']
];
const tietKhiCache = {};
function tietKhiNam(year) {
  if (tietKhiCache[year]) return tietKhiCache[year];
  const base = jdUTC(year - 1, 12, 15, 0, 0); // quét từ giữa tháng 12 năm trước
  const out = [];
  let cursor = base;
  for (const [vi, ten, loai] of TIET_KHI_LIST) {
    const jd = sunLongitudeCrossing(cursor, vi);
    if (jd == null) break;
    out.push({ jd, vi, ten, loai });
    cursor = jd + 5;
  }
  tietKhiCache[year] = out;
  return out;
}
/* Tiết khí gần nhất trước (hoặc tại) thời điểm jdUTC — trả về null nếu không tìm */
function tietKhiTruoc(jd, yearHint) {
  const pool = [].concat(tietKhiNam(yearHint - 1), tietKhiNam(yearHint), tietKhiNam(yearHint + 1));
  let best = null;
  for (const tk of pool) if (tk.jd <= jd && (!best || tk.jd > best.jd)) best = tk;
  return best;
}
/* TIẾT (cửa tháng, bắt đầu trụ tháng) gần nhất trước jd */
function tietTruoc(jd, yearHint) {
  const pool = [].concat(tietKhiNam(yearHint - 1), tietKhiNam(yearHint), tietKhiNam(yearHint + 1))
    .filter(x => x.loai === 'tiết');
  let best = null;
  for (const tk of pool) if (tk.jd <= jd && (!best || tk.jd > best.jd)) best = tk;
  return best;
}

/* --------------------------- Âm lịch (múi giờ VN) --------------------------- */
/* Sóng Sóc (trăng mới) thứ k — thuật toán Meeus rút gọn (theo Hồ Ngọc Đức) */
function socNgay(k, tz) {
  const T = k / 1236.85, T2 = T * T, T3 = T2 * T;
  const dr = RAD;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
  let deltat;
  if (T < -11) deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
  else deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
  return Math.floor(Jd1 + C1 - deltat + 0.5 + tz / 24);
}
/* Kinh độ mặt trời / 30 (để xác định trung khí) tại ngày jdn địa phương */
function sunLongMajor(jdnLocal, tz) {
  return Math.floor(sunLongitude(jdnLocal - 0.5 - tz / 24) / 30);
}
function thang11Am(yy, tz) {
  const off = jdn(yy, 12, 31) - 2415021;
  const k = Math.floor(off / 29.530588853);
  let nm = socNgay(k, tz);
  const sunLong = sunLongMajor(nm, tz);
  if (sunLong >= 9) nm = socNgay(k - 1, tz);
  return nm;
}
function thangNhuanOffset(a11, tz) {
  const k = Math.floor((a11 - 2415021.076998695) / 29.530588853);
  let last = 0, i = 1;
  let arc = sunLongMajor(socNgay(k + i, tz), tz);
  do { last = arc; i++; arc = sunLongMajor(socNgay(k + i, tz), tz); } while (arc !== last && i < 14);
  return i - 1;
}
/* Dương lịch -> Âm lịch: {ngay, thang, nam, nhuan} */
function dl2al(dd, mm, yy, tz) {
  const dayNumber = jdn(yy, mm, dd);
  const k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = socNgay(k + 1, tz);
  if (monthStart > dayNumber) monthStart = socNgay(k, tz);
  let a11 = thang11Am(yy, tz), b11 = a11;
  let lunarYear;
  if (a11 >= monthStart) { lunarYear = yy; a11 = thang11Am(yy - 1, tz); }
  else { lunarYear = yy + 1; b11 = thang11Am(yy + 1, tz); }
  const lunarDay = dayNumber - monthStart + 1;
  const diff = Math.floor((monthStart - a11) / 29);
  let lunarLeap = 0, lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    const leapDiff = thangNhuanOffset(a11, tz);
    if (diff >= leapDiff) {
      lunarMonth = diff + 10;
      if (diff === leapDiff) lunarLeap = 1;
    }
  }
  if (lunarMonth > 12) lunarMonth -= 12;
  if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;
  return { ngay: lunarDay, thang: lunarMonth, nam: lunarYear, nhuan: lunarLeap };
}

/* --------------------------- Can chi cơ bản --------------------------- */
const canChi = i => CAN[((i % 10) + 10) % 10] + ' ' + CHI[((i % 12) + 12) % 12];
/* Trụ ngày: (JDN + 49) mod 60, 0 = Giáp Tý (đối chiếu 13/03/2024 = Bính Tý) */
function truNgayJDN(j) { return ((j + 49) % 60 + 60) % 60; }
/* Trụ năm từ năm lịch (mốc Lập Xuân xử lý ngoài): (y - 4) mod 60 */
function truNam(y) { return ((y - 4) % 60 + 60) % 60; }
/* Trụ tháng: ngũ hổ đốn từ can năm, chi tháng tính từ Dần */
function truThangIdx(yearStem, chiThang) {
  const offset = ((chiThang - 2) % 12 + 12) % 12;
  const stem = ((yearStem % 5) * 2 + offset + 2) % 10;
  // chỉ số lục thập hoa giáp tương ứng
  let b = chiThang;
  let s = stem;
  // hoa giáp: can 0..9, chi 0..11, i%10=can, i%12=chi
  for (let i = 0; i < 60; i++) if (i % 10 === s && i % 12 === b) return i;
  return null;
}
/* Trụ giờ: ngũ thử đốn — can giờ từ can ngày + chi giờ */
function truGio(dayStem, chiGio) {
  const stem = ((dayStem % 5) * 2 + chiGio) % 10;
  for (let i = 0; i < 60; i++) if (i % 10 === stem && i % 12 === chiGio) return i;
  return null;
}

/* Thập thần của can x đối với ngày chủ dm */
function thapThan(dm, x) {
  if (x === dm) return 'Tỷ Kiên';
  const eDm = Math.floor(dm / 2), eX = Math.floor(x / 2);
  const samePole = (dm % 2) === (x % 2);
  if (eX === eDm) return samePole ? 'Tỷ Kiên' : 'Kiếp Tài';
  if ((eDm + 1) % 5 === eX) return samePole ? 'Thực Thần' : 'Thương Quan';     // dm sinh x
  if ((eX + 1) % 5 === eDm) return samePole ? 'Thiên Ấn' : 'Chính Ấn';        // x sinh dm
  if ((eDm + 2) % 5 === eX) return samePole ? 'Thiên Tài' : 'Chính Tài';      // dm khắc x
  return samePole ? 'Thất Sát' : 'Chính Quan';                                  // x khắc dm
}
function napAmOf(idx60) { const p = Math.floor(idx60 / 2) % 30; return { ten: NAP_AM[p], hanh: NAP_AM_HANH[p] }; }

/* Quan hệ can chi */
const CAN_HOP = [[0, 5, 'Thổ'], [1, 6, 'Kim'], [2, 7, 'Thủy'], [3, 8, 'Mộc'], [4, 9, 'Hỏa']];
const CHI_LUC_HOP = [[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]];
const CHI_LUC_XUNG = [[0, 6], [1, 7], [2, 8], [3, 9], [4, 10], [5, 11]];
const CHI_LUC_HAI = [[0, 7], [1, 6], [2, 5], [3, 4], [8, 11], [9, 10]];
const CHI_TAM_HOP = [[8, 0, 4, 'Thủy'], [11, 3, 7, 'Mộc'], [2, 6, 10, 'Hỏa'], [5, 9, 1, 'Kim']];
const CHI_TAM_HINH = [[2, 5, 8], [1, 10, 7], [0, 3]]; // Dần-Tỵ-Thân, Sửu-Tuất-Mùi, Tý-Mão

/* --------------------------- Thần sát --------------------------- */
/* Nhóm tam hợp (theo chi): 0={Thân,Tý,Thìn} 1={Dần,Ngọ,Tuất} 2={Tỵ,Dậu,Sửu} 3={Hợi,Mão,Mùi} */
function tamHopGroup(chi) {
  if ([8, 0, 4].includes(chi)) return 0;
  if ([2, 6, 10].includes(chi)) return 1;
  if ([5, 9, 1].includes(chi)) return 2;
  return 3;
}
const TUONG_TINH = [0, 6, 9, 3];   // theo nhóm tam hợp
const HOA_CAI = [4, 10, 1, 7];
const KIEP_SAT = [5, 11, 2, 8];
const DAO_HOA = [9, 3, 6, 0];
const THIEN_MA = [2, 8, 11, 5];
const CO_THAN = [2, 5, 8, 11];     // {Hợi,Tý,Sửu}→Dần; {Dần,Mão,Thìn}→Tỵ; {Tỵ,Ngọ,Mùi}→Thân; {Thân,Dậu,Tuất}→Hợi
const QUA_TU = [10, 1, 4, 7];
const HONG_LUAN = [3, 2, 1, 0, 11, 10, 9, 8, 7, 6, 5, 4]; // theo chi
const THIEN_HY = { 'xuan': 10, 'ha': 1, 'thu': 4, 'dong': 7 }; // Tuất/Sửu/Thìn/Mùi theo mùa chi
function thienHyOf(chi) { const g = tamHopGroup(chi); /*mùa: Tý Sửu Hợi = đông(vì nhóm?)*/ 
  // theo mùa của chi: {Dần,Mão,Thìn}=xuân, {Tỵ,Ngọ,Mùi}=hạ, {Thân,Dậu,Tuất}=thu, {Hợi,Tý,Sửu}=đông
  if ([2, 3, 4].includes(chi)) return 10;
  if ([5, 6, 7].includes(chi)) return 1;
  if ([8, 9, 10].includes(chi)) return 4;
  return 7;
}
const QUY_NHAN = [[1, 7], [0, 8], [11, 9], [11, 9], [1, 7], [0, 8], [1, 7], [6, 2], [3, 5], [3, 5]]; // theo can
const VAN_XUONG = [5, 6, 8, 9, 8, 9, 11, 0, 2, 3]; // theo can (Giáp→Tỵ, Ất→Ngọ, Bính/Mậu→Thân, Đinh/Kỷ→Dậu, Canh→Hợi, Tân→Tý, Nhâm→Dần, Quý→Mão)
const HOC_DUONG = { 0: 11, 1: 11, 2: 2, 3: 2, 4: 8, 5: 8, 6: 5, 7: 5, 8: 8, 9: 8 }; // theo hành của can
const THIEN_DUC = [3, 8, 8, 7, 11, 0, 9, 2, 2, 1, 5, 6]; // theo chi tháng (Tý..Hợi): can hoặc chi
const THIEN_DUC_IS_CAN = [true, false, true, true, false, true, true, false, true, true, false, true];
const NGUYET_DUC = [8, 2, 6, 0]; // theo nhóm tam hợp của chi tháng: ThânTýThìn→Nhâm, DầnNgọTuất→Bính, TỵDậuSửu→Canh, HợiMãoMùi→Giáp
const THAP_CAN_LOC = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0]; // Lộc của 10 can
const DUONG_NHAN = [3, -1, 6, -1, 6, -1, 9, -1, 0, -1]; // của 10 can (âm can không có)

function khongVong(dayIdx60) {
  const p = Math.floor(dayIdx60 / 2) % 6;
  return [((p * 2 + 10) % 12), ((p * 2 + 11) % 12)];
}

/* Toàn bộ thần sát (đối chiếu chi/can trụ) — trả về danh sách {ten, viTriCan|viTriChi, nguon}
 * nguon: 'ngay' | 'nam' (trụ tham chiếu) */
function thanSatAll(pillars) {
  const dayChi = pillars[2].chi, dayCan = pillars[2].can;
  const yearChi = pillars[0].chi, yearCan = pillars[0].can;
  const monthChi = pillars[1].chi;
  const out = [];
  const push = (ten, loai, vi, nguon) => out.push({ ten, loai, vi, nguon });
  for (const [refChi, refCan, nguon] of [[dayChi, dayCan, 'ngay'], [yearChi, yearCan, 'nam']]) {
    const g = tamHopGroup(refChi);
    push('Tướng Tinh', 'chi', TUONG_TINH[g], nguon);
    push('Hoa Cái', 'chi', HOA_CAI[g], nguon);
    push('Kiếp Sát', 'chi', KIEP_SAT[g], nguon);
    push('Đào Hoa', 'chi', DAO_HOA[g], nguon);
    push('Thiên Mã', 'chi', THIEN_MA[g], nguon);
    push('Cô Thần', 'chi', CO_THAN[g], nguon);
    push('Quả Tú', 'chi', QUA_TU[g], nguon);
    push('Hồng Loan', 'chi', HONG_LUAN[refChi], nguon);
    push('Thiên Hỷ', 'chi', thienHyOf(refChi), nguon);
    QUY_NHAN[refCan].forEach(v => push('Quý Nhân', 'chi', v, nguon));
    push('Văn Xương', 'chi', VAN_XUONG[refCan], nguon);
    push('Học Đường', 'chi', HOC_DUONG[refCan], nguon);
    push('Thập Can Lộc', 'chi', THAP_CAN_LOC[refCan], nguon);
    if (DUONG_NHAN[refCan] >= 0) push('Dương Nhận', 'chi', DUONG_NHAN[refCan], nguon);
  }
  // Nguyệt Đức / Thiên Đức theo chi tháng
  const gM = tamHopGroup(monthChi);
  push('Nguyệt Đức', 'can', NGUYET_DUC[gM], 'thang');
  push('Thiên Đức', THIEN_DUC_IS_CAN[monthChi] ? 'can' : 'chi', THIEN_DUC[monthChi], 'thang');
  // Không Vong theo trụ ngày
  khongVong(pillars[2].idx60).forEach(v => push('Không Vong', 'chi', v, 'ngay'));
  return out;
}

/* --------------------------- Bát trạch (mệnh quái) --------------------------- */
const QUAI = { 1: ['Khảm', 'Thủy', 'Bắc'], 2: ['Khôn', 'Thổ', 'Tây Nam'], 3: ['Chấn', 'Mộc', 'Đông'],
  4: ['Tốn', 'Mộc', 'Đông Nam'], 6: ['Càn', 'Kim', 'Tây Bắc'], 7: ['Đoài', 'Kim', 'Tây'],
  8: ['Cấn', 'Thổ', 'Đông Bắc'], 9: ['Ly', 'Hỏa', 'Nam'] };
/* Mệnh quái: tổng chữ số năm sinh; nam = 11 − s, nữ = s + 4 (số 5: nam Khôn, nữ Cấn) */
function menhQuai(namSinh, nu) {
  let s = namSinh;
  while (s > 9) { const str = String(s); s = str.split('').reduce((a, c) => a + (+c), 0); }
  let q = nu ? s + 4 : 11 - s;
  while (q > 9) q -= 9;
  if (q === 5) q = nu ? 8 : 2;
  return q;
}
/* Bảng 8 hướng theo mệnh quái (Đại Du Niên) */
const BAT_TRACH_TABLE = {
  1: { 'Sinh Khí': 9, 'Thiên Y': 8, 'Diên Niên': 3, 'Phục Vị': 1, 'Họa Hại': 2, 'Ngũ Quỷ': 4, 'Lục Sát': 6, 'Tuyệt Mệnh': 7 },
  2: { 'Sinh Khí': 8, 'Thiên Y': 7, 'Diên Niên': 6, 'Phục Vị': 2, 'Họa Hại': 1, 'Ngũ Quỷ': 3, 'Lục Sát': 4, 'Tuyệt Mệnh': 9 },
  3: { 'Sinh Khí': 9, 'Thiên Y': 1, 'Diên Niên': 4, 'Phục Vị': 3, 'Họa Hại': 2, 'Ngũ Quỷ': 6, 'Lục Sát': 8, 'Tuyệt Mệnh': 7 },
  4: { 'Sinh Khí': 1, 'Thiên Y': 9, 'Diên Niên': 3, 'Phục Vị': 4, 'Họa Hại': 6, 'Ngũ Quỷ': 2, 'Lục Sát': 7, 'Tuyệt Mệnh': 8 },
  6: { 'Sinh Khí': 7, 'Thiên Y': 8, 'Diên Niên': 2, 'Phục Vị': 6, 'Họa Hại': 4, 'Ngũ Quỷ': 3, 'Lục Sát': 1, 'Tuyệt Mệnh': 9 },
  7: { 'Sinh Khí': 6, 'Thiên Y': 2, 'Diên Niên': 8, 'Phục Vị': 7, 'Họa Hại': 1, 'Ngũ Quỷ': 9, 'Lục Sát': 4, 'Tuyệt Mệnh': 3 },
  8: { 'Sinh Khí': 2, 'Thiên Y': 7, 'Diên Niên': 6, 'Phục Vị': 8, 'Họa Hại': 3, 'Ngũ Quỷ': 1, 'Lục Sát': 9, 'Tuyệt Mệnh': 4 },
  9: { 'Sinh Khí': 3, 'Thiên Y': 4, 'Diên Niên': 1, 'Phục Vị': 9, 'Họa Hại': 8, 'Ngũ Quỷ': 7, 'Lục Sát': 2, 'Tuyệt Mệnh': 6 }
};

/* --------------------------- Lập lá số --------------------------- */
/*
 * input: { gioitinh: 'nam'|'nu', nam, thang, ngay, gio, phut, tz (mặc định 7) }
 */
function lapLaSo(inp) {
  const tz = inp.tz == null ? 7 : inp.tz;
  const jdBirth = jdUTC(inp.nam, inp.thang, inp.ngay, inp.gio, inp.phut || 0);

  // Giờ địa chi (23:00 -> giờ Tý, trụ ngày sang ngày hôm sau)
  const h = inp.gio;
  const chiGio = Math.floor(((h + 1) % 24) / 2);
  let dayJDN = jdn(inp.nam, inp.thang, inp.ngay);
  let sangNgaySau = false;
  if (h >= 23) { dayJDN += 1; sangNgaySau = true; }

  const local = { y: inp.nam, m: inp.thang, d: inp.ngay, h: inp.gio, mi: inp.phut || 0 };

  // Tiết khí gần nhất trước giờ sinh & tiết bắt đầu tháng (trụ tháng)
  const tk = tietKhiTruoc(jdBirth, inp.nam);
  const tkThang = tietTruoc(jdBirth, inp.nam); // tiết mở đầu chi tháng hiện tại

  // Trụ NĂM: mốc Lập Xuân
  const lapXuanList = [].concat(tietKhiNam(inp.nam - 1), tietKhiNam(inp.nam), tietKhiNam(inp.nam + 1))
    .filter(x => x.ten === 'Lập Xuân');
  let lapXuanTruoc = null;
  for (const lx of lapXuanList) if (lx.jd <= jdBirth && (!lapXuanTruoc || lx.jd > lapXuanTruoc.jd)) lapXuanTruoc = lx;
  const namAmLichCuaTru = lapXuanTruoc ? jdToLocal(lapXuanTruoc.jd, tz).y : inp.nam;
  const yearIdx = truNam(namAmLichCuaTru);
  const yearCan = yearIdx % 10, yearChi = yearIdx % 12;

  // Trụ THÁNG: chi từ tiết (Dần = Lập Xuân), can từ ngũ hổ đốn
  // tiết hiện tại cách Lập Xuân bao nhiêu tiết (mỗi tiết = 1 chi tháng, bắt đầu Dần)
  let chiThang;
  const chiThangTheoTen = { 'Lập Xuân': 2, 'Kinh Trập': 3, 'Thanh Minh': 4, 'Lập Hạ': 5,
    'Mang Chủng': 6, 'Tiểu Thử': 7, 'Lập Thu': 8, 'Bạch Lộ': 9, 'Hàn Lộ': 10,
    'Lập Đông': 11, 'Đại Tuyết': 0, 'Tiểu Hàn': 1 };
  chiThang = chiThangTheoTen[tkThang.ten];
  const monthIdx60 = truThangIdx(yearCan, chiThang);
  const monthCan = monthIdx60 % 10;

  // Trụ NGÀY & GIỜ
  const dayIdx60 = truNgayJDN(dayJDN);
  const dayCan = dayIdx60 % 10, dayChi = dayIdx60 % 12;
  const hourIdx60 = truGio(dayCan, chiGio);
  const hourCan = hourIdx60 % 10;

  const pillars = [
    { key: 'nam', ten: 'Trụ Năm', can: yearCan, chi: yearChi, idx60: yearIdx },
    { key: 'thang', ten: 'Trụ Tháng', can: monthCan, chi: chiThang, idx60: monthIdx60 },
    { key: 'ngay', ten: 'Trụ Ngày', can: dayCan, chi: dayChi, idx60: dayIdx60 },
    { key: 'gio', ten: 'Trụ Giờ', can: hourCan, chi: chiGio, idx60: hourIdx60 }
  ];
  for (const p of pillars) {
    p.tangCan = TANG_CAN[p.chi].map(c => ({ can: c, tt: thapThan(dayCan, c) }));
    p.napAm = napAmOf(p.idx60);
    p.truongSinh = truongSinhCanChi(p.can, p.chi);
  }
  const thanSat = thanSatAll(pillars);
  // gắn thần sát trúng trụ
  for (const p of pillars) {
    p.thanSat = thanSat.filter(s =>
      (s.loai === 'chi' && s.vi === p.chi && (s.ten === 'Không Vong' ? p.key !== 'gio' : true) && s.ten !== 'Không Vong') ||
      (s.loai === 'can' && s.vi === p.can)
    ).map(s => s.ten);
    // Không Vong áp cho trụ năm/tháng/ngày
    const kv = thanSat.filter(s => s.ten === 'Không Vong' && s.vi === p.chi);
    if (kv.length && p.key !== 'gio') p.thanSat.push('Không Vong');
    p.thanSat = [...new Set(p.thanSat)];
  }

  // Âm lịch
  const amLich = dl2al(inp.ngay, inp.thang, inp.nam, tz);

  // Ngũ hành cân bằng (trọng số: can 1.0, tàng chính 0.7, trung 0.3, dư 0.15; chi tháng +30%)
  const diem = { 'Kim': 0, 'Mộc': 0, 'Hỏa': 0, 'Thổ': 0, 'Thủy': 0 };
  for (const p of pillars) {
    diem[CAN_HANH(p.can)] += 1.0;
    const w = [0.7, 0.3, 0.15];
    p.tangCan.forEach((t, i) => {
      let diemNay = w[i] || 0.15;
      if (p.key === 'thang') diemNay *= 1.3;
      diem[CAN_HANH(t.can)] += diemNay;
    });
  }

  // Mệnh cung & Thai cung (công thức trùng battu.kabala.vn)
  // Mệnh Cung = trụ tháng lùi 1 (can −1, chi −1) | Thai Cung = (can ngày +2, chi ngày +6)
  const menhCungIdx = truThangIdx(yearCan, ((chiThang - 1) % 12 + 12) % 12);
  const mcCan = ((monthCan + 9) % 10), mcChi = ((chiThang + 11) % 12);
  const thaiCungCan = (dayCan + 2) % 10, thaiCungChi = (dayChi + 6) % 12;

  // Đại vận
  const duong = yearCan % 2 === 0;
  const thuan = duong ? (inp.gioitinh === 'nam') : (inp.gioitinh === 'nu');
  let ngayVan;
  if (thuan) {
    const pool = [].concat(tietKhiNam(inp.nam - 1), tietKhiNam(inp.nam), tietKhiNam(inp.nam + 1))
      .filter(x => x.loai === 'tiết');
    let next = null;
    for (const t of pool) if (t.jd > jdBirth && (!next || t.jd < next.jd)) next = t;
    ngayVan = (next.jd - jdBirth) / 3; // năm
    khoiVuan = { next, ngay: next.jd - jdBirth };
  } else {
    let prev = null;
    const pool = [].concat(tietKhiNam(inp.nam - 1), tietKhiNam(inp.nam), tietKhiNam(inp.nam + 1))
      .filter(x => x.loai === 'tiết');
    for (const t of pool) if (t.jd <= jdBirth && (!prev || t.jd > prev.jd)) prev = t;
    ngayVan = (jdBirth - prev.jd) / 3;
    khoiVuan = { prev, ngay: jdBirth - prev.jd };
  }
  var khoiVuan; // eslint-disable-line
  const tuoiKhoiVan = Math.floor(ngayVan);
  const thangKhoiVan = Math.round((ngayVan - tuoiKhoiVan) * 12);
  const khoiVuanNgayAm = jdToLocal(jdBirth + ngayVan * 365.2425, tz);

  const daiVans = [];
  for (let k = 1; k <= 10; k++) {
    const idx = ((monthIdx60 + (thuan ? k : -k)) % 60 + 60) % 60;
    const can = idx % 10, chi = idx % 12;
    const dv = {
      k, idx60: idx, can, chi,
      tuoi: tuoiKhoiVan + (k - 1) * 10, // tuổi bắt đầu mỗi vận 10 năm (như kabala: 7, 17, 27...)
      namBatDau: inp.nam + tuoiKhoiVan + (k - 1) * 10,
      tangCan: TANG_CAN[chi].map(c => ({ can: c, tt: thapThan(dayCan, c) })),
      napAm: napAmOf(idx),
      truongSinh: truongSinhCanChi(can, chi),
      thapThanCan: thapThan(dayCan, can)
    };
    // thần sát của đại vận (đối chiếu trụ ngày & trụ năm)
    const satAll = thanSatAll([{ can: yearCan, chi: yearChi }, { can: monthCan, chi: chiThang }, { can: dayCan, chi: dayChi }, { can: hourCan, chi: chiGio }]);
    dv.thanSat = [...new Set(satAll.filter(s => (s.loai === 'chi' && s.vi === chi) || (s.loai === 'can' && s.vi === can)).map(s => s.ten))];
    daiVans.push(dv);
  }

  // Lưu niên: mỗi đại vận 10 năm
  for (const dv of daiVans) {
    dv.luuNien = [];
    for (let i = 0; i < 10; i++) {
      const y = dv.namBatDau + i;
      const idx = truNam(y);
      dv.luuNien.push({ nam: y, idx60: idx, can: idx % 10, chi: idx % 12, thapThanCan: thapThan(dayCan, idx % 10) });
    }
  }

  // Bát trạch
  const quai = menhQuai(inp.nam, inp.gioitinh === 'nu');

  return {
    input: { ...inp, tz },
    jd: jdBirth, local,
    sangNgaySau, chiGio,
    tietKhiHienTai: tk, tietThang: tkThang, lapXuan: lapXuanTruoc,
    amLich,
    pillars, thanSat,
    dayCan, dayChi, dayIdx60,
    diemNguHanh: diem,
    menhCung: { can: mcCan, chi: mcChi, idx60: menhCungIdx },
    thaiCung: { can: thaiCungCan, chi: thaiCungChi },
    daiVan: {
      thuan, ngayVan, tuoiKhoiVan, thangKhoiVan,
      namBatDau: khoiVuanNgayAm.y, list: daiVans,
      tietChuan: thuan ? (khoiVuan.next ? khoiVuan.next.ten : '') : (khoiVuan.prev ? khoiVuan.prev.ten : ''),
      soNgay: khoiVuan.ngay
    },
    menhQuai: quai,
    batTrach: BAT_TRACH_TABLE[quai]
  };
}

/* Xuất module */
const Battu = {
  CAN, CHI, HANH, HANH_COLOR, CAN_HANH, CHI_HANH, CAN_AMDUONG, CHI_AMDUONG,
  NAP_AM, TANG_CAN, THAP_THAN, TT_VIET_TAT, TRUONG_SINH,
  jdn, jdUTC, jdToLocal, deltaT, sunLongitude, sunLongitudeUTC, tietKhiNam, tietKhiTruoc, tietTruoc,
  socNgay, dl2al, canChi, truNgayJDN, truNam, truThangIdx, truGio,
  thapThan, napAmOf, truongSinhCanChi, thanSatAll, khongVong,
  tamHopGroup, menhQuai, BAT_TRACH_TABLE, QUAI, lapLaSo,
  CAN_HOP, CHI_LUC_HOP, CHI_LUC_XUNG, CHI_LUC_HAI, CHI_TAM_HOP, CHI_TAM_HINH
};
if (typeof module !== 'undefined' && module.exports) module.exports = Battu;
else global.Battu = Battu;
})(typeof window !== 'undefined' ? window : globalThis);
