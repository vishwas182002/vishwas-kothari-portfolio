'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Moon,
  Sun,
  Copy,
  Check,
  SlidersHorizontal,
  RotateCcw,
  RotateCw,
  X,
  ChevronDown,
  CodeXml,
  ExternalLink,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import data from './portfolio-data.json';
import './fonts.css';
import { researchNotes } from './research-notes';
import CreativeInspector from './creative-inspector';

const fonts = [
  'Bricolage',
  'Figtree',
  'Instrument Serif',
  'Geist',
  'Newsreader',
  'Instrument Sans',
  'Fraunces',
  'Manrope',
  'GentiumPlus',
];
const fontLabel = (x: string) =>
  x === 'Bricolage'
    ? 'Bricolage Grotesque'
    : x === 'GentiumPlus'
      ? 'Gentium Plus'
      : x;
const pairings = [
  ['Instrument Serif', 'Geist'],
  ['Newsreader', 'Instrument Sans'],
  ['Bricolage', 'Manrope'],
  ['Instrument Serif', 'Figtree'],
  ['Fraunces', 'Geist'],
  ['Newsreader', 'Geist'],
  ['Bricolage', 'Figtree'],
  ['GentiumPlus', 'Manrope'],
];
const defaults = {
  heading: 'Bricolage',
  body: 'Figtree',
  scale: 'golden',
  spacing: 'balanced',
  motion: true,
};
type Preferences = typeof defaults;
const email = 'vishwasvkothari@gmail.com';
const resume =
  'https://vishwas182002.github.io/vishwas-kothari-portfolio/resume_vk.pdf';
