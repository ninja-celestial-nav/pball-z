// FunNow Premium - Background Service Worker

chrome.runtime.onInstalled.addListener(() => {
  console.log('FunNow Premium Extension Installed.');
  // Initialize default settings if not exists
  chrome.storage.local.get(['forcePrepay', 'autoConfirm', 'premiumUI'], (res) => {
    if (res.forcePrepay === undefined) {
      chrome.storage.local.set({
        forcePrepay: true,
        autoConfirm: true,
        premiumUI: true
      });
    }
  });
});
