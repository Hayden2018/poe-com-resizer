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

            const existingHandle = document.querySelector('#resize-handle');
            if (existingHandle) existingHandle.remove();

            const handleDot = document.createElement('div');
            handleDot.style.height = '38px';
            handleDot.style.width = '5px';
            handleDot.style.background = '#ececec';
            handleDot.style.borderRadius = '2px';
            handleDot.style.margin= 'calc(50vh - 38px) 3px';

            const handle = document.createElement('div');
            handle.style.height = '100vh';
            handle.style.width = '11px';
            handle.style.background = '#7676d0';
            handle.style.cursor = 'ew-resize';
            handle.id = 'resize-handle';
            handle.appendChild(handleDot);

            outerBox.appendChild(handle);
            let isDragging = false;
            let startX;
            let baseX;
            
            handle.addEventListener('mousedown', function (e) {
                isDragging = true;
                startX = e.clientX;
                baseX = outerBox.clientWidth;
            });
            
            document.addEventListener('mousemove', function (e) {
                if (isDragging) {
                    const newWidth = baseX + 2 * (e.clientX - startX);
                    outerStyle.textContent = `${OUTER_CONTAINER} { max-width: ${newWidth}px }`;
                }
            });
            
            document.addEventListener('mouseup', function () {
                isDragging = false;
            });
        }
    }, 20);
}

// Apply the layout change onload
window.onload = () => {
    const pushState = history.pushState;
    const style = document.createElement('style');
    style.textContent = `
        ${OUTER_CONTAINER} { 
            margin: auto;
            min-width: 1000px;
            max-width: 1600px;
        }
        ${CONTAINER} { width: 100% }
        ${INNER_CONTAINER} { max-width: none }
        ${BOT_BUBBLE} { max-width: none }
        ${HUMAN_BUBBLE} { max-width: none }
    `;
    document.body.appendChild(style);
    document.body.appendChild(outerStyle);
    addResizeHandle();
    window.history.pushState = function() {
        clearInterval(retryInterval);
        addResizeHandle();
        return pushState.apply(history, arguments);
    };
}
