# CÔNG THỨC LẬP LÁ SỐ BÁT TỰ (TỨ TRỤ – TỬ BÌNH)

> Tài liệu trích xuất & kiểm chứng từ **https://battu.kabala.vn/** — toàn bộ công thức
> đã được đối chiếu với lá số mẫu của trang (nam, 13/03/2024, 00:00, GMT+7) và khớp 100 %
> (xem bảng kiểm chứng cuối tài liệu). Bộ test tự động: `node test.mjs`.

Lá số Bát Tự gồm **8 chữ** (4 cặp Thiên can – Địa chi) của **4 trụ**: Giờ – Ngày – Tháng – Năm sinh,
kèm các lớp phân tích: Tàng can, Thập thần, Nạp âm, Trường sinh, Thần sát, Đại vận – Lưu niên,
Mệnh cung – Thai cung, Phương hướng (Bát trạch).

---

## 1. Dữ liệu đầu vào

| Thông tin | Ghi chú |
|---|---|
| Giới tính | nam / nữ — quyết định hướng đại vận |
| Ngày – tháng – năm sinh | dương lịch |
| Giờ – phút sinh | quy đổi giờ địa chi; **23:00–24:00 = giờ Tý của ngày hôm sau** |
| Múi giờ | mặc định GMT+7 (Việt Nam) |

## 2. Nền thiên văn (không có trong giao diện nhưng là gốc của mọi trụ)

1. **Tiết khí 24 cửa**: thời điểm kinh độ hoàng đạo biểu kiến của Mặt Trời đạt k × 15°
   (Lập Xuân = 315°, Đông Chí = 270°…). Tính bằng công thức Meeus (kinh độ Mặt Trời)
   + ΔT + nutation — sai số ±7 phút so với lịch thiên văn.
2. **Ngày Sóc** (ngày đầu tháng âm): thuật toán pha trăng mới Meeus rút gọn
   (bản Hồ Ngọc Đức), làm tròn theo múi giờ GMT+7.
3. **Âm lịch**: tháng 11 âm lịch là tháng chứa Đông Chí; nếu giữa hai tháng 11 có 13 tháng
   âm thì năm đó có tháng nhuận = tháng đầu tiên **không chứa trung khí**.
4. **Ngày Julius (JDN)**: số ngày liên tục — nền của trụ ngày.

## 3. Bốn trụ (Tứ trụ)

### 3.1 Trụ NĂM
- Năm Bát Tự bắt đầu tại tiết **Lập Xuân** (không phải 1/1). Sinh trước Lập Xuân → dùng năm trước.
- **Công thức**: `chi số hoa giáp năm = (năm − 4) mod 60` (0 = Giáp Tý).

### 3.2 Trụ THÁNG
- Chi tháng đổi tại mỗi **tiết** (không phải trung khí): Lập Xuân → tháng Dần, Kinh Trập → Mão,
  Thanh Minh → Thìn, Lập Hạ → Tỵ, Mang Chủng → Ngọ, Tiểu Thử → Mùi, Lập Thu → Thân,
  Bạch Lộ → Dậu, Hàn Lộ → Tuất, Lập Đông → Hợi, Đại Tuyết → Tý, Tiểu Hàn → Sửu.
- Can tháng theo **Ngũ Hổ Đốn** từ can năm:
  `can tháng = ((can năm mod 5) × 2 + số tháng kể từ Dần + 2) mod 10`
  (Giáp/Kỷ năm → tháng Dần khởi đầu Bính; Ất/Canh → Mậu; Bính/Tân → Canh; Đinh/Nhâm → Nhâm; Mậu/Quý → Giáp).

### 3.3 Trụ NGÀY
- **Công thức**: `trụ ngày = (JDN + 49) mod 60`, 0 = Giáp Tý.
- Sinh 23:00–24:00: dùng JDN của **ngày hôm sau**.

### 3.4 Trụ GIỜ
- Chi giờ (2 giờ 1 chi): Tý 23–1, Sửu 1–3, Dần 3–5, Mão 5–7, Thìn 7–9, Tỵ 9–11,
  Ngọ 11–13, Mùi 13–15, Thân 15–17, Dậu 17–19, Tuất 19–21, Hợi 21–23.
