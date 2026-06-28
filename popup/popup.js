// FunNow Premium Popup Logic

document.addEventListener('DOMContentLoaded', () => {
  const switches = ['forcePrepay', 'autoConfirm', 'premiumUI'];
  
  // Load settings
  chrome.storage.local.get(switches, (res) => {
    switches.forEach(id => {
      const el = document.getElementById(id);
      if (res[id] !== undefined) {
        el.checked = res[id];
      } else {
        // Default values
        el.checked = true;
      }
    });
  });

  // Save settings on change
  switches.forEach(id => {
    document.getElementById(id).addEventListener('change', (e) => {
      const update = {};
      update[id] = e.target.checked;
      chrome.storage.local.set(update);
      
      // Notify content script of change
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {type: 'SETTING_CHANGE', settings: update});
        }
      });
    });
  });
});
