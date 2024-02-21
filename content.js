const LEFT_SIDEBAR = '.MainLeftSidebar_sidebar__C6HpK';
const SCROLL_CONTAINER = '.MainColumn_scrollSection__A9NHB';

const scrollStyle = document.createElement('style');
scrollStyle.textContent = `
    ${LEFT_SIDEBAR} { scrollbar-width: none; }
    ${SCROLL_CONTAINER} { scrollbar-width: none; }
`;

function hideScrollBar(hide = true) {
    if (hide && !document.body.contains(scrollStyle)) {
        document.body.appendChild(scrollStyle);
    }
    if (!hide && document.body.contains(scrollStyle)) {
        scrollStyle.remove();
    }
}

async function applyScrollBarConfig() {
    const cfg = await chrome.storage.local.get('hideScroll');
    if (typeof cfg.hideScroll === 'undefined') {
        hideScrollBar(true);
        await chrome.storage.local.set({ hideScroll: true });
    } else {
        hideScrollBar(cfg.hideScroll);
    }
}

const script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', chrome.runtime.getURL('client.js'));
document.head.appendChild(script);
applyScrollBarConfig();

chrome.runtime.onMessage.addListener(
    (request, _, sendResponse) => {
        if (request.message === 'check-scrollbar-hide') {
            applyScrollBarConfig();
            sendResponse({ response: 'ok' });
        }
    }
);
