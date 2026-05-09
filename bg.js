/**
 * bg.js — animated particle-grid background
 * Draws a subtle dot grid with drifting particles and
 * mouse-reactive connection lines.
 */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');

  // ── palette (matches CSS tokens) ──────────────────────────
  const COLORS = ['#cba6f7', '#89b4fa', '#94e2d5', '#f5c2e7', '#89dceb'];

  // ── config ────────────────────────────────────────────────
  const CFG = {
    particleCount : 72,
    maxDist       : 130,    // connection line max distance
    dotRadius      : 1.4,
    speed          : 0.28,
    gridSpacing    : 44,    // background dot grid
    gridOpacity    : 0.07,
    lineOpacity    : 0.18,
    mouseRadius    : 160,   // mouse repel radius
  };

  let W, H, particles, mouse = { x: -999, y: -999 };

  // ── resize ────────────────────────────────────────────────
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  // ── particle factory ──────────────────────────────────────
  function makeParticle() {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const angle = Math.random() * Math.PI * 2;
    const spd   = CFG.speed * (0.4 + Math.random() * 0.8);
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      r:  CFG.dotRadius * (0.6 + Math.random() * 0.8),
      color,
      alpha: 0.35 + Math.random() * 0.45,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: CFG.particleCount }, makeParticle);
  }

  // ── draw dot grid ─────────────────────────────────────────
  function drawGrid() {
    ctx.fillStyle = `rgba(203,166,247,${CFG.gridOpacity})`;
    const s = CFG.gridSpacing;
    for (let x = s / 2; x < W; x += s) {
      for (let y = s / 2; y < H; y += s) {
        ctx.beginPath();
        ctx.arc(x, y, 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // ── main loop ─────────────────────────────────────────────
  function frame() {
    ctx.clearRect(0, 0, W, H);

    drawGrid();

    // update + draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // mouse repel
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CFG.mouseRadius) {
        const force = (CFG.mouseRadius - dist) / CFG.mouseRadius * 0.012;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      // dampen velocity
      p.vx *= 0.998;
      p.vy *= 0.998;

      // clamp speed
      const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (spd > CFG.speed * 1.8) {
        p.vx = (p.vx / spd) * CFG.speed * 1.8;
        p.vy = (p.vy / spd) * CFG.speed * 1.8;
      }

      p.x += p.vx;
      p.y += p.vy;

      // wrap edges
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;

      // draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, '0');
      ctx.fill();

      // draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const q  = particles[j];
        const ex = p.x - q.x;
        const ey = p.y - q.y;
        const d  = Math.sqrt(ex * ex + ey * ey);
        if (d < CFG.maxDist) {
          const alpha = (1 - d / CFG.maxDist) * CFG.lineOpacity;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(203,166,247,${alpha})`;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(frame);
  }

  // ── events ────────────────────────────────────────────────
  window.addEventListener('resize', () => { resize(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });

  init();
  frame();
})();