- Can giờ theo **Ngũ Thử Đốn**: `can giờ = ((can ngày mod 5) × 2 + chỉ số chi giờ) mod 10`
  (Giáp/Kỷ ngày → giờ Tý là Giáp; Bính/Tân ngày → giờ Tý là Mậu …).

## 4. Tàng can (khí ẩn trong chi)

| Chi | Tàng can (chính / trung / dư) |
|---|---|
| Tý | Quý |
| Sửu | Kỷ · Quý · Tân |
| Dần | Giáp · Bính · Mậu |
| Mão | Ất |
| Thìn | Mậu · Ất · Quý |
| Tỵ | Bính · Canh · Mậu |
| Ngọ | Đinh · Kỷ |
| Mùi | Kỷ · Đinh · Ất |
| Thân | Canh · Nhâm · Mậu |
| Dậu | Tân |
| Tuất | Mậu · Tân · Đinh |
| Hợi | Nhâm · Giáp |

## 5. Thập thần (10 quan hệ so với NGÀY CHỦ)

| Quan hệ | Cùng âm dương | Khác âm dương |
|---|---|---|
| Cùng hành | **Tỷ Kiên** | **Kiếp Tài** |
| Ngày chủ sinh ra | **Thực Thần** | **Thương Quan** |
| Sinh vào ngày chủ (Ấn) | **Thiên Ấn** | **Chính Ấn** |
| Ngày chủ khắc (Tài) | **Thiên Tài** | **Chính Tài** |
| Khắc ngày chủ (Quan/Sát) | **Thất Sát** | **Chính Quan** |

Viết tắt trên lá số (theo kabala): TK Tỷ Kiên · KT Kiếp Tài · TH Thực Thần · TQ Thương Quan ·
CT Chính Tài · TT Thiên Tài · CQ Chính Quan · TS Thất Sát · CA Chính Ấn · TA Thiên Ấn.

## 6. Nạp âm (30 cặp hoa giáp)

`chỉ số cặp = floor(hoa giáp / 2) mod 30`, lần lượt:
Hải Trung Kim, Lư Trung Hỏa, Đại Lâm Mộc, Lộ Bàng Thổ, Kiếm Phong Kim, Sơn Đầu Hỏa,
Giản Hạ Thủy, Thành Đầu Thổ, Bạch Lạp Kim, Dương Liễu Mộc, Tỉnh Tuyền Thủy, Ốc Thượng Thổ,
Tích Lịch Hỏa, Tùng Bá Mộc, Trường Lưu Thủy, Sa Trung Kim, Sơn Hạ Hỏa, Bình Địa Mộc,
Bích Thượng Thổ, Kim Bạch Kim, Phú Đăng Hỏa, Thiên Hà Thủy, Đại Dịch Thổ, Thoa Xuyến Kim,
Tang Đố Mộc, Đại Khê Thủy, Sa Trung Thổ, Thiên Thượng Hỏa, Thạch Lựu Mộc, Đại Hải Thủy.

## 7. Trường sinh (12 giai đoạn) — tính cho TỪNG TRỤ (can trụ đối chiếu chi trụ)

Điểm Trường Sinh của 10 can:

| Giáp | Ất | Bính | Đinh | Mậu | Kỷ | Canh | Tân | Nhâm | Quý |
|---|---|---|---|---|---|---|---|---|---|
| Hợi | Ngọ | Dần | Dậu | Dần | Dậu | Tỵ | Tý | Thân | Mão |

- **Dương can thuận hành** (chi tăng dần), **âm can nghịch hành** (chi giảm dần).
- 12 giai đoạn: Trường Sinh → Mộc Dục → Quan Đới → Lâm Quan → Đế Vượng → Suy → Bệnh →
  Tử → Mộ → Tuyệt → Thai → Dưỡng.
- Kiểm chứng (lá số kabala): Giáp Thìn → **Suy**, Đinh Mão → **Bệnh**, Bính Tý → **Thai**,
  Mậu Tý → **Thai** ✔ (cách tính từng trụ, không phải theo ngày chủ).

## 8. Thần sát

