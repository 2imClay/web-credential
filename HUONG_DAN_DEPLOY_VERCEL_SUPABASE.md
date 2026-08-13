# Quy trình thiết lập và deploy DGM Credential với Vercel + Supabase

> Tài liệu độc lập dành riêng cho thiết lập backend và deploy production.  
> Cập nhật theo dự án ngày 13/08/2026.

## 1. Mục tiêu sau khi hoàn thành

Sau quy trình này, hệ thống sẽ có:

- Frontend React/Vite chạy trên Vercel.
- PostgreSQL Database chạy trên Supabase.
- Nội dung homepage lưu trong bảng `public.site_content`.
- Hình ảnh do Admin upload lưu trong bucket `site-assets`.
- Admin đăng nhập bằng magic link gửi tới email thật `@digimind.asia`.
- User ngoài domain công ty bị chặn trước khi tạo tài khoản.
- RLS chỉ cho public đọc; user công ty mới được ghi dữ liệu.
- React Router hoạt động khi mở trực tiếp `/admin` hoặc `/case-studies/:slug`.
- Custom domain và HTTPS hoạt động.

Thứ tự thiết lập khuyến nghị:

```text
Chuẩn bị repository
  → Tạo Supabase project
  → Chạy migration
  → Cấu hình Auth Hook + SMTP
  → Tạo Vercel project
  → Khai báo biến môi trường
  → Deploy Vercel lần đầu
  → Cấu hình URL Auth
  → Gắn custom domain
  → Cập nhật URL Auth theo domain
  → Kiểm thử production
```

## A. Cách đọc trạng thái trong tài liệu

| Ký hiệu | Ý nghĩa |
|---|---|
| ✅ **ĐÃ DONE** | Mình đã thực hiện và kiểm tra được trong mã nguồn/local |
| 🟨 **ĐÃ CHUẨN BỊ** | File/code đã có, nhưng chưa áp dụng lên dịch vụ cloud |
| ⬜ **CHƯA DONE** | Chưa thực hiện |
| 👤 **BẠN CẦN LÀM/CUNG CẤP** | Cần tài khoản, quyền truy cập hoặc quyết định của bạn |
| 🔎 **CHƯA XÁC MINH** | Có thể đã tồn tại trên cloud nhưng local không có dữ liệu để xác nhận |

“Đã done” trong file này chỉ dùng khi có bằng chứng từ mã nguồn, filesystem hoặc lệnh kiểm tra. Việc một file cấu hình đã tồn tại không có nghĩa dịch vụ Supabase/Vercel bên ngoài đã được cấu hình.

## B. Trạng thái thực tế hiện tại

Được kiểm tra trực tiếp trong workspace ngày 13/08/2026:

| Hạng mục | Trạng thái | Ghi chú |
|---|---|---|
| React/Vite website | ✅ **ĐÃ DONE** | Source hiện có đầy đủ các section và Admin |
| Production build | ✅ **ĐÃ DONE** | `npm run build` đã chạy thành công |
| Supabase JS SDK | ✅ **ĐÃ DONE** | Đã cài `@supabase/supabase-js@2.112.3` |
| Supabase browser client | ✅ **ĐÃ DONE** | Đã có `src/lib/supabase.js` |
| Magic-link Auth frontend | ✅ **ĐÃ DONE** | Đã có `src/services/authService.js` |
| Giới hạn email `@digimind.asia` phía client | ✅ **ĐÃ DONE** | Đã kiểm tra trong Auth service |
| Database/Storage repository | ✅ **ĐÃ DONE** | Đã thay localStorage bằng Supabase repository |
| Upload ảnh WebP | ✅ **ĐÃ DONE** | Logic resize/upload đã có trong Admin |
| Realtime frontend subscription | ✅ **ĐÃ DONE** | Repository đã subscribe `site_content` |
| Migration SQL | ✅ **ĐÃ DONE TRONG CODE** | File migration đã tồn tại |
| RLS/Storage policy/Auth Hook SQL | ✅ **ĐÃ DONE TRONG CODE** | Đã viết trong migration |
| Domain trong SQL | ✅ **ĐÃ DONE TRONG CODE** | Đang là `@digimind.asia` |
| `.env.example` | ✅ **ĐÃ DONE** | Đã có đủ bốn biến cần thiết |
| `.env.local` thật | ⬜ **CHƯA DONE** | Chưa có URL/key Supabase thật |
| Supabase CLI dependency | ⬜ **CHƯA DONE** | Package `supabase` chưa được cài |
| `supabase/config.toml` | ⬜ **CHƯA DONE** | Local Supabase chưa init |
| Link local với Supabase cloud | ⬜ **CHƯA DONE** | Chưa có Project Ref/credentials |
| Supabase cloud project | 🔎 **CHƯA XÁC MINH** | Chưa được cung cấp thông tin project |
| Chạy migration trên cloud | ⬜ **CHƯA DONE** | Migration mới chỉ nằm trong source |
| Bật Before User Created Hook trên Dashboard | ⬜ **CHƯA DONE** | Bước Dashboard thủ công |
| Custom SMTP | ⬜ **CHƯA DONE** | Cần SMTP account/credentials |
| Supabase Auth Redirect URLs | ⬜ **CHƯA DONE** | Chưa có URL production |
| Git repository remote | ✅ **ĐÃ DONE** | `origin = https://github.com/2imClay/web-credential.git` |
| Git production branch | ✅ **ĐÃ DONE** | Đang ở `main` |
| Commit Supabase + tài liệu mới | ⬜ **CHƯA DONE** | Workspace đang có thay đổi chưa commit |
| Push thay đổi mới lên GitHub | ⬜ **CHƯA DONE** | `main` local chưa chứa commit mới |
| `vercel.json` SPA rewrite | ✅ **ĐÃ DONE TRONG CODE** | File đã tồn tại |
| Link local với Vercel project | ⬜ **CHƯA DONE** | Chưa có `.vercel/project.json` |
| Vercel cloud project | 🔎 **CHƯA XÁC MINH** | Không thể xác minh từ local |
| Vercel environment variables | ⬜ **CHƯA DONE/CHƯA XÁC MINH** | Chưa có project/key để kiểm tra |
| Vercel production deployment | ⬜ **CHƯA DONE/CHƯA XÁC MINH** | Chưa có deployment URL |
| Custom domain | ⬜ **CHƯA DONE** | Chưa có domain production được chọn |
| Kiểm thử end-to-end production | ⬜ **CHƯA DONE** | Phải hoàn tất cloud setup trước |

