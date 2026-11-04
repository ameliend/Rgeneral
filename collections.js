'use strict';
window.RGCollections = (() => {
  const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clamp=(page,total,size)=>Math.max(1,Math.min(Number(page)||1,Math.max(1,Math.ceil(total/size))));
  function render({id,total,page=1,pageSize=6,sizes=[6,12,24],label='éléments',controls=''}) {
    page=clamp(page,total,pageSize);const count=Math.max(1,Math.ceil(total/pageSize)),from=total?(page-1)*pageSize+1:0,to=Math.min(page*pageSize,total),pages=[...new Set([1,...Array.from({length:5},(_,i)=>page-2+i).filter(n=>n>1&&n<count),count])].sort((a,b)=>a-b);
    const control=controls?`aria-controls="${escape(controls)}"`:'';
    const button=(n,text,attrs='')=>`<button type="button" data-collection="${escape(id)}" data-collection-page="${n}" ${control} ${attrs}>${text}</button>`;
    let previous=0;const numbered=pages.map(n=>{const gap=n-previous>1?'<span class="rg-pagination-gap" aria-hidden="true">…</span>':'';previous=n;return gap+button(n,String(n),`aria-label="Page ${n}" ${n===page?'aria-current="page"':''}`);}).join('');
    return `<nav class="rg-pagination" aria-label="Pagination des ${escape(label)}" data-pagination="${escape(id)}"><span class="rg-pagination-status" role="status">${from}–${to} sur ${total} ${escape(label)}</span><div class="rg-pagination-size"><label for="${escape(id)}-page-size">Par page</label><select id="${escape(id)}-page-size" data-collection-size="${escape(id)}">${sizes.map(size=>`<option value="${size}" ${size===pageSize?'selected':''}>${size}</option>`).join('')}</select></div><div class="rg-pagination-pages">${button(page-1,'‹',`aria-label="Page précédente" ${page===1?'disabled':''}`)}${numbered}${button(page+1,'›',`aria-label="Page suivante" ${page===count?'disabled':''}`)}</div></nav>`;
  }
  return {render,clamp};
})();
