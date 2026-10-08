(() => {
  const UNLOCK_AT = 194; // 3:14 em segundos
  const KEY = 'autotaxa_unlocked';

  const $ = (id) => document.getElementById(id);
  const video = $('vslVideo');
  const soundBtn = $('soundBtn');
  const bar = $('vslBar');
  const section = $('veredito');
  const shortcut = $('shortcut');
  const track = $('proofTrack');
  const imgs = [...document.querySelectorAll('#proofStage img')];
  const dots = [...document.querySelectorAll('#proofDots i')];
  const hint = $('scrollHint');
  const cta = $('ctaCard');
  const N = imgs.length;

  $('year').textContent = new Date().getFullYear();

  /* ---------- VSL ---------- */
  let soundOn = false;
  let maxTime = 0;

  video.play().catch(() => {});

  soundBtn.addEventListener('click', () => {
    soundOn = true;
    video.muted = false;
    video.currentTime = 0;
    maxTime = 0;
    video.play().catch(() => {});
    soundBtn.hidden = true;
  });

  // Depois de ativar o som, tocar no vídeo pausa/retoma
  video.addEventListener('click', () => {
    if (!soundOn) return;
    video.paused ? video.play() : video.pause();
  });

  // Impede saltar para a frente (só pode ver o que já viu)
  video.addEventListener('seeking', () => {
    if (video.currentTime > maxTime + 1.5) video.currentTime = maxTime;
  });

  video.addEventListener('timeupdate', () => {
    const t = video.currentTime;
    if (t > maxTime) maxTime = t;
    if (video.duration) bar.style.width = (t / video.duration) * 100 + '%';
    if (soundOn && t >= UNLOCK_AT) unlock(false);
  });

  video.addEventListener('ended', () => unlock(false));

  /* ---------- DESBLOQUEIO AOS 3:23 ---------- */
  let unlocked = false;

  function unlock(restored) {
    if (unlocked) return;
    unlocked = true;
    section.hidden = false;
    shortcut.hidden = false;
    requestAnimationFrame(() => shortcut.classList.add('show'));
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
    onScroll();
  }

  try { if (sessionStorage.getItem(KEY) === '1') unlock(true); } catch (e) {}

  shortcut.addEventListener('click', (e) => {
    e.preventDefault();
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ---------- PROVAS: troca de imagens ao rolar ---------- */
  let current = -1;

  function show(i) {
    if (i === current) return;
    current = i;
    imgs.forEach((im, k) => im.classList.toggle('on', k === i));
    dots.forEach((d, k) => d.classList.toggle('on', k === i));
    const last = i === N - 1;
    hint.classList.toggle('off', last);
    cta.classList.toggle('show', last);
  }

  function onScroll() {
    if (!unlocked) return;
    const r = track.getBoundingClientRect();
    const total = track.offsetHeight - window.innerHeight;
    const inView = r.top < window.innerHeight * 0.6;

    // Shortcut some quando a secção já está à vista
    shortcut.classList.toggle('show', r.top > window.innerHeight * 0.6);

    if (!inView) { show(0); cta.classList.remove('show'); return; }
    const p = Math.min(1, Math.max(0, -r.top / total));
    show(Math.min(N - 1, Math.floor(p * N)));
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  show(0);
})();