## C. Những thông tin cần có để hoàn thành phần còn lại

| Thông tin/quyền | Dùng cho bước | Có thể chia sẻ hay không |
|---|---|---|
| Supabase Project URL | `.env.local` và Vercel env | Có thể chia sẻ; đây là URL public |
| Supabase Publishable Key | `.env.local` và Vercel env | Có thể chia sẻ; không phải secret nếu RLS đúng |
| Supabase Project Ref | `supabase link` | Có thể chia sẻ |
| Supabase database password | `db push` | Không gửi trong chat; tự nhập khi CLI hỏi |
| Quyền Supabase Dashboard | Hook, SMTP, Redirect URLs | Người có quyền project thực hiện |
| SMTP credentials | Gửi magic link production | Không gửi trong chat; nhập trực tiếp Dashboard |
| Vercel team/project | Deploy | Cần quyền import repository |
| Production domain | Site URL và Redirect URL | Cần chốt domain, ví dụ `credential.digimind.asia` |
| Chế độ signup | Auth | Chọn mọi email công ty hoặc invite-only |

## D. Quy trình thực hiện tuần tự từ trạng thái hiện tại

Đây là checklist thao tác theo đúng thứ tự. Không bỏ qua bước xác minh cuối mỗi chặng.

### Bước 1 — Review và commit source hiện tại

> Trạng thái: ⬜ **CHƯA DONE**  
> Người thực hiện: người quản lý repository hoặc developer.

1. Mở terminal tại thư mục `dgm-credential-react`.
2. Xem toàn bộ file đang thay đổi:

```bash
git status
git diff --check
```

3. Review những file chính:

```text
.env.example
package.json
package-lock.json
src/lib/supabase.js
src/services/authService.js
src/services/contentRepository.js
src/hooks/useContent.js
src/pages/AdminPage.jsx
supabase/migrations/202608130001_landing_page_backend.sql
HUONG_DAN_DU_AN.md
HUONG_DAN_DEPLOY_VERCEL_SUPABASE.md
```

4. Xác nhận `.env.local` không xuất hiện trong `git status`.
5. Stage các file đã review.
6. Commit:

```bash
git add .
git commit -m "integrate Supabase backend and deployment guide"
```

7. Xác minh:

```bash
git status
git log -1 --oneline
```

Kết quả đúng: working tree sạch và commit mới xuất hiện.

### Bước 2 — Push source lên GitHub

> Trạng thái: ⬜ **CHƯA DONE**  
> Phần đã done: ✅ remote `origin` và branch `main` đã có.

1. Kiểm tra remote:

```bash
git remote -v
```

2. Push:

```bash
git push origin main
```

3. Mở repository:

```text
https://github.com/2imClay/web-credential
```

4. Kiểm tra commit mới và file migration đã xuất hiện trên GitHub.

Kết quả đúng: GitHub `main` hiển thị commit Supabase mới nhất.

### Bước 3 — Tạo Supabase production project

> Trạng thái: ⬜ **CHƯA DONE/CHƯA XÁC MINH**  
> Người thực hiện: 👤 người có quyền Supabase organization.

1. Vào Supabase Dashboard.
2. New project.
3. Đặt tên `dgm-credential-production`.
4. Chọn region gần Việt Nam.
5. Tạo database password mạnh.
6. Lưu password vào password manager.
7. Chờ project ở trạng thái Healthy/Active.
8. Ghi lại Project Ref, Project URL và Publishable Key.

Không dùng service role key cho frontend.

Kết quả đúng: Dashboard mở được Table Editor, SQL Editor, Authentication và Storage.

### Bước 4 — Cài và init Supabase CLI

> Trạng thái: ⬜ **CHƯA DONE**  
> Phần đã done: ✅ thư mục migration đã có.

1. Kiểm tra Node:

```bash
node -v
```

Yêu cầu Node.js 20 trở lên.

2. Cài CLI theo project:

```bash
npm install supabase --save-dev
```

3. Xác minh:

```bash
npx supabase --version
```

4. Tạo config:

```bash
npx supabase init
```

5. Kiểm tra file:

```text
supabase/config.toml
```

6. Commit `package.json`, `package-lock.json` và `supabase/config.toml` sau khi review.

Kết quả đúng: `npx supabase --version` trả version và `config.toml` tồn tại.

### Bước 5 — Link và push migration lên Supabase

> Trạng thái: 🟨 SQL **ĐÃ CHUẨN BỊ**, cloud ⬜ **CHƯA DONE**.

1. Login:

```bash
npx supabase login
```

