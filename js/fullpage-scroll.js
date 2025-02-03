let isScrolling = false;
let currentSectionIndex = 0;
let sections = [];

function setupFullPageScroll() {
    // Get all sections
    sections = Array.from(document.querySelectorAll('.hero-section, .features-section, .cross-platform-section'));

    if (sections.length === 0) {
        console.log('No sections found, retrying...');
        setTimeout(setupFullPageScroll, 100);
        return;
    }

    console.log('Full page scroll initialized with sections:', sections.length);

    // Create page indicators
    createPageIndicators();

    // Prevent default scroll
    document.body.style.overflow = 'hidden';

    // Mouse wheel event
    window.addEventListener('wheel', handleScroll, { passive: false });

    // Touch events
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                scrollToSection('down');
            } else {
                scrollToSection('up');
            }
        }
    }, { passive: true });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
            scrollToSection('up');
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            scrollToSection('down');
            e.preventDefault();
        }
    });
}

function createPageIndicators() {
    // Remove existing indicators if any
    const existingIndicators = document.querySelector('.page-indicators');
    if (existingIndicators) {
        existingIndicators.remove();
    }

    const indicators = document.createElement('div');
    indicators.className = 'page-indicators';

    sections.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'page-dot' + (index === 0 ? ' active' : '');
        dot.addEventListener('click', () => scrollToSectionByIndex(index));
        indicators.appendChild(dot);
    });

    document.body.appendChild(indicators);

    // Add styles
    if (!document.querySelector('#page-indicators-style')) {
        const style = document.createElement('style');
        style.id = 'page-indicators-style';
        style.textContent = `
            .page-indicators {
                position: fixed;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                z-index: 1000;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .page-dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                cursor: pointer;
                transition: all 0.3s ease;
                border: 2px solid rgba(74, 85, 104, 0.5);
            }
            
            .page-dot:hover {
                transform: scale(1.2);
            }
            
            .page-dot.active {
                background: #4a5568;
                transform: scale(1.2);
            }
        `;
        document.head.appendChild(style);
    }
}

function handleScroll(e) {
    e.preventDefault();
    if (isScrolling) return;

    const direction = e.deltaY > 0 ? 'down' : 'up';
    scrollToSection(direction);
}

function scrollToSection(direction) {
    if (isScrolling) return;

    const newIndex = direction === 'down'
        ? Math.min(currentSectionIndex + 1, sections.length - 1)
        : Math.max(currentSectionIndex - 1, 0);

    if (newIndex === currentSectionIndex) return;

    scrollToSectionByIndex(newIndex);
}

function scrollToSectionByIndex(index) {
    if (isScrolling || index === currentSectionIndex) return;

    isScrolling = true;
    currentSectionIndex = index;

    // Update indicators
    document.querySelectorAll('.page-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSectionIndex);
    });

    // Scroll to section
    sections[currentSectionIndex].scrollIntoView({ behavior: 'smooth' });

    // Reset scroll lock after animation
    setTimeout(() => {
        isScrolling = false;
    }, 1000);
}

// Make function available globally for Blazor
window.initFullPageScroll = setupFullPageScroll;