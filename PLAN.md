# DGM Credential Website — Build Plan & Prompt Memory

> File này là nguồn ngữ cảnh chính để tiếp tục prompt trong VS Code/Codex. Sau mỗi thay đổi lớn, cập nhật mục **Change log** và **Next actions**.

## 1. Mục tiêu sản phẩm

- Website credential/landing page cho công ty Digital Marketing DGM.
- Giao diện chuyên nghiệp, sáng tạo nhưng không “AI-looking”.
- Màu chủ đạo: xanh dương đậm, cyan, đen, trắng/xám.
- Bố cục phẳng, khoảng trắng rõ, hạn chế bo tròn và không dùng gradient phức tạp.
- Scroll/reveal/marquee tạo điểm nhấn nhưng phải giữ hiệu năng và khả năng đọc.
- Có trang admin để chỉnh nội dung và CRUD Case Studies; Case Studies là nội dung quan trọng nhất.
- FE phải demo được ngay trước khi có backend thật.

## 2. Phạm vi demo hiện tại

### Public
- Hero / award positioning.
- About DGM + giá trị cốt lõi.
- Milestones & Recognition.
- Services.
- D-AI Sense / Data Hub.
- Partners & Clients.
- Case Studies list + detail.
- Process.
- Contact/Footer.

### Admin prototype
- Đăng nhập demo.
- Chỉnh hero và thông tin liên hệ.
- Thêm/sửa/xóa Case Study.
- Preview dữ liệu ngay ở website.
- Dữ liệu được lưu trong localStorage.

## 3. Quyết định kỹ thuật

- React + Vite.
- TailwindCSS cho utility; CSS custom cho art direction và animation.
- React Router cho `/`, `/case-studies/:slug`, `/admin`.
- Framer Motion cho reveal animation.
- Lucide React cho icon.
- Data access tách tại `src/services/contentRepository.js` để dễ đổi localStorage sang API/Supabase.

## 4. Nguyên tắc thiết kế bắt buộc

- Không biến mọi nội dung thành card bo tròn.
- Không dùng glow/gradient màu mè làm nền chính.
- Tập trung typography lớn, grid, line, contrast và hình thật.
- Animation có mục đích: reveal, marquee, hover crop, sticky header.
- Responsive Desktop → Tablet → Mobile.
- Có `prefers-reduced-motion`.

## 5. Trạng thái triển khai

- [x] Khởi tạo cấu trúc React/Vite.
- [x] Cấu hình Tailwind.
- [x] Lưu ảnh tham khảo riêng trong `reference`; không dùng screenshot credential làm giao diện mặc định.
- [x] Landing page đầy đủ các section chính, gồm About/Services/Case Studies revision 03.
- [x] Case Studies list và detail.
- [x] Admin prototype CRUD Case Studies.
- [x] Content repository tách riêng.
- [x] Responsive cơ bản.
- [x] README và backend plan.
- [ ] Review nội dung thật với sếp.
- [ ] Thay logo/ảnh/video bản quyền nội bộ chất lượng gốc.
- [ ] Chốt backend.
- [ ] Auth production và phân quyền admin/editor.
- [ ] Upload media thật.
- [ ] SEO metadata động cho từng case study.
- [ ] Analytics, form liên hệ, chống spam.
- [ ] Test cross-browser và accessibility audit.

## 6. Next actions đề xuất

1. Chạy project, review bố cục với sếp.
2. Ghi feedback theo từng section vào file này.
3. Chọn Supabase hoặc Spring Boot.
4. Chuyển dữ liệu localStorage sang DB.
5. Tạo upload ảnh, draft/publish và sort order cho Case Studies.
6. Deploy FE demo lên Vercel/Netlify.

## 7. Prompt mẫu tiếp tục trong VS Code

```text
Đọc README.md, PLAN.md và docs/BACKEND_PLAN.md trước.
Giữ nguyên art direction hiện tại: tối giản, phẳng, xanh dương/đen, không bo tròn quá đà, không gradient phức tạp.

Nhiệm vụ:
[MÔ TẢ THAY ĐỔI]

Yêu cầu:
- Phân tích file liên quan trước khi sửa.
- Không phá responsive và admin prototype.
- Tái sử dụng component hiện có.
- Sau khi xong, chạy npm run build.
- Cập nhật PLAN.md: Change log và Next actions.
```

