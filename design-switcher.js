'use strict';
(() => {
  const page=location.pathname.split('/').pop()||'index.html';
  const docs=['design-system.html','charte-graphique.html'];
  const sitePages=['index.html','landing.html','connexion.html','offres.html','annonce.html','depot.html','dashboard.html','societe.html','associes.html','associe.html','registre-titres.html','registre-decisions.html','registre-personnel.html','administration.html','operation.html','organisation.html'];
  const key='rg-review-return-page';
  function remember(){if(sitePages.includes(page))try{sessionStorage.setItem(key,page+location.search+location.hash);}catch{}}
  remember();window.addEventListener('hashchange',remember);
  let target='landing.html';
  try{const saved=sessionStorage.getItem(key),parsed=new URL(saved||target,location.href);if(parsed.origin===location.origin&&sitePages.includes(parsed.pathname.split('/').pop()))target=parsed.pathname.split('/').pop()+parsed.search+parsed.hash;}catch{}
  const menu=document.createElement('details');menu.className='rg-review-switcher';
  const shape='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 17h7m-3.5-3.5v7"/></svg>';
  menu.innerHTML='<summary aria-label="Naviguer entre le site, le design system et la charte graphique">'+shape+'<span>Explorer</span></summary><nav aria-label="Site et références visuelles"><span class="rg-review-label">REGISTRE GÉNÉRAL</span><a data-review-site>Le site<span>Revenir à ma dernière page</span></a><a href="design-system.html"'+(page===docs[0]?' aria-current="page"':'')+'>Design system<span>Composants & interactions</span></a><a href="charte-graphique.html"'+(page===docs[1]?' aria-current="page"':'')+'>Charte graphique<span>Identité & règles visuelles</span></a></nav>';
  menu.querySelector('[data-review-site]').href=target;
  if(!docs.includes(page))menu.querySelector('[data-review-site]').setAttribute('aria-current','page');
  document.body.append(menu);
  menu.addEventListener('toggle',()=>{if(menu.open){remember();try{const saved=sessionStorage.getItem(key);if(saved){const parsed=new URL(saved,location.href);if(parsed.origin===location.origin&&sitePages.includes(parsed.pathname.split('/').pop()))menu.querySelector('[data-review-site]').href=parsed.pathname.split('/').pop()+parsed.search+parsed.hash;}}catch{}}});
  document.addEventListener('click',event=>{if(menu.open&&!menu.contains(event.target))menu.open=false;});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.open){menu.open=false;menu.querySelector('summary').focus();}});
})();
