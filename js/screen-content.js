/* ============================================
   IDeep — Pre-rendered scrollable screen content
   Tall canvases for laptop, phone, tablet
   ============================================ */
(function () {
    // roundRect polyfill
    if (!CanvasRenderingContext2D.prototype.roundRect) {
        CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, radii) {
            var r = typeof radii === 'number' ? radii : (radii && radii[0]) || 0;
            if (r > w / 2) r = w / 2; if (r > h / 2) r = h / 2;
            this.moveTo(x + r, y); this.lineTo(x + w - r, y);
            this.quadraticCurveTo(x + w, y, x + w, y + r); this.lineTo(x + w, y + h - r);
            this.quadraticCurveTo(x + w, y + h, x + w - r, y + h); this.lineTo(x + r, y + h);
            this.quadraticCurveTo(x, y + h, x, y + h - r); this.lineTo(x, y + r);
            this.quadraticCurveTo(x, y, x + r, y); return this;
        };
    }

    var lc = document.createElement('canvas'); lc.width = 1024; lc.height = 2400;
    var pc = document.createElement('canvas'); pc.width = 512; pc.height = 2500;
    var tc = document.createElement('canvas'); tc.width = 952; tc.height = 2000;

    // ========================================
    // LAPTOP CONTENT — IDeep Showcase Website
    // ========================================
    function drawLaptop() {
        var c = lc.getContext('2d'), w = 1024, h = 2400, y;
        var bg = c.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#080d19'); bg.addColorStop(1, '#040810');
        c.fillStyle = bg; c.fillRect(0, 0, w, h);

        // Nav
        c.fillStyle = 'rgba(255,255,255,0.04)'; c.fillRect(0, 0, w, 36);
        c.fillStyle = '#2D9CDB'; c.font = 'bold 14px sans-serif'; c.fillText('IDeep', 32, 24);
        c.fillStyle = '#8892b0'; c.font = '11px sans-serif';
        var navI = ['Accueil', 'Services', 'Portfolio', 'Equipe', 'Contact'];
        for (var ni = 0; ni < 5; ni++) c.fillText(navI[ni], w - 340 + ni * 62, 24);
        c.fillStyle = '#2D9CDB'; c.beginPath(); c.roundRect(w - 110, 8, 80, 22, 11); c.fill();
        c.fillStyle = '#fff'; c.font = 'bold 10px sans-serif'; c.fillText('Contact', w - 92, 23);

        // HERO
        c.fillStyle = 'rgba(45,156,219,0.05)'; c.beginPath(); c.arc(700, 150, 200, 0, 6.28); c.fill();
        c.fillStyle = '#2D9CDB'; c.font = '11px sans-serif'; c.fillText('STUDIO DE DÉVELOPPEMENT', 60, 80);
        c.fillStyle = '#fff'; c.font = 'bold 42px sans-serif';
        c.fillText('Construisons le', 60, 135); c.fillText('futur ensemble.', 60, 185);
        c.fillStyle = '#8892b0'; c.font = '14px sans-serif';
        c.fillText('Solutions digitales innovantes pour transformer', 60, 225);
        c.fillText('vos idées en expériences exceptionnelles.', 60, 247);
        c.fillStyle = '#2D9CDB'; c.beginPath(); c.roundRect(60, 275, 150, 38, 19); c.fill();
        c.fillStyle = '#fff'; c.font = 'bold 13px sans-serif'; c.fillText('Découvrir →', 90, 299);
        c.strokeStyle = 'rgba(255,255,255,0.2)'; c.lineWidth = 1.5;
        c.beginPath(); c.roundRect(230, 275, 150, 38, 19); c.stroke();
        c.fillStyle = '#fff'; c.font = '13px sans-serif'; c.fillText('Nos projets', 270, 299);
        // Right mockups
        c.strokeStyle = 'rgba(45,156,219,0.2)'; c.lineWidth = 1;
        c.beginPath(); c.roundRect(640, 70, 180, 130, 12); c.stroke();
        c.fillStyle = 'rgba(45,156,219,0.06)'; c.beginPath(); c.roundRect(640, 70, 180, 130, 12); c.fill();
        for (var i = 0; i < 5; i++) { c.fillStyle = 'rgba(45,156,219,0.1)'; c.fillRect(660, 100 + i * 18, 140 - i * 10, 8); }
        c.strokeStyle = 'rgba(45,156,219,0.15)'; c.beginPath(); c.roundRect(850, 90, 65, 110, 8); c.stroke();

        // DIVIDER
        y = 360;
        c.strokeStyle = 'rgba(45,156,219,0.1)'; c.beginPath(); c.moveTo(60, y); c.lineTo(964, y); c.stroke();

        // ABOUT
        y = 400;
        c.fillStyle = '#2D9CDB'; c.font = '10px sans-serif'; c.fillText('QUI SOMMES-NOUS', 60, y);
        c.fillStyle = '#fff'; c.font = 'bold 28px sans-serif';
        c.fillText('Une équipe passionnée de développeurs.', 60, y + 40);
        c.fillStyle = '#8892b0'; c.font = '13px sans-serif';
        c.fillText('IDeep est un studio fondé par des étudiants en informatique passionnés', 60, y + 80);
        c.fillText('par la création de solutions digitales innovantes et performantes.', 60, y + 100);
        var stats = [['4+', 'Projets'], ['6', 'Développeurs'], ['100%', 'Satisfaction'], ['2025', 'Fondée']];
        for (var si = 0; si < 4; si++) {
            c.fillStyle = '#2D9CDB'; c.font = 'bold 26px sans-serif'; c.fillText(stats[si][0], 60 + si * 230, y + 150);
            c.fillStyle = '#64748b'; c.font = '11px sans-serif'; c.fillText(stats[si][1], 60 + si * 230, y + 172);
        }

        // DIVIDER
        c.strokeStyle = 'rgba(45,156,219,0.1)'; c.beginPath(); c.moveTo(60, 620); c.lineTo(964, 620); c.stroke();

        // SERVICES
        y = 660;
        c.fillStyle = '#2D9CDB'; c.font = '10px sans-serif'; c.fillText('NOS SERVICES', 60, y);
        c.fillStyle = '#fff'; c.font = 'bold 28px sans-serif'; c.fillText('Ce que nous faisons', 60, y + 40);
        var svcs = [
            ['</>', 'Développement Web', 'Sites, apps web, e-commerce', '#2D9CDB'],
            ['\u{1F4F1}', 'Applications Mobiles', 'iOS & Android avec Flutter', '#34C759'],
            ['AI', 'IA & Data Science', 'ML, analytics, solutions IA', '#FF9500']
        ];
        for (var ci = 0; ci < 3; ci++) {
            var cx = 60 + ci * 302, cy = y + 70, cw = 280, ch = 140;
            c.fillStyle = 'rgba(255,255,255,0.03)'; c.beginPath(); c.roundRect(cx, cy, cw, ch, 12); c.fill();
            c.strokeStyle = svcs[ci][3] + '30'; c.lineWidth = 1; c.beginPath(); c.roundRect(cx, cy, cw, ch, 12); c.stroke();
            c.fillStyle = svcs[ci][3] + '20'; c.beginPath(); c.arc(cx + 30, cy + 35, 20, 0, 6.28); c.fill();
            c.fillStyle = svcs[ci][3]; c.font = 'bold 14px monospace'; c.textAlign = 'center';
            c.fillText(svcs[ci][0], cx + 30, cy + 40); c.textAlign = 'left';
            c.fillStyle = '#fff'; c.font = 'bold 15px sans-serif'; c.fillText(svcs[ci][1], cx + 60, cy + 38);
            c.fillStyle = '#8892b0'; c.font = '12px sans-serif'; c.fillText(svcs[ci][2], cx + 16, cy + 80);
            c.fillStyle = svcs[ci][3] + '30'; c.fillRect(cx + 16, cy + ch - 6, cw - 32, 2);
        }

        // DIVIDER
        c.strokeStyle = 'rgba(45,156,219,0.1)'; c.beginPath(); c.moveTo(60, 910); c.lineTo(964, 910); c.stroke();

        // PORTFOLIO
        y = 950;
        c.fillStyle = '#2D9CDB'; c.font = '10px sans-serif'; c.fillText('PORTFOLIO', 60, y);
        c.fillStyle = '#fff'; c.font = 'bold 28px sans-serif'; c.fillText('Nos réalisations', 60, y + 40);
        var projs = [['Eat & Fit', 'App de suivi nutritionnel', '#34C759', '#1a3a2a', '#0a2a1a'],
                     ['AZ Airlines', 'Dashboard de gestion', '#2D9CDB', '#1a2a4a', '#0a1a3a']];
        for (var pi = 0; pi < 2; pi++) {
            var px = 60 + pi * 464, py = y + 70, pw = 440, ph = 260, ih = 160;
            c.fillStyle = 'rgba(255,255,255,0.03)'; c.beginPath(); c.roundRect(px, py, pw, ph, 12); c.fill();
            var ig = c.createLinearGradient(px, py, px + pw, py + ih);
            ig.addColorStop(0, projs[pi][3]); ig.addColorStop(1, projs[pi][4]);
            c.fillStyle = ig; c.beginPath(); c.roundRect(px, py, pw, ih, [12, 12, 0, 0]); c.fill();
            c.fillStyle = 'rgba(255,255,255,0.08)';
            c.fillRect(px + 20, py + 20, pw - 40, 12); c.fillRect(px + 20, py + 40, pw * 0.6, 8);
            for (var ri = 0; ri < 3; ri++) c.fillRect(px + 20 + ri * 130, py + 65, 110, 65);
            c.fillStyle = '#fff'; c.font = 'bold 16px sans-serif'; c.fillText(projs[pi][0], px + 16, py + ih + 30);
            c.fillStyle = '#8892b0'; c.font = '12px sans-serif'; c.fillText(projs[pi][1], px + 16, py + ih + 50);
            c.fillStyle = projs[pi][2] + '20'; c.beginPath(); c.roundRect(px + pw - 100, py + ih + 15, 80, 24, 12); c.fill();
            c.fillStyle = projs[pi][2]; c.font = 'bold 10px sans-serif'; c.textAlign = 'center';
            c.fillText(pi === 0 ? 'Mobile App' : 'Dashboard', px + pw - 60, py + ih + 31); c.textAlign = 'left';
        }

        // DIVIDER
        c.strokeStyle = 'rgba(45,156,219,0.1)'; c.beginPath(); c.moveTo(60, 1380); c.lineTo(964, 1380); c.stroke();

        // TEAM
        y = 1420;
        c.fillStyle = '#2D9CDB'; c.font = '10px sans-serif'; c.fillText('NOTRE ÉQUIPE', 60, y);
        c.fillStyle = '#fff'; c.font = 'bold 28px sans-serif'; c.fillText("L'équipe derrière IDeep", 60, y + 40);
        var team = [['M', 'Mohamed', 'Full-Stack'], ['Y', 'Yassmine', 'UI/UX'], ['A', 'Ahmed', 'Backend'],
                    ['S', 'Sarra', 'Mobile'], ['K', 'Khalil', 'Data'], ['I', 'Ines', 'Frontend']];
        for (var mi = 0; mi < 6; mi++) {
            var mx = 60 + mi * 156, my = y + 70, mw = 140, mh = 150;
            c.fillStyle = 'rgba(255,255,255,0.03)'; c.beginPath(); c.roundRect(mx, my, mw, mh, 10); c.fill();
            c.fillStyle = 'rgba(45,156,219,0.15)'; c.beginPath(); c.arc(mx + 70, my + 45, 30, 0, 6.28); c.fill();
            c.fillStyle = '#2D9CDB'; c.font = 'bold 20px sans-serif'; c.textAlign = 'center';
            c.fillText(team[mi][0], mx + 70, my + 53);
            c.fillStyle = '#fff'; c.font = 'bold 12px sans-serif';
            c.fillText(team[mi][1], mx + 70, my + 100);
            c.fillStyle = '#64748b'; c.font = '10px sans-serif';
            c.fillText(team[mi][2], mx + 70, my + 118); c.textAlign = 'left';
        }

        // CTA
        y = 1700;
        c.fillStyle = 'rgba(45,156,219,0.04)'; c.beginPath(); c.roundRect(60, y, 904, 180, 16); c.fill();
        c.strokeStyle = 'rgba(45,156,219,0.15)'; c.lineWidth = 1; c.beginPath(); c.roundRect(60, y, 904, 180, 16); c.stroke();
        c.fillStyle = '#fff'; c.font = 'bold 30px sans-serif'; c.textAlign = 'center';
        c.fillText('Prêt à lancer votre projet ?', 512, y + 55);
        c.fillStyle = '#8892b0'; c.font = '14px sans-serif';
        c.fillText('Contactez-nous pour discuter de votre idée.', 512, y + 90);
        c.fillStyle = '#2D9CDB'; c.beginPath(); c.roundRect(432, y + 115, 160, 42, 21); c.fill();
        c.fillStyle = '#fff'; c.font = 'bold 14px sans-serif';
        c.fillText('Nous contacter →', 512, y + 141); c.textAlign = 'left';

        // TECHNOLOGIES
        y = 1960;
        c.fillStyle = '#2D9CDB'; c.font = '10px sans-serif'; c.fillText('TECHNOLOGIES', 60, y);
        c.fillStyle = '#fff'; c.font = 'bold 20px sans-serif'; c.fillText('Nos outils', 60, y + 30);
        var techs = ['React', 'Next.js', 'Node.js', 'Python', 'Flutter', 'Firebase', 'PostgreSQL', 'Docker'];
        for (var ti = 0; ti < 8; ti++) {
            var tx = 60 + (ti % 4) * 120, ty = y + 60 + Math.floor(ti / 4) * 45;
            c.fillStyle = 'rgba(255,255,255,0.05)'; c.beginPath(); c.roundRect(tx, ty, 105, 32, 16); c.fill();
            c.fillStyle = '#94a3b8'; c.font = '12px sans-serif'; c.textAlign = 'center';
            c.fillText(techs[ti], tx + 52, ty + 21); c.textAlign = 'left';
        }

        // FOOTER
        y = 2150;
        c.fillStyle = 'rgba(255,255,255,0.03)'; c.fillRect(0, y, w, 250);
        c.strokeStyle = 'rgba(255,255,255,0.06)'; c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke();
        c.fillStyle = '#2D9CDB'; c.font = 'bold 18px sans-serif'; c.fillText('IDeep', 60, y + 40);
        c.fillStyle = '#64748b'; c.font = '12px sans-serif';
        c.fillText('Studio de développement digital', 60, y + 62);
        c.fillText('Tunisie — contact@ideep.tn', 60, y + 82);
        c.fillStyle = '#4a5568'; c.font = '10px sans-serif'; c.fillText('© 2025 IDeep. Tous droits réservés.', 60, y + 130);
    }

    // ========================================
    // PHONE CONTENT — Eat & Fit Health App
    // ========================================
    function drawPhone() {
        var c = pc.getContext('2d'), w = 512, h = 2500, y;
        var bg = c.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#0a1628'); bg.addColorStop(0.5, '#071020'); bg.addColorStop(1, '#040810');
        c.fillStyle = bg; c.fillRect(0, 0, w, h);

        // App header
        c.fillStyle = '#34C759'; c.font = 'bold 24px sans-serif'; c.fillText('Eat', 24, 40);
        c.fillStyle = '#fff'; c.font = 'bold 24px sans-serif'; c.fillText('&Fit', 68, 40);
        c.fillStyle = '#64748b'; c.font = '12px sans-serif'; c.fillText('Suivi nutritionnel', 24, 62);
        c.fillStyle = 'rgba(52,199,89,0.2)'; c.beginPath(); c.arc(w - 40, 40, 20, 0, 6.28); c.fill();
        c.strokeStyle = 'rgba(52,199,89,0.5)'; c.lineWidth = 1.5; c.beginPath(); c.arc(w - 40, 40, 20, 0, 6.28); c.stroke();
        c.fillStyle = '#fff'; c.font = 'bold 16px sans-serif'; c.textAlign = 'center'; c.fillText('Y', w - 40, 46); c.textAlign = 'left';

        // Welcome card
        y = 85;
        var wg = c.createLinearGradient(16, y, w - 16, y + 80);
        wg.addColorStop(0, '#1a3520'); wg.addColorStop(1, '#0d2215');
        c.fillStyle = wg; c.beginPath(); c.roundRect(16, y, w - 32, 80, 16); c.fill();
        c.strokeStyle = 'rgba(52,199,89,0.25)'; c.lineWidth = 1; c.beginPath(); c.roundRect(16, y, w - 32, 80, 16); c.stroke();
        c.fillStyle = '#fff'; c.font = 'bold 16px sans-serif'; c.fillText('Bonjour, Yassmine !', 32, y + 30);
        c.fillStyle = '#94a3b8'; c.font = '12px sans-serif'; c.fillText('Objectif: 2,000 kcal / jour', 32, y + 52);
        c.fillStyle = '#34C759'; c.beginPath(); c.roundRect(32, y + 60, 90, 14, 7); c.fill();
        c.fillStyle = '#000'; c.font = 'bold 9px sans-serif'; c.fillText('En bonne voie', 40, y + 70);

        // Calorie circle
        y = 190;
        c.fillStyle = 'rgba(255,255,255,0.03)'; c.beginPath(); c.roundRect(16, y, w - 32, 200, 16); c.fill();
        c.fillStyle = '#fff'; c.font = 'bold 14px sans-serif'; c.fillText("Aujourd'hui", 32, y + 25);
        var cx = w / 2, cy = y + 115, r = 65;
        c.lineWidth = 10; c.strokeStyle = 'rgba(255,255,255,0.06)';
        c.beginPath(); c.arc(cx, cy, r, 0, 6.28); c.stroke();
        c.strokeStyle = '#34C759'; c.lineCap = 'round';
        c.beginPath(); c.arc(cx, cy, r, -1.57, -1.57 + 6.28 * 0.71); c.stroke(); c.lineCap = 'butt';
        c.fillStyle = '#fff'; c.font = 'bold 28px sans-serif'; c.textAlign = 'center';
        c.fillText('1,420', cx, cy - 2);
        c.fillStyle = '#64748b'; c.font = '11px sans-serif'; c.fillText('/ 2,000 kcal', cx, cy + 18); c.textAlign = 'left';

        // Macros
        y = 410;
        var macros = [['85g', 'Protéines', 0.68, '#2D9CDB'], ['180g', 'Glucides', 0.72, '#FF9500'], ['52g', 'Lipides', 0.65, '#FF3B30']];
        for (var mi = 0; mi < 3; mi++) {
            var mx = 32 + mi * 158;
            c.fillStyle = '#fff'; c.font = 'bold 12px sans-serif'; c.fillText(macros[mi][0], mx, y);
            c.fillStyle = '#64748b'; c.font = '10px sans-serif'; c.fillText(macros[mi][1], mx, y + 16);
            c.fillStyle = 'rgba(255,255,255,0.06)'; c.beginPath(); c.roundRect(mx, y + 22, 130, 5, 2.5); c.fill();
            c.fillStyle = macros[mi][3]; c.beginPath(); c.roundRect(mx, y + 22, 130 * macros[mi][2], 5, 2.5); c.fill();
        }

        // Meals
        y = 470;
        c.fillStyle = '#fff'; c.font = 'bold 15px sans-serif'; c.fillText('Repas du jour', 24, y);
        c.fillStyle = '#2D9CDB'; c.font = '12px sans-serif'; c.fillText('+ Ajouter', w - 90, y);
        var meals = [
            ['Petit-déjeuner', '380 kcal', 'Oeufs, toast, jus', '\u2600', '#FF9500'],
            ['Déjeuner', '620 kcal', 'Poulet, riz, salade', '\u263C', '#34C759'],
            ['Collation', '180 kcal', 'Yaourt, fruits', '\u2605', '#5CB8E6'],
            ['Dîner', '240 kcal', 'Soupe, pain complet', '\u263E', '#AF52DE']
        ];
        for (var mli = 0; mli < 4; mli++) {
            var my = y + 20 + mli * 68;
            c.fillStyle = 'rgba(255,255,255,0.03)'; c.beginPath(); c.roundRect(16, my, w - 32, 58, 12); c.fill();
            c.fillStyle = meals[mli][4] + '25'; c.beginPath(); c.arc(46, my + 29, 18, 0, 6.28); c.fill();
            c.fillStyle = meals[mli][4]; c.font = '16px sans-serif'; c.textAlign = 'center';
            c.fillText(meals[mli][3], 46, my + 35); c.textAlign = 'left';
            c.fillStyle = '#fff'; c.font = 'bold 13px sans-serif'; c.fillText(meals[mli][0], 76, my + 24);
            c.fillStyle = '#64748b'; c.font = '10px sans-serif'; c.fillText(meals[mli][2], 76, my + 42);
            c.fillStyle = meals[mli][4] + '20'; c.beginPath(); c.roundRect(w - 105, my + 16, 72, 22, 11); c.fill();
            c.fillStyle = meals[mli][4]; c.font = 'bold 10px sans-serif'; c.textAlign = 'center';
            c.fillText(meals[mli][1], w - 69, my + 31); c.textAlign = 'left';
        }

        // Weekly chart
        y = 770;
        c.fillStyle = '#fff'; c.font = 'bold 14px sans-serif'; c.fillText('Cette semaine', 24, y);
        var days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
        var dayV = [0.82, 0.95, 0.70, 0.88, 0.60, 0.75, 0.71];
        var bw = 36, bG = (w - 48 - 7 * bw) / 6, bMax = 80;
        for (var di = 0; di < 7; di++) {
            var bx = 24 + di * (bw + bG), bh = bMax * dayV[di];
            c.fillStyle = 'rgba(255,255,255,0.04)'; c.beginPath(); c.roundRect(bx, y + 20 + bMax - bh, bw, bh, 4); c.fill();
            c.fillStyle = di === 6 ? '#34C759' : 'rgba(52,199,89,0.5)';
            c.beginPath(); c.roundRect(bx, y + 20 + bMax - bh, bw, bh, 4); c.fill();
            c.fillStyle = '#64748b'; c.font = '10px sans-serif'; c.textAlign = 'center';
            c.fillText(days[di], bx + bw / 2, y + 115); c.textAlign = 'left';
        }

        // WATER INTAKE
        y = 920;
        c.fillStyle = 'rgba(255,255,255,0.03)'; c.beginPath(); c.roundRect(16, y, w - 32, 180, 16); c.fill();
        c.fillStyle = '#fff'; c.font = 'bold 14px sans-serif'; c.fillText('Hydratation', 32, y + 28);
        c.fillStyle = '#2D9CDB'; c.font = '12px sans-serif'; c.fillText('1.6L / 2.5L', w - 120, y + 28);
        // Water progress bar
        c.fillStyle = 'rgba(255,255,255,0.06)'; c.beginPath(); c.roundRect(32, y + 45, w - 64, 12, 6); c.fill();
        c.fillStyle = '#2D9CDB'; c.beginPath(); c.roundRect(32, y + 45, (w - 64) * 0.64, 12, 6); c.fill();
        // Water glasses
        for (var gi = 0; gi < 8; gi++) {
            var gx = 32 + gi * 56;
            c.fillStyle = gi < 5 ? 'rgba(45,156,219,0.3)' : 'rgba(255,255,255,0.05)';
            c.beginPath(); c.roundRect(gx, y + 75, 44, 55, 8); c.fill();
            c.fillStyle = gi < 5 ? '#2D9CDB' : '#4a5568'; c.font = '18px sans-serif'; c.textAlign = 'center';
            c.fillText(gi < 5 ? '\u{1F4A7}' : '\u25CB', gx + 22, y + 108); c.textAlign = 'left';
            c.fillStyle = '#64748b'; c.font = '9px sans-serif'; c.textAlign = 'center';
            c.fillText('250ml', gx + 22, y + 140); c.textAlign = 'left';
        }

        // ACTIVITY RINGS
        y = 1130;
        c.fillStyle = 'rgba(255,255,255,0.03)'; c.beginPath(); c.roundRect(16, y, w - 32, 200, 16); c.fill();
        c.fillStyle = '#fff'; c.font = 'bold 14px sans-serif'; c.fillText('Activité', 32, y + 28);
        var rings = [['Mouvement', '420/500 cal', 0.84, '#FF3B30'], ['Exercice', '28/30 min', 0.93, '#34C759'], ['Debout', '10/12 h', 0.83, '#2D9CDB']];
        for (var ri = 0; ri < 3; ri++) {
            var rcx = 90 + ri * 150, rcy = y + 110, rr = 40 - ri * 10;
            c.lineWidth = 8; c.strokeStyle = rings[ri][3] + '25';
            c.beginPath(); c.arc(rcx, rcy, rr, 0, 6.28); c.stroke();
            c.strokeStyle = rings[ri][3]; c.lineCap = 'round';
            c.beginPath(); c.arc(rcx, rcy, rr, -1.57, -1.57 + 6.28 * rings[ri][2]); c.stroke(); c.lineCap = 'butt';
            c.fillStyle = '#fff'; c.font = 'bold 11px sans-serif'; c.textAlign = 'center';
            c.fillText(rings[ri][0], rcx, rcy + rr + 20);
            c.fillStyle = '#64748b'; c.font = '10px sans-serif';
            c.fillText(rings[ri][1], rcx, rcy + rr + 35); c.textAlign = 'left';
        }

        // RECIPES
        y = 1370;
        c.fillStyle = '#fff'; c.font = 'bold 15px sans-serif'; c.fillText('Recettes suggérées', 24, y);
        c.fillStyle = '#34C759'; c.font = '12px sans-serif'; c.fillText('Voir tout', w - 80, y);
        var recipes = [
            ['Salade César', '320 kcal', '15 min', '#34C759'],
            ['Bowl Quinoa', '450 kcal', '20 min', '#FF9500'],
            ['Smoothie Vert', '180 kcal', '5 min', '#2D9CDB']
        ];
        for (var rci = 0; rci < 3; rci++) {
            var ry = y + 20 + rci * 85;
            c.fillStyle = 'rgba(255,255,255,0.03)'; c.beginPath(); c.roundRect(16, ry, w - 32, 75, 12); c.fill();
            // Image placeholder
            var rpg = c.createLinearGradient(16, ry, 92, ry + 75);
            rpg.addColorStop(0, recipes[rci][3] + '30'); rpg.addColorStop(1, recipes[rci][3] + '10');
            c.fillStyle = rpg; c.beginPath(); c.roundRect(16, ry, 76, 75, [12, 0, 0, 12]); c.fill();
            c.fillStyle = recipes[rci][3]; c.font = '28px sans-serif'; c.textAlign = 'center';
            c.fillText('\u{1F957}', 54, ry + 46); c.textAlign = 'left';
            c.fillStyle = '#fff'; c.font = 'bold 14px sans-serif'; c.fillText(recipes[rci][0], 106, ry + 30);
            c.fillStyle = '#64748b'; c.font = '11px sans-serif';
            c.fillText(recipes[rci][1] + '  •  ' + recipes[rci][2], 106, ry + 50);
        }

        // GOALS
        y = 1660;
        c.fillStyle = 'rgba(255,255,255,0.03)'; c.beginPath(); c.roundRect(16, y, w - 32, 160, 16); c.fill();
        c.fillStyle = '#fff'; c.font = 'bold 14px sans-serif'; c.fillText('Objectifs de la semaine', 32, y + 28);
        var goals = [['Perdre 0.5kg', 0.6, '#FF3B30'], ['5 séances sport', 0.8, '#34C759'], ['2L eau/jour', 0.7, '#2D9CDB']];
        for (var gli = 0; gli < 3; gli++) {
            var gy = y + 50 + gli * 36;
            c.fillStyle = '#94a3b8'; c.font = '12px sans-serif'; c.fillText(goals[gli][0], 32, gy);
            c.fillStyle = 'rgba(255,255,255,0.06)'; c.beginPath(); c.roundRect(200, gy - 8, w - 248, 10, 5); c.fill();
            c.fillStyle = goals[gli][2]; c.beginPath(); c.roundRect(200, gy - 8, (w - 248) * goals[gli][1], 10, 5); c.fill();
            c.fillStyle = '#fff'; c.font = 'bold 10px sans-serif'; c.fillText(Math.round(goals[gli][1] * 100) + '%', w - 48, gy);
        }

        // ACHIEVEMENTS
        y = 1860;
        c.fillStyle = '#fff'; c.font = 'bold 15px sans-serif'; c.fillText('Badges récents', 24, y);
        var badges = [['\u{1F3C6}', '7 jours', '#FF9500'], ['\u{1F525}', 'Streak 14j', '#FF3B30'], ['\u2B50', '100% macros', '#34C759'], ['\u{1F4AA}', '5k pas', '#2D9CDB']];
        for (var bi = 0; bi < 4; bi++) {
            var bbx = 24 + bi * 118;
            c.fillStyle = 'rgba(255,255,255,0.03)'; c.beginPath(); c.roundRect(bbx, y + 20, 105, 90, 12); c.fill();
            c.fillStyle = badges[bi][2] + '20'; c.beginPath(); c.arc(bbx + 52, y + 55, 22, 0, 6.28); c.fill();
            c.font = '22px sans-serif'; c.textAlign = 'center'; c.fillText(badges[bi][0], bbx + 52, y + 63);
            c.fillStyle = '#fff'; c.font = 'bold 10px sans-serif'; c.fillText(badges[bi][1], bbx + 52, y + 95); c.textAlign = 'left';
        }

        // PREMIUM
        y = 2010;
        var pg = c.createLinearGradient(16, y, w - 16, y + 130);
        pg.addColorStop(0, '#1a2a1a'); pg.addColorStop(1, '#0a1a0a');
        c.fillStyle = pg; c.beginPath(); c.roundRect(16, y, w - 32, 130, 16); c.fill();
        c.strokeStyle = 'rgba(52,199,89,0.3)'; c.lineWidth = 1; c.beginPath(); c.roundRect(16, y, w - 32, 130, 16); c.stroke();
        c.fillStyle = '#34C759'; c.font = 'bold 11px sans-serif'; c.fillText('EAT&FIT PRO', 32, y + 28);
        c.fillStyle = '#fff'; c.font = 'bold 18px sans-serif'; c.fillText('Passez à Premium', 32, y + 55);
        c.fillStyle = '#94a3b8'; c.font = '12px sans-serif'; c.fillText('Plans personnalisés, coaching IA, recettes exclusives', 32, y + 78);
        c.fillStyle = '#34C759'; c.beginPath(); c.roundRect(32, y + 95, 130, 26, 13); c.fill();
        c.fillStyle = '#000'; c.font = 'bold 11px sans-serif'; c.fillText('Essai gratuit →', 48, y + 112);
    }

    // ========================================
    // TABLET CONTENT — AZ Airlines Dashboard (main area only)
    // ========================================
    function drawTablet() {
        var c = tc.getContext('2d'), w = 952, h = 2000, y;
        var bg = c.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#0c1425'); bg.addColorStop(1, '#060b14');
        c.fillStyle = bg; c.fillRect(0, 0, w, h);

        // KPI Cards
        y = 20;
        var kpis = [
            ['42.8K', 'Passagers', '+12.5%', '#2D9CDB', true],
            ['156', 'Vols actifs', '+3.2%', '#34C759', true],
            ['$3.2M', 'Revenue', '+8.1%', '#FF9500', true],
            ['94%', 'Satisfaction', '-0.3%', '#AF52DE', false]
        ];
        var kw = (w - 48 - 48) / 4;
        for (var ki = 0; ki < 4; ki++) {
            var kx = 24 + ki * (kw + 16);
            c.fillStyle = 'rgba(255,255,255,0.03)'; c.beginPath(); c.roundRect(kx, y, kw, 95, 12); c.fill();
            c.strokeStyle = kpis[ki][3] + '25'; c.lineWidth = 1; c.beginPath(); c.roundRect(kx, y, kw, 95, 12); c.stroke();
            c.fillStyle = '#94a3b8'; c.font = '11px sans-serif'; c.fillText(kpis[ki][1], kx + 16, y + 24);
            c.fillStyle = '#fff'; c.font = 'bold 24px sans-serif'; c.fillText(kpis[ki][0], kx + 16, y + 56);
            c.fillStyle = kpis[ki][4] ? '#34C759' : '#FF3B30'; c.font = 'bold 11px sans-serif'; c.fillText(kpis[ki][2], kx + 16, y + 78);
            // Sparkline
            c.strokeStyle = kpis[ki][3] + '60'; c.lineWidth = 1.5; c.beginPath();
            var spX = kx + kw - 60, spY = y + 48;
            var sp = [0, -5, 3, -2, 6, 4, 8, 5, 10, 12, 9, 14];
            c.moveTo(spX, spY - sp[0]);
            for (var s = 1; s < sp.length; s++) c.lineTo(spX + s * 4, spY - sp[s]);
            c.stroke();
        }

        // CHART
        y = 140;
        c.fillStyle = 'rgba(255,255,255,0.02)'; c.beginPath(); c.roundRect(24, y, w - 48, 260, 12); c.fill();
        c.fillStyle = '#fff'; c.font = 'bold 13px sans-serif'; c.fillText('Passagers mensuels', 44, y + 28);
        c.fillStyle = '#64748b'; c.font = '11px sans-serif'; c.fillText('Derniers 12 mois', 200, y + 28);
        var cL = 70, cR = w - 40, cT = y + 55, cB = y + 230;
        c.strokeStyle = 'rgba(255,255,255,0.04)'; c.lineWidth = 1;
        for (var gi = 0; gi < 5; gi++) {
            var gy = cT + (cB - cT) * gi / 4;
            c.beginPath(); c.moveTo(cL, gy); c.lineTo(cR, gy); c.stroke();
            c.fillStyle = '#4a5568'; c.font = '9px sans-serif'; c.fillText((80 - gi * 20) + 'K', 30, gy + 3);
        }
        var months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (var ml = 0; ml < 12; ml++) {
            var mlx = cL + ml * (cR - cL) / 11;
            c.fillStyle = '#4a5568'; c.font = '9px sans-serif'; c.textAlign = 'center';
            c.fillText(months[ml], mlx, cB + 16); c.textAlign = 'left';
        }
        var cd = [35, 42, 38, 55, 48, 62, 58, 70, 65, 72, 68, 78];
        c.strokeStyle = '#2D9CDB'; c.lineWidth = 2.5; c.lineJoin = 'round'; c.lineCap = 'round'; c.beginPath();
        for (var d = 0; d < cd.length; d++) {
            var px = cL + d * (cR - cL) / 11, py = cB - (cd[d] / 80) * (cB - cT);
            if (d === 0) c.moveTo(px, py); else c.lineTo(px, py);
        }
        c.stroke();
        c.lineTo(cR, cB); c.lineTo(cL, cB); c.closePath();
        var cg = c.createLinearGradient(0, cT, 0, cB);
        cg.addColorStop(0, 'rgba(45,156,219,0.2)'); cg.addColorStop(1, 'rgba(45,156,219,0)');
        c.fillStyle = cg; c.fill();
        for (var dd = 0; dd < cd.length; dd++) {
            var dpx = cL + dd * (cR - cL) / 11, dpy = cB - (cd[dd] / 80) * (cB - cT);
            c.fillStyle = '#2D9CDB'; c.beginPath(); c.arc(dpx, dpy, 3, 0, 6.28); c.fill();
            c.fillStyle = '#fff'; c.beginPath(); c.arc(dpx, dpy, 1.5, 0, 6.28); c.fill();
        }

        // FLIGHTS TABLE
        y = 430;
        c.fillStyle = 'rgba(255,255,255,0.02)'; c.beginPath(); c.roundRect(24, y, w - 48, 250, 12); c.fill();
        c.fillStyle = '#fff'; c.font = 'bold 13px sans-serif'; c.fillText('Vols récents', 44, y + 28);
        var tY = y + 48;
        c.fillStyle = '#4a5568'; c.font = 'bold 10px sans-serif';
        c.fillText('VOL', 44, tY); c.fillText('ROUTE', 140, tY); c.fillText('STATUT', 380, tY);
        c.fillText('PASSAGERS', 520, tY); c.fillText('HEURE', w - 80, tY);
        c.strokeStyle = 'rgba(255,255,255,0.04)'; c.beginPath(); c.moveTo(44, tY + 8); c.lineTo(w - 40, tY + 8); c.stroke();
        var flights = [
            ['AZ-1042', 'Tunis → Paris CDG', 'En vol', '#34C759', '186/220', '14:30'],
            ['AZ-2187', 'Tunis → Istanbul', 'Embarq.', '#FF9500', '142/180', '15:45'],
            ['AZ-0891', 'Monastir → Lyon', 'Prévu', '#2D9CDB', '98/160', '17:00'],
            ['AZ-3341', 'Djerba → Marseille', 'Terminé', '#64748b', '175/175', '12:15'],
            ['AZ-4520', 'Tunis → Rome', 'En vol', '#34C759', '160/190', '13:00']
        ];
        for (var fl = 0; fl < 5; fl++) {
            var fy = tY + 24 + fl * 34;
            c.fillStyle = '#fff'; c.font = 'bold 11px sans-serif'; c.fillText(flights[fl][0], 44, fy);
            c.fillStyle = '#94a3b8'; c.font = '11px sans-serif'; c.fillText(flights[fl][1], 140, fy);
            c.fillStyle = flights[fl][3] + '20'; c.beginPath(); c.roundRect(374, fy - 10, 65, 18, 9); c.fill();
            c.fillStyle = flights[fl][3]; c.font = 'bold 9px sans-serif'; c.textAlign = 'center';
            c.fillText(flights[fl][2], 406, fy); c.textAlign = 'left';
            c.fillStyle = '#94a3b8'; c.font = '11px sans-serif'; c.fillText(flights[fl][4], 520, fy);
            c.fillText(flights[fl][5], w - 80, fy);
        }

        // REVENUE CHART (new section below fold)
        y = 720;
        c.fillStyle = 'rgba(255,255,255,0.02)'; c.beginPath(); c.roundRect(24, y, (w - 64) / 2, 220, 12); c.fill();
        c.fillStyle = '#fff'; c.font = 'bold 13px sans-serif'; c.fillText('Revenue par route', 44, y + 28);
        var routes = [['Tunis-Paris', 0.85, '#2D9CDB'], ['Tunis-Istanbul', 0.62, '#34C759'], ['Monastir-Lyon', 0.48, '#FF9500'], ['Djerba-Marseille', 0.55, '#AF52DE'], ['Tunis-Rome', 0.40, '#FF3B30']];
        for (var rri = 0; rri < 5; rri++) {
            var rry = y + 55 + rri * 32;
            c.fillStyle = '#94a3b8'; c.font = '11px sans-serif'; c.fillText(routes[rri][0], 44, rry);
            c.fillStyle = 'rgba(255,255,255,0.06)'; c.beginPath(); c.roundRect(200, rry - 8, 220, 10, 5); c.fill();
            c.fillStyle = routes[rri][2]; c.beginPath(); c.roundRect(200, rry - 8, 220 * routes[rri][1], 10, 5); c.fill();
        }

        // SATISFACTION DONUT
        var dx = (w - 64) / 2 + 44;
        c.fillStyle = 'rgba(255,255,255,0.02)'; c.beginPath(); c.roundRect(dx, y, (w - 64) / 2, 220, 12); c.fill();
        c.fillStyle = '#fff'; c.font = 'bold 13px sans-serif'; c.fillText('Satisfaction client', dx + 20, y + 28);
        var dcx = dx + (w - 64) / 4, dcy = y + 130, dr = 55;
        var segments = [[0.45, '#2D9CDB'], [0.25, '#34C759'], [0.18, '#FF9500'], [0.12, '#AF52DE']];
        var startA = -1.57;
        c.lineWidth = 14;
        for (var seg = 0; seg < segments.length; seg++) {
            c.strokeStyle = segments[seg][1]; c.beginPath();
            c.arc(dcx, dcy, dr, startA, startA + 6.28 * segments[seg][0]); c.stroke();
            startA += 6.28 * segments[seg][0];
        }
        c.fillStyle = '#fff'; c.font = 'bold 22px sans-serif'; c.textAlign = 'center';
        c.fillText('94%', dcx, dcy + 6);
        c.fillStyle = '#64748b'; c.font = '10px sans-serif'; c.fillText('Excellent', dcx, dcy + 22); c.textAlign = 'left';

        // FLEET STATUS
        y = 980;
        c.fillStyle = 'rgba(255,255,255,0.02)'; c.beginPath(); c.roundRect(24, y, w - 48, 200, 12); c.fill();
        c.fillStyle = '#fff'; c.font = 'bold 13px sans-serif'; c.fillText('État de la flotte', 44, y + 28);
        var planes = [
            ['A320neo', 'En service', '#34C759', '12/14'], ['B737-800', 'Maintenance', '#FF9500', '6/8'],
            ['A330-300', 'En service', '#34C759', '4/4'], ['ATR 72', 'En service', '#34C759', '8/10']
        ];
        for (var pli = 0; pli < 4; pli++) {
            var ply = y + 55 + pli * 36;
            c.fillStyle = '#fff'; c.font = 'bold 12px sans-serif'; c.fillText(planes[pli][0], 44, ply);
            c.fillStyle = planes[pli][2] + '20'; c.beginPath(); c.roundRect(250, ply - 11, 80, 20, 10); c.fill();
            c.fillStyle = planes[pli][2]; c.font = 'bold 10px sans-serif'; c.textAlign = 'center';
            c.fillText(planes[pli][1], 290, ply); c.textAlign = 'left';
            c.fillStyle = '#94a3b8'; c.font = '11px sans-serif'; c.fillText('Dispo: ' + planes[pli][3], 380, ply);
            // Mini progress bar
            var parts = planes[pli][3].split('/');
            var pct = parseInt(parts[0]) / parseInt(parts[1]);
            c.fillStyle = 'rgba(255,255,255,0.06)'; c.beginPath(); c.roundRect(520, ply - 6, 150, 8, 4); c.fill();
            c.fillStyle = planes[pli][2]; c.beginPath(); c.roundRect(520, ply - 6, 150 * pct, 8, 4); c.fill();
        }

        // DESTINATIONS MAP placeholder
        y = 1220;
        c.fillStyle = 'rgba(255,255,255,0.02)'; c.beginPath(); c.roundRect(24, y, w - 48, 250, 12); c.fill();
        c.fillStyle = '#fff'; c.font = 'bold 13px sans-serif'; c.fillText('Destinations populaires', 44, y + 28);
        // Simplified map dots
        var dests = [
            [200, y + 100, 'Tunis', '#2D9CDB'], [350, y + 85, 'Istanbul', '#FF9500'],
            [280, y + 70, 'Rome', '#34C759'], [250, y + 60, 'Paris', '#AF52DE'],
            [220, y + 75, 'Lyon', '#5CB8E6'], [240, y + 90, 'Marseille', '#FF3B30']
        ];
        // Grid background
        c.strokeStyle = 'rgba(45,156,219,0.05)'; c.lineWidth = 0.5;
        for (var gx = 44; gx < w - 40; gx += 40) { c.beginPath(); c.moveTo(gx, y + 45); c.lineTo(gx, y + 220); c.stroke(); }
        for (var gy = y + 45; gy < y + 220; gy += 40) { c.beginPath(); c.moveTo(44, gy); c.lineTo(w - 40, gy); c.stroke(); }
        // Dest dots and connections
        c.strokeStyle = 'rgba(45,156,219,0.15)'; c.lineWidth = 1;
        for (var ddi = 1; ddi < dests.length; ddi++) {
            c.beginPath(); c.moveTo(dests[0][0], dests[0][1]); c.lineTo(dests[ddi][0], dests[ddi][1]); c.stroke();
        }
        for (var ddi = 0; ddi < dests.length; ddi++) {
            c.fillStyle = dests[ddi][3]; c.beginPath(); c.arc(dests[ddi][0], dests[ddi][1], 6, 0, 6.28); c.fill();
            c.fillStyle = dests[ddi][3] + '30'; c.beginPath(); c.arc(dests[ddi][0], dests[ddi][1], 12, 0, 6.28); c.fill();
            c.fillStyle = '#fff'; c.font = '10px sans-serif'; c.fillText(dests[ddi][2], dests[ddi][0] + 15, dests[ddi][1] + 4);
        }

        // ALERTS
        y = 1510;
        c.fillStyle = 'rgba(255,255,255,0.02)'; c.beginPath(); c.roundRect(24, y, w - 48, 180, 12); c.fill();
        c.fillStyle = '#fff'; c.font = 'bold 13px sans-serif'; c.fillText('Alertes système', 44, y + 28);
        var alerts = [
            ['Retard AZ-2187 — 15 min', '#FF9500', 'Avertissement'],
            ['Maintenance A320 #7 planifiée', '#2D9CDB', 'Info'],
            ['Capacité max Tunis-Paris demain', '#FF3B30', 'Urgent'],
            ['Nouveau slot Djerba-Rome approuvé', '#34C759', 'Résolu']
        ];
        for (var ai = 0; ai < 4; ai++) {
            var ay = y + 50 + ai * 32;
            c.fillStyle = alerts[ai][1] + '10'; c.beginPath(); c.roundRect(36, ay - 12, w - 80, 26, 8); c.fill();
            c.fillStyle = alerts[ai][1]; c.beginPath(); c.arc(52, ay, 4, 0, 6.28); c.fill();
            c.fillStyle = '#fff'; c.font = '11px sans-serif'; c.fillText(alerts[ai][0], 68, ay + 4);
            c.fillStyle = alerts[ai][1] + '80'; c.font = 'bold 9px sans-serif'; c.fillText(alerts[ai][2], w - 120, ay + 4);
        }

        // CREW SCHEDULE
        y = 1730;
        c.fillStyle = 'rgba(255,255,255,0.02)'; c.beginPath(); c.roundRect(24, y, w - 48, 180, 12); c.fill();
        c.fillStyle = '#fff'; c.font = 'bold 13px sans-serif'; c.fillText('Planning équipage', 44, y + 28);
        var crew = [
            ['Cpt. Mehdi B.', 'AZ-1042', 'En vol', '#34C759'],
            ['Cpt. Salma K.', 'AZ-2187', 'Briefing', '#FF9500'],
            ['F/O Ahmed T.', 'AZ-0891', 'Stand-by', '#2D9CDB'],
            ['Cpt. Nour L.', 'AZ-3341', 'Repos', '#64748b']
        ];
        for (var ci = 0; ci < 4; ci++) {
            var cy = y + 55 + ci * 30;
            c.fillStyle = 'rgba(45,156,219,0.1)'; c.beginPath(); c.arc(52, cy - 2, 12, 0, 6.28); c.fill();
            c.fillStyle = '#fff'; c.font = 'bold 10px sans-serif'; c.textAlign = 'center';
            c.fillText(crew[ci][0][0], 52, cy + 2); c.textAlign = 'left';
            c.fillStyle = '#fff'; c.font = '11px sans-serif'; c.fillText(crew[ci][0], 74, cy);
            c.fillStyle = '#94a3b8'; c.font = '11px sans-serif'; c.fillText(crew[ci][1], 250, cy);
            c.fillStyle = crew[ci][3]; c.font = 'bold 10px sans-serif'; c.fillText(crew[ci][2], 400, cy);
        }
    }

    // Pre-render all content
    drawLaptop();
    drawPhone();
    drawTablet();

    // Export
    window.ideepContent = {
        laptop: { canvas: lc, height: 2400 },
        phone: { canvas: pc, height: 2500 },
        tablet: { canvas: tc, height: 2000 }
    };
})();
