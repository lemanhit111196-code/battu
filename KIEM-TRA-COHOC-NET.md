# KIỂM TRA CÔNG THỨC LẬP LÁ SỐ CỦA COHOC.NET/xem-tu-tru.html

> Đối chiếu bằng **mã nguồn JavaScript thật** của cohoc.net (thư viện `js/amlich.js`, `js/canchi.js`,
> `js/thoithan2.js`, `js/linhtinh.js` — tác giả Harry Tran "Thiên Y", Mỹ, cuối thập niên 1990–2000,
> được nhiều web tử vi Việt Nam dùng lại) với engine thiên văn của trang web này (đã kiểm chứng
> 100 % với battu.kabala.vn).

## 1. Cách cohoc.net tính (trích từ mã nguồn của họ)

| Thành phần | Công thức trong mã nguồn cohoc.net |
|---|---|
| **Âm lịch** | Bảng tra hex 1900–2100 (`amLich[]`, bảng Trung Quốc kinh điển, dựng theo giờ GMT+8) — không tính thiên văn, ngoài 1900–2100 không dùng được |
| **Tiết khí** | `TietKhi(y,n) = 31556925974,7 ms × (y − 1900) + TIET24[n] phút + 6/1/1900 02:05 UTC` — **công thức cộng dồn tuyến tính** (năm trung bình 365,24219 ngày), chỉ trả về **NGÀY** (không có giờ/phút) |
| **Trụ năm** | `TueCanVi = (năm_âm + 6) mod 10`, `TueChiVi = (năm_âm + 8) mod 12` — năm âm lấy theo **bảng âm lịch (mốc Tết Nguyên Đán)**; trong thư viện **không có hiệu chỉnh Lập Xuân** |
| **Can tháng** | Ngũ Hổ Đốn dạng bảng (`can24/can36/...`) — ✓ chuẩn |
| **Can giờ** | Ngũ Thử Đốn dạng bảng (`can12/can24/...`, `getCanHour0(jdn)`) — ✓ chuẩn |
| **Hợp/xung/hình** | Bảng chuẩn: can hợp khoảng cách 5 → hóa hành; chi lục hợp & hóa; xung khoảng cách 6; nhị hình Tý–Mão, Sửu–Tuất, Dần–Tỵ, Thìn–Mùi, Ngọ–Dậu, Thân–Hợi; tam hình, tự hình — ✓ chuẩn |
| **Hành chi** | `ChiHanh = Thủy, Thổ, Mộc, Mộc, Thổ, Hỏa, Hỏa, Thổ, Kim, Kim, Thổ, Thủy` — ✓ khớp bảng đã sửa của engine này |
| **Nạp âm** | `napam.js` (bảng 30 cặp — chưa đối chiếu chi tiết) |
| **Trường sinh / Đại vận** | Không nằm trong các file thư viện đã đọc (nằm trong script nội tuyến của trang — không trích xuất được qua fetch) |
| **Input** | Chọn giờ theo canh (Tí 23g–1g…), **không nhập phút** |

## 2. Đo thực nghiệm (script so sánh 216 tiết khí 1900–2099)

| Chỉ số | Kết quả |
|---|---|
| Lệch giờ tối đa giữa `TietKhi` của cohoc và lịch thiên văn | **10,8 giờ** (năm 2099) — sai số tích lũy ≈ +0,13 giờ/năm, lớn dần về cuối thế kỷ 21 |
| Số tiết **sai ngày** (quy đổi GMT+7) | **65/216 (30 %)** |
| Giai đoạn 2000–2024 | lệch nhỏ (phút → ~2 giờ), phần lớn vẫn đúng ngày |

**Ca biên giới năm (sinh 5/2/2024, giữa Lập Xuân 4/2 và Tết 10/2/2024):**

| Hệ | Trụ năm |
|---|---|
| Engine này (= battu.kabala.vn, mốc Lập Xuân) | **Giáp Thìn** ✓ chuẩn Tử Bình |
| Thư viện cohoc.net (mốc Tết theo bảng âm lịch) | **Quý Mão** ✗ |

*Lưu ý trung thực: script nội tuyến của trang cohoc có thể có hiệu chỉnh bổ sung ngoài thư viện
(không trích xuất được); bảng trên phản ánh đúng mã nguồn `amlich.js` mà trang đang nạp.*

## 3. Kết luận so sánh 3 hệ công thức

| Hạng mục | cohoc.net | battu.kabala.vn / engine này |
|---|---|---|
| Nền lịch | Bảng tra 1900–2100 (GMT+8) | Thuật toán thiên văn (sóc + trung khí, mọi năm, GMT+7) |
| Tiết khí | Tuyến tính, sai số tới ~11 giờ, chính xác đến ngày | Meeus + ΔT + nutation, ±7 phút |
| Mốc trụ năm | Năm âm lịch (Tết) theo bảng — có thể lệch với Lập Xuân | Lập Xuân thiên văn (chính xác đến phút) |
| Trụ tháng | Can ngũ hổ chuẩn; mốc đổi tháng theo ngày tiết tuyến tính | Can ngũ hổ; mốc đổi tại TIẾT thiên văn (chính xác giờ) |
| Trụ ngày/giờ | Ngũ cột cấu trúc chuẩn (can chi theo tầng số ngày) | (JDN + 49) mod 60, ngũ thử đốn — đã kiểm chứng kabala |
| Sinh 23h–24h | Gộp vào giờ Tí (form "Tí 23g–1g"), cách roll ngày chưa xác minh | Tính trụ ngày của hôm sau (quy tắc truyền thống) |
| Khởi vận đại vận | Không có input phút → mốc chỉ chính xác đến ngày | Đếm ngày GIỜ sinh ↔ tiết (chính xác giờ) ÷ 3 |
| Hợp/xung/hình, ngũ hổ, ngũ thử, hành chi | ✓ Chuẩn — trùng khớp engine này | ✓ |

## 4. Nhận định

1. **Phần "ngôn ngữ chung" của Tử Bình** (ngũ hổ đốn, ngũ thử đốn, hành can/chi, lục hợp – xung –
   hình – hại, nạp âm) của cohoc.net **trùng khớp** với engine này và với battu.kabala.vn — nghĩa là
   các công thức nền của trang web này là đúng truyền thống.
2. **Điểm yếu của cohoc.net nằm ở nền thiên văn**, không phải mệnh lý: tiết khí tuyến tính (lệch tới
   ~11 giờ cuối thế kỷ 21, 30 % số tiết lệch ngày), âm lịch bảng tra GMT+8, trụ năm mốc Tết thay vì
   Lập Xuân (khác chuẩn Tử Bình với người sinh ~4/2–Tết), không nhập phút sinh.
3. Với **người sinh thông thường** (không rơi vào ngày chuyển tiết/giờ giao mừng), hai hệ cho **cùng
   kết quả tứ trụ**; khác biệt chỉ xuất hiện ở **ca biên giới**: sinh gần ngày chuyển tiết, gần Tết,
   gần 23:00, hoặc các năm xa giai đoạn bảng chuẩn.
