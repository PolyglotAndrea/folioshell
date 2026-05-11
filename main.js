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
    { name: 'AI / ML',       pct: 92, color: 'var(--purple)' },
    { name: 'Go',            pct: 98, color: 'var(--blue)' },
    { name: 'Rust',          pct: 95, color: 'var(--peach)' },
    { name: 'Java / Spring', pct: 98, color: 'var(--yellow)' },
    { name: 'Distributed Sys', pct: 96, color: 'var(--cyan)' },
    { name: 'Cloud/DevOps',  pct: 85, color: 'var(--green)' },
    { name: 'TypeScript',    pct: 88, color: 'var(--blue)' },
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

// ── Blogs State & Fetching ──────────────────────────────────────────────────
let BLOGS = [];
let isDashboardOpen = false;
let selectedBlogIdx = 0;

async function fetchBlogManifest() {
  try {
    const res = await fetch('blogs/manifest.json');
    if (!res.ok) throw new Error('Manifest not found');
    BLOGS = await res.json();
    return true;
  } catch (err) {
    console.error('Failed to load blog manifest:', err);
    return false;
  }
}

async function fetchBlogPostContent(filename) {
  try {
    const res = await fetch(`blogs/${filename}`);
    if (!res.ok) throw new Error('Post not found');
    return await res.text();
  } catch (err) {
    return '# Error\nCould not load post content.';
  }
}

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
const terminalPane = document.querySelector('.pane-terminal');
const blogPane = document.getElementById('blog-dashboard');
const dashContent = document.getElementById('dashboard-content');
const dashPlaceholder = blogPane.querySelector('.dashboard-placeholder');

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
  requestAnimationFrame(() => {
    terminalPane.scrollTop = terminalPane.scrollHeight;
  });
}

// ── Dashboard Logic ─────────────────────────────────────────────────────────
async function toggleDashboard(forceOpen = true) {
  if (forceOpen && !isDashboardOpen) {
    line(`<span class="c-dim">Connecting to neural archives...</span>`);
    const ok = await fetchBlogManifest();
    if (!ok || BLOGS.length === 0) {
      line(`<span class="c-red">Error: Neural link failed.</span>`);
      return;
    }
    
    isDashboardOpen = true;
    blogPane.classList.add('active');
    dashPlaceholder.style.display = 'none';
    dashContent.style.display = 'flex';
    
    renderBlogList();
    await renderBlogPost();
    line(`<span class="c-green">Dashboard initialized.</span>`);
  } else if (!forceOpen && isDashboardOpen) {
    isDashboardOpen = false;
    blogPane.classList.remove('active');
    setTimeout(() => {
      if (!isDashboardOpen) {
        dashContent.style.display = 'none';
        dashPlaceholder.style.display = 'flex';
      }
    }, 400);
    line(`<span class="c-dim">Dashboard minimized.</span>`);
  }
}

function renderBlogList() {
  const sidebar = document.getElementById('reader-sidebar');
  if (!sidebar) return;
  
  sidebar.innerHTML = '';
  BLOGS.forEach((blog, i) => {
    const item = document.createElement('div');
    item.className = `reader-item ${i === selectedBlogIdx ? 'active' : ''}`;
    item.innerHTML = `
      <span class="item-date">${blog.date}</span>
      <span class="item-title">${blog.title}</span>
    `;
    item.onclick = async () => {
      selectedBlogIdx = i;
      renderBlogList();
      await renderBlogPost();
    };
    sidebar.appendChild(item);
  });
  
  const footer = document.createElement('div');
  footer.style.padding = '20px';
  footer.style.marginTop = 'auto';
  footer.style.fontSize = '9px';
  footer.style.color = 'var(--fg-subtle)';
  footer.style.opacity = '0.4';
  footer.style.textTransform = 'uppercase';
  footer.style.letterSpacing = '1px';
  footer.innerHTML = 'CTRL+UP/DOWN: NAV ARCHIVES';
  sidebar.appendChild(footer);
}

