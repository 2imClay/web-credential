# Thiết lập Supabase User thủ công và deploy Vercel

> Luồng đơn giản: bạn tạo user email/password trong Supabase Authentication, sau đó user đó đăng nhập `/admin` ngay.

## 1. Mô hình đăng nhập

Không cần:

- Domain email công ty.
- Magic link hoặc OTP.
- SMTP.
- Auth Hook giới hạn domain.
- Bảng phân quyền riêng.
- SQL cấp quyền cho từng user.

Luồng sử dụng:

```text
Bạn tạo user trong Supabase Authentication
  → user nhập email/password tại /admin
  → Supabase trả authenticated session
  → RLS cho authenticated user sửa nội dung và upload ảnh
```

Điều kiện bảo mật quan trọng: phải tắt public signup để chỉ user do bạn tự tạo mới đăng nhập được.

## 2. Trạng thái hiện tại

| Hạng mục | Trạng thái |
|---|---|
| Supabase JS SDK | ✅ Đã done |
| Form đăng nhập email/password | ✅ Đã done |
| `signInWithPassword` | ✅ Đã done |
| Database/Storage repository | ✅ Đã done |
| Migration backend gốc | ✅ Đã viết |
| Migration đổi RLS sang authenticated user | ✅ Đã viết |
| `.env.local` chứa Project URL và Publishable Key | ✅ Đã tạo local, Git ignore |
| `.env.example` không chứa giá trị thật | ✅ Đã làm sạch |
| Production build sau thay đổi Auth | ✅ Đã chạy thành công |
| Tạo user trong Supabase Dashboard | ⬜ Bạn chưa làm |
| Chạy migration trên Supabase cloud | ⬜ Chưa xác minh |
| Tắt public signup | ⬜ Bạn chưa làm |
| Deploy Vercel | ⬜ Chưa xác minh |

## 3. Bước 1 — Chạy migration Supabase

Chạy theo đúng thứ tự:

```text
supabase/migrations/202608130001_landing_page_backend.sql
supabase/migrations/202608140001_manual_admin_accounts.sql
```

### Cách đơn giản bằng SQL Editor

1. Mở Supabase Dashboard.
2. Chọn project.
3. Vào SQL Editor.
4. Mở file migration đầu tiên trên máy.
5. Copy toàn bộ SQL, paste vào editor và bấm Run.
6. Mở file migration thứ hai.
7. Copy toàn bộ SQL, paste và bấm Run.

Nếu migration đầu đã chạy trước đó thì chỉ chạy migration thứ hai.

### Kết quả cần kiểm tra

Table Editor:

```text
public.site_content
```

Storage:

```text
site-assets
```

Policy của `site_content`:

```text
Public can read landing page content
Authenticated users can insert landing page content
Authenticated users can update landing page content
Authenticated users can delete landing page content
```

Storage policy cũng phải có các policy bắt đầu bằng `Authenticated users can...`.

## 4. Bước 2 — Tắt public signup

1. Vào Supabase > Authentication.
2. Mở Settings hoặc Providers > Email.
3. Tìm `Allow new users to sign up`.
4. Tắt tùy chọn này.
5. Giữ Email/password provider hoạt động.
6. Save.

Nếu trước đây đã bật Before User Created Hook:

1. Authentication > Hooks.
2. Chọn Before User Created.
3. Disable/Remove hook cũ.

Migration mới đã làm hook cũ không còn chặn domain, nhưng nên tắt để cấu hình gọn.

## 5. Bước 3 — Tạo user trong Supabase

Đây là toàn bộ bước cấp quyền user; không cần chạy SQL riêng sau đó.

1. Vào Authentication > Users.
2. Bấm Add user.
3. Chọn Create new user.
4. Không chọn Send invitation vì không dùng SMTP.
5. Nhập email muốn dùng. Có thể dùng Gmail hoặc email cá nhân.
6. Nhập mật khẩu mạnh.
7. Bật Auto Confirm User/Email Confirmed nếu Dashboard có lựa chọn.
8. Bấm Create user.
9. Kiểm tra user xuất hiện và đã confirmed.

User vừa tạo có thể đăng nhập `/admin` ngay.

