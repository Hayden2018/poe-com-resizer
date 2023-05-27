const OUTER_CONTAINER = '.PageWithSidebarLayout_centeredPage__D42BU';
const CONTAINER = '.PageWithSidebarLayout_mainSection__i1yOg';
const BOT_BUBBLE = '.Message_botMessageBubble__CPGMI';
const HUMAN_BUBBLE = '.Message_humanMessageBubble__Nld4j';

function removeMaxWidthStyle(className, parentElement) {
    const dialogs = parentElement.querySelectorAll(className);
    dialogs.forEach(element => {
        element.style.maxWidth = 'unset';
    });
}

function addResizer() {
    // Wait for 100ms to ensure eveything is loaded
    setTimeout(() => {
        const dialogArea = document.querySelector(CONTAINER);
        dialogArea.style.maxWidth = 'unset';
        removeMaxWidthStyle(BOT_BUBBLE, dialogArea);
        removeMaxWidthStyle(HUMAN_BUBBLE, dialogArea);

        // Handle any upcoming dialog bubble
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) {
                    removeMaxWidthStyle(BOT_BUBBLE, dialogArea);
                    removeMaxWidthStyle(HUMAN_BUBBLE, dialogArea);
                }
            });
        });
        observer.observe(document, { childList: true, subtree: true });

        // Add a resize handle if it there is not one
        const outerBox = document.querySelector(OUTER_CONTAINER);
        if (outerBox.lastElementChild.id !== 'resize-handle') {

            const handleDot = document.createElement('div');
            handleDot.style.height = '38px';
            handleDot.style.width = '4px';
            handleDot.style.background = '#eaeaea';
            handleDot.style.borderRadius = '2px';
            handleDot.style.margin= 'calc(50vh - 38px) auto';

            const handle = document.createElement('div');
            handle.style.height = '100vh';
            handle.style.width = '12px';
            handle.style.background = '#6e6dc0';
            handle.style.cursor = 'ew-resize';
            handle.id = 'resize-handle';
            handle.appendChild(handleDot);

            outerBox.appendChild(handle);
            let isDragging = false;
            let startX;
            
            handle.addEventListener('mousedown', function (e) {
                isDragging = true;
                startX = e.clientX;
            });
            
            document.addEventListener('mousemove', function (e) {
                if (isDragging) {
                    const newWidth = outerBox.clientWidth + 2 * (e.clientX - startX);
                    outerBox.style.maxWidth = newWidth + 'px';
                    startX = e.clientX;
                }
            });
            
            document.addEventListener('mouseup', function () {
                isDragging = false;
            }); 
        }
    }, 100);
}

// Apply the layout change onload and navigation to new page
window.onload = () => {
    addResizer();
    const pushState = history.pushState;
    window.history.pushState = function() {
        addResizer();
        return pushState.apply(history, arguments);
    };
}