// Simple Premium Markdown Parser
function parseMarkdown(md) {
  const lines = md.split('\n');
  let html = '';
  let inList = false;
  
  for (let l of lines) {
    const trimmed = l.trim();
    
    // List Handling
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${parseInline(trimmed.slice(2))}</li>`;
      continue;
    } else if (inList && trimmed === '') {
      html += '</ul>'; inList = false;
      continue;
    } else if (inList && !trimmed.startsWith('- ') && !trimmed.startsWith('* ')) {
      html += '</ul>'; inList = false;
    }

    // Headers
    if (trimmed.startsWith('# ')) { html += `<h1>${parseInline(trimmed.slice(2))}</h1>`; continue; }
    if (trimmed.startsWith('## ')) { html += `<h2>${parseInline(trimmed.slice(3))}</h2>`; continue; }
    if (trimmed.startsWith('### ')) { html += `<h3>${parseInline(trimmed.slice(4))}</h3>`; continue; }
    
    // Blockquotes
    if (trimmed.startsWith('> ')) {
      html += `<blockquote><p>${parseInline(trimmed.slice(2))}</p></blockquote>`;
      continue;
    }
    
    // HR
    if (trimmed === '---' || trimmed === '***') { html += `<hr/>`; continue; }
    
    // Paragraphs
    if (trimmed === '') { html += `<br/>`; continue; }
    html += `<p>${parseInline(trimmed)}</p>`;
  }
  
  if (inList) html += '</ul>';
  return html;
}

function parseInline(text) {
  return esc(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
}

async function renderBlogPost() {
  const viewer = document.getElementById('reader-main');
  if (!viewer) return;
  
  const blog = BLOGS[selectedBlogIdx];
  viewer.innerHTML = `<span class="c-dim">Synchronizing data from ${esc(blog.file)}...</span>`;
  
  const content = await fetchBlogPostContent(blog.file);
  viewer.innerHTML = parseMarkdown(content);
  viewer.scrollTop = 0;
}

// ── Theme Management ───────────────────────────────────────────────────────
const THEMES = ['tokyo', 'cyber', 'oceanic', 'light'];
let currentTheme = localStorage.getItem('cognix-theme') || 'tokyo';

function setTheme(name) {
  if (!THEMES.includes(name)) return false;
  document.body.className = `theme-${name}`;
  currentTheme = name;
  localStorage.setItem('cognix-theme', name);
  return true;
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
    ['blogs',       'open the side-by-side blog dashboard'],
    ['theme <name>', 'switch theme: tokyo, cyber, oceanic, light'],
    ['interests',   'technical interests'],
    ['skills',      'skill matrix & proficiency'],
    ['projects',    'key projects (dynamic)'],
    ['ls',          'list all "files"'],
    ['cat <file>',  'read a file'],
    ['banner',      'show ASCII banner'],
    ['date',        'current date & time'],
    ['clear',       'clear screen'],
    ['exit',        'close the blog dashboard'],
    ['help',        'show this help'],
  ];
  for (const [cmd, desc] of rows) {
    line(`<span class="help-row"><span class="help-cmd">${cmd}</span><span class="help-desc">${desc}</span></span>`);
  }
  blank();
};

COMMANDS.theme = function(args) {
  const name = args.trim().toLowerCase();
  if (!name) {
    line(`<span class="c-dim">Current theme: </span><span class="c-purple bold">${currentTheme}</span>`);
    line(`<span class="c-dim">Available: </span><span class="c-cyan">${THEMES.join(', ')}</span>`);
    return;
  }
  if (setTheme(name)) {
    line(`<span class="c-green">Theme switched to </span><span class="c-green bold">${name}</span>`);
  } else {
    line(`<span class="c-red">Error: Theme "${name}" not found.</span>`);
  }
};

COMMANDS.blogs = function() {
  toggleDashboard(true);
};

COMMANDS.exit = function() {
  if (isDashboardOpen) {
    toggleDashboard(false);
  } else {
    line(`<span class="c-dim">Terminal session remains active.</span>`);
  }
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
    const fillStyle = `width:${pct}%; background:${color}; box-shadow: 0 0 10px ${color === 'var(--purple)' ? 'rgba(187, 154, 247, 0.3)' : 'rgba(0,0,0,0.1)'};`;
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

COMMANDS.ls = function() {
  blank();
  const files = ['me.md', 'interests.md', 'skills.md', 'projects.md', 'contact.md', 'blogs/'];
  line(files.map(f => {
    if (f.endsWith('/')) return `<span class="c-blue bold">${f}</span>`;
    return `<span class="c-cyan">${f}</span>`;
  }).join('   '));
  blank();
};

COMMANDS.date = function() {
  line(`<span class="c-yellow">${new Date().toLocaleString('en-US', { timeZoneName: 'short', hour12: false })}</span>`);
};

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
    `<span class="ps1-user">${CONFIG.user}</span>` +
    `<span class="ps1-at">@</span>` +
    `<span class="ps1-host">${CONFIG.host}</span> ` +
    `<span class="ps1-dir">~</span>` +
    `<span class="ps1-branch"> git:(main)</span>` +
    `<span class="ps1-arrow"> ❯</span>` +
    `</span> <span class="e-cmd">${esc(cmd)}</span>`;
}

// ── Input handling ─────────────────────────────────────────────────────────
const history = [];
let histIdx = -1;

inputEl.addEventListener('keydown', async e => {
  if (isDashboardOpen) {
    if (e.ctrlKey && e.key === 'ArrowUp') {
      e.preventDefault();
      selectedBlogIdx = (selectedBlogIdx - 1 + BLOGS.length) % BLOGS.length;
      renderBlogList();
      await renderBlogPost();
      return;
    }
    if (e.ctrlKey && e.key === 'ArrowDown') {
      e.preventDefault();
      selectedBlogIdx = (selectedBlogIdx + 1) % BLOGS.length;
      renderBlogList();
      await renderBlogPost();
      return;
    }
  }

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
    if (COMMANDS[baseCmd]) {
      await COMMANDS[baseCmd](args);
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
      if (CAT_MAP[file]) {
        await CAT_MAP[file]();
      } else if (file.startsWith('blogs/')) {
        toggleDashboard(true);
      } else {
        line(`<span class="c-red">cat: ${esc(args)}: No such file</span>`);
      }
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
document.addEventListener('click', () => {
  inputEl.focus();
});

// ── Boot Sequence ──────────────────────────────────────────────────────────
async function boot() {
  setTheme(currentTheme);
  
  const welcomeText = [
    { l: 'INITIALIZING COGNIX OS v2.4.0...', c: 'c-purple bold' },
    { l: '▸ Checksums verified: OK', c: 'c-dim' },
    { l: '▸ Neural bridge established.', c: 'c-dim' },
    { l: '▸ Secure shell connected.', c: 'c-dim' },
    { l: '', c: '' },
  ];
  
  for (const item of welcomeText) {
    if (item.l === '') blank();
    else line(`<span class="${item.c}">${item.l}</span>`);
    await new Promise(r => setTimeout(r, 40));
  }
  
  const ascii = [
    '   ______ ____  ______ _   _ _____ _  __',
    '  / ____/ __ \\| ____| \\ | |_   _\\ \\/ /',
    ' | |   | |  | | |__ |  \\| | | |  \\  / ',
    ' | |   | |  | |  __|| . ` | | |  /  \\ ',
    ' | |___| |__| | |___| |\\  |_| |_/  /\\ \\',
    '  \\_____\\____/|_____|_| \\_|_____/_/  \\_\\',
  ];
  for (const l of ascii) {
    line(`<span class="c-purple" style="font-weight:bold; font-size:1.1em; letter-spacing: 1px;">${esc(l)}</span>`);
    await new Promise(r => setTimeout(r, 10));
  }
  blank();
  
  await typeLine(`<span class="c-blue bold">B. Andrea Horvath</span> · Senior AI Architect`);
  await typeLine(`<span class="c-dim">Specializing in bridging Distributed Systems & Neural Orchestration.</span>`);
  blank();
  
  line(`<span class="section-head">// quick start</span>`);
  line(`<span class="c-dim">  Type </span><span class="c-cyan bold">me</span><span class="c-dim">      - Profile Summary</span>`);
  line(`<span class="c-dim">  Type </span><span class="c-cyan bold">blogs</span><span class="c-dim">   - Open Side-by-Side Dashboard</span>`);
  line(`<span class="c-dim">  Type </span><span class="c-cyan bold">theme</span><span class="c-dim">   - Switch Visual Mode (tokyo, light...)</span>`);
  line(`<span class="c-dim">  Type </span><span class="c-cyan bold">help</span><span class="c-dim">    - Full Command List</span>`);
  blank();
  
  updateCursor();
}

boot();
window.toggleDashboard = toggleDashboard;
