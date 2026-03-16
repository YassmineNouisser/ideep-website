/* ============================================
   IDeep — Main Animations, Cursor, Language
   WebGI-inspired scroll-driven reveals
   ============================================ */
(function () {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // ========================================
    // LENIS SMOOTH SCROLL
    // ========================================
    var lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({ duration: 1.2, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);
    }

    // ========================================
    // LOADER
    // ========================================
    var loader = document.getElementById('loader');
    var loaderCounter = document.getElementById('loaderCounter');
    var loaderLine = document.getElementById('loaderLine');
    var loadVal = 0;

    function tickLoader() {
        loadVal += Math.random() * 12 + 3;
        if (loadVal > 100) loadVal = 100;
        var rounded = Math.round(loadVal);
        if (loaderCounter) loaderCounter.textContent = rounded;
        if (loaderLine) loaderLine.style.width = rounded + '%';

        if (loadVal < 100) {
            setTimeout(tickLoader, 120);
        } else {
            setTimeout(function () {
                gsap.to(loader, {
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.inOut',
                    onComplete: function () {
                        loader.classList.add('done');
                        loader.style.display = 'none';
                    }
                });
            }, 300);
        }
    }

    window.addEventListener('load', tickLoader);

    // ========================================
    // SCROLL PROGRESS
    // ========================================
    window.scrollProgress = 0;
    ScrollTrigger.create({
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: function (self) { window.scrollProgress = self.progress; }
    });

    // ========================================
    // CUSTOM CURSOR
    // ========================================
    var cursorEl = document.getElementById('cursor');
    if (cursorEl && window.innerWidth > 768) {
        var cx = 0, cy = 0, tx = 0, ty = 0;

        document.addEventListener('mousemove', function (e) {
            tx = e.clientX;
            ty = e.clientY;
        });

        function moveCursor() {
            cx += (tx - cx) * 0.15;
            cy += (ty - cy) * 0.15;
            cursorEl.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
            requestAnimationFrame(moveCursor);
        }
        moveCursor();

        var hoverables = document.querySelectorAll('a, button, [data-magnetic], .service-row, .project, .member');
        hoverables.forEach(function (el) {
            el.addEventListener('mouseenter', function () { cursorEl.classList.add('hovering'); });
            el.addEventListener('mouseleave', function () { cursorEl.classList.remove('hovering'); });
        });
    } else if (cursorEl) {
        cursorEl.style.display = 'none';
    }

    // ========================================
    // MAGNETIC BUTTONS
    // ========================================
    if (window.innerWidth > 768) {
        document.querySelectorAll('[data-magnetic]').forEach(function (btn) {
            btn.addEventListener('mousemove', function (e) {
                var rect = btn.getBoundingClientRect();
                var mx = e.clientX - rect.left - rect.width / 2;
                var my = e.clientY - rect.top - rect.height / 2;
                gsap.to(btn, { x: mx * 0.2, y: my * 0.2, duration: 0.3, ease: 'power2.out' });
            });
            btn.addEventListener('mouseleave', function () {
                gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
            });
        });
    }

    // ========================================
    // LANGUAGE
    // ========================================
    var langToggle = document.getElementById('langToggle');
    var html = document.documentElement;
    var savedLang = localStorage.getItem('ideep-lang') || 'fr';
    html.className = 'lang-' + savedLang;

    if (langToggle) {
        langToggle.addEventListener('click', function () {
            var cur = html.classList.contains('lang-fr') ? 'fr' : 'en';
            var next = cur === 'fr' ? 'en' : 'fr';
            html.className = 'lang-' + next;
            localStorage.setItem('ideep-lang', next);
            ScrollTrigger.refresh();
        });
    }

    // ========================================
    // SPLIT TEXT UTILITY
    // Wraps each word in <span class="split-word"><span class="split-word-inner">word</span></span>
    // ========================================
    function splitTextIntoWords(el) {
        // Only split visible text nodes, skip if already split
        if (el.querySelector('.split-word')) return;

        var langSpans = el.querySelectorAll('[data-lang-fr], [data-lang-en]');
        if (langSpans.length > 0) {
            // Handle bilingual elements — split each language span separately
            langSpans.forEach(function (span) {
                var text = span.textContent;
                var html = '';
                var words = text.split(/(\s+)/);
                for (var i = 0; i < words.length; i++) {
                    if (words[i].match(/^\s+$/)) {
                        html += words[i];
                    } else if (words[i]) {
                        html += '<span class="split-word"><span class="split-word-inner">' + words[i] + '</span></span>';
                    }
                }
                span.innerHTML = html;
            });
        } else {
            var text = el.textContent;
            var result = '';
            var words = text.split(/(\s+)/);
            for (var i = 0; i < words.length; i++) {
                if (words[i].match(/^\s+$/)) {
                    result += words[i];
                } else if (words[i]) {
                    result += '<span class="split-word"><span class="split-word-inner">' + words[i] + '</span></span>';
                }
            }
            el.innerHTML = result;
        }
    }

    // ========================================
    // SECTION NUMBERS PARALLAX (scrub-based)
    // ========================================
    document.querySelectorAll('.section-num').forEach(function (num) {
        gsap.to(num, {
            scrollTrigger: {
                trigger: num.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
            y: -120,
            opacity: 0.03,
            ease: 'none'
        });
    });

    // ========================================
    // ABOUT SECTION — Scroll-driven cinematic
    // ========================================
    (function () {
        var section = document.querySelector('.about');
        if (!section) return;

        // Split title into words
        var aboutTitle = section.querySelector('.about-title');
        if (aboutTitle) splitTextIntoWords(aboutTitle);

        // Split description into words
        var aboutDesc = section.querySelector('.about-desc > p');
        if (aboutDesc) splitTextIntoWords(aboutDesc);

        // Section label — clip reveal
        var label = section.querySelector('.section-label');

        // Create the timeline
        var tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'bottom 30%',
                scrub: 1.2
            }
        });

        // 1. Section label slides in from left
        if (label) {
            tl.fromTo(label, { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 3, ease: 'power3.out' }, 0);
        }

        // 2. Title words reveal one by one (staggered upward sweep)
        if (aboutTitle) {
            var titleWords = aboutTitle.querySelectorAll('.split-word-inner');
            tl.to(titleWords, {
                y: '0%',
                duration: 6,
                stagger: 0.4,
                ease: 'power3.out'
            }, 1);
        }

        // 3. Description words reveal
        if (aboutDesc) {
            var descWords = aboutDesc.querySelectorAll('.split-word-inner');
            tl.to(descWords, {
                y: '0%',
                duration: 4,
                stagger: 0.15,
                ease: 'power2.out'
            }, 5);
        }

        // 4. Secondary desc — slide from right
        var descSecondary = section.querySelector('.about-desc-secondary');
        if (descSecondary) {
            tl.fromTo(descSecondary,
                { x: 80, opacity: 0 },
                { x: 0, opacity: 1, duration: 6, ease: 'power3.out' }, 8);
        }

        // 5. Pillars container + staggered scale reveal
        var pillarsWrap = section.querySelector('.about-pillars');
        if (pillarsWrap) {
            tl.fromTo(pillarsWrap,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 3, ease: 'power2.out' }, 9);
        }
        var pillars = section.querySelectorAll('.about-pillar');
        if (pillars.length) {
            tl.fromTo(pillars,
                { scale: 0.7, opacity: 0, y: 20 },
                { scale: 1, opacity: 1, y: 0, duration: 4, stagger: 1.5, ease: 'back.out(1.4)' }, 10);
        }

        // 6. Stats — slide in from right, each with a delay
        var stats = section.querySelectorAll('.stat');
        stats.forEach(function (stat, i) {
            tl.fromTo(stat,
                { x: 100, opacity: 0, scale: 0.9 },
                { x: 0, opacity: 1, scale: 1, duration: 5, ease: 'power3.out' }, 6 + i * 2);
        });

        // 7. Stat counter animation (triggered once when scrolled into view)
        section.querySelectorAll('[data-count]').forEach(function (el) {
            var target = parseInt(el.dataset.count);
            ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                once: true,
                onEnter: function () {
                    gsap.to({ v: 0 }, {
                        v: target,
                        duration: 2.5,
                        ease: 'power2.out',
                        onUpdate: function () { el.textContent = Math.round(this.targets()[0].v); }
                    });
                    el.closest('.stat').classList.add('stat-revealed');
                }
            });
        });
    })();

    // ========================================
    // PROCESS SECTION — Scroll-driven cards
    // ========================================
    (function () {
        var section = document.querySelector('.process');
        if (!section) return;

        var heading = section.querySelector('.process-heading');
        var label = section.querySelector('.section-label');
        var cards = section.querySelectorAll('.process-card');
        var connectors = section.querySelectorAll('.process-connector');

        if (heading) splitTextIntoWords(heading);

        var tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 75%',
                end: 'bottom 20%',
                scrub: 1.2
            }
        });

        // Label — horizontal line reveal
        if (label) {
            tl.fromTo(label, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 3, ease: 'power3.out' }, 0);
        }

        // Heading — words sweep up with scale
        if (heading) {
            var headingWords = heading.querySelectorAll('.split-word-inner');
            tl.to(headingWords, {
                y: '0%',
                duration: 5,
                stagger: 0.3,
                ease: 'power3.out'
            }, 1);
        }

        // Cards — alternate slide from left/right with 3D perspective
        cards.forEach(function (card, i) {
            var fromLeft = i % 2 === 0;
            tl.fromTo(card,
                {
                    x: fromLeft ? -100 : 100,
                    opacity: 0,
                    rotateY: fromLeft ? 8 : -8,
                    scale: 0.92
                },
                {
                    x: 0,
                    opacity: 1,
                    rotateY: 0,
                    scale: 1,
                    duration: 5,
                    ease: 'power3.out'
                }, 4 + i * 2.5);
        });

        // Connectors — grow line
        connectors.forEach(function (conn, i) {
            tl.fromTo(conn, { scaleY: 0 }, { scaleY: 1, duration: 2, ease: 'power2.inOut' }, 6 + i * 2.5);
        });
    })();

    // ========================================
    // SERVICES SECTION — Horizontal wipe reveals
    // ========================================
    (function () {
        var section = document.querySelector('.services');
        if (!section) return;

        var heading = section.querySelector('.services-heading');
        var label = section.querySelector('.section-label');
        var rows = section.querySelectorAll('.service-row');

        if (heading) splitTextIntoWords(heading);

        var tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 75%',
                end: 'bottom 20%',
                scrub: 1.2
            }
        });

        if (label) {
            tl.fromTo(label, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 3, ease: 'power3.out' }, 0);
        }

        if (heading) {
            var words = heading.querySelectorAll('.split-word-inner');
            tl.to(words, {
                y: '0%',
                duration: 5,
                stagger: 0.3,
                ease: 'power3.out'
            }, 1);
        }

        // Service rows — each slides in from alternating sides with clip-path
        rows.forEach(function (row, i) {
            var fromRight = i % 2 !== 0;
            tl.fromTo(row,
                {
                    clipPath: fromRight ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)',
                    opacity: 0
                },
                {
                    clipPath: 'inset(0 0% 0 0%)',
                    opacity: 1,
                    duration: 5,
                    ease: 'power3.inOut'
                }, 4 + i * 2);
        });
    })();

    // ========================================
    // TECHNOLOGIES SECTION — Grid scale-in
    // ========================================
    (function () {
        var section = document.querySelector('.technologies');
        if (!section) return;

        var heading = section.querySelector('.technologies-heading');
        var label = section.querySelector('.section-label');
        var cats = section.querySelectorAll('.tech-category');

        if (heading) splitTextIntoWords(heading);

        var tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 75%',
                end: 'bottom 25%',
                scrub: 1.2
            }
        });

        if (label) {
            tl.fromTo(label, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 3, ease: 'power3.out' }, 0);
        }

        if (heading) {
            var words = heading.querySelectorAll('.split-word-inner');
            tl.to(words, {
                y: '0%',
                duration: 5,
                stagger: 0.3,
                ease: 'power3.out'
            }, 1);
        }

        // Tech categories — pop in with rotation and scale
        cats.forEach(function (cat, i) {
            tl.fromTo(cat,
                {
                    opacity: 0,
                    scale: 0.8,
                    y: 40,
                    rotateX: 10
                },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    rotateX: 0,
                    duration: 5,
                    ease: 'power3.out'
                }, 4 + i * 1.5);
        });
    })();

    // ========================================
    // PORTFOLIO SECTION — Cinematic project reveals
    // ========================================
    (function () {
        var section = document.querySelector('.portfolio');
        if (!section) return;

        var heading = section.querySelector('.portfolio-header h2');
        var label = section.querySelector('.section-label');
        var projects = section.querySelectorAll('.project');

        if (heading) splitTextIntoWords(heading);

        var tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 75%',
                end: 'bottom 15%',
                scrub: 1.2
            }
        });

        if (label) {
            tl.fromTo(label, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 3, ease: 'power3.out' }, 0);
        }

        if (heading) {
            var words = heading.querySelectorAll('.split-word-inner');
            tl.to(words, {
                y: '0%',
                duration: 5,
                stagger: 0.3,
                ease: 'power3.out'
            }, 1);
        }

        // Projects — perspective 3D cards alternating sides
        projects.forEach(function (proj, i) {
            var fromLeft = i % 2 === 0;
            tl.fromTo(proj,
                {
                    opacity: 0,
                    x: fromLeft ? -120 : 120,
                    rotateY: fromLeft ? 12 : -12,
                    scale: 0.88
                },
                {
                    opacity: 1,
                    x: 0,
                    rotateY: 0,
                    scale: 1,
                    duration: 6,
                    ease: 'power3.out'
                }, 4 + i * 2.5);

            // Parallax on the project image (moves slower than card)
            var img = proj.querySelector('.project-img img');
            if (img) {
                tl.fromTo(img,
                    { scale: 1.15 },
                    { scale: 1, duration: 8, ease: 'none' },
                    4 + i * 2.5);
            }
        });
    })();

    // ========================================
    // TEAM SECTION — Member pop-in with stagger
    // ========================================
    (function () {
        var section = document.querySelector('.team');
        if (!section) return;

        var heading = section.querySelector('.team-header h2');
        var label = section.querySelector('.section-label');
        var members = section.querySelectorAll('.member');

        if (heading) splitTextIntoWords(heading);

        var tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 75%',
                end: 'bottom 20%',
                scrub: 1.2
            }
        });

        if (label) {
            tl.fromTo(label, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 3, ease: 'power3.out' }, 0);
        }

        if (heading) {
            var words = heading.querySelectorAll('.split-word-inner');
            tl.to(words, {
                y: '0%',
                duration: 5,
                stagger: 0.3,
                ease: 'power3.out'
            }, 1);
        }

        // Members — burst outward from center with scale + rotation
        members.forEach(function (m, i) {
            var angle = (i / members.length) * Math.PI * 2;
            var burstX = Math.cos(angle) * 50;
            var burstY = Math.sin(angle) * 30;

            tl.fromTo(m,
                {
                    opacity: 0,
                    scale: 0.6,
                    x: burstX,
                    y: burstY + 40,
                    rotation: (i % 2 === 0 ? -5 : 5)
                },
                {
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    y: 0,
                    rotation: 0,
                    duration: 5,
                    ease: 'back.out(1.2)'
                }, 4 + i * 1.2);
        });
    })();

    // ========================================
    // VALUES SECTION — 3D card flip reveals
    // ========================================
    (function () {
        var section = document.querySelector('.values');
        if (!section) return;

        var heading = section.querySelector('.values-heading');
        var label = section.querySelector('.section-label');
        var cards = section.querySelectorAll('.value-card');

        if (heading) splitTextIntoWords(heading);

        var tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 75%',
                end: 'bottom 20%',
                scrub: 1.2
            }
        });

        if (label) {
            tl.fromTo(label, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 3, ease: 'power3.out' }, 0);
        }

        if (heading) {
            var words = heading.querySelectorAll('.split-word-inner');
            tl.to(words, {
                y: '0%',
                duration: 5,
                stagger: 0.3,
                ease: 'power3.out'
            }, 1);
        }

        // Cards — 3D flip from alternating sides
        cards.forEach(function (card, i) {
            var fromLeft = i % 2 === 0;
            tl.fromTo(card,
                {
                    opacity: 0,
                    rotateY: fromLeft ? 25 : -25,
                    x: fromLeft ? -60 : 60,
                    scale: 0.85
                },
                {
                    opacity: 1,
                    rotateY: 0,
                    x: 0,
                    scale: 1,
                    duration: 5,
                    ease: 'power3.out'
                }, 4 + i * 1.8);
        });
    })();

    // ========================================
    // CTA BANNER — Dramatic reveal
    // ========================================
    (function () {
        var banner = document.querySelector('.cta-banner');
        if (!banner) return;

        var tl = gsap.timeline({
            scrollTrigger: {
                trigger: banner,
                start: 'top 80%',
                end: 'center center',
                scrub: 1
            }
        });

        tl.fromTo(banner,
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 5, ease: 'power2.out' }, 0);

        var h2 = banner.querySelector('h2');
        if (h2) {
            splitTextIntoWords(h2);
            var words = h2.querySelectorAll('.split-word-inner');
            tl.to(words, {
                y: '0%',
                duration: 4,
                stagger: 0.2,
                ease: 'power3.out'
            }, 1);
        }

        var p = banner.querySelector('p');
        if (p) {
            tl.fromTo(p,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 4, ease: 'power3.out' }, 3);
        }

        var btn = banner.querySelector('.cta-banner-btn');
        if (btn) {
            tl.fromTo(btn,
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 3, ease: 'back.out(1.5)' }, 5);
        }
    })();

    // ========================================
    // CONTACT — Line reveals + stagger
    // ========================================
    (function () {
        var section = document.querySelector('.contact');
        if (!section) return;

        var contactLines = section.querySelectorAll('.contact-line-inner');
        var tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 70%',
                end: 'center center',
                scrub: 1
            }
        });

        contactLines.forEach(function (line, i) {
            tl.fromTo(line,
                { y: '120%', rotateX: 25 },
                { y: '0%', rotateX: 0, duration: 6, ease: 'power3.out' }, i * 2);
        });

        // Contact info elements
        var contactSub = section.querySelector('.contact-sub');
        if (contactSub) {
            tl.fromTo(contactSub,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 4, ease: 'power2.out' }, 4);
        }

        var contactEmail = section.querySelector('.contact-email');
        if (contactEmail) {
            tl.fromTo(contactEmail,
                { opacity: 0, x: -40 },
                { opacity: 1, x: 0, duration: 4, ease: 'power3.out' }, 6);
        }

        var socials = section.querySelector('.contact-socials');
        if (socials) {
            tl.fromTo(socials,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 3, ease: 'power2.out' }, 7);
        }
    })();

    // ========================================
    // MARQUEE — Scrub-based speed boost
    // ========================================
    (function () {
        var marquee = document.querySelector('.marquee');
        if (!marquee) return;

        gsap.fromTo(marquee,
            { opacity: 0 },
            {
                opacity: 1,
                duration: 1,
                scrollTrigger: {
                    trigger: marquee,
                    start: 'top 95%',
                    end: 'top 70%',
                    scrub: 1
                }
            }
        );
    })();

    // ========================================
    // SECTION DIVIDER GLOW LINES
    // ========================================
    document.querySelectorAll('.glow-line').forEach(function (line) {
        gsap.to(line, {
            scaleX: 1,
            duration: 1.5,
            scrollTrigger: {
                trigger: line,
                start: 'top 90%',
                end: 'top 60%',
                scrub: 1
            }
        });
    });

})();
