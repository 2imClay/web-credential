export default function TechGlobe() {
  return (
    <div className="tech-globe-stage" aria-hidden="true">
      <div className="tech-globe-halo tech-globe-halo--one" />
      <div className="tech-globe-halo tech-globe-halo--two" />
      <div className="tech-globe">
        <span className="globe-lat globe-lat--one" />
        <span className="globe-lat globe-lat--two" />
        <span className="globe-lat globe-lat--three" />
        <span className="globe-lon globe-lon--one" />
        <span className="globe-lon globe-lon--two" />
        <span className="globe-lon globe-lon--three" />
        <span className="globe-scan" />
        <i className="globe-node globe-node--one" />
        <i className="globe-node globe-node--two" />
        <i className="globe-node globe-node--three" />
        <i className="globe-node globe-node--four" />
      </div>
      <div className="tech-orbit tech-orbit--one"><i /></div>
      <div className="tech-orbit tech-orbit--two"><i /></div>
      <div className="tech-orbit tech-orbit--three"><i /></div>
      <span className="tech-label tech-label--one">AUDIENCE SIGNAL</span>
      <span className="tech-label tech-label--two">LIVE DATA</span>
      <span className="tech-label tech-label--three">AI MODEL</span>
    </div>
  )
}