const shortTitles = [
  'FINAGENT\nEVAL',
  'FINANCIAL\nDOCUMENT\nVQA',
  'XAI\nCREDIT\nLENS',
  'ADAM\nVS. SGD',
];
const categories = [
  'MODEL EVALUATION',
  'DOCUMENT INTELLIGENCE',
  'EXPLAINABLE AI',
  'OPTIMIZATION',
];
const colors = ['#ecede7', '#e3e887', '#d8dedf', '#c5c6f1'];
const projectMetrics = [
  ['397', 'questions'],
  ['79', 'document images'],
  ['30,000', 'records'],
  ['2', 'optimizers'],
];
function validPrefs(value: unknown): Preferences {
  const p = (value || {}) as Partial<Preferences>;
  return {
    heading: fonts.includes(p.heading || '') ? p.heading! : defaults.heading,
    body: fonts.includes(p.body || '') ? p.body! : defaults.body,
    scale: ['standard', 'golden'].includes(p.scale || '')
      ? p.scale!
      : defaults.scale,
    spacing: ['compact', 'balanced', 'airy'].includes(p.spacing || '')
      ? p.spacing!
      : defaults.spacing,
    motion: typeof p.motion === 'boolean' ? p.motion : true,
  };
}
function Corners() {
  return (
    <span className="corners" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}
function Note({
  number,
  title,
  children,
  right = false,
  enabled,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
  right?: boolean;
  enabled: boolean;
}) {
  return (
    <aside
      className={'margin-note ' + (right ? 'note-right' : 'note-left')}
      aria-hidden={!enabled}
    >
      <b>
        {number} / {title}
      </b>
      <span>{children}</span>
      <svg viewBox="0 0 64 48" fill="none">
        <path
          d="M3 39C8 10 34 6 59 17M49 7Q55 13 59 17Q53 18 48 23"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </aside>
  );
}
function Book({
  index,
  angle,
  large = false,
}: {
  index: number;
  angle?: { x: number; y: number };
  large?: boolean;
}) {
  const p = data.projects[index];
  return (
    <div
      className={'book ' + (large ? 'large-book' : '')}
      style={
        {
          '--cover': colors[index],
          ...(angle
            ? { transform: `rotateX(${angle.x}deg) rotateY(${angle.y}deg)` }
            : {}),
        } as CSSProperties
      }
      aria-hidden="true"
    >
      <div className="book-face book-front">
        <div className="cover-top">
          <span>RESEARCH NOTES</span>
          <span>0{index + 1}</span>
        </div>
        <strong className="cover-title">{shortTitles[index]}</strong>
        <div className={'cover-diagram diagram-' + index}>
          {Array.from({ length: 48 }, (_, i) => (
            <i
              key={i}
              style={
                {
                  '--i': i,
                  '--v': (((i * 7 + index * 3) % 11) + 2) / 13,
                } as CSSProperties
              }
            />
          ))}
        </div>
        <div className="cover-footer">
          <span>VISHWAS KOTHARI</span>
          <span>2026</span>
        </div>
      </div>
      <div className="book-face book-back">
        <span className="back-mark">VK.</span>
        <p>{p.subtitle}</p>
        <span>
          {categories[index]}
          <br />
          Vishwas Kothari · 2026
        </span>
      </div>
      <div className="book-face book-spine">
        <span>{p.title}</span>
        <span>VK</span>
      </div>
      <div className="book-face book-edge" />
      <div className="book-face book-top" />
      <div className="book-face book-bottom" />
    </div>
  );
}
function FontSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <Select value={value} onValueChange={(v) => v && onChange(v)}>
        <SelectTrigger className="font-trigger" aria-label={label}>
          <SelectValue>{fontLabel(value)}</SelectValue>
        </SelectTrigger>
        <SelectContent className="font-options" alignItemWithTrigger={false}>
          {fonts.map((f) => (
            <SelectItem key={f} value={f}>
              {fontLabel(f)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}
function Segments({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <fieldset className="segment-field">
      <legend>{label}</legend>
      <RadioGroup
        aria-label={label}
        value={value}
        onValueChange={(v) => onChange(String(v))}
        className="segments"
      >
        {options.map((o) => (
          <label key={o} className={'segment ' + (o === value ? 'chosen' : '')}>
            <RadioGroupItem value={o} />
            <span>{o[0].toUpperCase() + o.slice(1)}</span>
          </label>
        ))}
      </RadioGroup>
    </fieldset>
  );
}

export default function Portfolio() {
  const [dark, setDark] = useState(true),
    [creative, setCreative] = useState(false),
    [time, setTime] = useState('MT');
  const [prefs, setPrefs] = useState<Preferences>(defaults),
    [ready, setReady] = useState(false),
    [styleOpen, setStyleOpen] = useState(false),
    [saveStatus, setSaveStatus] = useState('');
  const [selected, setSelected] = useState(0),
    [bookOpen, setBookOpen] = useState(false),
    [angle, setAngle] = useState({ x: -5, y: -20 }),
    [copyStatus, setCopyStatus] = useState(''),
    [page, setPage] = useState(0);
  const portrait = useRef<HTMLDivElement>(null),
    folio = useRef<HTMLElement>(null),
    shelf = useRef<HTMLDivElement>(null),
    opener = useRef<HTMLButtonElement | null>(null),
    drag = useRef<{ x: number; y: number; rx: number; ry: number } | null>(
      null,
    ),
    statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [columnWidth, setColumnWidth] = useState(600);
  useEffect(() => {
    if (!folio.current) return;
    const observer = new ResizeObserver((entries) =>
      setColumnWidth(Math.round(entries[0].contentRect.width)),
    );
    observer.observe(folio.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    setDark(root.dataset.theme !== 'light');
    try {
      setPrefs(
        validPrefs(
          JSON.parse(localStorage.getItem('vk.creative.v2') || 'null'),
        ),
      );
    } catch {}
    setReady(true);
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/Denver',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const r = document.documentElement;
    r.style.setProperty('--heading', `'${prefs.heading}',sans-serif`);
    r.style.setProperty('--body', `'${prefs.body}',sans-serif`);
    r.dataset.scale = prefs.scale;
    r.dataset.spacing = prefs.spacing;
    r.dataset.motion = prefs.motion ? 'on' : 'off';
  }, [prefs, ready]);
  useEffect(() => {
    const el = portrait.current;
    if (!el) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(pointer: fine)');
    const neutral = () => {
      el.style.backgroundPosition = '50% 50%';
      el.style.setProperty('--pitch', '0deg');
      el.style.setProperty('--yaw', '0deg');
    };
    const move = (e: PointerEvent) => {
      if (
        !prefs.motion ||
        reduced.matches ||
        !fine.matches ||
        e.pointerType === 'touch'
      )
        return neutral();
      const b = el.getBoundingClientRect();
      const dx = e.clientX - b.left - b.width / 2,
        dy = e.clientY - b.top - b.height / 2;
      const x = Math.abs(dx) < 45 ? 1 : dx < 0 ? 0 : 2,
        y = Math.abs(dy) < 45 ? 1 : dy < 0 ? 0 : 2;
      el.style.backgroundPosition = `${x * 50}% ${y * 50}%`;
      el.style.setProperty(
        '--pitch',
        `${Math.max(-3, Math.min(3, -dy / 100))}deg`,
      );
      el.style.setProperty(
        '--yaw',
        `${Math.max(-3, Math.min(3, dx / 100))}deg`,
      );
    };
    document.addEventListener('pointermove', move);
    document.documentElement.addEventListener('pointerleave', neutral);
    neutral();
    return () => {
      document.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', neutral);
    };
  }, [prefs.motion]);
  useEffect(() => {
    if (
      !ready ||
      !prefs.motion ||
      matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    const targets = [
      ...document.querySelectorAll<HTMLElement>('[data-reveal]'),
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.07, rootMargin: '0px 0px -24px 0px' },
    );
    targets.forEach((el) => {
      if (el.getBoundingClientRect().top > innerHeight) {
        el.classList.add('reveal-pending');
        observer.observe(el);
      }
    });
    return () => {
      observer.disconnect();
      targets.forEach((el) => el.classList.remove('reveal-pending'));
    };
  }, [ready, prefs.motion]);
  useEffect(() => {
    const onHash = () => {
      const idx = data.projects.findIndex((p) => '#' + p.id === location.hash);
      if (idx >= 0) {
        setSelected(idx);
        setAngle({ x: -5, y: -20 });
        setBookOpen(true);
      }
    };
    onHash();
    addEventListener('hashchange', onHash);
    return () => removeEventListener('hashchange', onHash);
  }, []);
  useEffect(
    () => () => {
      if (statusTimer.current) clearTimeout(statusTimer.current);
    },
    [],
  );
  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const next = !dark;
    const root = document.documentElement;
    root.style.setProperty('--theme-x', `${event.clientX}px`);
    root.style.setProperty('--theme-y', `${event.clientY}px`);
    const apply = () => {
      setDark(next);
      root.dataset.theme = next ? 'dark' : 'light';
      root.classList.toggle('dark', next);
      try {
        localStorage.setItem('theme', next ? 'dark' : 'light');
      } catch {}
    };
    if (
      document.startViewTransition &&
      prefs.motion &&
      !matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      document.startViewTransition(apply);
    else apply();
  };
  const update = (p: Partial<Preferences>) => {
    setPrefs((old) => ({ ...old, ...p }));
    setSaveStatus('Unsaved changes');
  };
  const save = () => {
    try {
      localStorage.setItem('vk.creative.v2', JSON.stringify(prefs));
      setSaveStatus('Saved');
    } catch {
      setSaveStatus('Applied for this visit; storage is unavailable.');
    }
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopyStatus('Copied!');
    } catch {
      setCopyStatus('Copy unavailable. Use the Email link below.');
    }
    if (statusTimer.current) clearTimeout(statusTimer.current);
    statusTimer.current = setTimeout(() => setCopyStatus(''), 4500);
  };
  const showBook = (i: number, e: React.MouseEvent<HTMLButtonElement>) => {
    opener.current = e.currentTarget;
    setSelected(i);
    setAngle({ x: -5, y: -20 });
    setBookOpen(true);
  };
  const scrollShelf = (direction: number) => {
    if (!shelf.current) return;
    const child = shelf.current.firstElementChild as HTMLElement;
    const step = child.offsetWidth + 26;
    shelf.current.scrollBy({
      left: direction * step,
      behavior:
        prefs.motion && !matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'smooth'
          : 'instant',
    });
  };
  const pairIndex = pairings.findIndex(
    (p) => p[0] === prefs.heading && p[1] === prefs.body,
  );
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <main ref={folio} className="folio" id="main" data-creative={creative}>
        <div className="column-measure" aria-hidden="true">
          <span>{columnWidth} px</span>
        </div>
        <header id="top">
          <div className="masthead">
            <span>
              Boulder, CO <span className="slash">/</span>{' '}
              <time aria-label="Current time in Boulder">{time}</time>
            </span>
            <div className="page-controls">
              <span title="Original English text" lang="en">
                EN
              </span>
              <span className="control-divider" />
              <button
                className="icon-button theme-button"
                onClick={toggleTheme}
                aria-label={
                  dark ? 'Switch to light mode' : 'Switch to dark mode'
                }
                aria-pressed={dark}
              >
                {dark ? <Moon size={18} /> : <Sun size={18} />}
              </button>
            </div>
          </div>
          <div className="portrait-line">
            <div
              ref={portrait}
              className="portrait"
              role="img"
              aria-label="Portrait of Vishwas Kothari, following the cursor"
            />
            <div
              className="portrait-side"
              data-inspect-label="Portrait and actions"
            >
              <div className="starfield" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <p>{data.kicker}</p>
              <div className="hero-actions">
                <span
                  className="selection switch-frame"
                  data-inspect-label="Creative mode"
                  title="Creative mode: research notes"
                >
                  <Switch
                    className="creative-switch"
                    checked={creative}
                    onCheckedChange={(v) => {
                      setCreative(v);
                      if (!v) setStyleOpen(false);
                    }}
                    aria-label="Creative mode"
                  />
                  <Corners />
                </span>
                <a
                  className="selection"
                  href="#contact"
                  onClick={() =>
                    document
                      .getElementById('contact')
                      ?.focus({ preventScroll: true })
                  }
                >
                  Send message <ArrowUpRight size={16} />
                  <Corners />
                </a>
              </div>
            </div>
            <Note enabled={creative} number="01" title="A little eye contact">
              Eight directions.
              <br />A different portrait when the lights go out.
            </Note>
          </div>
          <div className="name-block">
            <h1>{data.name}</h1>
            <p className="role">{data.role}</p>
            <Note
              enabled={creative}
              number="02"
              title="What keeps me curious"
              right
            >
              Finding where a model breaks.
              <br />
              Then figuring out why.
            </Note>
          </div>
          <div
            className="intro-copy"
            id="about"
            data-inspect-label="Introduction"
          >
            {data.about.map((p, i) => (
              <div className="intro-passage" key={i}>
                <p
                  className="word-reveal"
                  dangerouslySetInnerHTML={{ __html: p }}
                />
                {i === 2 && (
                  <Note
                    enabled={creative}
                    number="03"
                    title="From oceans to models"
                  >
                    At ISRO, the reference was a real ocean sample.
                    <br />
                    The habit of checking the answer stayed.
                  </Note>
                )}
              </div>
            ))}
          </div>
          <nav className="intro-links" aria-label="Profile links">
            <a href={resume} target="_blank" rel="noreferrer">
              Resume <ArrowUpRight size={14} />
            </a>
            <a
              href="https://linkedin.com/in/vishwas-kothari"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn <ArrowUpRight size={14} />
            </a>
            <a
              href="https://github.com/vishwas182002"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <ArrowUpRight size={14} />
            </a>
          </nav>
        </header>
        <section
          className="section research-section"
          id="research"
          aria-labelledby="research-title"
          data-reveal
        >
          <div className="section-heading">
            <h2 id="research-title">Projects and Research</h2>
            <span>2026</span>
          </div>
          <Note enabled={creative} number="04" title="A closer look" right>
            Pick up a cover, turn it around, or jump into the project.
          </Note>
          <div
            ref={shelf}
            className="book-shelf"
            aria-label="Research project covers"
            onScroll={() => {
              if (shelf.current) {
                const first = shelf.current.firstElementChild as HTMLElement;
                const next = Math.round(
                  shelf.current.scrollLeft / (first.offsetWidth + 26),
                );
                setPage(next);
              }
            }}
          >
            {data.projects.map((p, i) => (
              <article className="publication" key={p.id} id={p.id}>
                <button
                  className="shelf-book"
                  aria-label={'Preview project: ' + p.title}
                  aria-haspopup="dialog"
                  onClick={(e) => showBook(i, e)}
                >
                  <Book index={i} />
                  <span className="preview-tag">
                    Take a closer look <ArrowUpRight size={12} />
                  </span>
                </button>
                <button
                  className="publication-title"
                  onClick={(e) => showBook(i, e)}
                >
                  {p.title}
                </button>
                <p className="publication-subtitle">{p.subtitle}</p>
                <div className="publication-links">
                  {p.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {l.label}
                      <ArrowUpRight size={12} />
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <div className="shelf-toolbar">
            <span>Pick a cover to take a closer look.</span>
            <div>
              <span className="shelf-count">0{page + 1} / 04</span>
              <button
                className="icon-button"
                aria-label="Previous projects"
                disabled={page === 0}
                onClick={() => scrollShelf(-1)}
              >
                <ArrowLeft size={16} />
              </button>
              <button
                className="icon-button"
                aria-label="Next projects"
                disabled={
                  shelf.current
                    ? Math.ceil(
                        shelf.current.scrollLeft + shelf.current.clientWidth,
                      ) >= shelf.current.scrollWidth
                    : false
                }
                onClick={() => scrollShelf(1)}
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
        <section
          className="section original-section"
          id="experience"
          data-reveal
        >
          <h2>Experience</h2>
          <Note
            enabled={creative}
            number="05"
            title="Where the skepticism started"
          >
            Real satellite data. Numerical optimization. Results checked against
            the ocean.
          </Note>
          <div
            className="original-content"
            dangerouslySetInnerHTML={{
              __html: data.experience.replace(/<h2>[^<]*<\/h2>/, ''),
            }}
          />
        </section>
        <section
          className="section original-section"
          id="education"
          data-reveal
        >
          <h2>Education</h2>
          <Note
            enabled={creative}
            number="06"
            title="Still asking questions"
            right
          >
            From VIT to Boulder. More to learn, more assumptions to question.
          </Note>
          <div
            className="original-content"
            dangerouslySetInnerHTML={{
              __html: data.education.replace(/<h2>[^<]*<\/h2>/, ''),
            }}
          />
        </section>
        <section
          className="section original-section"
          id="recognition"
          data-reveal
        >
          <h2>Recognition</h2>
          <Note enabled={creative} number="07" title="Beyond the experiments">
            Writing, reviewing, and thinking about the responsibility that comes
            with AI.
          </Note>
          <div
            className="original-content"
            dangerouslySetInnerHTML={{
              __html: data.recognition.replace(/<h2>[^<]*<\/h2>/, ''),
            }}
          />
        </section>
        <section className="section original-section" id="skills" data-reveal>
          <h2>Skills</h2>
          <Note
            enabled={creative}
            number="08"
            title="Tools with a purpose"
            right
          >
            From messy data to model behavior and the tools to understand what
            happened in between.
          </Note>
          <div
            className="original-content"
            dangerouslySetInnerHTML={{
              __html: data.skills.replace(/<h2>[^<]*<\/h2>/, ''),
            }}
          />
        </section>
        <section
          className="section contact-section"
          id="contact"
          tabIndex={-1}
          data-reveal
        >
          <h2>Let&apos;s talk about reliable AI.</h2>
          <p className="contact-kicker">
            <i />
            Available now
          </p>
          <p className="contact-prose">
            Open to full-time roles in machine learning engineering, applied AI,
            data science, and model evaluation, especially on teams that care
            about evidence, reliability, and real-world behavior.
          </p>
          <div className="availability">
            <span>Boulder, CO</span>
            <span>Full-time roles</span>
            <span>AI, ML, Data Science</span>
          </div>
          <div className="email-anchor">
            <Note enabled={creative} number="09" title="It starts here">
              A good product starts with a conversation.
            </Note>
            <button
              className="selection email-button"
              onClick={copy}
              aria-label={'Copy email address: ' + email}
            >
              {email}
              {copyStatus === 'Copied!' ? (
                <Check size={16} />
              ) : (
                <Copy size={16} />
              )}
              <Corners />
            </button>
            <p className="copy-status" role="status">
              {copyStatus}
            </p>
          </div>
          <div className="contact-links">
            <a href={'mailto:' + email}>
              <span>Email</span>
              <strong>
                Start a conversation <ArrowUpRight size={13} />
              </strong>
              <small>{email}</small>
            </a>
            <a
              href="https://linkedin.com/in/vishwas-kothari"
              target="_blank"
              rel="noreferrer"
            >
              <span>LinkedIn</span>
              <strong>
                Connect professionally <ArrowUpRight size={13} />
              </strong>
              <small>Profile, updates, and background.</small>
            </a>
            <a
              href="https://github.com/vishwas182002"
              target="_blank"
              rel="noreferrer"
            >
              <span>GitHub</span>
              <strong>
                Review the code <ArrowUpRight size={13} />
              </strong>
              <small>Projects, experiments, and demos.</small>
            </a>
            <a href={resume} target="_blank" rel="noreferrer">
              <span>Résumé</span>
              <strong>
                Download résumé <ArrowUpRight size={13} />
              </strong>
              <small>Education, experience, and selected work.</small>
            </a>
          </div>
        </section>
        <footer className="colophon">
          <span>Vishwas Kothari. Last updated 2026.</span>
          <a href="#top">Home ↑</a>
        </footer>
      </main>
      <CreativeInspector enabled={creative && !styleOpen && !bookOpen} />
      {creative && (
        <aside className="style-dock" aria-label="Style controls">
          <Popover open={styleOpen} onOpenChange={setStyleOpen}>
            <PopoverTrigger className="style-trigger">
              <SlidersHorizontal size={16} />
              Style
              <ChevronDown
                size={15}
                style={{ transform: styleOpen ? 'rotate(180deg)' : 'none' }}
              />
            </PopoverTrigger>
            <PopoverContent
              side="top"
              align="end"
              sideOffset={16}
              className="style-panel"
              aria-label="Creative style settings"
            >
              <div className="panel-heading">
                <div>
                  <strong>Style</strong>
                  <p>Make this space your own</p>
                </div>
                <button
                  className="icon-button panel-close"
                  aria-label="Close style settings"
                  onClick={() => setStyleOpen(false)}
                >
                  <X size={16} />
                </button>
              </div>
              <label className="field">
                <span>Font pairing</span>
                <Select
                  value={String(pairIndex)}
                  onValueChange={(v) => {
                    const p = pairings[Number(v)];
                    if (p) update({ heading: p[0], body: p[1] });
                  }}
                >
                  <SelectTrigger
                    className="font-trigger"
                    aria-label="Font pairing"
                  >
                    <SelectValue>
                      {pairIndex < 0
                        ? 'Custom'
                        : pairings[pairIndex].map(fontLabel).join(' + ')}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent
                    className="font-options"
                    alignItemWithTrigger={false}
                  >
                    <SelectItem value="-1">Custom</SelectItem>
                    {pairings.map((p, i) => (
                      <SelectItem key={i} value={String(i)}>
                        {p.map(fontLabel).join(' + ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
              <div className="font-grid">
                <FontSelect
                  label="Heading font"
                  value={prefs.heading}
                  onChange={(v) => update({ heading: v })}
                />
                <FontSelect
                  label="Body font"
                  value={prefs.body}
                  onChange={(v) => update({ body: v })}
                />
              </div>
              <Segments
                label="Type scale"
                value={prefs.scale}
                options={['standard', 'golden']}
                onChange={(v) => update({ scale: v })}
              />
              <Segments
                label="Spacing"
                value={prefs.spacing}
                options={['compact', 'balanced', 'airy']}
                onChange={(v) => update({ spacing: v })}
              />
              <Segments
                label="Motion"
                value={prefs.motion ? 'on' : 'off'}
                options={['off', 'on']}
                onChange={(v) => update({ motion: v === 'on' })}
              />
              <div className="panel-footer">
                <button
                  onClick={() => {
                    setPrefs(defaults);
                    setSaveStatus('Defaults restored. Save to keep.');
                  }}
                >
                  Reset
                </button>
                <span role="status">{saveStatus}</span>
                <button className="save-button" onClick={save}>
                  Save
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </aside>
      )}
      <Dialog open={bookOpen} onOpenChange={setBookOpen}>
        <DialogContent
          className="project-dialog"
          showCloseButton={false}
          finalFocus={() => opener.current}
        >
          <DialogClose className="dialog-back">
            <ArrowLeft size={16} />
            Back to projects <kbd>esc</kbd>
          </DialogClose>
          <div className="inspection-layout">
            <div className="inspection-visual">
              <div
                className="drag-stage"
                role="group"
                aria-label="Project cover. Drag to rotate, or use arrow keys."
                tabIndex={0}
                onKeyDown={(e) => {
                  if (
                    [
                      'ArrowLeft',
                      'ArrowRight',
                      'ArrowUp',
                      'ArrowDown',
                      'Home',
                    ].includes(e.key)
                  ) {
                    e.preventDefault();
                    setAngle((old) =>
                      e.key === 'Home'
                        ? { x: -5, y: -20 }
                        : {
                            x: Math.max(
                              -35,
                              Math.min(
                                35,
                                old.x +
                                  (e.key === 'ArrowUp'
                                    ? 10
                                    : e.key === 'ArrowDown'
                                      ? -10
                                      : 0),
                              ),
                            ),
                            y:
                              old.y +
                              (e.key === 'ArrowLeft'
                                ? -35
                                : e.key === 'ArrowRight'
                                  ? 35
                                  : 0),
                          },
                    );
                  }
                }}
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  drag.current = {
                    x: e.clientX,
                    y: e.clientY,
                    rx: angle.x,
                    ry: angle.y,
                  };
                }}
                onPointerMove={(e) => {
                  if (drag.current)
                    setAngle({
                      x: Math.max(
                        -35,
                        Math.min(
                          35,
                          drag.current.rx - (e.clientY - drag.current.y) * 0.3,
                        ),
                      ),
                      y: drag.current.ry + (e.clientX - drag.current.x) * 0.65,
                    });
                }}
                onPointerUp={() => {
                  drag.current = null;
                }}
                onPointerCancel={() => {
                  drag.current = null;
                }}
              >
                <Book index={selected} large angle={angle} />
              </div>
              <div className="rotation-controls">
                <button
                  className="icon-button"
                  aria-label="Rotate cover left"
                  onClick={() => setAngle((old) => ({ ...old, y: old.y - 35 }))}
                >
                  <RotateCcw size={17} />
                </button>
                <span>Drag to turn</span>
                <button
                  className="icon-button"
                  aria-label="Rotate cover right"
                  onClick={() => setAngle((old) => ({ ...old, y: old.y + 35 }))}
                >
                  <RotateCw size={17} />
                </button>
              </div>
            </div>
            <div className="inspection-copy">
              <span className="eyebrow">{categories[selected]} · 2026</span>
              <DialogTitle className="project-dialog-title">
                {data.projects[selected].title}
              </DialogTitle>
              <DialogDescription className="project-dialog-description">
                {data.projects[selected].subtitle}
              </DialogDescription>
              <div className="project-metric">
                <strong>{projectMetrics[selected][0]}</strong>
                <span>{projectMetrics[selected][1]}</span>
              </div>
              <div className="project-actions">
                {data.projects[selected].links.map((l) => (
                  <a
                    className="selection"
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {l.label === 'Code' ? (
                      <CodeXml size={16} />
                    ) : (
                      <ExternalLink size={16} />
                    )}{' '}
                    {l.label}
                    <ArrowUpRight size={15} />
                    <Corners />
                  </a>
                ))}
              </div>
            </div>
          </div>
          {creative && (
            <aside className="research-sheet" aria-label="Research notes">
              <span className="research-sheet-label">
                From the research notebook
              </span>
              <h3>{researchNotes[selected].title}</h3>
              <dl>
                <div>
                  <dt>Question</dt>
                  <dd>{researchNotes[selected].question}</dd>
                </div>
                <div>
                  <dt>Experiment</dt>
                  <dd>{researchNotes[selected].method}</dd>
                </div>
                <div>
                  <dt>Finding</dt>
                  <dd>{researchNotes[selected].finding}</dd>
                </div>
              </dl>
              <p>{researchNotes[selected].takeaway}</p>
            </aside>
          )}
          <div className="project-full-copy">
            {data.projects[selected].paragraphs.map((p, i) => (
              <p
                key={i}
                className={p.startsWith('Tech stack:') ? 'tech-stack' : ''}
                dangerouslySetInnerHTML={{ __html: p }}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
