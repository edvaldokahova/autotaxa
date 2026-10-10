(() => {
  const UNLOCK_AT = 194; // 3:14 em segundos
  const KEY = 'autotaxa_unlocked';

  /* ---- Barra de prova social (número simulado, sem servidor) ---- */
  const BAR_AT = 155;          // segundo do vídeo em que a barra aparece
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

  const bar2 = $('liveBar');
  const barNum = $('liveNum');
  $('year').textContent = new Date().getFullYear();

  /* ---------- BARRA DE PROVA SOCIAL ---------- */
  // Número que sobe ao longo do dia e muda de visitante para visitante (não é um contador real).
  function fakeCount() {
    const d = new Date();
    const day = d.getFullYear() * 1000 + d.getMonth() * 40 + d.getDate();
    const seed = (day * 9301 + 49297) % 233280 / 233280;       // varia por dia
    const hour = d.getHours() + d.getMinutes() / 60;
    const base = 12 + hour * 2.6 + seed * 14;                  // cresce durante o dia
    return Math.round(base + (Math.random() * 6 - 3));          // variação por visitante
  }
  let barShown = false;
  function wantBar() {
    if (barShown || !bar2) return;
    barShown = true;
    let n = fakeCount();
    barNum.textContent = n;
    bar2.hidden = false;
    document.body.classList.add('bar-on');
    (function tick() {            // de vez em quando sobe +1 enquanto a pessoa está na página
      setTimeout(() => { n += 1; barNum.textContent = n; tick(); }, 20000 + Math.random() * 40000);
    })();
  }

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
    if (t >= BAR_AT && (soundOn || unlocked)) wantBar();
    if (soundOn && t >= UNLOCK_AT) unlock(false);
  });

  video.addEventListener('ended', () => unlock(false));

  /* ---------- DESBLOQUEIO AOS 3:23 ---------- */
  let unlocked = false;

  function unlock(restored) {
    if (unlocked) return;
    unlocked = true;
    wantBar();
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
  const sticky = track.firstElementChild;
  const MIN_DWELL = 500; // ms mínimos que cada print fica no ecrã
  let current = -1;
  let target = 0;
  let timer = null;

  function render(i) {
    current = i;
    imgs.forEach((im, k) => im.classList.toggle('on', k === i));
    dots.forEach((d, k) => d.classList.toggle('on', k === i));
    const last = i === N - 1;
    hint.classList.toggle('off', last);
    cta.classList.toggle('show', last);
    document.body.classList.toggle('cta-on', last);
    clearTimeout(timer);
    timer = setTimeout(step, MIN_DWELL);
  }

  // Avança no máximo 1 print de cada vez, para nenhum ser "saltado"
  function step() {
    timer = null;
    if (current === target) return;
    render(current + (target > current ? 1 : -1));
  }

  function goTo(t) {
    target = t;
    if (current === -1 || (!timer && current !== target)) step();
  }

  function reset() {
    target = 0;
    if (current !== 0) render(0);
  }

  function onScroll() {
    if (!unlocked) return;
    const r = track.getBoundingClientRect();
    const total = track.offsetHeight - sticky.offsetHeight;
    const inView = r.top < window.innerHeight * 0.6;

    // Shortcut some quando a secção já está à vista
    shortcut.classList.toggle('show', r.top > window.innerHeight * 0.6);

    if (!inView) { reset(); return; }
    const p = Math.min(1, Math.max(0, -r.top / total));
    goTo(Math.round(p * (N - 1)));
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  render(0);
})();
