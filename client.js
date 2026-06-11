const OUTER_CONTAINER = '.SidebarLayout_layoutWrapper__mPYi4';
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
            leftBorder.style.background = '#989898';
            leftBorder.id = 'left-border';
            outerBox.insertBefore(leftBorder, outerBox.firstChild);

            const rightBorder = document.createElement('div');
            rightBorder.style.height = '100vh';
            rightBorder.style.width = '1px';
            rightBorder.style.background = '#989898';
            rightBorder.style.marginLeft = '2px';
            rightBorder.id = 'right-border';
            outerBox.appendChild(rightBorder);

            const existingHandle = document.querySelector('#resize-handle');
            if (existingHandle) existingHandle.remove();

            const handleBaseColor = '#c3b7d0';
            const handleHoverColor = '#a88eca';

            // dot is centered via flex on the handle
            const handleDot = document.createElement('div');
            handleDot.style.height = '50px';
            handleDot.style.width = '6px';
            handleDot.style.background = handleBaseColor;
            handleDot.style.borderRadius = '3px';

            const handle = document.createElement('div');
            handle.style.height = '100vh';
            handle.style.width = '18px';
            handle.style.background = 'transparent';
            handle.style.display = 'flex';
            handle.style.alignItems = 'center';
            handle.style.justifyContent = 'center';
            handle.style.cursor = 'ew-resize';
            handle.style.transition = 'background 0.2s ease';
            handle.id = 'resize-handle';
            handle.appendChild(handleDot);

            const setHandleHoverState = (isHovered) => {
                handle.style.background = isHovered ? 'rgba(168, 168, 168, 0.1)' : 'transparent';
                handleDot.style.background = isHovered ? handleHoverColor : handleBaseColor;
            };

            handle.addEventListener('mouseenter', function () {
                setHandleHoverState(true);
            });

            handle.addEventListener('mouseleave', function () {
                setHandleHoverState(false);
            });

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
