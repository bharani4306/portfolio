/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animateCursor() {
  cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
  rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();
document.querySelectorAll('a,button,.tag,.cc,.sc,.hcard').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '20px'; cursor.style.height = '20px';
    ring.style.width = '60px'; ring.style.height = '60px';
    ring.style.borderColor = 'rgba(167,139,250,.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '12px'; cursor.style.height = '12px';
    ring.style.width = '40px'; ring.style.height = '40px';
    ring.style.borderColor = 'rgba(99,102,241,.5)';
  });
});

/* ============================================================
   PARTICLES CANVAS
   ============================================================ */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let W, H, pts = [];
function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);
for (let i = 0; i < 80; i++) {
  pts.push({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4,
    r: Math.random() * 1.5 + .5, a: Math.random()
  });
}
function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  pts.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(99,102,241,${p.a * .5})`;
    ctx.fill();
  });
  // Lines between close particles
  pts.forEach((a, i) => {
    pts.slice(i + 1).forEach(b => {
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(99,102,241,${.15 * (1 - d / 120)})`;
        ctx.lineWidth = .5;
        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    });
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ============================================================
   NAVBAR
   ============================================================ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('s', window.scrollY > 50);
  document.getElementById('totop').classList.toggle('show', window.scrollY > 400);
});

/* ============================================================
   HAMBURGER
   ============================================================ */
const hbg = document.getElementById('hbg');
const mm = document.getElementById('mm');
hbg.addEventListener('click', () => {
  mm.classList.toggle('open');
  const sp = hbg.querySelectorAll('span');
  const o = mm.classList.contains('open');
  sp[0].style.transform = o ? 'rotate(45deg) translate(5px,5px)' : '';
  sp[1].style.opacity = o ? '0' : '';
  sp[2].style.transform = o ? 'rotate(-45deg) translate(5px,-5px)' : '';
});
document.querySelectorAll('.mml').forEach(l => l.addEventListener('click', () => {
  mm.classList.remove('open');
  hbg.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}));
document.addEventListener('click', e => {
  if (!mm.contains(e.target) && !hbg.contains(e.target)) mm.classList.remove('open');
});

/* ============================================================
   ACTIVE NAV HIGHLIGHT
   ============================================================ */
const navLinks = document.querySelectorAll('.nl-link');
const sections = document.querySelectorAll('section[id]');
const secObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) navLinks.forEach(l => {
      l.classList.toggle('act', l.getAttribute('href') === '#' + e.target.id);
    });
  });
}, { threshold: .4 });
sections.forEach(s => secObs.observe(s));

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const siblings = [...e.target.parentElement.querySelectorAll('.reveal')];
      const i = siblings.indexOf(e.target);
      setTimeout(() => e.target.classList.add('vis'), i * 100);
      revObs.unobserve(e.target);
    }
  });
}, { threshold: .1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* ============================================================
   ANIMATED COUNTER
   ============================================================ */
function animateCounter(el) {
  const target = +el.dataset.target;
  const suffix = el.dataset.suffix || '';
  let start = 0;
  const step = target / 40;
  const t = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start) + suffix;
    if (start >= target) clearInterval(t);
  }, 40);
}
const cntObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('[data-target]').forEach(animateCounter);
      cntObs.unobserve(e.target);
    }
  });
}, { threshold: .5 });
const statsEl = document.querySelector('.stats');
if (statsEl) cntObs.observe(statsEl);

/* ============================================================
   TYPING ANIMATION
   ============================================================ */
const roles = ['Full-Stack Developer', 'Observability Engineer', 'AI App Builder', 'Software Intern @ Zoho'];
const typer = document.getElementById('typer');
let ri = 0, ci = 0, del = false, speed = 90;
function type() {
  const cur = roles[ri];
  typer.textContent = del ? cur.slice(0, ci--) : cur.slice(0, ci++);
  if (!del && ci > cur.length) { del = true; speed = 2500; }
  else if (del && ci < 0) { del = false; ri = (ri + 1) % roles.length; ci = 0; speed = 300; }
  else speed = del ? 45 : 90;
  setTimeout(type, speed);
}
type();

/* ============================================================
   3D CARD TILT
   ============================================================ */
document.querySelectorAll('.sc,.tc,.ic,.cc,.ec').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(8px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ============================================================
   SCROLL TO TOP
   ============================================================ */
document.getElementById('totop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ============================================================
   HERO MOUSE PARALLAX
   ============================================================ */
const hero = document.getElementById('hero');
if (hero) {
  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - .5) * 20;
    const y = (e.clientY / window.innerHeight - .5) * 20;
    document.querySelectorAll('.ring').forEach((r, i) => {
      r.style.transform = `rotate(${r.style.animationDelay || 0}deg) translate(${x * (i + 1) * .3}px,${y * (i + 1) * .3}px)`;
    });
  });
}

/* ============================================================
   GLOWING MOUSE TRAIL ON HERO
   ============================================================ */
hero && hero.addEventListener('mousemove', e => {
  const dot = document.createElement('div');
  Object.assign(dot.style, {
    position: 'fixed', left: e.clientX + 'px', top: e.clientY + 'px',
    width: '6px', height: '6px', borderRadius: '50%',
    background: 'var(--a2)', pointerEvents: 'none',
    zIndex: '5', opacity: '.6',
    transition: 'all 1s ease', transform: 'translate(-50%,-50%)'
  });
  document.body.appendChild(dot);
  setTimeout(() => { dot.style.opacity = '0'; dot.style.transform = 'translate(-50%,-50%) scale(3)'; }, 10);
  setTimeout(() => dot.remove(), 1000);
});
