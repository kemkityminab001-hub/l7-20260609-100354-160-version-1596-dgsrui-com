
(function(){
function esc(s){return String(s||'').replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function fmt(n){n=+n||0; return n>10000 ? (n/10000).toFixed(1)+'万' : n.toString();}
function renderCard(m){
 const txt=[m.title,m.year,m.region,m.genre,m.category,(m.tags||[]).join(' '),m.oneLine].join(' ');
 return `<a class="card movie-card" href="video/${m.id}.html" data-search-text="${esc(txt)}" data-year="${m.year}" data-rating="${m.rating}" data-views="${m.views}" data-index="${+m.id}">
 <span class="poster-wrap card-poster" data-title="${esc(m.title)}"><img src="${m.coverIndex}.jpg" alt="${esc(m.title)}" loading="lazy" onerror="this.closest('.poster-wrap').classList.add('poster-missing');this.remove();"><span class="poster-over"><b class="badge">${esc(m.category)}</b><b class="badge gold">${esc(m.rating)}</b></span><b class="badge dark poster-duration">${esc(m.duration)}</b></span>
 <span class="card-body"><strong class="card-title">${esc(m.title)}</strong><span class="card-desc">${esc(m.oneLine)}</span><span class="meta-line"><span>${m.year}</span><span>${esc(m.region)}</span><span>👁 ${fmt(m.views)}</span></span></span></a>`;
}
function apply(){
 const q=(document.querySelector('#search-q')?.value||'').trim().toLowerCase();
 const cat=document.querySelector('#search-cat')?.value||'all';
 const sort=document.querySelector('#search-sort')?.value||'views';
 let list=(window.MOVIES||[]).filter(m=>{
   const text=[m.title,m.year,m.region,m.genre,m.category,(m.tags||[]).join(' '),m.oneLine].join(' ').toLowerCase();
   return (!q || text.includes(q)) && (cat==='all' || m.categorySlug===cat);
 });
 list.sort((a,b)=> sort==='year' ? b.year-a.year : sort==='rating' ? parseFloat(b.rating)-parseFloat(a.rating) : b.views-a.views);
 const count=document.querySelector('#search-count'); if(count) count.textContent=list.length+' 条结果';
 const box=document.querySelector('#search-results'); if(box) box.innerHTML=list.slice(0,240).map(renderCard).join('');
 const more=document.querySelector('#search-more'); if(more) more.textContent=list.length>240 ? '已展示前 240 条，可继续输入关键词缩小范围。' : '';
}
document.addEventListener('DOMContentLoaded',()=>{
 ['#search-q','#search-cat','#search-sort'].forEach(s=>{const el=document.querySelector(s); if(el){el.addEventListener('input',apply);el.addEventListener('change',apply);}});
 const params=new URLSearchParams(location.search); const q=params.get('q'); if(q){const input=document.querySelector('#search-q'); if(input) input.value=q;}
 const sort=params.get('sort'); if(sort){const select=document.querySelector('#search-sort'); if(select) select.value=sort;}
 apply();
});
})();
