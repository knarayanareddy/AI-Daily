import type { ChangeLedger as ChangeLedgerData } from '../lib/contracts';

type Props = { item: ChangeLedgerData };

export function ChangeLedger({ item }: Props) {
  return <section className="additive-module change-ledger" id="change-ledger" aria-labelledby="changeLedgerTitle">
    <div className="additive-header"><p className="additive-kicker">EDITION ADDITIVE · CHANGE LEDGER</p><p className="additive-posture">{item.meta.evidence_posture}</p></div>
    <h2 id="changeLedgerTitle">What changed since the last edition?</h2>
    <div className="ledger-grid"><div><h3>Before</h3><p>{item.before}</p></div><div><h3>Now</h3><p>{item.now}</p></div><div><h3>Why it matters</h3><p>{item.significance}</p></div></div>
    <p className="additive-why"><strong>Why this is here:</strong> {item.meta.why_here}</p>
    <p className="additive-source">Source trail: {item.meta.source_urls.map((url, index) => <a key={url} href={url} target="_blank" rel="noreferrer">{index ? `source ${index + 1}` : 'primary record'} ↗</a>)} · Expires {item.meta.expires_at}</p>
  </section>;
}