## 8. Change log

### 2026-08-02 — Initial demo
- Tạo project React/Vite + Tailwind.
- Xây public landing page và animation.
- Tạo Case Study detail route.
- Tạo Admin prototype dùng localStorage.
- Tạo tài liệu để tiếp tục phát triển.

### Environment verification note
- Source structure and configuration were reviewed in the generated workspace.
- The generation environment's private npm registry did not expose public npm packages, so `npm install`/`npm run build` could not be executed here. Run them locally in VS Code with normal internet access; resolve any package-version warning before production deployment.

## Change log — 2026-08-02 / UI revision 02

### User direction
- Không dùng các ảnh/screenshot credential và Canva như nội dung trực tiếp trên website.
- Screenshot chỉ được dùng để đọc nội dung và hiểu bố cục.
- Các khối giao diện phải được dựng bằng React components, HTML semantic và CSS.

### Completed in this revision
- Rebuilt Header + Hero in HTML/CSS based on the award layout reference:
  - Transparent navigation overlay.
  - Two award/ranking content columns.
  - Center award sculpture created entirely with HTML/CSS.
  - Book a meeting and case-study CTAs.
- Rebuilt Milestones as a horizontal draggable rail:
  - Native horizontal scroll.
  - Pointer drag interaction.
  - Previous/next controls.
  - Exact milestone content transcribed from the provided reference.
- Added interactive Our Recognition section:
  - Large selected content/media area on the left.
  - Scrollable vertical selector on the right.
  - HTML/CSS poster fallback when no image is uploaded.
  - Admin CRUD and image upload support.
- Rebuilt Case Studies as filterable two-column cards:
  - Category tabs.
  - HTML/CSS visual fallback when a case has no image.
  - Admin can upload, replace or remove case images.
- Rebuilt Partners & Clients marquee:
  - Auto-running logo/wordmark track.
  - Pauses on hover.
  - Admin CRUD and logo upload support.
- Added Our Team section using the supplied team structure:
  - Vertically scrollable content panel.
  - Rounded custom scroll control on the right.
  - Scroll-up and scroll-down buttons.
- Rebuilt About and D-AI Sense blocks as HTML/CSS, removing credential screenshots from the public interface.
- Removed all credential page images from `public/images`; only the `reference` folder keeps design references.
- Added separate repository data collections for:
  - Site settings.
  - Case studies.
  - Recognitions.
  - Partner logos.
- Updated the Admin prototype to manage all required collections.

### Technical notes
- Uploaded demo images are stored as Data URLs in localStorage.
- Keep individual demo images below 1.5 MB to avoid localStorage limits.
- Production image uploads must later move to Supabase Storage or another object-storage service.
- localStorage keys were moved to `v2`, so old prototype data will not override the revised demo.

### Validation
- JSX syntax was parsed successfully with TypeScript CLI using `allowJs` and `react-jsx` mode.
- `npm install` could not be completed in the generation environment because its internal npm mirror did not contain `@vitejs/plugin-react`; run installation on the local machine using the normal public npm registry.

### Next recommended prompt
```text
Read PLAN.md first, especially “UI revision 02”.
Do not use reference screenshots as webpage images.
Keep all default visuals built from semantic HTML and CSS; uploaded Admin media is allowed.

Next task:
[Describe the specific section to revise]

After editing:
1. Run npm run build.
2. Check desktop, tablet and mobile layouts.
3. Update PLAN.md with completed work, decisions and remaining issues.
```

## Change log — 2026-08-02 / UI revision 03

### User direction
- Thiết kế lại About Us theo bố cục tham khảo dạng dark agency showcase, nhưng không đưa ảnh tham khảo vào website.
- Thiết kế Our Services theo dạng lưới thẻ tối, rõ số thứ tự, icon, mô tả và từ khóa.
- Thiết kế Case Studies theo bố cục editorial tương tự danh sách bài viết, nhưng phải là thanh ngang có thể kéo để xem.
- Thêm hiệu ứng chữ xuất hiện khi người dùng cuộn xuống.

