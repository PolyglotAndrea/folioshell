// ╔══════════════════════════════════════════════════════╗
// ║  CONFIG — edit this section to personalise           ║
// ╚══════════════════════════════════════════════════════╝
const CONFIG = {
  user:  'andrea',
  host:  'cognix.one',
  name:  'B. Andrea Horvath',
  title: 'Senior AI Full-Stack Architect · Founder of Cognix.one',
  bio: [
    'A seasoned architect with 10+ years bridging high-performance systems',
    'and modern artificial intelligence.',
    '',
    'From low-level memory management in Rust to enterprise-grade Java',
    'ecosystems and cutting-edge AI Agent orchestration — I specialize in',
    'building "Cognitive Infrastructure" that is scalable, resilient,',
    'and future-proof.',
    '',
    '"Code is the infrastructure of thought. In the age of AI, the',
    ' architect\'s job is to ensure that thought has a scalable, safe,',
    ' and efficient container to grow in."',
  ],
  interests: [
    { icon: '🤖', text: 'AI Agent Orchestration & Multi-Agent Systems' },
    { icon: '🦀', text: 'Rust & Go — high-performance systems' },
    { icon: '☁️',  text: 'Cloud-native infra: Kubernetes, Terraform' },
    { icon: '🔒', text: 'Secure Software Supply Chain' },
    { icon: '🧬', text: 'Distributed Systems & Microservices' },
    { icon: '🎨', text: 'AI User Interface (AUI) Design' },
  ],
  skills: [
    { name: 'AI / ML',       pct: 90, color: '#cba6f7' },
    { name: 'Go',            pct: 98, color: '#89dceb' },
    { name: 'Rust',          pct: 95, color: '#fab387' },
    { name: 'Java / Spring', pct: 98, color: '#f9e2af' },
    { name: 'TypeScript',    pct: 75, color: '#89b4fa' },
    { name: 'Cloud/DevOps',  pct: 82, color: '#a6e3a1' },
    { name: 'Ruby / PHP',    pct: 98, color: '#f5c2e7' },
  ],
  projects: [
    {
      name: 'cognix.one',
      desc: 'The Cognitive OS for the Modern Enterprise — AI-native multi-tenant SaaS orchestration platform with hybrid LLM + vector search.',
      lang: 'Go · Rust · TypeScript',
      url:  'https://cognix.one',
    },
    {
      name: 'Aspen Project',
      desc: 'Industrial-grade multi-tenant SaaS framework: rapid deployment, modularity, and modular UI/API endpoints.',
      lang: 'Go · Java · React',
      url:  'https://github.com/PolyglotAndrea',
    },
    {
      name: 'LangChainGo integrations',
      desc: 'Autonomous agents that integrate LangChainGo with enterprise DBs to create actionable intelligence pipelines.',
      lang: 'Go · LangChain',
      url:  'https://github.com/PolyglotAndrea',
    },
  ],
  links: [
    { icon: '🐙', label: 'GitHub',  url: 'https://github.com/PolyglotAndrea', color: 'c-green'  },
    { icon: '🌐', label: 'Website', url: 'https://cognix.one',                color: 'c-cyan'   },
    { icon: '✉️',  label: 'Email',   url: 'mailto:andrea@cognix.tech',         color: 'c-yellow' },
  ],
};

// ── DOM refs ───────────────────────────────────────────────────────────────
const outputEl = document.getElementById('output');
const inputEl  = document.getElementById('cmd-input');

// ── Utilities ──────────────────────────────────────────────────────────────
const esc = s => String(s)
  .replace(/&/g,'&amp;')
  .replace(/</g,'&lt;')
  .replace(/>/g,'&gt;');

function appendEl(tag, cls, html) {
  const el = document.createElement(tag);
  if (cls)  el.className   = cls;
  if (html !== undefined) el.innerHTML = html;
  outputEl.appendChild(el);
  return el;
}

const blank = ()  => appendEl('span', 'blank');
const line  = (html, cls = '') => {
  appendEl('span', `line ${cls}`.trim(), html);
  outputEl.appendChild(document.createElement('br'));
};

function scrollBottom() {
  const t = document.getElementById('terminal');
  t.scrollTop = t.scrollHeight;
}

