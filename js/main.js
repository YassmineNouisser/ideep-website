/* ============================================
   IDeep — Main Animations & Language & Theme
   Apple-style scroll-driven reveals
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
    var loaderLine = document.getElementById('loaderLine');
    var loadVal = 0;

    function tickLoader() {
        loadVal += Math.random() * 15 + 5;
        if (loadVal > 100) loadVal = 100;
        if (loaderLine) loaderLine.style.width = Math.round(loadVal) + '%';

        if (loadVal < 100) {
            setTimeout(tickLoader, 80);
        } else {
            setTimeout(function () {
                gsap.to(loader, {
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power2.inOut',
                    onComplete: function () {
                        loader.classList.add('done');
                        loader.style.display = 'none';
                    }
                });
            }, 200);
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
    // MAGNETIC BUTTONS
    // ========================================
    if (window.innerWidth > 768) {
        document.querySelectorAll('[data-magnetic]').forEach(function (btn) {
            btn.addEventListener('mousemove', function (e) {
                var rect = btn.getBoundingClientRect();
                var mx = e.clientX - rect.left - rect.width / 2;
                var my = e.clientY - rect.top - rect.height / 2;
                gsap.to(btn, { x: mx * 0.15, y: my * 0.15, duration: 0.3, ease: 'power2.out' });
            });
            btn.addEventListener('mouseleave', function () {
                gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
            });
        });
    }

    // ========================================
    // LANGUAGE (FR / EN / AR)
    // ========================================
    var langToggle = document.getElementById('langToggle');
    var html = document.documentElement;
    var savedLang = localStorage.getItem('ideep-lang') || 'fr';
    var savedTheme = localStorage.getItem('ideep-theme') || 'dark';

    // Apply saved language
    applyLang(savedLang);

    function applyLang(lang) {
        html.classList.remove('lang-fr', 'lang-en', 'lang-ar');
        html.classList.add('lang-' + lang);
        localStorage.setItem('ideep-lang', lang);
        ScrollTrigger.refresh();
    }

    if (langToggle) {
        langToggle.addEventListener('click', function () {
            var cur = html.classList.contains('lang-fr') ? 'fr' : html.classList.contains('lang-en') ? 'en' : 'ar';
            var langs = ['fr', 'en', 'ar'];
            var idx = langs.indexOf(cur);
            var next = langs[(idx + 1) % 3];
            applyLang(next);
        });
    }

    // ========================================
    // THEME (DARK / LIGHT)
    // ========================================
    var themeToggle = document.getElementById('themeToggle');

    applyTheme(savedTheme);

    function applyTheme(theme) {
        html.classList.remove('theme-dark', 'theme-light');
        html.classList.add('theme-' + theme);
        localStorage.setItem('ideep-theme', theme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            var cur = html.classList.contains('theme-dark') ? 'dark' : 'light';
            var next = cur === 'dark' ? 'light' : 'dark';
            applyTheme(next);
        });
    }

    // ========================================
    // SPLIT TEXT UTILITY
    // ========================================
    function wrapWords(html) {
        var segments = html.split(/(<br\s*\/?>)/gi);
        var out = '';
        for (var s = 0; s < segments.length; s++) {
            if (segments[s].match(/^<br/i)) { out += segments[s]; continue; }
            var words = segments[s].split(/(\s+)/);
            for (var i = 0; i < words.length; i++) {
                if (words[i].match(/^\s+$/)) { out += words[i]; }
                else if (words[i]) { out += '<span class="split-word"><span class="split-word-inner">' + words[i] + '</span></span>'; }
            }
        }
        return out;
    }

    function splitTextIntoWords(el) {
        if (el.querySelector('.split-word')) return;

        var langSpans = el.querySelectorAll('[data-lang-fr], [data-lang-en], [data-lang-ar]');
        if (langSpans.length > 0) {
            langSpans.forEach(function (span) {
                span.innerHTML = wrapWords(span.innerHTML);
            });
        } else {
            el.innerHTML = wrapWords(el.innerHTML);
        }
    }

    // ========================================
    // ABOUT SECTION
    // ========================================
    (function () {
        var section = document.querySelector('.about');
        if (!section) return;

        var aboutTitle = section.querySelector('.about-title');
        if (aboutTitle) splitTextIntoWords(aboutTitle);

        var aboutDesc = section.querySelector('.about-desc > p');
        if (aboutDesc) splitTextIntoWords(aboutDesc);

        var label = section.querySelector('.section-label');

        var tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'bottom 30%',
                scrub: 1.2
            }
        });

        if (label) {
            tl.fromTo(label, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 3, ease: 'power2.out' }, 0);
        }

        if (aboutTitle) {
            var titleWords = aboutTitle.querySelectorAll('.split-word-inner');
            tl.to(titleWords, { y: '0%', duration: 6, stagger: 0.4, ease: 'power3.out' }, 1);
        }

        if (aboutDesc) {
            var descWords = aboutDesc.querySelectorAll('.split-word-inner');
            tl.to(descWords, { y: '0%', duration: 4, stagger: 0.15, ease: 'power2.out' }, 5);
        }

        var stats = section.querySelectorAll('.stat');
        stats.forEach(function (stat, i) {
            tl.fromTo(stat, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 4, ease: 'power2.out' }, 7 + i * 1.5);
        });

        section.querySelectorAll('[data-count]').forEach(function (el) {
            var target = parseInt(el.dataset.count);
            ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                once: true,
                onEnter: function () {
                    gsap.to({ v: 0 }, {
                        v: target,
                        duration: 2,
                        ease: 'power2.out',
                        onUpdate: function () { el.textContent = Math.round(this.targets()[0].v); }
                    });
                }
            });
        });
    })();

    // ========================================
    // SERVICES SECTION
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
            tl.fromTo(label, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 3, ease: 'power2.out' }, 0);
        }

        if (heading) {
            var words = heading.querySelectorAll('.split-word-inner');
            tl.to(words, { y: '0%', duration: 5, stagger: 0.3, ease: 'power3.out' }, 1);
        }

        rows.forEach(function (row, i) {
            tl.fromTo(row, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 5, ease: 'power2.out' }, 4 + i * 1.5);
        });
    })();

    // ========================================
    // PORTFOLIO SECTION
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
            tl.fromTo(label, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 3, ease: 'power2.out' }, 0);
        }

        if (heading) {
            var words = heading.querySelectorAll('.split-word-inner');
            tl.to(words, { y: '0%', duration: 5, stagger: 0.3, ease: 'power3.out' }, 1);
        }

        projects.forEach(function (proj, i) {
            tl.fromTo(proj, { opacity: 0, y: 60, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 6, ease: 'power2.out' }, 4 + i * 2);

            var img = proj.querySelector('.project-img img');
            if (img) {
                tl.fromTo(img, { scale: 1.08 }, { scale: 1, duration: 8, ease: 'none' }, 4 + i * 2);
            }
        });
    })();

    // ========================================
    // TEAM SECTION — Group Photo + Zoom Circles
    // ========================================
    (function () {
        var section = document.querySelector('.team');
        if (!section) return;

        var heading = section.querySelector('.team-header h2');
        var label = section.querySelector('.section-label');
        var groupPhoto = section.querySelector('.team-group-photo');
        var cards = section.querySelectorAll('.team-member-card');

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
            tl.fromTo(label, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 3, ease: 'power2.out' }, 0);
        }

        if (heading) {
            var words = heading.querySelectorAll('.split-word-inner');
            tl.to(words, { y: '0%', duration: 5, stagger: 0.3, ease: 'power3.out' }, 1);
        }

        // Group photo reveal
        if (groupPhoto) {
            tl.fromTo(groupPhoto, { opacity: 0, y: 40, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 6, ease: 'power2.out' }, 4);
        }

        // Member cards — staggered zoom in from group photo
        cards.forEach(function (card, i) {
            tl.fromTo(card,
                { opacity: 0, y: 30, scale: 0.8 },
                { opacity: 1, y: 0, scale: 1, duration: 4, ease: 'power3.out' },
                7 + i * 0.8);
        });
    })();

    // ========================================
    // CONTACT
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
            tl.fromTo(line, { y: '120%' }, { y: '0%', duration: 6, ease: 'power3.out' }, i * 2);
        });

        var contactSub = section.querySelector('.contact-sub');
        if (contactSub) {
            tl.fromTo(contactSub, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 4, ease: 'power2.out' }, 4);
        }

        var contactEmail = section.querySelector('.contact-email');
        if (contactEmail) {
            tl.fromTo(contactEmail, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 4, ease: 'power3.out' }, 5);
        }

        var socials = section.querySelector('.contact-socials');
        if (socials) {
            tl.fromTo(socials, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 3, ease: 'power2.out' }, 6);
        }
    })();

    // ========================================
    // GLOW LINES
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
