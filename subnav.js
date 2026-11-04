'use strict';
/* Sous-navigation réutilisable : liens, défilement et accès direct. */
window.RGSubnav = (() => {
  const controllers = new Map();
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const overviewIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>';
  function render({id,label='Vues des associés',overviewHref,items,activeId='',demo=false}) {
    return `<div class="rg-subnav" data-subnav ${demo?'data-subnav-demo':''} id="${escape(id)}"><a class="rg-subnav-overview" href="${escape(overviewHref)}" ${!activeId?'aria-current="page"':''}>${overviewIcon}<span>Aperçu d’ensemble</span></a><div class="rg-subnav-scroll"><button type="button" class="rg-subnav-arrow" data-subnav-step="-1" aria-label="Afficher les associés précédents" aria-controls="${escape(id)}-track"><span aria-hidden="true">‹</span></button><nav class="rg-subnav-track" id="${escape(id)}-track" aria-label="${escape(label)}">${items.map(item=>`<a class="rg-subnav-link" href="${escape(item.href)}" data-subnav-id="${escape(item.id)}" ${activeId===item.id?'aria-current="page"':''}><span class="rg-subnav-avatar" aria-hidden="true">${escape(item.avatar||item.label.split(/\s+/).slice(0,2).map(s=>s[0]).join(''))}</span><span>${escape(item.label)}</span></a>`).join('')}</nav><button type="button" class="rg-subnav-arrow" data-subnav-step="1" aria-label="Afficher les associés suivants" aria-controls="${escape(id)}-track"><span aria-hidden="true">›</span></button></div><div class="rg-subnav-picker"><label class="rg-subnav-sr" for="${escape(id)}-select">Accès direct à un associé (${items.length})</label><select id="${escape(id)}-select" data-subnav-select><option value="" ${!activeId?'selected':''}>Aperçu d’ensemble</option>${items.map(item=>`<option value="${escape(item.id)}" ${activeId===item.id?'selected':''}>${escape(item.label)}</option>`).join('')}</select><span class="rg-subnav-count" aria-label="${items.length} associés">${items.length}</span></div></div>`;
  }
  function hydrate(container=document) {
    for (const [root,controller] of controllers) if (!root.isConnected) { controller.observer?.disconnect(); controllers.delete(root); }
    container.querySelectorAll('[data-subnav]').forEach(root => {
      if (controllers.has(root)) return;
      const track=root.querySelector('.rg-subnav-track'),previous=root.querySelector('[data-subnav-step="-1"]'),next=root.querySelector('[data-subnav-step="1"]');
      function update() { const limit=track.scrollWidth-track.clientWidth; previous.disabled=track.scrollLeft<=2; next.disabled=limit-track.scrollLeft<=2; root.dataset.overflow=String(limit>2); }
      function reveal(link) { if(!link)return;const relative=link.getBoundingClientRect().left-track.getBoundingClientRect().left+track.scrollLeft;const left=relative-(track.clientWidth-link.offsetWidth)/2;track.scrollTo({left:Math.max(0,left),behavior:'auto'});update(); }
      root.querySelectorAll('[data-subnav-step]').forEach(button => button.addEventListener('click', () => track.scrollBy({left:Number(button.dataset.subnavStep)*Math.max(140,track.clientWidth*.75),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})));
      track.addEventListener('scroll',update,{passive:true});
      track.addEventListener('focusin',event=>reveal(event.target.closest('a')));
      track.addEventListener('keydown',event=>{
        const links=[...track.querySelectorAll('a')],index=links.indexOf(event.target);if(index<0)return;let target;
        if(event.key==='ArrowRight')target=links[Math.min(index+1,links.length-1)];if(event.key==='ArrowLeft')target=links[Math.max(index-1,0)];if(event.key==='Home')target=links[0];if(event.key==='End')target=links.at(-1);
        if(target){event.preventDefault();target.focus({preventScroll:true});reveal(target);}
      });
      root.querySelector('[data-subnav-select]').addEventListener('change',event=>{
        const value=event.target.value,link=value?[...track.querySelectorAll('a')].find(link=>link.dataset.subnavId===value):root.querySelector('.rg-subnav-overview');link?.click();
      });
      const observer='ResizeObserver' in window?new ResizeObserver(()=>{update();reveal(track.querySelector('[aria-current="page"]'));}):null;observer?.observe(track);controllers.set(root,{observer,update,reveal});
      update();reveal(track.querySelector('[aria-current="page"]'));
    });
  }
  window.addEventListener('resize',()=>controllers.forEach(c=>c.update()),{passive:true});
  function select(root,id='') {
    root.querySelectorAll('a').forEach(link=>{const active=link.classList.contains('rg-subnav-overview')?!id:link.dataset.subnavId===id;if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
    root.querySelector('[data-subnav-select]').value=id;
    const selected=[...root.querySelectorAll('.rg-subnav-link')].find(link=>link.dataset.subnavId===id);
    controllers.get(root)?.reveal(selected);
  }
  return {render,hydrate,select};
})();