// ── Prompt HTML (for echoing typed commands) ───────────────────────────────
function promptHTML(cmd) {
  return `<span class="ps1-echo">` +
    `<span class="e-user">${CONFIG.user}</span>` +
    `<span class="e-at">@</span>` +
    `<span class="e-host">${CONFIG.host}</span> ` +
    `<span class="e-dir">~</span>` +
    `<span class="e-branch"> git:(main)</span>` +
    `<span class="e-arrow"> ❯</span>` +
    `</span> <span class="e-cmd">${esc(cmd)}</span>`;
}

// ── Commands ───────────────────────────────────────────────────────────────
const COMMANDS = {};

COMMANDS.help = function() {
  blank();
  line(`<span class="section-head">// available commands</span>`);
  blank();
  const rows = [
    ['me',          'full profile & executive summary'],
    ['whoami',      'one-liner intro'],
    ['interests',   'technical interests'],
    ['skills',      'skill matrix & proficiency'],
    ['projects',    'key projects'],
    ['contact',     'links & contact info'],
    ['ls',          'list all "files"'],
    ['cat <file>',  'read a file'],
    ['banner',      'show ASCII banner'],
    ['date',        'current date & time'],
    ['clear',       'clear screen'],
    ['help',        'show this help'],
  ];
  rows.forEach(([cmd, desc]) => {
    line(`<span class="help-row"><span class="help-cmd">${cmd}</span><span class="help-desc">${desc}</span></span>`);
  });
  blank();
};

COMMANDS.me = function() {
  blank();
  line(`<span class="c-purple bold">${esc(CONFIG.name)}</span>`);
  line(`<span class="c-dim">${esc(CONFIG.title)}</span>`);
  line(`<span class="divider"></span>`);
  CONFIG.bio.forEach(l => {
    if (l === '') blank();
    else line(esc(l));
  });
  blank();
  line(`<span class="tag tag-peach">🌐 Flagship</span>  <span class="c-cyan">cognix.one</span>  <span class="c-dim">— The Cognitive OS for the Modern Enterprise</span>`);
  line(`<span class="c-dim">  Multi-Tenant SaaS · Hybrid LLM + Vector Search · Go/Rust data plane</span>`);
  blank();
  line(`<span class="c-dim">→ </span><span class="c-green">skills</span><span class="c-dim">  → </span><span class="c-blue">projects</span><span class="c-dim">  → </span><span class="c-peach">contact</span><span class="c-dim">  → </span><span class="c-purple">interests</span>`);
  blank();
};

COMMANDS['me -h'] = COMMANDS.me;

COMMANDS.whoami = function() {
  blank();
  line(`<span class="c-purple bold">B. Andrea Horvath</span> <span class="c-dim">—</span> Senior AI Full-Stack Architect`);
  line(`<span class="c-dim">Founder of </span><span class="c-cyan">Cognix.one</span> <span class="c-dim">· United States</span>`);
  blank();
};

COMMANDS.interests = function() {
  blank();
  line(`<span class="tag tag-purple">Interests</span>`);
  blank();
  CONFIG.interests.forEach(({ icon, text }) => {
    line(`  ${icon}  <span class="bullet">${esc(text)}</span>`);
  });
  blank();
};

COMMANDS['glow interests.md'] = COMMANDS.interests;

COMMANDS.skills = function() {
  blank();
  line(`<span class="section-head">// skills</span>`);
  blank();
  CONFIG.skills.forEach(({ name, pct, color }) => {
    const fillStyle = `width:${pct}%; background:${color};`;
    const html =
      `<span class="skill-row">` +
        `<span class="skill-name">${esc(name)}</span>` +
        `<span class="skill-bar-bg"><span class="skill-bar-fill" style="${fillStyle}"></span></span>` +
        `<span class="skill-pct">${pct}%</span>` +
      `</span>`;
    line(html);
  });
  blank();
};

COMMANDS.projects = function() {
  blank();
  line(`<span class="section-head">// projects</span>`);
  blank();
  CONFIG.projects.forEach(({ name, desc, lang, url }) => {
    const html =
      `<span class="project-card">` +
        `<span class="project-icon">◈</span>` +
        `<span>` +
          `<a class="project-name" href="${url}" target="_blank" rel="noopener">${esc(name)}</a>` +
          `<br>` +
          `<span class="project-desc">${esc(desc)}</span>  ` +
          `<span class="project-lang">[${esc(lang)}]</span>` +
        `</span>` +
      `</span>`;
    line(html);
  });
  blank();
};

