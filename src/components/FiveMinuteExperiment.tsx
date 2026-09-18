import type { FiveMinuteExperiment } from '../lib/contracts';

type Props = { experiment: FiveMinuteExperiment };

export function FiveMinuteExperiment({ experiment }: Props) {
  return <section className="showcase-module five-minute" aria-labelledby="experimentTitle"><div className="showcase-module-kicker">READER LAB · FIVE-MINUTE EXPERIMENT</div><h2 id="experimentTitle">{experiment.title}</h2><p className="showcase-dek">{experiment.premise}</p><div className="experiment-grid"><div><h3>Run it</h3><ol>{experiment.steps.map(step => <li key={step}>{step}</li>)}</ol></div><div><h3>Observe</h3><p>{experiment.observe}</p><h3>Safety note</h3><p>{experiment.safety_note}</p></div></div></section>;
}
