# Lá Số Bát Tự — Tứ Trụ & Luận Giải (Bát Tự)

Trang web lập **Lá Số Bát Tự (Tứ Trụ – Tử Bình)** và **luận giải vận mệnh**, được xây dựng lại
từ các công thức tính lá số của **https://battu.kabala.vn/** (đối chiếu và khớp 100 % với lá số
mẫu của trang — xem [`CONG-THUC-LAP-LA-SO.md`](CONG-THUC-LAP-LA-SO.md)).

## Tính năng

- **Lập lá số** từ giới tính + ngày/tháng/năm + giờ/phút + múi giờ: 4 trụ Năm–Tháng–Ngày–Giờ
  (can chi), Âm lịch, tiết khí, Tàng can + Thập thần, Nạp âm, Trường sinh, Thần sát.
- **Đại vận 10 năm**: thuận/nghịch, tuổi khởi vận (3 ngày = 1 năm), chuỗi 10 vận kèm
  tàng can, nạp âm, trường sinh, thần sát + **chu kỳ Lưu niên** bấm để xem chi tiết.
- **Luận giải tự động** (tiếng Việt): nhật chủ, ngũ hành cân bằng, thân cường nhược,
  tính cách theo Thập thần, tình duyên, sự nghiệp – tài lộc, sức khỏe, hợp/xung/hình/hại,
  thần sát, khuyến nghị màu sắc – hướng – nghề theo dụng thần, diễn giải từng đại vận.
- **Phương hướng Bát trạch** (mệnh quái, 8 hướng tốt/xấu), **Bảng thần sát** theo trụ ngày/năm,
  **Mệnh cung – Thai cung**.
- **Mục "Công thức"** ngay trên trang: giải thích 14 nhóm công thức lập lá số.
- Chia sẻ lá số qua URL `?birth=YYYY-MM-DD-HH-nam|nu&phut=MM&tz=...` (tương thích định dạng kabala),
  **Copy dữ liệu** lá số (dùng để hỏi AI), **In / Lưu PDF**.

## Chạy trang web

Trang tĩnh, không cần cài đặt:

```bash
cd battu
python3 -m http.server 8000
# mở http://localhost:8000
```

(Hoặc mở trực tiếp `index.html` — mọi tính toán chạy 100 % phía trình duyệt.)

## Cấu trúc

| Tệp | Nội dung |
|---|---|
| `index.html` | Trang chính (form + các khối kết quả) |
| `assets/battu-core.js` | Engine: thiên văn (tiết khí Meeus + ΔT + nutation, sóc/âm lịch Hồ Ngọc Đức), tứ trụ, tàng can, thập thần, nạp âm, trường sinh, thần sát, đại vận – lưu niên, mệnh/thai cung, bát trạch |
| `assets/battu-luangiai.js` | Bộ máy luận giải (văn bản tiếng Việt theo quy tắc mệnh lý) |
| `assets/app.js` | Giao diện, render bảng, tương tác bấm chọn, copy/in/URL |
| `assets/style.css` | Giao diện tối – vàng kim, responsive, bản in |
| `test.mjs` | 61 phép kiểm chứng engine với lá số chuẩn kabala + tiết khí + âm lịch |
| `test-ui.cjs` | Smoke-test giao diện (giả lập DOM) |
| `CONG-THUC-LAP-LA-SO.md` | Tài liệu đầy đủ các công thức lập lá số đã trích xuất |

```bash
node test.mjs    # chạy kiểm chứng
node test-ui.cjs # smoke-test UI
```

## Ghi chú

- Thời gian tiết khí tính theo thuật toán thiên văn (sai số ±7 phút) — người sinh gần thời điểm
  chuyển tiết nên kiểm tra lại giờ sinh/múi giờ.
- Sinh 23:00–24:00 được tính là giờ Tý của ngày hôm sau (quy tắc truyền thống).
- Lá số & luận giải chỉ mang tính tham khảo, nghiên cứu văn hoá phương Đông.
