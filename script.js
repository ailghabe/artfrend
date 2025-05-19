// ==== MOBILE MENU TOGGLE ====
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mainNav = document.getElementById('main-nav');

if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener('click', function() {
        const isExpanded = mainNav.classList.toggle('active');
        mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
        mobileMenuToggle.innerHTML = isExpanded ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        mobileMenuToggle.setAttribute('aria-label', isExpanded ? 'إغلاق القائمة' : 'فتح القائمة');
    });
}

// ==== HEADER SCROLL EFFECT ====
const header = document.getElementById('main-header');
let lastScrollTop = 0;
const scrollThreshold = 80; // How much to scroll before effects activate
const hideHeaderThreshold = 250; // How much to scroll before header hides on scroll down

if (header) {
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > scrollThreshold) {
            header.classList.add('scrolled');
            // Hide header on scroll down, show on scroll up
            if (scrollTop > lastScrollTop && scrollTop > hideHeaderThreshold) {
                header.style.transform = 'translateY(-100%)';
                header.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'; // Ensure smooth hide
            } else {
                header.style.transform = 'translateY(0)';
                 header.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'; // Ensure smooth show
            }
        } else {
            header.classList.remove('scrolled');
            header.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);
}

// ==== BACK TO TOP BUTTON ====
const backToTopButton = document.getElementById('back-to-top-button');
if (backToTopButton) {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 450) { // Show button after more scroll
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
}

// ==== UPDATE FOOTER YEAR ====
const yearSpan = document.getElementById('current-year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// ==== ACTIVE NAVIGATION LINK ON SCROLL ====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('#main-nav .nav-link');
const headerHeight = header ? header.offsetHeight : 85;

if (sections.length > 0 && navLinks.length > 0) {
    const observerOptions = {
        root: null,
        rootMargin: `-${headerHeight + 20}px 0px -${window.innerHeight - headerHeight - 150}px 0px`, // Fine-tuned margin
        threshold: 0.01 // Trigger even if 1% is visible within the adjusted rootMargin
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            const sectionId = entry.target.getAttribute('id');
            const correspondingNavLink = document.querySelector(`#main-nav .nav-link[href="#${sectionId}"]`);

            if (entry.isIntersecting && correspondingNavLink) {
                navLinks.forEach(link => link.classList.remove('active'));
                correspondingNavLink.classList.add('active');
            }
        });
    };
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));
    
    // Special observer for the contact details section if it's part of #about but needs its own nav link activation
    const contactDetailsAnchorTarget = document.getElementById('contact-details'); // The actual element linked by #contact-details
    const contactNavLink = document.querySelector('#main-nav .nav-link[href="#contact-details"]');
    if(contactDetailsAnchorTarget && contactNavLink){
        const contactObserver = new IntersectionObserver((entries)=>{
            entries.forEach(entry => {
                if(entry.isIntersecting){
                    navLinks.forEach(link => link.classList.remove('active'));
                    contactNavLink.classList.add('active');
                }
            })
        }, {root: null, rootMargin: `-${headerHeight + 20}px 0px -${window.innerHeight - headerHeight - 150}px 0px`, threshold: 0.01 });
        contactObserver.observe(contactDetailsAnchorTarget);
    }
}

// Smooth scroll for all internal links & mobile menu close
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const hrefAttribute = this.getAttribute('href');
        if (hrefAttribute.length > 1 && hrefAttribute.startsWith('#')) {
            const targetElement = document.querySelector(hrefAttribute);
            if (targetElement) {
                e.preventDefault();
                let offset = headerHeight;
                if (hrefAttribute === "#hero") {
                    offset = 0; 
                }
                
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                if (mainNav && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    mobileMenuToggle.setAttribute('aria-label', 'فتح القائمة');
                }
            }
        }
    });
});

// ==== SCROLL-TRIGGERED ANIMATIONS ====
const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');

if ("IntersectionObserver" in window && elementsToAnimate.length > 0) {
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.staggerDelay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Trigger a bit sooner for elements lower on page
    });

    elementsToAnimate.forEach((el) => {
        animationObserver.observe(el);
    });

    // For .stagger-children, animate children when parent is visible
    const staggerContainers = document.querySelectorAll('.stagger-children');
    staggerContainers.forEach(container => {
        const children = container.querySelectorAll('.material-showcase-item, .portfolio-card, .client-logo-item, .highlight-item'); // Add other child selectors if needed
        
        const staggerObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    children.forEach((child, index) => {
                        child.style.transitionDelay = `${index * 0.1}s`; // Apply stagger delay
                        child.classList.add('is-visible'); 
                    });
                    obs.unobserve(container); // Observe container only once
                }
            });
        }, {threshold: 0.15, rootMargin: "0px 0px -50px 0px"});
        
        staggerObserver.observe(container);
        // Initially hide children of stagger containers to be revealed by JS
        children.forEach(child => {
            child.classList.add('animate-on-scroll'); // Ensure they have base animation styles
        });
    });

} else { // Fallback for older browsers if no IntersectionObserver
    elementsToAnimate.forEach(el => el.classList.add('is-visible'));
}