# DGM Credential 2026

Website credential của DGM, xây dựng bằng React và Vite.

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

## Content management

Truy cập `/admin` để quản lý:

- Nhận diện thương hiệu, logo và hero
- Nội dung các section
- Recognition và ảnh bài báo
- Services, partners, case studies, team và process
- Thông tin liên hệ

Có thể cấu hình thông tin đăng nhập bằng:

```env
VITE_ADMIN_EMAIL=admin@dgm.vn
VITE_ADMIN_PASSWORD=your-secure-password
```

Nội dung được lưu trong trình duyệt thông qua lớp `contentRepository`, giúp giao diện quản trị hoạt động độc lập và có thể thay thế bằng API khi cần.

## Cấu trúc chính

- `src/pages/HomePage.jsx`: bố cục trang chủ
- `src/pages/AdminPage.jsx`: quản trị nội dung
- `src/components`: các module giao diện
- `src/data/siteData.js`: nội dung mặc định
- `src/services/contentRepository.js`: lớp lưu trữ nội dung
- `src/styles/site.css`: design system và responsive
