# DGM Credential 2026

Website credential của DGM, xây dựng bằng React, Vite và Supabase.

## Khởi chạy

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Supabase backend

Ứng dụng dùng:

- Supabase Postgres để lưu toàn bộ nội dung landing page.
- Supabase Storage bucket `site-assets` để lưu hình ảnh do admin tải lên.
- Supabase Auth magic link để đăng nhập bằng email thật thuộc `@digimind.asia`.
- Row Level Security để trang public chỉ đọc và chỉ người dùng công ty được ghi dữ liệu.

### 1. Tạo database và policy

Mở Supabase Dashboard > SQL Editor và chạy file:

`supabase/migrations/202608130001_landing_page_backend.sql`

Sau đó vào Authentication > Hooks > Before User Created, chọn Postgres function:

`public.hook_restrict_digimind_signup`

Hook này chặn tài khoản ngoài domain công ty ngay trước khi user được tạo. RLS trong migration tiếp tục kiểm tra lại domain cho mọi thao tác thêm, sửa, xóa.

### 2. Cấu hình URL đăng nhập

Trong Authentication > URL Configuration:

- Site URL: URL production của website.
- Redirect URLs: thêm `http://localhost:5173/admin` và URL `/admin` của production.

### 3. Cấu hình gửi email thật

Trong Authentication > Emails > SMTP Settings, cấu hình SMTP của công ty hoặc một nhà cung cấp email giao dịch. SMTP mặc định của Supabase chỉ phù hợp để thử nghiệm và thường chỉ gửi tới thành viên của Supabase project.

### 4. Cấu hình frontend

Tạo `.env.local` từ `.env.example`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_KEY
VITE_COMPANY_EMAIL_DOMAIN=digimind.asia
VITE_SUPABASE_ALLOW_SIGNUP=true
```

Publishable key có thể dùng ở frontend khi RLS đã bật. Không đưa `service_role` hoặc secret key vào Vite hay repository.

## Content Studio

Truy cập `/admin`, nhập email `@digimind.asia`, rồi mở magic link trong hộp thư. Admin có thể quản lý:

- Nhận diện thương hiệu, logo, hero và footer.
- Text của tất cả section.
- Timeline, bài báo, recognition và services.
- Partners, case studies và team.
- Hình ảnh lưu trực tiếp trên Supabase Storage.

Nội dung public được tải từ Supabase và tự cập nhật khi database thay đổi.

## Cấu trúc chính

- `src/pages/HomePage.jsx`: bố cục trang chủ.
- `src/pages/AdminPage.jsx`: Content Studio và đăng nhập Supabase.
- `src/services/authService.js`: magic-link Auth và kiểm tra domain.
- `src/services/contentRepository.js`: Database, realtime và Storage.
- `src/lib/supabase.js`: Supabase browser client.
- `src/data/siteData.js`: nội dung mặc định khi database chưa có dữ liệu.
- `supabase/migrations`: schema, RLS, Storage policy và Auth hook.
