document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggling Logic ---
    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
    const toggleTheme = () => {
        const isCurrentlyLight = document.documentElement.classList.toggle('light');
        localStorage.setItem('color-theme', isCurrentlyLight ? 'light' : 'dark');
    };
    themeToggleBtns.forEach(btn => btn.addEventListener('click', toggleTheme));


    // --- Smooth scroll for navigation links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Check if the link is meant for the current page
            const currentPath = window.location.pathname.split('/').pop();
            const anchorPath = (this.getAttribute('href').split('#')[0] || currentPath);

            if (currentPath !== anchorPath && anchorPath !== '') {
                // It's a link to another page's section, let the browser handle it
                return;
            }

            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu.classList.contains('is-open')) {
                    mobileMenu.classList.remove('is-open');
                }
            }
        });
    });

    // --- Intersection Observer for animations ---
    const sections = document.querySelectorAll('.animated-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));
    // Animate hero section immediately if it exists
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        heroSection.classList.add('visible');
    }
    // Animate projects section immediately if it exists
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
        projectsSection.classList.add('visible');
    }


    // --- Active navigation link highlighting for single-page scrolling ---
    const navLinks = document.querySelectorAll('.main-nav .nav-link');
    const contentSections = document.querySelectorAll('main section[id]');

    if (contentSections.length > 0) { // Only run scroll listener on the main page
        window.addEventListener('scroll', () => {
            let currentSectionId = '';
            contentSections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - 100) {
                    currentSectionId = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                } else if (!currentSectionId && link.getAttribute('href') === '#hero') {
                    link.classList.add('active'); // Default to home
                }
            });
        });
    }


    // --- Mobile menu toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenuCloseButton = document.getElementById('mobile-menu-close-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenuCloseButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => mobileMenu.classList.add('is-open'));
        mobileMenuCloseButton.addEventListener('click', () => mobileMenu.classList.remove('is-open'));
    }

    // --- Back to Top Button ---
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        window.onscroll = () => {
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        };
        backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // --- Set current year in footer ---
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // --- AJAX Contact Form Submission ---
    const contactForm = document.getElementById('contactForm');
    const formResult = document.getElementById('form-result');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);
            const submitButton = form.querySelector('button[type="submit"]');

            formResult.innerHTML = "Sending...";
            formResult.className = 'show';
            submitButton.disabled = true;
            submitButton.classList.add('is-sending');

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                });

                const data = await response.json();

                if (data.success) {
                    formResult.innerHTML = "Form submitted successfully! Thank you.";
                    formResult.classList.add('form-result-success');
                    form.reset();
                } else {
                    formResult.innerHTML = data.message || "An error occurred. Please try again.";
                    formResult.classList.add('form-result-error');
                }

            } catch (error) {
                console.error('Form submission error:', error);
                formResult.innerHTML = "Something went wrong. Please try again later.";
                formResult.classList.add('form-result-error');

            } finally {
                submitButton.disabled = false;
                submitButton.classList.remove('is-sending');
                // Hide the message after 5 seconds
                setTimeout(() => {
                    formResult.className = '';
                    formResult.innerHTML = '';
                }, 5000);
            }
        });
    }
});