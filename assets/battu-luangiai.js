/* =========================================================================
 * BATTU-LUANGIAI.JS — Bộ máy luận giải Lá Số Bát Tự (tiếng Việt)
 * Luận: ngày chủ, ngũ hành cân bằng, thập thần, tính cách, sự nghiệp,
 *       tình duyên, sức khỏe, thần sát, đại vận — lưu niên, khuyến nghị.
 * ========================================================================= */
(function (global) {
'use strict';

const C = global.Battu || (typeof require !== 'undefined' ? require('./battu-core.js') : null);
const { CAN, CHI, HANH } = C;

/* ---------- Văn bản 10 ngày chủ ---------- */
const NGAY_CHU = {
  0: { t: 'Người ngày can Giáp (Dương Mộc – cây đại thụ)', nd: 'Giáp là cây to, thân chính, mọc thẳng đứng. Bạn có bản tính ngay thẳng, kiên định, có chí tiến thủ và lòng nhân từ. Muốn vươn lên bằng chính thực lực, ghét sự vòng vo, gian trá. Nhược điểm: đôi khi cứng đầu, bảo thủ, khó khuất mình trước hoàn cảnh.' },
  1: { t: 'Người ngày can Ất (Âm Mộc – hoa cỏ, dây leo)', nd: 'Ất là cỏ cây mềm dẻo, khéo léo. Bạn linh hoạt, thích ứng nhanh, tinh tế và biết cách sống hòa hợp với môi trường. Khéo giao tiếp, tài nghệ thuật. Nhược điểm: thiếu quyết đoán, dễ bị ảnh hưởng, đôi khi phụ thuộc người khác.' },
  2: { t: 'Người ngày can Bính (Dương Hỏa – mặt trời)', nd: 'Bính là mặt trời rực rỡ. Bạn nhiệt tình, phóng khoáng, cởi mở, có sức lan tỏa và dễ được mọi người quý mến. Sống tích cực, thích thể hiện. Nhược điểm: nóng nảy nhất thời, ba phút nhiệt độ, đôi khi hào nhoáng.' },
  3: { t: 'Người ngày can Đinh (Âm Hỏa – ngọn đèn, sao trời)', nd: 'Đinh là lửa của ngọn đèn, ánh sao. Bạn tinh tế, sâu sắc, có sức nóng bên trong âm thầm, kiên trì theo đuổi lý tưởng. Lòng tốt ấm áp, duyên dáng. Nhược điểm: đa sầu đa cảm, dễ tự thương, hay suy nghĩ nội tâm.' },
  4: { t: 'Người ngày can Mậu (Dương Thổ – núi lớn)', nd: 'Mậu là quả núi vững chãi. Bạn trung hậu, ổn định, đáng tin cậy, điềm tĩnh trước biến động. Có sức bền, chịu đựng tốt, trọng lời hứa. Nhược điểm: chậm thay đổi, bảo thủ, đôi khi khó biểu lộ cảm xúc.' },
  5: { t: 'Người ngày can Kỷ (Âm Thổ – ruộng đất)', nd: 'Kỷ là thửa ruộng nuôi dưỡng mùa màng. Bạn chăm chỉ, tiết chế, thực tế, có óc tổ chức và khả năng bao dung nuôi dưỡng người khác. Nhược điểm: hay lo xa, tiểu tiết, dễ ôm giữ mọi việc vào mình.' },
  6: { t: 'Người ngày can Canh (Dương Kim – thô quặng, lưỡi rìu)', nd: 'Canh là kim loại thô, lưỡi búa. Bạn quả cảm, dứt khoát, nghĩa khí, không sợ khó khăn, làm việc có khí phách. Nhược điểm: quá thẳng, dễ va chạm, cứng rắn thiếu mềm mỏng.' },
  7: { t: 'Người ngày can Tân (Dương Kim – trang sức, kim tinh chế)', nd: 'Tân là vàng bạc, kim loại tinh xảo. Bạn tế nhị, có gu thẩm mỹ, chú trọng hình thức và sự hoàn thiện, trí tuệ sắc sảo. Nhược điểm: dễ tự ái, để ý đánh giá của người khác, đôi khi cố chấp sự hoàn hảo.' },
  8: { t: 'Người ngày can Nhâm (Dương Thủy – biển cả, sông lớn)', nd: 'Nhâm là dòng sông lớn, biển cả. Bạn thông minh, giàu trí tưởng tượng, thích tự do, tư duy nhanh như nước chảy, dung nạp được mọi người. Nhược điểm: đa tình, dễ dao động, thiếu kiên định.' },
  9: { t: 'Người ngày can Quý (Âm Thủy – mưa, sương, suối)', nd: 'Quý là mưa phùn, dòng suối ngầm. Bạn ôn hòa, nhẫn nại, thâm trầm, trực giác tốt, thấu hiểu lòng người. Sức bền âm thầm kiểu "nước mòn đá". Nhược điểm: dễ tủi thân, sống quá nội tâm, thiếu bộc lộ.' }
};

/* ---------- Thập thần: tính cách & lĩnh vực ---------- */
const THAP_THAN_GIAI = {
  'Tỷ Kiên': { tc: 'độc lập, ý chí mạnh, tự tin, bảo vệ quan điểm; nhiều thì cứng đầu, cạnh tranh', lv: 'hợp tác kinh doanh, thể thao, lĩnh vực cần bản lĩnh cá nhân' },
  'Kiếp Tài': { tc: 'hào phóng, thích giao thiệp rộng; nhiều thì dễ hao tài, vướng thị phi tranh chấp', lv: 'giao dịch, mua bán, ngành có tính cạnh tranh cao' },
  'Thực Thần': { tc: 'sáng tạo, miệng lưỡi tử tế, biết hưởng thụ, có tài ăn nói được lòng người', lv: 'nghệ thuật, ẩm thực, giáo dục, sáng tạo nội dung' },
  'Thương Quan': { tc: 'thông minh lanh lợi, phản biện, tài năng vượt trội; nhiều thì kiêu ngạo, khẩu thiệt', lv: 'nghệ thuật, kỹ thuật, diễn thuyết, viết lách, chuyên môn sâu' },
  'Chính Tài': { tc: 'cần cù tiết kiệm, thực tế, trọng trách nhiệm với gia đình; nhiều thì nhỏ mọn', lv: 'tài chính, kế toán, kinh doanh ổn định, lương thưởng' },
  'Thiên Tài': { tc: 'hào sảng, nhạy cơ hội đầu tư; nhiều thì tay hòm chìa khóa, dễ phung phí', lv: 'đầu tư, kinh doanh dịch vụ, ngoại tệ, thương mại' },
  'Chính Quan': { tc: 'kỷ luật, có trách nhiệm, giữ chuẩn mực, được tín nhiệm; nhiều thì rụt rè, áp lực', lv: 'hành chính, quản lý, pháp luật, tổ chức' },
  'Thất Sát': { tc: 'quyết đoán, dũng cảm, chịu áp lực giỏi, làm việc lớn; nhiều thì liều lĩnh, cương quá dễ gãy', lv: 'quân đội, cảnh sát, phẫu thuật, khởi nghiệp cường độ cao' },
  'Chính Ấn': { tc: 'hiếu học, nhân hậu, được che chở, trọng danh tiếng; nhiều thì phụ thuộc, chậm chạp', lv: 'giáo dục, nghiên cứu, y tế, tôn giáo, hành chính văn hóa' },
  'Thiên Ấn': { tc: 'trực giác, tư duy độc đáo, am hiểu huyền học nghệ thuật; nhiều thì cô độc, suy nghĩ nhiều', lv: 'huyền học, tâm lý, thiết kế, nghiên cứu chuyên sâu' }
};

/* ---------- Đại vận: chủ đề theo thập thần can vận ---------- */
const VAN_THEO_THAP_THAN = {
  'Tỷ Kiên': 'giai đoạn đề cao bản thân, tự lập cửa nhà; hợp mở rộng thế lực nhưng cần đề phòng tranh chấp, hao tài vì bạn bè, anh em.',
  'Kiếp Tài': 'giai đoạn biến động về tiền bạc và quan hệ; cơ hội hợp tác nhưng cũng dễ hao tổn — nên giữ của, tránh bảo lãnh, đầu cơ mạo hiểm.',
  'Thực Thần': 'giai đoạn sinh sôi sáng tạo: ăn nói, nghệ thuật, con cái, học hành đều thuận; tài đến từ năng lực biểu hiện, tâm trạng thư thái.',
  'Thương Quan': 'giai đoạn tài năng bung nở nhưng lời nói dễ gây thị phi; hợp học chuyên môn, sáng tác, phản biện; cẩn thận va chạm với cấp trên, pháp luật.',
  'Chính Tài': 'giai đoạn tài lộc chính danh: lương thưởng, kinh doanh ổn định; nam mạng dễ gặp duyên vợ / trọng gia đình; nên chăm chỉ bền bỉ.',
  'Thiên Tài': 'giai đoạn tài bên ngoài: đầu tư, kinh doanh dịch vụ, cơ hội bất ngờ; nhưng tiền đến nhanh đi nhanh, cần kỷ luật tài chính.',
  'Chính Quan': 'giai đoạn công danh sự nghiệp: thăng tiến, chức tước, danh tiếng; nữ mạng dễ gặp duyên chồng; giữ chuẩn mực sẽ được trọng dụng.',
  'Thất Sát': 'giai đoạn áp lực lớn — "lưu sát thành quyền": nếu bản lĩnh sẽ nắm quyền, thăng tiến vượt bậc; nếu yếu thế dễ stress, tiểu nhân, cần giữ sức khỏe.',
  'Chính Ấn': 'giai đoạn học hành, bằng cấp, danh vọng được bảo hộ; được người lớn giúp đỡ; hợp thi cử, nghiên cứu, từ thiện.',
  'Thiên Ấn': 'giai đoạn phát triển nội tâm, trực giác, huyền học; dễ có duyên thầy thuốc, tôn giáo; nhưng cần phòng trì trệ, suy nghĩ viễn vông.'
};

/* ---------- Ngũ hành: nghề, màu, tạng phủ, hướng ---------- */
const HANH_KHUYEN = {
  'Kim': { mau: 'Trắng, xám, ghi, vàng kim (hòa hợp); nâu vàng (tương sinh)', tranh: 'đỏ, hồng, tím', nghe: 'kim khí, cơ khí chế tạo, tài chính ngân hàng, luật, khắc phục thẩm mỹ, dụng cụ y khoa', tang: 'Phế, đại trường', huong: 'Tây, Tây Bắc' },
  'Mộc': { mau: 'Xanh lục (hòa hợp); xanh đen, xanh biển (tương sinh)', tranh: 'trắng, xám', nghe: 'giáo dục, y dược, nông lâm, gỗ nội thất, thời trang, văn hóa xuất bản', tang: 'Can, mật', huong: 'Đông, Đông Nam' },
  'Thủy': { mau: 'Xanh đen, xanh biển (hòa hợp); trắng, xám, ghi (tương sinh)', tranh: 'vàng, nâu đất', nghe: 'thương mại, logistics, du lịch, thủy sản, truyền thông, tài chính lưu động', tang: 'Thận, bàng quang', huong: 'Bắc' },
  'Hỏa': { mau: 'Đỏ, hồng, cam, tím (hòa hợp); xanh lục (tương sinh)', tranh: 'đen, xanh biển', nghe: 'năng lượng, ánh sáng, ẩm thực, nghệ thuật trình diễn, công nghệ thông tin, marketing', tang: 'Tim, tiểu trường', huong: 'Nam' },
  'Thổ': { mau: 'Vàng, nâu đất (hòa hợp); đỏ, hồng, tím (tương sinh)', tranh: 'xanh lục', nghe: 'bất động sản, xây dựng, nông nghiệp, gốm sứ, môi trường, quản lý hành chính', tang: 'Tỳ, vị', huong: 'Trung tâm, Đông Bắc, Tây Nam' }
};

const TRUONG_SINH_GIAI = {
  'Trường Sinh': 'như đứa trẻ mới sinh — sức sống dồi dào, được nuôi dưỡng, dễ gặp quý nhân phù trợ, sự nghiệp dễ khởi phát.',
  'Mộc Dục': 'giai đoạn tập dượt, còn non nớt, cần rèn luyện; dễ lãng mạn, đa cảm.',
  'Quan Đới': 'bước vào tuổi trưởng thành — dần có danh vị, được công nhận, nên trau dồi bản thân.',
  'Lâm Quan': 'như quan đến nhậm chức — mạnh khỏe, thăng tiến, tự chủ tài lộc (kiến lộc), giai đoạn phát triển thuận lợi.',
  'Đế Vượng': 'đỉnh cao thịnh vượng — sức mạnh, danh vọng cực thịnh; nhưng cần biết "càng cao càng dễ gãy", nên khiêm tốn.',
  'Suy': 'bắt đầu suy giảm sau đỉnh — nên giữ thành quả, tránh phóng đại, phòng sa sút sức khỏe.',
  'Bệnh': 'giai đoạn suy yếu — cần chăm lo sức khỏe, tránh quá tải, tĩnh dưỡng.',
  'Tử': 'tàn lụi — giai đoạn đóng lại một chu kỳ; hợp cho thu dọn, kết thúc, chuyển hướng.',
  'Mộ': 'như của cải đưa vào kho — nên tích lũy, giữ gìn; nội tâm sâu lắng, thích nghiên cứu huyền học.',
  'Tuyệt': 'tuyệt đỉnh rồi chuyển — kết thúc hoàn toàn để tái sinh; giai đoạn biến động lớn, tránh khởi sự lớn.',
  'Thai': 'thụ thai — mầm mống mới, khởi đầu âm thầm; hợp vạch kế hoạch, học hỏi, chuẩn bị.',
  'Dưỡng': 'nuôi dưỡng trong bụng mẹ — tích tụ, chờ thời; cần kiên nhẫn bồi đắp.'
};

const THAN_SAT_GIAI = {
  'Hoa Cái': 'Hoa Cái (华盖): trí tuệ nghệ thuật, duyên huyền học, tâm linh; người có Hoa Cái thường hợp nghiên cứu, thiền môn, nhưng dễ cô đơn nội tâm.',
  'Tướng Tinh': 'Tướng Tinh (将星): khí chất lãnh đạo, đức độ chỉ huy, dễ nắm quyền hành — hợp quản lý, tổ chức.',
  'Quý Nhân': 'Quý Nhân (天乙贵人): lúc khó khăn thường có người quyền thế giúp đỡ; giao tiếp tốt, được quý nhân phù trợ suốt đời.',
  'Văn Xương': 'Văn Xương (文昌): thông minh, học giỏi, tài văn chương — hợp học hành, thi cử, viết lách.',
  'Học Đường': 'Học Đường (学堂): duyên học vấn sâu, hiếu học, hợp nghiên cứu chuyên môn.',
  'Đào Hoa': 'Đào Hoa (咸池): duyên phái, hấp dẫn với người khác giới, hợp ngành nghệ thuật giao tiếp; quá nhiều thì dễ vướng chuyện tình ái, thị phi bàn tán.',
  'Thiên Mã': 'Thiên Mã (驿马): sự di chuyển, xuất ngoại, đổi место; đời hay đi xa, hợp ngành lưu động, nước ngoài.',
  'Hồng Loan': 'Hồng Loan (红鸾): duyên tình, hôn nhân — gặp đúng lúc dễ thành duyên vợ chồng, tin vui gia đình.',
  'Thiên Hỷ': 'Thiên Hỷ (天喜): niềm vui, tin mừng, hạnh phúc gia đình; gặp hạn cũng giảm tai ương.',
  'Cô Thần': 'Cô Thần (孤辰): cảm giác cô đơn, ít được thân cận; nên chủ động mở lòng, tránh tự cô lập.',
  'Quả Tú': 'Quả Tú (寡宿): dễ cảm giác lẻ bóng; với nữ mạng cần chú ý gia đạo, nên vun đắp tình cảm.',
  'Kiếp Sát': 'Kiếp Sát (劫煞): dễ gặp tổn thất bất ngờ, tiểu nhân; nên tránh cho vay, bảo lãnh; nếu có quyền tinh chế ngự lại thành tài chỉ huy.',
  'Nguyệt Đức': 'Nguyệt Đức (月德): phúc đức của tháng — hóa giải hung tai, lòng nhân từ được báo đáp.',
  'Thiên Đức': 'Thiên Đức (天德): phúc đức của trời — gặp dữ hóa lành, người thân thiện lương thiện.',
  'Thập Can Lộc': 'Lộc Thần (禄神): "lộc" của bản thân — tài lộc chính đáng, sức khỏe, tự lập được; vị trí Lộc là nơi sinh khí của ngày chủ.',
  'Dương Nhận': 'Dương Nhận (羊刃): lưỡi dao sắc — dũng mãnh quá mức; thành bại đều do sự liều lĩnh, cần chế ngự cảm xúc, tránh thủ thuật, dao kéo gây thương.',
  'Không Vong': 'Không Vong (空亡): giai đoạn trống rỗng — sự vật dễ đến rồi đi, quyền lực tài sản khó giữ ở vị trí này; hợp triết lý, tâm linh, ít hợp đầu cơ.'
};

/* =========================== LUẬN GIẢI =========================== */
function phanTichNguHanh(so) {
  const d = so.diemNguHanh;
  const tong = Object.values(d).reduce((a, b) => a + b, 0);
  const dmHanh = C.CAN_HANH(so.dayCan);
  const sinhToi = HANH[(HANH.indexOf(dmHanh) + 4) % 5]; // hành sinh ngày chủ
  const the = d[dmHanh] + d[sinhToi];
  const tyLe = the / tong;
  let luc = 'cân bằng', danhGia;
  if (tyLe >= 0.55) { luc = 'rất mạnh (thân vượng)'; danhGia = 'Ngày chủ mạnh mẽ — bản lĩnh, tự chủ, chịu được áp lực; khuyết điểm có thể là chủ quan, ngang bướng.'; }
  else if (tyLe >= 0.45) { luc = 'khá mạnh (thân hơi vượng)'; danhGia = 'Ngày chủ tương đối vững — đủ sức gánh tài quan, biết tiến thoái.'; }
  else if (tyLe >= 0.36) { luc = 'hơi yếu (thân hơi nhược)'; danhGia = 'Ngày chủ trung bình — cần dựa vào Ấn (người giúp) và Tỷ (đồng minh), tránh gánh quá nặng.'; }
  else { luc = 'yếu (thân nhược)'; danhGia = 'Ngày chủ yếu — nên biết nhờ vả người tài giỏi, chú ý sức khỏe, tránh ôm quá nhiều trách nhiệm.'; }
  const muc = Object.entries(d).sort((a, b) => b[1] - a[1]);
  const thieu = HANH.filter(h => d[h] / tong < 0.08);
  // Dụng thần sơ bộ
  const manh = tyLe >= 0.45;
  const dung = manh
    ? [HANH[(HANH.indexOf(dmHanh) + 2) % 5], HANH[(HANH.indexOf(dmHanh) + 1) % 5]] // khắc & tiêu tiết
    : [sinhToi, dmHanh]; // được sinh & đồng hành
  return { tong, tyLe, luc, danhGia, muc, thieu, dung, manh, dmHanh };
}

function thapThanPhanBo(so) {
  const dem = {};
  for (const p of so.pillars) {
    if (p.key !== 'ngay') dem[p.can + ':' + C.thapThan(so.dayCan, p.can)] = (dem[p.can + ':' + C.thapThan(so.dayCan, p.can)] || 0) + 1;
    for (const t of p.tangCan) dem[t.can + ':' + t.tt] = (dem[t.can + ':' + t.tt] || 0) + (t === p.tangCan[0] ? 1 : 0.5);
  }
  // gộp theo thập thần
  const gop = {};
  for (const [k, v] of Object.entries(dem)) { const tt = k.split(':')[1]; gop[tt] = (gop[tt] || 0) + v; }
  return Object.entries(gop).sort((a, b) => b[1] - a[1]);
}

function quanHeCanChi(so) {
  const out = [];
  const chis = so.pillars.map(p => p.chi);
  const cans = so.pillars.map(p => p.can);
  const ten = ['Năm', 'Tháng', 'Ngày', 'Giờ'];
  // lục hợp / tam hợp / lục xung / lục hại giữa các chi
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
    const a = chis[i], b = chis[j];
    if (C.CHI_LUC_HOP.some(([x, y]) => (x === a && y === b) || (x === b && y === a)))
      out.push(`Chi ${ten[i]} (${CHI[a]}) hợp Chi ${ten[j]} (${CHI[b]}): quan hệ hòa hợp, được trợ giúp — Lục Hợp.`);
    if (C.CHI_LUC_XUNG.some(([x, y]) => (x === a && y === b) || (x === b && y === a)))
      out.push(`Chi ${ten[i]} (${CHI[a]}) xung Chi ${ten[j]} (${CHI[b]}): "Lục Xung" — dễ biến động, xung đột ở lĩnh vực hai trụ đó chi phối.`);
    if (C.CHI_LUC_HAI.some(([x, y]) => (x === a && y === b) || (x === b && y === a)))
      out.push(`Chi ${ten[i]} (${CHI[a]}) hại Chi ${ten[j]} (${CHI[b]}): "Lục Hại" — cần đề phòng hiểu lầm, tổn hại ngầm.`);
  }
  for (const [x, y, z, e] of C.CHI_TAM_HOP) {
    const co = [x, y, z].filter(c => chis.includes(c));
    if (co.length >= 2 && new Set(co).size >= 2) {
      const dayCo = [x, y, z].every(c => chis.includes(c));
      if (dayCo) out.push(`Tam hợp ${CHI[x]}–${CHI[y]}–${CHI[z]} đủ bộ (${e}): một nhóm hành ${e} rất mạnh trong lá số — chất ${e} chi phối rõ nét tính cách & vận trình.`);
      else out.push(`Hai chi trong bộ tam hợp ${e} (${co.map(c => CHI[c]).join('–')}): có khuynh hướng hợp hóa hành ${e}, tăng thế ${e}.`);
    }
  }
  // can hợp
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
    const a = cans[i], b = cans[j];
    const h = C.CAN_HOP.find(([x, y]) => (x === a && y === b) || (x === b && y === a));
    if (h) out.push(`Can ${ten[i]} (${CAN[a]}) hợp Can ${ten[j]} (${CAN[b]}) hóa ${h[2]}: sự gắn kết, hôn nhân hợp tác thuận (Danh Hợp).`);
  }
  return out.length ? out : ['Bốn trụ không có hợp – xung – hại nổi bật: cấu trúc tương đối thuần nhất, các yếu tố ít triệt tiêu lẫn nhau.'];
}

