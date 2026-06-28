// FunNow Premium Extension - Content Script

const PREPAY_TAG = 10520;
let settings = {
  forcePrepay: true,
  autoConfirm: true,
  premiumUI: true
};

// Initialize Settings
chrome.storage.local.get(['forcePrepay', 'autoConfirm', 'premiumUI'], (res) => {
  settings = { ...settings, ...res };
  if (settings.premiumUI) injectSidebar();
  initLogic();
});

function initLogic() {
  // 1. Force Prepayment Filter
  if (settings.forcePrepay) {
    handleUrlFiltering();
  }

  // 2. Auto-Confirm Modal
  if (settings.autoConfirm) {
    observeModals();
  }

  // 3. Highlight Prepayment Products
  highlightPrepayProducts();
}

/**
 * Handle URL Parameter Injection
 */
function handleUrlFiltering() {
  const url = new URL(window.location.href);
  if (url.pathname.includes('/categories/')) {
    const filterTags = url.searchParams.get('filter_tags');
    if (!filterTags || !filterTags.includes(PREPAY_TAG)) {
      // Construction of [[10520]] format
      const newTags = filterTags ? JSON.parse(filterTags) : [];
      if (!newTags.flat().includes(PREPAY_TAG)) {
        newTags.push([PREPAY_TAG]);
        url.searchParams.set('filter_tags', JSON.stringify(newTags));
        window.location.href = url.toString();
      }
    }
  }
}

/**
 * Observe for Booking Notes Modals
 */
function observeModals() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        // Look for the "Confirm" button in the specific modal
        const confirmBtn = document.querySelector('.v-btn.bg-orange50, .v-btn--variant-elevated.bg-orange50');
        if (confirmBtn && confirmBtn.textContent.includes('下一步') || confirmBtn && confirmBtn.textContent.includes('同意')) {
           console.log('[FunNow Premium] Auto-confirming modal...');
           confirmBtn.classList.add('fn-auto-acting');
           setTimeout(() => confirmBtn.click(), 500);
        }
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * Highlight Prepay Products in Cards
 */
function highlightPrepayProducts() {
  setInterval(() => {
    const cards = document.querySelectorAll('a[href*="/branches/"]');
    cards.forEach(card => {
      // If the card has specific text or badges indicating prepayment
      if (card.textContent.includes('預付') || card.textContent.includes('訂金')) {
        card.style.border = '1px solid rgba(255, 107, 0, 0.3)';
        // Optional: add a badge
      }
    });
  }, 2000);
}

/**
 * Inject the Premium Glassmorphism Sidebar
 */
function injectSidebar() {
  if (document.getElementById('fn-premium-sidebar')) return;

  const sidebar = document.createElement('div');
  sidebar.id = 'fn-premium-sidebar';
  sidebar.className = 'fn-premium-sidebar';
  
  sidebar.innerHTML = `
    <div class="fn-pull-tab" id="fn-pull-tab">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"></path></svg>
    </div>
    <div class="fn-header">
      <div class="fn-logo">FN PREMIUM v1.0</div>
    </div>

    <div class="fn-section">
      <div class="fn-section-title">Smart Automation</div>
      <div class="fn-card">
        <span>Force Prepay</span>
        <label class="fn-switch">
          <input type="checkbox" id="fn-force-prepay" ${settings.forcePrepay ? 'checked' : ''}>
          <span class="fn-slider"></span>
        </label>
      </div>
      <div class="fn-card">
        <span>Auto-Confirm</span>
        <label class="fn-switch">
          <input type="checkbox" id="fn-auto-confirm" ${settings.autoConfirm ? 'checked' : ''}>
          <span class="fn-slider"></span>
        </label>
      </div>
    </div>

    <div class="fn-section">
      <div class="fn-section-title">Quick Actions</div>
      <button class="fn-cta" id="fn-refresh-btn">Apply Prepay Filters</button>
    </div>

    <div style="font-size: 10px; color: rgba(255,255,255,0.3); text-align: center; margin-top: 20px;">
      Optimization Active • Premium Aesthetics
    </div>
  `;

  document.body.appendChild(sidebar);

  // Sidebar Events
  const pullTab = document.getElementById('fn-pull-tab');
  pullTab.addEventListener('click', () => {
    sidebar.classList.toggle('expanded');
    const icon = pullTab.querySelector('svg path');
    if (sidebar.classList.contains('expanded')) {
      icon.setAttribute('d', 'M9 18l6-6-6-6'); // Arrow points right
    } else {
      icon.setAttribute('d', 'M15 18l-6-6 6-6'); // Arrow points left
    }
  });

  document.getElementById('fn-force-prepay').addEventListener('change', (e) => {
    chrome.storage.local.set({ forcePrepay: e.target.checked });
    if (e.target.checked) handleUrlFiltering();
  });

  document.getElementById('fn-auto-confirm').addEventListener('change', (e) => {
    chrome.storage.local.set({ autoConfirm: e.target.checked });
  });

  document.getElementById('fn-refresh-btn').addEventListener('click', () => {
    handleUrlFiltering();
  });
}
