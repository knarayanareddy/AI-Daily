type Props = { message: string; onRetry: () => void; onBack: () => void };
export function EditionError({ message, onRetry, onBack }: Props) {
  return <section className="route-state error-state" role="alert"><span className="error-mark" aria-hidden="true">!</span><p className="eyebrow">SIGNAL INTERRUPTED</p><h2>This edition could not be verified.</h2><p>{message}</p><div className="route-actions"><button type="button" onClick={onRetry}>Try again</button><button type="button" onClick={onBack}>Return to current edition</button></div></section>;
}
