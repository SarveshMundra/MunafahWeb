// Register GSAP ScrollTrigger Plugin
gsap.registerPlugin(ScrollTrigger);

const styleElement = document.createElement('style');
styleElement.textContent = `
    .feature-card {
        visibility: hidden;
    }
    .feature-card.gsap-initialized {
        visibility: visible;
    }
`;
document.head.appendChild(styleElement);

// Mouse tracking variables
let mouseX = 0;
let mouseY = 0;

// Track mouse position
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Hero Section Animations
function initHeroAnimations() {
    // Create timeline for letters animation
    const timeline = gsap.timeline({
        defaults: { ease: "power3.out" }
    });

    // Animate each letter
    const letters = document.querySelectorAll('#hero-title .letter');
    letters.forEach((letter, index) => {
        timeline.to(letter, {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.5,
            delay: index * 0.1 // Delay each letter for typing effect
        }, index * 0.1); // Start each animation after delay
    });

    // Animate tagline after letters
    timeline.to("#hero-tagline", {
        y: 50,
        opacity: 1,
        duration: 1.5
    });

    // Video scroll animation
    gsap.to(".background-video-container", {
        scrollTrigger: {
            trigger: ".features-section",
            start: "top bottom", // Start when features section hits bottom of viewport
            end: "top top", // End when features section reaches top of viewport
            scrub: 1, // Smooth scrubbing
            //    markers: true // Remove this in production, helpful for debugging
        },
        y: "0", // This ensures video stays in view
        scale: 1, // Optional: slight scale effect
        opacity: 1 // Optional: slight fade effect
    });

    // Orb animations
    const orb1 = document.querySelector('.orb-1');
    gsap.to(orb1, {
        duration: 0.2,
        repeat: -1,
        repeatRefresh: true,
        onUpdate: function () {
            const orbRect = orb1.getBoundingClientRect();
            const maxX = window.innerWidth - orbRect.width;
            const maxY = window.innerHeight - orbRect.height;
            const targetX = mouseX - (orbRect.width / 2);
            const targetY = mouseY - (orbRect.height / 2);

            gsap.to(orb1, {
                x: targetX,
                y: targetY,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    });

    // Orb-2 animation
    gsap.to(".orb-2", {
        scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: 1.5
        },
        y: 100,
        x: 50
    });
}



// Feature Animations
function initFeaturesAnimations() {
    // 1. First, immediately set initial states to prevent flash
    const cards = gsap.utils.toArray('.feature-card');
    gsap.set(cards, {
        xPercent: 100,  // Start from right edge
        opacity: 0      // Start invisible
    });

    // Make cards visible now that GSAP has set their initial state
    cards.forEach(card => {
        card.classList.add('gsap-initialized');
    });

    // 2. Create the animation timeline
    const featuresTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.features-section',
            start: 'top top', // Start when features section hits the top
            end: '+=200%',    // Reduced from 300% to tighten the animation
            pin: true,        // Pin the section while animating
            scrub: 1,         // Smooth scrubbing
            anticipatePin: 1,  // Helps prevent gap at start
            onEnter: () => console.log('Features section entered'),
            onLeave: () => console.log('Features section left'),
        }
    });

    // 3. Add animations for each card with proper timing
    cards.forEach((card, i) => {
        // Show card coming from right
        featuresTl.to(card, {
            xPercent: 0,
            opacity: 1,
            duration: 0.33,  // Each card takes 1/3 of the scroll
            ease: "power1.inOut"
        });

        // If not the last card, move it out to the left
        if (i < cards.length - 1) {
            featuresTl.to(card, {
                xPercent: -100,
                opacity: 0,
                duration: 0.33,
                ease: "power1.inOut"
            }, ">");  // Start immediately after previous animation
        }
    });

    // 4. Add final state for clean transition to next section
    featuresTl.to({}, { duration: 0.2 }); // Small buffer at the end
}



function initCrossPlatformAnimations() {
    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: "#platforms", // Assuming this is the section ID
            start: "top center", // Adjust as needed
            toggleActions: "play reverse play reverse"
        }
    });

    timeline
        .to("#platform-heading", {
            y: 50,
            opacity: 1,
            duration: 1.5,
            ease: "power3.out"
        })
        .to("#platform-tagline", {
            y: 50,
            opacity: 1,
            duration: 1.5,
            delay: 0.5,
            ease: "power3.out"
        }, "-=1") // Overlap with the previous animation by 1 second
        .to("#mobile-device", {
            y: 100,
            opacity: 1,
            duration: 2,
            ease: "power3.out"
        })
        .to("#tablet-device", {
            y: 100,
            opacity: 1,
            duration: 2,
            ease: "power3.out"
        }, "-=1.5") // Overlap with the previous animation by 1.5 seconds
        .to("#desktop-device", {
            y: 100,
            opacity: 1,
            duration: 2,
            ease: "power3.out"
        }, "-=1.5"); // Overlap with the previous animation by 1.5 seconds

    gsap.to(".devices-showcase", {
        scrollTrigger: {
            trigger: ".devices-showcase",
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        },
        y: -50,
        ease: "none"
    });
}




// Initialize all animations when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP ScrollTrigger Plugin
    gsap.registerPlugin(ScrollTrigger);

    // Initialize animations

    initHeroAnimations();

    setupGrid(); // This is from grid-setup.js

    initFeaturesAnimations();

    initCrossPlatformAnimations();
});


// Make functions available globally
window.initHeroAnimations = initHeroAnimations;
window.initFeaturesAnimations = initFeaturesAnimations;
window.initCrossPlatformAnimations = initCrossPlatformAnimations;

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});