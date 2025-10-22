// ===== GLOBAL VARIABLES =====
let isScrolling = false;
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeComponents();
    setupEventListeners();
    startAnimations();
});

// ===== INITIALIZATION =====
function initializeComponents() {
    // Initialize typing effect
    initTypingEffect();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize skill bars
    initSkillBars();
    
    // Initialize counter animations
    initCounterAnimations();
    
    // Initialize skills tabs
    initSkillsTabs();
    
    // Initialize tech item interactions
    initTechItemInteractions();
    
    // Initialize hero effects
    initHeroEffects();
    
    // Set active navigation
    updateActiveNavigation();
}

// ===== HERO INTERACTIVE EFFECTS =====
function initHeroEffects() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Create spotlight element
    const spotlight = document.createElement('div');
    spotlight.className = 'hero-spotlight';
    hero.insertBefore(spotlight, hero.firstChild);
    
    // Mouse move effect for spotlight
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        spotlight.style.transform = `translate(${x - 300}px, ${y - 300}px)`;
    });
    
    // Add mouse enter/leave events
    hero.addEventListener('mouseenter', () => {
        spotlight.style.opacity = '1';
    });
    
    hero.addEventListener('mouseleave', () => {
        spotlight.style.opacity = '0';
    });
    
    // Parallax effect for floating shapes
    const shapes = document.querySelectorAll('.floating-shape');
    hero.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX / window.innerWidth - 0.5) * 30;
        const moveY = (e.clientY / window.innerHeight - 0.5) * 30;
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.5;
            shape.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px) rotate(${moveX}deg)`;
        });
    });
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Navigation menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                smoothScrollTo(targetSection);
            }
        });
    });
    
    // Scroll event listener
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                handleScroll();
                isScrolling = false;
            });
            isScrolling = true;
        }
        
        // Update navigation on scroll
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveNavigation, 10);
    });
    
    // Form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
    }
    
    // Window resize
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // Intersection Observer for animations
    setupIntersectionObserver();
}

// ===== TYPING EFFECT =====
function initTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const texts = [
        'Software Development Engineer',
        'AI Engineer',
        'Machine Learning Engineer'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function typeText() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500; // Pause before starting new text
        }
        
        setTimeout(typeText, typingSpeed);
    }
    
    // Start typing effect after a short delay
    setTimeout(typeText, 1000);
}

// ===== SMOOTH SCROLLING =====
function smoothScrollTo(target) {
    const targetPosition = target.offsetTop - 80; // Account for navbar height
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let start = null;
    
    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    requestAnimationFrame(animation);
}

function easeInOutCubic(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t * t + b;
    t -= 2;
    return c / 2 * (t * t * t + 2) + b;
}

// ===== NAVIGATION ACTIVE STATE =====
function updateActiveNavigation() {
    const currentPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (currentPos >= sectionTop && currentPos < sectionBottom) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const elementsToReveal = document.querySelectorAll('.reveal, .timeline-item, .project-card, .skill-item, .tech-item');
    
    elementsToReveal.forEach(element => {
        element.classList.add('reveal');
    });
}

function setupIntersectionObserver() {
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Trigger specific animations based on element type
                if (entry.target.classList.contains('skill-progress')) {
                    animateSkillBar(entry.target);
                } else if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, options);
    
    // Observe all reveal elements
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    document.querySelectorAll('.skill-progress').forEach(el => observer.observe(el));
    document.querySelectorAll('.stat-number').forEach(el => observer.observe(el));
}

// ===== SKILL BARS ANIMATION =====
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        bar.style.width = '0%';
    });
}

function animateSkillBar(bar) {
    const targetWidth = bar.getAttribute('data-width');
    if (targetWidth && !bar.classList.contains('animated')) {
        bar.classList.add('animated');
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 200);
    }
}

// ===== COUNTER ANIMATIONS =====
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        counter.textContent = '0';
    });
}

function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    if (!counter.classList.contains('animated')) {
        counter.classList.add('animated');
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }
}

// ===== SCROLL EFFECTS =====
function handleScroll() {
    const scrollY = window.pageYOffset;
    
    // Navbar background opacity
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.8)';
        }
    }
    
    // Code window animation (removed problematic parallax effect)
    const codeWindow = document.querySelector('.code-window');
    if (codeWindow && scrollY < window.innerHeight) {
        const rotation = scrollY * 0.02; // Reduced rotation for subtlety
        codeWindow.style.transform = `rotateY(${rotation}deg) rotateX(${rotation * 0.5}deg)`;
    }
}

// ===== FORM HANDLING =====
function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!validateForm(data)) {
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual implementation)
    setTimeout(() => {
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function validateForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Please enter a valid name');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.subject || data.subject.trim().length < 3) {
        errors.push('Please enter a subject');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Please enter a message (at least 10 characters)');
    }
    
    if (errors.length > 0) {
        showNotification(errors.join(', '), 'error');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: ${type === 'success' ? 'var(--accent-success)' : type === 'error' ? 'var(--accent-secondary)' : 'var(--accent-primary)'};
        color: var(--bg-primary);
        padding: 15px 20px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        transform: translateX(400px);
        transition: var(--transition);
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== RESIZE HANDLER =====
function handleResize() {
    // Update scroll animations on resize
    updateActiveNavigation();
    
    // Reset any transform effects on mobile
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = 'none';
    }
    
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 968) {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function startAnimations() {
    // Only start resource-intensive animations if user prefers motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        // Add subtle floating animations to tech items
        const techItems = document.querySelectorAll('.tech-item');
        techItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('float-animation');
        });
        
        // Add hover effects to project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
}

// ===== EASTER EGG =====
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.length === konamiSequence.length) {
        if (konamiCode.every((code, index) => code === konamiSequence[index])) {
            activateEasterEgg();
            konamiCode = [];
        }
    }
});

function activateEasterEgg() {
    showNotification('Konami Code activated! You found the secret!', 'success');
    
    // Add rainbow effect to the logo
    const logo = document.querySelector('.logo-text');
    if (logo) {
        logo.style.background = 'linear-gradient(45deg, #ff0000, #ff7700, #ffdd00, #00ff00, #0077ff, #3300ff, #7700ff)';
        logo.style.backgroundSize = '200% 200%';
        logo.style.animation = 'rainbow 2s ease-in-out infinite';
        logo.style.webkitBackgroundClip = 'text';
        logo.style.webkitTextFillColor = 'transparent';
        
        // Reset after 5 seconds
        setTimeout(() => {
            logo.style.background = 'var(--gradient-primary)';
            logo.style.animation = 'none';
        }, 5000);
    }
}

// ===== ADD CSS FOR FLOATING ANIMATION =====
const floatingStyles = `
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
    
    .float-animation {
        animation: float 3s ease-in-out infinite;
    }
    
    @keyframes rainbow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    }
    
    .notification-close:hover {
        opacity: 0.7;
    }
