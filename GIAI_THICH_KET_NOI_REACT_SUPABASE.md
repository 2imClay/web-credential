# Giải thích kết nối React Frontend với Supabase

Tài liệu này mô tả đúng theo mã nguồn hiện có của website DGM Credential. Mục tiêu là giúp người tiếp quản hiểu hệ thống hoạt động như thế nào và có thể giải thích lại khi được hỏi.

## 1. Tóm tắt trong 30 giây

Website gồm hai phần dùng chung một nguồn dữ liệu:

- Website công khai tại `/`: khách truy cập xem nội dung.
- Content Studio tại `/admin`: tài khoản quản trị đăng nhập để sửa nội dung và tải ảnh.

React chịu trách nhiệm hiển thị giao diện. Supabase cung cấp bốn dịch vụ backend:

1. **Auth** xác thực tài khoản admin bằng email và mật khẩu.
2. **PostgreSQL Database** lưu nội dung website dưới dạng JSONB.
3. **Storage** lưu file ảnh và trả về URL công khai.
4. **Realtime** báo cho các tab đang mở biết dữ liệu vừa thay đổi.

Luồng tổng quát:

```text
Người dùng / Admin
        |
        v
React component
        |
        v
useContent hoặc AdminPage
        |
        v
contentRepository / authService
        |
        v
Supabase JS client
        |
        +---- Auth: đăng nhập, session
        +---- Database: đọc/ghi site_content
        +---- Storage: upload ảnh vào site-assets
        +---- Realtime: nhận sự kiện dữ liệu thay đổi
```

## 2. Các file quan trọng và tác dụng

| File | Tác dụng |
|---|---|
| `src/main.jsx` | Điểm khởi động React, gắn ứng dụng vào `#root` và bật `BrowserRouter`. |
| `src/App.jsx` | Khai báo route `/`, `/admin` và `/case-studies/:slug`; đồng thời render preloader. |
| `src/pages/HomePage.jsx` | Lấy toàn bộ content và truyền xuống các section của trang chủ. |
| `src/pages/AdminPage.jsx` | Giao diện đăng nhập, form sửa nội dung, upload ảnh và xem Activity Log. |
| `src/hooks/useContent.js` | Nối dữ liệu trong repository với React state; tự refresh khi dữ liệu đổi. |
| `src/lib/supabase.js` | Khởi tạo một Supabase browser client dùng chung toàn app. |
| `src/services/authService.js` | Đóng gói đăng nhập, đọc session, theo dõi auth và đăng xuất. |
| `src/services/contentRepository.js` | Lớp trung gian duy nhất để đọc/ghi content, upload ảnh, realtime và đọc audit log. |
| `src/data/siteData.js` | Dữ liệu mặc định/fallback và cấu trúc mẫu cho từng loại content. |
| `supabase/migrations/*.sql` | Tạo bảng, constraint, trigger, RLS policy, Storage bucket, Realtime và audit log. |

Ý nghĩa của cách chia này: component giao diện không cần biết câu SQL hay chi tiết Supabase. Nếu sau này đổi cách lưu dữ liệu, phần lớn thay đổi được gom trong `contentRepository.js`.

## 3. Supabase client được tạo như thế nào?

File `src/lib/supabase.js` đọc hai biến môi trường:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Sau đó gọi `createClient(url, publishableKey)` và bật:

- `persistSession: true`: lưu session đăng nhập trong trình duyệt, reload trang không phải đăng nhập lại ngay.
- `autoRefreshToken: true`: tự làm mới access token khi token sắp hết hạn.
- `detectSessionInUrl: true`: cho phép Supabase nhận session từ URL nếu có auth flow dùng redirect.

`isSupabaseConfigured` chỉ đúng khi cả URL và publishable key đều tồn tại. Nếu thiếu cấu hình, website công khai vẫn có thể dùng dữ liệu fallback nhưng Admin không thể lưu lên cloud.

### Vì sao publishable key xuất hiện trong frontend vẫn được?

Publishable key được thiết kế để dùng trong trình duyệt và sẽ nhìn thấy trong bundle/network. Nó **không phải secret**. Lớp bảo vệ thật là Row Level Security (RLS) trong PostgreSQL và policy của Storage.

Tuyệt đối không đưa các giá trị sau vào biến `VITE_*` hoặc mã frontend:

- `service_role` key;
- secret key;
- database password.

