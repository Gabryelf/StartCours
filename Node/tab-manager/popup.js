// Load all tab statistics
async function loadStats() {
    try {
      const tabs = await chrome.tabs.query({});
      const tabCount = tabs.length;
      
      // Calculate estimated memory (40MB per tab average)
      const memoryMB = tabCount * 40;
      const memoryText = memoryMB < 1024 ? `${memoryMB} MB` : `${(memoryMB / 1024).toFixed(1)} GB`;
      
      // Find duplicate tabs (same URL)
      const urlMap = new Map();
      const duplicates = [];
      
      tabs.forEach(tab => {
        if (tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('edge://')) {
          if (urlMap.has(tab.url)) {
            duplicates.push(tab);
          } else {
            urlMap.set(tab.url, tab);
          }
        }
      });
      
      document.getElementById('tabCount').textContent = tabCount;
      document.getElementById('memoryUsage').textContent = memoryText;
      document.getElementById('duplicateCount').textContent = duplicates.length;
      
      // Store duplicates for later use
      window.duplicateTabs = duplicates;
      
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  // Close duplicate tabs
  async function closeDuplicates() {
    if (!window.duplicateTabs || window.duplicateTabs.length === 0) {
      // Show temporary message
      const btn = document.getElementById('closeDuplicatesBtn');
      const originalText = btn.textContent;
      btn.textContent = '✓ No duplicates found';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 1500);
      return;
    }
    
    const count = window.duplicateTabs.length;
    const tabIds = window.duplicateTabs.map(tab => tab.id);
    
    await chrome.tabs.remove(tabIds);
    
    // Refresh stats
    await loadStats();
    
    // Show success message
    const btn = document.getElementById('closeDuplicatesBtn');
    const originalText = btn.textContent;
    btn.textContent = `✓ Closed ${count} duplicates`;
    setTimeout(() => {
      btn.textContent = originalText;
    }, 2000);
  }
  
  // Event listeners
  document.getElementById('closeDuplicatesBtn').addEventListener('click', closeDuplicates);
  document.getElementById('refreshBtn').addEventListener('click', loadStats);
  
  // Initial load
  loadStats();
  
  // Auto-refresh every 3 seconds
  setInterval(loadStats, 3000);