(async () => {
  const k = await chrome.storage.local.get(['apiKey', 'baseId']);
  document.getElementById('apiKey').value = k.apiKey || '';
  document.getElementById('baseId').value = k.baseId || '';
  document.getElementById('save').onclick = async () => {
    await chrome.storage.local.set({
      apiKey: document.getElementById('apiKey').value,
      baseId: document.getElementById('baseId').value,
    });
    alert('Options sauvegardées');
  };
  document.getElementById('clear').onclick = async () => {
    await chrome.storage.local.clear();
    alert('Stockage purgé');
  };
})();
