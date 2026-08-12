import { useMemo, useState } from 'react'
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
import { contentRepository } from '../services/contentRepository'

const copyGroups = [
  {
    key: 'about', title: 'About us', description: 'Thông điệp giới thiệu và bốn giá trị nổi bật.',
    fields: [
      ['eyebrow', 'Eyebrow'], ['titleBefore', 'Title — opening'], ['titleHighlight', 'Title — highlight'],
      ['titleAfter', 'Title — ending'], ['intro', 'Introduction', 'textarea'],
      ['featureOne', 'Feature 01'], ['featureTwo', 'Feature 02'], ['featureThree', 'Feature 03'],
      ['featureFour', 'Feature 04']
    ]
  },
  {
    key: 'milestones', title: 'Milestones', description: 'Heading phía trên timeline.',
    fields: [['eyebrow', 'Eyebrow'], ['title', 'Title']]
  },
  {
    key: 'recognition', title: 'Recognition', description: 'Heading phía trên gallery ảnh bài báo.',
    fields: [['eyebrow', 'Eyebrow'], ['title', 'Title'], ['intro', 'Introduction', 'textarea']]
  },
  {
    key: 'services', title: 'Services', description: 'Thông điệp mở đầu phần năng lực.',
    fields: [['eyebrow', 'Eyebrow'], ['titleBefore', 'Title — opening'], ['titleHighlight', 'Title — highlight']]
  },
  {
    key: 'data', title: 'Data Hub', description: 'Nội dung giới thiệu nền tảng dữ liệu.',
    fields: [['eyebrow', 'Eyebrow'], ['titleBefore', 'Title — opening'], ['titleHighlight', 'Title — highlight'], ['intro', 'Introduction', 'textarea'], ['consoleLabel', 'Console label']]
  },
  {
    key: 'partners', title: 'Partners & clients', description: 'Heading phía trên logo đối tác.',
    fields: [['eyebrow', 'Eyebrow'], ['title', 'Title']]
  },
  {
    key: 'team', title: 'Our team', description: 'Toàn bộ thông điệp của phần đội ngũ.',
    fields: [
      ['chapterLabel', 'Chapter label'], ['eyebrow', 'Eyebrow'], ['kicker', 'Kicker'], ['titleBefore', 'Title — opening'],
      ['titleHighlight', 'Title — highlight'], ['intro', 'Introduction', 'textarea'],
      ['collectiveEyebrow', 'Collective eyebrow'], ['collectiveTitle', 'Collective title'],
      ['collectiveIntro', 'Collective introduction', 'textarea'],
      ['talentLabel', 'Talent statistic label'], ['teamCountLabel', 'Team count label'],
      ['ambitionValue', 'Ambition statistic value'], ['ambitionLabel', 'Ambition statistic label'],
      ['coreName', 'Network center name'], ['coreLabel', 'Network center label']
    ]
  },
  {
    key: 'process', title: 'Process', description: 'Heading của phần quy trình.',
    fields: [['eyebrow', 'Eyebrow'], ['title', 'Title']]
  },
  {
    key: 'contact', title: 'Contact & footer', description: 'Heading và nội dung biểu mẫu liên hệ.',
    fields: [
      ['eyebrow', 'Eyebrow'], ['titleBefore', 'Title — opening'], ['titleHighlight', 'Title — highlight'],
      ['formLabel', 'Form section label'], ['formIntro', 'Form introduction', 'textarea'],
      ['nameLabel', 'Name field label'], ['namePlaceholder', 'Name placeholder'],
      ['emailLabel', 'Email field label'], ['emailPlaceholder', 'Email placeholder'],
      ['companyLabel', 'Company field label'], ['companyPlaceholder', 'Company placeholder'],
      ['phoneLabel', 'Phone field label'], ['phonePlaceholder', 'Phone placeholder'],
      ['messageLabel', 'Message field label'], ['messagePlaceholder', 'Message placeholder'],
      ['submitLabel', 'Submit button'], ['successMessage', 'Success message', 'textarea'],
      ['mailSubject', 'Email subject'], ['mapLabel', 'Map label'],
      ['emailDetailLabel', 'Email detail label'], ['hotlineDetailLabel', 'Hotline detail label'],
      ['officeDetailLabel', 'Office detail label'], ['copyrightText', 'Copyright text'],
      ['adminLinkLabel', 'Admin link label']
    ]
  }
]

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@dgm.vn'
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'dgm2026'
const ADMIN_SESSION_KEY = 'dgm_admin_session'

