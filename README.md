# DGM Credential React Demo

Demo landing page cho DGM dựa trên credential 2026 và wireframe/Canva đã cung cấp.

## Chạy project

Yêu cầu: Node.js 18+.

```bash
npm install
npm run dev
```

Mở `http://localhost:5173`.

## Admin demo

Mở `http://localhost:5173/admin`

- Email: `admin@dgm.vn`
- Password: `demo123`

Admin hiện dùng `localStorage`, chỉ để demo luồng chỉnh nội dung và CRUD Case Studies. Không dùng cho production.

## Build

```bash
npm run build
npm run preview
```

## Cấu trúc chính

- `src/pages`: trang public, case detail, admin.
- `src/components`: component giao diện dùng lại.
- `src/data/siteData.js`: dữ liệu mặc định.
- `src/services/contentRepository.js`: lớp truy cập dữ liệu, hiện dùng localStorage; sau này thay bằng API/Supabase.
- `public/images`: ảnh chọn lọc từ credential.
- `PLAN.md`: nhật ký và kế hoạch để prompt tiếp trong VS Code.
- `docs/BACKEND_PLAN.md`: đề xuất backend và schema.

## Ghi chú kiểm thử

Môi trường tạo file không truy cập được public npm registry nên chưa thể chạy `npm install`/`npm run build` tại đây. Project dùng cấu hình Vite/React chuẩn; hãy chạy hai lệnh này trên máy của bạn để xác nhận bản build đầu tiên.

## UI revision 02

The public homepage no longer embeds credential or Canva screenshots. Default visuals are built with React, semantic HTML and CSS. Images appear only when an Admin user explicitly uploads media for a Case Study, Recognition or Partner logo.

New interactive modules:
- Draggable horizontal Milestones rail.
- Recognition viewer with a vertical selector.
- Filterable Case Study cards.
- Auto-running Partner logo marquee.
- Our Team panel with a rounded custom vertical control.

Admin demo now supports CRUD for Case Studies, Recognitions and Partner logos. Uploaded images are stored in browser localStorage for demo purposes only.

## UI revision 04

Bản demo hiện có thêm:

- Hero/Header theo bố cục award reference.
- Upload Hero background, chỉnh background position và PDF URL trong Admin.
- Animated ambient background.
- D-AI rotating technology globe dựng bằng HTML/CSS.
- Contact form và Google Maps ở Footer.
- Scroll word reveal cho các section heading.

Lưu ý: contact form hiện chỉ là prototype phía frontend. Dữ liệu chưa được gửi ra email hoặc database.