2. Link project:

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
```

3. Nhập database password khi CLI yêu cầu.
4. Dry run:

```bash
npx supabase db push --dry-run
```

5. Đọc kỹ migration sắp chạy.
6. Push thật:

```bash
npx supabase db push
```

7. Mở Table Editor và Storage để xác minh.

Kết quả đúng:

- Có bảng `public.site_content`.
- RLS bật.
- Có bucket `site-assets`.
- Có Auth function `hook_restrict_digimind_signup`.
- `site_content` nằm trong Realtime publication.

### Bước 6 — Bật Before User Created Hook

> Trạng thái: ⬜ **CHƯA DONE**  
> Lưu ý: migration chỉ tạo function; không tự bật hook trong Dashboard.

1. Supabase > Authentication > Hooks.
2. Before User Created.
3. Chọn Postgres function.
4. Chọn `public.hook_restrict_digimind_signup`.
5. Enable.
6. Save.
7. Thử email ngoài `@digimind.asia` sau khi SMTP/Auth sẵn sàng.

Kết quả đúng: signup email ngoài công ty trả 403 và không tạo user.

### Bước 7 — Cấu hình custom SMTP

> Trạng thái: ⬜ **CHƯA DONE**  
> Người thực hiện: 👤 người giữ SMTP credentials.

1. Chọn SMTP provider.
2. Tạo sender, ví dụ `no-reply@auth.digimind.asia`.
3. Cấu hình SPF/DKIM/DMARC.
4. Supabase > Authentication > Emails > SMTP Settings.
5. Enable custom SMTP.
6. Nhập host, port, username, password, sender.
7. Save.
8. Gửi test email tới một địa chỉ công ty thật.

Không commit hoặc gửi SMTP password vào chat.

Kết quả đúng: email vào inbox và không bị Supabase báo `Email address not authorized`.

### Bước 8 — Tạo `.env.local` và test local

> Trạng thái: ⬜ **CHƯA DONE**  
> Phần đã done: ✅ `.env.example` đã sẵn sàng.

1. Tạo `.env.local`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_KEY
VITE_COMPANY_EMAIL_DOMAIN=digimind.asia
VITE_SUPABASE_ALLOW_SIGNUP=true
```

2. Supabase > Authentication > URL Configuration.
3. Thêm:

```text
http://localhost:5173/admin
```

4. Restart dev server:

```bash
npm run dev
```

5. Mở `http://localhost:5173/admin`.
6. Nhập email công ty.
7. Mở magic link.
8. Sửa một text và Save.
9. Upload một ảnh test.
10. Mở Table Editor và Storage xác minh.

Kết quả đúng: text lưu vào `site_content`, ảnh lưu vào `site-assets` và refresh homepage vẫn còn dữ liệu.

### Bước 9 — Tạo/import Vercel project

> Trạng thái: 🔎 **CHƯA XÁC MINH**  
> Phần đã done: ✅ Git remote và `vercel.json` đã có.

1. Vào Vercel Dashboard.
2. Add New > Project.
3. Import `2imClay/web-credential`.
4. Chọn Vercel team đúng.
5. Production Branch: `main`.
6. Framework: Vite.
7. Root Directory: thư mục chứa `package.json`.
8. Build Command: `npm run build`.
9. Output Directory: `dist`.

Chưa bấm production deploy trước khi thêm environment variables ở bước tiếp theo, hoặc phải Redeploy sau đó.

### Bước 10 — Thêm Vercel environment variables

> Trạng thái: ⬜ **CHƯA DONE/CHƯA XÁC MINH**.

Vercel Project > Settings > Environment Variables, thêm:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_COMPANY_EMAIL_DOMAIN
VITE_SUPABASE_ALLOW_SIGNUP
```

Giá trị Production:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_KEY
VITE_COMPANY_EMAIL_DOMAIN=digimind.asia
VITE_SUPABASE_ALLOW_SIGNUP=true
```

Chọn Production. Chỉ chọn Preview nếu đã quyết định Preview dùng chung hay dùng Supabase staging.

Kết quả đúng: bốn biến xuất hiện trong Environment Variables, không có service role key.

### Bước 11 — Deploy Vercel production lần đầu

> Trạng thái: ⬜ **CHƯA DONE/CHƯA XÁC MINH**.

1. Bấm Deploy/Redeploy.
2. Mở Build Logs.
3. Chờ trạng thái Ready.
4. Ghi lại URL dạng:

```text
https://YOUR_PROJECT.vercel.app
```

5. Mở `/`, `/admin` và một `/case-studies/:slug`.

Kết quả đúng: cả route con mở trực tiếp không 404 và Admin không báo thiếu cấu hình Supabase.

### Bước 12 — Cấu hình Auth URL cho Vercel

> Trạng thái: ⬜ **CHƯA DONE**.

Supabase > Authentication > URL Configuration:

```text
Site URL:
https://YOUR_PROJECT.vercel.app

Redirect URL:
https://YOUR_PROJECT.vercel.app/admin
```

Gửi magic link mới từ domain Vercel và kiểm tra link quay về đúng `/admin`.

### Bước 13 — Gắn custom domain

> Trạng thái: ⬜ **CHƯA DONE**  
> Cần chốt domain production.

1. Vercel Project > Settings > Domains.
2. Add Domain.
3. Ví dụ `credential.digimind.asia`.
4. Thêm DNS record đúng theo Vercel Dashboard.
5. Chờ Verified và SSL hợp lệ.
6. Mở domain bằng HTTPS.

Không copy cứng DNS record từ tài liệu; dùng record Vercel hiển thị cho project thật.

### Bước 14 — Chuyển Supabase Auth sang custom domain

> Trạng thái: ⬜ **CHƯA DONE**.

Sau khi domain Vercel hoạt động, sửa Supabase URL Configuration:

```text
Site URL:
https://credential.digimind.asia

Redirect URLs:
http://localhost:5173/admin
https://YOUR_PROJECT.vercel.app/admin
https://credential.digimind.asia/admin
```

Gửi một magic link mới từ custom domain để test.

### Bước 15 — Seed nội dung và kiểm thử production

> Trạng thái: ⬜ **CHƯA DONE**.

