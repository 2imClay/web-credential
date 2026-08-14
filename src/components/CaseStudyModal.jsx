import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

function getYouTubeEmbedUrl(value) {
  if (!value) return ''

  try {
    const url = new URL(value)
    const host = url.hostname.replace(/^www\./, '').toLowerCase()
    let videoId = ''

    if (host === 'youtu.be') {
      videoId = url.pathname.split('/').filter(Boolean)[0] || ''
    } else if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      if (url.pathname === '/watch') videoId = url.searchParams.get('v') || ''
      else videoId = url.pathname.match(/^\/(?:embed|shorts|live)\/([^/?#]+)/)?.[1] || ''
    }

    if (!/^[a-zA-Z0-9_-]{6,}$/.test(videoId)) return ''
    return `https://www.youtube-nocookie.com/embed/${videoId}`
  } catch {
    return ''
  }
}

export default function CaseStudyModal({ item, onClose }) {
  const dialogRef = useRef(null)
  const gallery = (Array.isArray(item.gallery) ? item.gallery : [])
    .filter((source, index, sources) => source && sources.indexOf(source) === index)
  const youtubeUrls = Array.isArray(item.youtubeUrls)
    ? item.youtubeUrls
    : String(item.youtubeUrls || '').split(/[\r\n,]+/)
  const videos = youtubeUrls
    .map((url) => ({ source: url.trim(), embedUrl: getYouTubeEmbedUrl(url.trim()) }))
    .filter(({ embedUrl }, index, sources) => embedUrl && sources.findIndex((video) => video.embedUrl === embedUrl) === index)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previousActiveElement = document.activeElement
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    window.requestAnimationFrame(() => dialogRef.current?.focus())

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      previousActiveElement?.focus?.()
    }
  }, [onClose])

  return createPortal(
    <div
      className="case-study-modal"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        ref={dialogRef}
        className="case-study-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-study-modal-title"
        tabIndex="-1"
      >
        <button className="case-study-modal__close" type="button" onClick={onClose} aria-label="Close case study">
          <X />
        </button>

        <div className="case-study-modal__hero">
          <div className="case-study-modal__intro">
            <p className="case-study-modal__meta"><span>{item.category}</span><span>{item.year}</span></p>
            <h2 id="case-study-modal-title">{item.title}</h2>
            {item.summary && <p className="case-study-modal__summary">{item.summary}</p>}
          </div>
        </div>

        {(gallery.length > 0 || videos.length > 0) && (
          <div className="case-study-modal__body case-study-modal__body--media-only">
            {gallery.length > 0 && (
              <div className="case-study-modal__gallery">
                {gallery.map((source, index) => (
                  <figure className={index === 0 ? 'is-cover' : ''} key={`${source}-${index}`}>
                    <img src={source} alt={`${item.title} — image ${index + 1}`} />
                  </figure>
                ))}
              </div>
            )}
            {videos.length > 0 && (
              <div className="case-study-modal__videos">
                {videos.map(({ source, embedUrl }, index) => (
                  <figure key={embedUrl}>
                    <iframe
                      src={embedUrl}
                      title={`${item.title || 'Case study'} — YouTube video ${index + 1}`}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                    <a href={source} target="_blank" rel="noreferrer">Xem trên YouTube</a>
                  </figure>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>,
    document.body
  )
}
