import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  BarChart3,
  BriefcaseBusiness,
  Clock3,
  Edit3,
  Eye,
  Handshake,
  ImagePlus,
  Layers3,
  LogOut,
  Plus,
  RotateCcw,
  Save,
  Settings2,
  Trash2,
  Trophy,
  UsersRound,
  Workflow
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { CaseVisual } from '../components/CaseStudyCard'
import { authService } from '../services/authService'
import { contentRepository } from '../services/contentRepository'
import { groupPartnersByRow, PARTNER_ROW_COUNT } from '../utils/partnerRows'

const copyGroups = [
  {
    key: 'sectionLabels', title: 'Section headlines', description: 'Tên nhỏ ở góc trên trái giúp nhận biết từng session trên trang chủ.',
    fields: [
      ['about', 'About Us'], ['milestones', 'Timeline / Journey'], ['recognition', 'Recognition'],
      ['services', 'Services'], ['cases', 'Case Studies'], ['team', 'Our Team'],
      ['partners', 'Partners'], ['footer', 'Contact / Footer']
    ]
  },
  {
    key: 'ui', title: 'Navigation & interface labels', description: 'Tên menu và các nhãn hướng dẫn đang hiển thị trên trang chủ.',
    fields: [
      ['navAbout', 'Menu — About'], ['navJourney', 'Menu — Journey'], ['navRecognition', 'Menu — Recognition'],
      ['navServices', 'Menu — Services'], ['navCases', 'Menu — Case Studies'], ['navTeam', 'Menu — Team'],
      ['navPartners', 'Menu — Partners'], ['navContact', 'Menu — Contact'],
      ['pressSourcesLabel', 'Press sources label'], ['pressReadMore', 'Press read-more label'],
      ['allCasesLabel', 'All cases filter']
    ]
  },
  {
    key: 'about', title: 'About us / Newsroom', description: 'Tiêu đề và mô tả ngắn phía trên khu vực bài báo.',
    fields: [
      ['intro', 'About content', 'textarea']
    ]
  },
  {
    key: 'team', title: 'Team visual', description: 'Nhãn số lượng nhân sự. Logo ở tâm được quản lý trong Brand & Hero.',
    fields: [['peopleLabel', 'People count label']]
  },
  {
    key: 'contact', title: 'Footer', description: 'Dòng bản quyền và tên liên kết quản trị.',
    fields: [['copyrightText', 'Copyright text'], ['adminLinkLabel', 'Admin link label']]
  }
]