**Theo nhóm tam hợp của chi tham chiếu (trụ ngày & trụ năm)** — nhóm:
{Thân,Tý,Thìn} · {Dần,Ngọ,Tuất} · {Tỵ,Dậu,Sửu} · {Hợi,Mão,Mùi}:

| Thần sát | Giá trị theo 4 nhóm |
|---|---|
| Tướng Tinh | Tý · Ngọ · Dậu · Mão |
| Hoa Cái | Thìn · Tuất · Sửu · Mùi |
| Kiếp Sát | Tỵ · Hợi · Dần · Thân |
| Đào Hoa | Dậu · Mão · Ngọ · Tý |
| Thiên Mã | Dần · Thân · Hợi · Tỵ |
| Cô Thần | Dần · Tỵ · Thân · Hợi |
| Quả Tú | Tuất · Sửu · Thìn · Mùi |

**Theo chi tham chiếu**: Hồng Loan (Tý→Mão, Sửu→Dần, Dần→Sửu, Mão→Tý, Thìn→Hợi, Tỵ→Tuất,
Ngọ→Dậu, Mùi→Thân, Thân→Mùi, Dậu→Ngọ, Tuất→Tỵ, Hợi→Thìn); Thiên Hỷ (theo mùa:
Xuân→Tuất, Hạ→Sửu, Thu→Thìn, Đông→Mùi).

**Theo can tham chiếu (trụ ngày & trụ năm)**:

| Thần sát | Bảng theo 10 can (Giáp…Quý) |
|---|---|
| Quý Nhân (Thiên Ất) | Sửu,Mùi · Tý,Thân · Hợi,Dậu · Hợi,Dậu · Sửu,Mùi · Tý,Thân · Sửu,Mùi · Dần,Ngọ · Mão,Tỵ · Mão,Tỵ |
| Văn Xương | Tỵ · Ngọ · Thân · Dậu · Thân · Dậu · Hợi · Tý · Dần · Mão |
| Học Đường (theo hành can) | Mộc→Hợi · Hỏa→Dần · Thổ→Thân · Kim→Tỵ · Thủy→Thân |
| Thập Can Lộc | Dần · Mão · Tỵ · Ngọ · Tỵ · Ngọ · Thân · Dậu · Hợi · Tý |
| Dương Nhận | Mão · — · Ngọ · — · Ngọ · — · Dậu · — · Tý · — |

**Theo chi tháng**: Nguyệt Đức (Dần,Ngọ,Tuất→Bính; Thân,Tý,Thìn→Nhâm; Hợi,Mão,Mùi→Giáp; Tỵ,Dậu,Sửu→Canh);
Thiên Đức (Dần→Đinh, Mão→Thân, Thìn→Nhâm, Tỵ→Tân, Ngọ→Hợi, Mùi→Giáp, Thân→Quý, Dậu→Dần, Tuất→Bính, Hợi→Ất, Tý→Tỵ, Sửu→Canh).

**Không Vong**: 2 chi khuyết của cặp hoa giáp trụ ngày — `Tuất,Hợi (cặp 0) · Tý,Sửu (cặp 1) · Dần,Mão (cặp 2) …`

## 9. Đại vận & khởi vận

1. **Hướng vận**: nam sinh năm **dương can** / nữ năm **âm can** → **thuận**;
   nam năm âm / nữ năm dương → **nghịch**.
2. **Khởi vận**: 3 ngày = 1 năm (1 ngày = 4 tháng, 2 giờ = 5 ngày):
   - Thuận: đếm số ngày từ **giờ sinh tới tiết kế tiếp**;
   - Nghịch: từ **tiết vừa qua tới giờ sinh**.
3. **Chuỗi vận**: từ trụ tháng, thuận thì cộng dần +1, nghịch thì −1 hoa giáp;
   mỗi vận 10 năm; tuổi vận = tuổi khởi vận + (k−1)×10.
4. **Lưu niên**: 10 năm dương lịch của mỗi vận, ghi can chi năm
   (`(năm − 4) mod 60`).

Kiểm chứng kabala: sinh 13/3/2024 0:00 nam (năm Giáp — dương can → thuận);
tiết kế tiếp là Thanh Minh 4/4/2024 ≈ 22,3 ngày ⇒ 22,3 ÷ 3 ≈ **7 năm 4 tháng → khởi vận 7 tuổi (2031)** ✔.

