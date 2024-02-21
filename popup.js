document.addEventListener('DOMContentLoaded', async () => {
    const checkbox = document.getElementById('checkbox');
    
    const cfg = await chrome.storage.local.get('hideScroll');
    checkbox.checked = !cfg.hideScroll ?? true;

    checkbox.addEventListener('change', async () => {
        if (checkbox.checked) {
            await chrome.storage.local.set({ hideScroll: false });
        } else {
            await chrome.storage.local.set({ hideScroll: true });
        }
        const tabs = await chrome.tabs.query({ url: '*://poe.com/*' });
        for (const tab of tabs) {
            if (tab.id) {
                chrome.tabs.sendMessage(tab.id, { message: 'check-scrollbar-hide' });
            }
        }
    });
});