`;

// Add floating styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = floatingStyles;
document.head.appendChild(styleSheet);

// ===== SKILLS TAB FUNCTIONALITY =====
function initSkillsTabs() {
    const skillTabs = document.querySelectorAll('.skill-tab');
    const skillsContents = document.querySelectorAll('[data-content]');
    
    if (!skillTabs.length || !skillsContents.length) return;
    
    skillTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            // Remove active class from all tabs
            skillTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Hide all content sections
            skillsContents.forEach(content => {
                content.classList.add('hidden');
                content.classList.remove('fade-in');
            });
            
            // Show target content with animation
            const targetContent = document.getElementById(`${targetTab}-skills`);
            if (targetContent) {
                setTimeout(() => {
                    targetContent.classList.remove('hidden');
                    targetContent.classList.add('fade-in');
                }, 100);
            }
            
            // Add a subtle notification
            const tabName = targetTab === 'ai' ? 'AI Engineer' : 'Software Engineer';
            showSkillsNotification(`Switched to ${tabName} skills`, 'info');
        });
    });
}

function showSkillsNotification(message, type) {
    // Create a subtle notification for skills switching
    const notification = document.createElement('div');
    notification.className = 'skills-notification';
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--bg-card);
        color: var(--accent-primary);
        padding: 10px 20px;
        border-radius: var(--border-radius);
        border: 1px solid var(--accent-primary);
        font-size: 0.9rem;
        z-index: 9999;
        transform: translateX(300px);
        transition: var(--transition);
        box-shadow: var(--shadow-md);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 2 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(300px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 2000);
}

// ===== ENHANCED TECH ITEM INTERACTIONS =====
function initTechItemInteractions() {
    const techItems = document.querySelectorAll('.tech-item');
    
    techItems.forEach(item => {
        item.addEventListener('click', () => {
            const techName = item.querySelector('span').textContent;
            
            // Add a pulse animation
            item.style.animation = 'techItemPulse 0.6s ease-out';
            
            setTimeout(() => {
                item.style.animation = '';
            }, 600);
            
            // Log interaction for fun
            console.log(`%c🔧 ${techName}`, 'color: #00d4ff; font-weight: bold;');
        });
        
        // Add random delay animations when they come into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = Math.random() * 0.5;
                    entry.target.style.animationDelay = `${delay}s`;
                    entry.target.classList.add('tech-item-appear');
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(item);
    });
}

// ===== CONSOLE MESSAGE =====
console.log('%c Welcome to my portfolio!', 'color: #00d4ff; font-size: 20px; font-weight: bold;');
console.log('%c Interested in the code? Check out the source on GitHub!', 'color: #8b5cf6; font-size: 14px;');
console.log('%c Try the Konami Code for a surprise! ↑↑↓↓←→', 'color: #ff006e; font-size: 12px;');
console.log('%c Click between AI and SDE tabs to see different skill sets!', 'color: #00f5a0; font-size: 12px;');