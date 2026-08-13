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

## Backend

- Supabase Postgres lưu nội dung landing page.
- Supabase Storage bucket `site-assets` lưu hình ảnh Admin upload.
- Supabase Auth email/password cho tài khoản được tạo thủ công.
- Row Level Security cho public chỉ đọc và mọi user đã đăng nhập được ghi.

Hệ thống không cần domain email công ty, magic link hoặc SMTP.

## Thiết lập Supabase

Chạy lần lượt hai migration:

```text
supabase/migrations/202608130001_landing_page_backend.sql
supabase/migrations/202608140001_manual_admin_accounts.sql
```

Sau đó:

1. Authentication > Providers > Email: tắt Allow new users to sign up.
2. Authentication > Hooks: tắt Before User Created Hook cũ nếu đã bật.
3. Authentication > Users > Add user > Create new user.
4. Nhập email, mật khẩu mạnh và chọn xác nhận email tự động nếu Dashboard có tùy chọn.
5. User vừa tạo có thể đăng nhập Content Studio ngay, không cần thêm bảng quyền hoặc chạy SQL cấp quyền riêng.

## Biến môi trường

Tạo `.env.local`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_KEY
```

Publishable key có thể dùng trong frontend khi RLS đã bật. Không đưa `service_role`, secret key hoặc database password vào Vite/repository.

## Content Studio

Truy cập `/admin`, nhập email và mật khẩu của user đã được tạo/cấp quyền. Admin có thể quản lý:

- Brand, logo, Hero và Footer.
- Text của tất cả section.
- Timeline, bài báo, recognition và services.
- Partners, case studies và team.
- Hình ảnh trên Supabase Storage.

## Tài liệu

- `HUONG_DAN_DU_AN.md`: kiến trúc và bảo trì toàn bộ website.
- `HUONG_DAN_DEPLOY_VERCEL_SUPABASE.md`: thiết lập Supabase và deploy Vercel từng bước.

## Cấu trúc chính

- `src/pages/HomePage.jsx`: bố cục trang chủ.
- `src/pages/AdminPage.jsx`: Content Studio và form đăng nhập.
- `src/services/authService.js`: email/password Auth.
- `src/services/contentRepository.js`: Database, Realtime và Storage.
- `src/lib/supabase.js`: Supabase browser client.
- `src/data/siteData.js`: nội dung fallback.
- `supabase/migrations`: schema và policy.
