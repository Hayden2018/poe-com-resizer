const OUTER_CONTAINER = '.PageWithSidebarLayout_centeredPage__D42BU';
const CONTAINER = '.PageWithSidebarLayout_mainSection__i1yOg';
const INNER_CONTAINER = '.ChatPageMain_container__1aaCT.ChatPageMain_narrowChatPage__fWwXM';
const BOT_BUBBLE = '.Message_botMessageBubble__CPGMI';
const HUMAN_BUBBLE = '.Message_humanMessageBubble__Nld4j';

const outerStyle = document.createElement('style');

function addResizeHandle() {
    // Wait for 100ms to ensure eveything is loaded
    setTimeout(() => {
        const outerBox = document.querySelector(OUTER_CONTAINER);
        if (outerBox.lastElementChild.id !== 'resize-handle') {

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
    }, 100);
}

// Apply the layout change onload
window.onload = () => {
    addResizeHandle();
    const pushState = history.pushState;
    const style = document.createElement('style');
    style.textContent = `
        ${OUTER_CONTAINER} { 
            min-width: 800px;
            max-width: 1440px;
        }
        ${CONTAINER} { max-width: none }
        ${INNER_CONTAINER} { max-width: none }
        ${BOT_BUBBLE} { max-width: none }
        ${HUMAN_BUBBLE} { max-width: none }
    `;
    document.head.appendChild(style);
    document.head.appendChild(outerStyle);
    window.history.pushState = function() {
        addResizeHandle();
        return pushState.apply(history, arguments);
    };
}