Những key này có thể bỏ qua RLS hoặc cấp quyền rất cao.

## 4. Database lưu dữ liệu ra sao?

Bảng chính là `public.site_content`:

| Cột | Kiểu | Ý nghĩa |
|---|---|---|
| `key` | `text`, primary key | Tên module nội dung, ví dụ `case_studies`. |
| `value` | `jsonb` | Toàn bộ dữ liệu của module đó. |
| `updated_at` | `timestamptz` | Thời điểm cập nhật gần nhất. |
| `updated_by` | `uuid` | ID user Supabase Auth đã lưu dữ liệu. |

Mỗi module là một row. Ví dụ:

```text
key = "case_studies"
value = [ { case 1 }, { case 2 }, ... ]
```

Các `key` hiện có:

| Key trong Database | Nội dung trên web |
|---|---|
| `site_settings` | Logo, hero, năm website, liên hệ và social link. |
| `page_content` | Section title, menu label và các đoạn copy chung. |
| `milestones` | Our Journey / timeline. |
| `press_articles` | Bài báo trong About Us. |
| `recognitions` | Giải thưởng và ghi nhận. |
| `services` | Danh sách dịch vụ. |
| `creative_portfolio` | Ảnh/video trong Creative Portfolio. |
| `case_studies` | Case Studies chính. |
| `social_seeding_theory` | Slide lý thuyết Social Seeding. |
| `social_seeding_cases` | Ảnh case Social Seeding. |
| `team_members` | Các team/phòng ban và số thành viên. |
| `partners` | Logo đối tác/khách hàng. |
| `process_steps` | Dữ liệu process cũ/được repository hỗ trợ. |

### Tại sao dùng JSONB thay vì một bảng riêng cho từng section?

Ưu điểm:

- Phù hợp website content-driven có nhiều loại section khác nhau.
- Thêm field mới trong item thường không phải đổi schema cột.
- Admin lưu và tải cả collection khá đơn giản.
- Dễ giữ một bộ fallback cùng cấu trúc trong `siteData.js`.

Đổi lại, mỗi lần lưu collection là ghi lại toàn bộ mảng. Nếu hai admin cùng sửa đúng một module, lần lưu sau có thể ghi đè thay đổi của lần trước. Đây là mô hình CMS gọn, không phải hệ thống cộng tác đồng thời như Google Docs.

## 5. Luồng tải nội dung ở website công khai

Khi `HomePage` render:

1. `useContent()` khởi tạo state từ cache của `contentRepository`.
2. Cache ban đầu là bản sao của dữ liệu mặc định trong `siteData.js`, nên giao diện có dữ liệu để render ngay.
3. Trong `useEffect`, hook gọi `contentRepository.loadAll()`.
4. Repository chạy:

   ```js
   supabase.from('site_content').select('key,value')
   ```

5. Cache được reset về defaults, sau đó row nào tồn tại trên Supabase sẽ ghi đè module tương ứng.
6. Repository phát browser event `dgm-content-updated`.
7. `useContent()` nghe event này, lấy dữ liệu mới từ cache và cập nhật React state.
8. React render lại các section với content mới.

Điểm cần nhớ: Supabase là nguồn chính khi row đã tồn tại; `siteData.js` là fallback cho module chưa có row hoặc lúc Supabase chưa được cấu hình.

## 6. Luồng đăng nhập Admin

Admin không có form tự đăng ký tài khoản. User được tạo thủ công trong Supabase Authentication.

Luồng đăng nhập:

1. `AdminPage` gọi `authService.getSession()` khi mở trang.
2. Nếu đã có session hợp lệ, giao diện Content Studio được mở.
3. Nếu chưa có session, admin nhập email/mật khẩu.
4. `authService.signIn()` chuẩn hóa email về chữ thường rồi gọi:

   ```js
   supabase.auth.signInWithPassword({ email, password })
   ```

5. Supabase Auth kiểm tra thông tin và trả về session chứa JWT.
6. Supabase JS tự đính JWT này vào các request Database/Storage tiếp theo.
7. RLS dùng thông tin trong JWT để quyết định request có được ghi dữ liệu hay không.

`onAuthStateChange()` giúp UI phản ứng ngay khi user đăng nhập, đăng xuất hoặc session thay đổi.

### Auth và quyền dữ liệu là hai việc khác nhau

