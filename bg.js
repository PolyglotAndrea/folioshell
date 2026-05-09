/**
 * bg.js — animated particle network with mouse follow
 */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');

  const COLORS = ['#cba6f7', '#89b4fa', '#94e2d5', '#f5c2e7', '#89dceb'];

  const CFG = {
    particleCount : 80,
    maxDist       : 140,
    dotRadius      : 1.6,
    speed          : 0.3,
    gridSpacing    : 50,
    gridOpacity    : 0.06,
    lineOpacity    : 0.15,
    mouseRadius    : 200,
    mouseRepel     : 0.025,  // mouse repel strength (push away)
  };

  let W, H, particles, mouse = { x: -999, y: -999 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeParticle() {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const angle = Math.random() * Math.PI * 2;
    const spd   = CFG.speed * (0.5 + Math.random() * 0.7);
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      r:  CFG.dotRadius * (0.7 + Math.random() * 0.6),
      color,
      alpha: 0.4 + Math.random() * 0.4,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: CFG.particleCount }, makeParticle);
  }

  function drawGrid() {
    ctx.fillStyle = `rgba(203,166,247,${CFG.gridOpacity})`;
    const s = CFG.gridSpacing;
    for (let x = s / 2; x < W; x += s) {
      for (let y = s / 2; y < H; y += s) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // mouse repel (push away)
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CFG.mouseRadius && dist > 1) {
        const force = (CFG.mouseRadius - dist) / CFG.mouseRadius * CFG.mouseRepel;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      // dampen
      p.vx *= 0.997;
      p.vy *= 0.997;

      // clamp speed
      const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      const maxSpd = CFG.speed * 2;
      if (spd > maxSpd) {
        p.vx = (p.vx / spd) * maxSpd;
        p.vy = (p.vy / spd) * maxSpd;
      }

      p.x += p.vx;
      p.y += p.vy;

      // wrap
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;

      // draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, '0');
      ctx.fill();

      // connections
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
          ctx.lineWidth   = 0.7;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });

  init();
  frame();
})();
