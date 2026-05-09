// ╔══════════════════════════════════════════════════════╗
// ║  CONFIG — edit this section to personalise           ║
// ╚══════════════════════════════════════════════════════╝
const CONFIG = {
  user:  'andrea',
  host:  'cognix.one',
  name:  'B. Andrea Horvath',
  title: 'Senior AI Full-Stack Architect · Founder of Cognix.one',
  bio: [
    'A seasoned architect with 12+ years of expertise in bridging high-performance systems',
    'and modern artificial intelligence.',
    '',
    'Specializing in building "Cognitive Infrastructure" that is scalable and resilient.',
    'Expert in low-level memory management in Rust, enterprise Java ecosystems,',
    'and cutting-edge AI Agent orchestration.',
    '',
    '"Code is the infrastructure of thought. In the age of AI, the',
    ' architect\'s job is to ensure that thought has a scalable, safe,',
    ' and efficient container to grow in."',
  ],
  interests: [
    { icon: '🤖', text: 'AI Agent Orchestration & Multi-Agent Systems' },
    { icon: '🦀', text: 'Rust & Go — high-performance distributed systems' },
    { icon: '☁️',  text: 'Cloud-native infra: Kubernetes, Terraform' },
    { icon: '🔒', text: 'Secure Software Supply Chain' },
    { icon: '🧬', text: 'Distributed Systems Architecture' },
    { icon: '🎨', text: 'AI User Interface (AUI) Design' },
  ],
  skills: [
    { name: 'AI / ML',       pct: 92, color: '#bb9af7' },
    { name: 'Go',            pct: 98, color: '#7dcfff' },
    { name: 'Rust',          pct: 95, color: '#ff9e64' },
    { name: 'Java / Spring', pct: 98, color: '#e0af68' },
    { name: 'Distributed Sys', pct: 96, color: '#7aa2f7' },
    { name: 'Cloud/DevOps',  pct: 85, color: '#9ece6a' },
    { name: 'TypeScript',    pct: 88, color: '#7aa2f7' },
  ],
  projects: [
    {
      name: 'cognix',
      desc: 'The Cognitive Operating System for the Modern Enterprise — AI-native orchestration platform.',
      lang: 'Go · Rust · TypeScript',
      url:  'https://github.com/PolyglotAndrea/cognix',
      stars: 12,
      updated: '2024'
    },
    {
      name: 'folioshell',
      desc: 'A premium, interactive terminal-style portfolio template built with modern glassmorphism.',
      lang: 'JavaScript · CSS · HTML',
      url:  'https://github.com/PolyglotAndrea/folioshell',
      stars: 24,
      updated: '2024'
    },
    {
      name: 'aspen',
      desc: 'Industrial-grade multi-tenant SaaS framework for rapid deployment.',
      lang: 'Go · Java',
      url:  'https://github.com/PolyglotAndrea/aspen',
      stars: 18,
      updated: '2024'
    },
  ],
  links: [
    { icon: '🐙', label: 'GitHub',  url: 'https://github.com/PolyglotAndrea', color: 'c-green'  },
    { icon: '🌐', label: 'Website', url: 'https://cognix.one',                color: 'c-cyan'   },
    { icon: '✉️',  label: 'Email',   url: 'mailto:andrea@cognix.tech',         color: 'c-yellow' },
  ],
};

// ── GitHub API integration ────────────────────────────────────────────────
const GITHUB_USER = 'PolyglotAndrea';
let cachedRepos = null;