- Auth trả lời: “Người này là ai, đã đăng nhập chưa?”
- RLS trả lời: “Người này được phép đọc/ghi row nào?”

Ẩn nút Admin ở frontend không phải bảo mật. Dù gọi API trực tiếp, request vẫn phải vượt qua RLS của Supabase.

## 7. Luồng lưu nội dung từ Admin

Ví dụ admin sửa một Case Study:

1. `AdminPage` mở modal và copy item vào state `editing`.
2. Người dùng sửa input; `updateEditing()` chỉ thay React state, chưa ghi database.
3. Khi bấm Save, `saveCollection()` chuẩn hóa dữ liệu:
   - tạo `id` bằng `crypto.randomUUID()` nếu item mới;
   - tạo `slug` cho case nếu chưa có;
   - chuyển tags thành mảng;
   - tách, trim và loại link YouTube trùng nhau.
4. Item được thêm hoặc thay thế trong collection hiện tại.
5. Hàm saver tương ứng gọi `contentRepository.save(key, value)`.
6. Repository chạy `upsert` theo primary key `key`:

   ```js
   supabase
     .from('site_content')
     .upsert({ key, value }, { onConflict: 'key' })
   ```

7. Trigger database tự cập nhật `updated_at` và `updated_by`.
8. Trigger audit tạo một row lịch sử trong `site_content_audit_log`.
9. Sau khi request thành công, repository cập nhật cache và phát `dgm-content-updated`.
10. Admin gọi lại Activity Log; các tab public nhận Realtime và tải lại content.

Các form Brand/Hero và Homepage Copy cũng đi qua đúng luồng này, chỉ khác `key` được lưu.

### Vì sao lỗi “Converting circular structure to JSON” từng xảy ra?

Supabase chỉ nhận dữ liệu có thể chuyển thành JSON. Nếu vô tình lưu cả DOM event hoặc `HTMLButtonElement` thay vì string/object thuần, `JSON.stringify` sẽ gặp tham chiếu vòng. Vì vậy handler phải lấy `event.target.value`, không truyền nguyên event vào object content.

## 8. Upload và hiển thị ảnh

Luồng upload trong Admin:

1. Browser kiểm tra file có MIME bắt đầu bằng `image/`.
2. Ảnh thường tối đa 8 MB; GIF được phép tối đa 20 MB ở bước kiểm tra frontend.
3. Với ảnh thường, browser dùng `Image` + `canvas` để:
   - giữ nguyên tỷ lệ;
   - giới hạn cạnh dài tối đa 1800 px;
   - chuyển sang WebP chất lượng `0.84`.
4. Logo partner dùng `preserveOriginal: true`, nên không resize, không crop và không chuyển WebP.
5. Repository tạo đường dẫn duy nhất:

   ```text
   homepage/YYYY-MM-DD/<uuid>.<extension>
   ```

6. File được upload vào bucket public `site-assets` với cache một năm.
7. Supabase trả về public URL.
8. URL đó được đặt vào React state của item.
9. Chỉ khi bấm Save collection, URL mới được lưu vào JSONB trong `site_content`.

Database không chứa binary của ảnh; nó chỉ chứa URL. File thật nằm trong Storage.

### Điều cần lưu ý về ảnh

- Xóa một item content hiện chỉ bỏ URL khỏi JSON; code chưa tự xóa object tương ứng trong Storage. Cần dọn file rác định kỳ nếu upload/thay ảnh nhiều.
- Bucket public nghĩa là ai có URL đều xem được ảnh; phù hợp tài sản công khai của website nhưng không phù hợp tài liệu riêng tư.
- Migration Storage đặt giới hạn bucket là 20 MiB, đồng bộ với giới hạn ảnh nguyên bản ở Admin.

## 9. YouTube được nhúng như thế nào?

Video YouTube không được tải vào Supabase Storage. Admin chỉ lưu URL YouTube trong JSONB.

- Creative Portfolio dùng `youtubeUrl` cho từng item.
- Case Study dùng mảng `youtubeUrls`.

Component frontend lấy video ID từ các dạng URL `youtube.com/watch`, `youtu.be`, `embed`, `shorts` hoặc `live`, rồi tạo iframe:

```text
https://www.youtube-nocookie.com/embed/<VIDEO_ID>
```