Tài liệu Supabase: [Auth users](https://supabase.com/docs/guides/auth/users).

## 6. Bước 4 — Kiểm tra biến môi trường local

File `.env.local` cần có:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_KEY
```

Không cần:

```text
VITE_COMPANY_EMAIL_DOMAIN
VITE_SUPABASE_ALLOW_SIGNUP
```

Sau khi sửa env, restart:

```bash
npm run dev
```

Không commit `.env.local`. File này đã nằm trong `.gitignore`.

## 7. Bước 5 — Test đăng nhập local

1. Mở `http://localhost:5173/admin`.
2. Nhập email user vừa tạo.
3. Nhập password.
4. Bấm Đăng nhập.
5. Content Studio phải mở.
6. Sửa một text và bấm Save.
7. Refresh trang chủ để kiểm tra dữ liệu.
8. Upload một ảnh test.
9. Kiểm tra ảnh trong Storage > `site-assets`.

Không cần cấu hình Redirect URL vì email/password không dùng link chuyển hướng.

## 8. Bước 6 — Commit và push code

Trước khi commit:

```bash
git status
git diff --check
npm run build
```

Sau khi review:

```bash
git add .
git commit -m "use manually created Supabase users for admin login"
git push origin main
```

Repository hiện tại:

```text
https://github.com/2imClay/web-credential
```

Đảm bảo `.env.local` không bị commit.

## 9. Bước 7 — Deploy Vercel

1. Mở [Vercel Dashboard](https://vercel.com/dashboard).
2. Add New > Project.
3. Import repository `2imClay/web-credential`.
4. Framework Preset: Vite.
5. Production Branch: `main`.
6. Root Directory: thư mục chứa `package.json`.
7. Build Command: `npm run build`.
8. Output Directory: `dist`.

Trước khi deploy, thêm Environment Variables:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_KEY
```

Chọn Production rồi Deploy.

Vite đọc env lúc build. Nếu đổi env, phải Redeploy.

## 10. Bước 8 — Test Vercel production

Mở URL `.vercel.app`:

```text
https://YOUR_PROJECT.vercel.app/
https://YOUR_PROJECT.vercel.app/admin
```

Kiểm tra:

- Homepage tải được.
- `/admin` mở trực tiếp không 404.
- Email/password đăng nhập được.
- Save text thành công.
- Upload ảnh thành công.
- Tab incognito đọc được nội dung và ảnh.
- Logout rồi login lại được.

Không cần custom domain. URL `.vercel.app` có HTTPS và dùng production được.

## 11. Khởi tạo nội dung database

Nếu `site_content` đang trống:

1. Login `/admin`.
2. Bấm Restore default content một lần.
3. Xác nhận.

Database sẽ có các key:

```text
site_settings
page_content
milestones
press_articles
recognitions
services
partners
case_studies
team_members
process_steps
```

Sau khi có nội dung thật, không dùng Restore default content nếu chưa backup.

## 12. Thêm hoặc xóa user sau này

### Thêm user

Authentication > Users > Add user > Create new user.

User mới đăng nhập được ngay, không cần SQL cấp quyền.

### Thu hồi quyền

Authentication > Users:

- Ban user để khóa tạm thời, hoặc
- Delete user để xóa hoàn toàn.

### Quên mật khẩu

Vì không có SMTP, không dùng Forgot Password qua email.

Người có quyền Supabase Dashboard quản lý/reset/recreate user trực tiếp. Nếu phải tạo user mới, user mới cũng đăng nhập được ngay.

## 13. Bảo mật cần nhớ

- Bắt buộc tắt public signup.
- Chỉ tạo user thủ công.
- Tất cả Auth user đều có quyền sửa nội dung.
- Dùng password mạnh và không chia sẻ.
- Ban/xóa user ngay khi không còn cần quyền.
- Không đưa service role key vào frontend.
- Không commit `.env.local`.
- Không tắt RLS.
- Bật MFA cho tài khoản quản lý Supabase và Vercel.
- Backup Database và Storage định kỳ.

## 14. Xử lý lỗi

### Email hoặc mật khẩu không đúng

- Kiểm tra user có trong Authentication > Users.
- Kiểm tra user đã confirmed.
- Kiểm tra password.
- Kiểm tra frontend trỏ đúng Supabase project.

### Login được nhưng Save báo RLS

- Migration thứ hai chưa chạy.
- Policy authenticated chưa tồn tại.
- Session đã hết hạn.

### Admin báo chưa cấu hình Supabase

- Thiếu `.env.local` hoặc Vercel env.
- Sai tên biến.
- Chưa restart/redeploy.

### `/admin` bị 404 trên Vercel

Kiểm tra `vercel.json` nằm đúng project root:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## 15. Checklist cuối

### Đã done trong code

- [x] Supabase client.
- [x] Email/password login.
- [x] Admin form email/password.
- [x] RLS migration cho authenticated user.
- [x] Storage migration cho authenticated user.
- [x] `.env.local` local.
- [x] Production build.

### Bạn cần làm trên Supabase

- [ ] Chạy migration đầu.
- [ ] Chạy migration thứ hai.
- [ ] Tắt public signup.
- [ ] Tắt hook cũ nếu có.
- [ ] Tạo user email/password.
- [ ] Confirm user.
- [ ] Test login local.

### Bạn cần làm trên Vercel

- [ ] Push code GitHub.
- [ ] Import project.
- [ ] Thêm hai biến môi trường.
- [ ] Deploy.
- [ ] Test `/admin`.
- [ ] Test Save và Upload.

## 16. Tài liệu chính thức

- [Supabase password Auth](https://supabase.com/docs/guides/auth/passwords)
- [JavaScript signInWithPassword](https://supabase.com/docs/reference/javascript/auth-signinwithpassword)
- [Supabase Auth users](https://supabase.com/docs/guides/auth/users)
- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase migrations](https://supabase.com/docs/guides/deployment/database-migrations)
- [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite)
- [Vercel environment variables](https://vercel.com/docs/environment-variables)
- [Vercel rewrites](https://vercel.com/docs/routing/rewrites)
