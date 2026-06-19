
(function(){
  const $ = (s, r=document)=>r.querySelector(s);
  const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));
  function norm(s){return (s||'').toString().trim().toLowerCase();}
  document.addEventListener('DOMContentLoaded', function(){
    const toggle=$('.mobile-toggle'), panel=$('.mobile-panel');
    if(toggle&&panel){toggle.addEventListener('click',()=>panel.classList.toggle('open'));}
    const slides=$$('.hero-slide'), dots=$$('.hero-dot');
    if(slides.length){let i=0; const show=(n)=>{slides[i].classList.remove('active'); if(dots[i])dots[i].classList.remove('active'); i=(n+slides.length)%slides.length; slides[i].classList.add('active'); if(dots[i])dots[i].classList.add('active');}; dots.forEach((d,n)=>d.addEventListener('click',()=>show(n))); setInterval(()=>show(i+1),5200);}
    const filterInput=$('[data-filter-input]');
    const sortSelect=$('[data-sort-select]');
    const grid=$('[data-filter-grid]');
    function applyLocalFilter(){
      if(!grid) return;
      const q=norm(filterInput&&filterInput.value);
      const cards=$$('[data-search-text]', grid);
      let shown=0;
      cards.forEach(card=>{const ok=!q || norm(card.dataset.searchText).includes(q); card.classList.toggle('is-hidden',!ok); if(ok) shown++;});
      const empty=$('.empty-state'); if(empty) empty.style.display=shown?'none':'block';
    }
    if(filterInput){filterInput.addEventListener('input', applyLocalFilter); applyLocalFilter();}
    if(sortSelect&&grid){sortSelect.addEventListener('change',()=>{
      const cards=$$('[data-search-text]', grid);
      const mode=sortSelect.value;
      cards.sort((a,b)=>{
        if(mode==='year') return (+b.dataset.year||0)-(+a.dataset.year||0);
        if(mode==='rating') return (+b.dataset.rating||0)-(+a.dataset.rating||0);
        if(mode==='views') return (+b.dataset.views||0)-(+a.dataset.views||0);
        return (+a.dataset.index||0)-(+b.dataset.index||0);
      }).forEach(c=>grid.appendChild(c));
      applyLocalFilter();
    });}
  });
})();
