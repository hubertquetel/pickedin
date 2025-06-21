(() => {
  if (window.__MYL_INJECTED__ && document.getElementById('myl_btn')) return;
  window.__MYL_INJECTED__ = true;
  document.getElementById('myl_btn')?.remove();
  document.getElementById('myl_panel')?.remove();

  // UI
  const btn = document.createElement('div'); btn.id = 'myl_btn';
  const handle = document.createElement('div'); handle.id = 'myl_handle';
  const label = document.createElement('div'); label.className = 'label'; label.textContent = 'pIn';
  btn.append(handle, label); document.body.appendChild(btn);

  const panel = document.createElement('div'); panel.id = 'myl_panel';
  panel.innerHTML = `
    <header>PickedIn</header>
    <div id="controls">
      <button id="add_btn">Ajouter un profil</button>
      <button id="view_btn">Voir les articles</button>
    </div>
    <div id="myl_count">0 / 50</div>
    <div id="myl_list"></div>
    <div id="import_export">
      <button id="import_btn">Importer</button>
      <button id="export_btn">Exporter</button>
    </div>`;
  document.body.appendChild(panel);

  // Drag on handle
  handle.addEventListener('mousedown', e => {
    e.preventDefault();
    let startY = e.clientY, origTop = parseFloat(btn.style.top) || 0;
    const onMove = ev => {
      let newTop = origTop + (ev.clientY - startY);
      newTop = Math.max(0, Math.min(window.innerHeight - btn.offsetHeight, newTop));
      btn.style.top = newTop + 'px';
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      handle.style.cursor = 'grab';
    };
    handle.style.cursor = 'grabbing';
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

  // Toggle panel on label click
  label.addEventListener('click', () => panel.classList.toggle('open'));

  // Storage helpers
  const getProfiles = async () => (await chrome.storage.local.get('urns')).urns || [];
  const saveProfiles = list => chrome.storage.local.set({ urns: list });

  // Render
  const render = async () => {
    const list = await getProfiles();
    document.getElementById('myl_count').textContent = `${list.length} / 50`;
    const container = document.getElementById('myl_list'); container.innerHTML = '';
    list.forEach((p, i) => {
      const div = document.createElement('div'); div.className='myl_item';
      const span = document.createElement('span'); span.textContent=`${i+1}. ${p.name||p.urn}`;
      const link = document.createElement('button'); link.className='posts_btn';
      link.textContent='🔗'; link.title='Voir les articles';
      link.onclick = () => {
        const id=p.urn.replace(/^urn:li:fs_profile:/,'');
        window.open(`https://www.linkedin.com/search/results/content/?fromMember=%5B%22${id}%22%5D&origin=FACETED_SEARCH&sortBy=%22date_posted%22`,'_blank');
      };
      const del = document.createElement('button'); del.className='delete_btn'; del.textContent='×';
      del.onclick = async () => { const arr=(await getProfiles()).filter(x=>x.urn!==p.urn); await saveProfiles(arr); render(); };
      div.append(span, link, del); container.appendChild(div);
    });
  };

  // Button logic
  document.getElementById('add_btn').onclick = async () => {
    const slug = window.location.pathname.split('/')[2];
    let urn = null;
    try {
      const token = document.cookie.match(/JSESSIONID=(".*?"|[^;]+)/)[1].replace(/"/g,'');
      const res = await fetch(`https://www.linkedin.com/voyager/api/identity/profiles/${slug}`, {
        headers: { 'csrf-token': token, 'x-restli-protocol-version':'2.0.0','Accept':'application/json' }
      });
      if (res.ok) urn = (await res.json()).entityUrn;
    } catch {}
    const name = document.querySelector('h1')?.innerText.trim() || '';
    if (!urn) return alert('Impossible de récupérer l’URN');
    const list = await getProfiles(); if (list.some(x=>x.urn===urn)) return alert('Déjà enregistré');
    if (list.length>=50) return alert('Limite atteinte');
    list.push({ urn, name }); await saveProfiles(list); render();
  };
  document.getElementById('view_btn').onclick = async () => {
    const ids=(await getProfiles()).map(p=>p.urn.replace(/^urn:li:fs_profile:/,''));
    window.open(`https://www.linkedin.com/search/results/content/?fromMember=${encodeURIComponent(JSON.stringify(ids))}&origin=FACETED_SEARCH&sortBy=%22date_posted%22`,'_blank');
  };
  document.getElementById('export_btn').onclick = async () => {
    const data = await getProfiles(); const blob=new Blob([JSON.stringify(data)],{type:'application/json'});
    const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='pickedin_export.json'; a.click(); URL.revokeObjectURL(url);
  };
  document.getElementById('import_btn').onclick = () => {
    const input = document.createElement('input'); input.type='file'; input.accept='application/json';
    input.onchange = async () => {
      if (!input.files.length) { alert('Aucun fichier sélectionné'); return; }
      const text = await input.files[0].text();
      try {
        const arr = JSON.parse(text);
        if (Array.isArray(arr)) { await saveProfiles(arr); render(); } else alert('Format invalide');
      } catch { alert('Erreur import'); }
    };
    input.click();
  };

  render();
})();
