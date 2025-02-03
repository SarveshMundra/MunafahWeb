// Register GSAP ScrollTrigger Plugin
gsap.registerPlugin(ScrollTrigger);

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
    // Create timeline for coordinated animation sequence
    const timeline = gsap.timeline({
        defaults: { ease: "power3.out" }
    });

    // Initial animations
    timeline
        .to("#hero-title", {
            y: 50,
            opacity: 1,
            scale: 1.7,
            duration: 2,
            from: { scale: 0.2 }
        })
        .to("#hero-title", {
            scale: 1,
            duration: 1
        })
        .to("#hero-tagline", {
            y: 50,
            opacity: 1,
            duration: 1.5
        }, "-=0.20");

    // Orb animations
    const orb1 = document.querySelector('.orb-1');

    // Clear any existing animations
    gsap.killTweensOf('.orb-1');

    // Add smooth cursor following
    gsap.to(orb1, {
        duration: 0.2,
        repeat: -1,
        repeatRefresh: true,
        onUpdate: function () {
            const orbRect = orb1.getBoundingClientRect();
            const maxX = window.innerWidth - orbRect.width;
            const maxY = window.innerHeight - orbRect.height;

            // Calculate target position with dampening
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

//Feature Animations
function initFeaturesAnimations() {
    const featureCards = gsap.utils.toArray('.feature-card');

    featureCards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                toggleActions: "play reverse play reverse"
            },
            y: 0,
            opacity: 0,
            duration: 1,
            delay: index * .5,
            ease: "power3.out",
            scale: 0
        });
    });
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
            delay: .5,
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