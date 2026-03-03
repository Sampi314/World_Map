# 🚀 Cách Đưa Bản Đồ Cố Nguyên Giới Lên GitHub Pages (Dễ Nhất)

Đây là cách dễ nhất, **không cần cài đặt Node.js, Vite, hay chạy bất cứ lệnh build nào**.
Bản đồ đã được đóng gói thành một file `index.html` duy nhất sử dụng React và Babel thông qua CDN (tải trực tiếp từ trình duyệt).

## Hướng dẫn 3 Bước Cực Kỳ Đơn Giản

### Bước 1: Tạo Kho Lưu Trữ (Repository) Mới Trên GitHub
1. Đăng nhập vào [GitHub](https://github.com/).
2. Bấm vào nút **"New"** (hoặc dấu `+` ở góc trên bên phải) để tạo một Repository mới.
3. Đặt tên là `co-nguyen-gioi-map` (hoặc bất kỳ tên nào bạn thích).
4. Chọn **Public** (Công khai).
5. Tích vào ô **"Add a README file"**.
6. Bấm **"Create repository"**.

### Bước 2: Tải File `index.html` Lên
1. Trong repository mới tạo, bấm vào nút **"Add file"** > **"Upload files"**.
2. Kéo thả file `index.html` (đã được tạo sẵn chứa toàn bộ code bản đồ) vào vùng chọn.
3. Kéo xuống dưới cùng và bấm nút xanh lá **"Commit changes"**.

### Bước 3: Bật GitHub Pages
1. Nhìn lên thanh menu ngang của repository, bấm vào biểu tượng ⚙️ **"Settings"** (Cài đặt).
2. Nhìn sang cột bên trái (bên dưới phần 'Code and automation'), chọn **"Pages"**.
3. Ở phần **"Build and deployment"**:
   - Nguồn (Source): Để mặc định là **"Deploy from a branch"**.
   - Nhánh (Branch): Chọn `main` (hoặc `master`), thư mục bên cạnh để là `/ (root)`.
4. Bấm **"Save"**.

🎉 **Hoàn thành!**
Đợi khoảng 1-2 phút. Bạn quay lại phần "Pages" sẽ thấy một đường link dạng:
`https://<tên-người-dùng>.github.io/co-nguyen-gioi-map/`

Đó chính là đường dẫn xem bản đồ. Bạn có thể gửi link này cho bất kỳ ai!

---
*Lưu ý: Mọi chỉnh sửa cho file `index.html` về sau đều có thể làm trực tiếp trên giao diện của GitHub. Chỉ cần bấm biểu tượng bút chì ✏️ để edit, sau đó commit là GitHub Pages sẽ tự động cập nhật lại bản đồ.*
