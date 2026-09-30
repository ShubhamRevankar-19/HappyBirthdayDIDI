/* ===== Birthday Didi – script.js ===== */
const $ = (s) => document.querySelector(s);

/* ---------- Confetti (lightweight canvas) ---------- */
const canvas = $('#confetti'), ctx = canvas.getContext('2d');
let pieces = [], running = false;
function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
addEventListener('resize', resize); resize();

function confetti(count = 160) {
  const colors = ['#ff8fb8', '#ff5d97', '#b48cf2', '#e8b75a', '#ffffff', '#ffd6e6'];
  for (let i = 0; i < count; i++) {
    pieces.push({
      x: innerWidth / 2 + (Math.random() - .5) * 200, y: innerHeight * .55,
      vx: (Math.random() - .5) * 16, vy: -Math.random() * 16 - 4,
      s: Math.random() * 8 + 5, r: Math.random() * 6, vr: (Math.random() - .5) * .3,
      c: colors[(Math.random() * colors.length) | 0], life: 1
    });
  }
  if (!running) { running = true; requestAnimationFrame(tick); }
}
function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces.forEach((p) => {
    p.vy += .35; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life -= .006;
    ctx.save(); ctx.globalAlpha = Math.max(p.life, 0);
    ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
    ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore();
  });
  pieces = pieces.filter((p) => p.life > 0 && p.y < innerHeight + 40);
  if (pieces.length) requestAnimationFrame(tick);
  else { running = false; ctx.clearRect(0, 0, canvas.width, canvas.height); }
}

/* ---------- Floating hearts / balloons / sparkles ---------- */
const floaters = $('#floaters');
function spawn(emojis, size) {
  const el = document.createElement('span');
  el.className = 'float';
  el.textContent = emojis[(Math.random() * emojis.length) | 0];
  el.style.left = Math.random() * 100 + 'vw';
  el.style.fontSize = size + Math.random() * 14 + 'px';
  el.style.animationDuration = 7 + Math.random() * 6 + 's';
  el.style.setProperty('--dx', (Math.random() - .5) * 120 + 'px');
  el.style.setProperty('--rot', (Math.random() - .5) * 60 + 'deg');
  floaters.appendChild(el);
  setTimeout(() => el.remove(), 14000);
}
const ambient = () => spawn(['💖', '💕', '🎈', '💗', '🎈'], 20);
for (let i = 0; i < 14; i++) { // twinkling stars, created once
  const s = document.createElement('span');
  s.className = 'twinkle'; s.textContent = '✨';
  s.style.left = Math.random() * 100 + 'vw'; s.style.top = Math.random() * 100 + 'vh';
  s.style.animationDelay = Math.random() * 2.5 + 's'; s.style.fontSize = 12 + Math.random() * 12 + 'px';
  floaters.appendChild(s);
}
setInterval(() => { if (!document.hidden) ambient(); }, 1400);
function burstFloaters(n = 24) { for (let i = 0; i < n; i++) setTimeout(() => spawn(['❤️', '💖', '🎈', '🎈', '💕'], 26), i * 120); }

/* ---------- Music (starts only after user click) ---------- */
const music = $('#music'), musicBtn = $('#musicBtn');
let musicOn = false;
function setMusic(on) {
  musicOn = on; musicBtn.classList.toggle('off', !on);
  if (on) music.play().catch(() => { musicOn = false; musicBtn.classList.add('off'); }); // file missing/blocked
  else music.pause();
}
musicBtn.classList.add('off');
musicBtn.addEventListener('click', () => setMusic(!musicOn));

/* ---------- Open the surprise ---------- */
$('#openBtn').addEventListener('click', () => {
  document.body.classList.remove('locked');
  $('#content').classList.remove('hidden');
  confetti(220); burstFloaters(14); setMusic(true);
  setTimeout(() => $('#content').scrollIntoView({ behavior: 'smooth' }), 500);
  observeReveals();
});

/* ---------- Scroll reveal ---------- */
function observeReveals() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .15 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
}

/* ---------- Video ---------- */
const video = $('#video'), poster = $('#videoPoster');
poster.addEventListener('click', () => {
  poster.classList.add('gone');
  if (musicOn) setMusic(false); // pause music so the video is heard
  video.play().catch(() => {});
});
video.addEventListener('error', () => poster.classList.remove('gone'), true); // file missing -> keep placeholder

/* ---------- Photos + lightbox ---------- */
const lb = $('#lightbox'), lbImg = lb.querySelector('img');
document.querySelectorAll('.gallery figure').forEach((fig) => {
  const img = fig.querySelector('img');
  const check = () => { if (!img.naturalWidth) fig.classList.add('missing'); };
  img.addEventListener('error', check);
  if (img.complete) check();
  fig.addEventListener('click', () => {
    if (fig.classList.contains('missing')) return;
    lbImg.src = img.src; lbImg.alt = img.alt; lb.hidden = false;
  });
});
lb.addEventListener('click', () => (lb.hidden = true));
addEventListener('keydown', (e) => { if (e.key === 'Escape') lb.hidden = true; });

/* ---------- Final gift ---------- */
$('#giftBtn').addEventListener('click', (e) => {
  $('#gift').classList.add('open');
  $('#finalMsg').classList.add('show');
  confetti(260); burstFloaters(30);
  e.target.textContent = 'Happy Birthday Didi! 🎉';
  setTimeout(() => $('#finalMsg').scrollIntoView({ behavior: 'smooth', block: 'center' }), 400);
});
