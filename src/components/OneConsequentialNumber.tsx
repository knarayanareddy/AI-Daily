import type { OneConsequentialNumber as OneConsequentialNumberData } from '../lib/contracts';

type Props = { item: OneConsequentialNumberData };

export function OneConsequentialNumber({ item }: Props) {
  return <section className="additive-module consequential-number" id="one-number" aria-labelledby="oneNumberTitle">
    <div className="additive-header"><p className="additive-kicker">EDITION ADDITIVE · ONE CONSEQUENTIAL NUMBER</p><p className="additive-posture">{item.meta.evidence_posture}</p></div>
    <div className="number-grid"><div className="number-value" aria-label={`${item.value} ${item.unit}`}>{item.value}<span>{item.unit}</span></div><div><h2 id="oneNumberTitle">{item.label}</h2><p>{item.context}</p><p className="number-limitation"><strong>Limit:</strong> {item.limitation}</p></div></div>
    <p className="additive-why"><strong>Why this is here:</strong> {item.meta.why_here}</p>
    <p className="additive-source">Source trail: {item.meta.source_urls.map((url, index) => <a key={url} href={url} target="_blank" rel="noreferrer">{index ? `source ${index + 1}` : 'primary record'} ↗</a>)} · Expires {item.meta.expires_at}</p>
  </section>;
}
