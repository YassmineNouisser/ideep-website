/* ============================================
   IDeep — Apple-quality 3D Scene
   Laptop + Smartphone + Floating Shapes
   Multi-phase scroll-driven animation
   ============================================ */
(function () {
    var canvas = document.getElementById('scene-canvas');
    if (!canvas || !window.THREE) return;

    var isMobile = window.innerWidth < 768;

    // ========================================
    // RENDERER
    // ========================================
    var renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isMobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // ========================================
    // SCENE & CAMERA
    // ========================================
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
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
        color: 0x303034, metalness: 0.92, roughness: 0.15,
        clearcoat: 0.7, clearcoatRoughness: 0.12, envMap: envMap, envMapIntensity: 1.6
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
        color: 0x000000, metalness: 0, roughness: 0.05, transparent: true, opacity: 0.04,
        clearcoat: 1.0, clearcoatRoughness: 0.03, envMap: envMap, envMapIntensity: 0.7, depthWrite: false
    });

    // Phone materials
    var phoneMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x1c1c1e, metalness: 0.9, roughness: 0.12,
        clearcoat: 0.8, clearcoatRoughness: 0.1, envMap: envMap, envMapIntensity: 1.8
    });

    // Floating shapes material
    var shapeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x2D9CDB, metalness: 0.3, roughness: 0.4, transparent: true, opacity: 0.15,
        wireframe: true
    });
    var shapeGlowMat = new THREE.MeshPhysicalMaterial({
        color: 0x3AAFFF, metalness: 0.1, roughness: 0.3, transparent: true, opacity: 0.08,
        envMap: envMap, envMapIntensity: 0.5
    });

    // ========================================
    // LAPTOP SCREEN CANVAS
    // ========================================
    var screenCanvas = document.createElement('canvas');
    screenCanvas.width = 1024; screenCanvas.height = 640;
    var screenCtx = screenCanvas.getContext('2d');
    var screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.colorSpace = THREE.SRGBColorSpace;
    var screenMaterial = new THREE.MeshBasicMaterial({ map: screenTexture, toneMapped: false });
    var screenOffMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

    // ========================================
    // PHONE SCREEN CANVAS
    // ========================================
    var phoneScreenCanvas = document.createElement('canvas');
    phoneScreenCanvas.width = 512; phoneScreenCanvas.height = 1024;
    var phoneCtx = phoneScreenCanvas.getContext('2d');
    var phoneTexture = new THREE.CanvasTexture(phoneScreenCanvas);
    phoneTexture.colorSpace = THREE.SRGBColorSpace;
    var phoneScreenMat = new THREE.MeshBasicMaterial({ map: phoneTexture, toneMapped: false });
    var phoneScreenOffMat = new THREE.MeshBasicMaterial({ color: 0x000000 });

    // ========================================
    // LAPTOP SCREEN CONTENT (VS Code IDE)
    // ========================================
    var screenOn = false;
    var typingProgress = 0;

    var codeLines = [
        { indent: 0, tokens: [{ t: 'import', c: '#c586c0' }, { t: ' { useState, useEffect } ', c: '#9cdcfe' }, { t: 'from', c: '#c586c0' }, { t: " 'react'", c: '#ce9178' }, { t: ';', c: '#d4d4d4' }] },
        { indent: 0, tokens: [{ t: 'import', c: '#c586c0' }, { t: ' axios ', c: '#9cdcfe' }, { t: 'from', c: '#c586c0' }, { t: " 'axios'", c: '#ce9178' }, { t: ';', c: '#d4d4d4' }] },
        { indent: 0, tokens: [] },
        { indent: 0, tokens: [{ t: 'interface', c: '#569cd6' }, { t: ' Project ', c: '#4ec9b0' }, { t: '{', c: '#d4d4d4' }] },
        { indent: 1, tokens: [{ t: 'id', c: '#9cdcfe' }, { t: ': ', c: '#d4d4d4' }, { t: 'string', c: '#4ec9b0' }, { t: ';', c: '#d4d4d4' }] },
        { indent: 1, tokens: [{ t: 'title', c: '#9cdcfe' }, { t: ': ', c: '#d4d4d4' }, { t: 'string', c: '#4ec9b0' }, { t: ';', c: '#d4d4d4' }] },
        { indent: 1, tokens: [{ t: 'status', c: '#9cdcfe' }, { t: ': ', c: '#d4d4d4' }, { t: "'active'", c: '#ce9178' }, { t: ' | ', c: '#d4d4d4' }, { t: "'done'", c: '#ce9178' }, { t: ';', c: '#d4d4d4' }] },
        { indent: 0, tokens: [{ t: '}', c: '#d4d4d4' }] },
        { indent: 0, tokens: [] },
        { indent: 0, tokens: [{ t: 'const', c: '#569cd6' }, { t: ' Dashboard', c: '#dcdcaa' }, { t: ': React.FC = () => {', c: '#d4d4d4' }] },
        { indent: 1, tokens: [{ t: 'const', c: '#569cd6' }, { t: ' [projects, setProjects] = ', c: '#9cdcfe' }, { t: 'useState', c: '#dcdcaa' }, { t: '<Project[]>([]);', c: '#d4d4d4' }] },
        { indent: 1, tokens: [{ t: 'const', c: '#569cd6' }, { t: ' [loading, setLoading] = ', c: '#9cdcfe' }, { t: 'useState', c: '#dcdcaa' }, { t: '(', c: '#d4d4d4' }, { t: 'true', c: '#569cd6' }, { t: ');', c: '#d4d4d4' }] },
        { indent: 0, tokens: [] },
        { indent: 1, tokens: [{ t: 'useEffect', c: '#dcdcaa' }, { t: '(() => {', c: '#d4d4d4' }] },
        { indent: 2, tokens: [{ t: 'const', c: '#569cd6' }, { t: ' fetchData = ', c: '#9cdcfe' }, { t: 'async', c: '#569cd6' }, { t: ' () => {', c: '#d4d4d4' }] },
        { indent: 3, tokens: [{ t: 'try', c: '#c586c0' }, { t: ' {', c: '#d4d4d4' }] },
        { indent: 4, tokens: [{ t: 'const', c: '#569cd6' }, { t: ' res = ', c: '#9cdcfe' }, { t: 'await', c: '#c586c0' }, { t: ' axios.', c: '#9cdcfe' }, { t: 'get', c: '#dcdcaa' }, { t: '(', c: '#d4d4d4' }, { t: "'/api/projects'", c: '#ce9178' }, { t: ');', c: '#d4d4d4' }] },
        { indent: 4, tokens: [{ t: 'setProjects', c: '#dcdcaa' }, { t: '(res.data);', c: '#d4d4d4' }] },
        { indent: 3, tokens: [{ t: '} ', c: '#d4d4d4' }, { t: 'catch', c: '#c586c0' }, { t: ' (err) {', c: '#d4d4d4' }] },
        { indent: 4, tokens: [{ t: 'console', c: '#9cdcfe' }, { t: '.', c: '#d4d4d4' }, { t: 'error', c: '#dcdcaa' }, { t: '(', c: '#d4d4d4' }, { t: "'Error:'", c: '#ce9178' }, { t: ', err);', c: '#d4d4d4' }] },
        { indent: 3, tokens: [{ t: '} ', c: '#d4d4d4' }, { t: 'finally', c: '#c586c0' }, { t: ' {', c: '#d4d4d4' }] },
        { indent: 4, tokens: [{ t: 'setLoading', c: '#dcdcaa' }, { t: '(', c: '#d4d4d4' }, { t: 'false', c: '#569cd6' }, { t: ');', c: '#d4d4d4' }] },
        { indent: 3, tokens: [{ t: '}', c: '#d4d4d4' }] },
        { indent: 2, tokens: [{ t: '};', c: '#d4d4d4' }] },
        { indent: 2, tokens: [{ t: 'fetchData', c: '#dcdcaa' }, { t: '();', c: '#d4d4d4' }] },
        { indent: 1, tokens: [{ t: '}, []);', c: '#d4d4d4' }] },
        { indent: 0, tokens: [] },
        { indent: 1, tokens: [{ t: 'return', c: '#c586c0' }, { t: ' (', c: '#d4d4d4' }] },
        { indent: 2, tokens: [{ t: '<', c: '#808080' }, { t: 'div', c: '#569cd6' }, { t: ' className=', c: '#9cdcfe' }, { t: '"dashboard"', c: '#ce9178' }, { t: '>', c: '#808080' }] },
        { indent: 3, tokens: [{ t: '{projects.', c: '#9cdcfe' }, { t: 'map', c: '#dcdcaa' }, { t: '(p => (', c: '#d4d4d4' }] },
        { indent: 4, tokens: [{ t: '<', c: '#808080' }, { t: 'ProjectCard', c: '#4ec9b0' }, { t: ' key=', c: '#9cdcfe' }, { t: '{p.id}', c: '#9cdcfe' }, { t: ' />', c: '#808080' }] },
        { indent: 3, tokens: [{ t: '))}', c: '#d4d4d4' }] },
        { indent: 2, tokens: [{ t: '</', c: '#808080' }, { t: 'div', c: '#569cd6' }, { t: '>', c: '#808080' }] },
        { indent: 1, tokens: [{ t: ');', c: '#d4d4d4' }] },
        { indent: 0, tokens: [{ t: '};', c: '#d4d4d4' }] }
    ];

    var fileTree = [
        { name: 'src', isFolder: true, depth: 0 },
        { name: 'components', isFolder: true, depth: 1 },
        { name: 'Dashboard.tsx', isFolder: false, depth: 2, active: true },
        { name: 'ProjectCard.tsx', isFolder: false, depth: 2 },
        { name: 'Sidebar.tsx', isFolder: false, depth: 2 },
        { name: 'hooks', isFolder: true, depth: 1 },
        { name: 'useProjects.ts', isFolder: false, depth: 2 },
        { name: 'services', isFolder: true, depth: 1 },
        { name: 'api.ts', isFolder: false, depth: 2 },
        { name: 'package.json', isFolder: false, depth: 0 },
        { name: 'tsconfig.json', isFolder: false, depth: 0 }
    ];

    var terminalLines = [
        { t: '~/ideep $ ', c: '#4ec9b0', cmd: 'npm run dev', cc: '#d4d4d4' },
        { t: '  VITE v5.1.4  ready in ', c: '#6a9955', val: '312ms', vc: '#d4d4d4' },
        { t: '  -> Local:   ', c: '#808080', val: 'http://localhost:3000/', vc: '#569cd6' }
    ];

    function drawLaptopScreen(powered) {
        var ctx = screenCtx;
        var w = screenCanvas.width, h = screenCanvas.height;

        if (!powered) {
            ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h);
            screenTexture.needsUpdate = true; return;
        }

        ctx.fillStyle = '#1e1e1e'; ctx.fillRect(0, 0, w, h);

        var titleBarH = 28, menuBarH = 22, sidebarW = 180, statusBarH = 22, terminalH = 80;
        var lineNumW = 36, codeLeft = sidebarW + lineNumW;
        var codeTop = titleBarH + menuBarH, codeAreaH = h - codeTop - terminalH - statusBarH;
        var lineH = 16, fontSize = 11;
        var visibleLines = Math.floor(typingProgress * codeLines.length);

        // Title bar
        ctx.fillStyle = '#323233'; ctx.fillRect(0, 0, w, titleBarH);
        var dotY = titleBarH / 2;
        var dots = ['#ff5f57', '#febc2e', '#28c840'];
        for (var di = 0; di < 3; di++) {
            ctx.beginPath(); ctx.arc(16 + di * 20, dotY, 5.5, 0, Math.PI * 2);
            ctx.fillStyle = dots[di]; ctx.fill();
        }
        ctx.fillStyle = '#999'; ctx.font = '11px monospace';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('Dashboard.tsx - IDeep', w / 2, dotY); ctx.textAlign = 'left';

        // Menu bar
        ctx.fillStyle = '#2d2d2d'; ctx.fillRect(0, titleBarH, w, menuBarH);
        ctx.fillStyle = '#bbb'; ctx.font = '10px sans-serif';
        var menus = ['File', 'Edit', 'View', 'Go', 'Run', 'Terminal'];
        var mx = 12;
        for (var mi = 0; mi < menus.length; mi++) {
            ctx.fillText(menus[mi], mx, titleBarH + menuBarH / 2 + 3);
            mx += ctx.measureText(menus[mi]).width + 14;
        }

        // Sidebar
        ctx.fillStyle = '#252526'; ctx.fillRect(0, codeTop, sidebarW, h - codeTop - statusBarH);
        ctx.fillStyle = '#bbb'; ctx.font = 'bold 10px sans-serif';
        ctx.fillText('EXPLORER', 12, codeTop + 16);
        ctx.font = '11px monospace';
        var ftY = codeTop + 34;
        for (var fi = 0; fi < fileTree.length; fi++) {
            var fe = fileTree[fi], feX = 12 + fe.depth * 14;
            if (fe.active) { ctx.fillStyle = '#094771'; ctx.fillRect(0, ftY - 9, sidebarW, 18); }
            if (fe.isFolder) {
                ctx.fillStyle = '#dcb67a'; ctx.font = '10px sans-serif'; ctx.fillText('\u25BC', feX, ftY + 1);
                ctx.font = '11px monospace'; ctx.fillStyle = '#ccc'; ctx.fillText(' ' + fe.name, feX + 10, ftY + 1);
            } else {
                var ext = fe.name.split('.').pop();
                ctx.fillStyle = ext === 'css' ? '#56b3b4' : ext === 'json' ? '#cbcb41' : '#519aba';
                ctx.fillText('\u25CF', feX, ftY + 1);
                ctx.fillStyle = fe.active ? '#fff' : '#ccc'; ctx.fillText(' ' + fe.name, feX + 10, ftY + 1);
            }
            ftY += 20;
        }
        ctx.fillStyle = '#3c3c3c'; ctx.fillRect(sidebarW, codeTop, 1, h - codeTop - statusBarH);

        // Tab bar
        ctx.fillStyle = '#2d2d2d'; ctx.fillRect(sidebarW, codeTop, w - sidebarW, 26);
        ctx.fillStyle = '#1e1e1e'; ctx.fillRect(sidebarW, codeTop, 150, 26);
        ctx.fillStyle = '#fff'; ctx.font = '11px monospace';
        ctx.fillText('\u25CF Dashboard.tsx', sidebarW + 10, codeTop + 16);
        ctx.fillStyle = '#888'; ctx.fillText('  ProjectCard.tsx', sidebarW + 155, codeTop + 16);

        // Code lines
        var codeStartY = codeTop + 32;
        ctx.font = fontSize + 'px monospace';
        for (var li = 0; li < Math.min(visibleLines, codeLines.length); li++) {
            var line = codeLines[li], ly = codeStartY + li * lineH;
            if (ly > codeTop + codeAreaH) break;
            ctx.fillStyle = '#858585'; ctx.textAlign = 'right';
            ctx.fillText(String(li + 1), sidebarW + lineNumW - 6, ly); ctx.textAlign = 'left';
            if (li === 9) { ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.fillRect(codeLeft, ly - lineH + 5, w - codeLeft, lineH); }
            var tx = codeLeft + 8 + line.indent * 18;
            for (var ti = 0; ti < line.tokens.length; ti++) {
                ctx.fillStyle = line.tokens[ti].c; ctx.fillText(line.tokens[ti].t, tx, ly);
                tx += ctx.measureText(line.tokens[ti].t).width;
            }
        }

        // Cursor
        if (visibleLines > 0) {
            var cLine = Math.min(visibleLines - 1, codeLines.length - 1);
            var cY = codeStartY + cLine * lineH, curLn = codeLines[cLine];
            var cX = codeLeft + 8 + curLn.indent * 18;
            for (var ci = 0; ci < curLn.tokens.length; ci++) cX += ctx.measureText(curLn.tokens[ci].t).width;
            if ((Date.now() % 1000) < 500) { ctx.fillStyle = '#aeafad'; ctx.fillRect(cX, cY - lineH + 5, 2, lineH); }
        }

        // Terminal
        var termTop = h - terminalH - statusBarH;
        ctx.fillStyle = '#3c3c3c'; ctx.fillRect(sidebarW, termTop, w - sidebarW, 1);
        ctx.fillStyle = '#1a1a1a'; ctx.fillRect(sidebarW, termTop + 1, w - sidebarW, terminalH);
        ctx.fillStyle = '#2d2d2d'; ctx.fillRect(sidebarW, termTop + 1, w - sidebarW, 22);
        ctx.fillStyle = '#ccc'; ctx.font = '10px sans-serif'; ctx.fillText('TERMINAL', sidebarW + 12, termTop + 15);
        ctx.font = '11px monospace'; var tY = termTop + 38;
        for (var tl = 0; tl < terminalLines.length; tl++) {
            var tln = terminalLines[tl], tlx = sidebarW + 12;
            ctx.fillStyle = tln.c; ctx.fillText(tln.t, tlx, tY); tlx += ctx.measureText(tln.t).width;
            if (tln.cmd) { ctx.fillStyle = tln.cc; ctx.fillText(tln.cmd, tlx, tY); }
            if (tln.val) { ctx.fillStyle = tln.vc; ctx.fillText(tln.val, tlx, tY); }
            tY += 16;
        }

        // Status bar
        ctx.fillStyle = '#007acc'; ctx.fillRect(0, h - statusBarH, w, statusBarH);
        ctx.fillStyle = '#fff'; ctx.font = '10px sans-serif';
        ctx.fillText('  main*', 8, h - statusBarH / 2 + 4);
        ctx.fillText('TypeScript React | UTF-8 | Ln 10, Col 42', w - 280, h - statusBarH / 2 + 4);

        // Minimap
        ctx.fillStyle = '#2a2a2a'; ctx.fillRect(w - 48, codeTop + 26, 48, codeAreaH - 26);
        for (var mli = 0; mli < Math.min(visibleLines, codeLines.length); mli++) {
            var mlY = codeTop + 28 + mli * 3; if (mlY > codeTop + codeAreaH) break;
            var mlLen = 0; for (var mt = 0; mt < codeLines[mli].tokens.length; mt++) mlLen += codeLines[mli].tokens[mt].t.length;
            if (mlLen > 0) { ctx.fillStyle = 'rgba(200,200,200,0.12)'; ctx.fillRect(w - 46 + codeLines[mli].indent * 3, mlY, Math.min(mlLen * 1.2, 38), 2); }
        }

        screenTexture.needsUpdate = true;
    }

    // ========================================
    // PHONE SCREEN — Static IDeep App Interface
    // ========================================
    function drawPhoneScreen() {
        var ctx = phoneCtx, w = 512, h = 1024;

        // Background
        var grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#0c1a30'); grad.addColorStop(0.4, '#081422'); grad.addColorStop(1, '#060b14');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);

        // --- STATUS BAR ---
        ctx.fillStyle = '#fff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('10:42', w / 2, 26); ctx.textAlign = 'left';
        ctx.fillStyle = '#fff'; ctx.font = '11px sans-serif';
        ctx.fillText('\u25CF\u25CF\u25CF\u25CF', w - 75, 26);
        ctx.fillStyle = '#000'; ctx.beginPath(); ctx.roundRect(w / 2 - 52, 6, 104, 26, 13); ctx.fill();

        // --- HEADER ---
        ctx.fillStyle = '#2D9CDB'; ctx.font = 'bold 26px sans-serif';
        ctx.fillText('IDeep', 24, 74);
        ctx.fillStyle = '#5CB8E6'; ctx.font = '13px sans-serif';
        ctx.fillText('Mobile', 115, 74);
        // Avatar
        ctx.fillStyle = 'rgba(45,156,219,0.2)'; ctx.beginPath(); ctx.arc(w - 40, 64, 18, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(45,156,219,0.4)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(w - 40, 64, 18, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('Y', w - 40, 70); ctx.textAlign = 'left';
        // Notification badge
        ctx.fillStyle = '#ff3b30'; ctx.beginPath(); ctx.arc(w - 26, 52, 7, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('3', w - 26, 55); ctx.textAlign = 'left';

        // --- WELCOME BANNER ---
        var wcGrad = ctx.createLinearGradient(16, 95, w - 16, 190);
        wcGrad.addColorStop(0, '#1a3a5c'); wcGrad.addColorStop(1, '#0d2240');
        ctx.fillStyle = wcGrad; ctx.beginPath(); ctx.roundRect(16, 95, w - 32, 95, 16); ctx.fill();
        ctx.strokeStyle = 'rgba(45,156,219,0.3)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.roundRect(16, 95, w - 32, 95, 16); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 18px sans-serif';
        ctx.fillText('Bienvenue, Yassmine', 32, 126);
        ctx.fillStyle = '#94a3b8'; ctx.font = '12px sans-serif';
        ctx.fillText('3 projets actifs \u2022 12 t\u00e2ches en cours', 32, 148);
        // CTA button
        ctx.fillStyle = '#2D9CDB'; ctx.beginPath(); ctx.roundRect(32, 163, 110, 18, 9); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif';
        ctx.fillText('Nouveau projet +', 42, 176);

        // --- SERVICES (4 cards) ---
        ctx.fillStyle = '#fff'; ctx.font = 'bold 15px sans-serif';
        ctx.fillText('Nos Services', 24, 220);

        var services = [
            { icon: '\u2039/\u203A', label: 'Web Dev', color: '#2D9CDB', tags: 'React \u2022 Node.js' },
            { icon: '\u25B3', label: 'UI/UX', color: '#42A5F5', tags: 'Figma \u2022 Design' },
            { icon: '\u2606', label: 'IA & Data', color: '#5CB8E6', tags: 'Python \u2022 ML' },
            { icon: '\u25A3', label: 'Mobile', color: '#64B5F6', tags: 'Flutter \u2022 React N.' }
        ];
        var sGap = 12, sW = (w - sGap * 3) / 2, sH = 82, sY = 235;
        for (var si = 0; si < 4; si++) {
            var scol = si % 2, srow = Math.floor(si / 2);
            var sx = sGap + scol * (sW + sGap), sy = sY + srow * (sH + sGap);
            ctx.fillStyle = 'rgba(255,255,255,0.04)';
            ctx.beginPath(); ctx.roundRect(sx, sy, sW, sH, 12); ctx.fill();
            ctx.strokeStyle = services[si].color + '33'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.roundRect(sx, sy, sW, sH, 12); ctx.stroke();
            // Icon
            ctx.fillStyle = services[si].color + '25'; ctx.beginPath(); ctx.arc(sx + 28, sy + 28, 15, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = services[si].color; ctx.font = 'bold 13px monospace'; ctx.textAlign = 'center';
            ctx.fillText(services[si].icon, sx + 28, sy + 33); ctx.textAlign = 'left';
            ctx.fillStyle = '#fff'; ctx.font = 'bold 13px sans-serif';
            ctx.fillText(services[si].label, sx + 52, sy + 30);
            ctx.fillStyle = '#8892b0'; ctx.font = '10px sans-serif';
            ctx.fillText(services[si].tags, sx + 52, sy + 48);
            // Chevron
            ctx.fillStyle = '#5a6580'; ctx.font = '14px sans-serif';
            ctx.fillText('\u203A', sx + sW - 20, sy + 34);
            // Bottom accent bar
            ctx.fillStyle = services[si].color; ctx.beginPath(); ctx.roundRect(sx + 12, sy + sH - 6, sW - 24, 2, 1); ctx.fill();
        }

        // --- PROJETS RECENTS ---
        ctx.fillStyle = '#fff'; ctx.font = 'bold 15px sans-serif';
        ctx.fillText('Projets R\u00e9cents', 24, 432);
        ctx.fillStyle = '#2D9CDB'; ctx.font = '12px sans-serif';
        ctx.fillText('Voir tout \u2192', w - 100, 432);

        var projects = [
            { name: 'AZ Airlines', tag: 'Dashboard \u2022 Analytics', color: '#2D9CDB', pct: 100, status: 'Termin\u00e9' },
            { name: 'Eat & Fit', tag: 'Web App \u2022 Health', color: '#28c840', pct: 95, status: 'En cours' },
            { name: 'IBSAR Voice', tag: 'Accessibilit\u00e9 \u2022 Voice', color: '#42A5F5', pct: 88, status: 'En cours' },
            { name: 'Uniboard', tag: 'Education \u2022 IA', color: '#febc2e', pct: 72, status: 'Dev' }
        ];
        for (var pi = 0; pi < projects.length; pi++) {
            var py = 448 + pi * 74;
            ctx.fillStyle = 'rgba(255,255,255,0.03)';
            ctx.beginPath(); ctx.roundRect(16, py, w - 32, 62, 12); ctx.fill();
            // Icon
            ctx.fillStyle = projects[pi].color + '30'; ctx.beginPath(); ctx.roundRect(28, py + 10, 42, 42, 10); ctx.fill();
            ctx.fillStyle = projects[pi].color; ctx.font = 'bold 20px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(projects[pi].name.charAt(0), 49, py + 38); ctx.textAlign = 'left';
            // Text
            ctx.fillStyle = '#fff'; ctx.font = 'bold 13px sans-serif';
            ctx.fillText(projects[pi].name, 82, py + 28);
            ctx.fillStyle = '#8892b0'; ctx.font = '10px sans-serif';
            ctx.fillText(projects[pi].tag, 82, py + 44);
            // Status badge
            ctx.fillStyle = projects[pi].color + '20'; ctx.beginPath();
            ctx.roundRect(w - 90, py + 14, 60, 18, 9); ctx.fill();
            ctx.fillStyle = projects[pi].color; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(projects[pi].status, w - 60, py + 27); ctx.textAlign = 'left';
            // Progress bar
            ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.beginPath(); ctx.roundRect(82, py + 50, w - 130, 4, 2); ctx.fill();
            ctx.fillStyle = projects[pi].color; ctx.beginPath(); ctx.roundRect(82, py + 50, (w - 130) * projects[pi].pct / 100, 4, 2); ctx.fill();
        }

        // --- TEAM ROW ---
        ctx.fillStyle = '#fff'; ctx.font = 'bold 15px sans-serif';
        ctx.fillText('\u00c9quipe', 24, 762);
        ctx.fillStyle = '#8892b0'; ctx.font = '12px sans-serif';
        ctx.fillText('6 membres en ligne', 90, 762);

        var members = [
            { i: 'A', c: '#2D9CDB' }, { i: 'I', c: '#42A5F5' }, { i: 'J', c: '#5CB8E6' },
            { i: 'M', c: '#64B5F6' }, { i: 'Y', c: '#2D9CDB' }, { i: 'Y', c: '#42A5F5' }
        ];
        for (var mi = 0; mi < 6; mi++) {
            var mx = 40 + mi * 74;
            ctx.fillStyle = members[mi].c + '25'; ctx.beginPath(); ctx.arc(mx, 798, 22, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = members[mi].c; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(mx, 798, 22, 0, Math.PI * 2); ctx.stroke();
            ctx.fillStyle = '#fff'; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(members[mi].i, mx, 804); ctx.textAlign = 'left';
            ctx.fillStyle = '#28c840'; ctx.beginPath(); ctx.arc(mx + 15, 812, 5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#0c1a30'; ctx.strokeStyle = '#0c1a30'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(mx + 15, 812, 5, 0, Math.PI * 2); ctx.stroke();
            ctx.fillStyle = '#28c840'; ctx.beginPath(); ctx.arc(mx + 15, 812, 4, 0, Math.PI * 2); ctx.fill();
        }

        // --- FLOATING ACTION BUTTON ---
        ctx.fillStyle = '#2D9CDB'; ctx.beginPath(); ctx.arc(w - 50, 855, 24, 0, Math.PI * 2); ctx.fill();
        // Shadow
        ctx.shadowColor = 'rgba(45,156,219,0.4)'; ctx.shadowBlur = 15;
        ctx.fillStyle = '#2D9CDB'; ctx.beginPath(); ctx.arc(w - 50, 855, 24, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#fff'; ctx.font = 'bold 24px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('+', w - 50, 863); ctx.textAlign = 'left';

        // --- BOTTOM TAB BAR ---
        ctx.fillStyle = 'rgba(8,16,30,0.97)'; ctx.fillRect(0, h - 82, w, 82);
        ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(0, h - 82); ctx.lineTo(w, h - 82); ctx.stroke();
        var tabIcons = ['\u2302', '\u25A1', '\u2606', '\u263A'];
        var tabLabels = ['Accueil', 'Projets', 'Services', 'Profil'];
        for (var tti = 0; tti < 4; tti++) {
            var ttX = tti * (w / 4) + w / 8;
            ctx.fillStyle = tti === 0 ? '#2D9CDB' : '#5a6580';
            ctx.font = '20px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(tabIcons[tti], ttX, h - 50);
            ctx.font = tti === 0 ? 'bold 10px sans-serif' : '10px sans-serif';
            ctx.fillText(tabLabels[tti], ttX, h - 32);
            if (tti === 0) { ctx.fillStyle = '#2D9CDB'; ctx.beginPath(); ctx.arc(ttX, h - 22, 2.5, 0, Math.PI * 2); ctx.fill(); }
        }
        ctx.textAlign = 'left';
        // Home indicator
        ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.beginPath(); ctx.roundRect(w / 2 - 50, h - 8, 100, 4, 2); ctx.fill();

        phoneTexture.needsUpdate = true;
    }

    drawLaptopScreen(false);
    drawPhoneScreen();

    // ========================================
    // HELPERS
    // ========================================
    // roundRect polyfill for older browsers
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
    // BUILD LAPTOP (BoxGeometry — clean alignment)
    // ========================================
    var laptop = new THREE.Group();
    var lidGroup = new THREE.Group();

    var W = 3.0, D = 2.0, BASE_H = 0.06, LID_H = 0.04, BEZEL = 0.08;

    // BASE — simple box, bottom at y=0, top at y=BASE_H
    var baseMesh = new THREE.Mesh(new THREE.BoxGeometry(W, BASE_H, D), bodyMaterial);
    baseMesh.position.y = BASE_H / 2;
    baseMesh.castShadow = true; baseMesh.receiveShadow = true;
    laptop.add(baseMesh);

    // Bottom plate
    var bottomMesh = new THREE.Mesh(new THREE.BoxGeometry(W - 0.04, 0.003, D - 0.04), bottomMaterial);
    bottomMesh.position.y = 0.001;
    laptop.add(bottomMesh);

    // Rubber feet
    var footGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.012, 16);
    var footPos = [[-1.2, -0.006, -0.8], [1.2, -0.006, -0.8], [-1.2, -0.006, 0.8], [1.2, -0.006, 0.8]];
    for (var fi = 0; fi < 4; fi++) { var f = new THREE.Mesh(footGeo, rubberMaterial); f.position.set(footPos[fi][0], footPos[fi][1], footPos[fi][2]); laptop.add(f); }

    // Keyboard area
    var kbW = W - 0.4, kbD = D * 0.5;
    var kbMesh = new THREE.Mesh(new THREE.PlaneGeometry(kbW, kbD), keyMaterial);
    kbMesh.rotation.x = -Math.PI / 2; kbMesh.position.set(0, BASE_H + 0.001, -0.05);
    laptop.add(kbMesh);

    // Keys
    var keyGeo = new THREE.BoxGeometry(0.13, 0.002, 0.13);
    var keyCapMat = new THREE.MeshStandardMaterial({ color: 0x0d0d10, metalness: 0.3, roughness: 0.8 });
    for (var row = 0; row < 5; row++) {
        for (var col = 0; col < 14; col++) {
            var km = new THREE.Mesh(keyGeo, keyCapMat);
            km.position.set(-kbW / 2 + 0.12 + col * 0.17, BASE_H + 0.003, -0.05 - kbD / 2 + 0.12 + row * 0.17);
            laptop.add(km);
        }
    }

    // Trackpad
    var tpMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.6), trackpadMaterial);
    tpMesh.rotation.x = -Math.PI / 2; tpMesh.position.set(0, BASE_H + 0.0012, 0.55);
    laptop.add(tpMesh);

    // Hinge — cylinder at back edge, top of base
    var hingeLen = W * 0.7;
    var hingeGeo = new THREE.CylinderGeometry(0.022, 0.022, hingeLen, 24);
    hingeGeo.rotateZ(Math.PI / 2);
    var hingeMesh = new THREE.Mesh(hingeGeo, hingeMaterial);
    hingeMesh.position.set(0, BASE_H, -D / 2);
    laptop.add(hingeMesh);

    // === LID ===
    // Pivot at BACK-TOP edge of the base
    lidGroup.position.set(0, BASE_H, -D / 2);

    // Lid body — BoxGeometry, centered so back edge is at local z=0 (hinge)
    var lidMesh = new THREE.Mesh(new THREE.BoxGeometry(W, LID_H, D), bodyMaterial);
    lidMesh.position.set(0, LID_H / 2, D / 2);
    lidMesh.castShadow = true;
    lidGroup.add(lidMesh);

    // Screen bezel — inner face of lid (faces -Y, visible when open)
    var bezelMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(W - 0.02, D - 0.02),
        bezelMaterial
    );
    bezelMesh.rotation.x = Math.PI / 2;  // face -Y
    bezelMesh.position.set(0, -0.001, D / 2);
    lidGroup.add(bezelMesh);

    // Screen display — slightly inset from bezel
    var scrW = W - BEZEL * 2, scrD = D - BEZEL * 2 - 0.04;
    var screenGeo = new THREE.PlaneGeometry(scrW, scrD);
    var screenMesh = new THREE.Mesh(screenGeo, screenOffMaterial);
    screenMesh.rotation.x = Math.PI / 2;  // face -Y
    screenMesh.position.set(0, -0.002, D / 2);
    lidGroup.add(screenMesh);

    // Glass overlay
    var glassMesh = new THREE.Mesh(new THREE.PlaneGeometry(scrW + 0.01, scrD + 0.01), screenGlassMaterial);
    glassMesh.rotation.x = Math.PI / 2;
    glassMesh.position.set(0, -0.003, D / 2);
    glassMesh.renderOrder = 1;
    lidGroup.add(glassMesh);

    // Screen glow (additive plane — pulses when screen turns on)
    var glowMat = new THREE.MeshBasicMaterial({
        color: 0x2D9CDB, transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
    });
    var glowMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 2.5), glowMat);
    glowMesh.rotation.x = Math.PI / 2;
    glowMesh.position.set(0, -0.05, D / 2);
    lidGroup.add(glowMesh);

    // Camera dot + LED
    var camLedMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0 });
    var camDot = new THREE.Mesh(new THREE.CircleGeometry(0.012, 16), new THREE.MeshBasicMaterial({ color: 0x1a1a2e }));
    camDot.rotation.x = Math.PI / 2;
    camDot.position.set(0, -0.003, BEZEL * 0.6);
    lidGroup.add(camDot);
    var camLed = new THREE.Mesh(new THREE.CircleGeometry(0.004, 8), camLedMat);
    camLed.rotation.x = Math.PI / 2;
    camLed.position.set(0.025, -0.003, BEZEL * 0.6);
    lidGroup.add(camLed);

    // Logo on outer face (+Y when closed)
    var logoMesh = new THREE.Mesh(new THREE.CircleGeometry(0.15, 32), new THREE.MeshPhysicalMaterial({
        color: 0x3a3a42, metalness: 1.0, roughness: 0.08, envMap: envMap, envMapIntensity: 2.2
    }));
    logoMesh.rotation.x = -Math.PI / 2;
    logoMesh.position.set(0, LID_H + 0.001, D / 2);
    lidGroup.add(logoMesh);

    // Start closed
    lidGroup.rotation.x = 0;
    laptop.add(lidGroup);

    scene.add(laptop);
    laptop.position.y = -0.3;

    // ========================================
    // BUILD SMARTPHONE (BoxGeometry — reliable)
    // ========================================
    var phone = new THREE.Group();
    var PW = 0.38, PH = 0.78, PT = 0.035;

    // Phone body — simple box centered at origin
    var phoneBodyGeo = new THREE.BoxGeometry(PW, PH, PT);
    var phoneBody = new THREE.Mesh(phoneBodyGeo, phoneMaterial);
    phoneBody.position.z = 0; // centered: back at -PT/2, front at +PT/2
    phone.add(phoneBody);

    // Phone screen — sits on front face (z = PT/2 + tiny offset)
    var pScrW = PW - 0.02, pScrH = PH - 0.04;
    var phoneScreenGeo = new THREE.PlaneGeometry(pScrW, pScrH);
    var phoneScreen = new THREE.Mesh(phoneScreenGeo, phoneScreenMat);
    phoneScreen.position.z = PT / 2 + 0.002;
    phoneScreen.renderOrder = 2;
    phone.add(phoneScreen);

    // Phone glass overlay
    var phoneGlass = new THREE.Mesh(new THREE.PlaneGeometry(pScrW + 0.005, pScrH + 0.005), screenGlassMaterial);
    phoneGlass.position.z = PT / 2 + 0.003;
    phoneGlass.renderOrder = 3;
    phone.add(phoneGlass);

    // Thin bezel frame (slightly larger box behind body)
    var phoneFrameGeo = new THREE.BoxGeometry(PW + 0.006, PH + 0.006, PT + 0.004);
    var phoneFrameMat = new THREE.MeshPhysicalMaterial({
        color: 0x2a2a32, metalness: 0.95, roughness: 0.1, envMap: envMap, envMapIntensity: 1.5
    });
    var phoneFrame = new THREE.Mesh(phoneFrameGeo, phoneFrameMat);
    phoneFrame.renderOrder = 0;
    phone.add(phoneFrame);

    // Camera bump (back)
    var camBump = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 0.008, 16),
        new THREE.MeshPhysicalMaterial({ color: 0x1a1a20, metalness: 0.9, roughness: 0.2, envMap: envMap })
    );
    camBump.rotation.x = Math.PI / 2;
    camBump.position.set(-PW / 2 + 0.06, PH / 2 - 0.06, -PT / 2 - 0.004);
    phone.add(camBump);

    // Position phone (starts hidden off-screen, moved by arc in render loop)
    phone.position.set(4, -3, 0);
    phone.rotation.y = 0;
    phone.scale.set(2.2, 2.2, 2.2);
    scene.add(phone);

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
        sm.userData.speed = sc.speed;
        sm.userData.baseY = sc.pos[1];
        scene.add(sm);
        floatingShapes.push(sm);
    }

    // ========================================
    // HOLOGRAPHIC GLOBE
    // ========================================
    var globe = new THREE.Group();

    // Wireframe sphere
    var globeWireGeo = new THREE.IcosahedronGeometry(1.0, 2);
    var globeWireMat = new THREE.MeshBasicMaterial({
        color: 0x2D9CDB, wireframe: true, transparent: true, opacity: 0.12
    });
    var globeWire = new THREE.Mesh(globeWireGeo, globeWireMat);
    globe.add(globeWire);

    // Inner subtle glow sphere
    var globeInnerMat = new THREE.MeshPhysicalMaterial({
        color: 0x0a1a3a, metalness: 0.1, roughness: 0.9,
        transparent: true, opacity: 0.2, envMap: envMap, envMapIntensity: 0.3
    });
    var globeInner = new THREE.Mesh(new THREE.SphereGeometry(0.95, 32, 32), globeInnerMat);
    globe.add(globeInner);

    // Orbital ring 1
    var ring1Mat = new THREE.MeshBasicMaterial({ color: 0x3AAFFF, transparent: true, opacity: 0.25 });
    var ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.008, 8, 100), ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 8;
    globe.add(ring1);

    // Orbital ring 2
    var ring2Mat = new THREE.MeshBasicMaterial({ color: 0x5CB8E6, transparent: true, opacity: 0.18 });
    var ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.006, 8, 80), ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 5;
    globe.add(ring2);

    // Orbital ring 3 (thin, fast)
    var ring3Mat = new THREE.MeshBasicMaterial({ color: 0x64B5F6, transparent: true, opacity: 0.12 });
    var ring3 = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.004, 8, 120), ring3Mat);
    ring3.rotation.x = Math.PI / 6;
    ring3.rotation.y = -Math.PI / 3;
    globe.add(ring3);

    // Connection points on surface
    var dotGeo = new THREE.SphereGeometry(0.025, 8, 8);
    var connectionDots = [];
    for (var gi = 0; gi < 24; gi++) {
        var phi = Math.acos(2 * Math.random() - 1);
        var theta = Math.random() * Math.PI * 2;
        var dotMat = new THREE.MeshBasicMaterial({
            color: gi % 3 === 0 ? 0x3AAFFF : gi % 3 === 1 ? 0x5CB8E6 : 0x2D9CDB,
            transparent: true, opacity: 0.6
        });
        var dot = new THREE.Mesh(dotGeo, dotMat);
        dot.position.set(
            1.0 * Math.sin(phi) * Math.cos(theta),
            1.0 * Math.sin(phi) * Math.sin(theta),
            1.0 * Math.cos(phi)
        );
        dot.userData.phi = phi;
        dot.userData.theta = theta;
        globe.add(dot);
        connectionDots.push(dot);
    }

    // Connection lines between some dots
    var lineMat = new THREE.LineBasicMaterial({ color: 0x2D9CDB, transparent: true, opacity: 0.08 });
    for (var li = 0; li < 12; li++) {
        var d1 = connectionDots[li % connectionDots.length];
        var d2 = connectionDots[(li + 3) % connectionDots.length];
        var lineGeo = new THREE.BufferGeometry().setFromPoints([d1.position.clone(), d2.position.clone()]);
        globe.add(new THREE.Line(lineGeo, lineMat));
    }

    // Orbiting electron-like particles
    var electronGeo = new THREE.SphereGeometry(0.035, 8, 8);
    var electrons = [];
    for (var ei = 0; ei < 3; ei++) {
        var eMat = new THREE.MeshBasicMaterial({ color: 0x3AAFFF, transparent: true, opacity: 0.8 });
        var electron = new THREE.Mesh(electronGeo, eMat);
        electron.userData.ringIdx = ei;
        electron.userData.speed = 0.4 + ei * 0.15;
        electron.userData.offset = ei * Math.PI * 2 / 3;
        globe.add(electron);
        electrons.push(electron);
    }

    globe.position.set(2.5, 0.5, -2);
    globe.scale.setScalar(0);
    globe.visible = false;
    scene.add(globe);

    // ========================================
    // LIGHTING
    // ========================================
    var keyLight = new THREE.DirectionalLight(0xd4ccbb, 2.2);
    keyLight.position.set(3, 5, 4); keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(isMobile ? 512 : 1024, isMobile ? 512 : 1024);
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    var fillLight = new THREE.DirectionalLight(0x8899cc, 0.9);
    fillLight.position.set(-3, 3, -2); scene.add(fillLight);

    var rimLight = new THREE.DirectionalLight(0x3366cc, 1.4);
    rimLight.position.set(0, 2, -5); scene.add(rimLight);

    scene.add(new THREE.AmbientLight(0x151520, 0.35));

    var spotLight = new THREE.SpotLight(0xccccdd, 0.6);
    spotLight.position.set(0, 8, 2); spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.8; spotLight.decay = 2; scene.add(spotLight);

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
    // HOLOGRAPHIC CONTENT CARDS (emerge from screen)
    // ========================================
    var contentCards = [];
    var cardGroup = new THREE.Group();

    function createCardTexture(type) {
        var c = document.createElement('canvas');
        c.width = 512; c.height = 320;
        var ctx = c.getContext('2d');
        var grad = ctx.createLinearGradient(0, 0, 512, 320);

        if (type === 'stats') {
            grad.addColorStop(0, 'rgba(13, 27, 55, 0.95)');
            grad.addColorStop(1, 'rgba(8, 18, 38, 0.95)');
            ctx.fillStyle = grad; ctx.fillRect(0, 0, 512, 320);
            ctx.strokeStyle = 'rgba(45,156,219,0.5)'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.roundRect(1, 1, 510, 318, 8); ctx.stroke();
            ctx.fillStyle = '#2D9CDB'; ctx.font = 'bold 14px sans-serif';
            ctx.fillText('PROJECT METRICS', 24, 34);
            ctx.fillStyle = '#fff'; ctx.font = 'bold 48px sans-serif';
            ctx.fillText('4+', 40, 105); ctx.fillText('6', 195, 105); ctx.fillText('1.2K', 300, 105);
            ctx.fillStyle = '#8892b0'; ctx.font = '13px sans-serif';
            ctx.fillText('Projects', 40, 128); ctx.fillText('Members', 195, 128); ctx.fillText('Commits', 300, 128);
            ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(24, 155, 464, 6);
            ctx.fillStyle = '#2D9CDB'; ctx.fillRect(24, 155, 340, 6);
            var bars = [55, 75, 40, 90, 65, 80, 95];
            for (var i = 0; i < bars.length; i++) {
                ctx.fillStyle = 'rgba(45,156,219,0.25)';
                ctx.fillRect(35 + i * 64, 280 - bars[i], 44, bars[i]);
                ctx.fillStyle = '#2D9CDB';
                ctx.fillRect(35 + i * 64, 280 - bars[i], 44, 3);
            }
        } else if (type === 'code') {
            grad.addColorStop(0, 'rgba(20, 20, 30, 0.97)');
            grad.addColorStop(1, 'rgba(12, 14, 22, 0.97)');
            ctx.fillStyle = grad; ctx.fillRect(0, 0, 512, 320);
            ctx.strokeStyle = 'rgba(45,156,219,0.35)'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.roundRect(1, 1, 510, 318, 8); ctx.stroke();
            ctx.font = '13px monospace';
            var lines = [
                [{t:'const ',c:'#569cd6'},{t:'app = ',c:'#9cdcfe'},{t:'express',c:'#dcdcaa'},{t:'();',c:'#d4d4d4'}],
                [],
                [{t:'app.',c:'#9cdcfe'},{t:'get',c:'#dcdcaa'},{t:"('/api'",c:'#ce9178'},{t:', ',c:'#d4d4d4'},{t:'async',c:'#569cd6'},{t:' (req, res) => {',c:'#d4d4d4'}],
                [{t:'  const ',c:'#569cd6'},{t:'data = ',c:'#9cdcfe'},{t:'await ',c:'#c586c0'},{t:'fetchAll',c:'#dcdcaa'},{t:'();',c:'#d4d4d4'}],
                [{t:'  res.',c:'#9cdcfe'},{t:'json',c:'#dcdcaa'},{t:'({ success: ',c:'#d4d4d4'},{t:'true',c:'#569cd6'},{t:', data });',c:'#d4d4d4'}],
                [{t:'});',c:'#d4d4d4'}],
                [],
                [{t:'app.',c:'#9cdcfe'},{t:'listen',c:'#dcdcaa'},{t:'(3000, () => {',c:'#d4d4d4'}],
                [{t:'  console.',c:'#9cdcfe'},{t:'log',c:'#dcdcaa'},{t:"('Server ready');",c:'#ce9178'}],
                [{t:'});',c:'#d4d4d4'}]
            ];
            var ly = 36;
            for (var l = 0; l < lines.length; l++) {
                var lx = 30;
                ctx.fillStyle = '#555'; ctx.fillText(String(l + 1).padStart(2, ' '), 8, ly);
                for (var t = 0; t < lines[l].length; t++) {
                    ctx.fillStyle = lines[l][t].c; ctx.fillText(lines[l][t].t, lx, ly);
                    lx += ctx.measureText(lines[l][t].t).width;
                }
                ly += 28;
            }
        } else if (type === 'design') {
            grad.addColorStop(0, 'rgba(15, 22, 40, 0.95)');
            grad.addColorStop(1, 'rgba(8, 14, 30, 0.95)');
            ctx.fillStyle = grad; ctx.fillRect(0, 0, 512, 320);
            ctx.strokeStyle = 'rgba(92,184,230,0.45)'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.roundRect(1, 1, 510, 318, 8); ctx.stroke();
            ctx.fillStyle = '#5CB8E6'; ctx.font = 'bold 14px sans-serif';
            ctx.fillText('UI/UX DESIGN', 24, 34);
            ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.roundRect(185, 55, 140, 240, 12); ctx.stroke();
            ctx.fillStyle = 'rgba(45,156,219,0.3)'; ctx.fillRect(200, 85, 110, 18);
            ctx.fillStyle = 'rgba(45,156,219,0.2)'; ctx.fillRect(200, 112, 75, 10); ctx.fillRect(200, 128, 95, 10);
            ctx.fillStyle = 'rgba(45,156,219,0.15)'; ctx.fillRect(200, 155, 110, 55); ctx.fillRect(200, 220, 110, 35);
            var colors = ['#2D9CDB', '#42A5F5', '#5CB8E6', '#64B5F6', '#0a1628'];
            for (var ci = 0; ci < 5; ci++) { ctx.fillStyle = colors[ci]; ctx.beginPath(); ctx.arc(48 + ci * 26, 100, 9, 0, Math.PI * 2); ctx.fill(); }
            ctx.fillStyle = '#fff'; ctx.font = 'bold 20px sans-serif'; ctx.fillText('Aa', 30, 175);
            ctx.fillStyle = '#8892b0'; ctx.font = '11px sans-serif'; ctx.fillText('Syne Bold', 68, 170); ctx.fillText('Space Grotesk', 68, 185);
        } else if (type === 'data') {
            grad.addColorStop(0, 'rgba(10, 22, 45, 0.95)');
            grad.addColorStop(1, 'rgba(6, 14, 32, 0.95)');
            ctx.fillStyle = grad; ctx.fillRect(0, 0, 512, 320);
            ctx.strokeStyle = 'rgba(100,181,246,0.45)'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.roundRect(1, 1, 510, 318, 8); ctx.stroke();
            ctx.fillStyle = '#64B5F6'; ctx.font = 'bold 14px sans-serif'; ctx.fillText('DATA ANALYTICS', 24, 34);
            ctx.strokeStyle = '#2D9CDB'; ctx.lineWidth = 2.5; ctx.beginPath();
            var pts = [40,180, 100,140, 160,155, 220,100, 280,75, 340,90, 400,50, 460,65];
            ctx.moveTo(pts[0], pts[1]);
            for (var p = 2; p < pts.length; p += 2) ctx.lineTo(pts[p], pts[p + 1]);
            ctx.stroke();
            var cg = ctx.createLinearGradient(0, 50, 0, 200);
            cg.addColorStop(0, 'rgba(45,156,219,0.2)'); cg.addColorStop(1, 'rgba(45,156,219,0)');
            ctx.fillStyle = cg; ctx.lineTo(460, 200); ctx.lineTo(40, 200); ctx.closePath(); ctx.fill();
            for (var dp = 0; dp < pts.length; dp += 2) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(pts[dp], pts[dp + 1], 3.5, 0, Math.PI * 2); ctx.fill(); }
            ctx.fillStyle = '#fff'; ctx.font = 'bold 28px sans-serif'; ctx.fillText('98.7%', 40, 260);
            ctx.fillStyle = '#28c840'; ctx.font = 'bold 14px sans-serif'; ctx.fillText('+12.3%', 165, 260);
            ctx.fillStyle = '#8892b0'; ctx.font = '12px sans-serif'; ctx.fillText('Accuracy Score', 40, 285);
        } else if (type === 'brand') {
            grad.addColorStop(0, 'rgba(8, 16, 35, 0.97)');
            grad.addColorStop(1, 'rgba(4, 10, 25, 0.97)');
            ctx.fillStyle = grad; ctx.fillRect(0, 0, 512, 320);
            ctx.strokeStyle = 'rgba(45,156,219,0.55)'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.roundRect(1, 1, 510, 318, 8); ctx.stroke();
            ctx.fillStyle = '#2D9CDB'; ctx.font = 'bold 56px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText('IDeep', 256, 125);
            ctx.fillStyle = '#8892b0'; ctx.font = '15px sans-serif'; ctx.fillText('We Build Digital Experiences', 256, 160);
            ctx.fillStyle = 'rgba(45,156,219,0.3)'; ctx.fillRect(156, 180, 200, 1);
            ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '12px sans-serif';
            ctx.fillText('Development  \u2022  Design  \u2022  AI  \u2022  Mobile', 256, 210);
            ctx.textAlign = 'left';
        }
        var tex = new THREE.CanvasTexture(c);
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
    }

    var cardTypes = ['stats', 'code', 'design', 'data', 'brand'];
    var cardTargets = [
        { x: -1.8, y: 1.2, z: 1.5, ry: 0.15, rx: -0.05 },
        { x: 1.8, y: 1.0, z: 1.8, ry: -0.2, rx: 0.05 },
        { x: -2.2, y: -0.5, z: 1.2, ry: 0.25, rx: 0.1 },
        { x: 2.0, y: -0.3, z: 1.0, ry: -0.15, rx: -0.08 },
        { x: 0, y: 1.8, z: 2.5, ry: 0, rx: -0.1 }
    ];

    for (var cci = 0; cci < cardTypes.length; cci++) {
        var cardTex = createCardTexture(cardTypes[cci]);
        var cardMat = new THREE.MeshBasicMaterial({
            map: cardTex, transparent: true, opacity: 0,
            side: THREE.DoubleSide, toneMapped: false, depthWrite: false
        });
        var cardMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.75), cardMat);
        cardMesh.position.set(0, 0, 0);
        cardMesh.userData.target = cardTargets[cci];
        cardMesh.userData.index = cci;
        cardGroup.add(cardMesh);
        contentCards.push(cardMesh);
    }

    cardGroup.visible = false;
    scene.add(cardGroup);

    // ========================================
    // SCROLL STATE
    // ========================================
    var scrollState = {
        progress: 0,
        rotationY: 0,
        lidAngle: 0,
        cameraZ: 2.5,
        cameraY: 3.0,
        cameraX: 0,
        laptopX: 0,
        laptopScale: 1,
        screenPowered: false,
        typingProgress: 0,
        // Phone arc (0 = offscreen, 1 = in position)
        phoneArc: 0,
        phoneScreenProgress: 0,
        // Content cards
        cardProgress: 0,
        cardOpacity: 0,
        // Screen glow
        glowIntensity: 0,
        // Globe
        globeScale: 0,
        globeVisible: false
    };

    // ========================================
    // GSAP SCROLL ANIMATION (7-phase, 700vh)
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

    // ---- PHASE 1 (0-10): DRAMATIC ENTRANCE ----
    // Camera starts extreme close-up overhead, pulls back to reveal laptop
    heroTl.to(scrollState, { cameraZ: 5.0, cameraY: 1.5, duration: 10, ease: 'power2.out' }, 0);
    heroTl.to(scrollState, { rotationY: Math.PI * 0.35, duration: 10, ease: 'power2.inOut' }, 0);

    // ---- PHASE 2 (10-24): LID OPENS + SCREEN GLOW BURST ----
    heroTl.to(scrollState, {
        lidAngle: -2.0,
        duration: 12,
        ease: 'power2.inOut',
        onUpdate: function () {
            if (scrollState.lidAngle < -0.5 && !scrollState.screenPowered) {
                scrollState.screenPowered = true;
                screenMesh.material = screenMaterial;
                camLedMat.opacity = 0.8;
            }
            if (scrollState.lidAngle >= -0.5 && scrollState.screenPowered) {
                scrollState.screenPowered = false;
                screenMesh.material = screenOffMaterial;
                camLedMat.opacity = 0;
                drawLaptopScreen(false);
            }
        }
    }, 10);
    heroTl.to(scrollState, { cameraZ: 4.2, cameraY: 1.0, rotationY: Math.PI * 0.45, duration: 12, ease: 'power2.inOut' }, 10);
    heroTl.to(scrollState, { glowIntensity: 0.6, duration: 5, ease: 'power2.out' }, 16);
    heroTl.to(screenLight, { intensity: 3.0, duration: 6 }, 16);
    heroTl.to(scrollState, { typingProgress: 1, duration: 10, ease: 'power1.inOut' }, 16);

    // ---- PHASE 3 (24-40): CONTENT CARDS EMERGE FROM SCREEN ----
    heroTl.to(scrollState, { glowIntensity: 0.9, duration: 3, ease: 'power2.out' }, 24);
    heroTl.to(scrollState, { cardProgress: 1, cardOpacity: 1, duration: 12, ease: 'power3.out' }, 25);
    heroTl.to(scrollState, { cameraZ: 5.8, cameraY: 0.7, duration: 14, ease: 'power2.inOut' }, 24);
    heroTl.to(scrollState, { rotationY: Math.PI * 0.55, duration: 14, ease: 'power2.inOut' }, 24);
    heroTl.to(scrollState, { glowIntensity: 0.15, duration: 8, ease: 'power1.in' }, 34);

    // ---- PHASE 4 (40-54): CARDS + LAPTOP SLIDE RIGHT, HERO TEXT ----
    heroTl.to(scrollState, { laptopX: isMobile ? 0 : 1.6, duration: 10, ease: 'power2.inOut' }, 40);
    heroTl.to(scrollState, { cameraZ: 5.5, cameraX: -0.3, duration: 10, ease: 'power2.out' }, 40);
    heroTl.to(scrollState, { cardOpacity: 0.5, duration: 8, ease: 'power1.in' }, 42);
    heroTl.to('.hero-tag', { opacity: 1, duration: 4 }, 42);
    heroTl.to('.hero-line-inner', { y: '0%', duration: 8, stagger: 2, ease: 'power3.out' }, 44);
    heroTl.to('.hero-sub', { opacity: 1, duration: 5 }, 50);
    heroTl.to('.btn-magnetic', { opacity: 1, duration: 5 }, 52);

    // ---- PHASE 5 (54-70): TEXT FADES, CARDS DISPERSE, PHONE ARC ENTRANCE ----
    heroTl.to('.hero-tag', { opacity: 0, duration: 3 }, 54);
    heroTl.to('.hero-line-inner', { y: '110%', duration: 5, stagger: 1, ease: 'power2.in' }, 54);
    heroTl.to('.hero-sub', { opacity: 0, duration: 3 }, 55);
    heroTl.to('.btn-magnetic', { opacity: 0, duration: 3 }, 55);
    heroTl.to(scrollState, { cardOpacity: 0, cardProgress: 2.0, duration: 8, ease: 'power2.in' }, 54);
    heroTl.to(scrollState, { glowIntensity: 0, duration: 5 }, 54);

    // Laptop rotates to side position
    heroTl.to(scrollState, { laptopX: isMobile ? 0.6 : 1.3, rotationY: Math.PI * 2.3, duration: 14, ease: 'power2.inOut' }, 56);
    heroTl.to(scrollState, { cameraZ: 5.5, cameraY: 0.8, cameraX: 0, duration: 14, ease: 'power2.inOut' }, 56);

    // Phone ARC entrance (from bottom-right, curves up to left)
    heroTl.to(scrollState, { phoneArc: 1, duration: 14, ease: 'power3.out' }, 58);
    // Phone screen is static — always shows full app

    // ---- PHASE 6 (70-87): DUAL DEVICE SHOWCASE ----
    heroTl.to(scrollState, { rotationY: Math.PI * 2.7, duration: 17, ease: 'none' }, 70);
    heroTl.to(scrollState, { cameraZ: 6.5, cameraY: 0.5, duration: 17, ease: 'power1.inOut' }, 70);

    // ---- PHASE 7 (87-100): EXIT ----
    heroTl.to(scrollState, { laptopScale: 0.5, laptopX: 3.0, duration: 10, ease: 'power2.in' }, 87);
    heroTl.to(scrollState, { phoneArc: 0, duration: 10, ease: 'power2.in' }, 89);
    heroTl.to(screenLight, { intensity: 0, duration: 8 }, 89);
    heroTl.to('.hero-scroll-indicator', { opacity: 1, duration: 5 }, 93);

    // ========================================
    // GLOBE SCROLL TRIGGER (post-hero sections)
    // ========================================
    ScrollTrigger.create({
        trigger: '#about',
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: function () {
            scrollState.globeVisible = true;
            globe.visible = true;
            gsap.to(scrollState, { globeScale: 1, duration: 1.5, ease: 'power3.out' });
        },
        onLeaveBack: function () {
            gsap.to(scrollState, {
                globeScale: 0, duration: 0.8, ease: 'power2.in',
                onComplete: function () { scrollState.globeVisible = false; globe.visible = false; }
            });
        }
    });

    ScrollTrigger.create({
        trigger: '#services',
        start: 'bottom 30%',
        onEnter: function () {
            gsap.to(scrollState, {
                globeScale: 0, duration: 1.0, ease: 'power2.in',
                onComplete: function () { scrollState.globeVisible = false; globe.visible = false; }
            });
        },
        onLeaveBack: function () {
            scrollState.globeVisible = true;
            globe.visible = true;
            gsap.to(scrollState, { globeScale: 1, duration: 1.0, ease: 'power3.out' });
        }
    });

    // ========================================
    // MOUSE PARALLAX
    // ========================================
    var mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    document.addEventListener('mousemove', function (e) {
        mouse.tx = (e.clientX / window.innerWidth - 0.5) * 0.3;
        mouse.ty = (e.clientY / window.innerHeight - 0.5) * 0.15;
    });

    // ========================================
    // RENDER LOOP
    // ========================================
    var clock = new THREE.Clock();
    var lastTypingProg = -1;

    function animate() {
        requestAnimationFrame(animate);
        if (document.hidden) return;

        var dt = clock.getDelta();
        var time = clock.getElapsedTime();

        // Mouse lerp
        mouse.x += (mouse.tx - mouse.x) * 0.03;
        mouse.y += (mouse.ty - mouse.y) * 0.03;

        // Laptop transform
        laptop.rotation.y = scrollState.rotationY + mouse.x;
        laptop.position.x = scrollState.laptopX;
        laptop.position.y = -0.3 + Math.sin(time * 0.8) * 0.03;
        laptop.scale.setScalar(scrollState.laptopScale);

        // Lid angle
        lidGroup.rotation.x = scrollState.lidAngle;

        // Screen glow
        glowMat.opacity = scrollState.glowIntensity * (0.8 + Math.sin(time * 2) * 0.2);

        // ---- PHONE ARC TRAJECTORY ----
        var arcT = scrollState.phoneArc;
        if (arcT > 0.01) {
            // Quadratic bezier: start(3.5, -2.8) → control(0, 0.8) → end(-1.5, -0.1)
            var sX = 3.5, sY = -2.8, cX = 0, cY = 0.8, eX = isMobile ? -0.4 : -1.5, eY = -0.1;
            var pArcX = (1 - arcT) * (1 - arcT) * sX + 2 * (1 - arcT) * arcT * cX + arcT * arcT * eX;
            var pArcY = (1 - arcT) * (1 - arcT) * sY + 2 * (1 - arcT) * arcT * cY + arcT * arcT * eY;
            phone.position.x = pArcX;
            phone.position.y = pArcY + Math.sin(time * 0.6 + 1) * 0.04;
            phone.rotation.y = 0.2 * arcT + mouse.x * 0.5;
            phone.rotation.x = Math.sin(time * 0.4) * 0.02;
        } else {
            phone.position.set(4, -3, 0);
        }

        // Phone screen is static — already drawn once at init

        // Camera
        camera.position.z = scrollState.cameraZ;
        camera.position.y = scrollState.cameraY + mouse.y;
        camera.position.x = scrollState.cameraX;
        var lookTarget = scrollState.laptopX * 0.3;
        camera.lookAt(lookTarget, 0, 0);

        // Update laptop screen
        if (scrollState.screenPowered) {
            typingProgress = scrollState.typingProgress;
            var roundedProg = Math.floor(typingProgress * codeLines.length);
            if (roundedProg !== lastTypingProg || Math.floor(time * 2) !== Math.floor((time - dt) * 2)) {
                lastTypingProg = roundedProg;
                drawLaptopScreen(true);
            }
        }

        // ---- CONTENT CARDS ----
        if (scrollState.cardOpacity > 0.01) {
            cardGroup.visible = true;
            cardGroup.position.x = scrollState.laptopX;
            cardGroup.position.y = -0.3 + Math.sin(time * 0.8) * 0.03;
            cardGroup.rotation.y = scrollState.rotationY + mouse.x;
            for (var ci = 0; ci < contentCards.length; ci++) {
                var card = contentCards[ci];
                var tgt = card.userData.target;
                var cProg = Math.max(0, Math.min(1, scrollState.cardProgress - ci * 0.12));
                var ep = cProg < 1 ? 1 - Math.pow(1 - cProg, 3) : 1;
                // If cardProgress > 1, cards fly further out (disperse)
                var spread = scrollState.cardProgress > 1 ? (scrollState.cardProgress - 1) : 0;
                card.position.x = ep * tgt.x * (1 + spread * 0.8);
                card.position.y = ep * tgt.y * (1 + spread * 0.5) + Math.sin(time * 0.7 + ci * 1.3) * 0.06;
                card.position.z = ep * tgt.z * (1 + spread * 0.6);
                card.rotation.y = ep * tgt.ry + Math.sin(time * 0.5 + ci) * 0.03;
                card.rotation.x = ep * tgt.rx;
                card.material.opacity = scrollState.cardOpacity * Math.min(1, cProg * 3);
            }
        } else {
            cardGroup.visible = false;
        }

        // Holographic globe
        if (scrollState.globeVisible) {
            globe.scale.setScalar(scrollState.globeScale);
            globe.rotation.y += 0.003;
            globeWire.rotation.y += 0.001;
            ring1.rotation.z += 0.004;
            ring2.rotation.z -= 0.003;
            ring3.rotation.z += 0.006;

            for (var ei = 0; ei < electrons.length; ei++) {
                var el = electrons[ei];
                var angle = time * el.userData.speed + el.userData.offset;
                var ringRef = ei === 0 ? ring1 : ei === 1 ? ring2 : ring3;
                var radius = ei === 0 ? 1.35 : ei === 1 ? 1.25 : 1.5;
                el.position.set(
                    radius * Math.cos(angle),
                    radius * Math.sin(angle) * Math.cos(ringRef.rotation.x),
                    radius * Math.sin(angle) * Math.sin(ringRef.rotation.x)
                );
                el.material.opacity = 0.5 + Math.sin(time * 3 + ei) * 0.3;
            }

            for (var di = 0; di < connectionDots.length; di++) {
                connectionDots[di].material.opacity = 0.3 + Math.sin(time * 2 + di * 0.5) * 0.3;
            }
        }

        // Floating shapes
        for (var si = 0; si < floatingShapes.length; si++) {
            var sh = floatingShapes[si];
            sh.rotation.x += sh.userData.speed * 0.005;
            sh.rotation.y += sh.userData.speed * 0.008;
            sh.position.y = sh.userData.baseY + Math.sin(time * sh.userData.speed + si * 2) * 0.3;
        }

        // Particles
        var pp = particles.geometry.attributes.position.array;
        for (var i = 0; i < PARTICLE_COUNT * 3; i += 3) {
            pp[i + 1] -= 0.003;
            if (pp[i + 1] < -9) pp[i + 1] = 9;
        }
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
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.ideepScene = { laptop: laptop, phone: phone, globe: globe, camera: camera, scrollState: scrollState };
})();