Người xem có thể phát video trực tiếp trên web và dùng fullscreen. Dùng `youtube-nocookie.com` giúp hạn chế cookie theo dõi trước khi người dùng tương tác so với iframe YouTube thường.

## 10. Case Study hoạt động như thế nào?

Trang chủ render danh sách Case Study qua `CaseStudyGallery`.

- `category` tạo bộ lọc.
- `image` là cover ngoài card.
- `cardSummary` là text ngắn trên card.
- `summary` là text trong box chi tiết.
- `gallery` là mảng ảnh chi tiết.
- `youtubeUrls` là mảng video nhúng.
- `slug` là định danh URL.

Khi bấm View Case, website hiện `CaseStudyModal`; cover ngoài card không bị lặp lại trong modal. Modal chỉ render phần intro, gallery và video đã lưu.

Repo vẫn có route `/case-studies/:slug` trong `CaseStudyDetailPage.jsx`. Route này tìm item bằng `slug`. Tuy nhiên trang chủ hiện ưu tiên modal; route chi tiết là luồng dự phòng/đường dẫn trực tiếp và vẫn còn các field cũ như objective/challenge/solution/result.

## 11. Realtime hoạt động như thế nào?

Migration thêm bảng `site_content` vào publication `supabase_realtime`.

`contentRepository.subscribeToChanges()` mở channel và nghe mọi sự kiện insert/update/delete trên bảng. Khi có sự kiện, nó không tự vá một phần cache mà gọi lại `loadAll()` để bảo đảm toàn bộ dữ liệu nhất quán.

Tác dụng thực tế:

- Admin lưu ở tab A.
- Tab website B đang mở nhận event.
- Tab B fetch lại data và React render content mới mà không cần reload thủ công.

Nếu Realtime lỗi, việc Save vẫn có thể thành công; chỉ các tab khác không tự cập nhật ngay.

## 12. Activity Log hoạt động như thế nào?

Bảng `public.site_content_audit_log` lưu:

| Cột | Tác dụng |
|---|---|
| `content_key` | Module nào vừa thay đổi. |
| `action` | `insert`, `update` hoặc `delete`. |
| `actor_id` | UUID của tài khoản thực hiện. |
| `actor_email` | Email lấy từ JWT tại thời điểm lưu. |
| `changed_at` | Thời gian thay đổi. |
| `old_value` | JSON trước khi đổi. |
| `new_value` | JSON sau khi đổi. |

Trigger `log_site_content_change()` chạy trong database sau mỗi thay đổi `site_content`. Vì log được tạo ở database chứ không dựa vào nút UI, thay đổi hợp lệ từ frontend hoặc API vẫn được ghi lại.

Nếu một lệnh update gửi lại `value` hoàn toàn giống cũ, trigger bỏ qua để tránh log rác.

Admin tải 40 log mỗi lần, sắp xếp mới nhất trước và có thể tải thêm. UI so sánh `old_value` và `new_value` để mô tả item nào được thêm, sửa hoặc xóa.

Activity Log này là lịch sử nội dung riêng của website, khác với Auth Audit Logs hay Platform Logs có sẵn của Supabase.

## 13. RLS và trạng thái quyền hiện tại cần hiểu chính xác

Migration đầu tiên `202608130001_landing_page_backend.sql` đang định nghĩa:

- Khách `anon` và user `authenticated` đều được đọc `site_content`.
- Chỉ tài khoản authenticated có email khớp `@digimind.asia` được insert/update/delete `site_content` và ghi/xóa Storage.
- Public được đọc file trong bucket `site-assets`.

Migration `202608140001_manual_admin_accounts.sql` hiện là **no-op** và ghi rõ giữ nguyên company-user policy. Nó không mở quyền ghi cho mọi tài khoản authenticated.

Migration `202608160002_content_admin_audit_access.sql` chỉ mở quyền **đọc Activity Log** cho mọi tài khoản authenticated.

Vì vậy, xét đúng các migration đang lưu trong repo:

| Hành động | Anonymous | Authenticated email khác domain | Authenticated `@digimind.asia` |
|---|---:|---:|---:|
| Đọc content public | Có | Có | Có |
| Ghi content | Không | Không | Có |
| Đọc ảnh public | Có | Có | Có |
| Upload/sửa/xóa ảnh | Không | Không | Có |
| Đọc Activity Log | Không | Có | Có |