COMMANDS.contact = function() {
  blank();
  line(`<span class="tag tag-blue">Contact</span>`);
  blank();
  CONFIG.links.forEach(({ icon, label, url, color }) => {
    const html =
      `<span class="contact-row">` +
        `<span class="contact-icon">${icon}</span>` +
        `<span class="contact-label ${color}">${esc(label)}</span>` +
        `<span class="contact-url"><a href="${url}" target="_blank" rel="noopener">${esc(url)}</a></span>` +
      `</span>`;
    line(html);
  });
  blank();
};

COMMANDS.clear = function() {
  outputEl.innerHTML = '';
};

COMMANDS.banner = function() {
  const ascii = [
    '  ___  ___  _     _  ___  ___  _  _  ___  _     _     ',
    ' | __|| o \\ | |   | ||   || __|| || || __|| |   | |    ',
    ' | _| | _/ | |_  | || o  || _| | \\/ | _| | |_  | |_  ',
    ' |_|  |_|  |___| |_||___/ |___||_||_||___||___| |___| ',
  ];
  blank();
  ascii.forEach(row => line(`<span class="ascii">${esc(row)}</span>`));
  blank();
  line(`<span class="c-purple bold">${esc(CONFIG.name)}</span>  <span class="c-dim">${esc(CONFIG.title)}</span>`);
  blank();
};

COMMANDS.ls = function() {
  blank();
  const files = [
    { name: 'me.md',        color: 'c-cyan'   },
    { name: 'interests.md', color: 'c-cyan'   },
    { name: 'skills.md',    color: 'c-cyan'   },
    { name: 'projects.md',  color: 'c-cyan'   },
    { name: 'contact.md',   color: 'c-cyan'   },
  ];
  const row = files.map(f => `<span class="${f.color}">${f.name}</span>`).join('   ');
  line(row);
  blank();
};

COMMANDS.pwd = function() {
  line(`<span class="c-green">/home/${esc(CONFIG.user)}</span>`);
};

COMMANDS.date = function() {
  line(`<span class="c-yellow">${new Date().toLocaleString('zh-CN', { timeZoneName: 'short', hour12: false })}</span>`);
};

// ── Cat command ────────────────────────────────────────────────────────────
const CAT_MAP = {
  'me.md':        COMMANDS.me,
  'interests.md': COMMANDS.interests,
  'skills.md':    COMMANDS.skills,
  'projects.md':  COMMANDS.projects,
  'contact.md':   COMMANDS.contact,
};

// ── Input handling ─────────────────────────────────────────────────────────
const history = [];
let histIdx = -1;

inputEl.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const raw = inputEl.value.trim();
    inputEl.value = '';
    histIdx = -1;

    // echo the command with styled prompt
    line(promptHTML(raw));

    if (!raw) { scrollBottom(); return; }
    history.unshift(raw);

    const lower    = raw.toLowerCase();
    const baseCmd  = lower.split(' ')[0];
    const args     = raw.slice(baseCmd.length).trim();

    if (COMMANDS[lower]) {
      COMMANDS[lower]();
    } else if (baseCmd === 'echo') {
      blank();
      line(esc(args));
      blank();
    } else if (baseCmd === 'cat') {
      const file = args.toLowerCase();
      if (CAT_MAP[file]) CAT_MAP[file]();
      else {
        blank();
        line(`<span class="error">cat: ${esc(args)}: No such file or directory</span>`);
        blank();
      }
    } else {
      blank();
      line(`<span class="error">command not found: ${esc(raw)}</span>`);
      line(`<span class="c-dim">输入 <span class="c-green">help</span> 查看可用命令</span>`);
      blank();
    }

    scrollBottom();
  }

  // history ↑ ↓
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (histIdx < history.length - 1) inputEl.value = history[++histIdx];
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (histIdx > 0)  inputEl.value = history[--histIdx];
    else { histIdx = -1; inputEl.value = ''; }
  }

  // Tab completion
  if (e.key === 'Tab') {
    e.preventDefault();
    const partial = inputEl.value.toLowerCase();
    if (!partial) return;
    const all = [...Object.keys(COMMANDS), 'cat ', 'echo '];
    const match = all.find(c => c.startsWith(partial) && c !== partial);
    if (match) inputEl.value = match;
  }
});

// click anywhere → focus input
document.addEventListener('click', () => inputEl.focus());

// ── Boot ───────────────────────────────────────────────────────────────────
function boot() {
  COMMANDS.banner();
  line(`  Welcome. Type <span class="c-green">help</span> for available commands, or <span class="c-purple">me</span> for a full profile.`);
  blank();
}

boot();
