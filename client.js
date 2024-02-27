const OUTER_CONTAINER = '.SidebarLayout_layoutWrapper__mPYi4';
const CONTAINER = '.MainColumn_column__UEunw';
const INNER_CONTAINER = '.ChatPageMain_container__2O2h8';
const BOT_BUBBLE = '.Message_botMessageBubble__aYctV';
const HUMAN_BUBBLE = '.Message_humanMessageBubble__DtRxA';

const outerStyle = document.createElement('style');
let retryInterval;

function addResizeHandle() {

    retryInterval = setInterval(() => {

        const outerBox = document.querySelector(OUTER_CONTAINER);
        if (!outerBox) return;
        
        if (outerBox.lastElementChild.id !== 'resize-handle') {
            clearInterval(retryInterval);

            const existingLeftBorder = document.querySelector('#left-border');
            if (existingLeftBorder) existingLeftBorder.remove();
    
            const leftBorder = document.createElement('div');
            leftBorder.style.height = '100vh';
            leftBorder.style.width = '1px';
            leftBorder.style.background = '#929292';
            leftBorder.id = 'left-border';
            outerBox.insertBefore(leftBorder, outerBox.firstChild);

            const existingHandle = document.querySelector('#resize-handle');
            if (existingHandle) existingHandle.remove();

            const handleDot = document.createElement('div');
            handleDot.style.height = '38px';
            handleDot.style.width = '4px';
            handleDot.style.background = '#ececec';
            handleDot.style.borderRadius = '2px';
            handleDot.style.margin= 'calc(50vh - 38px) 3px';

            const handle = document.createElement('div');
            handle.style.height = '100vh';
            handle.style.width = '10px';
            handle.style.background = '#7676d0';
            handle.style.cursor = 'ew-resize';
            handle.id = 'resize-handle';
            handle.appendChild(handleDot);

            outerBox.appendChild(handle);
            let isDragging = false;
            let startX;
            let baseX;
            let resizedWidth;
            
            handle.addEventListener('mousedown', function (e) {
                isDragging = true;
                startX = e.clientX;
                baseX = outerBox.clientWidth;
            });
            
            document.addEventListener('mousemove', function (e) {
                if (isDragging) {
                    const newWidth = baseX + 2 * (e.clientX - startX);
                    outerStyle.textContent = `${OUTER_CONTAINER} { max-width: ${newWidth}px }`;
                    resizedWidth = newWidth;
                }
            });
            
            document.addEventListener('mouseup', async function () {
                isDragging = false;
                window.postMessage({ type: 'POE_RESIZED', resizedWidth }, '*');
            });
        }
    }, 20);
}

window.onload = () => {
    const pushState = window.history.pushState;
    document.body.appendChild(outerStyle);
    addResizeHandle();

    window.history.pushState = function() {
        clearInterval(retryInterval);
        addResizeHandle();
        return pushState.apply(history, arguments);
    };
}
