'use strict';
/* Interactions du catalogue uniquement ; aucune donnée métier ni aucun appel réseau. */
(() => {
  const toast = document.querySelector('#ds-toast');
  let toastTimer;
  const dismissToast = () => { clearTimeout(toastTimer); toast.replaceChildren(); };
  const scheduleToast = () => { clearTimeout(toastTimer); toastTimer = setTimeout(dismissToast, 9000); };
  function notify(message) {
    clearTimeout(toastTimer);
    const text = document.createElement('span'); text.textContent = message;
    const close = document.createElement('button'); close.type = 'button'; close.textContent = 'Fermer'; close.setAttribute('aria-label', 'Fermer la notification'); close.addEventListener('click', dismissToast);
    toast.replaceChildren(text, close); scheduleToast();
  }
  toast.addEventListener('mouseenter', () => clearTimeout(toastTimer));
  toast.addEventListener('mouseleave', scheduleToast);
  toast.addEventListener('focusin', () => clearTimeout(toastTimer));
  toast.addEventListener('focusout', () => { if (!toast.contains(document.activeElement)) scheduleToast(); });
  async function copy(value) {
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(value); notify('Copié : ' + value); return; } catch { /* Repli pour un HTML local ou un navigateur sans autorisation. */ }
    }
    const field = document.createElement('textarea'); field.value = value; field.setAttribute('aria-label', 'Valeur à copier'); field.style.cssText = 'position:fixed;left:-9999px;top:0'; document.body.append(field);
    const previous = document.activeElement; field.select(); let copied = false;
    try { copied = document.execCommand('copy'); } finally { field.remove(); previous?.focus(); }
    notify(copied ? 'Copié : ' + value : 'Copie indisponible. Valeur : ' + value);
  }
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-demo-toast],[data-copy],[data-print],[data-open-dialog],[data-close-dialog],[data-confirm-delete]');
    if (trigger) {
      if (trigger.hasAttribute('data-demo-toast')) notify(trigger.dataset.demoToast);
      if (trigger.hasAttribute('data-copy')) copy(trigger.dataset.copy);
      if (trigger.hasAttribute('data-print')) window.print();
      if (trigger.hasAttribute('data-open-dialog')) {
        const dialog = document.getElementById(trigger.dataset.openDialog);
        if (dialog && !dialog.open) { dialog.returnFocus = trigger; dialog.showModal(); }
      }
      if (trigger.hasAttribute('data-close-dialog')) trigger.closest('dialog')?.close();
      if (trigger.hasAttribute('data-confirm-delete')) { trigger.closest('dialog')?.close(); notify('Exemple de retrait confirmé. Aucun document n’a été supprimé.'); }
    }
    document.querySelectorAll('.rg-details[open]').forEach(details => { if (!details.contains(event.target)) details.open = false; });
  });
  document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('close', () => dialog.returnFocus?.focus()));
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    document.querySelectorAll('.rg-details[open]').forEach(details => { details.open = false; details.querySelector('summary')?.focus(); });
  });
  document.querySelectorAll('[role="tablist"]').forEach(list => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    function select(tab, moveFocus) {
      tabs.forEach(item => {
        const active = item === tab; item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1;
        document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
      });
      if (moveFocus) tab.focus();
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(tab, false));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== undefined) { event.preventDefault(); select(tabs[next], true); }
      });
    });
  });
  const companyForm = document.querySelector('#ds-company-form');
  companyForm?.addEventListener('submit', event => {
    event.preventDefault();
    const fields = [document.querySelector('#ds-company'), document.querySelector('#ds-siren')];
    let firstInvalid;
    fields.forEach(field => {
      const invalid = field.id === 'ds-company' ? !field.value.trim() : !/^\d{9}$/.test(field.value.replace(/\s/g, ''));
      const error = document.getElementById(field.id + '-error'); error.hidden = !invalid;
      error.textContent = invalid ? (field.id === 'ds-company' ? 'Renseignez la dénomination sociale.' : 'Saisissez un SIREN de 9 chiffres.') : '';
      field.setAttribute('aria-invalid', String(invalid)); if (invalid && !firstInvalid) firstInvalid = field;
    });
    const status = document.querySelector('#ds-form-status');
    if (firstInvalid) { status.textContent = 'Corrigez les champs indiqués avant de continuer.'; firstInvalid.focus(); }
    else { status.textContent = 'Exemple valide. Aucune donnée n’a été enregistrée ni transmise.'; notify('Formulaire de démonstration validé.'); }
  });
  document.querySelector('#ds-edit-form')?.addEventListener('submit', event => {
    event.preventDefault(); const input = document.querySelector('#ds-modal-name'); if (!input.value.trim()) { input.setCustomValidity('Renseignez un nom.'); input.reportValidity(); return; }
    input.setCustomValidity(''); document.querySelector('#ds-edit-dialog').close(); notify('Exemple validé. Aucune donnée de la société n’a été modifiée.');
  });
  document.querySelector('#ds-modal-name')?.addEventListener('input', event => event.target.setCustomValidity(''));
  document.querySelector('#ds-file')?.addEventListener('change', event => {
    const file = event.target.files[0], status = document.querySelector('#ds-file-status');
    if (!file) { status.textContent = 'Aucun fichier sélectionné.'; return; }
    if (!file.name.toLowerCase().endsWith('.pdf') || file.size > 10 * 1024 * 1024 || !file.size) {
      status.textContent = 'Choisissez un fichier .pdf non vide de 10 Mo maximum.'; event.target.value = ''; event.target.setAttribute('aria-invalid', 'true'); return;
    }
    event.target.setAttribute('aria-invalid', 'false'); status.textContent = file.name + ' · ' + new Intl.NumberFormat('fr-FR', {maximumFractionDigits:1}).format(file.size / 1024) + ' Ko · Sélectionné, non conservé.';
  });
  const rows = document.querySelector('#ds-associate-rows');
  if (rows) {
    const records = [{name:'Amélien Delahaie',account:1,shares:249,percentage:'24,90 %'},{name:'Steve Rodgers',account:2,shares:751,percentage:'75,10 %'}];
    let ascending = true;
    const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr');
    function renderRows() {
      const query = normalize(document.querySelector('#ds-table-search').value.trim());
      const filtered = records.filter(row => normalize(row.name + ' ' + row.account).includes(query)).sort((a,b) => (ascending ? 1 : -1) * a.name.localeCompare(b.name, 'fr'));
      rows.replaceChildren();
      filtered.forEach(row => {
        const tr = document.createElement('tr');
        [row.name, 'N° ' + row.account, String(row.shares), row.percentage].forEach((value,index) => { const td = document.createElement('td'); td.textContent = value; if (index >= 2) td.style.cssText = 'text-align:right;font-variant-numeric:tabular-nums'; tr.append(td); });
        const action = document.createElement('td'), link = document.createElement('a'); link.href = 'societe.html#associes/' + row.account; link.textContent = 'Voir le compte'; link.setAttribute('aria-label', 'Voir le compte de ' + row.name); action.append(link); tr.append(action); rows.append(tr);
      });
      if (!filtered.length) { const tr = document.createElement('tr'), td = document.createElement('td'); td.colSpan = 5; td.textContent = 'Aucun associé ne correspond à votre recherche.'; tr.append(td); rows.append(tr); }
      document.querySelector('#ds-results').textContent = filtered.length + (filtered.length > 1 ? ' associés' : ' associé');
    }
    document.querySelector('#ds-table-search').addEventListener('input', renderRows);
    document.querySelector('#ds-sort-name').addEventListener('click', event => { ascending = !ascending; const th = event.currentTarget.closest('th'); th.setAttribute('aria-sort', ascending ? 'ascending' : 'descending'); event.currentTarget.querySelector('span').textContent = ascending ? '↑' : '↓'; renderRows(); });
    renderRows();
  }
  const subnavDemo=document.querySelector('[data-demo-owner-nav]');
  if(subnavDemo && window.RGSubnav){
    subnavDemo.innerHTML=RGSubnav.render({id:'ds-associate-subnav',overviewHref:'#ds-owner-preview',demo:true,items:RG_VOLUME_ASSOCIATES.map((label,index)=>({id:String(index+1),label,href:'#ds-owner-preview'}))});
    RGSubnav.hydrate();
    subnavDemo.addEventListener('click',event=>{
      const link=event.target.closest('a');if(!link)return;event.preventDefault();const id=link.dataset.subnavId||'';RGSubnav.select(subnavDemo.querySelector('[data-subnav]'),id);
      const preview=document.querySelector('#ds-owner-preview'),heading=document.createElement('h3'),description=document.createElement('p');heading.textContent=id?RG_VOLUME_ASSOCIATES[Number(id)-1]:'Aperçu d’ensemble';description.textContent=id?'Compte n° '+id+' · 50 titres · 5 % du capital · Démonstration':'20 associés de démonstration · 1 000 titres · 50 titres et 5 % chacun.';preview.replaceChildren(heading,description);
    });
  }
  const paginationItems=document.querySelector('#ds-pagination-items');
  if(paginationItems){
    let page=1,size=6;const controls=document.querySelector('#ds-pagination-controls');
    function draw(){paginationItems.replaceChildren();for(let n=(page-1)*size+1;n<=Math.min(page*size,60);n++){const item=document.createElement('div');item.className='rg-card';item.textContent='Société fictive '+String(n).padStart(2,'0');paginationItems.append(item);}controls.innerHTML=RGCollections.render({id:'ds-companies',total:60,page,pageSize:size,sizes:[6,12,24],label:'sociétés',controls:'ds-pagination-items'});}
    controls.addEventListener('click',event=>{const button=event.target.closest('[data-collection-page]');if(button){page=Number(button.dataset.collectionPage);draw();controls.querySelector('[aria-current="page"]')?.focus({preventScroll:true});}});
    controls.addEventListener('change',event=>{if(event.target.dataset.collectionSize){size=Number(event.target.value);page=1;draw();controls.querySelector('select')?.focus({preventScroll:true});}});draw();
  }
  const indexLinks = [...document.querySelectorAll('.rg-index a')];
  function setCurrent(id) { indexLinks.forEach(link => { if (link.hash === '#' + id) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); }); }
  const sections = [...document.querySelectorAll('.rg-section')];
  let scrollQueued = false;
  function updateCurrentSection() {
    scrollQueued = false;
    const current = sections.filter(section => section.getBoundingClientRect().top <= 160).pop();
    setCurrent(current?.id || '');
  }
  window.addEventListener('scroll', () => {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateCurrentSection); }
  }, {passive:true});
  updateCurrentSection();
  indexLinks.forEach(link => link.addEventListener('click', () => setCurrent(link.hash.slice(1))));
})();