const collectionDefinitions = [
  {
    key: 'milestones', anchor: 'milestones', no: '03', title: 'Milestones', singular: 'milestone', icon: Clock3,
    description: 'Các cột mốc xuất hiện trong timeline dọc.', save: contentRepository.saveMilestones,
    empty: { id: '', year: '2026', title: '', text: '' },
    fields: [['year', 'Year'], ['title', 'Title'], ['text', 'Details', 'textarea']],
    meta: (item) => item.year, summary: (item) => item.text
  },
  {
    key: 'pressArticles', anchor: 'press-articles', no: '04', title: 'About Us — Press articles', singular: 'press article', icon: Trophy,
    description: 'Upload ảnh bài báo và logo tòa soạn. Các bài được tự động xếp nghiêng, chồng lớp ở About Us.', save: contentRepository.savePressArticles,
    empty: { id: '', year: '', title: '', source: '', subtitle: '', description: '', image: '', logo: '', url: '' },
    fields: [
      ['title', 'Article title (optional)', 'optional'], ['source', 'Publication / source (optional)', 'optional'], ['year', 'Year (optional)', 'optional'],
      ['description', 'Short description (optional)', 'textarea-optional'], ['image', 'Article image', 'image'],
      ['logo', 'Publication logo', 'image'], ['url', 'Full article URL (optional)', 'optional']
    ],
    meta: (item) => `${item.source || 'Press'} / ${item.year || ''}`, summary: (item) => item.description || item.subtitle
  },
  {
    key: 'recognitions', anchor: 'recognitions', no: '05', title: 'Recognition', singular: 'recognition', icon: Trophy,
    description: 'Giải thưởng, xếp hạng và ghi nhận chuyên môn.', save: contentRepository.saveRecognitions,
    empty: { id: '', year: '2026', title: '', subtitle: '', description: '', image: '' },
    fields: [['year', 'Year'], ['title', 'Recognition title'], ['subtitle', 'Subtitle'], ['description', 'Description', 'textarea'], ['image', 'Recognition image', 'image']],
    meta: (item) => item.year || 'Recognition', summary: (item) => item.subtitle || item.description
  },
  {
    key: 'services', anchor: 'services-admin', no: '06', title: 'Services', singular: 'service', icon: Layers3,
    description: 'Các năng lực và dịch vụ agency cung cấp.', save: contentRepository.saveServices,
    empty: { id: '', no: '01', title: '', text: '', tags: [] },
    fields: [['no', 'Number'], ['title', 'Service title'], ['text', 'Optional description', 'textarea-optional'], ['tags', 'Service items — separated by commas']],
    meta: (item) => `Service ${item.no}`, summary: (item) => item.text
  },
  {
    key: 'cases', anchor: 'cases', no: '07', title: 'Case studies', singular: 'case study', icon: BriefcaseBusiness,
    description: 'Dự án, hình ảnh, bài toán, giải pháp và kết quả. Ảnh thẻ đẹp nhất ở kích thước 1380 × 1000 px (tỷ lệ 1.38:1).', save: contentRepository.saveCaseStudies,
    empty: { id: '', slug: '', title: '', category: 'IMC', year: '2026', image: '', summary: '', objective: '', challenge: '', solution: '', result: '' },
    fields: [
      ['title', 'Title'], ['category', 'Category'], ['year', 'Year'], ['image', 'Case image', 'image', 'Khuyến nghị: 1380 × 1000 px (tỷ lệ 1.38:1). Đặt chủ thể và chữ quan trọng ở vùng giữa vì ảnh sẽ được crop theo khung thẻ.'],
      ['summary', 'Summary', 'textarea'], ['objective', 'Objective', 'textarea'], ['challenge', 'Challenge', 'textarea'],
      ['solution', 'Solution / Key work', 'textarea'], ['result', 'Results / Impact', 'textarea']
    ],
    meta: (item) => `${item.category} / ${item.year}`, summary: (item) => item.summary
  },
  {
    key: 'teamMembers', anchor: 'team-admin', no: '08', title: 'Team departments', singular: 'team department', icon: UsersRound,
    description: 'Các nhóm chuyên môn và quy mô nhân sự.', save: contentRepository.saveTeamMembers,
    empty: { id: '', role: '', count: '01', detail: '', tags: [] },
    fields: [['role', 'Department / role'], ['count', 'People count'], ['detail', 'Description', 'textarea'], ['tags', 'Expertise tags — separated by commas']],
    meta: (item) => `${item.count} people`, summary: (item) => item.detail
  },
  {
    key: 'partners', anchor: 'partners', no: '09', title: 'Partner logos', singular: 'partner', icon: Handshake,
    description: 'Platform, research partner và client logos.', save: contentRepository.savePartners,
    empty: { id: '', name: '', group: '', logo: '', row: 1 },
    fields: [['row', 'Display row', 'partner-row'], ['name', 'Name (optional)', 'optional'], ['group', 'Group (optional)', 'optional'], ['logo', 'Partner logo', 'image', 'Logo sẽ tự căn giữa và fit trọn vẹn vào cùng một khung, không crop và không kéo méo. Nên dùng PNG/WebP nền trong suốt, ít khoảng trắng quanh logo.']],
    meta: (item) => item.group || (item.logo ? 'Logo only' : 'Partner'), summary: (item) => item.logo ? 'Logo uploaded' : 'Text wordmark'
  }
]

function slugify(value) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function loadCollections() {
  return {
    milestones: contentRepository.getMilestones(),
    pressArticles: contentRepository.getPressArticles(),
    recognitions: contentRepository.getRecognitions(),
    services: contentRepository.getServices(),
    cases: contentRepository.getCaseStudies(),
    teamMembers: contentRepository.getTeamMembers(),
    partners: contentRepository.getPartners()
  }
}