Nếu Supabase production hiện cho tất cả user được tạo thủ công ghi dữ liệu, nghĩa là policy trên production đã được sửa ngoài các migration hiện có. Khi bàn giao cần export/đối chiếu policy production và tạo một migration mới để repo phản ánh đúng trạng thái thật. Không nên trả lời rằng frontend quyết định quyền này; quyền cuối cùng nằm ở RLS.

## 14. Dữ liệu fallback và lỗi kết nối

`siteData.js` giúp website không trắng hoàn toàn khi:

- chưa có `.env.local`;
- Supabase chưa cấu hình;
- một module chưa có row trong database.

Nếu request `loadAll()` lỗi sau khi trang đã render, hook ghi lỗi ra console và dữ liệu cache hiện tại vẫn được giữ. Đây là cơ chế graceful fallback, không phải chế độ đồng bộ offline; thay đổi ở Admin vẫn cần kết nối Supabase.

`getPageContent()` còn merge từng nhóm copy đã lưu với default tương ứng. Nhờ vậy khi code bổ sung field copy mới, dữ liệu cũ chưa có field đó vẫn nhận giá trị mặc định.

## 15. Route và deploy

Ứng dụng dùng `BrowserRouter`, nên server hosting phải trả `index.html` cho các URL React như `/admin` và `/case-studies/abc`.

- `vercel.json` đã rewrite mọi route về `/index.html`.
- `netlify.toml` đã redirect `/*` về `/index.html` với status 200.

Nếu thiếu rewrite, mở trang chủ vẫn được nhưng reload trực tiếp một route con có thể trả về 404.

## 16. Bảo mật cần trả lời khi bị hỏi

### “Có lộ key Supabase không?”

Publishable key có thể xuất hiện ở browser và điều đó bình thường. Không được lộ service role/secret/database password. Quyền truy cập phải do RLS kiểm soát.

### “Người ngoài có sửa content bằng DevTools được không?”

Không nếu RLS đúng. Họ có thể nhìn thấy endpoint và gửi request, nhưng Supabase từ chối request không thỏa policy.

### “Vì sao ảnh ai cũng xem được?”

Vì đây là website public và bucket `site-assets` được cấu hình public. Chỉ quyền upload/sửa/xóa mới cần xác thực.

### “Xóa user admin ở đâu?”

Ban hoặc xóa user trong Supabase Dashboard > Authentication > Users. Session/token hiện có cũng nên được revoke theo quy trình quản trị.

### “Activity Log có bị admin sửa không?”

Frontend chỉ được cấp `select` trên bảng audit; log được ghi bởi trigger. Repo không cấp insert/update/delete trực tiếp cho user authenticated.

## 17. Các câu hỏi thường gặp khi demo/bảo vệ

### React liên kết với Supabase ở chỗ nào?

Liên kết vật lý được tạo tại `src/lib/supabase.js`. Mọi chức năng khác dùng client đó thông qua `authService.js` và `contentRepository.js`.

### Vì sao không gọi Supabase trực tiếp trong từng component?

Để tách UI khỏi logic dữ liệu, tránh lặp code, thống nhất cache/error handling và dễ thay backend hoặc kiểm thử hơn.

### Save một item hay cả danh sách?

Hiện tại Save ghi lại toàn bộ `value` của module. Ví dụ sửa một case sẽ upsert lại mảng `case_studies`.

### Khi admin Save, website cập nhật bằng cách nào?

Save thành công cập nhật cache trong tab hiện tại; trigger Realtime giúp các tab khác nhận sự kiện và gọi lại `loadAll()`.

### Ảnh được lưu ở Database hay Storage?

File ở Storage; Database chỉ lưu URL public của file.

### Có backend server Node/Express riêng không?

Không. React gọi Supabase trực tiếp bằng SDK. Auth, REST API tự sinh từ Postgres, Storage, Realtime và security policy đều do Supabase cung cấp.

### Năm trên preloader/footer lấy từ đâu?

Từ `site_settings.siteYear`. Admin sửa field Website year. Default dùng `new Date().getFullYear()` để tránh hard-code năm cũ khi database chưa có giá trị.

### Vì sao Supabase đổi dữ liệu mà React biết render lại?

`contentRepository` phát custom event để cập nhật state trong cùng tab, và dùng Supabase Realtime để nhận thay đổi từ tab/user khác.

### Nếu hai admin sửa cùng lúc thì sao?