1. Vào `https://YOUR_DOMAIN/admin`.
2. Login email công ty.
3. Nếu database trống, bấm Restore default content một lần.
4. Kiểm tra đủ 10 row trong `site_content`.
5. Sửa một nội dung thật.
6. Upload một ảnh thật.
7. Mở tab incognito kiểm tra public.
8. Test email ngoài domain.
9. Test logout/login lại.
10. Hoàn thành checklist mục 22 và 30.

Kết quả đúng: Auth, Database, Storage, Realtime, routes và custom domain đều hoạt động end-to-end.

## 2. Các tài khoản và thông tin cần chuẩn bị

### Tài khoản

- GitHub, GitLab, Bitbucket hoặc Azure DevOps chứa repository.
- Vercel account/team có quyền import repository.
- Supabase account/organization có quyền tạo project.
- Quyền quản lý DNS nếu dùng custom domain.
- Tài khoản SMTP hoặc dịch vụ transactional email.

### Thông tin cần lưu an toàn

- Supabase database password.
- SMTP username/password.
- Supabase Project URL.
- Supabase Publishable Key.
- Project Reference ID.

Database password và SMTP password phải lưu trong password manager, không ghi vào repository hoặc file hướng dẫn nội bộ được public.

## 3. Kiểm tra dự án trước khi deploy

Tại thư mục `dgm-credential-react`:

```bash
npm install
npm run build
```

Build đúng khi kết thúc với thông báo tương tự:

```text
✓ built in ...
```

Warning chunk lớn hơn 500 kB hiện không làm build thất bại.

Kiểm tra Git:

```bash
git status
git diff --check
```

Đảm bảo các file sau tồn tại:

```text
.env.example
package.json
vite.config.js
vercel.json
src/lib/supabase.js
src/services/authService.js
src/services/contentRepository.js
supabase/migrations/202608130001_landing_page_backend.sql
```

Kiểm tra `.gitignore` có:

```gitignore
.env
.env.local
```

Không commit file `.env.local`.

## 4. Tạo Supabase project