export default function AdminPage() {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [settings, setSettings] = useState(contentRepository.getSiteSettings())
  const [pageContent, setPageContent] = useState(contentRepository.getPageContent())
  const [collections, setCollections] = useState(loadCollections)
  const [editing, setEditing] = useState(null)
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  const authenticated = Boolean(session)

  const activeDefinition = useMemo(
    () => collectionDefinitions.find((definition) => definition.key === editing?.type),
    [editing]
  )

  useEffect(() => {
    let active = true
    authService.getSession()
      .then((currentSession) => { if (active) setSession(currentSession) })
      .catch((error) => { if (active) setStatus(error.message) })
      .finally(() => { if (active) setAuthLoading(false) })
    const unsubscribe = authService.onAuthStateChange((currentSession) => {
      if (active) {
        setSession(currentSession)
        setAuthLoading(false)
      }
    })
    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!authenticated) return
    contentRepository.loadAll()
      .then(() => {
        setSettings(contentRepository.getSiteSettings())
        setPageContent(contentRepository.getPageContent())
        setCollections(loadCollections())
      })
      .catch((error) => setStatus(`Không thể tải dữ liệu: ${error.message}`))
  }, [authenticated])

  async function login(event) {
    event.preventDefault()
    setSaving(true)
    try {
      const adminSession = await authService.signIn(email, password)
      setSession(adminSession)
      setPassword('')
      setStatus('')
    } catch (error) {
      setStatus(error.message)
    } finally {
      setSaving(false)
    }
  }

  async function readImage(event, onReady) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return setStatus('Vui lòng chọn đúng file hình ảnh.')
    const maxSize = file.type === 'image/gif' ? 20 : 8
    if (file.size > maxSize * 1024 * 1024) return setStatus(`Ảnh tải lên cần nhỏ hơn ${maxSize} MB.`)

    setSaving(true)
    setStatus('Đang tối ưu và tải ảnh lên Supabase Storage...')
    const objectUrl = URL.createObjectURL(file)
    try {
      const optimizedFile = file.type === 'image/gif' ? file : await new Promise((resolve, reject) => {
        const image = new Image()
        image.onload = () => {
          const maxSide = 1800
          const scale = Math.min(1, maxSide / Math.max(image.width, image.height))
          const canvas = document.createElement('canvas')
          canvas.width = Math.max(1, Math.round(image.width * scale))
          canvas.height = Math.max(1, Math.round(image.height * scale))
          canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
          canvas.toBlob((blob) => {
            if (!blob) return reject(new Error('Không thể tối ưu file ảnh.'))
            resolve(new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.webp`, { type: 'image/webp' }))
          }, 'image/webp', .84)
        }
        image.onerror = () => reject(new Error('Không đọc được file ảnh.'))
        image.src = objectUrl
      })
      const publicUrl = await contentRepository.uploadImage(optimizedFile)
      onReady(publicUrl)
      setStatus('Đã tải ảnh lên Supabase Storage.')
    } catch (error) {
      setStatus(`Không thể tải ảnh: ${error.message}`)
    } finally {
      URL.revokeObjectURL(objectUrl)
      event.target.value = ''
      setSaving(false)
    }
  }

  async function saveSettings(event) {
    event.preventDefault()
    setSaving(true)
    try {
      await contentRepository.saveSiteSettings(settings)
      setStatus('Đã lưu nhận diện, Hero và thông tin footer lên Supabase.')
    } catch (error) {
      setStatus(`Không thể lưu: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function savePageCopy(event) {
    event.preventDefault()
    setSaving(true)
    try {
      await contentRepository.savePageContent(pageContent)
      setStatus('Đã lưu nội dung tiêu đề và mô tả của toàn bộ trang chủ lên Supabase.')
    } catch (error) {
      setStatus(`Không thể lưu: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  function updatePageField(section, field, value) {
    setPageContent((current) => ({
      ...current,
      [section]: { ...current[section], [field]: value }
    }))
  }

  function updateStat(index, field, value) {
    const stats = settings.stats.map((stat, statIndex) => statIndex === index ? { ...stat, [field]: value } : stat)
    setSettings({ ...settings, stats })
  }

  function openEditor(definition, item) {
    setEditing({ type: definition.key, item: { ...(item || definition.empty) } })
  }

  function updateEditing(field, value) {
    setEditing((current) => ({ ...current, item: { ...current.item, [field]: value } }))
  }

  async function saveCollection(event) {
    event.preventDefault()
    const definition = activeDefinition
    if (!definition) return
    let item = { ...editing.item, id: editing.item.id || crypto.randomUUID() }
    if (definition.key === 'services' || definition.key === 'teamMembers') {
      item.tags = Array.isArray(item.tags)
        ? item.tags
        : String(item.tags).split(',').map((tag) => tag.trim()).filter(Boolean)
    }
    if (definition.key === 'cases') item.slug = item.slug || slugify(item.title)

    const current = collections[definition.key]
    let next = current.some((entry) => entry.id === item.id)
      ? current.map((entry) => entry.id === item.id ? item : entry)
      : [...current, item]
    if (definition.key === 'partners') next = groupPartnersByRow(next).flat()
    setSaving(true)
    try {
      await definition.save(next)
      setCollections((value) => ({ ...value, [definition.key]: next }))
      setEditing(null)
      setStatus(`Đã lưu ${definition.singular} lên Supabase.`)
    } catch (error) {
      setStatus(`Không thể lưu: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function removeCollectionItem(definition, id) {
    if (!window.confirm(`Xóa ${definition.singular} này?`)) return
    let next = collections[definition.key].filter((item) => item.id !== id)
    if (definition.key === 'partners') next = groupPartnersByRow(next).flat()
    setSaving(true)
    try {
      await definition.save(next)
      setCollections((value) => ({ ...value, [definition.key]: next }))
      setStatus(`Đã xóa ${definition.singular}.`)
    } catch (error) {
      setStatus(`Không thể xóa: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function restoreDefaultContent() {
    if (!window.confirm('Khôi phục nội dung mặc định? Các thay đổi hiện tại sẽ bị xóa.')) return
    setSaving(true)
    try {
      await contentRepository.reset()
      setSettings(contentRepository.getSiteSettings())
      setPageContent(contentRepository.getPageContent())
      setCollections(loadCollections())
      setStatus('Đã khôi phục nội dung mặc định trên Supabase.')
    } catch (error) {
      setStatus(`Không thể khôi phục: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (authLoading) {
    return <main className="admin-login admin-login--refresh"><div className="admin-login-panel"><p className="eyebrow">DGM Content Studio</p><h1>Đang xác thực...</h1></div></main>
  }

  if (!authenticated) {
    return (
      <main className="admin-login admin-login--refresh">
        <div className="admin-login-panel">
          <Link to="/" className="back-link"><ArrowLeft size={17} /> Về website</Link>
          <div className="admin-login-mark"><span>DGM</span><i /></div>
          <p className="eyebrow">DGM Content Studio</p>
          <h1>Welcome back.</h1>
          <p>Đăng nhập bằng tài khoản đã được tạo trong Supabase Authentication.</p>
          <form onSubmit={login}>
            <label>Email<input type="email" required autoComplete="username" placeholder="admin@example.com" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
            <label>Mật khẩu<input type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
            <button className="button button-primary" type="submit" disabled={saving || !authService.isConfigured}>{saving ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
            {!authService.isConfigured && <span className="form-status">Chưa có cấu hình Supabase trong .env.local.</span>}
            {status && <span className="form-status">{status}</span>}
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="admin-shell admin-shell--refresh">
      <aside className="admin-sidebar">
        <Link to="/" className="brand-mark"><span>DGM</span><i /></Link>
        <div className="admin-sidebar-label">Content studio</div>
        <nav>
          <a href="#overview"><BarChart3 /> Overview</a>
          <a href="#general"><Settings2 /> Brand & Hero</a>
          <a href="#page-copy"><Edit3 /> Page copy</a>
          {collectionDefinitions.map((definition) => {
            const Icon = definition.icon
            return <a href={`#${definition.anchor}`} key={definition.key}><Icon /> {definition.title}</a>
          })}
          <Link to="/"><Eye /> Preview website</Link>
        </nav>
        <div className="admin-sidebar-account">{session.user.email}</div>
        <button onClick={async () => { await authService.signOut(); setSession(null) }}><LogOut /> Logout</button>
      </aside>

      <div className="admin-main">
        <header id="overview">
          <div><p className="eyebrow">Content management</p><h1>DGM Content Studio</h1><p>Manage every story, capability and proof point on the homepage.</p></div>
          <Link className="admin-preview-link" to="/"><Eye /> Live preview</Link>
        </header>
        {status && <div className="admin-status">{status}</div>}

        <div className="admin-overview-grid">
          <div><span>Content modules</span><strong>{collectionDefinitions.length + copyGroups.length}</strong><small>Editable sections</small></div>
          <div><span>Published items</span><strong>{Object.values(collections).reduce((total, items) => total + items.length, 0)}</strong><small>Across all collections</small></div>
          <div><span>Content status</span><strong>Ready</strong><small>Website content is available</small></div>
        </div>

        <section id="general" className="admin-panel">
          <PanelTitle no="01" title="Brand, Hero & Footer" description="Toàn bộ text, hình ảnh nhận diện, Hero và thông tin liên hệ trên trang chủ." />
          <form className="admin-form" onSubmit={saveSettings}>
            <label>Company name<input value={settings.companyName} onChange={(event) => setSettings({ ...settings, companyName: event.target.value })} /></label>
            <ImageEditor label="Header logo" value={settings.companyLogo || ''} onChange={(value) => setSettings({ ...settings, companyLogo: value })} onUpload={(event) => readImage(event, (value) => setSettings({ ...settings, companyLogo: value }))} />
            <ImageEditor label="Our Team center logo" note="Khuyến nghị: logo PNG/WebP nền trong suốt, tỷ lệ ngang hoặc vuông, tối thiểu 400 px." value={settings.teamLogo || ''} onChange={(value) => setSettings({ ...settings, teamLogo: value })} onUpload={(event) => readImage(event, (value) => setSettings({ ...settings, teamLogo: value }))} />
            <ImageEditor label="Hero background" value={settings.heroBackground} onChange={(value) => setSettings({ ...settings, heroBackground: value })} onUpload={(event) => readImage(event, (value) => setSettings({ ...settings, heroBackground: value }))} />
            <label>Background position<input value={settings.heroBackgroundPosition} onChange={(event) => setSettings({ ...settings, heroBackgroundPosition: event.target.value })} /></label>
            <div className="admin-form-divider full"><span>Hero copy</span></div>
            <label>Eyebrow<input value={settings.eyebrow || ''} onChange={(event) => setSettings({ ...settings, eyebrow: event.target.value })} /></label>
            <label>Primary title<input value={settings.heroTitle || ''} onChange={(event) => setSettings({ ...settings, heroTitle: event.target.value })} /></label>
            <label>Secondary title<input value={settings.heroSecondTitle || ''} onChange={(event) => setSettings({ ...settings, heroSecondTitle: event.target.value })} /></label>
            <label>Description<input value={settings.heroDescription || ''} onChange={(event) => setSettings({ ...settings, heroDescription: event.target.value })} /></label>

            <div className="admin-form-divider full"><span>Contact & social</span></div>
            <label>Email<input value={settings.contactEmail} onChange={(event) => setSettings({ ...settings, contactEmail: event.target.value })} /></label>
            <label>Hotline<input value={settings.hotline} onChange={(event) => setSettings({ ...settings, hotline: event.target.value })} /></label>
            <label className="full">Address<input value={settings.address} onChange={(event) => setSettings({ ...settings, address: event.target.value })} /></label>
            <label>Footer tagline<input value={settings.footerTagline} onChange={(event) => setSettings({ ...settings, footerTagline: event.target.value })} /></label>
            <label>LinkedIn URL<input value={settings.linkedinUrl} onChange={(event) => setSettings({ ...settings, linkedinUrl: event.target.value })} /></label>
            <label>Facebook URL<input value={settings.facebookUrl} onChange={(event) => setSettings({ ...settings, facebookUrl: event.target.value })} /></label>
            <label>YouTube URL<input value={settings.youtubeUrl} onChange={(event) => setSettings({ ...settings, youtubeUrl: event.target.value })} /></label>
            <button className="button button-dark" type="submit"><Save /> Save brand settings</button>
          </form>
        </section>

        <section id="page-copy" className="admin-panel">
          <PanelTitle no="02" title="Homepage copy" description="Sửa toàn bộ tiêu đề và mô tả đang hiển thị trên trang chủ." />
          <form className="admin-copy-editor" onSubmit={savePageCopy}>
            {copyGroups.map((group, index) => (
              <details className="admin-copy-group" key={group.key} open={index === 0}>
                <summary><div><span>{String(index + 1).padStart(2, '0')}</span><strong>{group.title}</strong></div><small>{group.description}</small></summary>
                <div className="admin-form">
                  {group.fields.map(([field, label, type]) => (
                    <label className={type === 'textarea' ? 'full' : ''} key={field}>
                      {label}
                      {type === 'textarea'
                        ? <textarea rows="3" value={pageContent[group.key][field]} onChange={(event) => updatePageField(group.key, field, event.target.value)} />
                        : <input value={pageContent[group.key][field]} onChange={(event) => updatePageField(group.key, field, event.target.value)} />}
                    </label>
                  ))}
                </div>
              </details>
            ))}
            <button className="button button-dark" type="submit"><Save /> Save all page copy</button>
          </form>
        </section>

        {collectionDefinitions.map((definition) => (
          <CollectionSection
            key={definition.key}
            definition={definition}
            items={collections[definition.key]}
            onAdd={(row) => openEditor(definition, row ? { ...definition.empty, row } : undefined)}
            onEdit={(item) => openEditor(definition, item)}
            onRemove={(id) => removeCollectionItem(definition, id)}
          />
        ))}

        <button className="reset-button" onClick={restoreDefaultContent}><RotateCcw /> Restore default content</button>
      </div>

      {editing && activeDefinition && (
        <div className="modal-backdrop" onMouseDown={() => setEditing(null)}>
          <form className="content-modal" onSubmit={saveCollection} onMouseDown={(event) => event.stopPropagation()}>
            <ModalTitle eyebrow={`${activeDefinition.title} editor`} title={`${editing.item.id ? 'Edit' : 'Add'} ${activeDefinition.singular}`} onClose={() => setEditing(null)} />
            <div className="admin-form">
              {activeDefinition.fields.map(([field, label, type, note]) => {
                const value = Array.isArray(editing.item[field]) ? editing.item[field].join(', ') : (editing.item[field] ?? '')
                if (type === 'image') {
                  return <ImageEditor key={field} label={label} note={note} value={value} onChange={(next) => updateEditing(field, next)} onUpload={(event) => readImage(event, (next) => updateEditing(field, next))} />
                }
                if (type === 'partner-row') {
                  return (
                    <label key={field}>
                      {label}
                      <select value={value} onChange={(event) => updateEditing(field, Number(event.target.value))}>
                        {Array.from({ length: PARTNER_ROW_COUNT }, (_, index) => <option value={index + 1} key={index + 1}>Dòng logo {index + 1}</option>)}
                      </select>
                    </label>
                  )
                }
                const isTextarea = type === 'textarea' || type === 'textarea-optional'
                const isOptional = type === 'optional' || type === 'textarea-optional'
                return (
                  <label className={isTextarea ? 'full' : ''} key={field}>
                    {label}
                    {isTextarea
                      ? <textarea required={!isOptional} rows="3" value={value} onChange={(event) => updateEditing(field, event.target.value)} />
                      : <input required={!isOptional} value={value} onChange={(event) => updateEditing(field, event.target.value)} />}
                  </label>
                )
              })}
            </div>
            <button className="button button-primary" type="submit"><Save /> Save {activeDefinition.singular}</button>
          </form>
        </div>
      )}
    </main>
  )
}

function PanelTitle({ no, title, description, action }) {
  return <div className="admin-panel-title"><div><span>{no}</span><h2>{title}</h2></div>{action || <p>{description}</p>}</div>
}

function CollectionSection({ definition, items, onAdd, onEdit, onRemove }) {
  const Icon = definition.icon
  if (definition.key === 'partners') {
    return <PartnerCollectionSection definition={definition} items={items} onAdd={onAdd} onEdit={onEdit} onRemove={onRemove} />
  }

  return (
    <section id={definition.anchor} className="admin-panel admin-collection-panel">
      <PanelTitle
        no={definition.no}
        title={definition.title}
        action={<button type="button" className="button button-dark" onClick={onAdd}><Plus /> Add {definition.singular}</button>}
      />
      <p className="admin-panel-description">{definition.description}</p>
      <div className="admin-content-list">
        {items.map((item) => (
          <article key={item.id}>
            <CollectionPreview type={definition.key} item={item} icon={Icon} />
            <div><span>{definition.meta(item)}</span><h3>{item.title || item.name || item.role}</h3><p>{definition.summary(item)}</p></div>
            <div className="row-actions"><button type="button" onClick={() => onEdit(item)} aria-label={`Sửa ${definition.singular}`}><Edit3 /></button><button type="button" onClick={() => onRemove(item.id)} aria-label={`Xóa ${definition.singular}`}><Trash2 /></button></div>
          </article>
        ))}
        {!items.length && <div className="admin-empty-state"><Icon /><p>Chưa có nội dung. Hãy thêm {definition.singular} đầu tiên.</p></div>}
      </div>
    </section>
  )
}

function PartnerCollectionSection({ definition, items, onAdd, onEdit, onRemove }) {
  const rows = groupPartnersByRow(items)

  return (
    <section id={definition.anchor} className="admin-panel admin-collection-panel">
      <PanelTitle no={definition.no} title={definition.title} description={definition.description} />
      <p className="admin-panel-description">Mỗi dòng logo là một danh sách độc lập trên website.</p>
      <div className="partner-admin-rows">
        {rows.map((rowItems, index) => {
          const row = index + 1
          return (
            <div className="partner-admin-row" key={row}>
              <div className="partner-admin-row__header">
                <div><span>ROW {String(row).padStart(2, '0')}</span><h3>Dòng logo {row}</h3><small>{rowItems.length} logo</small></div>
                <button type="button" className="button button-dark" onClick={() => onAdd(row)}><Plus /> Thêm logo vào dòng {row}</button>
              </div>
              <div className="admin-content-list">
                {rowItems.map((item) => (
                  <article key={item.id}>
                    <CollectionPreview type={definition.key} item={item} icon={definition.icon} />
                    <div><span>{definition.meta(item)}</span><h3>{item.name || 'Logo không có chữ'}</h3><p>{definition.summary(item)}</p></div>
                    <div className="row-actions"><button type="button" onClick={() => onEdit(item)} aria-label={`Sửa ${definition.singular}`}><Edit3 /></button><button type="button" onClick={() => onRemove(item.id)} aria-label={`Xóa ${definition.singular}`}><Trash2 /></button></div>
                  </article>
                ))}
                {!rowItems.length && <div className="admin-empty-state"><Handshake /><p>Dòng {row} chưa có logo.</p></div>}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function CollectionPreview({ type, item, icon: Icon }) {
  if (type === 'cases') return <div className="admin-preview"><CaseVisual item={item} compact /></div>
  if (type === 'pressArticles') return <div className="admin-preview admin-preview--recognition">{item.image ? <img src={item.image} alt="" /> : item.logo ? <img src={item.logo} alt="" /> : <strong>{item.year}</strong>}</div>
  if (type === 'recognitions') return <div className="admin-preview admin-preview--recognition">{item.image ? <img src={item.image} alt="" /> : <strong>{item.year}</strong>}</div>
  if (type === 'partners') return <div className="admin-preview admin-preview--logo">{item.logo ? <img src={item.logo} alt="" /> : <strong>{item.name}</strong>}</div>
  return <div className="admin-preview admin-preview--module"><Icon /><strong>{item.no || item.year || item.count}</strong></div>
}

function ModalTitle({ eyebrow, title, onClose }) {
  return <div className="modal-title"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div><button type="button" onClick={onClose}>×</button></div>
}

function ImageEditor({ label, note, value, onChange, onUpload }) {
  return (
    <div className="image-editor full">
      <label>
        {label} URL / path
        <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Dán URL hoặc tải ảnh từ máy" />
        {note && <small className="image-editor-note">{note}</small>}
      </label>
      <label className="upload-button"><ImagePlus /> Upload image / GIF<input type="file" accept="image/*,.gif" onChange={onUpload} /></label>
      {value && <div className="image-editor-preview"><img src={value} alt="Preview" /><button type="button" onClick={() => onChange('')}>Remove image</button></div>}
    </div>
  )
}
