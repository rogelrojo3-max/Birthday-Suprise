// ============ Palitan mo ang message na ito ng sarili mong sulat ============
const LETTER_MESSAGE = `Happy Birthday! 🎉🎂

Happy Birthday, Sana maging masaya yung araw mo at ma-enjoy mo talaga yung birthday mo. Gusto ko lang sabihin na thankful ako na naging kaibigan kita. Kahit minsan nag-aasaran tayo o may mga random na trip, solid pa rin yung friendship natin.

Sana ma-achieve mo lahat ng goals mo sa buhay. Huwag kang susuko kahit may mga times na mahirap, and always remember na may mga taong naniniwala sa'yo at sumusuporta sa'yo.

Enjoy your day, Deserve mong maging masaya today. More memories, tawanan, gala, at syempre more birthdays to come! 🥳

Happy Birthday ulit! Ingat palagi! 🤝❤️`;

// ============ Floating hearts background ============
function spawnHearts(count = 18) {
  const container = document.getElementById('hearts');
  const symbols = ['❤', '💕', '💗', '✨'];
  for (let i = 0; i < count; i++) {
    const h = document.createElement('span');
    h.className = 'heart';
    h.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    h.style.left = Math.random() * 100 + 'vw';
    h.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
    h.style.fontSize = (14 + Math.random() * 18) + 'px';
    const duration = 9 + Math.random() * 10;
    h.style.animationDuration = duration + 's';
    h.style.animationDelay = (Math.random() * duration) + 's';
    container.appendChild(h);
  }
}
spawnHearts();

// ============ Confetti ============
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
let confettiPieces = [];
let confettiRunning = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const confettiColors = ['#f2a7b8', '#f3c77e', '#fdf3ea', '#e58ba0', '#ffe3ab'];

function createConfetti(amount = 140) {
  confettiPieces = [];
  for (let i = 0; i < amount; i++) {
    confettiPieces.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      w: 6 + Math.random() * 6,
      h: 8 + Math.random() * 10,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      speed: 2 + Math.random() * 3,
      drift: Math.random() * 2 - 1,
      rotation: Math.random() * 360,
      rotSpeed: Math.random() * 8 - 4,
    });
  }
}

function drawConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let stillFalling = false;

  confettiPieces.forEach(p => {
    p.y += p.speed;
    p.x += p.drift;
    p.rotation += p.rotSpeed;

    if (p.y < canvas.height + 20) stillFalling = true;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  });

  if (stillFalling && confettiRunning) {
    requestAnimationFrame(drawConfetti);
  } else {
    confettiRunning = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function launchConfetti() {
  createConfetti();
  confettiRunning = true;
  drawConfetti();
}

// ============ Page transition: cake -> letter ============
const pageCake = document.getElementById('pageCake');
const pageLetter = document.getElementById('pageLetter');
const celebrateBtn = document.getElementById('celebrateBtn');
const backBtn = document.getElementById('backBtn');

celebrateBtn.addEventListener('click', () => {
  launchConfetti();
  celebrateBtn.disabled = true;
  setTimeout(() => {
    pageCake.classList.add('hidden');
    pageLetter.classList.add('active');
  }, 1600);
});

backBtn.addEventListener('click', () => {
  pageLetter.classList.remove('active');
  pageCake.classList.remove('hidden');
  celebrateBtn.disabled = false;
  resetEnvelope();
});

// ============ Envelope open + typing letter ============
const envelope = document.getElementById('envelope');
const envelopeHint = document.getElementById('envelopeHint');
const letterTextEl = document.getElementById('letterText');
let typingStarted = false;
let typingTimeout = null;

function typeLetter() {
  letterTextEl.innerHTML = '';
  const paragraphs = LETTER_MESSAGE.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

  const caret = document.createElement('span');
  caret.className = 'caret';

  let pIndex = 0;

  function typeParagraph() {
    if (pIndex >= paragraphs.length) {
      caret.remove();
      return;
    }

    const p = document.createElement('p');
    letterTextEl.appendChild(p);

    const text = paragraphs[pIndex];
    let i = 0;

    function step() {
      if (i <= text.length) {
        p.textContent = text.slice(0, i);
        p.appendChild(caret);
        i++;
        typingTimeout = setTimeout(step, 18);
      } else {
        pIndex++;
        typingTimeout = setTimeout(typeParagraph, 350);
      }
    }
    step();
  }

  typeParagraph();
}

function resetEnvelope() {
  envelope.classList.remove('open');
  envelopeHint.classList.remove('hide');
  clearTimeout(typingTimeout);
  letterTextEl.innerHTML = '';
  typingStarted = false;
}

envelope.addEventListener('click', () => {
  if (envelope.classList.contains('open')) return;
  envelope.classList.add('open');
  envelopeHint.classList.add('hide');

  if (!typingStarted) {
    typingStarted = true;
    setTimeout(typeLetter, 500);
  }
});

