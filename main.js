(() => {
  const $ = (id) => document.getElementById(id);
  $('year').textContent = new Date().getFullYear();

  /* Barra fixa de compra: aparece depois do 1.º botão e esconde-se quando o botão final está à vista */
  const sticky = $('sticky');
  const main = $('mainCta'), fin = $('finalCta');
  let mainSeen = true, finSeen = false, passed = false;
  function upd() {
    const on = passed && !mainSeen && !finSeen;
    sticky.classList.toggle('show', on);
    document.body.classList.toggle('has-sticky', passed);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((e) => { mainSeen = e[0].isIntersecting; if (!mainSeen) passed = true; upd(); }).observe(main);
    new IntersectionObserver((e) => { finSeen = e[0].isIntersecting; upd(); }).observe(fin);
  } else { sticky.classList.add('show'); }

  /* Barra de prova social (número simulado, sem servidor) */
  const SHOW_BAR_AFTER = 4000; // ms depois de abrir a página
  function fakeCount() {
    const d = new Date();
    const day = d.getFullYear() * 1000 + d.getMonth() * 40 + d.getDate();
    const seed = (day * 9301 + 49297) % 233280 / 233280;
    const hour = d.getHours() + d.getMinutes() / 60;
    return Math.round(12 + hour * 2.6 + seed * 14 + (Math.random() * 6 - 3));
  }
  setTimeout(() => {
    const bar = $('liveBar'), num = $('liveNum');
    let n = fakeCount();
    num.textContent = n; bar.hidden = false; document.body.classList.add('bar-on');
    (function tick() { setTimeout(() => { n += 1; num.textContent = n; tick(); }, 20000 + Math.random() * 40000); })();
  }, SHOW_BAR_AFTER);
})();
