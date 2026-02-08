/* ================================================
   QuickFix Plumbing Co. - Main JavaScript
   ================================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initPreloader();
    initNavigation();
    initMobileMenu();
    initSmoothScroll();
    initStatsCounter();
    initTestimonialsSlider();
    initFAQ();
    initBackToTop();
    initScrollAnimations();
    initActiveNavLinks();
});

/* -------------------- Preloader -------------------- */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    if (preloader) {
        // Hide preloader when page is fully loaded
        window.addEventListener('load', function() {
            setTimeout(function() {
                preloader.classList.add('hidden');
                // Remove from DOM after animation
                setTimeout(function() {
                    preloader.style.display = 'none';
                }, 500);
            }, 500);
        });
        
        // Fallback: Hide preloader after 3 seconds max
        setTimeout(function() {
            if (!preloader.classList.contains('hidden')) {
                preloader.classList.add('hidden');
            }
        }, 3000);
    }
}

/* -------------------- Navigation -------------------- */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            const currentScrollY = window.scrollY;
            
            // Add/remove scrolled class for styling
            if (currentScrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            lastScrollY = currentScrollY;
        });
    }
}

/* -------------------- Mobile Menu -------------------- */
function initMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.getElementById('navLinks');
    const body = document.body;
    
    if (mobileMenu && navLinks) {
        // Toggle menu on click
        mobileMenu.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            navLinks.classList.toggle('active');
            body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking on a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(function(link) {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                navLinks.classList.remove('active');
                body.classList.remove('menu-open');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navLinks.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('active');
                navLinks.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                mobileMenu.classList.remove('active');
                navLinks.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    }
}

/* -------------------- Smooth Scroll -------------------- */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* -------------------- Stats Counter -------------------- */
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    let hasAnimated = false;
    
    if (stats.length === 0) return;
    
    function animateValue(element, start, end, duration) {
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (end - start) * easeOutQuart);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
    
    function checkStatsVisibility() {
        if (hasAnimated) return;
        
        const statsSection = document.getElementById('stats');
        if (!statsSection) return;
        
        const rect = statsSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Check if section is in viewport
        if (rect.top < windowHeight * 0.8 && rect.bottom > 0) {
            hasAnimated = true;
            
            stats.forEach(function(stat) {
                const target = parseInt(stat.dataset.target) || 0;
                animateValue(stat, 0, target, 2000);
            });
        }
    }
    
    // Check on scroll
    window.addEventListener('scroll', checkStatsVisibility);
    // Check on load (in case already in view)
    checkStatsVisibility();
}

/* -------------------- Testimonials Slider -------------------- */
function initTestimonialsSlider() {
    const track = document.querySelector('.testimonials-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('sliderDots');
    
    if (!track || cards.length === 0) return;
    
    let currentIndex = 0;
    let cardsPerView = getCardsPerView();
    let maxIndex = Math.max(0, cards.length - cardsPerView);
    let autoplayInterval;
    
    // Calculate cards per view based on screen width
    function getCardsPerView() {
        if (window.innerWidth >= 992) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }
    
    // Create dots
    function createDots() {
        if (!dotsContainer) return;
        
        dotsContainer.innerHTML = '';
        const numDots = maxIndex + 1;
        
        for (let i = 0; i < numDots; i++) {
            const dot = document.createElement('span');
            dot.classList.add('slider-dot');
            if (i === currentIndex) dot.classList.add('active');
            
            dot.addEventListener('click', function() {
                goToSlide(i);
            });
            
            dotsContainer.appendChild(dot);
        }
    }
    
    // Update dots
    function updateDots() {
        if (!dotsContainer) return;
        
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach(function(dot, index) {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Go to specific slide
    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        updateSlider();
        updateDots();
        resetAutoplay();
    }
    
    // Update slider position
    function updateSlider() {
        const cardWidth = cards[0].offsetWidth + 30; // Include gap
        const offset = currentIndex * cardWidth;
        track.style.transform = `translateX(-${offset}px)`;
    }
    
    // Next slide
    function nextSlide() {
        currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
        updateSlider();
        updateDots();
    }
    
    // Previous slide
    function prevSlide() {
        currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
        updateSlider();
        updateDots();
    }
    
    // Autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }
    
    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }
    
    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            prevSlide();
            resetAutoplay();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextSlide();
            resetAutoplay();
        });
    }
    
    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            cardsPerView = getCardsPerView();
            maxIndex = Math.max(0, cards.length - cardsPerView);
            currentIndex = Math.min(currentIndex, maxIndex);
            createDots();
            updateSlider();
        }, 250);
    });
    
    // Touch/Swipe support
    let startX = 0;
    let isDragging = false;
    
    track.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        isDragging = true;
    });
    
    track.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        e.preventDefault();
    });
    
    track.addEventListener('touchend', function(e) {
        if (!isDragging) return;
        isDragging = false;
        
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            resetAutoplay();
        }
    });
    
    // Pause autoplay on hover
    track.addEventListener('mouseenter', function() {
        clearInterval(autoplayInterval);
    });
    
    track.addEventListener('mouseleave', function() {
        startAutoplay();
    });
    
    // Initialize
    createDots();
    startAutoplay();
}

/* -------------------- FAQ Accordion -------------------- */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(function(otherItem) {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active', !isActive);
            });
        }
    });
    
    // Keyboard accessibility
    faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        }
    });
}

/* -------------------- Back to Top Button -------------------- */
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        // Scroll to top on click
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/* -------------------- Scroll Animations -------------------- */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    if (animatedElements.length === 0) return;
    
    // Simple scroll animation fallback (since we're not using AOS library)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.aosDelay || 0;
                
                setTimeout(function() {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, delay);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(function(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

/* -------------------- Active Navigation Links -------------------- */
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    function updateActiveLink() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Initial check
}

/* -------------------- Utility Functions -------------------- */

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = function() {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(function() {
                inThrottle = false;
            }, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/* -------------------- Form Validation (if needed in future) -------------------- */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(phone);
}

/* -------------------- Console Branding -------------------- */
console.log(
    '%c QuickFix Plumbing Co. ',
    'background: linear-gradient(135deg, #007BFF, #00C851); color: white; font-size: 20px; padding: 10px 20px; border-radius: 5px; font-weight: bold;'
);
console.log(
    '%c Professional plumbing services - Available 24/7 ',
    'color: #666; font-size: 12px; padding: 5px;'
);