1. Mở [Supabase Dashboard](https://supabase.com/dashboard).
2. Chọn organization phù hợp.
3. Chọn New project.
4. Nhập tên project, ví dụ `dgm-credential-production`.
5. Tạo database password mạnh.
6. Chọn region gần nhóm người dùng chính.
7. Chọn plan phù hợp.
8. Chờ project hoàn tất provisioning.

### Chọn region

Nên chọn region gần Việt Nam/Đông Nam Á nếu khả dụng để giảm độ trễ. Không thể đổi region trực tiếp sau khi project đã tạo; thường phải tạo project mới và migrate dữ liệu.

### Lấy Project Reference ID

Project Ref nằm trong URL Dashboard hoặc Project Settings. Ví dụ:

```text
https://supabase.com/dashboard/project/abcdefghijklmnop
                                       └── Project Ref
```

## 5. Chạy migration Supabase — cách khuyến nghị bằng CLI

Luồng CLI giúp Supabase lưu lịch sử migration, phù hợp khi dự án tiếp tục phát triển.

### 5.1 Cài Supabase CLI theo project

Supabase CLI chạy qua npm yêu cầu Node.js 20 trở lên.

```bash
npm install supabase --save-dev
npx supabase --help
```

Nên commit version CLI trong `package.json` và `package-lock.json` để cả team dùng cùng version.

Tài liệu chính thức: [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started).

### 5.2 Khởi tạo config nếu chưa có

Nếu chưa có `supabase/config.toml`:

```bash
npx supabase init
```

Project hiện đã có thư mục `supabase/migrations`; lệnh init bổ sung cấu hình local cần thiết.

### 5.3 Đăng nhập CLI

```bash
npx supabase login
```

Trình duyệt sẽ mở để xác thực, hoặc CLI yêu cầu access token.

### 5.4 Link local project với cloud project

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
```

CLI có thể yêu cầu database password.

### 5.5 Kiểm tra migration trước khi chạy

```bash
npx supabase db push --dry-run
```

Đọc danh sách migration sắp chạy. Migration đầu tiên của dự án là:

```text
202608130001_landing_page_backend.sql
```

### 5.6 Đẩy migration lên production

```bash
npx supabase db push
```

Sau khi thành công, Supabase ghi version vào bảng lịch sử migration. Những lần `db push` tiếp theo sẽ bỏ qua migration đã chạy.

Tài liệu chính thức: [Supabase Database Migrations](https://supabase.com/docs/guides/deployment/database-migrations).

## 6. Chạy migration — phương án nhanh bằng SQL Editor

Chỉ dùng khi chưa thiết lập CLI và cần dựng project lần đầu thật nhanh.

1. Mở Supabase Dashboard > SQL Editor.
2. Mở local file:

```text
supabase/migrations/202608130001_landing_page_backend.sql
```

3. Copy toàn bộ nội dung.
4. Paste vào SQL Editor.
5. Bấm Run.

Lưu ý quan trọng:

- SQL Editor không tự ghi file vào lịch sử migration của CLI.
- Nếu sau đó chuyển sang `supabase db push`, lịch sử local và remote có thể lệch.
- Không nên vừa thay schema trực tiếp trên Dashboard vừa dùng migration CLI trong quá trình phát triển lâu dài.
- Với team, thống nhất một người hoặc một CI job chạy migration production.

## 7. Xác minh migration

### Database

Vào Table Editor và kiểm tra bảng:

```text
public.site_content
```

Các cột:

| Cột | Kiểu |
|---|---|
| `key` | text |
| `value` | jsonb |
| `updated_at` | timestamptz |
| `updated_by` | uuid |

### Storage

Vào Storage và kiểm tra bucket:

```text
site-assets
```

Thuộc tính chính:

- Public bucket.
- File tối đa 8 MB.
- Cho phép JPEG, PNG, WebP, GIF và SVG.

### RLS

Kiểm tra RLS đã bật cho `site_content` và có các policy:

- Public can read landing page content.
- Company users can insert landing page content.
- Company users can update landing page content.
- Company users can delete landing page content.

Storage cũng phải có policy đọc public và ghi cho company user.

### Realtime

Migration thêm bảng `site_content` vào publication `supabase_realtime`.

Có thể kiểm tra bằng SQL:

```sql
select schemaname, tablename
from pg_publication_tables
where pubname = 'supabase_realtime'
  and schemaname = 'public'
  and tablename = 'site_content';
```

Kết quả cần có một row.

## 8. Cấu hình Supabase Auth

### 8.1 Bật Email provider

Vào Authentication > Providers > Email:

- Bật Email provider.
- Giữ email verification phù hợp với passwordless flow.
- Không cần tạo mật khẩu giả.

Frontend dùng:

```js
supabase.auth.signInWithOtp({
  email,
  options: {
    emailRedirectTo: `${window.location.origin}/admin`,
    shouldCreateUser: true
  }
})
```

Supabase gửi magic link tới hộp thư thật. User được xác thực sau khi mở link.

### 8.2 Bật Before User Created Hook

Migration tạo function:

```text
public.hook_restrict_digimind_signup
```

Để bật:

1. Vào Authentication > Hooks.
2. Chọn Before User Created.
3. Chọn Postgres function.
4. Chọn `public.hook_restrict_digimind_signup`.
5. Enable và Save.

Hook trả HTTP 403 nếu email không khớp:

```text
^[^@[:space:]]+@digimind[.]asia$
```

Nếu không bật hook:

- Giao diện vẫn chặn email ngoài domain.
- RLS vẫn không cho email ngoài domain ghi dữ liệu.
- Nhưng người gọi Auth API trực tiếp vẫn có thể tạo một user không có quyền.

Tài liệu chính thức: [Before User Created Hook](https://supabase.com/docs/guides/auth/auth-hooks/before-user-created-hook).

## 9. Cấu hình SMTP để gửi email thật

SMTP mặc định của Supabase chỉ phù hợp thử nghiệm. Theo tài liệu Supabase, dịch vụ mặc định có giới hạn thấp và có thể chỉ gửi tới các địa chỉ thuộc team của Supabase project.

Production cần custom SMTP.

### 9.1 Thông tin cần có

- SMTP host.
- SMTP port.
- SMTP username.
- SMTP password.
- Sender email.
- Sender name.

Ví dụ sender:

```text
DGM Content Studio <no-reply@auth.digimind.asia>
```

Có thể dùng SMTP nội bộ hoặc nhà cung cấp như Resend, AWS SES, Postmark, SendGrid, Brevo.

### 9.2 Cấu hình trong Supabase

1. Vào Authentication > Emails > SMTP Settings.
2. Enable custom SMTP.
3. Nhập host, port, username, password.
4. Nhập sender email/name.
5. Save.
6. Test bằng email `@digimind.asia` thật.

### 9.3 DNS email

Thiết lập theo hướng dẫn nhà cung cấp:

- SPF.
- DKIM.
- DMARC.

Nên tách subdomain auth, ví dụ `auth.digimind.asia`, khỏi domain gửi marketing để tránh ảnh hưởng reputation lẫn nhau.

Tài liệu chính thức: [Supabase Custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp).

## 10. Cấu hình email template

Vào Authentication > Email Templates.

Với magic link, template phải giữ link xác thực Supabase. Không thay link bằng URL viết tay làm mất token.

Có thể tùy chỉnh:

- Logo DGM.
- Màu thương hiệu.
- Tiêu đề email.
- Nội dung tiếng Việt/Anh.
- Thời hạn và cảnh báo không chia sẻ link.

Nên test template ở nhiều email client trước production.

## 11. Lấy Supabase Project URL và key

Vào Project Settings > API.

Cần lấy:

```text
Project URL
Publishable key
```

Publishable key mới thường có dạng:

```text
sb_publishable_...
```

Không đưa các giá trị sau vào frontend hoặc Vercel biến `VITE_*`:

- `service_role` key.
- Secret key.
- Database password.
- SMTP password.

Publishable key được phép ở browser vì Database và Storage được bảo vệ bằng RLS.

## 12. Kiểm tra local với Supabase cloud

Tạo `.env.local` từ `.env.example`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_KEY
VITE_COMPANY_EMAIL_DOMAIN=digimind.asia
VITE_SUPABASE_ALLOW_SIGNUP=true
```

Đặt `VITE_SUPABASE_ALLOW_SIGNUP=true` nếu mọi nhân sự có email công ty đều được phép tạo user thật ở lần đăng nhập đầu. Đặt thành `false` nếu chỉ những user đã được mời/tạo sẵn trong Supabase Auth mới được nhận link đăng nhập.

Chạy lại dev server:

```bash
npm run dev
```

Vào:

```text
http://localhost:5173/admin
```

Trước khi test magic link, cần thêm local redirect URL trong Supabase. Xem mục 17.

## 13. Chuẩn bị repository cho Vercel

Vercel deploy thuận tiện nhất qua Git.

### 13.1 Push source lên Git provider

Nếu repository chưa có remote:

```bash
git remote -v
git status
git add .
git commit -m "configure Supabase backend and deployment"
git push origin main
```

Không chạy `git add .` nếu chưa kiểm tra `.env.local` đã được ignore.

### 13.2 File SPA rewrite

Project đã có `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Rewrite này giúp Vercel trả `index.html` khi người dùng mở trực tiếp:

- `/admin`
- `/case-studies/skoda-performance-branding`

Nếu thiếu rewrite, refresh route con có thể trả 404.

Tài liệu chính thức: [Vercel Rewrites](https://vercel.com/docs/routing/rewrites).

## 14. Tạo Vercel project từ Git

1. Mở [Vercel Dashboard](https://vercel.com/dashboard).
2. Chọn Add New > Project.
3. Kết nối Git provider nếu chưa kết nối.
4. Import repository của dự án.
5. Chọn đúng Vercel team.
6. Kiểm tra Production Branch, thường là `main`.

### Build Settings

Vercel thường tự nhận Vite. Nếu cần nhập thủ công:

| Cấu hình | Giá trị |
|---|---|
| Framework Preset | Vite |
| Root Directory | Thư mục chứa `package.json` |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Trong repository hiện tại, app root chính là thư mục `dgm-credential-react`.

Tài liệu chính thức: [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite).

## 15. Thêm biến môi trường trên Vercel

Vào Project > Settings > Environment Variables.

Thêm bốn biến:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_KEY
VITE_COMPANY_EMAIL_DOMAIN=digimind.asia
VITE_SUPABASE_ALLOW_SIGNUP=true
```

### Chọn environment

| Environment | Khuyến nghị |
|---|---|
| Production | Bắt buộc |
| Preview | Chỉ bật khi đã quyết định Preview dùng Supabase nào |
| Development | Không bắt buộc nếu dùng `.env.local` |

Vite đọc các biến này tại build time. Sau khi thêm hoặc sửa biến, phải Redeploy; deployment cũ không tự nhận giá trị mới.

Tài liệu chính thức: [Vercel Environment Variables](https://vercel.com/docs/environment-variables).

## 16. Preview và Production

Vercel có ba môi trường mặc định:

- Development: local.
- Preview: branch/PR không phải production branch.
- Production: branch production, thường là `main`.

### Phương án tốt nhất

Dùng hai Supabase project:

```text
dgm-credential-staging     ← Vercel Preview
dgm-credential-production  ← Vercel Production
```

Lợi ích:

- Test Admin không sửa dữ liệu thật.
- Test migration trước production.
- Preview có user và Storage độc lập.
- Có thể xóa/reset dữ liệu staging an toàn.

### Phương án tiết kiệm

Preview và Production dùng chung Supabase project.

Rủi ro:

- Admin trên preview sửa trực tiếp dữ liệu production.
- Ảnh test nằm chung bucket thật.
- Code preview có thể không tương thích schema production.

Nếu dùng chung, hạn chế đăng nhập Admin trên Preview và chỉ test giao diện public.

Tài liệu chính thức: [Vercel Environments](https://vercel.com/docs/deployments/environments).

## 17. Cấu hình Supabase Redirect URLs

Frontend gửi:

```js
emailRedirectTo: `${window.location.origin}/admin`
```

Do đó origin nào gửi magic link thì origin đó phải được Supabase cho phép.

Vào Supabase > Authentication > URL Configuration.

### Site URL production

Trước khi có custom domain:

```text
https://YOUR_PROJECT.vercel.app
```

Sau khi có custom domain:

```text
https://credential.digimind.asia
```

### Redirect URLs bắt buộc

```text
http://localhost:5173/admin
https://YOUR_PROJECT.vercel.app/admin
https://credential.digimind.asia/admin
```

### Preview URLs

Nếu cần đăng nhập trên Vercel Preview, thêm wildcard theo team/account slug:

```text
https://*-YOUR_TEAM_SLUG.vercel.app/**
```

Supabase khuyến nghị production dùng URL chính xác. Wildcard chỉ nên dùng cho Preview.

Không dùng wildcard quá rộng kiểu `https://**`.

Tài liệu chính thức: [Supabase Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls).

## 18. Deploy Vercel lần đầu

Sau khi import repo và thêm biến môi trường:

1. Chọn Deploy hoặc Redeploy.
2. Theo dõi Build Logs.
3. Chờ trạng thái Ready.
4. Mở URL `.vercel.app`.

Kiểm tra:

```text
/
/admin
/case-studies/<mot-slug-co-that>
```

Nếu trang chủ chạy nhưng Admin báo chưa cấu hình Supabase, kiểm tra biến môi trường và Redeploy.

### Deploy tự động qua Git

- Push branch thường → Preview deployment.
- Merge/push production branch → Production deployment.

Tài liệu chính thức: [Vercel Git Deployments](https://vercel.com/docs/git).

## 19. Deploy bằng Vercel CLI — tùy chọn

Có thể dùng Dashboard/Git mà không cần CLI. Nếu muốn CLI:

```bash
npm install --global vercel
vercel login
vercel link
```

Kéo biến Development về local:

```bash
vercel env pull .env.local
```

Deploy Preview:

```bash
vercel deploy
```

Deploy Production:

```bash
vercel deploy --prod
```

Tài liệu chính thức: [Deploy from Vercel CLI](https://vercel.com/docs/projects/deploy-from-cli).

## 20. Gắn custom domain

Ví dụ domain:

```text
credential.digimind.asia
```

### Trên Vercel Dashboard

1. Mở project.
2. Vào Settings > Domains.
3. Chọn Add Domain.
4. Nhập domain.
5. Làm theo DNS record Vercel hiển thị.

Thông thường:

- Apex domain dùng A record.
- Subdomain dùng CNAME.
- Nếu domain thuộc Vercel team khác, có thể cần TXT verification.

Không copy cứng DNS record từ tài liệu này; dùng giá trị Vercel Dashboard hiển thị tại thời điểm cấu hình.

Sau khi DNS hợp lệ, Vercel tự cấp SSL certificate.

### Sau khi domain hoạt động

Quay lại Supabase Auth URL Configuration:

```text
Site URL = https://credential.digimind.asia
Redirect URL = https://credential.digimind.asia/admin
```

Giữ URL `.vercel.app/admin` trong allowlist nếu vẫn cần dùng.

Tài liệu chính thức: [Vercel Custom Domains](https://vercel.com/docs/domains/working-with-domains/add-a-domain).

## 21. Khởi tạo nội dung production

Bảng `site_content` ban đầu có thể trống. Frontend lúc đó hiển thị fallback từ `src/data/siteData.js`.

Để ghi default content lên Supabase:

1. Vào domain production `/admin`.
2. Đăng nhập bằng email công ty.
3. Bấm Restore default content.
4. Xác nhận.
5. Kiểm tra Table Editor có các row.

Các key mong đợi:

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

Cảnh báo: sau khi website đã có nội dung thật, Restore default content sẽ ghi đè các row bằng dữ liệu trong source. Hãy backup trước khi dùng.

## 22. Checklist kiểm thử production

### Public website

- [ ] Trang `/` tải không lỗi.
- [ ] Header navigation scroll đúng section.
- [ ] Hero background hiển thị.
- [ ] About/Press popup hoạt động.
- [ ] Timeline highlight theo scroll.
- [ ] Recognition desktop/mobile hoạt động.
- [ ] Services hiển thị đủ item.
- [ ] Case filter và kéo ngang hoạt động.
- [ ] Case detail mở trực tiếp không 404.
- [ ] Team và Partner animation hoạt động.
- [ ] Footer email/social đúng.
- [ ] Mobile không tràn ngang.

### Auth

- [ ] Email `@digimind.asia` nhận magic link.
- [ ] Magic link quay về đúng domain `/admin`.
- [ ] Refresh `/admin` vẫn giữ session.
- [ ] Logout xóa session.
- [ ] Email ngoài domain bị từ chối.
- [ ] Auth Hook đã enable.

### Database và Storage

- [ ] Admin sửa text và Save thành công.
- [ ] Refresh public thấy dữ liệu mới.
- [ ] Upload ảnh thành công.
- [ ] Ảnh mở được ở tab ẩn danh.
- [ ] User anon không thể insert/update bằng API.
- [ ] Realtime cập nhật tab public đang mở.

### Vercel

- [ ] Build logs không có error.
- [ ] Environment variables tồn tại ở Production.
- [ ] `vercel.json` rewrite hoạt động.
- [ ] Custom domain Verified.
- [ ] HTTPS hợp lệ.

## 23. Kiểm thử RLS cơ bản

### Public SELECT

Mở website ở incognito. Nội dung phải tải được.

### Anonymous WRITE

Không nên thử bằng service role. Có thể dùng publishable key trong một REST client không có Authorization user token; insert/update phải bị từ chối bởi RLS.

### Company user WRITE

Đăng nhập Admin bằng `@digimind.asia`, chỉnh một field và Save. Request phải thành công.

### Non-company signup

Gửi request signup/OTP bằng email ngoài domain. Khi Auth Hook bật, Supabase phải trả lỗi 403 và không tạo user.

Không tắt RLS để xử lý lỗi. Hãy sửa policy hoặc JWT/domain configuration.

## 24. Quy trình release các lần sau

### Chỉ thay frontend

```text
Tạo branch
  → Sửa code
  → npm run build
  → Push branch
  → Kiểm tra Vercel Preview
  → Merge main
  → Kiểm tra Production
```

### Có thay database schema/policy

```text
Backup production
  → Tạo migration mới
  → Test migration ở staging
  → Đảm bảo migration backward-compatible
  → npx supabase db push --dry-run
  → Push migration production
  → Deploy frontend production
  → Smoke test
```

Nguyên tắc:

- Ưu tiên migration additive trước: thêm table/column/key/policy mới.
- Không xóa field mà frontend production cũ vẫn cần.
- Chỉ cleanup ở release sau khi code mới đã ổn định.
- Một người hoặc một CI job chạy `db push` tại một thời điểm.
- Không sửa migration cũ đã chạy; tạo migration mới.

## 25. Backup trước release

### Database

Kiểm tra backup trong Supabase Dashboard. Plan trả phí có thêm lựa chọn phục hồi chi tiết hơn.

Có thể export `site_content` từ Table Editor hoặc query:

```sql
select key, value, updated_at
from public.site_content
order by key;
```

### Storage

Database backup không đồng nghĩa backup object trong Storage. URL nằm trong database nhưng file ảnh nằm riêng trong bucket.

Trước migration lớn:

- Export nội dung bảng.
- Backup bucket `site-assets` nếu ảnh không có bản gốc nơi khác.
- Ghi lại version deployment Vercel đang chạy.

Tài liệu Supabase lưu ý database backups không bao gồm Storage objects: [Supabase Database Overview](https://supabase.com/docs/guides/database/overview).

## 26. Rollback

### Rollback frontend Vercel

1. Vào Vercel > Deployments.
2. Chọn deployment production trước đó đã hoạt động.
3. Promote/Rollback deployment đó về Production.
4. Kiểm tra domain.

Vercel rollback frontend không rollback Supabase Database.

### Rollback database

Không dùng `git revert` với migration đã chạy và kỳ vọng database tự quay lại.

Cần một trong các phương án:

- Tạo migration mới đảo thay đổi an toàn.
- Restore database backup.
- Dùng Point-in-Time Recovery nếu plan hỗ trợ.

Nếu frontend cũ không tương thích schema mới, ưu tiên migration backward-compatible để có thể rollback Vercel mà không làm site hỏng.

## 27. Xử lý lỗi thường gặp

### Vercel build báo thiếu module

Chạy local từ đúng thư mục project:

```bash
npm ci
npm run build
```

`npm ci` cài lại dependency đúng theo `package-lock.json`. Commit lockfile và Redeploy không dùng cache nếu cần.

### Admin báo “Chưa có cấu hình Supabase”

- Biến Vercel chưa được thêm.
- Biến thêm sai environment.
- Sai chính tả `VITE_`.
- Chưa Redeploy sau khi đổi biến.

### Magic link quay về localhost

- Supabase Site URL vẫn là localhost.
- Email template/link cũ.
- `Redirect URLs` chưa có production domain.

### Magic link báo redirect URL not allowed

Thêm chính xác:

```text
https://YOUR_DOMAIN/admin
```

Vào Authentication > URL Configuration rồi gửi một link mới.

### Email address not authorized

Thường do đang dùng SMTP mặc định Supabase và email không thuộc project team. Cấu hình custom SMTP.

### User công ty đăng nhập được nhưng Save thất bại

- Domain trong JWT không khớp regex RLS.
- Migration/policy chưa chạy.
- Session cũ; logout/login lại.
- Frontend đang trỏ nhầm Supabase staging/production.

### Upload ảnh báo policy violation

- Bucket chưa tồn tại.
- Storage policy chưa chạy.
- User chưa có session.
- JWT không phải email công ty.
- File lớn hơn 8 MB hoặc MIME type không hợp lệ.

### Mở `/admin` trực tiếp bị 404

- `vercel.json` không nằm ở Root Directory deploy.
- Vercel đang chọn sai project root.
- Rewrite chưa được áp dụng; Redeploy.

### Preview login không hoạt động

- Preview URL chưa có trong Supabase Redirect URLs.
- Wildcard sai team slug.
- Biến Preview chưa được khai báo.
- Preview đang trỏ Supabase khác với project vừa cấu hình Auth.

### `supabase db push` báo migration history lệch

Nguyên nhân thường là schema đã được chạy trực tiếp bằng SQL Editor trước khi dùng CLI.

Không tự ý xóa bảng migration history. Đọc lỗi và dùng `supabase migration repair` theo tài liệu chính thức hoặc nhờ người quản lý database xử lý.

## 28. Bảo mật production

- Không đưa service role key vào Vercel frontend.
- Không đặt secret trong biến bắt đầu `VITE_`.
- Không commit `.env.local`.
- Không tắt RLS.
- Bật Auth Hook giới hạn domain.
- Xóa/ban user khi nhân sự nghỉ việc.
- Bật MFA cho Supabase và Vercel organization owners.
- Giới hạn người có quyền Production Deployments.
- Bảo vệ production branch và yêu cầu review.
- Dùng custom SMTP có SPF/DKIM/DMARC.
- Kiểm tra Auth logs và Database logs định kỳ.
- Backup Database và Storage.

## 29. Thông tin bàn giao cần lưu nội bộ

Không ghi secret trực tiếp vào file này. Lưu trong password manager hoặc hệ thống quản lý secret:

| Thông tin | Nơi quản lý |
|---|---|
| Supabase organization owner | Password manager/IT |
| Supabase Project Ref | Tài liệu nội bộ |
| Database password | Password manager |
| SMTP credentials | Password manager |
| Vercel team owner | Tài liệu nội bộ |
| Git repository owner | Tài liệu nội bộ |
| DNS registrar/DNS provider | Tài liệu nội bộ |
| Production domain | Tài liệu nội bộ |
| Người có quyền deploy | Danh sách access control |

## 30. Checklist triển khai rút gọn

### Supabase

- [ ] Project production đã tạo.
- [ ] Project Ref và database password đã lưu an toàn.
- [ ] Migration đã push.
- [ ] Bảng `site_content` tồn tại và bật RLS.
- [ ] Bucket `site-assets` tồn tại.
- [ ] Realtime publication có `site_content`.
- [ ] Email provider bật.
- [ ] Before User Created Hook bật.
- [ ] Custom SMTP hoạt động.
- [ ] Local redirect URL đã thêm.
- [ ] Production redirect URL đã thêm.

### Vercel

- [ ] Repository đã import.
- [ ] Root Directory đúng.
- [ ] Framework Vite.
- [ ] Build command `npm run build`.
- [ ] Output `dist`.
- [ ] Bốn biến `VITE_*` đã thêm.
- [ ] Production deployment Ready.
- [ ] SPA route không 404.
- [ ] Custom domain và HTTPS hoạt động.

### End-to-end

- [ ] Email công ty nhận magic link.
- [ ] Email ngoài công ty bị chặn.
- [ ] Admin lưu text thành công.
- [ ] Admin upload ảnh thành công.
- [ ] Public đọc được dữ liệu và ảnh.
- [ ] Realtime hoạt động.
- [ ] Mobile đã kiểm tra.
- [ ] Backup ban đầu đã tạo.

## 31. Tài liệu chính thức

### Supabase

- [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)
- [Database migrations](https://supabase.com/docs/guides/deployment/database-migrations)
- [Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)
- [Passwordless email Auth](https://supabase.com/docs/guides/auth/auth-email-passwordless)
- [Before User Created Hook](https://supabase.com/docs/guides/auth/auth-hooks/before-user-created-hook)
- [Custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Storage access control](https://supabase.com/docs/guides/storage/security/access-control)
- [Realtime](https://supabase.com/docs/guides/realtime)

### Vercel

- [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite)
- [Git deployments](https://vercel.com/docs/git)
- [Environment variables](https://vercel.com/docs/environment-variables)
- [Deployment environments](https://vercel.com/docs/deployments/environments)
- [Rewrites](https://vercel.com/docs/routing/rewrites)
- [Custom domains](https://vercel.com/docs/domains/working-with-domains/add-a-domain)
- [Deploy from CLI](https://vercel.com/docs/projects/deploy-from-cli)