function phanTichDaiVan(so, namHienTai) {
  const out = [];
  const dmHanh = C.CAN_HANH(so.dayCan);
  for (const dv of so.daiVan.list) {
    const canH = C.CAN_HANH(dv.can);
    const chiH = C.CHI_HANH[dv.chi];
    const quanHeCan = ['Tương sinh (dưỡng mạnh ngày chủ)', 'Sinh xuất (tiêu hao ngày chủ)', 'Tương khắc (áp lực)', 'Bị khắc (trở ngại)', 'Tương trợ (thân cận)'];
    let idxCan;
    const eDm = HANH.indexOf(dmHanh), eC = HANH.indexOf(canH);
    if ((eC + 1) % 5 === eDm) idxCan = 0; else if ((eDm + 1) % 5 === eC) idxCan = 1;
    else if ((eC + 2) % 5 === eDm) idxCan = 2; else if ((eDm + 2) % 5 === eC) idxCan = 3; else idxCan = 4;
    const hienTai = namHienTai >= dv.namBatDau && namHienTai < dv.namBatDau + 10;
    out.push({
      ...dv, hienTai,
      giai: `${VAN_THEO_THAP_THAN[dv.thapThanCan]} Can vận ${CAN[dv.can]} mang hành ${canH} — ${quanHeCan[idxCan].toLowerCase()} đối với ngày chủ; chi vận ${CHI[dv.chi]} (hành ${chiH}) tạo nền giai đoạn này. Trường sinh của cặp vận: ${dv.truongSinh} — ${TRUONG_SINH_GIAI[dv.truongSinh] || ''}`
    });
  }
  return out;
}