## 10. Mệnh cung · Thai cung (công thức kabala)

- **Mệnh Cung** = trụ tháng **lùi 1** (can −1, chi −1). VD: tháng Đinh Mão → **Bính Dần** ✔
- **Thai Cung** = can ngày **+2**, chi ngày **+6**. VD: ngày Bính Tý → **Mậu Ngọ** ✔

## 11. Phương hướng (Bát trạch theo mệnh quái)

- Mệnh quái: tổng chữ số năm sinh rút về 1 chữ số `s`;
  **nam = 11 − s**, **nữ = s + 4** (rút về 1–9; số 5: nam → Khôn(2), nữ → Cấn(8)).
- 8 cung: 1 Khảm · 2 Khôn · 3 Chấn · 4 Tốn · 6 Càn · 7 Đoài · 8 Cấn · 9 Ly.
- Bảng 8 hướng theo **Đại Du Niên**: 4 tốt — Sinh Khí, Thiên Y, Diên Niên, Phục Vị;
  4 xấu — Họa Hại, Ngũ Quỷ, Lục Sát, Tuyệt Mệnh (bảng đầy đủ cho 8 quái có trong `battu-core.js`).
- Kiểm chứng kabala: nam 2024 → s=8 → 11−8 = 3 = **Chấn**; Chấn có Sinh Khí = Nam (Ly) ✔

## 12. Luận giải (cơ sở tự động)

1. **Điểm ngũ hành**: thiên can ×1.0; tàng can chính khí ×0.7, trung ×0.3, dư ×0.15; chi tháng ×1.3.
2. **Thân cường/nhược**: tỉ lệ "thể" = (hành ngày chủ + hành sinh ngày chủ) ÷ tổng.
   ≥55 % rất mạnh · 45–55 % hơi vượng · 36–45 % hơi yếu · <36 % yếu.
3. **Dụng thần sơ bộ**: thân mạnh → hành khắc/tiêu tiết; thân yếu → hành sinh/tương trợ.
4. **Phân bố thập thần** → tính cách, sự nghiệp, tình duyên (nam xem Tài = vợ, nữ xem Quan = chồng).
5. **Thần sát + quan hệ hợp/xung/hình/hại** → điểm nhấn đời sống.
6. **Đại vận**: thập thần của can vận + sinh khắc với ngày chủ → chủ đề 10 năm.

---

## Bảng kiểm chứng với lá số chuẩn của battu.kabala.vn

Nam · 13/03/2024 · 00:00 · GMT+7:

| Hạng mục | kabala.vn | Bản web này | Kết quả |
|---|---|---|---|
| Trụ Năm / Tháng / Ngày / Giờ | Giáp Thìn / Đinh Mão / Bính Tý / Mậu Tý | như trái | ✔ |
| Âm lịch | 4/2/2024 | 4/2/2024 | ✔ |
| Tiết khí | Kinh Trập | Kinh Trập (5/3 09:22 ±5') | ✔ |
| Nạp âm 4 trụ | Phú Đăng Hỏa / Lư Trung Hỏa / Giản Hạ Thủy / Tích Lịch Hỏa | như trái | ✔ |
| Trường sinh | Suy / Bệnh / Thai / Thai | như trái | ✔ |
| Tàng can + thập thần | TH Mậu · CA Ất · CQ Quý (năm)… | như trái | ✔ |
| Thần sát trụ | Hoa Cái, Nguyệt Đức (năm); Tướng Tinh (ngày, giờ) | như trái | ✔ |
| Đại vận | thuận, khởi 7 tuổi (2031), Mậu Thìn → Bính Tý | như trái | ✔ |
| Lưu niên | 2031 Tân Hợi … 2040 Canh Thân | như trái | ✔ |
| Mệnh Cung / Thai Cung | Bính Dần / Mậu Ngọ | như trái | ✔ |
| Phương hướng | Chấn (Sinh Khí = Nam Ly) | như trái | ✔ |

> Ghi chú: thời gian tiết khí có sai số ±7 phút (thuật toán Meeus + ΔT + nutation);
> người sinh gần thời điểm chuyển tiết nên kiểm tra lại giờ sinh.
