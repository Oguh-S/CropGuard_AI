import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, CalendarDays, Check, ChevronDown, CircleUserRound, Leaf,
  LoaderCircle, LogOut, Menu, Moon, ShieldCheck, Sprout, Sun, UploadCloud, X,
} from 'lucide-react';

const API = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '') + '/api';
const crops = ['Cashew', 'Cassava', 'Maize', 'Tomato'];
const routeName = (path) => {
  if (path === '/' || path === '/login') return 'login';
  if (path === '/welcome') return 'welcome';
  if (path === '/check') return 'check';
  if (path === '/crops') return 'crops';
  if (path === '/about') return 'about';
  if (path === '/privacy') return 'privacy';
  return 'landing';
};
const navName = (path) => {
  const [route, hash] = path.split('#');
  if (route === '/check') return 'check';
  if (route === '/crops') return 'crops';
  if (route === '/about') return 'about';
  if (route === '/privacy') return 'privacy';
  return 'landing';
};

async function call(path, options = {}) {
  const response = await fetch(API + path, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw Error(data.detail || data.error || Object.values(data).flat().join(' ') || 'Something went wrong.');
  return data;
}

function label(value = '') {
  return value.replaceAll('___', ' · ').replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function historyStorageKey(username) {
  return username ? `cropguard.history.${username.toLowerCase()}` : '';
}

function ThemeToggle({ theme, onToggle, className = '' }) {
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  return <button type="button" className={`theme-toggle ${className}`} onClick={onToggle} aria-label={`Switch to ${nextTheme} mode`} aria-pressed={theme === 'dark'} title={`Switch to ${nextTheme} mode`}><span aria-hidden="true">{theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}</span><span className="sr-only">Switch to {nextTheme} mode</span></button>;
}

export default function App() {
  const input = useRef(null);
  const [screen, setScreen] = useState(() => routeName(window.location.pathname));
  const [activeNav, setActiveNav] = useState(() => navName(window.location.pathname + window.location.hash));
  const [theme, setTheme] = useState(() => localStorage.getItem('cropguard.theme') || 'light');
  const [token, setToken] = useState(() => localStorage.getItem('cropguard.access') || '');
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [crop, setCrop] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('cropguard.theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => current === 'dark' ? 'light' : 'dark');
  }

  function navigate(path) {
    window.history.pushState({}, '', path);
    setScreen(routeName(path.split('#')[0]));
    setActiveNav(navName(path));
    setMenu(false);
    setError('');
    const anchor = path.split('#')[1];
    requestAnimationFrame(() => {
      if (anchor) document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  useEffect(() => {
    const onPopState = () => {
      setScreen(routeName(window.location.pathname));
      setActiveNav(navName(window.location.pathname + window.location.hash));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (screen !== 'welcome') return undefined;
    const timer = window.setTimeout(() => {
      window.history.replaceState({}, '', '/how-it-works');
      setScreen('landing');
      setActiveNav('landing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [screen]);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    call('/accounts/profile/', { headers: { Authorization: `Bearer ${token}` } })
      .then((profile) => setUser(profile))
      .catch(() => {
        localStorage.removeItem('cropguard.access');
        localStorage.removeItem('cropguard.refresh');
        setToken('');
      });
  }, [token]);

  useEffect(() => {
    if (!user?.username) {
      setHistory([]);
      return;
    }
    try {
      setHistory(JSON.parse(localStorage.getItem(historyStorageKey(user.username)) || '[]'));
    } catch {
      setHistory([]);
    }
  }, [user?.username]);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  function pick(nextFile) {
    if (!nextFile) return;
    if (!nextFile.type.startsWith('image/')) {
      setError('Choose a JPG, PNG, or other image file.');
      return;
    }
    if (nextFile.size > 10 * 1024 * 1024) {
      setError('This image is over 10 MB. Choose a smaller photo.');
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setFile(nextFile);
    setPreview(URL.createObjectURL(nextFile));
    setResult(null);
    setError('');
    setNotice('');
  }

  async function submitAuth(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'register') {
        await call('/accounts/register/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      const data = await call('/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, password: form.password }),
      });
      localStorage.setItem('cropguard.access', data.access);
      if (data.refresh) localStorage.setItem('cropguard.refresh', data.refresh);
      setToken(data.access);
      navigate('/welcome');
    } catch (authError) {
      setError(authError.message);
    } finally {
      setBusy(false);
    }
  }

  async function diagnose(event) {
    event.preventDefault();
    setError('');
    if (!token) {
      navigate('/');
      setNotice('Sign in to run a diagnosis.');
      return;
    }
    if (!file) {
      setError('Put a valid image');
      return;
    }
    setBusy(true);
    setResult(null);
    setNotice('');
    const body = new FormData();
    body.append('image', file);
    try {
      const data = await call('/predictions/predict/', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body,
      });
      const prediction = data.prediction;
      setResult(prediction);
      setNotice('Use this as an early guide and confirm with a local agriculture expert.');
      const entry = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        disease: prediction.disease,
        confidence: prediction.confidence,
        createdAt: new Date().toISOString(),
      };
      const nextHistory = [entry, ...history].slice(0, 12);
      setHistory(nextHistory);
      if (user?.username) localStorage.setItem(historyStorageKey(user.username), JSON.stringify(nextHistory));
    } catch (diagnosisError) {
      setError(diagnosisError.message);
    } finally {
      setBusy(false);
    }
  }

  function signout() {
    localStorage.removeItem('cropguard.access');
    localStorage.removeItem('cropguard.refresh');
    setToken('');
    setUser(null);
    setResult(null);
    setFile(null);
    setPreview('');
    setNotice('You have signed out.');
    navigate('/');
  }

  if (screen === 'login') {
    return <main className="account-page">
      <a className="brand account-brand" href="/" onClick={(event) => { event.preventDefault(); navigate('/'); }}><img className="brand-logo" src="/cropguard-logo.svg" alt="" /><b>CropGuard AI</b></a>
      <ThemeToggle theme={theme} onToggle={toggleTheme} className="account-theme" />
      <div className="account-layout">
        <section className="account-story">
          <span className="account-kicker"><i /> GROW WITH MORE CONFIDENCE</span>
          <h1>A little care<br />goes a <em>long way.</em></h1>
          <p>Sign in to keep your crop checks together and find a clearer next step when a leaf looks different.</p>
          <div className="account-leaf"><div className="account-orbit orbit-one"/><div className="account-orbit orbit-two"/><Sprout size={72} strokeWidth={1.1}/></div>
          <small>Thoughtful tools for healthier crops.</small>
        </section>
        <section className="account-card">
          <div className="eyebrow"><i /> YOUR CROPGUARD ACCOUNT</div>
          <h2>{mode === 'login' ? 'Welcome back.' : 'Let’s get started.'}</h2>
          <p>{mode === 'login' ? 'Sign in to take a closer look at your crop.' : 'Create an account to save your crop checks.'}</p>
          <form onSubmit={submitAuth}>
            <label>Username<input autoComplete="username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} required /></label>
            {mode === 'register' && <label>Email<input type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>}
            <label>Password<input type="password" minLength="8" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /></label>
            <button className="button account-submit" disabled={busy}>{busy ? <><LoaderCircle className="spin" size={17} /> Please wait…</> : <>{mode === 'login' ? 'Sign in' : 'Create account'} <ArrowRight size={17} /></>}</button>
            {error && <div className="feedback bad" role="alert">{error}</div>}
          </form>
          <p className="switch">{mode === 'login' ? 'New to CropGuard AI?' : 'Already have an account?'} <button onClick={() => { setError(''); setMode(mode === 'login' ? 'register' : 'login'); }}>{mode === 'login' ? 'Create an account' : 'Sign in'}</button></p>
          <button className="back-link" onClick={() => navigate('/how-it-works')}><ArrowRight size={14} className="back-arrow" /> Explore CropGuard AI</button>
        </section>
      </div>
    </main>;
  }

  if (screen === 'welcome') {
    return <main className="welcome-page">
      <div className="welcome-top"><a className="brand" href="/" onClick={(event) => { event.preventDefault(); navigate('/'); }}><img className="brand-logo" src="/cropguard-logo.svg" alt="" /><b>CropGuard AI</b></a><div className="welcome-actions"><ThemeToggle theme={theme} onToggle={toggleTheme} />{token && <button className="button signout-button" onClick={signout}><LogOut size={15} /> Sign out</button>}</div></div>
      <section className="welcome-center" aria-live="polite">
        <div className="welcome-animation"><span className="welcome-ring ring-a"/><span className="welcome-ring ring-b"/><span className="welcome-sprout"><Sprout size={50} /></span><span className="welcome-check"><Check size={18} /></span></div>
        <span className="account-kicker"><i /> YOUR GROWING JOURNEY STARTS HERE</span>
        <h1>Welcome{user?.username ? `, ${user.username}` : ''}.</h1>
        <p>Your crop checks and next steps are ready whenever you are.</p>
        <div className="welcome-progress" aria-hidden="true"><span /></div>
        <small className="welcome-next">Opening your field guide…</small>
        <button className="button account-submit continue-button" onClick={() => navigate('/how-it-works')}>Continue now <ArrowRight size={17} /></button>
      </section>
      <span className="welcome-footer">A clearer first look at plant health.</span>
    </main>;
  }

  return <main>
    <header className="topbar wrap" id="top">
      <a className="brand" href="/how-it-works" onClick={(event) => { event.preventDefault(); navigate('/how-it-works'); }}><img className="brand-logo" src="/cropguard-logo.svg" alt="" /><b>CropGuard AI</b></a>
      <nav className={menu ? 'nav nav-open' : 'nav'}>
        <a className={activeNav === 'landing' ? 'active' : ''} aria-current={activeNav === 'landing' ? 'page' : undefined} href="/how-it-works" onClick={(event) => { event.preventDefault(); navigate('/how-it-works'); }}>How it works</a><a className={activeNav === 'check' ? 'active' : ''} aria-current={activeNav === 'check' ? 'page' : undefined} href="/check#diagnose" onClick={(event) => { event.preventDefault(); navigate('/check#diagnose'); }}>Check a leaf</a><a className={activeNav === 'crops' ? 'active' : ''} aria-current={activeNav === 'crops' ? 'page' : undefined} href="/crops" onClick={(event) => { event.preventDefault(); navigate('/crops'); }}>Crops</a><a className={activeNav === 'about' ? 'active' : ''} aria-current={activeNav === 'about' ? 'page' : undefined} href="/about" onClick={(event) => { event.preventDefault(); navigate('/about'); }}>About</a><a className={activeNav === 'privacy' ? 'active' : ''} aria-current={activeNav === 'privacy' ? 'page' : undefined} href="/privacy" onClick={(event) => { event.preventDefault(); navigate('/privacy'); }}>Privacy Policy</a>
      </nav>
      <div className="top-actions">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
        {user ? <><span className="signed-name">Hi, {user.username}</span><button className="button signout-button" onClick={signout}><LogOut size={15} /> Sign out</button></> : <button className="button outline" onClick={() => navigate('/')}>Sign in <ArrowRight size={15} /></button>}
        <button className="menu-toggle" onClick={() => setMenu(!menu)} aria-label="Navigation">{menu ? <X /> : <Menu />}</button>
      </div>
    </header>

    {screen === 'landing' && <>
      <section className="hero wrap"><div><div className="eyebrow"><i /> A clearer first look at plant health</div><h1>Know what’s<br />growing <em>wrong.</em></h1><p className="lede">A leaf can tell you a lot. Take a photo, get an AI-powered first look, and take your next step with more confidence.</p><button className="button dark" onClick={() => navigate('/check#diagnose')}>Check a leaf <ArrowRight size={17} /></button><div className="proof"><span className="proof-icon">✳</span> Made with farmers in mind <b>·</b> 4 crop families</div></div><div className="hero-art"><div className="sun" /><div className="rings" /><div className="leaf-art"><i /><i /><i /></div><div className="scan-tag"><i /> PLANT SCAN, SIMPLIFIED</div><div className="note"><ShieldCheck size={18} /><span><b>A better first step</b><small>Spot signs, act sooner</small></span><ArrowRight size={15} /></div><div className="caption">01 / 04 <span>Healthy crops start with attention</span></div></div></section>
      <div className="trust wrap"><span>BUILT FOR THE CROPS YOU GROW</span>{crops.map((cropName, index) => <b key={cropName}><i className={`crop-dot dot${index}`} />{cropName}</b>)}</div>
    </>}

    {screen === 'check' && <>
    <section className="diagnose" id="diagnose"><div className="wrap diag-grid"><div className="intro"><div className="eyebrow"><i /> Your next step starts here</div><h2>Let’s take a<br /><em>closer look.</em></h2><p>Upload a well-lit photo of one leaf. CropGuard AI will compare it with the signs it has learned to recognize.</p><div className="privacy"><ShieldCheck size={18} />Your photo is used to create this result and is not saved to your profile.</div></div>
      <form className="upload-card" onSubmit={diagnose}><div className="card-head"><div><small>STEP 01 — ADD A PHOTO</small><h3>Start with a leaf</h3></div><span>01</span></div><div className={`dropzone ${preview ? 'has-image' : ''}`} onClick={(event) => { if (event.target !== input.current) input.current?.click(); }} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); pick(event.dataTransfer.files[0]); }} role="button" tabIndex="0" aria-label="Choose or drop a crop leaf photo" onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); input.current?.click(); } }}><input ref={input} hidden type="file" accept="image/*" onClick={(event) => event.stopPropagation()} onChange={(event) => { pick(event.target.files[0]); event.target.value = ''; }} />{preview ? <><img src={preview} alt="Selected crop leaf" /><span className="replace"><UploadCloud size={16} />Choose another image</span></> : <><span className="upload-icon"><UploadCloud size={22} /></span><b>Drop your leaf photo here</b><span>or <u>browse files</u> on your device</span><small>JPG, PNG · Up to 10 MB</small></>}</div>
      <div className="crop-select"><span><b>CROP TYPE</b><small>Compare this with the model’s result</small></span><label><select value={crop} onChange={(event) => setCrop(event.target.value)}><option value="">No selection</option>{crops.map((cropName) => <option key={cropName}>{cropName}</option>)}</select><ChevronDown size={15} /></label></div>
      <button className="button dark submit" disabled={busy}>{busy ? <><LoaderCircle className="spin" size={17} /> Looking at your leaf…</> : <>Get my first look <ArrowRight size={17} /></>}</button>
      {(error || notice) && <div className={`feedback ${error ? 'bad' : ''}`} role="status">{error || notice}</div>}
      {result && <><div className="result"><span><Leaf size={19} /></span><div><small>POTENTIAL MATCH</small><b>{label(result.disease)}</b><p>{Number(result.confidence).toFixed(1)}% model confidence</p>{crop && result.disease.split('___')[0].toLowerCase() !== crop.toLowerCase() && <p className="crop-warning">You selected {crop}; check that the photo shows this crop.</p>}</div><Check size={17} /></div><section className="advice-card" aria-labelledby="advice-title"><div className="advice-heading"><span><Sprout size={18} /></span><div><small>WHAT TO DO NEXT</small><h4 id="advice-title">Suggested next steps</h4></div></div><p>{result.advice?.summary || 'Ask a local agricultural extension officer to confirm this result.'}</p><ul>{(result.advice?.actions || ['Inspect several plants for the same signs.', 'Contact a local agricultural extension officer for crop-specific advice.']).map((action, index) => <li key={index}>{action}</li>)}</ul>{result.advice?.source && <a className="advice-source" href={result.advice.source.url} target="_blank" rel="noreferrer">Source: {result.advice.source.name} <ArrowRight size={13} /></a>}<small className="advice-note">A photo match is not a confirmed diagnosis. Follow local guidance and product labels before using any pesticide.</small></section></>}
      {!token && <p className="hint">You’ll need to <button type="button" onClick={() => navigate('/')}>sign in</button> before your first analysis.</p>}</form></div></section>

    <section className="history-section wrap" id="history"><div className="history-head"><div><div className="eyebrow"><i /> YOUR FIELD NOTES</div><h2>Recent <em>checks.</em></h2><p>Keep an eye on the changes you’ve noticed in your crops.</p></div>{user ? <span className="history-count"><CalendarDays size={15} /> {history.length} saved {history.length === 1 ? 'check' : 'checks'}</span> : <button className="button outline" onClick={() => navigate('/login')}>Sign in to save checks <ArrowRight size={14} /></button>}</div>
      {user && history.length ? <div className="history-grid">{history.slice(0, 4).map((entry) => <article className="history-card" key={entry.id}><span className="history-icon"><Leaf size={18} /></span><div className="history-card-content"><small>{new Date(entry.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</small><b>{label(entry.disease)}</b><span>{Number(entry.confidence).toFixed(1)}% model confidence</span></div><ArrowRight size={16} /></article>)}</div> : <div className="history-empty"><span><CircleUserRound size={22} /></span><div><b>{user ? 'Your crop checks will appear here.' : 'Your next check starts with a photo.'}</b><p>{user ? 'Run a diagnosis and your latest results will be saved on this device.' : 'Sign in to keep your recent checks together.'}</p></div>{user ? <a href="#diagnose">Check a leaf <ArrowRight size={15} /></a> : <button onClick={() => navigate('/')}>Sign in <ArrowRight size={15} /></button>}</div>}
    </section>
    </>}

    {screen === 'landing' && <section className="how wrap" id="how"><div className="eyebrow"><i /> Simple by design</div><div className="how-title"><h2>A little insight.<br /><em>A lot more clarity.</em></h2><p>Keep it simple: one photo, one starting point, and a clearer idea of what to do next.</p></div><div className="steps"><article><small>01</small><span className="step-icon">↗</span><h3>Share a photo</h3><p>Choose a clear picture of the affected leaf in natural light.</p></article><article><small>02</small><span className="step-icon gold">✳</span><h3>Get a first look</h3><p>Our image model checks for patterns across supported crop conditions.</p></article><article><small>03</small><span className="step-icon blue">✓</span><h3>Plan your next step</h3><p>Use the result to start a conversation with someone who knows your crop.</p></article></div><button className="button dark page-cta" onClick={() => navigate('/check')}>Start a leaf check <ArrowRight size={16} /></button></section>}
    {screen === 'crops' && <section className="crops" id="crops"><div className="wrap crop-inner"><div><div className="eyebrow"><i /> In the field</div><h2>Focused on crops<br />that <em>matter.</em></h2></div><div className="crop-list">{crops.map((cropName, index) => <div className="crop-row" key={cropName}><span>0{index + 1}</span><b>{cropName}</b><small><i /> Supported crop</small><ArrowRight size={16} /></div>)}</div></div></section>}
    {screen === 'about' && <section className="closing wrap" id="about"><span className="closing-icon"><Sprout /></span><div><div className="eyebrow"><i /> A helpful place to begin</div><h2>Better questions<br />start with <em>a closer look.</em></h2><button className="text-link" onClick={() => navigate('/check')}>Check a leaf <ArrowRight size={16} /></button></div><p>CropGuard AI is an early guide, designed to help you notice possible issues sooner. It does not replace a diagnosis from an agricultural professional.</p></section>}
    {screen === 'privacy' && <section className="privacy-policy wrap"><div className="eyebrow"><i /> Your information</div><h1>Privacy Policy</h1><p className="policy-updated">Last updated November 20, 2026</p><p>CropGuard AI helps you review crop leaf photos. This page explains what information the app handles and where it is stored.</p><h2>Information the app uses</h2><p>When you create an account, you provide a username and email address. When you sign in, the app stores authentication tokens in your browser so you can use account features.</p><p>If you run a crop check, the leaf photo is sent to the CropGuard API to generate a prediction. The photo is not added to your saved history. The history stores the prediction label, confidence score, and date in your browser, associated with your username.</p><h2>How information is used</h2><p>Account information is used to sign you in. Photos are processed to return a crop prediction. Saved check details are used to show your recent results on the Check a leaf page.</p><h2>Storage and your choices</h2><p>Authentication tokens and check history are stored in this browser. History does not automatically sync to your other devices. Signing out removes the authentication tokens from this browser but leaves its saved history in place. Clearing this site’s browser storage removes locally saved tokens and history.</p><h2>Service providers</h2><p>Crop photos and account requests are sent to the CropGuard API hosted on Render to provide the app’s features. Do not upload images containing information you do not want processed for a crop check.</p><h2>Contact</h2><p>For questions or privacy requests, contact the CropGuard AI operator using the support contact provided with the service.</p></section>}
    <footer className="footer wrap"><a className="brand" href="/how-it-works" onClick={(event) => { event.preventDefault(); navigate('/how-it-works'); }}><img className="brand-logo" src="/cropguard-logo.svg" alt="" /><b>CropGuard AI</b></a><span>Thoughtful tools for healthier crops.</span><span>© {new Date().getFullYear()} CropGuard AI</span></footer>
  </main>;
}
