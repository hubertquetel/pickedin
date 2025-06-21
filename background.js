chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    chrome.storage.local.set({ urns: [] });
  }
});
chrome.webNavigation.onHistoryStateUpdated.addListener(details => {
  if (!details.url.includes('/in/')) return;
  chrome.scripting.executeScript({
    target: { tabId: details.tabId },
    files: ['content-script.js']
  });
});