### Completed in this revision
- Rebuilt **About Us** thành một khối dark editorial hai cột:
  - Cột trái là visual giả lập bằng HTML/CSS gồm dashboard, campaign board và các chi tiết trang trí.
  - Không dùng ảnh tham khảo hoặc ảnh stock mặc định.
  - Cột phải có headline lớn, từ khóa nhấn cyan, đoạn giới thiệu, bốn điểm mạnh, CTA và hotline.
  - Nội dung giữ đúng hướng company credential/digital marketing.
- Rebuilt **Our Services** thành lưới 6 service cards:
  - 3 cột desktop, 2 cột tablet, 1 cột mobile.
  - Mỗi thẻ có số thứ tự, icon Lucide, mô tả, tags và hover motion.
  - Bổ sung nội dung Branding & Identity và gom Media + Consumer Insights thành service hoàn chỉnh.
- Rebuilt **Case Studies** thành horizontal draggable rail:
  - Kéo ngang bằng chuột hoặc cảm ứng.
  - Nút điều hướng trái/phải.
  - Scroll snap theo từng case.
  - Category tabs vẫn hoạt động.
  - Case image vẫn lấy từ dữ liệu Admin; nếu không có ảnh sẽ dùng HTML/CSS fallback.
  - Khi kéo rail, click nhầm vào trang chi tiết được chặn.
- Added **scroll text reveal system**:
  - `TextReveal.jsx` tách heading thành từng từ và chạy staggered clip-up animation khi vào viewport.
  - `Reveal.jsx` được nâng cấp thành fade-up + blur-to-sharp cho các block nội dung.
  - Có hỗ trợ `prefers-reduced-motion` từ CSS hiện tại.
- Cập nhật responsive cho About, Services và Case Studies.

### Files added
- `src/components/TextReveal.jsx`

### Files updated
- `src/pages/HomePage.jsx`
- `src/components/CaseStudyGallery.jsx`
- `src/components/CaseStudyCard.jsx`
- `src/components/Reveal.jsx`
- `src/data/siteData.js`
- `src/styles/index.css`
- `PLAN.md`

### Interaction notes
- Case Studies rail dùng native overflow, pointer capture và `scrollBy`, không phụ thuộc slider library.
- Dữ liệu Case Studies vẫn giữ nguyên repository/localStorage nên Admin CRUD và upload ảnh không bị thay đổi.
- About visual mặc định là HTML/CSS; chỉ các hình được Admin upload cho Case Studies/Recognition/Partners mới xuất hiện.

### Validation
- Tất cả file JS/JSX trong `src` đã được parse thành công bằng TypeScript CLI với `allowJs`, `react-jsx`, `noEmit` và `noResolve`.
- CSS đã được kiểm tra cân bằng dấu ngoặc và parse bằng `tinycss2` không có lỗi cú pháp.
- `npm install` vẫn không chạy được trong môi trường tạo file vì internal npm mirror trả về 404 cho `@vitejs/plugin-react`; cần chạy `npm install` và `npm run build` trên máy local.

### Next recommended prompt
```text
Đọc PLAN.md, tập trung phần “UI revision 03”.
Giữ nguyên quy tắc: không dùng screenshot tham khảo làm ảnh website; mặc định dựng visual bằng HTML/CSS.

Nhiệm vụ tiếp theo:
[Mô tả section cần sửa]

Yêu cầu:
- Không phá horizontal drag của Case Studies.
- Không phá Admin CRUD và dữ liệu localStorage.
- Giữ màu xanh dương/cyan/đen và bố cục phẳng.
- Kiểm tra desktop, tablet và mobile.
- Chạy npm run build ở môi trường local.
- Cập nhật PLAN.md sau khi hoàn thành.
```

## Change log — 2026-08-02 / UI revision 04

### User direction
- Header/Hero phải bám sát bố cục ảnh award reference: logo và navigation nằm trên nền Hero; hai cụm tiêu đề nằm hai bên; CTA nằm phía dưới.
- Background Hero phải upload/thay được trong Admin.
- Footer cần form liên hệ và bản đồ.
- Tổng thể website cần mềm mại hơn, bớt cảm giác các khối vuông cứng.
- Khi cuộn tới section nào, heading/nội dung của section đó cần chạy reveal.
- Nền website cần có animation nhẹ.
- D-AI Sense cần hình ảnh công nghệ, gồm một quả địa cầu dữ liệu tự xoay.

