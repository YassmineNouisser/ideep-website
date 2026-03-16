/* ============================================
   IDeep — Three.js Particle Network
   ============================================ */
(function () {
    var canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    var isMobile = window.innerWidth < 768;
    var PARTICLE_COUNT = isMobile ? 150 : 400;
    var CONNECT_DIST = 130;
    var MAX_LINES = isMobile ? 0 : 100;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 600;

    // Particles
    var geo = new THREE.BufferGeometry();
    var positions = new Float32Array(PARTICLE_COUNT * 3);
    var velocities = [];

    for (var i = 0; i < PARTICLE_COUNT; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 1800;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 1800;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 800;
        velocities.push(
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.15 - 0.05,
            (Math.random() - 0.5) * 0.1
        );
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    var mat = new THREE.PointsMaterial({
        color: 0x3AAFFF,
        size: isMobile ? 1.5 : 2,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
    });

    var points = new THREE.Points(geo, mat);
    scene.add(points);

    // Lines
    var linesMesh = null;
    if (!isMobile) {
        linesMesh = new THREE.LineSegments(
            new THREE.BufferGeometry(),
            new THREE.LineBasicMaterial({
                color: 0x2D9CDB,
                transparent: true,
                opacity: 0.04,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            })
        );
        scene.add(linesMesh);
    }

    // Mouse
    var mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    document.addEventListener('mousemove', function (e) {
        mouse.tx = (e.clientX / window.innerWidth - 0.5) * 30;
        mouse.ty = (e.clientY / window.innerHeight - 0.5) * 30;
    });

    var frame = 0;

    function animate() {
        requestAnimationFrame(animate);
        if (document.hidden) return;
        frame++;

        // Lerp mouse
        mouse.x += (mouse.tx - mouse.x) * 0.02;
        mouse.y += (mouse.ty - mouse.y) * 0.02;

        var progress = window.scrollProgress || 0;
        camera.position.x = mouse.x;
        camera.position.y = -mouse.y;
        camera.position.z = 600 - progress * 150;
        camera.lookAt(0, 0, 0);

        // Move particles
        var p = geo.attributes.position.array;
        for (var i = 0; i < PARTICLE_COUNT; i++) {
            var i3 = i * 3;
            p[i3] += velocities[i3];
            p[i3 + 1] += velocities[i3 + 1];
            p[i3 + 2] += velocities[i3 + 2];

            if (p[i3] > 900) p[i3] = -900;
            if (p[i3] < -900) p[i3] = 900;
            if (p[i3 + 1] > 900) p[i3 + 1] = -900;
            if (p[i3 + 1] < -900) p[i3 + 1] = 900;
            if (p[i3 + 2] > 400) p[i3 + 2] = -400;
            if (p[i3 + 2] < -400) p[i3 + 2] = 400;
        }
        geo.attributes.position.needsUpdate = true;

        // Lines every 4 frames
        if (linesMesh && frame % 4 === 0) {
            var lp = [];
            var count = 0;
            var step = Math.max(1, Math.floor(PARTICLE_COUNT / 80));
            for (var a = 0; a < PARTICLE_COUNT && count < MAX_LINES; a += step) {
                for (var b = a + step; b < PARTICLE_COUNT && count < MAX_LINES; b += step) {
                    var a3 = a * 3, b3 = b * 3;
                    var dx = p[a3] - p[b3], dy = p[a3+1] - p[b3+1], dz = p[a3+2] - p[b3+2];
                    if (dx*dx + dy*dy + dz*dz < CONNECT_DIST * CONNECT_DIST) {
                        lp.push(p[a3], p[a3+1], p[a3+2], p[b3], p[b3+1], p[b3+2]);
                        count++;
                    }
                }
            }
            var lg = new THREE.BufferGeometry();
            lg.setAttribute('position', new THREE.Float32BufferAttribute(lp, 3));
            if (linesMesh.geometry) linesMesh.geometry.dispose();
            linesMesh.geometry = lg;
        }

        points.rotation.y += 0.00015;

        renderer.render(scene, camera);
    }

    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
})();
