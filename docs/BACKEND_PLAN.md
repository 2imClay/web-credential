# Backend recommendation

## Khuyến nghị cho dự án này: Supabase

Với website thông tin đơn giản nhưng cần admin, đăng nhập, database và upload ảnh, Supabase là lựa chọn gọn nhất:

- PostgreSQL database.
- Auth cho admin/editor.
- Storage cho ảnh/video Case Studies.
- API và client React sẵn có.
- Ít phần phải deploy/maintain hơn một backend tự viết.
- FE có thể deploy độc lập trên Vercel/Netlify.

## Khi nào chọn Spring Boot

Chọn Spring Boot nếu công ty yêu cầu:

- Hạ tầng Java nội bộ.
- Luồng phê duyệt/phân quyền phức tạp.
- Tích hợp CRM/ERP/hệ thống công ty.
- Audit log, API riêng và business logic lớn.

Với Spring Boot nên dùng: Spring Boot + Spring Security/JWT + PostgreSQL + object storage (S3/Cloudinary) và deploy Docker lên Render/Railway/Fly.io hoặc hạ tầng công ty.

## Phương án CMS khác

Strapi phù hợp khi muốn admin CMS có sẵn và content team tự quản trị nhiều loại nội dung. Đổi lại sẽ có thêm một service Node.js cần deploy và quản lý.

## Schema đề xuất

### profiles
- id uuid, email, role (`admin`, `editor`), display_name

### site_settings
- id, key, value_json, updated_at

### case_studies
- id uuid
- slug unique
- title
- summary
- category
- year
- cover_image_url
- objective
- challenge
- solution
- result
- status (`draft`, `published`)
- sort_order
- created_at / updated_at / published_at

### case_study_media
- id, case_study_id, media_type, url, alt_text, sort_order

### contact_submissions
- id, name, email, phone, company, message, created_at, status

## API/data contract dự kiến

- `GET /case-studies?status=published`
- `GET /case-studies/:slug`
- `POST /case-studies`
- `PATCH /case-studies/:id`
- `DELETE /case-studies/:id`
- `GET/PATCH /site-settings`
- `POST /contact-submissions`
- `POST /media/upload`

Lớp `contentRepository` hiện là điểm thay thế khi nối backend.