### Completed in this revision
- Rebuilt Header/Hero theo reference:
  - Header trong suốt đặt trên Hero ở trạng thái đầu trang.
  - Navigation dùng dấu phân cách dọc giống reference.
  - Khi cuộn, Header trở thành floating dark bar có blur để giữ khả năng đọc.
  - Hero có hai cụm award/ranking copy, CSS award fallback và hai CTA dạng pill ở đáy.
  - Có thể upload Hero background trong Admin; khi có custom background, CSS award fallback tự ẩn để không che ảnh.
  - Thêm trường Background position và Credential PDF URL trong Admin.
- Added animated ambient background:
  - Các vòng tròn và đường mảnh chuyển động rất nhẹ phía sau website.
  - Dark sections có decorative orbit riêng.
  - Tự tắt trong `prefers-reduced-motion`.
- Softened the UI system:
  - Các surface quan trọng dùng radius vừa phải, shadow mềm và glass blur có kiểm soát.
  - Service cards, recognition, about panels, team panel, process steps và case images được làm mềm hơn nhưng không biến toàn bộ trang thành “plastic cards”.
- Expanded scroll reveal:
  - `SectionHeading` dùng `TextReveal`, vì vậy heading của Milestones, Recognition, Partners và Process chạy từng từ khi vào viewport.
  - Team, D-AI và Footer cũng dùng staggered word reveal.
  - Các card/block tiếp tục dùng `Reveal` fade-up + blur-to-sharp.
- Rebuilt D-AI technology background:
  - Quả địa cầu HTML/CSS tự xoay.
  - Latitude/longitude rings, scanning line, orbit nodes, data labels và moving grid.
  - Data console dùng nền glass để vẫn đọc rõ trên globe.
- Rebuilt Footer contact experience:
  - Contact form responsive.
  - Google Maps iframe.
  - Email, hotline và địa chỉ.
  - Trường Google Maps embed URL có thể chỉnh trong Admin.
  - Form hiện là UI demo; cần nối API/email/CRM ở backend production.
- Added `src/styles/v4.css` để tách toàn bộ override của revision 04 khỏi CSS cũ, giúp tiếp tục chỉnh sửa và rollback dễ hơn.

### Files added
- `src/components/AmbientBackground.jsx`
- `src/components/TechGlobe.jsx`
- `src/styles/v4.css`

### Files updated
- `src/components/Header.jsx`
- `src/components/Hero.jsx`
- `src/components/Footer.jsx`
- `src/components/SectionHeading.jsx`
- `src/pages/HomePage.jsx`
- `src/pages/AdminPage.jsx`
- `src/data/siteData.js`
- `src/services/contentRepository.js`
- `src/main.jsx`
- `PLAN.md`

### Admin fields added
- Hero background image URL/upload.
- Hero background CSS position.
- Credential PDF URL.
- Google Maps embed URL.

### Production notes
- Contact form chưa gửi dữ liệu thật; cần API/serverless function, email service hoặc CRM webhook.
- Hero image hiện lưu dạng Data URL trong localStorage demo. Production phải chuyển sang Supabase Storage, Cloudinary hoặc object storage tương đương.
- Google Maps URL phải là embed URL (`output=embed` hoặc URL do Google Maps Share → Embed cung cấp).

### Next recommended prompt
```text
Đọc PLAN.md, tập trung phần “UI revision 04”.
Giữ cấu trúc Hero background upload, contact form + map và D-AI TechGlobe.

Nhiệm vụ tiếp theo:
[Mô tả chỉnh sửa cụ thể]

Yêu cầu:
- Không phá Admin localStorage prototype.
- Không thay screenshot tham khảo thành ảnh mặc định trên website.
- Kiểm tra Hero khi có và không có custom background.
- Giữ animation nhẹ, tránh giảm hiệu năng mobile.
- Cập nhật PLAN.md sau khi hoàn thành.
```

---

## UI revision 05 — Replay reveal, section motion systems & cinematic timeline

### Request received
- Hiệu ứng chữ phải chạy lại mỗi lần người dùng rời section rồi cuộn quay lại, không chỉ chạy một lần.
- Mỗi section cần có background animation tự chạy liên tục và phong cách chuyển động phải liên quan tới nội dung của section đó.
- Timeline cần có trải nghiệm cuộn ngang độc đáo, có chiều sâu và tạo điểm nhấn mạnh hơn.

### Completed in this revision

