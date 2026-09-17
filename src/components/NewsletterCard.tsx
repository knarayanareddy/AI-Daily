type Props = { onSubscribe: () => void };
export function NewsletterCard({ onSubscribe }: Props) {
  return <div className="newsletter-card"><span className="newsletter-star">✳</span><h3>A calmer way to<br />keep up with AI.</h3><p>One considered email, every weekday morning.</p><button type="button" onClick={onSubscribe}>Subscribe free <span>→</span></button></div>;
}
