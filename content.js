const OUTER_CONTAINER = '.SidebarLayout_layoutWrapper__mPYi4';
const SETTING_CONTAINER = '.MainColumn_column__UEunw';
const CHAT_CONTAINER = '.InfiniteScroll_container__PHsd4';
const NEW_CHAT_CONTAINER = '.ChatMessagesView_emptyView__HqDf7';
const FOOTER_CONTAINER = '.ChatPageMainFooter_footerInner__BEj26';
const BOT_BUBBLE = '.Message_leftSideMessageBubble__VPdk6';
const HUMAN_BUBBLE = '.Message_rightSideMessageBubble__ioa_i';
const LEFT_SIDEBAR = '.MainLeftSidebar_sidebar__C6HpK';
const SCROLL_CONTAINER = '.ChatMessagesScrollWrapper_scrollableContainerWrapper__x8H60';

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
        ${SETTING_CONTAINER} { width: 100% }
        ${FOOTER_CONTAINER} { width: 100% }
        ${CHAT_CONTAINER} { width: 100% }
        ${NEW_CHAT_CONTAINER} {
            width: 100%;
            max-width: none;
        }
        ${BOT_BUBBLE} { max-width: 100% }
        ${HUMAN_BUBBLE} { max-width: 100% }
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
