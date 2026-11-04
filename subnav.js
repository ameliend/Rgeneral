'use strict';
/* Navigation bornée : aperçu, trois fiches et recherche paginée dans tous les associés. */
window.RGSubnav = (() => {
  const controllers=new Map(),configs=new Map(),recents=new Map();
  const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalize=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr').trim();
  const initials=item=>item.avatar||item.label.split(/\s+/).slice(0,2).map(s=>s[0]).join('');
  const overviewIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>';
  function render(options) {
    const {id,label='Accès directs aux associés',overviewHref,items,activeId='',scope='',demo=false}=options;
    configs.set(id,{...options});const key=id+':'+scope,old=recents.get(key)||[];
    const recent=[...new Set([activeId,...old].filter(value=>items.some(item=>item.id===value)))].slice(0,3);recents.set(key,recent);
    const visible=[...new Set([...recent,...items.map(item=>item.id)])].slice(0,3).map(id=>items.find(item=>item.id===id));
    return `<div class="rg-subnav" data-subnav ${demo?'data-subnav-demo':''} id="${escape(id)}"><a class="rg-subnav-overview" href="${escape(overviewHref)}" ${!activeId?'aria-current="page"':''}>${overviewIcon}<span>Aperçu d’ensemble</span></a><div class="rg-subnav-scroll"><button type="button" class="rg-subnav-arrow" data-subnav-step="-1" aria-label="Afficher les accès précédents" aria-controls="${escape(id)}-track"><span aria-hidden="true">‹</span></button><nav class="rg-subnav-track" id="${escape(id)}-track" aria-label="${escape(label)}">${visible.map(item=>`<a class="rg-subnav-link" href="${escape(item.href)}" data-subnav-id="${escape(item.id)}" ${activeId===item.id?'aria-current="page"':''}><span class="rg-subnav-avatar" aria-hidden="true">${escape(initials(item))}</span><span>${escape(item.label)}</span></a>`).join('')}</nav><button type="button" class="rg-subnav-arrow" data-subnav-step="1" aria-label="Afficher les accès suivants" aria-controls="${escape(id)}-track"><span aria-hidden="true">›</span></button></div><div class="rg-subnav-picker"><button type="button" data-subnav-open aria-haspopup="dialog" aria-controls="${escape(id)}-dialog">Tous les associés <span class="rg-subnav-count">${items.length}</span><span aria-hidden="true">⌕</span></button></div><dialog class="rg-subnav-dialog" id="${escape(id)}-dialog" aria-labelledby="${escape(id)}-title"><div class="rg-subnav-dialog-head"><h2 id="${escape(id)}-title">Tous les associés <span>${items.length}</span></h2><button type="button" data-subnav-close aria-label="Fermer la liste des associés">×</button></div><div class="rg-subnav-dialog-body"><label for="${escape(id)}-search">Rechercher par nom ou numéro de compte</label><input id="${escape(id)}-search" type="search" autocomplete="off" data-subnav-search placeholder="Ex. Amélien ou 20"><div class="rg-subnav-results" id="${escape(id)}-results" data-subnav-results></div><div data-subnav-pagination></div></div></dialog></div>`;
  }
  function hydrate(container=document) {
    for(const [root,c]of controllers)if(!root.isConnected){c.observer?.disconnect();controllers.delete(root);}
    container.querySelectorAll('[data-subnav]').forEach(root=>{
      if(controllers.has(root))return;
      const config=configs.get(root.id);if(!config)return;
      const track=root.querySelector('.rg-subnav-track'),previous=root.querySelector('[data-subnav-step="-1"]'),next=root.querySelector('[data-subnav-step="1"]'),dialog=root.querySelector('dialog'),search=root.querySelector('[data-subnav-search]');let page=1;
      function update(){const limit=track.scrollWidth-track.clientWidth;previous.disabled=track.scrollLeft<=2;next.disabled=limit-track.scrollLeft<=2;root.dataset.overflow=String(limit>2);}
      function reveal(link){if(!link)return;const left=link.getBoundingClientRect().left-track.getBoundingClientRect().left+track.scrollLeft-(track.clientWidth-link.offsetWidth)/2;track.scrollTo({left:Math.max(0,left),behavior:'auto'});update();}
      function draw(){const query=normalize(search.value),items=config.items.filter(item=>normalize(item.label+' '+(item.account||item.id)).includes(query));page=RGCollections.clamp(page,items.length,8);const shown=items.slice((page-1)*8,page*8);root.querySelector('[data-subnav-results]').innerHTML=shown.map(item=>`<a class="rg-subnav-result" href="${escape(item.href)}" data-subnav-id="${escape(item.id)}" ${config.activeId===item.id?'aria-current="page"':''}><span class="rg-subnav-avatar" aria-hidden="true">${escape(initials(item))}</span><span><strong>${escape(item.label)}</strong><small>Compte ${escape(item.account||item.id)}</small></span><span aria-hidden="true">→</span></a>`).join('')||'<p class="rg-subnav-empty">Aucun associé ne correspond à votre recherche.</p>';root.querySelector('[data-subnav-pagination]').innerHTML=RGCollections.render({id:'picker-'+root.id,total:items.length,page,pageSize:8,sizes:[8],label:'associés',controls:root.id+'-results'});}
      root.querySelector('[data-subnav-open]').addEventListener('click',()=>{page=1;search.value='';draw();dialog.showModal();search.focus();});
      root.querySelector('[data-subnav-close]').addEventListener('click',()=>dialog.close());
      search.addEventListener('input',()=>{page=1;draw();});
      search.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();root.querySelector('.rg-subnav-result')?.focus();}});
      dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
      dialog.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();dialog.close();}});
      dialog.addEventListener('close',()=>root.querySelector('[data-subnav-open]')?.focus({preventScroll:true}));
      root.addEventListener('click',event=>{
        const control=event.target.closest('[data-collection-page]');if(control&&control.dataset.collection==='picker-'+root.id){page=Number(control.dataset.collectionPage);draw();root.querySelector('[aria-current="page"][data-collection-page]')?.focus({preventScroll:true});}
        const result=event.target.closest('.rg-subnav-result');if(result)dialog.close();
      });
      root.querySelectorAll('[data-subnav-step]').forEach(button=>button.addEventListener('click',()=>track.scrollBy({left:Number(button.dataset.subnavStep)*Math.max(140,track.clientWidth*.75),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})));
      track.addEventListener('scroll',update,{passive:true});track.addEventListener('focusin',event=>reveal(event.target.closest('a')));
      track.addEventListener('keydown',event=>{const links=[...track.querySelectorAll('a')],index=links.indexOf(event.target);if(index<0)return;let target;if(event.key==='ArrowRight')target=links[Math.min(index+1,links.length-1)];if(event.key==='ArrowLeft')target=links[Math.max(index-1,0)];if(event.key==='Home')target=links[0];if(event.key==='End')target=links.at(-1);if(target){event.preventDefault();target.focus({preventScroll:true});reveal(target);}});
      const observer='ResizeObserver'in window?new ResizeObserver(()=>{update();reveal(track.querySelector('[aria-current="page"]'));}):null;observer?.observe(track);controllers.set(root,{observer,update,reveal});update();reveal(track.querySelector('[aria-current="page"]'));
    });
  }
  function select(root,id=''){const config=configs.get(root.id);if(!config)return;const template=document.createElement('template');template.innerHTML=render({...config,activeId:id});const next=template.content.firstElementChild;root.replaceWith(next);hydrate();next.querySelector('[aria-current="page"]')?.focus({preventScroll:true});}
  window.addEventListener('resize',()=>controllers.forEach(c=>c.update()),{passive:true});
  return{render,hydrate,select};
})();
