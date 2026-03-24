// js/interactive.js
class InteractiveEffects {
    constructor() {
        this.init();
    }

    init() {
        // Custom cursor
        this.createCustomCursor();
        
        // Scroll animations
        this.setupScrollAnimations();
        
        // Hover effects
        this.setupHoverEffects();
        
        // Smooth navigation
        this.setupSmoothNavigation();
    }

    createCustomCursor() {
        const cursor = document.createElement('div');
        cursor.id = 'custom-cursor';
        document.body.appendChild(cursor);
        
        // Hide cursor on mobile
        if (window.innerWidth < 768) {
            cursor.style.display = 'none';
            return;
        }
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        // Hover elements
        const hoverElements = document.querySelectorAll('a, button, .project-card, .card, .btn');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Add delay for staggered animations
                    const children = entry.target.querySelectorAll('.fade-in-child');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('visible');
                        }, index * 100);
                    });
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe all fade-in elements
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }

    setupHoverEffects() {
        // Project card tilt effect
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                if (window.innerWidth < 768) return;
                
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateY = ((x - centerX) / centerX) * 5;
                const rotateX = ((centerY - y) / centerY) * 5;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
        
        // Skill tags pulse effect
        document.querySelectorAll('.skill-tag, .tech-tag').forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                tag.style.animation = 'pulse 0.5s ease';
                setTimeout(() => {
                    tag.style.animation = '';
                }, 500);
            });
        });
    }

    setupSmoothNavigation() {
        // Add smooth scrolling to all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offset = 80; // Adjust for navbar height
                    const targetPosition = targetElement.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        navbarToggler.click();
                    }
                }
            });
        });
        
        // Navbar background on scroll
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .fade-in-child {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.4s ease, transform 0.4s ease;
    }
    
    .fade-in-child.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .scrolled {
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
    }
    
    .dark-mode .scrolled {
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3) !important;
    }
    
    /* Typewriter effect for hero */
    .typewriter {
        overflow: hidden;
        border-right: 2px solid #00b4ff;
        white-space: nowrap;
        margin: 0 auto;
        animation: typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite;
    }
    
    @keyframes typing {
        from { width: 0 }
        to { width: 100% }
    }
    
    @keyframes blink-caret {
        from, to { border-color: transparent }
        50% { border-color: #00b4ff; }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InteractiveEffects();
});