const collectionDefinitions = [
  {
    key: 'milestones', anchor: 'milestones', no: '03', title: 'Milestones', singular: 'milestone', icon: Clock3,
    description: 'Các cột mốc xuất hiện trong timeline dọc.', save: contentRepository.saveMilestones,
    empty: { id: '', year: '2026', title: '', text: '' },
    fields: [['year', 'Year'], ['title', 'Title'], ['text', 'Details', 'textarea']],
    meta: (item) => item.year, summary: (item) => item.text
  },
  {
    key: 'recognitions', anchor: 'recognitions', no: '04', title: 'Recognition', singular: 'recognition', icon: Trophy,
    description: 'Upload ảnh chụp các bài báo hoặc press coverage. Website sẽ tự xếp ảnh thành gallery.', save: contentRepository.saveRecognitions,
    empty: { id: '', title: 'Press coverage', image: '' },
    fields: [['title', 'Image title / alt text'], ['image', 'Press article image', 'image']],
    meta: () => 'Press image', summary: (item) => item.image ? 'Published image' : 'Image required'
  },
  {
    key: 'services', anchor: 'services-admin', no: '05', title: 'Services', singular: 'service', icon: Layers3,
    description: 'Các năng lực và dịch vụ agency cung cấp.', save: contentRepository.saveServices,
    empty: { id: '', no: '01', title: '', text: '', tags: [] },
    fields: [['no', 'Number'], ['title', 'Service title'], ['text', 'Description', 'textarea'], ['tags', 'Tags — separated by commas']],
    meta: (item) => `Service ${item.no}`, summary: (item) => item.text
  },
  {
    key: 'partners', anchor: 'partners', no: '06', title: 'Partner logos', singular: 'partner', icon: Handshake,
    description: 'Platform, research partner và client logos.', save: contentRepository.savePartners,
    empty: { id: '', name: '', group: 'Partner', logo: '' },
    fields: [['name', 'Name'], ['group', 'Group'], ['logo', 'Partner logo', 'image']],
    meta: (item) => item.group, summary: (item) => item.logo ? 'Logo uploaded' : 'Text wordmark'
  },
  {
    key: 'cases', anchor: 'cases', no: '07', title: 'Case studies', singular: 'case study', icon: BriefcaseBusiness,
    description: 'Dự án, hình ảnh, bài toán, giải pháp và kết quả.', save: contentRepository.saveCaseStudies,
    empty: { id: '', slug: '', title: '', category: 'IMC', year: '2026', image: '', summary: '', objective: '', challenge: '', solution: '', result: '' },
    fields: [
      ['title', 'Title'], ['category', 'Category'], ['year', 'Year'], ['image', 'Case image', 'image'],
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
    key: 'processSteps', anchor: 'process-admin', no: '09', title: 'Process steps', singular: 'process step', icon: Workflow,
    description: 'Các bước trong quy trình làm việc.', save: contentRepository.saveProcessSteps,
    empty: { id: '', no: '01', title: '', text: '' },
    fields: [['no', 'Number'], ['title', 'Step title'], ['text', 'Description', 'textarea']],
    meta: (item) => `Step ${item.no}`, summary: (item) => item.text
  }
]

function slugify(value) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function loadCollections() {
  return {
    milestones: contentRepository.getMilestones(),
    recognitions: contentRepository.getRecognitions(),
    services: contentRepository.getServices(),
    partners: contentRepository.getPartners(),
    cases: contentRepository.getCaseStudies(),
    teamMembers: contentRepository.getTeamMembers(),
    processSteps: contentRepository.getProcessSteps()
  }
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(sessionStorage.getItem(ADMIN_SESSION_KEY) === '1')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [settings, setSettings] = useState(contentRepository.getSiteSettings())
  const [pageContent, setPageContent] = useState(contentRepository.getPageContent())
  const [collections, setCollections] = useState(loadCollections)
  const [editing, setEditing] = useState(null)
  const [status, setStatus] = useState('')

  const activeDefinition = useMemo(
    () => collectionDefinitions.find((definition) => definition.key === editing?.type),
    [editing]
  )

  function login(event) {
    event.preventDefault()
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, '1')
      setAuthenticated(true)
      setStatus('')
    } else setStatus('Email hoặc mật khẩu không đúng.')
  }

  function readImage(event, onReady) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return setStatus('Vui lòng chọn đúng file hình ảnh.')
    if (file.size > 8 * 1024 * 1024) return setStatus('Ảnh tải lên cần nhỏ hơn 8 MB.')
    const reader = new FileReader()
    reader.onload = () => {
      const image = new Image()
      image.onload = () => {
        const maxSide = 1800
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(image.width * scale))
        canvas.height = Math.max(1, Math.round(image.height * scale))
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
        onReady(canvas.toDataURL('image/webp', .84))
      }
      image.onerror = () => setStatus('Không đọc được file ảnh.')
      image.src = String(reader.result)
    }
    reader.onerror = () => setStatus('Không đọc được file ảnh.')
    reader.readAsDataURL(file)
  }

  function saveSettings(event) {
    event.preventDefault()
    contentRepository.saveSiteSettings(settings)
    setStatus('Đã lưu Hero, Data Hub và thông tin liên hệ.')
  }

  function savePageCopy(event) {
    event.preventDefault()
    contentRepository.savePageContent(pageContent)
    setStatus('Đã lưu nội dung tiêu đề và mô tả của toàn bộ trang chủ.')
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

  function saveCollection(event) {
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
    const next = current.some((entry) => entry.id === item.id)
      ? current.map((entry) => entry.id === item.id ? item : entry)
      : [...current, item]
    setCollections((value) => ({ ...value, [definition.key]: next }))
    definition.save(next)
    setEditing(null)
    setStatus(`Đã lưu ${definition.singular}.`)
  }

  function removeCollectionItem(definition, id) {
    if (!window.confirm(`Xóa ${definition.singular} này?`)) return
    const next = collections[definition.key].filter((item) => item.id !== id)
    setCollections((value) => ({ ...value, [definition.key]: next }))
    definition.save(next)
    setStatus(`Đã xóa ${definition.singular}.`)
  }

  function restoreDefaultContent() {
    if (!window.confirm('Khôi phục nội dung mặc định? Các thay đổi hiện tại sẽ bị xóa.')) return
    contentRepository.reset()
    setSettings(contentRepository.getSiteSettings())
    setPageContent(contentRepository.getPageContent())
    setCollections(loadCollections())
    setStatus('Đã khôi phục nội dung mặc định.')
  }

  if (!authenticated) {
    return (
      <main className="admin-login admin-login--refresh">
        <div className="admin-login-panel">
          <Link to="/" className="back-link"><ArrowLeft size={17} /> Về website</Link>
          <div className="admin-login-mark"><span>DGM</span><i /></div>
          <p className="eyebrow">DGM Content Studio</p>
          <h1>Welcome back.</h1>
          <p>Quản lý toàn bộ nội dung credential website trong một workspace.</p>
          <form onSubmit={login}>
            <label>Email<input value={email} onChange={(event) => setEmail(event.target.value)} /></label>
            <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
            <button className="button button-primary" type="submit">Enter content studio</button>
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
        <button onClick={() => { sessionStorage.removeItem(ADMIN_SESSION_KEY); setAuthenticated(false) }}><LogOut /> Logout</button>
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
          <PanelTitle no="01" title="Brand, Hero & Contact" description="Nhận diện, hero, chỉ số Data Hub, liên hệ và social links." />
          <form className="admin-form" onSubmit={saveSettings}>
            <label>Company name<input value={settings.companyName} onChange={(event) => setSettings({ ...settings, companyName: event.target.value })} /></label>
            <ImageEditor label="Header logo" value={settings.companyLogo || ''} onChange={(value) => setSettings({ ...settings, companyLogo: value })} onUpload={(event) => readImage(event, (value) => setSettings({ ...settings, companyLogo: value }))} />
            <ImageEditor label="Hero background" value={settings.heroBackground} onChange={(value) => setSettings({ ...settings, heroBackground: value })} onUpload={(event) => readImage(event, (value) => setSettings({ ...settings, heroBackground: value }))} />
            <label>Background position<input value={settings.heroBackgroundPosition} onChange={(event) => setSettings({ ...settings, heroBackgroundPosition: event.target.value })} /></label>
            <div className="admin-form-divider full"><span>Data Hub statistics</span></div>
            {settings.stats.map((stat, index) => (
              <div className="admin-stat-row full" key={index}>
                <label>Value {index + 1}<input value={stat.value} onChange={(event) => updateStat(index, 'value', event.target.value)} /></label>
                <label>Label {index + 1}<input value={stat.label} onChange={(event) => updateStat(index, 'label', event.target.value)} /></label>
              </div>
            ))}

            <div className="admin-form-divider full"><span>Contact & social</span></div>
            <label>Email<input value={settings.contactEmail} onChange={(event) => setSettings({ ...settings, contactEmail: event.target.value })} /></label>
            <label>Hotline<input value={settings.hotline} onChange={(event) => setSettings({ ...settings, hotline: event.target.value })} /></label>
            <label className="full">Address<input value={settings.address} onChange={(event) => setSettings({ ...settings, address: event.target.value })} /></label>
            <label className="full">Google Maps embed URL<input value={settings.mapEmbedUrl} onChange={(event) => setSettings({ ...settings, mapEmbedUrl: event.target.value })} /></label>
            <label>Footer tagline<input value={settings.footerTagline} onChange={(event) => setSettings({ ...settings, footerTagline: event.target.value })} /></label>
            <label>LinkedIn URL<input value={settings.linkedinUrl} onChange={(event) => setSettings({ ...settings, linkedinUrl: event.target.value })} /></label>
            <label>Facebook URL<input value={settings.facebookUrl} onChange={(event) => setSettings({ ...settings, facebookUrl: event.target.value })} /></label>
            <label>YouTube URL<input value={settings.youtubeUrl} onChange={(event) => setSettings({ ...settings, youtubeUrl: event.target.value })} /></label>
            <button className="button button-dark" type="submit"><Save /> Save brand settings</button>
          </form>
        </section>

        <section id="page-copy" className="admin-panel">
          <PanelTitle no="02" title="Homepage copy" description="Sửa tiêu đề, mô tả và CTA của tất cả các section." />
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
            onAdd={() => openEditor(definition)}
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
              {activeDefinition.fields.map(([field, label, type]) => {
                const value = Array.isArray(editing.item[field]) ? editing.item[field].join(', ') : (editing.item[field] ?? '')
                if (type === 'image') {
                  return <ImageEditor key={field} label={label} value={value} onChange={(next) => updateEditing(field, next)} onUpload={(event) => readImage(event, (next) => updateEditing(field, next))} />
                }
                return (
                  <label className={type === 'textarea' ? 'full' : ''} key={field}>
                    {label}
                    {type === 'textarea'
                      ? <textarea required rows="3" value={value} onChange={(event) => updateEditing(field, event.target.value)} />
                      : <input required value={value} onChange={(event) => updateEditing(field, event.target.value)} />}
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

function CollectionPreview({ type, item, icon: Icon }) {
  if (type === 'cases') return <div className="admin-preview"><CaseVisual item={item} compact /></div>
  if (type === 'recognitions') return <div className="admin-preview admin-preview--recognition">{item.image ? <img src={item.image} alt="" /> : <strong>{item.year}</strong>}</div>
  if (type === 'partners') return <div className="admin-preview admin-preview--logo">{item.logo ? <img src={item.logo} alt="" /> : <strong>{item.name}</strong>}</div>
  return <div className="admin-preview admin-preview--module"><Icon /><strong>{item.no || item.year || item.count}</strong></div>
}

function ModalTitle({ eyebrow, title, onClose }) {
  return <div className="modal-title"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div><button type="button" onClick={onClose}>×</button></div>
}

function ImageEditor({ label, value, onChange, onUpload }) {
  return (
    <div className="image-editor full">
      <label>{label} URL / path<input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Dán URL hoặc tải ảnh từ máy" /></label>
      <label className="upload-button"><ImagePlus /> Upload image<input type="file" accept="image/*" onChange={onUpload} /></label>
      {value && <div className="image-editor-preview"><img src={value} alt="Preview" /><button type="button" onClick={() => onChange('')}>Remove image</button></div>}
    </div>
  )
}
