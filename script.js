
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

const music = document.getElementById('bgMusic');
const soundToggle = document.getElementById('soundToggle');
const soundLabel = document.getElementById('soundLabel');
const soundStatus = document.getElementById('soundStatus');
const enterBtn = document.getElementById('enterBtn');

let width, height;
let particles = [];
let playing = false;

// Resize canvas
function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;

  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = Math.min(
    110,
    Math.floor(width * height / 10500)
  );

  particles = Array.from(
    { length: count },
    () => makeParticle(true)
  );
}

// Create glowing particles
function makeParticle(randomY = false) {
  return {
    x: Math.random() * width,
    y: randomY ? Math.random() * height : height + 10,
    r: Math.random() * 1.8 + 0.35,
    vy: Math.random() * 0.55 + 0.15,
    vx: (Math.random() - 0.5) * 0.35,
    alpha: Math.random() * 0.7 + 0.15,
    phase: Math.random() * Math.PI * 2
  };
}

// Animate particles
function animate() {
  ctx.clearRect(0, 0, width, height);

  for (const p of particles) {
    p.y -= p.vy;

    p.x += p.vx +
      Math.sin(p.phase += 0.01) * 0.15;

    if (p.y < -10) {
      Object.assign(p, makeParticle(false));
    }

    if (p.x < -10) p.x = width + 10;
    if (p.x > width + 10) p.x = -10;

    ctx.beginPath();

    ctx.fillStyle = `rgba(
      255,
      ${35 + Math.floor(p.alpha * 35)},
      ${65 + Math.floor(p.alpha * 45)},
      ${p.alpha}
    )`;

    ctx.shadowBlur = 12;
    ctx.shadowColor = '#ff173d';

    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.shadowBlur = 0;

  requestAnimationFrame(animate);
}

// Background music control
async function toggleMusic() {
  if (!playing) {
    try {
      await music.play();

      playing = true;

      soundToggle.classList.add('playing');
      soundLabel.textContent = 'SOUND ON';
      soundStatus.textContent = 'SOUND: ON';

    } catch (error) {
      soundStatus.textContent = 'ADD shaitan.mp3';
      soundLabel.textContent = 'AUDIO NOT FOUND';

      console.warn('Music could not start:', error);
    }

  } else {
    music.pause();

    playing = false;

    soundToggle.classList.remove('playing');
    soundLabel.textContent = 'SOUND OFF';
    soundStatus.textContent = 'SOUND: OFF';
  }
}

// Music button
soundToggle.addEventListener('click', toggleMusic);

// Enter experience button
enterBtn.addEventListener('click', async () => {
  document.body.classList.add('entered');

  const buttonLabel = document.getElementById('buttonLabel');

  buttonLabel.textContent = 'WELCOME, SABITH';

  if (!playing) {
    await toggleMusic();
  }
});

// Resize screen
window.addEventListener('resize', resize);

// Audio error handling
music.addEventListener('error', () => {
  soundStatus.textContent = 'ADD shaitan.mp3';
  soundLabel.textContent = 'AUDIO NOT FOUND';
});

// Start everything
resize();
animate();
