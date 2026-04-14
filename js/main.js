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
    var loaderStart = Date.now();
    var LOADER_MIN_MS = 3000;

    function tickLoader() {
        loadVal += Math.random() * 6 + 3;
        if (loadVal > 100) loadVal = 100;
        if (loaderLine) loaderLine.style.width = Math.round(loadVal) + '%';

        if (loadVal < 100) {
            setTimeout(tickLoader, 140);
        } else {
            var elapsed = Date.now() - loaderStart;
            var hold = Math.max(500, LOADER_MIN_MS - elapsed);
            setTimeout(function () {
                gsap.to(loader, {
                    opacity: 0,
                    duration: 0.9,
                    ease: 'power2.inOut',
                    onComplete: function () {
                        loader.classList.add('done');
                        loader.style.display = 'none';
                    }
                });
            }, hold);
        }
    }

    window.addEventListener('load', tickLoader);

    // ========================================
    // SCROLL PROGRESS + TOP BAR + SCROLL INDICATOR
    // ========================================
    window.scrollProgress = 0;
    var progressBar = document.getElementById('scrollProgressBar');
    var scrollIndicator = document.getElementById('scrollIndicator');

    ScrollTrigger.create({
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: function (self) {
            window.scrollProgress = self.progress;
            if (progressBar) progressBar.style.transform = 'scaleX(' + self.progress + ')';
            if (scrollIndicator) {
                if (self.progress > 0.005) scrollIndicator.classList.add('hidden');
                else scrollIndicator.classList.remove('hidden');
            }
        }
    });

    // Show scroll indicator on load (fade in after loader)
    if (scrollIndicator) {
        setTimeout(function () { scrollIndicator.classList.add('visible'); }, 1400);
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
    // FEATURED SECTION — scroll reveal
    // ========================================
    (function () {
        var section = document.querySelector('.featured');
        if (!section) return;

        var heading = section.querySelector('.featured-title');
        var label = section.querySelector('.section-label');
        var sub = section.querySelector('.featured-sub');
        var cards = section.querySelectorAll('.featured-card');

        if (heading) splitTextIntoWords(heading);

        var tl = gsap.timeline({
            scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 30%', scrub: 1.2 }
        });
        if (label) tl.fromTo(label, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 3, ease: 'power2.out' }, 0);
        if (heading) {
            var words = heading.querySelectorAll('.split-word-inner');
            tl.to(words, { y: '0%', duration: 5, stagger: 0.25, ease: 'power3.out' }, 1);
        }
        if (sub) tl.fromTo(sub, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 3, ease: 'power2.out' }, 4);

        cards.forEach(function (card, i) {
            gsap.fromTo(card,
                { opacity: 0, y: 80 },
                {
                    opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
                    scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' },
                    delay: i * 0.08
                }
            );
        });
    })();

    // ========================================
    // PORTFOLIO SECTION — Sticky 16:9 preview + scrollable titles
    // ========================================
    (function () {
        var section = document.querySelector('.portfolio');
        if (!section) return;

        var heading = section.querySelector('.portfolio-header h2');
        var label = section.querySelector('.section-label');
        var projects = section.querySelectorAll('.project');
        var previewInner = document.getElementById('portfolioPreviewInner');
        var previewWrap = document.getElementById('portfolioPreview');

        if (heading) splitTextIntoWords(heading);

        // Inject num (leftmost), year, stack chips, arrow (rightmost) + build preview imgs
        projects.forEach(function (proj, i) {
            // Number as first child of the row
            if (!proj.querySelector('.project-num')) {
                var num = document.createElement('span');
                num.className = 'project-num';
                num.textContent = (i + 1 < 10 ? '0' : '') + (i + 1);
                proj.insertBefore(num, proj.firstChild);
            }

            var info = proj.querySelector('.project-info');

            // Year
            if (info && !info.querySelector('.project-year')) {
                var year = proj.getAttribute('data-year');
                if (year) {
                    var yearEl = document.createElement('span');
                    yearEl.className = 'project-year';
                    yearEl.textContent = '— ' + year;
                    var titleEl = info.querySelector('h3');
                    if (titleEl) titleEl.appendChild(yearEl);
                }
            }

            // Stack chips
            if (info && !info.querySelector('.project-stack')) {
                var stackRaw = proj.getAttribute('data-stack') || '';
                var techs = stackRaw.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
                if (techs.length) {
                    var stackWrap = document.createElement('div');
                    stackWrap.className = 'project-stack';
                    techs.slice(0, 4).forEach(function (t) {
                        var chip = document.createElement('span');
                        chip.textContent = t;
                        stackWrap.appendChild(chip);
                    });
                    info.appendChild(stackWrap);
                }
            }

            // Arrow at end (direct child of .project, not info)
            if (!proj.querySelector('.project-arrow')) {
                var arrow = document.createElement('span');
                arrow.className = 'project-arrow';
                arrow.innerHTML = '<i class="fas fa-arrow-right"></i>';
                proj.appendChild(arrow);
            }

            // Build preview img
            if (previewInner) {
                var img = document.createElement('div');
                img.className = 'portfolio-preview-img';
                img.style.backgroundImage = "url('" + proj.getAttribute('data-image').replace(/ /g, '%20') + "')";
                img.dataset.idx = i;
                previewInner.appendChild(img);
            }
        });

        // Hover swap + active row state
        var activeImg = null;
        var activeIdx = -1;
        function showPreview(idx) {
            if (!previewInner) return;
            activeIdx = idx;
            var imgs = previewInner.querySelectorAll('.portfolio-preview-img');
            imgs.forEach(function (im) {
                if (parseInt(im.dataset.idx, 10) === idx) {
                    if (activeImg && activeImg !== im) {
                        activeImg.classList.remove('active');
                        activeImg.classList.add('exiting');
                    }
                    im.classList.remove('exiting');
                    im.classList.add('active');
                    activeImg = im;
                } else if (im !== activeImg) {
                    im.classList.remove('active');
                }
            });
            projects.forEach(function (p, j) {
                if (j === idx) p.classList.add('is-active');
                else p.classList.remove('is-active');
            });
            if (previewWrap) previewWrap.classList.add('has-active');
        }

        // Auto-cycle when user is NOT hovering the list
        var autoCycleTimer = null;
        var isHovering = false;
        function startAutoCycle() {
            if (autoCycleTimer) clearInterval(autoCycleTimer);
            autoCycleTimer = setInterval(function () {
                if (isHovering) return;
                var next = (activeIdx + 1) % projects.length;
                showPreview(next);
            }, 4200);
        }
        function stopAutoCycle() {
            if (autoCycleTimer) clearInterval(autoCycleTimer);
            autoCycleTimer = null;
        }

        projects.forEach(function (proj, i) {
            proj.addEventListener('mouseenter', function () {
                isHovering = true;
                showPreview(i);
            });
        });
        var list = section.querySelector('.portfolio-list');
        if (list) list.addEventListener('mouseleave', function () { isHovering = false; });

        ScrollTrigger.create({
            trigger: section,
            start: 'top 60%',
            once: true,
            onEnter: function () { showPreview(0); startAutoCycle(); }
        });
        ScrollTrigger.create({
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            onLeave: stopAutoCycle,
            onLeaveBack: stopAutoCycle,
            onEnterBack: function () { if (!autoCycleTimer) startAutoCycle(); }
        });

        // Header reveal
        var tl = gsap.timeline({
            scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 30%', scrub: 1.2 }
        });
        if (label) tl.fromTo(label, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 3, ease: 'power2.out' }, 0);
        if (heading) {
            var words = heading.querySelectorAll('.split-word-inner');
            tl.to(words, { y: '0%', duration: 5, stagger: 0.3, ease: 'power3.out' }, 1);
        }

        projects.forEach(function (proj, i) {
            gsap.fromTo(proj,
                { opacity: 0, y: 50 },
                {
                    opacity: 1, y: 0, duration: 1, ease: 'power3.out',
                    scrollTrigger: { trigger: proj, start: 'top 88%', toggleActions: 'play none none reverse' },
                    delay: i * 0.05
                }
            );
        });
    })();

    // ========================================
    // TEAM SECTION — Cinematic Sticky Scroll
    // ========================================
    (function () {
        var section = document.querySelector('.team');
        if (!section) return;

        var heading = section.querySelector('.team-header h2');
        var label = section.querySelector('.section-label');
        if (heading) splitTextIntoWords(heading);

        var headerTl = gsap.timeline({
            scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 40%', scrub: 1 }
        });
        if (label) headerTl.fromTo(label, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 3, ease: 'power2.out' }, 0);
        if (heading) {
            var words = heading.querySelectorAll('.split-word-inner');
            headerTl.to(words, { y: '0%', duration: 5, stagger: 0.3, ease: 'power3.out' }, 1);
        }

        var cinema = document.getElementById('teamCinema');
        if (!cinema) return;

        // ===== Member data — order = scroll order (right to left in photo) =====
        var members = [
            {
                name: 'Ahmed Ayadi',
                role: 'CEO — Chief Executive Officer',
                fx: 90, fy: 58,
                email: 'ahmed.ayadi@esprit.tn',
                duties_fr: ['Stratégie de l\'entreprise', 'Partenariats & clients', 'Décisions business'],
                duties_en: ['Company strategy', 'Partnerships & clients', 'Business decisions'],
                duties_ar: ['استراتيجية الشركة', 'الشراكات والعملاء', 'القرارات التجارية']
            },
            {
                name: 'Yassmine Nouisser',
                role: 'Marketing & Business Development Manager',
                fx: 76, fy: 57,
                email: 'yassmine.nouisser@esprit.tn',
                duties_fr: ['Stratégie marketing', 'Réseaux sociaux', 'Acquisition client'],
                duties_en: ['Marketing strategy', 'Social media', 'Client acquisition'],
                duties_ar: ['استراتيجية التسويق', 'وسائل التواصل الاجتماعي', 'اكتساب العملاء']
            },
            {
                name: 'Youssef Jouini',
                role: 'CTO — Chief Technology Officer',
                fx: 57, fy: 56,
                email: 'youssef.jouini@esprit.tn',
                duties_fr: ['Architecture technique', 'Supervision technique', 'Sécurité & infrastructure'],
                duties_en: ['Technology architecture', 'Technical supervision', 'Security & infrastructure'],
                duties_ar: ['البنية التقنية', 'الإشراف التقني', 'الأمن والبنية التحتية']
            },
            {
                name: 'Insaf Makhloufi',
                role: 'Front-End Developer / UI Engineer',
                fx: 42, fy: 58,
                email: 'insaf.makhloufi@esprit.tn',
                duties_fr: ['Interfaces utilisateur', 'Design responsive', 'Intégration UI'],
                duties_en: ['User interface', 'Responsive design', 'UI integration'],
                duties_ar: ['واجهات المستخدم', 'التصميم المتجاوب', 'تكامل واجهة المستخدم']
            },
            {
                name: 'Jihed Khlifi',
                role: 'Full-Stack Developer',
                fx: 32, fy: 54,
                email: 'jihed.khlifi@esprit.tn',
                duties_fr: ['Développement front-end & back-end', 'Implémentation des fonctionnalités', 'APIs & bases de données'],
                duties_en: ['Front-end & back-end development', 'Feature implementation', 'APIs & databases'],
                duties_ar: ['تطوير الواجهة الأمامية والخلفية', 'تنفيذ الميزات', 'واجهات API وقواعد البيانات']
            },
            {
                name: 'Malek Tirellil',
                role: 'UI/UX Designer',
                fx: 18, fy: 52,
                email: 'malek.tirellil@esprit.tn',
                duties_fr: ['Design produit', 'Expérience utilisateur', 'Branding'],
                duties_en: ['Product design', 'User experience', 'Branding'],
                duties_ar: ['تصميم المنتج', 'تجربة المستخدم', 'الهوية البصرية']
            }
        ];

        // ===== Build DOM =====
        cinema.innerHTML =
            '<div class="team-cinema-stage" id="teamCinemaStage">' +
                '<div class="team-cinema-blur"></div>' +
                '<img class="team-cinema-frame" id="teamCinemaFrame" src="ideep%20equipe.jpeg" alt="The IDeep team">' +
                '<div class="team-cinema-photo" id="teamCinemaPhoto"></div>' +
                '<div class="team-cinema-vignette"></div>' +
                '<div class="team-cinema-grain"></div>' +
                '<div class="team-cinema-focus" id="teamCinemaFocus"></div>' +
                '<div class="team-cinema-intro" id="teamCinemaIntro">' +
                    '<span class="team-cinema-intro-tag">' +
                        '<span data-lang-fr>L\'équipe</span><span data-lang-en>The team</span><span data-lang-ar>الفريق</span>' +
                    '</span>' +
                    '<h3 class="team-cinema-intro-title">' +
                        '<span data-lang-fr>6 talents.<br>1 vision.</span>' +
                        '<span data-lang-en>6 talents.<br>1 vision.</span>' +
                        '<span data-lang-ar>6 مواهب.<br>رؤية واحدة.</span>' +
                    '</h3>' +
                    '<span class="team-cinema-intro-hint">' +
                        '<i class="fas fa-arrow-down"></i> ' +
                        '<span data-lang-fr>Scroll pour rencontrer l\'équipe</span>' +
                        '<span data-lang-en>Scroll to meet the team</span>' +
                        '<span data-lang-ar>مرر لمقابلة الفريق</span>' +
                    '</span>' +
                '</div>' +
                '<div class="team-cinema-info" id="teamCinemaInfo">' +
                    '<div class="team-cinema-info-inner">' +
                        '<span class="team-cinema-num" id="teamCinemaNum">01 / 06</span>' +
                        '<h3 class="team-cinema-name" id="teamCinemaName"></h3>' +
                        '<span class="team-cinema-role" id="teamCinemaRole"></span>' +
                        '<ul class="team-cinema-duties" id="teamCinemaDuties"></ul>' +
                        '<a class="team-cinema-email" id="teamCinemaEmail" href="#">' +
                            '<i class="fas fa-envelope"></i><span></span>' +
                        '</a>' +
                    '</div>' +
                '</div>' +
                '<div class="team-cinema-progress" id="teamCinemaProgress">' +
                    '<div class="team-cinema-progress-track">' +
                        '<div class="team-cinema-progress-fill" id="teamCinemaProgressFill"></div>' +
                    '</div>' +
                    '<div class="team-cinema-progress-segments" id="teamCinemaSegments"></div>' +
                '</div>' +
            '</div>';
        var stage = document.getElementById('teamCinemaStage');
        var photo = document.getElementById('teamCinemaPhoto');
        var frame = document.getElementById('teamCinemaFrame');
        var focus = document.getElementById('teamCinemaFocus');
        var introEl = document.getElementById('teamCinemaIntro');
        var infoEl = document.getElementById('teamCinemaInfo');
        var numEl = document.getElementById('teamCinemaNum');
        var nameEl = document.getElementById('teamCinemaName');
        var roleEl = document.getElementById('teamCinemaRole');
        var dutiesEl = document.getElementById('teamCinemaDuties');
        var emailEl = document.getElementById('teamCinemaEmail');
        var emailSpan = emailEl ? emailEl.querySelector('span') : null;
        var fillEl = document.getElementById('teamCinemaProgressFill');
        var segWrap = document.getElementById('teamCinemaSegments');

        if (!stage || !photo) return;

        // Photo background-image is set via CSS for reliability

        // Build progress segment labels
        if (segWrap) {
            segWrap.innerHTML = '';
            members.forEach(function (m, i) {
                var s = document.createElement('span');
                s.textContent = (i + 1 < 10 ? '0' : '') + (i + 1);
                segWrap.appendChild(s);
            });
        }

        // Total scroll length: 1 intro slot + N member slots, each ~85vh
        var stepVh = 0.9;
        var totalSlots = members.length + 1; // +1 for intro
        cinema.style.height = (totalSlots * stepVh + 0.3) * 100 + 'vh';

        var zoomLevel = window.innerWidth < 768 ? 4.2 : 5.0;
        var imgRatio = 1040 / 694;
        var currentIdx = -2; // -1 = intro, 0..n-1 = member

        // Smoothed render state — lerps toward targets each frame
        var state = { zoom: 1, fx: 50, fy: 50, infoOp: 0, infoY: 40, introOp: 1, introY: 0 };
        var target = { zoom: 1, fx: 50, fy: 50, infoOp: 0, infoY: 40, introOp: 1, introY: 0 };
        var smoothing = 0.11; // 0..1 — lower = smoother & more inertia

        function easeInOutCubic(t) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2; }
        function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
        function ease(t) { return easeInOutCubic(t); }
        function lerp(a, b, t) { return a + (b - a) * t; }

        function applyPhoto(zoom, fx, fy) {
            var cw = stage.offsetWidth;
            var ch = stage.offsetHeight;
            if (!cw || !ch) return;
            var cRatio = cw / ch;
            var coverW, coverH;
            // Mobile portrait: use CONTAIN so the whole team photo fits the viewport
            // (no horizontal cropping). Desktop / landscape: use COVER (full-bleed).
            var useContain = window.innerWidth < 768;
            if (useContain) {
                if (cRatio > imgRatio) { coverH = ch; coverW = ch * imgRatio; }
                else { coverW = cw; coverH = cw / imgRatio; }
            } else {
                if (cRatio > imgRatio) { coverW = cw; coverH = cw / imgRatio; }
                else { coverH = ch; coverW = ch * imgRatio; }
            }
            var zW = coverW * zoom;
            var zH = coverH * zoom;
            var bgX = cw / 2 - (fx / 100) * zW;
            var bgY = ch / 2 - (fy / 100) * zH;
            // If image smaller than viewport in a dimension (contain at low zoom), center it
            if (zW <= cw) bgX = (cw - zW) / 2;
            else {
                if (bgX > 0) bgX = 0;
                if (bgX < cw - zW) bgX = cw - zW;
            }
            if (zH <= ch) bgY = (ch - zH) / 2;
            else {
                if (bgY > 0) bgY = 0;
                if (bgY < ch - zH) bgY = ch - zH;
            }
            photo.style.backgroundSize = zW + 'px ' + zH + 'px';
            photo.style.backgroundPosition = bgX + 'px ' + bgY + 'px';

            if (focus) {
                focus.style.left = (cw / 2) + 'px';
                focus.style.top = (ch / 2) + 'px';
            }
        }

        function setMember(idx) {
            if (idx === currentIdx || idx < 0 || idx >= members.length) return;
            currentIdx = idx;
            var m = members[idx];
            if (numEl) numEl.textContent = (idx + 1 < 10 ? '0' : '') + (idx + 1) + ' / ' + (members.length < 10 ? '0' : '') + members.length;
            if (nameEl) nameEl.textContent = m.name;
            if (roleEl) roleEl.textContent = m.role;

            if (dutiesEl) {
                dutiesEl.innerHTML = '';
                ['fr', 'en', 'ar'].forEach(function (lng) {
                    var arr = m['duties_' + lng] || [];
                    arr.forEach(function (d) {
                        var li = document.createElement('li');
                        var span = document.createElement('span');
                        span.setAttribute('data-lang-' + lng, '');
                        span.textContent = d;
                        li.appendChild(span);
                        dutiesEl.appendChild(li);
                    });
                });
            }

            if (emailEl) emailEl.href = 'mailto:' + m.email;
            if (emailSpan) emailSpan.textContent = m.email;

            if (segWrap) {
                var spans = segWrap.querySelectorAll('span');
                spans.forEach(function (s, i) {
                    if (i === idx) s.classList.add('active');
                    else s.classList.remove('active');
                });
            }

            // Re-trigger entrance animation by toggling a class
            if (infoEl) {
                infoEl.classList.remove('animate-in');
                void infoEl.offsetWidth;
                infoEl.classList.add('animate-in');
            }
        }

        // Compute target state from scroll progress
        function computeTarget() {
            var rect = cinema.getBoundingClientRect();
            var total = cinema.offsetHeight - window.innerHeight;
            if (total <= 0) return;
            var prog = -rect.top / total;
            if (prog < 0) prog = 0;
            if (prog > 1) prog = 1;

            if (fillEl) fillEl.style.width = (prog * 100) + '%';

            var n = members.length;
            var slot = 1 / (n + 1);

            if (prog < slot) {
                var introT = prog / slot;
                target.zoom = 1; target.fx = 50; target.fy = 50;
                target.infoOp = 0; target.infoY = 40;
                var fadeOut = Math.max(0, (introT - 0.55) / 0.45);
                target.introOp = 1 - fadeOut;
                target.introY = lerp(0, -30, fadeOut);
                if (focus) focus.classList.remove('visible');
                if (segWrap) segWrap.querySelectorAll('span').forEach(function (s) { s.classList.remove('active'); });
                currentIdx = -1;
                return;
            }

            target.introOp = 0;
            target.introY = -30;

            var memberProg = (prog - slot) / (1 - slot);
            var idx = Math.floor(memberProg * n);
            if (idx >= n) idx = n - 1;
            if (idx < 0) idx = 0;
            var local = memberProg * n - idx;

            var m = members[idx];

            if (local < 0.28) {
                var t = ease(local / 0.28);
                target.fx = lerp(50, m.fx, t);
                target.fy = lerp(50, m.fy, t);
                target.zoom = lerp(1, zoomLevel, t);
                target.infoOp = t;
                target.infoY = lerp(40, 0, t);
            } else if (local < 0.75) {
                target.fx = m.fx; target.fy = m.fy; target.zoom = zoomLevel;
                target.infoOp = 1; target.infoY = 0;
            } else {
                var t2 = ease((local - 0.75) / 0.25);
                target.fx = lerp(m.fx, 50, t2);
                target.fy = lerp(m.fy, 50, t2);
                target.zoom = lerp(zoomLevel, 1, t2);
                target.infoOp = 1 - t2;
                target.infoY = lerp(0, -20, t2);
            }

            setMember(idx);

            if (focus) {
                if (state.zoom > 1.3) focus.classList.add('visible');
                else focus.classList.remove('visible');
            }
        }

        // Continuous render loop — lerps state toward target each frame for inertia
        function render() {
            computeTarget();
            state.zoom += (target.zoom - state.zoom) * smoothing;
            state.fx += (target.fx - state.fx) * smoothing;
            state.fy += (target.fy - state.fy) * smoothing;
            state.infoOp += (target.infoOp - state.infoOp) * (smoothing * 1.6);
            state.infoY += (target.infoY - state.infoY) * (smoothing * 1.6);
            state.introOp += (target.introOp - state.introOp) * (smoothing * 1.6);
            state.introY += (target.introY - state.introY) * (smoothing * 1.6);

            applyPhoto(state.zoom, state.fx, state.fy);

            // Toggle zoomed class on stage so CSS can swap frame/photo on mobile
            if (state.zoom > 1.08) stage.classList.add('zoomed');
            else stage.classList.remove('zoomed');

            if (infoEl) {
                infoEl.style.opacity = state.infoOp;
                infoEl.style.transform = 'translateY(' + state.infoY + 'px)';
            }
            if (introEl) {
                introEl.style.opacity = state.introOp;
                introEl.style.setProperty('--intro-y', state.introY + 'px');
            }

            requestAnimationFrame(render);
        }

        // Init
        applyPhoto(1, 50, 50);
        if (infoEl) {
            infoEl.style.opacity = 0;
            infoEl.style.transform = 'translateY(40px)';
        }
        // Re-apply current language to newly injected DOM
        if (typeof applyLang === 'function') applyLang(savedLang);
        computeTarget();
        // Snap state to target on init so first frame isn't a jarring lerp
        state.zoom = target.zoom; state.fx = target.fx; state.fy = target.fy;
        state.infoOp = target.infoOp; state.infoY = target.infoY;
        state.introOp = target.introOp; state.introY = target.introY;
        requestAnimationFrame(render);

        window.addEventListener('resize', function () { computeTarget(); });
        // Refresh ScrollTrigger so other sections recompute after we changed cinema height
        if (typeof ScrollTrigger !== 'undefined') {
            setTimeout(function () { ScrollTrigger.refresh(); }, 100);
        }
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

        var contactForm = section.querySelector('.contact-form');
        if (contactForm) {
            tl.fromTo(contactForm, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 5, ease: 'power3.out' }, 5);
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

    // Expose lenis globally for modal scroll lock
    window.__lenis = lenis;

    // ========================================
    // CASE STUDY MODAL
    // ========================================
    (function () {
        var modal = document.getElementById('caseModal');
        if (!modal) return;

        var projects = document.querySelectorAll('.project[data-image]');
        var elImg = document.getElementById('caseModalImage');
        var elCat = document.getElementById('caseModalCat');
        var elTitle = document.getElementById('caseModalTitle');
        var elClient = document.getElementById('caseModalClient');
        var elYear = document.getElementById('caseModalYear');
        var elDuration = document.getElementById('caseModalDuration');
        var elRole = document.getElementById('caseModalRole');
        var elStack = document.getElementById('caseModalStack');
        var elProblem = document.getElementById('caseModalProblem');
        var elSolution = document.getElementById('caseModalSolution');
        var elResults = document.getElementById('caseModalResults');
        var elGallery = document.getElementById('caseModalGallery');
        var scrollEl = modal.querySelector('.case-modal-scroll');

        function getLang() {
            if (html.classList.contains('lang-en')) return 'en';
            if (html.classList.contains('lang-ar')) return 'ar';
            return 'fr';
        }

        function pickLang(el, key) {
            var lang = getLang();
            return el.getAttribute('data-' + key + '-' + lang) || el.getAttribute('data-' + key + '-en') || el.getAttribute('data-' + key + '-fr') || '';
        }

        function buildLangSpans(text) {
            // Empty container — text only injected for the current lang via i18n attributes on the project itself.
            return text;
        }

        function makeLangSpan(project, key) {
            var span = document.createElement('span');
            ['fr', 'en', 'ar'].forEach(function (lng) {
                var inner = document.createElement('span');
                inner.setAttribute('data-lang-' + lng, '');
                inner.textContent = project.getAttribute('data-' + key + '-' + lng) || '';
                span.appendChild(inner);
            });
            return span;
        }

        function populate(project) {
            var img = project.getAttribute('data-image');
            elImg.src = img;
            elImg.alt = project.getAttribute('data-title') || '';
            elTitle.textContent = project.getAttribute('data-title') || '';

            // Category — use trilingual spans
            elCat.innerHTML = '';
            elCat.appendChild(makeLangSpan(project, 'cat'));

            // Meta values — trilingual spans
            elClient.innerHTML = '';
            elClient.appendChild(makeLangSpan(project, 'client'));
            elYear.textContent = project.getAttribute('data-year') || '';
            elDuration.innerHTML = '';
            elDuration.appendChild(makeLangSpan(project, 'duration'));
            elRole.innerHTML = '';
            elRole.appendChild(makeLangSpan(project, 'role'));

            // Stack
            elStack.innerHTML = '';
            var stack = (project.getAttribute('data-stack') || '').split(',');
            stack.forEach(function (s) {
                s = s.trim();
                if (!s) return;
                var chip = document.createElement('span');
                chip.textContent = s;
                elStack.appendChild(chip);
            });

            // Problem & Solution — trilingual spans inside <p>
            elProblem.innerHTML = '';
            elProblem.appendChild(makeLangSpan(project, 'problem'));
            elSolution.innerHTML = '';
            elSolution.appendChild(makeLangSpan(project, 'solution'));

            // Results — split each language by newline into <li>
            elResults.innerHTML = '';
            ['fr', 'en', 'ar'].forEach(function (lng) {
                var raw = project.getAttribute('data-results-' + lng) || '';
                var lines = raw.split('\n').map(function (l) { return l.replace(/^[\s•·\-]+/, '').trim(); }).filter(Boolean);
                lines.forEach(function (line) {
                    var li = document.createElement('li');
                    var span = document.createElement('span');
                    span.setAttribute('data-lang-' + lng, '');
                    span.textContent = line;
                    li.appendChild(span);
                    elResults.appendChild(li);
                });
            });

            // Gallery — additional screenshots from data-gallery="img1|img2|img3"
            if (elGallery) {
                elGallery.innerHTML = '';
                var galleryRaw = project.getAttribute('data-gallery') || '';
                var imgs = galleryRaw.split('|').map(function (s) { return s.trim(); }).filter(Boolean);
                if (imgs.length > 0) {
                    var label = document.createElement('span');
                    label.className = 'case-block-label';
                    label.innerHTML = '04 — <span data-lang-fr>Galerie</span><span data-lang-en>Gallery</span><span data-lang-ar>المعرض</span>';
                    elGallery.appendChild(label);

                    var grid = document.createElement('div');
                    grid.className = 'case-gallery-grid';
                    imgs.forEach(function (src) {
                        var fig = document.createElement('figure');
                        fig.className = 'case-gallery-item';
                        var img = document.createElement('img');
                        img.src = src.replace(/ /g, '%20');
                        img.alt = '';
                        img.loading = 'lazy';
                        fig.appendChild(img);
                        grid.appendChild(fig);
                    });
                    elGallery.appendChild(grid);
                    elGallery.style.display = '';
                } else {
                    elGallery.style.display = 'none';
                }
            }
        }

        function open(project) {
            populate(project);
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open');
            if (window.__lenis) window.__lenis.stop();
            if (scrollEl) scrollEl.scrollTop = 0;
        }

        function close() {
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
            if (window.__lenis) window.__lenis.start();
        }

        projects.forEach(function (proj) {
            proj.addEventListener('click', function (e) {
                // Don't trigger on inner links if any
                if (e.target.closest('a')) return;
                open(proj);
            });
        });

        modal.querySelectorAll('[data-close]').forEach(function (el) {
            el.addEventListener('click', function (e) {
                // Allow case-cta-btn anchor to navigate to #contact after closing
                close();
            });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('open')) close();
        });
    })();

    // ========================================
    // CONTACT FORM (Web3Forms)
    // ========================================
    (function () {
        var form = document.getElementById('contactForm');
        if (!form) return;

        var status = document.getElementById('formStatus');
        var submitBtn = form.querySelector('.form-submit');

        var msgs = {
            fr: {
                success: '✓ Message envoyé. Nous revenons vers vous sous 24h.',
                error: '✕ Une erreur est survenue. Réessayez ou écrivez à ideep.startup@gmail.com',
                invalid: '✕ Vérifiez les champs requis.'
            },
            en: {
                success: '✓ Message sent. We get back to you within 24h.',
                error: '✕ Something went wrong. Try again or email ideep.startup@gmail.com',
                invalid: '✕ Check required fields.'
            },
            ar: {
                success: '✓ تم إرسال الرسالة. سنعود إليك خلال 24 ساعة.',
                error: '✕ حدث خطأ ما. حاول مرة أخرى أو راسلنا على ideep.startup@gmail.com',
                invalid: '✕ تحقق من الحقول المطلوبة.'
            }
        };

        function getLang() {
            if (html.classList.contains('lang-en')) return 'en';
            if (html.classList.contains('lang-ar')) return 'ar';
            return 'fr';
        }

        function setStatus(type, msg) {
            status.className = 'form-status ' + (type || '');
            status.textContent = msg || '';
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var lang = getLang();

            if (!form.checkValidity()) {
                setStatus('error', msgs[lang].invalid);
                form.reportValidity();
                return;
            }

            submitBtn.classList.add('loading');
            setStatus('', '');

            var formData = new FormData(form);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(function (res) { return res.json(); })
            .then(function (data) {
                submitBtn.classList.remove('loading');
                if (data && data.success) {
                    setStatus('success', msgs[lang].success);
                    form.reset();
                } else {
                    setStatus('error', msgs[lang].error);
                }
            })
            .catch(function () {
                submitBtn.classList.remove('loading');
                setStatus('error', msgs[lang].error);
            });
        });
    })();

})();
