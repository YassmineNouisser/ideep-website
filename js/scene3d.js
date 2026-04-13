/* ============================================
   IDeep — Premium 3D Device Showcase
   Laptop (real website) + Phone (Eat & Fit) + Tablet (AZ Airlines)
   Cinematic scroll-driven camera animation
   ============================================ */
(function () {
    var canvas = document.getElementById('scene-canvas');
    if (!canvas || !window.THREE) return;

    var isMobile = window.innerWidth < 768;

    // ========================================
    // RENDERER
    // ========================================
    var renderer = new THREE.WebGLRenderer({
        canvas: canvas, antialias: !isMobile, alpha: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = !isMobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // ========================================
    // SCENE & CAMERA
    // ========================================
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(window.innerWidth < 768 ? 50 : 35, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0.5, 6);
    camera.lookAt(0, 0, 0);

    // ========================================
    // ENVIRONMENT MAP
    // ========================================
    function generateEnvMap() {
        var pmremGen = new THREE.PMREMGenerator(renderer);
        pmremGen.compileEquirectangularShader();
        var envScene = new THREE.Scene();
        var skyGeo = new THREE.SphereGeometry(50, 64, 32);
        var skyMat = new THREE.ShaderMaterial({
            side: THREE.BackSide,
            uniforms: {
                topColor: { value: new THREE.Color(0x0e1a2e) },
                midColor: { value: new THREE.Color(0x0a0f1a) },
                bottomColor: { value: new THREE.Color(0x020305) }
            },
            vertexShader: 'varying vec3 vWP;void main(){vec4 wp=modelMatrix*vec4(position,1.0);vWP=wp.xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
            fragmentShader: 'uniform vec3 topColor;uniform vec3 midColor;uniform vec3 bottomColor;varying vec3 vWP;void main(){float h=normalize(vWP).y;vec3 c=h>0.0?mix(midColor,topColor,h):mix(midColor,bottomColor,-h);gl_FragColor=vec4(c,1.0);}'
        });
        envScene.add(new THREE.Mesh(skyGeo, skyMat));
        var panelGeo = new THREE.PlaneGeometry(12, 8);
        var s1 = new THREE.Mesh(panelGeo, new THREE.MeshBasicMaterial({ color: 0xd4cfc8 }));
        s1.position.set(12, 14, 8); s1.lookAt(0, 0, 0); envScene.add(s1);
        var s2 = new THREE.Mesh(panelGeo, new THREE.MeshBasicMaterial({ color: 0x8899bb }));
        s2.position.set(-14, 8, -6); s2.lookAt(0, 0, 0); envScene.add(s2);
        var s3 = new THREE.Mesh(panelGeo, new THREE.MeshBasicMaterial({ color: 0x5577cc }));
        s3.position.set(0, 4, -18); s3.lookAt(0, 0, 0); envScene.add(s3);
        var strip = new THREE.Mesh(new THREE.PlaneGeometry(16, 0.6), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        strip.position.set(0, 20, 2); strip.rotation.x = Math.PI / 2; envScene.add(strip);
        var envMap = pmremGen.fromScene(envScene, 0.04).texture;
        pmremGen.dispose();
        return envMap;
    }
    var envMap = generateEnvMap();

    // ========================================
    // MATERIALS
    // ========================================
    var bodyMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x303034, metalness: 0.95, roughness: 0.1,
        clearcoat: 0.85, clearcoatRoughness: 0.06, envMap: envMap, envMapIntensity: 2.0
    });
    var bottomMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x222226, metalness: 0.88, roughness: 0.22,
        clearcoat: 0.45, clearcoatRoughness: 0.2, envMap: envMap, envMapIntensity: 1.1
    });
    var bezelMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x080810, metalness: 0.2, roughness: 0.5, envMap: envMap, envMapIntensity: 0.3
    });
    var keyMaterial = new THREE.MeshStandardMaterial({ color: 0x111115, metalness: 0.6, roughness: 0.7 });
    var trackpadMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x252529, metalness: 0.35, roughness: 0.06,
        clearcoat: 1.0, clearcoatRoughness: 0.02, envMap: envMap, envMapIntensity: 1.5
    });
    var hingeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x1a1a20, metalness: 0.95, roughness: 0.25, envMap: envMap, envMapIntensity: 0.8
    });
    var rubberMaterial = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 0, roughness: 0.95 });
    var screenGlassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x000000, metalness: 0, roughness: 0.03, transparent: true, opacity: 0.025,
        clearcoat: 1.0, clearcoatRoughness: 0.02, envMap: envMap, envMapIntensity: 0.5, depthWrite: false
    });
    var phoneMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x1c1c1e, metalness: 0.95, roughness: 0.08,
        clearcoat: 0.9, clearcoatRoughness: 0.05, envMap: envMap, envMapIntensity: 2.2
    });
    var tabletMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x28282c, metalness: 0.93, roughness: 0.08,
        clearcoat: 0.85, clearcoatRoughness: 0.05, envMap: envMap, envMapIntensity: 2.0
    });
    var shapeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x2D9CDB, metalness: 0.3, roughness: 0.4, transparent: true, opacity: 0.15, wireframe: true
    });
    var shapeGlowMat = new THREE.MeshPhysicalMaterial({
        color: 0x3AAFFF, metalness: 0.1, roughness: 0.3, transparent: true, opacity: 0.08,
        envMap: envMap, envMapIntensity: 0.5
    });

    // ========================================
    // roundRect polyfill
    // ========================================
    if (!CanvasRenderingContext2D.prototype.roundRect) {
        CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, radii) {
            var r = typeof radii === 'number' ? radii : (radii && radii[0]) || 0;
            if (r > w / 2) r = w / 2;
            if (r > h / 2) r = h / 2;
            this.moveTo(x + r, y);
            this.lineTo(x + w - r, y);
            this.quadraticCurveTo(x + w, y, x + w, y + r);
            this.lineTo(x + w, y + h - r);
            this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            this.lineTo(x + r, y + h);
            this.quadraticCurveTo(x, y + h, x, y + h - r);
            this.lineTo(x, y + r);
            this.quadraticCurveTo(x, y, x + r, y);
            return this;
        };
    }

    // ========================================
    // LAPTOP SCREEN CANVAS — Real Website
    // ========================================
    var screenCanvas = document.createElement('canvas');
    screenCanvas.width = 1024; screenCanvas.height = 640;
    var screenCtx = screenCanvas.getContext('2d');
    var screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.colorSpace = THREE.SRGBColorSpace;
    var screenMaterial = new THREE.MeshBasicMaterial({ map: screenTexture, toneMapped: false });
    var screenOffMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

    // Scrollable content render functions
    var laptopContentReady = false;
    var lastLaptopScroll = -1;

    function renderLaptopScreen(scrollOffset) {
        if (!window.ideepContent || !laptopContentReady) return;
        var lc = window.ideepContent.laptop;
        var ctx = screenCtx, w = 1024, h = 640, ch = 34;
        var vis = h - ch, maxS = lc.height - vis;
        var off = Math.round(Math.max(0, Math.min(1, scrollOffset)) * maxS);
        ctx.drawImage(lc.canvas, 0, off, w, vis, 0, ch, w, vis);
        // Chrome
        ctx.fillStyle = '#202124'; ctx.fillRect(0, 0, w, ch);
        var dots = ['#ff5f57', '#febc2e', '#28c840'];
        for (var i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(18 + i * 20, ch / 2, 5, 0, 6.28); ctx.fillStyle = dots[i]; ctx.fill(); }
        ctx.fillStyle = '#292b2e'; ctx.beginPath(); ctx.roundRect(80, 4, 180, ch - 6, [8, 8, 0, 0]); ctx.fill();
        ctx.fillStyle = '#ccc'; ctx.font = '10px sans-serif'; ctx.fillText('ideep.tn', 120, 20);
        ctx.fillStyle = '#303134'; ctx.beginPath(); ctx.roundRect(280, 7, w - 320, 20, 10); ctx.fill();
        ctx.fillStyle = '#9aa0a6'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('ideep.tn', w / 2 + 20, 21); ctx.textAlign = 'left';
        screenTexture.needsUpdate = true;
    }

    function renderPhoneScreen(scrollOffset, timeParam) {
        if (!window.ideepContent) return;
        var pc = window.ideepContent.phone;
        var ctx = phoneCtx, w = 512, h = 1024, stH = 34, tabH = 80;
        var vis = h - stH - tabH, maxS = pc.height - vis;
        var off = Math.round(Math.max(0, Math.min(1, scrollOffset)) * maxS);
        ctx.drawImage(pc.canvas, 0, off, w, vis, 0, stH, w, vis);
        // Status bar
        ctx.fillStyle = '#0a1628'; ctx.fillRect(0, 0, w, stH);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('10:42', w / 2, 26); ctx.textAlign = 'left';
        ctx.fillStyle = '#fff'; ctx.font = '11px sans-serif'; ctx.fillText('\u25CF\u25CF\u25CF\u25CF', w - 75, 26);
        ctx.fillStyle = '#000'; ctx.beginPath(); ctx.roundRect(w / 2 - 52, 6, 104, 26, 13); ctx.fill();
        // Tab bar
        ctx.fillStyle = 'rgba(8,16,30,0.97)'; ctx.fillRect(0, h - tabH, w, tabH);
        ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(0, h - tabH); ctx.lineTo(w, h - tabH); ctx.stroke();
        var icons = ['\u2302', '\u25CB', '\u002B', '\u2606'];
        var labels = ['Accueil', 'Stats', 'Ajouter', 'Profil'];
        // Pulse the active tab
        var pulse = 0.7 + Math.sin((timeParam || 0) * 3) * 0.3;
        for (var i = 0; i < 4; i++) {
            var x = i * (w / 4) + w / 8;
            if (i === 0) {
                ctx.fillStyle = 'rgba(52,199,89,' + (0.15 * pulse) + ')';
                ctx.beginPath(); ctx.arc(x, h - 48, 20, 0, Math.PI * 2); ctx.fill();
            }
            ctx.fillStyle = i === 0 ? '#34C759' : '#5a6580';
            ctx.font = '20px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(icons[i], x, h - 48);
            ctx.font = (i === 0 ? 'bold ' : '') + '10px sans-serif';
            ctx.fillText(labels[i], x, h - 30);
        }
        ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.beginPath(); ctx.roundRect(w / 2 - 50, h - 8, 100, 4, 2); ctx.fill();

        // Luxury diagonal shine sweep
        if (timeParam !== undefined) {
            var sweepPeriod = 4.5;
            var sweepT = ((timeParam % sweepPeriod) / sweepPeriod);
            var sweepX = -w * 0.4 + sweepT * (w + w * 0.8);
            var shineGrad = ctx.createLinearGradient(sweepX - 60, 0, sweepX + 60, h);
            shineGrad.addColorStop(0, 'rgba(255,255,255,0)');
            shineGrad.addColorStop(0.5, 'rgba(255,255,255,0.09)');
            shineGrad.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = shineGrad;
            ctx.fillRect(0, stH, w, h - stH - tabH);
        }

        phoneTexture.needsUpdate = true;
    }

    function renderTabletScreen(scrollOffset, timeParam) {
        if (!window.ideepContent) return;
        var tc = window.ideepContent.tablet;
        var ctx = tabletCtx, w = 1024, h = 768, sbW = 72, hdrH = 56;
        var mainW = w - sbW, mainH = h - hdrH;
        var maxS = tc.height - mainH;
        var off = Math.round(Math.max(0, Math.min(1, scrollOffset)) * maxS);
        // Blit main content area
        ctx.drawImage(tc.canvas, 0, off, tc.canvas.width, mainH, sbW, hdrH, mainW, mainH);
        // Sidebar (fixed)
        ctx.fillStyle = '#0c1425'; ctx.fillRect(0, 0, sbW, h);
        ctx.fillStyle = 'rgba(255,255,255,0.03)'; ctx.fillRect(0, 0, sbW, h);
        ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(sbW, 0); ctx.lineTo(sbW, h); ctx.stroke();
        ctx.fillStyle = '#2D9CDB'; ctx.font = 'bold 18px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('AZ', sbW / 2, 38); ctx.textAlign = 'left';
        var navIc = [['\u25A1', true], ['\u2708', false], ['\u263A', false], ['\u2606', false], ['\u2699', false]];
        for (var ni = 0; ni < navIc.length; ni++) {
            var ny = 80 + ni * 54;
            if (navIc[ni][1]) {
                ctx.fillStyle = 'rgba(45,156,219,0.15)'; ctx.beginPath(); ctx.roundRect(8, ny - 14, sbW - 16, 36, 8); ctx.fill();
                ctx.fillStyle = '#2D9CDB';
            } else { ctx.fillStyle = '#5a6580'; }
            ctx.font = '18px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(navIc[ni][0], sbW / 2, ny + 6); ctx.textAlign = 'left';
        }
        // Header (fixed)
        ctx.fillStyle = '#0c1425'; ctx.fillRect(sbW, 0, w - sbW, hdrH);
        ctx.fillStyle = 'rgba(255,255,255,0.02)'; ctx.fillRect(sbW, 0, w - sbW, hdrH);
        ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.beginPath(); ctx.moveTo(sbW, hdrH); ctx.lineTo(w, hdrH); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 16px sans-serif'; ctx.fillText('AZ Airlines', sbW + 24, 35);
        ctx.fillStyle = '#64748b'; ctx.font = '12px sans-serif'; ctx.fillText('Dashboard', sbW + 140, 35);
        ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.beginPath(); ctx.roundRect(w - 300, 14, 180, 28, 14); ctx.fill();
        ctx.fillStyle = '#5a6580'; ctx.font = '11px sans-serif'; ctx.fillText('\uD83D\uDD0D  Rechercher...', w - 288, 33);
        ctx.fillStyle = 'rgba(45,156,219,0.2)'; ctx.beginPath(); ctx.arc(w - 50, 28, 16, 0, 6.28); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('A', w - 50, 33); ctx.textAlign = 'left';

        // Live notification dot (pulse)
        if (timeParam !== undefined) {
            var notifPulse = 0.5 + Math.sin(timeParam * 4) * 0.5;
            ctx.fillStyle = 'rgba(255,59,48,' + notifPulse + ')';
            ctx.beginPath(); ctx.arc(w - 40, 18, 4, 0, Math.PI * 2); ctx.fill();

            // Luxury diagonal shine sweep across main area
            var sweepPeriod = 5.5;
            var sweepT = ((timeParam % sweepPeriod) / sweepPeriod);
            var sweepX = sbW - mainW * 0.3 + sweepT * (mainW + mainW * 0.6);
            var shineGrad = ctx.createLinearGradient(sweepX - 80, 0, sweepX + 80, h);
            shineGrad.addColorStop(0, 'rgba(255,255,255,0)');
            shineGrad.addColorStop(0.5, 'rgba(255,255,255,0.07)');
            shineGrad.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = shineGrad;
            ctx.fillRect(sbW, hdrH, mainW, mainH);
        }

        tabletTexture.needsUpdate = true;
    }

    function drawLaptopScreen(powered) {
        var ctx = screenCtx;
        var w = 1024, h = 640;
        if (!powered) { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h); screenTexture.needsUpdate = true; return; }

        // Browser chrome
        var chromeH = 34;
        ctx.fillStyle = '#202124'; ctx.fillRect(0, 0, w, chromeH);
        var dots = ['#ff5f57', '#febc2e', '#28c840'];
        for (var i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(18 + i * 20, chromeH / 2, 5, 0, Math.PI * 2); ctx.fillStyle = dots[i]; ctx.fill(); }
        // Tab
        ctx.fillStyle = '#292b2e'; ctx.beginPath(); ctx.roundRect(80, 4, 180, chromeH - 6, [8, 8, 0, 0]); ctx.fill();
        ctx.fillStyle = '#ccc'; ctx.font = '10px sans-serif'; ctx.fillText('ideep.tn', 120, 20);
        // Address bar
        ctx.fillStyle = '#303134'; ctx.beginPath(); ctx.roundRect(280, 7, w - 320, 20, 10); ctx.fill();
        ctx.fillStyle = '#9aa0a6'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('ideep.tn', w / 2 + 20, 21); ctx.textAlign = 'left';

        // === WEBSITE CONTENT ===
        var y = chromeH;
        var grad = ctx.createLinearGradient(0, y, 0, h);
        grad.addColorStop(0, '#080d19'); grad.addColorStop(1, '#040812');
        ctx.fillStyle = grad; ctx.fillRect(0, y, w, h - y);

        // Navigation bar
        var navY = y + 4;
        ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.fillRect(0, navY, w, 32);
        ctx.fillStyle = '#2D9CDB'; ctx.font = 'bold 14px sans-serif'; ctx.fillText('IDeep', 32, navY + 21);
        ctx.fillStyle = '#8892b0'; ctx.font = '11px sans-serif';
        var navItems = ['Accueil', 'Services', 'Portfolio', 'Equipe', 'Contact'];
        var nx = w - 340;
        for (var ni = 0; ni < navItems.length; ni++) { ctx.fillText(navItems[ni], nx, navY + 21); nx += 62; }
        // CTA nav button
        ctx.fillStyle = '#2D9CDB'; ctx.beginPath(); ctx.roundRect(w - 110, navY + 6, 80, 22, 11); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 10px sans-serif'; ctx.fillText('Contact', w - 92, navY + 21);

        // Hero section
        var heroY = navY + 58;
        // Subtle gradient accent
        ctx.fillStyle = 'rgba(45,156,219,0.06)';
        ctx.beginPath(); ctx.arc(w * 0.7, heroY + 30, 150, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#2D9CDB'; ctx.font = '10px sans-serif'; ctx.fillText('STUDIO DE DEVELOPPEMENT', 50, heroY);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 34px sans-serif';
        ctx.fillText('Construisons le', 50, heroY + 42);
        ctx.fillText('futur ensemble.', 50, heroY + 82);
        ctx.fillStyle = '#64748b'; ctx.font = '13px sans-serif';
        ctx.fillText('Solutions digitales innovantes pour transformer', 50, heroY + 112);
        ctx.fillText('vos idees en experiences exceptionnelles.', 50, heroY + 130);
        // CTA button
        ctx.fillStyle = '#2D9CDB'; ctx.beginPath(); ctx.roundRect(50, heroY + 148, 140, 34, 17); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 12px sans-serif'; ctx.fillText('Decouvrir  \u2192', 74, heroY + 170);

        // Right side: floating device mockup hint
        ctx.strokeStyle = 'rgba(45,156,219,0.2)'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.roundRect(w - 320, heroY - 10, 160, 110, 8); ctx.stroke();
        ctx.fillStyle = 'rgba(45,156,219,0.08)'; ctx.fillRect(w - 310, heroY + 10, 140, 12);
        ctx.fillRect(w - 310, heroY + 28, 100, 8);
        ctx.fillRect(w - 310, heroY + 42, 120, 8);
        ctx.fillStyle = 'rgba(45,156,219,0.15)'; ctx.fillRect(w - 310, heroY + 60, 140, 30);
        // Phone mock
        ctx.strokeStyle = 'rgba(45,156,219,0.15)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.roundRect(w - 140, heroY + 20, 55, 90, 6); ctx.stroke();
        ctx.fillStyle = 'rgba(45,156,219,0.06)';
        ctx.beginPath(); ctx.roundRect(w - 140, heroY + 20, 55, 90, 6); ctx.fill();

        // Feature cards
        var cardsY = heroY + 200;
        var cardW = 190, cardH = 95, cardGap = 22;
        var features = [
            { icon: '</>', title: 'Web Dev', desc: 'React, Next.js, Node.js', color: '#2D9CDB' },
            { icon: 'UI', title: 'Design', desc: 'Figma, UI/UX, Prototyping', color: '#42A5F5' },
            { icon: 'AI', title: 'Intelligence', desc: 'Python, ML, Analytics', color: '#5CB8E6' },
            { icon: 'App', title: 'Mobile', desc: 'Flutter, React Native', color: '#64B5F6' }
        ];
        for (var fi = 0; fi < 4; fi++) {
            var cx = 50 + fi * (cardW + cardGap);
            if (cx + cardW > w - 20) break;
            ctx.fillStyle = 'rgba(255,255,255,0.03)'; ctx.beginPath(); ctx.roundRect(cx, cardsY, cardW, cardH, 10); ctx.fill();
            ctx.strokeStyle = features[fi].color + '22'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.roundRect(cx, cardsY, cardW, cardH, 10); ctx.stroke();
            // Icon circle
            ctx.fillStyle = features[fi].color + '20'; ctx.beginPath(); ctx.arc(cx + 26, cardsY + 30, 16, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = features[fi].color; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center';
            ctx.fillText(features[fi].icon, cx + 26, cardsY + 34); ctx.textAlign = 'left';
            ctx.fillStyle = '#fff'; ctx.font = 'bold 13px sans-serif'; ctx.fillText(features[fi].title, cx + 52, cardsY + 30);
            ctx.fillStyle = '#64748b'; ctx.font = '10px sans-serif'; ctx.fillText(features[fi].desc, cx + 52, cardsY + 48);
            // Bottom accent
            ctx.fillStyle = features[fi].color + '40'; ctx.fillRect(cx + 14, cardsY + cardH - 4, cardW - 28, 1.5);
        }

        // Stats bar
        var statsY = h - 42;
        ctx.fillStyle = 'rgba(255,255,255,0.02)'; ctx.fillRect(0, statsY, w, 42);
        ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(0, statsY, w, 1);
        var statItems = [
            { num: '4+', label: 'Projets' }, { num: '6', label: 'Membres' },
            { num: '100%', label: 'Satisfaction' }, { num: '2025', label: 'Fonde' }
        ];
        for (var si = 0; si < statItems.length; si++) {
            var sx = w * (si + 0.5) / statItems.length;
            ctx.fillStyle = '#2D9CDB'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(statItems[si].num, sx, statsY + 17);
            ctx.fillStyle = '#4a5568'; ctx.font = '9px sans-serif';
            ctx.fillText(statItems[si].label, sx, statsY + 32);
        }
        ctx.textAlign = 'left';
        screenTexture.needsUpdate = true;
    }

    // ========================================
    // PHONE SCREEN — Eat & Fit App
    // ========================================
    var phoneScreenCanvas = document.createElement('canvas');
    phoneScreenCanvas.width = 512; phoneScreenCanvas.height = 1024;
    var phoneCtx = phoneScreenCanvas.getContext('2d');
    var phoneTexture = new THREE.CanvasTexture(phoneScreenCanvas);
    phoneTexture.colorSpace = THREE.SRGBColorSpace;
    var phoneScreenMat = new THREE.MeshBasicMaterial({ map: phoneTexture, toneMapped: false });

    function drawPhoneScreen() {
        var ctx = phoneCtx, w = 512, h = 1024;
        var grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#0a1628'); grad.addColorStop(0.5, '#071020'); grad.addColorStop(1, '#040810');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);

        // Status bar
        ctx.fillStyle = '#fff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('10:42', w / 2, 26); ctx.textAlign = 'left';
        ctx.fillStyle = '#fff'; ctx.font = '11px sans-serif'; ctx.fillText('\u25CF\u25CF\u25CF\u25CF', w - 75, 26);
        // Dynamic island
        ctx.fillStyle = '#000'; ctx.beginPath(); ctx.roundRect(w / 2 - 52, 6, 104, 26, 13); ctx.fill();

        // App header
        ctx.fillStyle = '#34C759'; ctx.font = 'bold 24px sans-serif'; ctx.fillText('Eat', 24, 72);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 24px sans-serif'; ctx.fillText('&Fit', 68, 72);
        ctx.fillStyle = '#64748b'; ctx.font = '12px sans-serif'; ctx.fillText('Suivi nutritionnel', 24, 92);
        // Avatar
        ctx.fillStyle = 'rgba(52,199,89,0.2)'; ctx.beginPath(); ctx.arc(w - 40, 72, 20, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(52,199,89,0.5)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(w - 40, 72, 20, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Y', w - 40, 78); ctx.textAlign = 'left';

        // Welcome card
        var wcGrad = ctx.createLinearGradient(16, 115, w - 16, 200);
        wcGrad.addColorStop(0, '#1a3520'); wcGrad.addColorStop(1, '#0d2215');
        ctx.fillStyle = wcGrad; ctx.beginPath(); ctx.roundRect(16, 115, w - 32, 80, 16); ctx.fill();
        ctx.strokeStyle = 'rgba(52,199,89,0.25)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.roundRect(16, 115, w - 32, 80, 16); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 16px sans-serif'; ctx.fillText('Bonjour, Yassmine !', 32, 144);
        ctx.fillStyle = '#94a3b8'; ctx.font = '12px sans-serif'; ctx.fillText('Objectif: 2,000 kcal / jour', 32, 166);
        ctx.fillStyle = '#34C759'; ctx.beginPath(); ctx.roundRect(32, 176, 90, 14, 7); ctx.fill();
        ctx.fillStyle = '#000'; ctx.font = 'bold 9px sans-serif'; ctx.fillText('En bonne voie', 40, 186);

        // Circular calorie progress
        var circY = 290;
        ctx.fillStyle = 'rgba(255,255,255,0.03)'; ctx.beginPath(); ctx.roundRect(16, 215, w - 32, 180, 16); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 14px sans-serif'; ctx.fillText("Aujourd'hui", 32, 240);
        var centerX = w / 2, centerY = circY + 20, radius = 60;
        // Background circle
        ctx.lineWidth = 10; ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.beginPath(); ctx.arc(centerX, centerY, radius, 0, Math.PI * 2); ctx.stroke();
        // Progress arc (71%)
        var pct = 0.71;
        ctx.strokeStyle = '#34C759'; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct); ctx.stroke();
        ctx.lineCap = 'butt';
        // Center text
        ctx.fillStyle = '#fff'; ctx.font = 'bold 28px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('1,420', centerX, centerY - 2);
        ctx.fillStyle = '#64748b'; ctx.font = '11px sans-serif';
        ctx.fillText('/ 2,000 kcal', centerX, centerY + 18);
        ctx.textAlign = 'left';

        // Macros row
        var macY = 415;
        var macros = [
            { label: 'Proteines', val: '85g', pct: 0.68, color: '#2D9CDB' },
            { label: 'Glucides', val: '180g', pct: 0.72, color: '#FF9500' },
            { label: 'Lipides', val: '52g', pct: 0.65, color: '#FF3B30' }
        ];
        for (var mi = 0; mi < 3; mi++) {
            var mx = 32 + mi * 158;
            ctx.fillStyle = '#fff'; ctx.font = 'bold 12px sans-serif'; ctx.fillText(macros[mi].val, mx, macY);
            ctx.fillStyle = '#64748b'; ctx.font = '10px sans-serif'; ctx.fillText(macros[mi].label, mx, macY + 16);
            // Mini bar
            ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.beginPath(); ctx.roundRect(mx, macY + 22, 130, 5, 2.5); ctx.fill();
            ctx.fillStyle = macros[mi].color; ctx.beginPath(); ctx.roundRect(mx, macY + 22, 130 * macros[mi].pct, 5, 2.5); ctx.fill();
        }

        // Meals section
        var mealsY = 475;
        ctx.fillStyle = '#fff'; ctx.font = 'bold 15px sans-serif'; ctx.fillText('Repas du jour', 24, mealsY);
        ctx.fillStyle = '#2D9CDB'; ctx.font = '12px sans-serif'; ctx.fillText('+ Ajouter', w - 90, mealsY);

        var meals = [
            { name: 'Petit-dejeuner', cal: '380 kcal', items: 'Oeufs, toast, jus', icon: '\u2600', color: '#FF9500' },
            { name: 'Dejeuner', cal: '620 kcal', items: 'Poulet, riz, salade', icon: '\u263C', color: '#34C759' },
            { name: 'Collation', cal: '180 kcal', items: 'Yaourt, fruits', icon: '\u2605', color: '#5CB8E6' },
            { name: 'Diner', cal: '240 kcal', items: 'Soupe, pain complet', icon: '\u263E', color: '#AF52DE' }
        ];
        for (var mli = 0; mli < meals.length; mli++) {
            var my = mealsY + 20 + mli * 68;
            ctx.fillStyle = 'rgba(255,255,255,0.03)'; ctx.beginPath(); ctx.roundRect(16, my, w - 32, 58, 12); ctx.fill();
            // Icon circle
            ctx.fillStyle = meals[mli].color + '25'; ctx.beginPath(); ctx.arc(46, my + 29, 18, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = meals[mli].color; ctx.font = '16px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(meals[mli].icon, 46, my + 35); ctx.textAlign = 'left';
            // Text
            ctx.fillStyle = '#fff'; ctx.font = 'bold 13px sans-serif'; ctx.fillText(meals[mli].name, 76, my + 24);
            ctx.fillStyle = '#64748b'; ctx.font = '10px sans-serif'; ctx.fillText(meals[mli].items, 76, my + 42);
            // Calories badge
            ctx.fillStyle = meals[mli].color + '20'; ctx.beginPath(); ctx.roundRect(w - 105, my + 16, 72, 22, 11); ctx.fill();
            ctx.fillStyle = meals[mli].color; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(meals[mli].cal, w - 69, my + 31); ctx.textAlign = 'left';
        }

        // Weekly chart
        var chartY = 770;
        ctx.fillStyle = '#fff'; ctx.font = 'bold 14px sans-serif'; ctx.fillText('Cette semaine', 24, chartY);
        var days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
        var dayVals = [0.82, 0.95, 0.70, 0.88, 0.60, 0.75, 0.71];
        var barW = 36, barGap = (w - 48 - 7 * barW) / 6, barMaxH = 80;
        for (var di = 0; di < 7; di++) {
            var bx = 24 + di * (barW + barGap), barH = barMaxH * dayVals[di];
            ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.beginPath(); ctx.roundRect(bx, chartY + 20 + barMaxH - barH, barW, barH, 4); ctx.fill();
            ctx.fillStyle = di === 6 ? '#34C759' : 'rgba(52,199,89,0.5)';
            ctx.beginPath(); ctx.roundRect(bx, chartY + 20 + barMaxH - barH, barW, barH, 4); ctx.fill();
            ctx.fillStyle = '#64748b'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(days[di], bx + barW / 2, chartY + 115); ctx.textAlign = 'left';
        }

        // Tab bar
        ctx.fillStyle = 'rgba(8,16,30,0.97)'; ctx.fillRect(0, h - 80, w, 80);
        ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(0, h - 80); ctx.lineTo(w, h - 80); ctx.stroke();
        var tabIcons = ['\u2302', '\u25CB', '\u002B', '\u2606'];
        var tabLabels = ['Accueil', 'Stats', 'Ajouter', 'Profil'];
        for (var ti = 0; ti < 4; ti++) {
            var ttx = ti * (w / 4) + w / 8;
            ctx.fillStyle = ti === 0 ? '#34C759' : '#5a6580';
            ctx.font = '20px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(tabIcons[ti], ttx, h - 48);
            ctx.font = (ti === 0 ? 'bold ' : '') + '10px sans-serif';
            ctx.fillText(tabLabels[ti], ttx, h - 30);
        }
        ctx.textAlign = 'left';
        // Home indicator
        ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.beginPath(); ctx.roundRect(w / 2 - 50, h - 8, 100, 4, 2); ctx.fill();

        phoneTexture.needsUpdate = true;
    }

    // ========================================
    // TABLET SCREEN — AZ Airlines Dashboard
    // ========================================
    var tabletScreenCanvas = document.createElement('canvas');
    tabletScreenCanvas.width = 1024; tabletScreenCanvas.height = 768;
    var tabletCtx = tabletScreenCanvas.getContext('2d');
    var tabletTexture = new THREE.CanvasTexture(tabletScreenCanvas);
    tabletTexture.colorSpace = THREE.SRGBColorSpace;
    var tabletScreenMat = new THREE.MeshBasicMaterial({ map: tabletTexture, toneMapped: false });

    function drawTabletScreen() {
        var ctx = tabletCtx, w = 1024, h = 768;
        var grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#0c1425'); grad.addColorStop(1, '#060b14');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);

        // Sidebar
        var sbW = 72;
        ctx.fillStyle = 'rgba(255,255,255,0.03)'; ctx.fillRect(0, 0, sbW, h);
        ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(sbW, 0); ctx.lineTo(sbW, h); ctx.stroke();
        // Logo
        ctx.fillStyle = '#2D9CDB'; ctx.font = 'bold 18px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('AZ', sbW / 2, 38); ctx.textAlign = 'left';
        // Nav icons (simple circles with letters)
        var navIcons = [
            { icon: '\u25A1', active: true }, { icon: '\u2708', active: false },
            { icon: '\u263A', active: false }, { icon: '\u2606', active: false }, { icon: '\u2699', active: false }
        ];
        for (var ni = 0; ni < navIcons.length; ni++) {
            var ny = 80 + ni * 54;
            if (navIcons[ni].active) {
                ctx.fillStyle = 'rgba(45,156,219,0.15)'; ctx.beginPath(); ctx.roundRect(8, ny - 14, sbW - 16, 36, 8); ctx.fill();
                ctx.fillStyle = '#2D9CDB';
            } else {
                ctx.fillStyle = '#5a6580';
            }
            ctx.font = '18px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(navIcons[ni].icon, sbW / 2, ny + 6); ctx.textAlign = 'left';
        }

        // Header
        var hdrY = 0, hdrH = 56;
        ctx.fillStyle = 'rgba(255,255,255,0.02)'; ctx.fillRect(sbW, hdrY, w - sbW, hdrH);
        ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.beginPath(); ctx.moveTo(sbW, hdrH); ctx.lineTo(w, hdrH); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 16px sans-serif'; ctx.fillText('AZ Airlines', sbW + 24, 35);
        ctx.fillStyle = '#64748b'; ctx.font = '12px sans-serif'; ctx.fillText('Dashboard', sbW + 140, 35);
        // Search bar
        ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.beginPath(); ctx.roundRect(w - 300, 14, 180, 28, 14); ctx.fill();
        ctx.fillStyle = '#5a6580'; ctx.font = '11px sans-serif'; ctx.fillText('\uD83D\uDD0D  Rechercher...', w - 288, 33);
        // Avatar
        ctx.fillStyle = 'rgba(45,156,219,0.2)'; ctx.beginPath(); ctx.arc(w - 50, 28, 16, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('A', w - 50, 33); ctx.textAlign = 'left';

        // KPI Cards
        var kpiY = hdrH + 20, kpiH = 90;
        var kpis = [
            { num: '42.8K', label: 'Passagers', change: '+12.5%', color: '#2D9CDB', up: true },
            { num: '156', label: 'Vols actifs', change: '+3.2%', color: '#34C759', up: true },
            { num: '$3.2M', label: 'Revenue', change: '+8.1%', color: '#FF9500', up: true },
            { num: '94%', label: 'Satisfaction', change: '-0.3%', color: '#AF52DE', up: false }
        ];
        var kpiW = (w - sbW - 24 * 2 - 16 * 3) / 4;
        for (var ki = 0; ki < 4; ki++) {
            var kx = sbW + 24 + ki * (kpiW + 16);
            ctx.fillStyle = 'rgba(255,255,255,0.03)'; ctx.beginPath(); ctx.roundRect(kx, kpiY, kpiW, kpiH, 12); ctx.fill();
            ctx.strokeStyle = kpis[ki].color + '25'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.roundRect(kx, kpiY, kpiW, kpiH, 12); ctx.stroke();
            ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif'; ctx.fillText(kpis[ki].label, kx + 16, kpiY + 24);
            ctx.fillStyle = '#fff'; ctx.font = 'bold 24px sans-serif'; ctx.fillText(kpis[ki].num, kx + 16, kpiY + 56);
            ctx.fillStyle = kpis[ki].up ? '#34C759' : '#FF3B30'; ctx.font = 'bold 11px sans-serif';
            ctx.fillText(kpis[ki].change, kx + 16, kpiY + 76);
            // Mini sparkline
            ctx.strokeStyle = kpis[ki].color + '60'; ctx.lineWidth = 1.5; ctx.beginPath();
            var spX = kx + kpiW - 60, spY0 = kpiY + 45;
            var sparkData = [0, -5, 3, -2, 6, 4, 8, 5, 10, 12, 9, 14];
            ctx.moveTo(spX, spY0 - sparkData[0]);
            for (var sp = 1; sp < sparkData.length; sp++) ctx.lineTo(spX + sp * 4, spY0 - sparkData[sp]);
            ctx.stroke();
        }

        // Chart area
        var chartY = kpiY + kpiH + 24, chartH = 240;
        ctx.fillStyle = 'rgba(255,255,255,0.02)'; ctx.beginPath(); ctx.roundRect(sbW + 24, chartY, w - sbW - 48, chartH, 12); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 13px sans-serif'; ctx.fillText('Passagers mensuels', sbW + 44, chartY + 28);
        ctx.fillStyle = '#64748b'; ctx.font = '11px sans-serif'; ctx.fillText('Derniers 12 mois', sbW + 200, chartY + 28);
        // Grid lines
        var cLeft = sbW + 70, cRight = w - 60, cTop = chartY + 50, cBot = chartY + chartH - 30;
        ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 1;
        for (var gi = 0; gi < 5; gi++) {
            var gy = cTop + (cBot - cTop) * gi / 4;
            ctx.beginPath(); ctx.moveTo(cLeft, gy); ctx.lineTo(cRight, gy); ctx.stroke();
            ctx.fillStyle = '#4a5568'; ctx.font = '9px sans-serif';
            ctx.fillText(String(80 - gi * 20) + 'K', sbW + 36, gy + 3);
        }
        // Month labels
        var months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (var ml = 0; ml < 12; ml++) {
            var mlx = cLeft + ml * (cRight - cLeft) / 11;
            ctx.fillStyle = '#4a5568'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(months[ml], mlx, cBot + 16); ctx.textAlign = 'left';
        }
        // Data line
        var chartData = [35, 42, 38, 55, 48, 62, 58, 70, 65, 72, 68, 78];
        var maxD = 80;
        ctx.strokeStyle = '#2D9CDB'; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        ctx.beginPath();
        for (var cd = 0; cd < chartData.length; cd++) {
            var cpx = cLeft + cd * (cRight - cLeft) / 11;
            var cpy = cBot - (chartData[cd] / maxD) * (cBot - cTop);
            if (cd === 0) ctx.moveTo(cpx, cpy); else ctx.lineTo(cpx, cpy);
        }
        ctx.stroke();
        // Fill gradient under line
        var lastCpx = cLeft + 11 * (cRight - cLeft) / 11;
        ctx.lineTo(lastCpx, cBot); ctx.lineTo(cLeft, cBot); ctx.closePath();
        var cGrad = ctx.createLinearGradient(0, cTop, 0, cBot);
        cGrad.addColorStop(0, 'rgba(45,156,219,0.2)'); cGrad.addColorStop(1, 'rgba(45,156,219,0)');
        ctx.fillStyle = cGrad; ctx.fill();
        // Data dots
        for (var dd = 0; dd < chartData.length; dd++) {
            var dpx = cLeft + dd * (cRight - cLeft) / 11;
            var dpy = cBot - (chartData[dd] / maxD) * (cBot - cTop);
            ctx.fillStyle = '#2D9CDB'; ctx.beginPath(); ctx.arc(dpx, dpy, 3, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(dpx, dpy, 1.5, 0, Math.PI * 2); ctx.fill();
        }

        // Recent flights
        var rfY = chartY + chartH + 24;
        ctx.fillStyle = 'rgba(255,255,255,0.02)'; ctx.beginPath(); ctx.roundRect(sbW + 24, rfY, w - sbW - 48, h - rfY - 20, 12); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 13px sans-serif'; ctx.fillText('Vols recents', sbW + 44, rfY + 28);

        // Table header
        var tblY = rfY + 44;
        ctx.fillStyle = '#4a5568'; ctx.font = 'bold 10px sans-serif';
        ctx.fillText('VOL', sbW + 44, tblY);
        ctx.fillText('ROUTE', sbW + 140, tblY);
        ctx.fillText('STATUT', sbW + 380, tblY);
        ctx.fillText('PASSAGERS', sbW + 520, tblY);
        ctx.fillText('HEURE', w - 100, tblY);
        ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.beginPath(); ctx.moveTo(sbW + 44, tblY + 8); ctx.lineTo(w - 44, tblY + 8); ctx.stroke();

        var flights = [
            { code: 'AZ-1042', route: 'Tunis \u2192 Paris CDG', status: 'En vol', sColor: '#34C759', pax: '186/220', time: '14:30' },
            { code: 'AZ-2187', route: 'Tunis \u2192 Istanbul', status: 'Embarq.', sColor: '#FF9500', pax: '142/180', time: '15:45' },
            { code: 'AZ-0891', route: 'Monastir \u2192 Lyon', status: 'Prevu', sColor: '#2D9CDB', pax: '98/160', time: '17:00' },
            { code: 'AZ-3341', route: 'Djerba \u2192 Marseille', status: 'Termine', sColor: '#64748b', pax: '175/175', time: '12:15' }
        ];
        for (var fl = 0; fl < flights.length; fl++) {
            var fy = tblY + 22 + fl * 32;
            ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif'; ctx.fillText(flights[fl].code, sbW + 44, fy);
            ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif'; ctx.fillText(flights[fl].route, sbW + 140, fy);
            // Status badge
            ctx.fillStyle = flights[fl].sColor + '20'; ctx.beginPath(); ctx.roundRect(sbW + 374, fy - 10, 65, 18, 9); ctx.fill();
            ctx.fillStyle = flights[fl].sColor; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(flights[fl].status, sbW + 406, fy); ctx.textAlign = 'left';
            ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif';
            ctx.fillText(flights[fl].pax, sbW + 520, fy);
            ctx.fillText(flights[fl].time, w - 100, fy);
        }

        tabletTexture.needsUpdate = true;
    }

    // Draw screens
    drawLaptopScreen(false);
    renderPhoneScreen(0);
    renderTabletScreen(0);

    // ========================================
    // BUILD LAPTOP (detailed MacBook-style)
    // ========================================
    var laptop = new THREE.Group();
    var lidGroup = new THREE.Group();
    var W = 3.0, D = 2.0, BASE_H = 0.06, LID_H = 0.04, BEZEL = 0.08;

    var baseMesh = new THREE.Mesh(new THREE.BoxGeometry(W, BASE_H, D), bodyMaterial);
    baseMesh.position.y = BASE_H / 2; baseMesh.castShadow = true; baseMesh.receiveShadow = true;
    laptop.add(baseMesh);

    var bottomMesh = new THREE.Mesh(new THREE.BoxGeometry(W - 0.04, 0.003, D - 0.04), bottomMaterial);
    bottomMesh.position.y = 0.001; laptop.add(bottomMesh);

    var footGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.012, 16);
    var footPos = [[-1.2, -0.006, -0.8], [1.2, -0.006, -0.8], [-1.2, -0.006, 0.8], [1.2, -0.006, 0.8]];
    for (var fi = 0; fi < 4; fi++) { var f = new THREE.Mesh(footGeo, rubberMaterial); f.position.set(footPos[fi][0], footPos[fi][1], footPos[fi][2]); laptop.add(f); }

    var kbW = W - 0.4, kbD = D * 0.5;
    var kbMesh = new THREE.Mesh(new THREE.PlaneGeometry(kbW, kbD), keyMaterial);
    kbMesh.rotation.x = -Math.PI / 2; kbMesh.position.set(0, BASE_H + 0.001, -0.05); laptop.add(kbMesh);

    var keyGeo = new THREE.BoxGeometry(0.13, 0.002, 0.13);
    var keyCapMat = new THREE.MeshStandardMaterial({ color: 0x0d0d10, metalness: 0.3, roughness: 0.8 });
    for (var row = 0; row < 5; row++) {
        for (var col = 0; col < 14; col++) {
            var km = new THREE.Mesh(keyGeo, keyCapMat);
            km.position.set(-kbW / 2 + 0.12 + col * 0.17, BASE_H + 0.003, -0.05 - kbD / 2 + 0.12 + row * 0.17);
            laptop.add(km);
        }
    }

    var tpMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.6), trackpadMaterial);
    tpMesh.rotation.x = -Math.PI / 2; tpMesh.position.set(0, BASE_H + 0.0012, 0.55); laptop.add(tpMesh);

    var hingeLen = W * 0.7;
    var hingeGeo = new THREE.CylinderGeometry(0.022, 0.022, hingeLen, 24);
    hingeGeo.rotateZ(Math.PI / 2);
    var hingeMesh = new THREE.Mesh(hingeGeo, hingeMaterial);
    hingeMesh.position.set(0, BASE_H, -D / 2); laptop.add(hingeMesh);

    lidGroup.position.set(0, BASE_H, -D / 2);
    var lidMesh = new THREE.Mesh(new THREE.BoxGeometry(W, LID_H, D), bodyMaterial);
    lidMesh.position.set(0, LID_H / 2, D / 2); lidMesh.castShadow = true; lidGroup.add(lidMesh);

    var bezelMesh = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.02, D - 0.02), bezelMaterial);
    bezelMesh.rotation.x = Math.PI / 2; bezelMesh.position.set(0, -0.001, D / 2); lidGroup.add(bezelMesh);

    var scrW = W - BEZEL * 2, scrD = D - BEZEL * 2 - 0.04;
    var screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(scrW, scrD), screenOffMaterial);
    screenMesh.rotation.x = Math.PI / 2; screenMesh.position.set(0, -0.002, D / 2); lidGroup.add(screenMesh);

    var glassMesh = new THREE.Mesh(new THREE.PlaneGeometry(scrW + 0.01, scrD + 0.01), screenGlassMaterial);
    glassMesh.rotation.x = Math.PI / 2; glassMesh.position.set(0, -0.003, D / 2); glassMesh.renderOrder = 1; lidGroup.add(glassMesh);


    var camLedMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0 });
    var camDot = new THREE.Mesh(new THREE.CircleGeometry(0.012, 16), new THREE.MeshBasicMaterial({ color: 0x1a1a2e }));
    camDot.rotation.x = Math.PI / 2; camDot.position.set(0, -0.003, BEZEL * 0.6); lidGroup.add(camDot);
    var camLed = new THREE.Mesh(new THREE.CircleGeometry(0.004, 8), camLedMat);
    camLed.rotation.x = Math.PI / 2; camLed.position.set(0.025, -0.003, BEZEL * 0.6); lidGroup.add(camLed);

    var logoMesh = new THREE.Mesh(new THREE.CircleGeometry(0.15, 32), new THREE.MeshPhysicalMaterial({
        color: 0x3a3a42, metalness: 1.0, roughness: 0.08, envMap: envMap, envMapIntensity: 2.2
    }));
    logoMesh.rotation.x = -Math.PI / 2; logoMesh.position.set(0, LID_H + 0.001, D / 2); lidGroup.add(logoMesh);

    lidGroup.rotation.x = 0;
    laptop.add(lidGroup);
    scene.add(laptop);
    laptop.position.y = -0.3;

    // ========================================
    // BUILD SMARTPHONE (Eat & Fit phone)
    // ========================================
    var phone = new THREE.Group();
    var PW = 0.38, PH = 0.78, PT = 0.035;

    var phoneBody = new THREE.Mesh(new THREE.BoxGeometry(PW, PH, PT), phoneMaterial);
    phone.add(phoneBody);

    var pScrW = PW - 0.02, pScrH = PH - 0.04;
    var phoneScreen = new THREE.Mesh(new THREE.PlaneGeometry(pScrW, pScrH), phoneScreenMat);
    phoneScreen.position.z = PT / 2 + 0.002; phoneScreen.renderOrder = 2; phone.add(phoneScreen);

    var phoneGlass = new THREE.Mesh(new THREE.PlaneGeometry(pScrW + 0.005, pScrH + 0.005), screenGlassMaterial);
    phoneGlass.position.z = PT / 2 + 0.003; phoneGlass.renderOrder = 3; phone.add(phoneGlass);

    // Thin side band instead of full overlapping frame (prevents z-fighting/flickering)
    var phoneSideMat = new THREE.MeshPhysicalMaterial({ color: 0x2a2a32, metalness: 0.95, roughness: 0.1, envMap: envMap, envMapIntensity: 1.5 });
    var sideT = 0.004;
    // Left side
    var pSideL = new THREE.Mesh(new THREE.BoxGeometry(sideT, PH + 0.006, PT + 0.004), phoneSideMat);
    pSideL.position.x = -(PW + 0.006) / 2; phone.add(pSideL);
    // Right side
    var pSideR = new THREE.Mesh(new THREE.BoxGeometry(sideT, PH + 0.006, PT + 0.004), phoneSideMat);
    pSideR.position.x = (PW + 0.006) / 2; phone.add(pSideR);
    // Top side
    var pSideTop = new THREE.Mesh(new THREE.BoxGeometry(PW + 0.006, sideT, PT + 0.004), phoneSideMat);
    pSideTop.position.y = (PH + 0.006) / 2; phone.add(pSideTop);
    // Bottom side
    var pSideBot = new THREE.Mesh(new THREE.BoxGeometry(PW + 0.006, sideT, PT + 0.004), phoneSideMat);
    pSideBot.position.y = -(PH + 0.006) / 2; phone.add(pSideBot);

    var camBump = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.008, 16),
        new THREE.MeshPhysicalMaterial({ color: 0x1a1a20, metalness: 0.9, roughness: 0.2, envMap: envMap }));
    camBump.rotation.x = Math.PI / 2; camBump.position.set(-PW / 2 + 0.06, PH / 2 - 0.06, -PT / 2 - 0.004);
    phone.add(camBump);

    phone.position.set(-5, -3, 0);
    phone.scale.setScalar(isMobile ? 3.4 : 5.2);
    scene.add(phone);

    // ========================================
    // BUILD TABLET (AZ Airlines iPad)
    // ========================================
    var tablet = new THREE.Group();
    var TW = 1.2, TH = 0.85, TT = 0.028;

    var tabletBody = new THREE.Mesh(new THREE.BoxGeometry(TW, TH, TT), tabletMaterial);
    tablet.add(tabletBody);

    var tScrW = TW - 0.025, tScrH = TH - 0.025;
    var tabletScreen = new THREE.Mesh(new THREE.PlaneGeometry(tScrW, tScrH), tabletScreenMat);
    tabletScreen.position.z = TT / 2 + 0.002; tabletScreen.renderOrder = 2; tablet.add(tabletScreen);

    var tabletGlass = new THREE.Mesh(new THREE.PlaneGeometry(tScrW + 0.005, tScrH + 0.005), screenGlassMaterial);
    tabletGlass.position.z = TT / 2 + 0.003; tabletGlass.renderOrder = 3; tablet.add(tabletGlass);

    // Side bands instead of overlapping frame (prevents z-fighting)
    var tabSideMat = new THREE.MeshPhysicalMaterial({ color: 0x2a2a32, metalness: 0.95, roughness: 0.1, envMap: envMap, envMapIntensity: 1.5 });
    var tSideT = 0.004;
    var tSL = new THREE.Mesh(new THREE.BoxGeometry(tSideT, TH + 0.005, TT + 0.003), tabSideMat);
    tSL.position.x = -(TW + 0.005) / 2; tablet.add(tSL);
    var tSR = new THREE.Mesh(new THREE.BoxGeometry(tSideT, TH + 0.005, TT + 0.003), tabSideMat);
    tSR.position.x = (TW + 0.005) / 2; tablet.add(tSR);
    var tSTop = new THREE.Mesh(new THREE.BoxGeometry(TW + 0.005, tSideT, TT + 0.003), tabSideMat);
    tSTop.position.y = (TH + 0.005) / 2; tablet.add(tSTop);
    var tSBot = new THREE.Mesh(new THREE.BoxGeometry(TW + 0.005, tSideT, TT + 0.003), tabSideMat);
    tSBot.position.y = -(TH + 0.005) / 2; tablet.add(tSBot);

    // Front camera dot
    var tabletCam = new THREE.Mesh(new THREE.CircleGeometry(0.006, 16), new THREE.MeshBasicMaterial({ color: 0x1a1a2e }));
    tabletCam.position.set(0, TH / 2 - 0.015, TT / 2 + 0.001); tablet.add(tabletCam);

    tablet.position.set(6, 3, 1);
    tablet.scale.setScalar(isMobile ? 2.8 : 4.2);
    scene.add(tablet);

    // ========================================
    // FLOATING SHAPES
    // ========================================
    var floatingShapes = [];
    var shapeConfigs = [
        { geo: new THREE.OctahedronGeometry(0.3, 0), pos: [-3.5, 2.0, -4], speed: 0.3 },
        { geo: new THREE.TorusGeometry(0.25, 0.08, 8, 24), pos: [3.8, -1.5, -5], speed: 0.5 },
        { geo: new THREE.IcosahedronGeometry(0.2, 0), pos: [-2.5, -2.2, -3], speed: 0.4 },
        { geo: new THREE.TorusKnotGeometry(0.15, 0.05, 32, 8), pos: [4.0, 1.8, -6], speed: 0.35 },
        { geo: new THREE.OctahedronGeometry(0.18, 0), pos: [2.5, 2.5, -5], speed: 0.45 },
        { geo: new THREE.DodecahedronGeometry(0.22, 0), pos: [-4.0, 0.5, -4.5], speed: 0.38 }
    ];
    for (var si = 0; si < shapeConfigs.length; si++) {
        var sc = shapeConfigs[si];
        var mat = si % 2 === 0 ? shapeMaterial.clone() : shapeGlowMat.clone();
        var sm = new THREE.Mesh(sc.geo, mat);
        sm.position.set(sc.pos[0], sc.pos[1], sc.pos[2]);
        sm.userData.speed = sc.speed; sm.userData.baseY = sc.pos[1];
        scene.add(sm); floatingShapes.push(sm);
    }

    // ========================================
    // HOLOGRAPHIC GLOBE
    // ========================================
    var globe = new THREE.Group();
    var globeWireMat = new THREE.MeshBasicMaterial({ color: 0x2D9CDB, wireframe: true, transparent: true, opacity: 0.12 });
    globe.add(new THREE.Mesh(new THREE.IcosahedronGeometry(1.0, 2), globeWireMat));
    var globeInnerMat = new THREE.MeshPhysicalMaterial({
        color: 0x0a1a3a, metalness: 0.1, roughness: 0.9, transparent: true, opacity: 0.2, envMap: envMap, envMapIntensity: 0.3
    });
    globe.add(new THREE.Mesh(new THREE.SphereGeometry(0.95, 32, 32), globeInnerMat));

    var ring1Mat = new THREE.MeshBasicMaterial({ color: 0x3AAFFF, transparent: true, opacity: 0.25 });
    var ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.008, 8, 100), ring1Mat);
    ring1.rotation.x = Math.PI / 3; ring1.rotation.y = Math.PI / 8; globe.add(ring1);
    var ring2Mat = new THREE.MeshBasicMaterial({ color: 0x5CB8E6, transparent: true, opacity: 0.18 });
    var ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.006, 8, 80), ring2Mat);
    ring2.rotation.x = -Math.PI / 4; ring2.rotation.z = Math.PI / 5; globe.add(ring2);
    var ring3Mat = new THREE.MeshBasicMaterial({ color: 0x64B5F6, transparent: true, opacity: 0.12 });
    var ring3 = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.004, 8, 120), ring3Mat);
    ring3.rotation.x = Math.PI / 6; ring3.rotation.y = -Math.PI / 3; globe.add(ring3);

    var dotGeo = new THREE.SphereGeometry(0.025, 8, 8);
    var connectionDots = [];
    for (var gi = 0; gi < 24; gi++) {
        var phi = Math.acos(2 * Math.random() - 1);
        var theta = Math.random() * Math.PI * 2;
        var dotMat = new THREE.MeshBasicMaterial({
            color: gi % 3 === 0 ? 0x3AAFFF : gi % 3 === 1 ? 0x5CB8E6 : 0x2D9CDB, transparent: true, opacity: 0.6
        });
        var dot = new THREE.Mesh(dotGeo, dotMat);
        dot.position.set(Math.sin(phi) * Math.cos(theta), Math.sin(phi) * Math.sin(theta), Math.cos(phi));
        dot.userData.phi = phi; dot.userData.theta = theta;
        globe.add(dot); connectionDots.push(dot);
    }
    var lineMat = new THREE.LineBasicMaterial({ color: 0x2D9CDB, transparent: true, opacity: 0.08 });
    for (var li = 0; li < 12; li++) {
        var d1 = connectionDots[li % connectionDots.length];
        var d2 = connectionDots[(li + 3) % connectionDots.length];
        globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([d1.position.clone(), d2.position.clone()]), lineMat));
    }
    var electronGeo = new THREE.SphereGeometry(0.035, 8, 8);
    var electrons = [];
    for (var ei = 0; ei < 3; ei++) {
        var eMat = new THREE.MeshBasicMaterial({ color: 0x3AAFFF, transparent: true, opacity: 0.8 });
        var electron = new THREE.Mesh(electronGeo, eMat);
        electron.userData.ringIdx = ei; electron.userData.speed = 0.4 + ei * 0.15;
        electron.userData.offset = ei * Math.PI * 2 / 3;
        globe.add(electron); electrons.push(electron);
    }
    globe.position.set(2.5, 0.5, -2); globe.scale.setScalar(0); globe.visible = false;
    scene.add(globe);

    // ========================================
    // LIGHTING
    // ========================================
    var keyLight = new THREE.DirectionalLight(0xd4ccbb, 2.2);
    keyLight.position.set(3, 5, 4); keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(isMobile ? 512 : 1024, isMobile ? 512 : 1024);
    keyLight.shadow.bias = -0.0005; scene.add(keyLight);
    scene.add(new THREE.DirectionalLight(0x8899cc, 0.9).translateX(-3).translateY(3).translateZ(-2));
    var rimLight = new THREE.DirectionalLight(0x3366cc, 1.4);
    rimLight.position.set(0, 2, -5); scene.add(rimLight);
    scene.add(new THREE.AmbientLight(0x1a1520, 0.45));
    var spotLight = new THREE.SpotLight(0xccccdd, 0.6);
    spotLight.position.set(0, 8, 2); spotLight.angle = Math.PI / 6; spotLight.penumbra = 0.8; spotLight.decay = 2; scene.add(spotLight);
    var screenLight = new THREE.PointLight(0x4499dd, 0, 3);
    screenLight.position.set(0, 0.5, 0); laptop.add(screenLight);

    // ========================================
    // PARTICLES
    // ========================================
    var PARTICLE_COUNT = isMobile ? 100 : 400;
    var pGeo = new THREE.BufferGeometry();
    var pPos = new Float32Array(PARTICLE_COUNT * 3);
    for (var pi = 0; pi < PARTICLE_COUNT * 3; pi += 3) {
        pPos[pi] = (Math.random() - 0.5) * 25;
        pPos[pi + 1] = (Math.random() - 0.5) * 18;
        pPos[pi + 2] = (Math.random() - 0.5) * 18 - 5;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    var particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
        color: 0x3AAFFF, size: 0.02, transparent: true, opacity: 0.4,
        blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
    }));
    scene.add(particles);

    // ========================================
    // SCROLL STATE
    // ========================================
    var scrollState = {
        progress: 0,
        cameraX: 0, cameraY: isMobile ? 3.5 : 4.5, cameraZ: isMobile ? 7.0 : 9.0,
        rotationY: -Math.PI * 0.15, lidAngle: 0, laptopX: 0, laptopScale: isMobile ? 0.45 : 0.6,
        screenPowered: false,
        phoneArc: 0,
        tabletArc: 0,
        globeScale: 0, globeVisible: false,
        screenScroll: 0, phoneScroll: 0, tabletScroll: 0
    };

    // ========================================
    // GSAP SCROLL TIMELINE — 7 PHASES, 700vh
    // ========================================
    gsap.registerPlugin(ScrollTrigger);

    var heroTl = gsap.timeline({
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: '+=700%',
            scrub: 1.5,
            pin: true,
            anticipatePin: 1,
            onUpdate: function (self) { scrollState.progress = self.progress; }
        }
    });

    // ---- PHASE 1 (0-12): CINEMATIC DOLLY-IN ----
    heroTl.to(scrollState, { cameraZ: isMobile ? 5.5 : 4.5, cameraY: 1.5, duration: 12, ease: 'power3.inOut' }, 0);
    heroTl.to(scrollState, { rotationY: Math.PI * 0.35, duration: 12, ease: 'power2.inOut' }, 0);
    heroTl.to(scrollState, { laptopScale: isMobile ? 0.7 : 1, duration: 10, ease: 'power3.out' }, 0);

    // ---- PHASE 2 (12-26): LID OPENS + WEBSITE APPEARS ----
    heroTl.to(scrollState, {
        lidAngle: -2.0, duration: 12, ease: 'power2.inOut',
        onUpdate: function () {
            if (scrollState.lidAngle < -0.5 && !scrollState.screenPowered) {
                scrollState.screenPowered = true;
                screenMesh.material = screenMaterial;
                laptopContentReady = true;
                renderLaptopScreen(0);
                camLedMat.opacity = 0.8;
            }
            if (scrollState.lidAngle >= -0.5 && scrollState.screenPowered) {
                scrollState.screenPowered = false;
                screenMesh.material = screenOffMaterial;
                drawLaptopScreen(false);
                camLedMat.opacity = 0;
            }
        }
    }, 12);
    heroTl.to(scrollState, { cameraZ: 4.2, cameraY: 1.0, rotationY: Math.PI * 0.45, duration: 12, ease: 'power2.inOut' }, 12);
    heroTl.to(screenLight, { intensity: 2.0, duration: 6 }, 18);
    // Phase text: Web Development
    heroTl.to('#phaseWeb', { opacity: 1, y: 0, duration: 4, ease: 'power2.out' }, 17);
    heroTl.to('#phaseWeb', { opacity: 0, duration: 3, ease: 'power2.in' }, 24);
    // Laptop screen scrolls during phase 2-3
    heroTl.to(scrollState, { screenScroll: 0.5, duration: 20, ease: 'none' }, 16);

    // ---- PHASE 3 (26-42): LAPTOP SLIDES AWAY + PHONE & TABLET ENTER TOGETHER ----
    heroTl.to(scrollState, { laptopX: isMobile ? 1.4 : 3.5, duration: 12, ease: 'power2.inOut' }, 26);
    heroTl.to(scrollState, { cameraZ: isMobile ? 11.0 : 9.0, cameraX: isMobile ? 0 : -0.5, cameraY: 0.8, duration: 14, ease: 'power2.out' }, 26);
    heroTl.to(scrollState, { rotationY: Math.PI * 0.8, duration: 14, ease: 'power2.inOut' }, 26);
    // Phone + Tablet simultaneous arc entrance
    heroTl.to(scrollState, { phoneArc: 1, duration: 12, ease: 'power3.out' }, 30);
    heroTl.to(scrollState, { tabletArc: 1, duration: 12, ease: 'power3.out' }, 30);
    // Phase texts: Mobile + Data staggered but overlapping
    heroTl.to('#phaseMobile', { opacity: 1, y: 0, duration: 4, ease: 'power2.out' }, 32);
    heroTl.to('#phaseMobile', { opacity: 0, duration: 3, ease: 'power2.in' }, 38);
    heroTl.to('#phaseData', { opacity: 1, y: 0, duration: 4, ease: 'power2.out' }, 36);
    heroTl.to('#phaseData', { opacity: 0, duration: 3, ease: 'power2.in' }, 42);
    // Laptop continues scrolling + phone + tablet scroll
    heroTl.to(scrollState, { screenScroll: 1, duration: 16, ease: 'none' }, 26);
    heroTl.to(scrollState, { phoneScroll: 1, duration: 14, ease: 'none' }, 30);
    heroTl.to(scrollState, { tabletScroll: 0.8, duration: 14, ease: 'none' }, 32);

    // ---- PHASE 4 (42-58): ALL DEVICES SHOWCASE + HERO TEXT ----
    heroTl.to(scrollState, { cameraZ: isMobile ? 10.5 : 8.0, cameraY: 0.6, duration: 14, ease: 'power2.inOut' }, 42);
    heroTl.to(scrollState, { rotationY: Math.PI * 1.2, duration: 16, ease: 'none' }, 42);
    // Hero text appears
    heroTl.to('.hero-tag', { opacity: 1, duration: 4 }, 46);
    heroTl.to('.hero-line-inner', { y: '0%', duration: 8, stagger: 2, ease: 'power3.out' }, 48);
    heroTl.to('.hero-sub', { opacity: 1, duration: 5 }, 54);
    heroTl.to('.btn-magnetic', { opacity: 1, duration: 5 }, 56);

    // ---- PHASE 5 (58-74): HERO TEXT DISPLAY + GENTLE ORBIT ----
    heroTl.to(scrollState, { rotationY: Math.PI * 1.6, duration: 16, ease: 'none' }, 58);
    heroTl.to(scrollState, { cameraZ: 6.5, cameraY: 0.4, duration: 16, ease: 'power1.inOut' }, 58);

    // ---- PHASE 6 (74-86): EXIT ----
    heroTl.to('.hero-tag', { opacity: 0, duration: 3 }, 74);
    heroTl.to('.hero-line-inner', { y: '110%', duration: 5, stagger: 1, ease: 'power2.in' }, 74);
    heroTl.to('.hero-sub', { opacity: 0, duration: 3 }, 75);
    heroTl.to('.btn-magnetic', { opacity: 0, duration: 3 }, 75);
    heroTl.to(scrollState, { laptopScale: isMobile ? 0.3 : 0.5, laptopX: 3.5, duration: 10, ease: 'power2.in' }, 76);
    heroTl.to(scrollState, { phoneArc: 0, duration: 10, ease: 'power2.in' }, 77);
    heroTl.to(scrollState, { tabletArc: 0, duration: 10, ease: 'power2.in' }, 77);
    heroTl.to(screenLight, { intensity: 0, duration: 8 }, 77);
    // Scroll indicator visibility is controlled by main.js (visible at load, fades on scroll)

    // ========================================
    // GLOBE SCROLL TRIGGERS (post-hero)
    // ========================================
    ScrollTrigger.create({
        trigger: '#about', start: 'top 80%', end: 'bottom 20%',
        onEnter: function () {
            scrollState.globeVisible = true; globe.visible = true;
            gsap.to(scrollState, { globeScale: 1, duration: 1.5, ease: 'power3.out' });
        },
        onLeaveBack: function () {
            gsap.to(scrollState, { globeScale: 0, duration: 0.8, ease: 'power2.in',
                onComplete: function () { scrollState.globeVisible = false; globe.visible = false; }
            });
        }
    });
    ScrollTrigger.create({
        trigger: '#services', start: 'bottom 30%',
        onEnter: function () {
            gsap.to(scrollState, { globeScale: 0, duration: 1.0, ease: 'power2.in',
                onComplete: function () { scrollState.globeVisible = false; globe.visible = false; }
            });
        },
        onLeaveBack: function () {
            scrollState.globeVisible = true; globe.visible = true;
            gsap.to(scrollState, { globeScale: 1, duration: 1.0, ease: 'power3.out' });
        }
    });

    // ========================================
    // MOUSE PARALLAX
    // ========================================
    var mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    document.addEventListener('mousemove', function (e) {
        mouse.tx = (e.clientX / window.innerWidth - 0.5) * 0.2;
        mouse.ty = (e.clientY / window.innerHeight - 0.5) * 0.08;
    });

    // ========================================
    // RENDER LOOP
    // ========================================
    var clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        if (document.hidden) return;

        var dt = clock.getDelta();
        var time = clock.getElapsedTime();

        mouse.x += (mouse.tx - mouse.x) * 0.03;
        mouse.y += (mouse.ty - mouse.y) * 0.03;

        // Laptop transform
        laptop.rotation.y = scrollState.rotationY + mouse.x;
        laptop.position.x = scrollState.laptopX;
        laptop.position.y = -0.3 + Math.sin(time * 0.5) * 0.012;
        laptop.scale.setScalar(scrollState.laptopScale);
        lidGroup.rotation.x = scrollState.lidAngle;


        // ---- PHONE ARC TRAJECTORY (enters from LEFT, meets at center) ----
        var arcT = scrollState.phoneArc;
        if (arcT > 0.01) {
            var sX = -7, sY = -4, cX = -2.8, cY = 1.4;
            var eX = isMobile ? -1.1 : -1.8, eY = isMobile ? -0.1 : 0.2;
            phone.position.x = (1 - arcT) * (1 - arcT) * sX + 2 * (1 - arcT) * arcT * cX + arcT * arcT * eX;
            phone.position.y = (1 - arcT) * (1 - arcT) * sY + 2 * (1 - arcT) * arcT * cY + arcT * arcT * eY;
            phone.position.y += Math.sin(time * 0.3 + 1) * 0.015;
            // Subtle entry rotation: starts spinning, settles
            phone.rotation.y = 0.15 * arcT + (1 - arcT) * Math.PI * 0.4 + mouse.x * 0.3;
            // Scale from 0 → 1 with overshoot
            var phScale = arcT < 1 ? Math.min(1, arcT * 1.15) : 1;
            phone.scale.setScalar(phScale);
            phone.visible = true;
        } else {
            phone.position.set(-5, -3, 0);
            phone.scale.setScalar(0);
            phone.visible = false;
        }

        // ---- TABLET ARC TRAJECTORY (enters from RIGHT, meets at center) ----
        var tabT = scrollState.tabletArc;
        if (tabT > 0.01) {
            var tsX = 7, tsY = 3.5, tcX = 2.5, tcY = 1.6;
            var teX = isMobile ? 1.0 : 1.8, teY = isMobile ? 1.2 : 0.3;
            tablet.position.x = (1 - tabT) * (1 - tabT) * tsX + 2 * (1 - tabT) * tabT * tcX + tabT * tabT * teX;
            tablet.position.y = (1 - tabT) * (1 - tabT) * tsY + 2 * (1 - tabT) * tabT * tcY + tabT * tabT * teY;
            tablet.position.y += Math.sin(time * 0.25 + 2) * 0.012;
            tablet.position.z = 1.0 * tabT;
            // Entry rotation that settles
            tablet.rotation.y = -0.1 * tabT + (1 - tabT) * -Math.PI * 0.3 + mouse.x * 0.25;
            tablet.rotation.x = -0.02;
            tablet.rotation.z = (1 - tabT) * 0.15;
            // Scale from 0 → 1
            var tbScale = tabT < 1 ? Math.min(1, tabT * 1.15) : 1;
            tablet.scale.setScalar(tbScale);
            tablet.visible = true;
        } else {
            tablet.position.set(5, -4, 1);
            tablet.scale.setScalar(0);
            tablet.visible = false;
        }

        // Camera
        camera.position.z = scrollState.cameraZ;
        camera.position.y = scrollState.cameraY + mouse.y;
        camera.position.x = scrollState.cameraX;
        camera.lookAt(scrollState.laptopX * 0.3, 0, 0);

        // Globe
        if (scrollState.globeVisible) {
            globe.scale.setScalar(scrollState.globeScale);
            globe.rotation.y += 0.003;
            ring1.rotation.z += 0.004; ring2.rotation.z -= 0.003; ring3.rotation.z += 0.006;
            for (var ei = 0; ei < electrons.length; ei++) {
                var el = electrons[ei];
                var angle = time * el.userData.speed + el.userData.offset;
                var ringRef = ei === 0 ? ring1 : ei === 1 ? ring2 : ring3;
                var radius = ei === 0 ? 1.35 : ei === 1 ? 1.25 : 1.5;
                el.position.set(radius * Math.cos(angle), radius * Math.sin(angle) * Math.cos(ringRef.rotation.x), radius * Math.sin(angle) * Math.sin(ringRef.rotation.x));
                el.material.opacity = 0.5 + Math.sin(time * 3 + ei) * 0.3;
            }
            for (var di = 0; di < connectionDots.length; di++) connectionDots[di].material.opacity = 0.3 + Math.sin(time * 2 + di * 0.5) * 0.3;
        }

        // Floating shapes
        for (var si = 0; si < floatingShapes.length; si++) {
            var sh = floatingShapes[si];
            sh.rotation.x += sh.userData.speed * 0.005;
            sh.rotation.y += sh.userData.speed * 0.008;
            sh.position.y = sh.userData.baseY + Math.sin(time * sh.userData.speed + si * 2) * 0.15;
        }

        // Scrollable screen updates (only when scroll offset changes)
        if (scrollState.screenPowered && scrollState.screenScroll !== lastLaptopScroll) {
            renderLaptopScreen(scrollState.screenScroll);
            lastLaptopScroll = scrollState.screenScroll;
        }
        if (scrollState.phoneArc > 0.01) {
            renderPhoneScreen(scrollState.phoneScroll, time);
        }
        if (scrollState.tabletArc > 0.01) {
            renderTabletScreen(scrollState.tabletScroll, time);
        }

        // Particles
        var pp = particles.geometry.attributes.position.array;
        for (var i = 0; i < PARTICLE_COUNT * 3; i += 3) { pp[i + 1] -= 0.003; if (pp[i + 1] < -9) pp[i + 1] = 9; }
        particles.geometry.attributes.position.needsUpdate = true;
        particles.rotation.y = time * 0.015;

        renderer.render(scene, camera);
    }

    animate();

    // ========================================
    // RESIZE
    // ========================================
    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.fov = window.innerWidth < 768 ? 50 : 35;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.ideepScene = { laptop: laptop, phone: phone, tablet: tablet, globe: globe, camera: camera, scrollState: scrollState };
})();
