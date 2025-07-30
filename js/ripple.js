function createRipple(event, element) {
    let panelContainer = element.closest('.experience-block, .education-block-panel, .tools-block, .contacts-block, .interests-block');
    
    if (!panelContainer) {
        panelContainer = element.closest('.grid-item');
    }
    
    if (!panelContainer) {
        if (element.closest('.languages')) {
            panelContainer = element.closest('.languages');
        }
        else if (element.closest('.tools')) {
            panelContainer = element.closest('.tools');
        }
        else if (element.closest('.extra')) {
            panelContainer = element.closest('.interests-block, .contacts-block') || element.closest('.extra');
        }
    }
    
    if (!panelContainer) return;

    const existingRipples = panelContainer.querySelectorAll('.ripple');
    existingRipples.forEach(ripple => ripple.remove());

    const rect = panelContainer.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    
    if (panelContainer.classList.contains('experience-block') && 
        panelContainer === panelContainer.parentElement.firstElementChild) {
        ripple.classList.add('ripple-dark');
    }
    if (panelContainer.closest('.contacts-block') || panelContainer.classList.contains('contacts-block')) {
        ripple.classList.add('ripple-dark');
    }

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    panelContainer.appendChild(ripple);

    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.remove();
        }
    }, 600);
}

function initializeRippleEffect() {
    document.addEventListener('click', (event) => {
        const target = event.target;
        
        if (target.contentEditable === 'true' || 
            target.classList.contains('editable') ||
            target.classList.contains('interest') ||
            target.classList.contains('progress-container') ||
            target.classList.contains('progress-bar')) {
            
            createRipple(event, target);
        }
    });

    document.addEventListener('click', (event) => {
        if (event.target.tagName === 'IMG' && event.target.closest('.tools-grid')) {
            createRipple(event, event.target);
        }
    });
}

export { initializeRippleEffect };