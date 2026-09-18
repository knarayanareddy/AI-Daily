import type { ToolFocus } from '../lib/contracts';

type Props = { tool: ToolFocus };
const assetUrl = (url: string) => url.startsWith('/') ? `${import.meta.env.BASE_URL}${url.slice(1)}` : url;

export function ToolFocus({ tool }: Props) {
  return <section className="showcase-module tool-focus" aria-labelledby="toolFocusTitle">
    <div className="showcase-module-kicker">FIELD TEST · TOOL FOCUS</div>
    <div className="showcase-module-grid">
      {tool.image_url && <img className="showcase-image" src={assetUrl(tool.image_url)} alt="" loading="lazy" />}
      <div><p className="showcase-verdict">{tool.evidence_posture.replace('_', ' ')}</p><h2 id="toolFocusTitle">{tool.name}</h2><p className="showcase-dek">{tool.what}</p><a className="showcase-link" href={tool.url} target="_blank" rel="noreferrer">Open the tool record ↗</a></div>
    </div>
    <div className="showcase-columns"><div><h3>Why now</h3><p>{tool.why_now}</p></div><div><h3>How to try it</h3><ol>{tool.how_to_try.map(step => <li key={step}>{step}</li>)}</ol></div><div><h3>The catch</h3><p>{tool.catch}</p></div><div><h3>Rave / reality</h3><p><strong>The rave:</strong> {tool.rave}</p><p><strong>The reality:</strong> {tool.reality}</p></div></div>
    <p className="showcase-alternative"><strong>Alternative path:</strong> {tool.alternative}</p>
  </section>;
}
