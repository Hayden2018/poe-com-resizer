const OUTER_CONTAINER = '.SidebarLayout_layoutWrapper__mPYi4';
const CONTAINER = '.InfiniteScroll_container__PHsd4';
const BOT_BUBBLE = '.Message_botMessageBubble__aYctV';
const HUMAN_BUBBLE = '.Message_humanMessageBubble__DtRxA';
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

async function initializeStyle() {
    const cfg = await chrome.storage.local.get('resizedWidth');
    const chatStyle = document.createElement('style');
    chatStyle.textContent = `
        ${OUTER_CONTAINER} { 
            margin: auto;
            min-width: 1000px;
            max-width: ${cfg.resizedWidth ?? 1600}px;
        }
        ${CONTAINER} { width: 100% }
        ${BOT_BUBBLE} { max-width: none }
        ${HUMAN_BUBBLE} { max-width: none }
    `;
    document.body.appendChild(chatStyle);
}

initializeStyle();
applyScrollBarConfig();

const script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', chrome.runtime.getURL('client.js'));
document.head.appendChild(script);

window.addEventListener('message', async (event) => {
    if (event.data.type === 'POE_RESIZED') {
        const { resizedWidth } = event.data;
        await chrome.storage.local.set({ resizedWidth });
    }
});

chrome.runtime.onMessage.addListener(
    (request, _, sendResponse) => {
        if (request.message === 'check-scrollbar-hide') {
            applyScrollBarConfig();
            sendResponse({ response: 'ok' });
        }
    }
);