async function fetchGitHubRepos() {
  if (cachedRepos) return cachedRepos;
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`);
    if (!res.ok) throw new Error('GitHub API error');
    const repos = await res.json();
    const processed = repos
      .sort((a, b) => {
        if (a.fork !== b.fork) return a.fork ? 1 : -1;
        const scoreA = (a.stargazers_count * 5) + (a.forks_count * 2);
        const scoreB = (b.stargazers_count * 5) + (b.forks_count * 2);
        if (scoreA !== scoreB) return scoreB - scoreA;
        return new Date(b.updated_at) - new Date(a.updated_at);
      })
      .slice(0, 5)
      .map(r => ({
        name: r.name,
        desc: r.description || 'Modern cognitive infrastructure component.',
        lang: r.language || 'Multiple',
        url:  r.html_url,
        stars: r.stargazers_count,
        forks: r.forks_count,
        updated: new Date(r.updated_at).getFullYear().toString(),
      }));
    cachedRepos = processed;
    return cachedRepos;
  } catch (err) {
    console.error('Failed to fetch GitHub repos:', err);
    return CONFIG.projects;
  }
}

// ── DOM refs ───────────────────────────────────────────────────────────────
const outputEl = document.getElementById('output');
const inputEl  = document.getElementById('cmd-input');
const cursorEl = document.getElementById('cursor-block');

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
  const l = appendEl('span', `line ${cls}`.trim(), html);
  outputEl.appendChild(document.createElement('br'));
  scrollBottom();
  return l;
};

function scrollBottom() {
  const t = document.getElementById('terminal');
  requestAnimationFrame(() => {
    t.scrollTop = t.scrollHeight;
  });
}

// ── Typing Effect ──────────────────────────────────────────────────────────
async function typeLine(html, cls = '', speed = 2) {
  const l = line('', cls);
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  const text = tempDiv.innerText;
  if (html.includes('<')) {
    l.innerHTML = html;
  } else {
    for (let i = 0; i < text.length; i++) {
      l.innerText += text[i];
      scrollBottom();
      await new Promise(r => setTimeout(r, speed));
    }
  }
  scrollBottom();
}

// ── Prompt HTML ────────────────────────────────────────────────────────────
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

COMMANDS.help = async function() {
  blank();
  await typeLine(`<span class="section-head">// available commands</span>`);
  blank();
  const rows = [
    ['me',          'full profile & executive summary'],
    ['whoami',      'detailed technical deep-dive'],
    ['interests',   'technical interests'],
    ['skills',      'skill matrix & proficiency'],
    ['projects',    'key projects (dynamic)'],
    ['contact',     'links & contact info'],
    ['ls',          'list all "files"'],
    ['cat <file>',  'read a file'],
    ['banner',      'show ASCII banner'],
    ['date',        'current date & time'],
    ['clear',       'clear screen'],
    ['help',        'show this help'],
  ];
  for (const [cmd, desc] of rows) {
    line(`<span class="help-row"><span class="help-cmd">${cmd}</span><span class="help-desc">${desc}</span></span>`);
  }
  blank();
};

COMMANDS.me = async function() {
  blank();
  line(`<span class="c-purple bold" style="font-size:1.2em">${esc(CONFIG.name)}</span>`);
  line(`<span class="c-dim">${esc(CONFIG.title)}</span>`);
  line(`<span class="divider"></span>`);
  for (const l of CONFIG.bio) {
    if (l === '') blank();
    else line(esc(l));
  }
  blank();
};

COMMANDS.whoami = async function() {
  blank();
  await typeLine(`<span class="section-head">// executive summary</span>`);
  line(`<span class="c-purple bold">B. Andrea Horvath</span> <span class="c-dim">— Founder of </span><span class="c-cyan">Cognix.one</span>`);
  line(`<span class="c-dim">A polyglot engineer with </span><span class="c-green bold">12+ years</span><span class="c-dim"> of experience in high-performance distributed systems.</span>`);
  blank();
  await typeLine(`<span class="section-head">// strategic focus</span>`);
  line(`<span class="c-purple">▸ </span><span class="bold">AI Agent Orchestration:</span> <span class="c-dim">Expert in Multi-Agent Systems (MAS) & neural infrastructure.</span>`);
  line(`<span class="c-blue">▸ </span><span class="bold">Cognitive Systems:</span> <span class="c-dim">Bridging high-performance data planes (Go/Rust) with AI agency.</span>`);
  line(`<span class="c-peach">▸ </span><span class="bold">SaaS Engineering:</span> <span class="c-dim">Deep expertise in multi-tenancy, secure supply chain & cloud-native infra.</span>`);
  blank();
  await typeLine(`<span class="section-head">// core primitives</span>`);
  const stack = [
    { label: 'Performance', val: 'Rust, Go, C++, Linux Internals' },
    { label: 'Enterprise',  val: 'Java (Spring), Distributed DBs' },
    { label: 'AI/Neural',   val: 'LangChainGo, RAG, Neural Orchestration' }
  ];
  stack.forEach(s => {
    line(`<span class="c-green bold">${s.label.padEnd(14)}</span> <span class="c-dim">${s.val}</span>`);
  });
  blank();
  line(`<span class="c-dim" style="font-size: 0.85em; opacity: 0.6;">(Information distilled from https://github.com/PolyglotAndrea)</span>`);
  blank();
};

