type Props = { dark: boolean; onToggleTheme: () => void };

export function SiteHeader({ dark, onToggleTheme }: Props) {
  return <header className="site-header"><a className="wordmark" href="#top"><span>AI</span> DAILY<span className="mark">.</span></a><nav className="main-nav" aria-label="Primary navigation"><a className="active" href="#briefing">Briefing</a><a href="#topics">Topics</a><a href="#method">Our method</a></nav><div className="header-actions"><button className="icon-btn" onClick={onToggleTheme} aria-label={dark ? 'Use light theme' : 'Use dark theme'}>◐</button><button className="subscribe-btn" type="button">Get the briefing <span>→</span></button></div></header>;
}
