const subscribeUrl = import.meta.env.VITE_NEWSLETTER_URL;

export function NewsletterCard() {
  return <div className="newsletter-card"><span className="newsletter-star">✳</span><h3>A calmer way to<br />keep up with AI.</h3><p>One considered email, every weekday morning.</p>{subscribeUrl ? <a className="newsletter-subscribe-link" href={subscribeUrl} target="_blank" rel="noreferrer">Subscribe free <span>→</span></a> : <p className="newsletter-unavailable">Email delivery is being configured. The archive and RSS remain available now.</p>}</div>;
}