COMMANDS.interests = function() {
  blank();
  line(`<span class="section-head">// interests</span>`);
  blank();
  CONFIG.interests.forEach(({ icon, text }) => {
    line(`  ${icon}  <span class="c-dim">${esc(text)}</span>`);
  });
  blank();
};

COMMANDS.skills = function() {
  blank();
  line(`<span class="section-head">// skills</span>`);
  blank();
  CONFIG.skills.forEach(({ name, pct, color }) => {
    const fillStyle = `width:${pct}%; background:${color}; box-shadow: 0 0 10px ${color}40;`;
    const html =
      `<div class="skill-row">` +
        `<span class="skill-name">${esc(name)}</span>` +
        `<div class="skill-bar-bg"><div class="skill-bar-fill" style="${fillStyle}"></div></div>` +
        `<span class="skill-pct">${pct}%</span>` +
      `</div>`;
    line(html);
  });
  blank();
};

COMMANDS.projects = async function() {
  blank();
  line(`<span class="section-head">// projects</span>`);
  line(`<span class="c-dim">  fetching & sorting repositories...</span>`);
  blank();
  const repos = await fetchGitHubRepos();
  const lines = outputEl.querySelectorAll('.line');
  if (lines.length >= 2) {
    lines[lines.length - 2].remove();
    outputEl.querySelectorAll('br')[outputEl.querySelectorAll('br').length - 2]?.remove();
  }
  repos.forEach(({ name, desc, lang, url, stars, updated, forks }) => {
    const starCount = stars || 0;
    const updateTime = updated || '2024';
    const forkCount = forks ? `  •  🍴 ${forks}` : '';
    const html =
      `<div class="project-card" onclick="window.open('${url}', '_blank')" style="cursor:pointer;">` +
        `<div class="project-header">` +
          `<a class="project-name" href="${url}" target="_blank" rel="noopener" onclick="event.stopPropagation()">${esc(name)}</a>` +
          `<span class="project-meta">⭐ ${starCount}${forkCount}  •  ${updateTime}</span>` +
        `</div>` +
        `<div class="project-desc">${esc(desc)}</div>` +
        `<div class="project-lang">${esc(lang)}</div>` +
      `</div>`;
    line(html);
  });
  blank();
};

COMMANDS.contact = function() {
  blank();
  line(`<span class="section-head">// contact</span>`);
  blank();
  CONFIG.links.forEach(({ icon, label, url, color }) => {
    line(`  ${icon}  <span class="${color} bold">${label}</span> <span class="c-dim">→</span> <a href="${url}" target="_blank" style="color:var(--fg-dim); text-decoration:none;" onmouseover="this.style.color='var(--fg)'" onmouseout="this.style.color='var(--fg-dim)'">${url}</a>`);
  });
  blank();
};

COMMANDS.clear = function() {
  outputEl.innerHTML = '';
};

COMMANDS.banner = async function() {
  blank();
  const ascii = [
    '   ______ ____  ______ _   _ _____ _  __',
    '  / ____/ __ \\| ____| \\ | |_   _\\ \\/ /',
    ' | |   | |  | | |__ |  \\| | | |  \\  / ',
    ' | |   | |  | |  __|| . ` | | |  /  \\ ',
    ' | |___| |__| | |___| |\\  |_| |_/  /\\ \\',
    '  \\_____\\____/|_____|_| \\_|_____/_/  \\_\\',
    '        COGNITIVE INTERFACE v2.0'
  ];
  for (const l of ascii) {
    line(`<span class="c-purple" style="font-weight:bold; font-size:1.1em; letter-spacing: 1px;">${esc(l)}</span>`);
    await new Promise(r => setTimeout(r, 10));
  }
  blank();
  
  // Simulated boot sequence
  const bootLines = [
    { l: '▸ Initializing cognitive kernels...', c: 'c-dim' },
    { l: '▸ Loading neural orchestration modules...', c: 'c-dim' },
    { l: '▸ Connecting to high-performance data planes...', c: 'c-dim' },
    { l: '▸ SUCCESS: Cognix OS interface ready.', c: 'c-green' }
  ];
  
  for (const bl of bootLines) {
    line(`<span class="${bl.c}">${bl.l}</span>`);
    await new Promise(r => setTimeout(r, 80));
  }
  
  blank();
  const sysInfo = [
    { label: 'KERNEL', val: 'Linux 6.8.0-cognix-ai-x86_64' },
    { label: 'UPTIME', val: '12 years, 4 months' },
    { label: 'SHELL',  val: 'folioshell v2.0' },
    { label: 'USER',   val: 'andrea@cognix.one' }
  ];
  sysInfo.forEach(info => {
    line(`<span class="c-blue bold">${info.label.padEnd(10)}</span> <span class="c-dim">▸</span> <span class="c-cyan">${info.val}</span>`);
  });
  blank();
  line(`<span class="c-dim">Type </span><span class="c-green bold">help</span><span class="c-dim"> to explore your cognitive workspace.</span>`);
  blank();
};

