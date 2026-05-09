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
      name: 'cognix.one',
      desc: 'The Cognitive OS for the Modern Enterprise — AI-native multi-tenant SaaS orchestration platform with hybrid LLM + vector search.',
      lang: 'Go · Rust · TypeScript',
      url:  'https://cognix.one',
      stars: 120,
      updated: 'Featured'
    },
    {
      name: 'Aspen Project',
      desc: 'Industrial-grade multi-tenant SaaS framework: rapid deployment, modularity, and modular UI/API endpoints.',
      lang: 'Go · Java · React',
      url:  'https://github.com/PolyglotAndrea',
      stars: 85,
      updated: 'Featured'
    },
    {
      name: 'LangChainGo integrations',
      desc: 'Autonomous agents that integrate LangChainGo with enterprise DBs to create actionable intelligence pipelines.',
      lang: 'Go · LangChain',
      url:  'https://github.com/PolyglotAndrea',
      stars: 42,
      updated: 'Featured'
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
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=30`);
    if (!res.ok) throw new Error('GitHub API error');
    
    const repos = await res.json();
    
    const processed = repos
      .filter(r => !r.fork || r.stargazers_count > 10)
      .sort((a, b) => {
        const scoreA = (a.stargazers_count * 2) + a.forks_count;
        const scoreB = (b.stargazers_count * 2) + b.forks_count;
        return scoreB - scoreA;
      })
      .slice(0, 5)
      .map(r => ({
        name: r.name,
        desc: r.description || 'No description available',
        lang: r.language || 'Unknown',
        url:  r.html_url,
        stars: r.stargazers_count,
        forks: r.forks_count,
        updated: new Date(r.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
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

COMMANDS.help = async function() {
  blank();
  await typeLine(`<span class="section-head">// available commands</span>`);
  blank();
  const rows = [
    ['me',          'full profile & executive summary'],
    ['whoami',      'one-liner intro & skills'],
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
  line(`<span class="tag tag-peach">Flagship</span> <span class="c-cyan">cognix.one</span> <span class="c-dim">— The Cognitive OS</span>`);
  line(`<span class="c-dim" style="font-size:0.9em; margin-left: 20px;">Multi-Tenant SaaS · Hybrid LLM + Vector Search · Go/Rust data plane</span>`);
  blank();
};

COMMANDS.whoami = function() {
  blank();
  line(`<span class="c-purple bold">B. Andrea Horvath</span> <span class="c-dim">—</span> Senior AI Full-Stack Architect`);
  line(`<span class="c-dim">Founder of </span><span class="c-cyan">Cognix.one</span> <span class="c-dim">· United States</span>`);
  blank();
  line(`<span class="c-green">Experience:</span> <span class="c-dim">12+ years in Java, Go, Rust, and Distributed Systems.</span>`);
  line(`<span class="c-green">Expertise:</span> <span class="c-dim">Neural Orchestration, Multi-Agent Systems, Cloud-Native Infra.</span>`);
  line(`<span class="c-dim" style="font-size: 0.85em; opacity: 0.6;">(Summarized from GitHub/PolyglotAndrea)</span>`);
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
    const starCount = stars !== undefined ? stars : 0;
    const updateTime = updated || 'Recent';
    const forkCount = forks !== undefined ? `  •  🍴 ${forks}` : '';
    
    const html =
      `<div class="project-card">` +
        `<div class="project-header">` +
          `<a class="project-name" href="${url}" target="_blank" rel="noopener">${esc(name)}</a>` +
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
    line(`  ${icon}  <span class="${color} bold">${label}</span> <span class="c-dim">→</span> <a href="${url}" style="color:var(--fg-dim); text-decoration:none;" onmouseover="this.style.color='var(--fg)'" onmouseout="this.style.color='var(--fg-dim)'">${url}</a>`);
  });
  blank();
};

COMMANDS.clear = function() {
  outputEl.innerHTML = '';
};

COMMANDS.banner = async function() {
  const banner = [
    '╔════════════════════════════════════════════╗',
    '║                                            ║',
    '║        F O L I O S H E L L v2.0            ║',
    '║                                            ║',
    '╠════════════════════════════════════════════╣',
    '║                                            ║',
    '║  B. Andrea Horvath                         ║',
    '║  Senior AI Full-Stack Architect            ║',
    '║                                            ║',
    '╚════════════════════════════════════════════╝'
  ];
  for (const l of banner) {
    line(`<span class="c-purple" style="opacity:0.8; font-size:0.9em;">${esc(l)}</span>`);
    await new Promise(r => setTimeout(r, 10));
  }
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
    e.preventDefault(); // 阻止默认行为，防止竞态条件
    
    const raw = inputEl.value;
    const trimmed = raw.trim();
    
    // 立即清空输入框并重置光标
    inputEl.value = '';
    histIdx = -1;
    updateCursor();

    // 打印回显
    line(promptHTML(raw));

    if (!trimmed) { scrollBottom(); return; }
    history.unshift(raw);

    const lower    = trimmed.toLowerCase();
    const baseCmd  = lower.split(' ')[0];
    const args     = trimmed.slice(baseCmd.length).trim();

    // 执行命令
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
    
    // 确保执行完异步命令后再次滚动到底部
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

// ── Boot ───────────────────────────────────────────────────────────────────
async function boot() {
  await COMMANDS.banner();
  line(`  Welcome to <span class="c-purple bold">Folioshell v2.0</span>.`);
  line(`  Type <span class="c-green">help</span> to explore.`);
  blank();
  updateCursor();
}

boot();