/* ---------- Luận giải tổng hợp ---------- */
function luanGiai(so, namHienTai) {
  const bh = phanTichNguHanh(so);
  const tt = thapThanPhanBo(so);
  const qh = quanHeCanChi(so);
  const dv = phanTichDaiVan(so, namHienTai || new Date().getFullYear());
  const nu = so.input.gioitinh === 'nu';
  const dmHanh = C.CAN_HANH(so.dayCan);
  const ngayChu = NGAY_CHU[so.dayCan];

  // Tính cách: top thập thần
  const topTT = tt.slice(0, 3).filter(x => x[1] >= 1.5);
  const tinhCach = topTT.map(([t, v]) => `**${t}** (xuất hiện ${v >= 2 ? 'nhiều' : 'rõ nét'}): ${THAP_THAN_GIAI[t].tc}.`).join(' ');

  // Tình duyên
  const daoHoaCo = so.thanSat.some(s => s.ten === 'Đào Hoa' && so.pillars.some(p => p.chi === s.vi));
  const hongLoanCo = so.thanSat.some(s => s.ten === 'Hồng Loan' && so.pillars.some(p => p.chi === s.vi));
  const tinhDuyenChinh = nu ? 'Chính Quan' : 'Chính Tài';
  const tinhDuyenPhu = nu ? 'Thất Sát' : 'Thiên Tài';
  const coChinh = tt.some(([t, v]) => t === tinhDuyenChinh && v >= 1);
  const coPhu = tt.some(([t, v]) => t === tinhDuyenPhu && v >= 1);
  const tinhDuyen = [
    daoHoaCo ? 'Có sao Đào Hoa xuất hiện ngay trong tứ trụ: duyên phái tốt, dễ hấp dẫn người khác giới; nếu đi cùng Hồng Loan thì tình duyên rất sớm nở.' : 'Không thấy Đào Hoa hiện diện trong tứ trụ: tình cảm tiến triển theo hướng chậm mà chắc, cần chủ động hơn trong giao tiếp.',
    hongLoanCo ? 'Hồng Loan hiện diện: duyên vợ chồng, hôn nhân là đề tài quan trọng của đời người.' : '',
    coChinh ? `Có ${tinhDuyenChinh} (người hôn phối chính danh) trong số: ${nu ? 'chồng yêu thương, có trách nhiệm' : 'vợ đảm, hôn nhân bền vững'}, hôn nhân là điểm tựa.` : '',
    coPhu ? `${tinhDuyenPhu} cũng hiện diện: ${nu ? 'đời sống tình cảm mãnh liệt, dễ có hơn một lần lựa chọn' : 'có duyên người tình bên ngoài hoặc vợ hai, nên giữ chừng mực'}.` : ''
  ].filter(Boolean);

  // Sự nghiệp
  const nghe = HANH_KHUYEN[bh.dung[0]];
  const nghe2 = HANH_KHUYEN[bh.dung[1]];
  const suNghiep = [
    `Ngũ hành thuận lợi nhất (dụng thần sơ bộ): **${bh.dung.join(', ')}**. Ngành nghề nên theo: ${nghe.nghe}${nghe2 && nghe2 !== nghe ? '; hoặc ' + nghe2.nghe : ''}.`,
    `Thập thần nổi trội nhất là **${tt[0][0]}** — lĩnh vực phát triển: ${THAP_THAN_GIAI[tt[0][0]].lv}.`
  ];

  // Sức khỏe
  const yeuNhat = bh.muc[bh.muc.length - 1][0];
  const khacManhNhat = HANH[(HANH.indexOf(yeuNhat) + 2) % 5];
  const sucKhoe = `Hành yếu nhất trong số là **${yeuNhat}** — cần chú ý ${HANH_KHUYEN[yeuNhat].tang}; đồng thời hành ${khacManhNhat} bị chế quá mạnh cũng ảnh hưởng ${HANH_KHUYEN[khacManhNhat].tang}. Nên duy trì sinh hoạt điều độ theo mùa.`;

  // Thần sát nổi bật trong trụ
  const satNoiBat = [];
  for (const p of so.pillars) for (const s of p.thanSat) if (!satNoiBat.includes(s)) satNoiBat.push(s);

  // Khuyến nghị màu sắc theo bảng mệnh (như battu.kabala.vn)
  const khuyenNghi = {
    dung: bh.dung,
    mau: HANH_KHUYEN[bh.dung[0]].mau,
    mauTranh: HANH_KHUYEN[dmHanh].tranh,
    huong: HANH_KHUYEN[bh.dung[0]].huong,
    nghe: HANH_KHUYEN[bh.dung[0]].nghe,
    thieu: bh.thieu
  };

  return { bh, tt, qh, dv, ngayChu, tinhCach, tinhDuyen, suNghiep, sucKhoe, satNoiBat, khuyenNghi, nu };
}

const LuanGiai = { luanGiai, NGAY_CHU, THAP_THAN_GIAI, VAN_THEO_THAP_THAN, HANH_KHUYEN, TRUONG_SINH_GIAI, THAN_SAT_GIAI, phanTichNguHanh, thapThanPhanBo };
if (typeof module !== 'undefined' && module.exports) module.exports = LuanGiai;
else global.BattuLuanGiai = LuanGiai;
})(typeof window !== 'undefined' ? window : globalThis);
