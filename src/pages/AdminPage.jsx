import { useMemo, useState } from 'react'
import { ArrowLeft, Edit3, Eye, ImagePlus, LogOut, Plus, RotateCcw, Save, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CaseVisual } from '../components/CaseStudyCard'
import { contentRepository } from '../services/contentRepository'

const emptyCase = {
  id: '', slug: '', title: '', category: 'IMC', year: '2026', image: '',
  summary: '', objective: '', challenge: '', solution: '', result: ''
}

const emptyRecognition = {
  id: '', year: '2026', title: '', subtitle: '', description: '', image: ''
}

const emptyPartner = {
  id: '', name: '', group: 'Partner', logo: ''
}

function slugify(value) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(sessionStorage.getItem('dgm_admin_demo') === '1')
  const [email, setEmail] = useState('admin@dgm.vn')
  const [password, setPassword] = useState('demo123')
  const [cases, setCases] = useState(contentRepository.getCaseStudies())
  const [recognitions, setRecognitions] = useState(contentRepository.getRecognitions())
  const [partners, setPartners] = useState(contentRepository.getPartners())
  const [settings, setSettings] = useState(contentRepository.getSiteSettings())
  const [editingCase, setEditingCase] = useState(null)
  const [editingRecognition, setEditingRecognition] = useState(null)
  const [editingPartner, setEditingPartner] = useState(null)
  const [status, setStatus] = useState('')

  const currentCase = useMemo(() => editingCase ?? emptyCase, [editingCase])
  const currentRecognition = useMemo(() => editingRecognition ?? emptyRecognition, [editingRecognition])
  const currentPartner = useMemo(() => editingPartner ?? emptyPartner, [editingPartner])

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
    if (!file.type.startsWith('image/')) {
      setStatus('Vui lòng chọn đúng file hình ảnh.')
      return
    }
    if (file.size > 1.5 * 1024 * 1024) {
      setStatus('Ảnh demo nên nhỏ hơn 1.5 MB vì hiện đang lưu bằng localStorage.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => onReady(String(reader.result))
    reader.onerror = () => setStatus('Không đọc được file ảnh.')
    reader.readAsDataURL(file)
  }

  function saveSettings(event) {
    event.preventDefault()
    contentRepository.saveSiteSettings(settings)
    setStatus('Đã lưu nội dung website vào trình duyệt.')
  }

  function saveCase(event) {
    event.preventDefault()
    const item = {
      ...currentCase,
      id: currentCase.id || crypto.randomUUID(),
      slug: currentCase.slug || slugify(currentCase.title)
    }
    const next = cases.some((entry) => entry.id === item.id)
      ? cases.map((entry) => entry.id === item.id ? item : entry)
      : [item, ...cases]
    setCases(next)
    contentRepository.saveCaseStudies(next)
    setEditingCase(null)
    setStatus('Đã lưu case study.')
  }

  function saveRecognition(event) {
    event.preventDefault()
    const item = { ...currentRecognition, id: currentRecognition.id || crypto.randomUUID() }
    const next = recognitions.some((entry) => entry.id === item.id)
      ? recognitions.map((entry) => entry.id === item.id ? item : entry)
      : [item, ...recognitions]
    setRecognitions(next)
    contentRepository.saveRecognitions(next)
    setEditingRecognition(null)
    setStatus('Đã lưu recognition.')
  }

  function savePartner(event) {
    event.preventDefault()
    const item = { ...currentPartner, id: currentPartner.id || crypto.randomUUID() }
    const next = partners.some((entry) => entry.id === item.id)
      ? partners.map((entry) => entry.id === item.id ? item : entry)
      : [item, ...partners]
    setPartners(next)
    contentRepository.savePartners(next)
    setEditingPartner(null)
    setStatus('Đã lưu logo đối tác.')
  }

  function removeItem(list, setter, saver, id, label) {
    if (!window.confirm(`Xóa ${label} này?`)) return
    const next = list.filter((item) => item.id !== id)
    setter(next)
    saver(next)
    setStatus(`Đã xóa ${label}.`)
  }

  function resetDemo() {
    contentRepository.reset()
    setCases(contentRepository.getCaseStudies())
    setRecognitions(contentRepository.getRecognitions())
    setPartners(contentRepository.getPartners())
    setSettings(contentRepository.getSiteSettings())
    setStatus('Đã khôi phục dữ liệu demo ban đầu.')
  }

  if (!authenticated) {
    return (
      <main className="admin-login">
        <div className="admin-login-panel">
          <Link to="/" className="back-link"><ArrowLeft size={17} /> Về website</Link>
          <p className="eyebrow">DGM CMS Prototype</p><h1>Admin demo</h1>
          <p>Trang này dùng localStorage để demo luồng quản trị trước khi nối backend thật.</p>
          <form onSubmit={login}>
            <label>Email<input value={email} onChange={(event) => setEmail(event.target.value)} /></label>
            <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
            <button className="button button-primary" type="submit">Login</button>
            {status && <span className="form-status">{status}</span>}
          </form>
          <div className="demo-account">Demo: admin@dgm.vn / demo123</div>
        </div>
      </main>
    )
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/" className="brand-mark"><span>DGM</span><i /></Link>
        <nav>
          <a href="#general">General content</a>
          <a href="#recognitions">Recognition</a>
          <a href="#partners">Partner logos</a>
          <a href="#cases">Case studies</a>
          <Link to="/"><Eye size={17} /> Preview website</Link>
        </nav>
        <button onClick={() => { sessionStorage.removeItem('dgm_admin_demo'); setAuthenticated(false) }}><LogOut size={17} /> Logout</button>
      </aside>

      <div className="admin-main">
        <header><div><p className="eyebrow">Content management</p><h1>DGM Website Admin</h1></div><span className="prototype-badge">Frontend prototype</span></header>
        {status && <div className="admin-status">{status}</div>}

        <section id="general" className="admin-panel">
          <div className="admin-panel-title"><div><span>01</span><h2>General content</h2></div><p>Chỉnh Hero và thông tin liên hệ.</p></div>
          <form className="admin-form" onSubmit={saveSettings}>
            <label>Eyebrow<input value={settings.eyebrow} onChange={(event) => setSettings({ ...settings, eyebrow: event.target.value })} /></label>
            <label>Hero award title<input value={settings.heroTitle} onChange={(event) => setSettings({ ...settings, heroTitle: event.target.value })} /></label>
            <label className="full">Hero ranking title<input value={settings.heroSecondTitle ?? ''} onChange={(event) => setSettings({ ...settings, heroSecondTitle: event.target.value })} /></label>
            <label className="full">Hero description / credit line<textarea rows="3" value={settings.heroDescription} onChange={(event) => setSettings({ ...settings, heroDescription: event.target.value })} /></label>
            <ImageEditor
              label="Hero background"
              value={settings.heroBackground ?? ''}
              onChange={(heroBackground) => setSettings({ ...settings, heroBackground })}
              onUpload={(event) => readImage(event, (heroBackground) => setSettings({ ...settings, heroBackground }))}
            />
            <label>Background position<input value={settings.heroBackgroundPosition ?? 'center center'} onChange={(event) => setSettings({ ...settings, heroBackgroundPosition: event.target.value })} placeholder="center center" /></label>
            <label>Credential PDF URL<input value={settings.heroPdfUrl ?? '#'} onChange={(event) => setSettings({ ...settings, heroPdfUrl: event.target.value })} placeholder="https://.../credential.pdf" /></label>
            <label>Email<input value={settings.contactEmail} onChange={(event) => setSettings({ ...settings, contactEmail: event.target.value })} /></label>
            <label>Hotline<input value={settings.hotline} onChange={(event) => setSettings({ ...settings, hotline: event.target.value })} /></label>
            <label className="full">Address<input value={settings.address} onChange={(event) => setSettings({ ...settings, address: event.target.value })} /></label>
            <label className="full">Google Maps embed URL<input value={settings.mapEmbedUrl ?? ''} onChange={(event) => setSettings({ ...settings, mapEmbedUrl: event.target.value })} placeholder="https://www.google.com/maps?...&output=embed" /></label>
            <button className="button button-dark" type="submit"><Save size={17} /> Save general content</button>
          </form>
        </section>

        <section id="recognitions" className="admin-panel">
          <div className="admin-panel-title"><div><span>02</span><h2>Our recognition</h2></div><button className="button button-dark" onClick={() => setEditingRecognition({ ...emptyRecognition })}><Plus size={17} /> Add recognition</button></div>
          <div className="admin-content-list">
            {recognitions.map((item) => (
              <article key={item.id}>
                <div className="admin-preview admin-preview--recognition">{item.image ? <img src={item.image} alt="" /> : <strong>{item.year}</strong>}</div>
                <div><span>{item.year} / {item.subtitle}</span><h3>{item.title}</h3><p>{item.description}</p></div>
                <div className="row-actions"><button onClick={() => setEditingRecognition({ ...item })} aria-label="Sửa recognition"><Edit3 /></button><button onClick={() => removeItem(recognitions, setRecognitions, contentRepository.saveRecognitions, item.id, 'recognition')} aria-label="Xóa recognition"><Trash2 /></button></div>
              </article>
            ))}
          </div>
        </section>

        <section id="partners" className="admin-panel">
          <div className="admin-panel-title"><div><span>03</span><h2>Partner logos</h2></div><button className="button button-dark" onClick={() => setEditingPartner({ ...emptyPartner })}><Plus size={17} /> Add partner</button></div>
          <div className="admin-content-list admin-logo-list">
            {partners.map((item) => (
              <article key={item.id}>
                <div className="admin-preview admin-preview--logo">{item.logo ? <img src={item.logo} alt="" /> : <strong>{item.name}</strong>}</div>
                <div><span>{item.group}</span><h3>{item.name}</h3><p>{item.logo ? 'Custom logo uploaded' : 'Text wordmark fallback'}</p></div>
                <div className="row-actions"><button onClick={() => setEditingPartner({ ...item })} aria-label="Sửa logo"><Edit3 /></button><button onClick={() => removeItem(partners, setPartners, contentRepository.savePartners, item.id, 'partner')} aria-label="Xóa logo"><Trash2 /></button></div>
              </article>
            ))}
          </div>
        </section>

        <section id="cases" className="admin-panel">
          <div className="admin-panel-title"><div><span>04</span><h2>Case studies</h2></div><button className="button button-dark" onClick={() => setEditingCase({ ...emptyCase })}><Plus size={17} /> Add case study</button></div>
          <div className="admin-content-list">
            {cases.map((item) => (
              <article key={item.id}>
                <div className="admin-preview"><CaseVisual item={item} compact /></div>
                <div><span>{item.category} / {item.year}</span><h3>{item.title}</h3><p>{item.summary}</p></div>
                <div className="row-actions"><button onClick={() => setEditingCase({ ...item })} aria-label="Sửa case study"><Edit3 /></button><button onClick={() => removeItem(cases, setCases, contentRepository.saveCaseStudies, item.id, 'case study')} aria-label="Xóa case study"><Trash2 /></button></div>
              </article>
            ))}
          </div>
        </section>

        <button className="reset-button" onClick={resetDemo}><RotateCcw size={16} /> Reset demo data</button>
      </div>

      {editingCase && (
        <div className="modal-backdrop" onMouseDown={() => setEditingCase(null)}>
          <form className="content-modal" onSubmit={saveCase} onMouseDown={(event) => event.stopPropagation()}>
            <ModalTitle eyebrow="Case study editor" title={editingCase.id ? 'Edit case study' : 'Add case study'} onClose={() => setEditingCase(null)} />
            <div className="admin-form">
              <label className="full">Title<input required value={currentCase.title} onChange={(event) => setEditingCase({ ...currentCase, title: event.target.value })} /></label>
              <label>Category<input required value={currentCase.category} onChange={(event) => setEditingCase({ ...currentCase, category: event.target.value })} /></label>
              <label>Year<input required value={currentCase.year} onChange={(event) => setEditingCase({ ...currentCase, year: event.target.value })} /></label>
              <ImageEditor label="Case image" value={currentCase.image} onChange={(image) => setEditingCase({ ...currentCase, image })} onUpload={(event) => readImage(event, (image) => setEditingCase({ ...currentCase, image }))} />
              <label className="full">Summary<textarea required rows="2" value={currentCase.summary} onChange={(event) => setEditingCase({ ...currentCase, summary: event.target.value })} /></label>
              <label className="full">Objective<textarea rows="2" value={currentCase.objective} onChange={(event) => setEditingCase({ ...currentCase, objective: event.target.value })} /></label>
              <label className="full">Challenge<textarea rows="2" value={currentCase.challenge} onChange={(event) => setEditingCase({ ...currentCase, challenge: event.target.value })} /></label>
              <label className="full">Solution / Key work<textarea rows="3" value={currentCase.solution} onChange={(event) => setEditingCase({ ...currentCase, solution: event.target.value })} /></label>
              <label className="full">Results / Impact<textarea rows="2" value={currentCase.result} onChange={(event) => setEditingCase({ ...currentCase, result: event.target.value })} /></label>
            </div>
            <button className="button button-primary" type="submit"><Save size={17} /> Save case study</button>
          </form>
        </div>
      )}

      {editingRecognition && (
        <div className="modal-backdrop" onMouseDown={() => setEditingRecognition(null)}>
          <form className="content-modal" onSubmit={saveRecognition} onMouseDown={(event) => event.stopPropagation()}>
            <ModalTitle eyebrow="Recognition editor" title={editingRecognition.id ? 'Edit recognition' : 'Add recognition'} onClose={() => setEditingRecognition(null)} />
            <div className="admin-form">
              <label>Year<input required value={currentRecognition.year} onChange={(event) => setEditingRecognition({ ...currentRecognition, year: event.target.value })} /></label>
              <label>Subtitle<input required value={currentRecognition.subtitle} onChange={(event) => setEditingRecognition({ ...currentRecognition, subtitle: event.target.value })} /></label>
              <label className="full">Title<input required value={currentRecognition.title} onChange={(event) => setEditingRecognition({ ...currentRecognition, title: event.target.value })} /></label>
              <label className="full">Description<textarea required rows="4" value={currentRecognition.description} onChange={(event) => setEditingRecognition({ ...currentRecognition, description: event.target.value })} /></label>
              <ImageEditor label="Recognition image" value={currentRecognition.image} onChange={(image) => setEditingRecognition({ ...currentRecognition, image })} onUpload={(event) => readImage(event, (image) => setEditingRecognition({ ...currentRecognition, image }))} />
            </div>
            <button className="button button-primary" type="submit"><Save size={17} /> Save recognition</button>
          </form>
        </div>
      )}

      {editingPartner && (
        <div className="modal-backdrop" onMouseDown={() => setEditingPartner(null)}>
          <form className="content-modal content-modal--small" onSubmit={savePartner} onMouseDown={(event) => event.stopPropagation()}>
            <ModalTitle eyebrow="Partner editor" title={editingPartner.id ? 'Edit partner' : 'Add partner'} onClose={() => setEditingPartner(null)} />
            <div className="admin-form">
              <label>Name<input required value={currentPartner.name} onChange={(event) => setEditingPartner({ ...currentPartner, name: event.target.value })} /></label>
              <label>Group<input required value={currentPartner.group} onChange={(event) => setEditingPartner({ ...currentPartner, group: event.target.value })} /></label>
              <ImageEditor label="Partner logo" value={currentPartner.logo} onChange={(logo) => setEditingPartner({ ...currentPartner, logo })} onUpload={(event) => readImage(event, (logo) => setEditingPartner({ ...currentPartner, logo }))} />
            </div>
            <button className="button button-primary" type="submit"><Save size={17} /> Save partner</button>
          </form>
        </div>
      )}
    </main>
  )
}

function ModalTitle({ eyebrow, title, onClose }) {
  return <div className="modal-title"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div><button type="button" onClick={onClose}>×</button></div>
}

function ImageEditor({ label, value, onChange, onUpload }) {
  return (
    <div className="image-editor full">
      <label>{label} URL / path<input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Để trống để dùng HTML fallback" /></label>
      <label className="upload-button"><ImagePlus size={17} /> Upload image<input type="file" accept="image/*" onChange={onUpload} /></label>
      {value && <div className="image-editor-preview"><img src={value} alt="Preview" /><button type="button" onClick={() => onChange('')}>Remove image</button></div>}
    </div>
  )
}
