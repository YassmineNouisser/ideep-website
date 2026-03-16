/* ============================================
   IDeep — Laptop Opening Animation
   ============================================ */
(function () {
    // Generate keyboard
    var kb = document.getElementById('keyboard');
    if (kb) {
        for (var i = 0; i < 56; i++) {
            var k = document.createElement('div');
            k.className = 'key';
            kb.appendChild(k);
        }
    }

    gsap.registerPlugin(ScrollTrigger);

    var isMobile = window.innerWidth < 768;
    if (isMobile) return; // Laptop hidden on mobile

    var typedText = document.getElementById('screenText');
    var fullText = 'We Build Digital Experiences';
    var charIdx = 0;

    function typeProgress(progress) {
        var target = Math.floor(progress * fullText.length);
        if (target !== charIdx) {
            charIdx = target;
            if (typedText) {
                typedText.textContent = fullText.substring(0, charIdx) + (charIdx < fullText.length ? '_' : '');
            }
        }
    }

    // Main timeline
    var tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: '+=250%',
            scrub: 1.5,
            pin: true,
            anticipatePin: 1
        }
    });

    // Lid opens
    tl.to('.laptop-lid', { rotateX: 0, duration: 30, ease: 'power2.out' }, 0);

    // Glow
    tl.to('.screen-glow', { opacity: 1, duration: 20 }, 10);
    tl.to('.laptop-reflection', { opacity: 1, duration: 15 }, 15);

    // Screen on
    tl.to('.screen-content', { backgroundColor: '#0a1628', duration: 8 }, 30);

    // Logo
    tl.to('.screen-logo', { opacity: 1, scale: 1, duration: 10, ease: 'back.out(1.5)' }, 33);

    // Typing
    tl.to({}, { duration: 18, onUpdate: function () { typeProgress(this.progress()); } }, 42);

    // Hero content reveals
    tl.to('.hero-tag', { opacity: 1, duration: 8 }, 58);

    tl.to('.hero-line-inner', {
        y: '0%',
        duration: 12,
        stagger: 3,
        ease: 'power3.out'
    }, 62);

    tl.to('.hero-sub', { opacity: 1, duration: 8 }, 76);
    tl.to('.btn-magnetic', { opacity: 1, duration: 8 }, 80);
    tl.to('.hero-scroll-indicator', { opacity: 1, duration: 6 }, 85);

    // Laptop subtly shifts
    tl.to('.laptop-wrapper', {
        x: 30,
        y: -20,
        duration: 30,
        ease: 'none'
    }, 55);

})();
