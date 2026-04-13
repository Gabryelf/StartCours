// Just keep service worker alive and handle basic tasks
chrome.runtime.onInstalled.addListener(() => {
    console.log('Tab Manager installed');
  });
  
  // Listen for tab updates to maintain counts
  chrome.tabs.onCreated.addListener(() => {
    updateBadge();
  });
  
  chrome.tabs.onRemoved.addListener(() => {
    updateBadge();
  });
  
  // Update extension badge with tab count
  async function updateBadge() {
    const tabs = await chrome.tabs.query({});
    const count = tabs.length;
    chrome.action.setBadgeText({ text: count.toString() });
    chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });
  }
  
  updateBadge();