COMMANDS.ls = function() {
  blank();
  const files = ['me.md', 'interests.md', 'skills.md', 'projects.md', 'contact.md'];
  line(files.map(f => `<span class="c-cyan">${f}</span>`).join('   '));
  blank();
};

COMMANDS.date = function() {
  line(`<span class="c-yellow">${new Date().toLocaleString('en-US', { timeZoneName: 'short', hour12: false })}</span>`);
};

// ── Input handling ─────────────────────────────────────────────────────────
const history = [];
let histIdx = -1;

inputEl.addEventListener('keydown', async e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const raw = inputEl.value;
    const trimmed = raw.trim();
    inputEl.value = '';
    histIdx = -1;
    updateCursor();
    line(promptHTML(raw));
    if (!trimmed) { scrollBottom(); return; }
    history.unshift(raw);
    const lower    = trimmed.toLowerCase();
    const baseCmd  = lower.split(' ')[0];
    const args     = trimmed.slice(baseCmd.length).trim();
    if (COMMANDS[lower]) {
      await COMMANDS[lower]();
    } else if (baseCmd === 'echo') {
      line(esc(args));
    } else if (baseCmd === 'cat') {
      const file = args.toLowerCase();
      const CAT_MAP = {
        'me.md': COMMANDS.me,
        'interests.md': COMMANDS.interests,
        'skills.md': COMMANDS.skills,
        'projects.md': COMMANDS.projects,
        'contact.md': COMMANDS.contact,
      };
      if (CAT_MAP[file]) await CAT_MAP[file]();
      else line(`<span class="c-red">cat: ${esc(args)}: No such file</span>`);
    } else if (baseCmd === 'clear') {
      COMMANDS.clear();
    } else {
      line(`<span class="c-red">command not found: ${esc(trimmed)}</span>`);
    }
    scrollBottom();
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (histIdx < history.length - 1) inputEl.value = history[++histIdx];
    updateCursor();
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (histIdx > 0)  inputEl.value = history[--histIdx];
    else { histIdx = -1; inputEl.value = ''; }
    updateCursor();
  }
  if (e.key === 'Tab') {
    e.preventDefault();
    const partial = inputEl.value.toLowerCase();
    if (!partial) return;
    const all = [...Object.keys(COMMANDS), 'cat ', 'echo '];
    const match = all.find(c => c.startsWith(partial));
    if (match) inputEl.value = match;
    updateCursor();
  }
});

// ── Cursor Positioning ─────────────────────────────────────────────────────
function updateCursor() {
  const val = inputEl.value;
  const temp = document.createElement('span');
  temp.style.font = getComputedStyle(inputEl).font;
  temp.style.visibility = 'hidden';
  temp.style.position = 'absolute';
  temp.style.whiteSpace = 'pre';
  temp.innerText = val;
  document.body.appendChild(temp);
  const width = temp.offsetWidth;
  cursorEl.style.transform = `translateX(${width}px)`;
  document.body.removeChild(temp);
}

inputEl.addEventListener('input', updateCursor);
window.addEventListener('resize', updateCursor);
document.addEventListener('click', () => inputEl.focus());

async function boot() {
  await COMMANDS.banner();
  updateCursor();
}

boot();