Vì một module được lưu thành một JSONB document, lần Save sau cùng thắng. Activity Log vẫn lưu hai phiên bản, nhưng UI chưa có conflict resolution.

## 18. Checklist kiểm tra khi có lỗi

### Website không tải content mới

1. Kiểm tra `.env.local` và restart Vite.
2. Mở Network, tìm request tới Supabase REST.
3. Kiểm tra console.
4. Kiểm tra row đúng `key` trong `site_content`.
5. Kiểm tra RLS SELECT policy.
6. Nếu chỉ không tự refresh, kiểm tra Realtime publication và WebSocket.

### Đăng nhập được nhưng Save báo RLS violation

1. Kiểm tra user đã confirmed và session còn hạn.
2. Kiểm tra email có thỏa write policy hiện tại hay không.
3. Kiểm tra policy thật trên Supabase production, không chỉ đọc file migration.
4. Đăng xuất/đăng nhập lại sau khi đổi policy hoặc user metadata.

### Upload ảnh thất bại

1. Kiểm tra loại và dung lượng file.
2. Kiểm tra bucket `site-assets` tồn tại và public.
3. Kiểm tra Storage insert policy.
4. Kiểm tra session.
5. Kiểm tra giới hạn 20 MiB của bucket.

### Activity Log không có bản ghi

1. Kiểm tra hai migration audit đã chạy.
2. Kiểm tra trigger `log_site_content_change` tồn tại.
3. Save phải thật sự làm `value` thay đổi; lưu y hệt sẽ không tạo log.
4. Kiểm tra SELECT policy trên audit table.
5. Bấm Refresh trong Activity Log.

## 19. Điểm mạnh và giới hạn kỹ thuật hiện tại

### Điểm mạnh

- UI React custom, responsive và nhiều animation thay vì template tĩnh.
- Content Studio quản lý phần lớn nội dung mà không sửa code.
- Auth, RLS, Storage và Realtime được tách đúng vai trò.
- Có fallback content, Activity Log và upload tối ưu ảnh.
- Hỗ trợ gallery, logo, ảnh nhiều tỷ lệ và YouTube embed.
- Có cấu hình SPA rewrite cho Vercel và Netlify.

### Giới hạn nên nói thẳng khi bàn giao

- Đây là client-rendered SPA; SEO kỹ thuật tốt ở cấu trúc HTML/CSS chưa đồng nghĩa với SSR/SSG cho từng case.
- Chưa có automated test trong `package.json`.
- CSS lớn và nhiều lớp override, cần refactor nếu mở rộng lâu dài.
- Collection JSONB dùng last-write-wins khi nhiều admin cùng sửa.
- Chưa tự dọn file Storage khi xóa/thay ảnh.
- Activity Log có thể phình lớn vì lưu cả `old_value` và `new_value` của collection.
- Migration quyền hiện tại chưa khớp với yêu cầu “mọi user Auth đều có quyền ghi” nếu production đã được mở thủ công.

## 20. Cách giải thích ngắn gọn khi khách hàng hỏi kiến trúc

Có thể trả lời như sau:

> Website dùng React/Vite ở frontend và Supabase làm backend-as-a-service. React chỉ phụ trách UI; một repository trung tâm kết nối tới Supabase để đọc/ghi content. Nội dung được lưu theo từng module trong PostgreSQL JSONB, ảnh nằm trong Storage, tài khoản admin do Supabase Auth xác thực, RLS quyết định quyền thật ở database, Realtime làm các tab tự nhận nội dung mới, còn trigger audit lưu người sửa cùng phiên bản trước/sau. Website có dữ liệu fallback trong source để không bị trắng khi module cloud chưa được khởi tạo.

## 21. Thứ tự đọc code nếu cần ôn nhanh

1. `src/lib/supabase.js`
2. `src/services/authService.js`
3. `src/services/contentRepository.js`
4. `src/hooks/useContent.js`
5. `src/pages/HomePage.jsx`
6. `src/pages/AdminPage.jsx`
7. `src/data/siteData.js`
8. `supabase/migrations/`

Ghi nhớ ba chuỗi sau là đủ để lần theo hầu hết lỗi:

```text
Public: HomePage -> useContent -> contentRepository -> Supabase

Admin: AdminPage -> authService/contentRepository -> Supabase Auth + Database + Storage

Save: upsert site_content -> database triggers -> audit log + realtime -> React refresh
```
