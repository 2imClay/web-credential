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
      ['featureFour', 'Feature 04'], ['primaryCta', 'Primary CTA'], ['helpLabel', 'Hotline label']
    ]
  },
  {
    key: 'milestones', title: 'Milestones', description: 'Heading phía trên timeline.',
    fields: [['eyebrow', 'Eyebrow'], ['title', 'Title'], ['intro', 'Introduction', 'textarea']]
  },
  {
    key: 'recognition', title: 'Recognition', description: 'Heading phía trên danh sách giải thưởng.',
    fields: [['eyebrow', 'Eyebrow'], ['title', 'Title'], ['intro', 'Introduction', 'textarea']]
  },
  {
    key: 'services', title: 'Services', description: 'Thông điệp mở đầu phần năng lực.',
    fields: [['eyebrow', 'Eyebrow'], ['titleBefore', 'Title — opening'], ['titleHighlight', 'Title — highlight'], ['intro', 'Introduction', 'textarea']]
  },
  {
    key: 'data', title: 'Data Hub', description: 'Nội dung giới thiệu nền tảng dữ liệu.',
    fields: [['eyebrow', 'Eyebrow'], ['titleBefore', 'Title — opening'], ['titleHighlight', 'Title — highlight'], ['intro', 'Introduction', 'textarea'], ['consoleLabel', 'Console label']]
  },
  {
    key: 'partners', title: 'Partners & clients', description: 'Heading phía trên logo đối tác.',
    fields: [['eyebrow', 'Eyebrow'], ['title', 'Title'], ['intro', 'Introduction', 'textarea']]
  },
  {
    key: 'cases', title: 'Case studies', description: 'Heading và CTA của selected work.',
    fields: [['eyebrow', 'Eyebrow'], ['titleBefore', 'Title — opening'], ['titleHighlight', 'Title — highlight'], ['cta', 'CTA label']]
  },
  {
    key: 'team', title: 'Our team', description: 'Toàn bộ thông điệp của phần đội ngũ.',
    fields: [
      ['eyebrow', 'Eyebrow'], ['kicker', 'Kicker'], ['titleBefore', 'Title — opening'],
      ['titleHighlight', 'Title — highlight'], ['intro', 'Introduction', 'textarea'],
      ['collectiveEyebrow', 'Collective eyebrow'], ['collectiveTitle', 'Collective title'],
      ['collectiveIntro', 'Collective introduction', 'textarea'], ['footerNote', 'Footer note'], ['cta', 'CTA label']
    ]
  },
  {
    key: 'process', title: 'Process', description: 'Heading và ghi chú quy trình.',
    fields: [['eyebrow', 'Eyebrow'], ['title', 'Title'], ['note', 'Process note', 'textarea']]
  },
  {
    key: 'contact', title: 'Contact & footer', description: 'Heading và nội dung biểu mẫu liên hệ.',
    fields: [['eyebrow', 'Eyebrow'], ['titleBefore', 'Title — opening'], ['titleHighlight', 'Title — highlight'], ['formIntro', 'Form introduction', 'textarea'], ['submitLabel', 'Submit button']]
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
    key: 'recognitions', anchor: 'recognitions', no: '04', title: 'Recognition', singular: 'recognition', icon: Trophy,
    description: 'Giải thưởng, ranking và industry mentions.', save: contentRepository.saveRecognitions,
    empty: { id: '', year: '2026', title: '', subtitle: '', description: '', image: '' },
    fields: [['year', 'Year'], ['subtitle', 'Subtitle'], ['title', 'Title'], ['description', 'Description', 'textarea'], ['image', 'Recognition image', 'image']],
    meta: (item) => `${item.year} / ${item.subtitle}`, summary: (item) => item.description
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
    meta: (item) => item.group, summary: (item) => item.logo ? 'Custom logo uploaded' : 'Text wordmark fallback'
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
    empty: { id: '', role: '', count: '01', detail: '' },
    fields: [['role', 'Department / role'], ['count', 'People count'], ['detail', 'Description', 'textarea']],
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
  const [authenticated, setAuthenticated] = useState(sessionStorage.getItem('dgm_admin_demo') === '1')
  const [email, setEmail] = useState('admin@dgm.vn')
  const [password, setPassword] = useState('demo123')
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
    if (email === 'admin@dgm.vn' && password === 'demo123') {
      sessionStorage.setItem('dgm_admin_demo', '1')
      setAuthenticated(true)
      setStatus('')
    } else setStatus('Sai tài khoản demo.')
  }

  function readImage(event, onReady) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return setStatus('Vui lòng chọn đúng file hình ảnh.')
    if (file.size > 1.5 * 1024 * 1024) return setStatus('Ảnh demo nên nhỏ hơn 1.5 MB vì hiện đang lưu bằng localStorage.')
    const reader = new FileReader()
    reader.onload = () => onReady(String(reader.result))
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
    if (definition.key === 'services') {
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

  function resetDemo() {
    if (!window.confirm('Khôi phục toàn bộ nội dung demo ban đầu? Các thay đổi trong Admin sẽ bị xóa.')) return
    contentRepository.reset()
    setSettings(contentRepository.getSiteSettings())
    setPageContent(contentRepository.getPageContent())
    setCollections(loadCollections())
    setStatus('Đã khôi phục toàn bộ dữ liệu demo ban đầu.')
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
          <div className="demo-account">Demo: admin@dgm.vn / demo123</div>
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
        <button onClick={() => { sessionStorage.removeItem('dgm_admin_demo'); setAuthenticated(false) }}><LogOut /> Logout</button>
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
          <div><span>Storage mode</span><strong>Local</strong><small>Prototype environment</small></div>
        </div>

        <section id="general" className="admin-panel">
          <PanelTitle no="01" title="Brand, Hero & Contact" description="Nhận diện, hero, chỉ số Data Hub, liên hệ và social links." />
          <form className="admin-form" onSubmit={saveSettings}>
            <label>Company name<input value={settings.companyName} onChange={(event) => setSettings({ ...settings, companyName: event.target.value })} /></label>
            <label>Hero eyebrow<input value={settings.eyebrow} onChange={(event) => setSettings({ ...settings, eyebrow: event.target.value })} /></label>
            <label>Hero award title<input value={settings.heroTitle} onChange={(event) => setSettings({ ...settings, heroTitle: event.target.value })} /></label>
            <label>Hero ranking title<input value={settings.heroSecondTitle} onChange={(event) => setSettings({ ...settings, heroSecondTitle: event.target.value })} /></label>
            <label className="full">Hero description<textarea rows="2" value={settings.heroDescription} onChange={(event) => setSettings({ ...settings, heroDescription: event.target.value })} /></label>
            <ImageEditor label="Hero background" value={settings.heroBackground} onChange={(value) => setSettings({ ...settings, heroBackground: value })} onUpload={(event) => readImage(event, (value) => setSettings({ ...settings, heroBackground: value }))} />
            <label>Background position<input value={settings.heroBackgroundPosition} onChange={(event) => setSettings({ ...settings, heroBackgroundPosition: event.target.value })} /></label>
            <label>Credential PDF URL<input value={settings.heroPdfUrl} onChange={(event) => setSettings({ ...settings, heroPdfUrl: event.target.value })} /></label>
            <label>Primary CTA<input value={settings.heroPrimaryCta} onChange={(event) => setSettings({ ...settings, heroPrimaryCta: event.target.value })} /></label>
            <label>Secondary CTA<input value={settings.heroSecondaryCta} onChange={(event) => setSettings({ ...settings, heroSecondaryCta: event.target.value })} /></label>

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

        <button className="reset-button" onClick={resetDemo}><RotateCcw /> Reset all demo content</button>
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
      <label>{label} URL / path<input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Để trống để dùng HTML fallback" /></label>
      <label className="upload-button"><ImagePlus /> Upload image<input type="file" accept="image/*" onChange={onUpload} /></label>
      {value && <div className="image-editor-preview"><img src={value} alt="Preview" /><button type="button" onClick={() => onChange('')}>Remove image</button></div>}
    </div>
  )
}
