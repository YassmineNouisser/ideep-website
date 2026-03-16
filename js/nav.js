/* ============================================
   IDeep — Navigation
   ============================================ */
(function () {
    var nav = document.getElementById('navbar');
    var burger = document.getElementById('navBurger');
    var mobileMenu = document.getElementById('mobileMenu');
    var links = document.querySelectorAll('.nav-links a, .mobile-menu a');
    var sections = document.querySelectorAll('section[id]');
    var lastScroll = 0;

    // Show nav after hero scroll starts
    ScrollTrigger.create({
        trigger: '.hero',
        start: '10% top',
        onLeave: function () { nav.classList.add('visible'); },
        onEnterBack: function () { nav.classList.remove('visible'); }
    });

    // Scrolled state (compact nav)
    ScrollTrigger.create({
        trigger: 'body',
        start: '200px top',
        onUpdate: function () {
            if (window.scrollY > 200) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
    });

    // Active section
    sections.forEach(function (section) {
        ScrollTrigger.create({
            trigger: section,
            start: 'top 50%',
            end: 'bottom 50%',
            onToggle: function (self) {
                if (self.isActive) {
                    var id = section.id;
                    document.querySelectorAll('.nav-links a').forEach(function (a) {
                        a.classList.remove('active');
                        if (a.getAttribute('href') === '#' + id) a.classList.add('active');
                    });
                }
            }
        });
    });

    // Smooth scroll on click
    links.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (!target) return;

            closeMobile();

            gsap.to(window, {
                scrollTo: { y: target, offsetY: 50 },
                duration: 1.4,
                ease: 'power3.inOut'
            });
        });
    });

    // Burger
    function closeMobile() {
        if (burger) burger.classList.remove('active');
        if (mobileMenu) mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (burger && mobileMenu) {
        burger.addEventListener('click', function () {
            var open = burger.classList.contains('active');
            if (open) {
                closeMobile();
            } else {
                burger.classList.add('active');
                mobileMenu.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    // Logo scroll to top
    var logo = document.querySelector('.nav-logo');
    if (logo) {
        logo.addEventListener('click', function (e) {
            e.preventDefault();
            gsap.to(window, { scrollTo: 0, duration: 1.4, ease: 'power3.inOut' });
        });
    }

    // Resize
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768 && mobileMenu && mobileMenu.classList.contains('active')) {
            closeMobile();
        }
    });
})();
