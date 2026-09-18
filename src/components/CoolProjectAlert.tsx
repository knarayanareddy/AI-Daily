import type { CoolProjectAlert } from '../lib/contracts';

type Props = { project: CoolProjectAlert };
const assetUrl = (url: string) => url.startsWith('/') ? `${import.meta.env.BASE_URL}${url.slice(1)}` : url;
const verdicts: Record<CoolProjectAlert['verdict'], string> = { worth_trying_now: 'Worth trying now', worth_watching: 'Worth watching', narrow_audience: 'Useful for a narrow audience', immature: 'Interesting but immature' };

export function CoolProjectAlert({ project }: Props) {
  return <section className="showcase-module cool-project" id="cool-project" aria-labelledby="projectAlertTitle">
    <div className="showcase-module-kicker">BUILDER SIGNAL · COOL PROJECT ALERT {project.related_signal_number && <span className="signal-reference">· RELATED SIGNAL {String(project.related_signal_number).padStart(2, '0')}</span>}</div>
    <div className="showcase-module-grid">
      {project.image_url && <img className="showcase-image" src={assetUrl(project.image_url)} alt="" loading="lazy" />}
      <div><p className="showcase-verdict">{verdicts[project.verdict]}</p><h2 id="projectAlertTitle">{project.name}</h2><p className="showcase-dek">{project.why_cool}</p><p className="project-meta">Maintainer: {project.maintainer} · License: {project.license}</p><a className="showcase-link" href={project.repository_url} target="_blank" rel="noreferrer">Inspect the repository ↗</a></div>
    </div>
    <div className="showcase-columns"><div><h3>Why it is useful</h3><p>{project.why_useful}</p></div><div><h3>Try first</h3><p><code>{project.try_first}</code></p></div><div><h3>Project health</h3><p>{project.project_health}</p></div><div><h3>What could go wrong</h3><p>{project.caveat}</p></div></div>
  </section>;
}
