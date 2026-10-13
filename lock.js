(function(){function go(){var t=document.querySelector('.box.offer');if(t)t.scrollIntoView({behavior:'smooth',block:'center'})}
document.addEventListener('contextmenu',function(e){if(e.target.closest&&e.target.closest('.lock'))e.preventDefault()});
document.addEventListener('dragstart',function(e){if(e.target.closest&&e.target.closest('.lock'))e.preventDefault()});
document.querySelectorAll('.slide').forEach(function(sl){var k=sl.querySelector('i'),x0=null,mv=false;
function reset(){k.style.transition='left .25s';k.style.left='4px';setTimeout(function(){k.style.transition=''},260)}
sl.addEventListener('click',function(){if(!mv)go();mv=false});
sl.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}});
sl.addEventListener('pointerdown',function(e){x0=e.clientX;mv=false;try{sl.setPointerCapture(e.pointerId)}catch(_){}});
sl.addEventListener('pointermove',function(e){if(x0===null)return;var d=Math.max(0,Math.min(e.clientX-x0,sl.clientWidth-44));if(d>4)mv=true;k.style.left=(4+d)+'px'});
sl.addEventListener('pointerup',function(e){if(x0===null)return;var d=e.clientX-x0;x0=null;if(d>20)go();reset();setTimeout(function(){mv=false},50)});
sl.addEventListener('pointercancel',function(){x0=null;reset()})})})();