#### 1. Replay-on-scroll text and block reveal
- `Reveal.jsx` đổi `viewport.once` từ `true` thành `false`.
- `TextReveal.jsx` đổi `viewport.once` từ `true` thành `false`.
- Heading và content block tự trả về trạng thái ẩn khi rời viewport, sau đó chạy lại khi người dùng cuộn quay lại.
- Word reveal bổ sung một góc `rotateX` nhẹ để chữ có chiều sâu hơn nhưng không gây rối.
- Vẫn giữ hỗ trợ `prefers-reduced-motion` cho người dùng cần giảm chuyển động.

#### 2. Section-specific perpetual animated backgrounds
Đã thêm component dùng chung:

```text
src/components/SectionMotionBackground.jsx
```

Mỗi section có một motion system riêng và tất cả đều chạy `infinite`:
- **About:** bản đồ chiến lược, network nodes và route biến đổi hình dạng.
- **Milestones:** time tunnel, scanner và time ticks chuyển động.
- **Recognition:** vòng laurel, spotlight giải thưởng và số thứ tự trôi nhẹ.
- **Services:** các module giao diện nổi và data cursor tự chạy theo đường dẫn.
- **D-AI:** giữ TechGlobe hiện tại, bổ sung grid/orbit nền nhẹ để tăng chiều sâu.
- **Partners:** node network và tín hiệu lan truyền giữa các điểm.
- **Case Studies:** film strips, focus reticle và nhãn case chuyển động.
- **Our Team:** các node cộng tác quay quanh core DGM.
- **Process:** delivery route, step nodes và runner chạy qua lại.
- **Footer / Contact:** radar, scan sweep và contact pulse.

Các animation chỉ dùng `transform`, `opacity`, border và background-position ở mức vừa phải để hạn chế ảnh hưởng hiệu năng.

#### 3. Cinematic milestone timeline
`MilestoneRail.jsx` được nâng cấp thành timeline tương tác:
- Kéo ngang bằng chuột hoặc touch.
- Lăn chuột dọc khi con trỏ đang nằm trên timeline sẽ chuyển thành cuộn ngang; khi đến đầu/cuối thì trang tiếp tục cuộn bình thường.
- Card gần tâm viewport tự phóng lớn, sáng hơn và nổi lên theo khoảng cách.
- Card hai bên có perspective/rotate nhẹ để tạo cảm giác chiều sâu.
- Active chapter tự cập nhật theo vị trí cuộn.
- Có thanh progress, moving orb, số thứ tự chapter và title hiện tại.
- Có time portal ở giữa nền timeline.
- Có energy beam chạy liên tục dọc theo đường thời gian.
- Bấm vào một card sẽ tự căn card đó vào giữa timeline.
- Nút trái/phải và thanh scrollbar vẫn được giữ lại để dễ sử dụng.

### Files added
- `src/components/SectionMotionBackground.jsx`
- `src/styles/v5.css`

### Files updated
- `src/components/Reveal.jsx`
- `src/components/TextReveal.jsx`
- `src/components/MilestoneRail.jsx`
- `src/components/Footer.jsx`
- `src/pages/HomePage.jsx`
- `src/main.jsx`
- `PLAN.md`

### Validation performed
- Toàn bộ file JS/JSX trong `src` đã được TypeScript parser kiểm tra cú pháp thành công.
- Kiểm tra số cặp `{}`, `()` trong `index.css`, `v4.css`, `v5.css`: cân bằng.
- Xác nhận tất cả section public chính đã được gắn `SectionMotionBackground`.
- `npm install` chưa chạy được trong môi trường tạo artifact vì npm mirror nội bộ trả về 404 cho `@vitejs/plugin-react`; cần chạy build trên máy local.

### Next recommended prompt
```text
Đọc PLAN.md, tập trung phần “UI revision 05”.

Nhiệm vụ tiếp theo:
[Mô tả phần muốn chỉnh]

Yêu cầu:
- Giữ cơ chế reveal chạy lại mỗi lần section vào viewport.
- Không bỏ các section-specific background animation.
- Giữ timeline cinematic: center focus, progress HUD, wheel-to-horizontal và drag.
- Kiểm tra responsive desktop/tablet/mobile.
- Không dùng screenshot tham khảo làm background mặc định.
- Sau khi sửa phải cập nhật PLAN.md.
```
