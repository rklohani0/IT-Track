/* ============================================
   IT TRACK — 3D WEBSITE JAVASCRIPT
   Three.js Background + Interactions + Effects
   ============================================ */

// =============================================
// 1. THREE.JS — 3D PARTICLE GALAXY BACKGROUND
// =============================================
(function initThreeBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- Particles ---
    const particlesCount = 2500;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const colorPalette = [
        [0, 0.94, 1],       // cyan
        [0.48, 0.18, 0.97], // purple
        [1, 0.18, 0.46],    // pink
        [0.22, 1, 0.08],    // green
    ];

    for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        const radius = Math.random() * 15 + 2;
        const angle = Math.random() * Math.PI * 2;
        const height = (Math.random() - 0.5) * 20;

        positions[i3]     = Math.cos(angle) * radius + (Math.random() - 0.5) * 3;
        positions[i3 + 1] = height;
        positions[i3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 3;

        const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i3]     = c[0];
        colors[i3 + 1] = c[1];
        colors[i3 + 2] = c[2];
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.035,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // --- Floating Wireframe Shapes ---
    const shapes = [];
    const shapeMaterial = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        wireframe: true,
        transparent: true,
        opacity: 0.1,
    });

    for (let i = 0; i < 6; i++) {
        const geometries = [
            new THREE.IcosahedronGeometry(0.6 + Math.random(), 0),
            new THREE.OctahedronGeometry(0.5 + Math.random(), 0),
            new THREE.TetrahedronGeometry(0.5 + Math.random(), 0),
        ];
        const geo = geometries[Math.floor(Math.random() * geometries.length)];
        const mat = shapeMaterial.clone();
        mat.color.setHSL(Math.random() * 0.3 + 0.5, 1, 0.5);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15
        );
        mesh.userData = {
            rotSpeed: { x: Math.random() * 0.01, y: Math.random() * 0.01, z: Math.random() * 0.005 },
            floatSpeed: 0.003 + Math.random() * 0.005,
            floatOffset: Math.random() * Math.PI * 2,
        };
        scene.add(mesh);
        shapes.push(mesh);
    }

    // --- Connection Lines ---
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.04,
    });

    const linePositions = [];
    for (let i = 0; i < 60; i++) {
        const idx1 = Math.floor(Math.random() * particlesCount) * 3;
        const idx2 = Math.floor(Math.random() * particlesCount) * 3;
        linePositions.push(
            positions[idx1], positions[idx1 + 1], positions[idx1 + 2],
            positions[idx2], positions[idx2 + 1], positions[idx2 + 2]
        );
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeo, lineMaterial);
    scene.add(lines);

    camera.position.z = 8;
    camera.position.y = 2;

    // Mouse tracking
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Animation loop
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        // Rotate particles
        particles.rotation.y = elapsed * 0.05;
        particles.rotation.x = Math.sin(elapsed * 0.02) * 0.1;

        // Animate shapes
        shapes.forEach((s) => {
            s.rotation.x += s.userData.rotSpeed.x;
            s.rotation.y += s.userData.rotSpeed.y;
            s.rotation.z += s.userData.rotSpeed.z;
            s.position.y += Math.sin(elapsed * s.userData.floatSpeed * 10 + s.userData.floatOffset) * 0.003;
        });

        // Lines rotate
        lines.rotation.y = elapsed * 0.02;

        // Camera follow mouse
        camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 1.0 + 2 - camera.position.y) * 0.02;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();


// =============================================
// 2. PRELOADER
// =============================================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 1500);
    }
});


// =============================================
// 3. NAVBAR — Scroll Effect & Active Links
// =============================================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    // Navbar background
    if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }

    // Active nav link based on scroll position
    let current = '';
    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 200;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });

    // Back to top button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.classList.toggle('visible', window.scrollY > 400);
    }
});


// =============================================
// 4. HAMBURGER MENU (Mobile)
// =============================================
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('navLinks');

if (hamburger && navLinksContainer) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinksContainer.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navLinksContainer.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinksContainer.classList.remove('open');
        });
    });
}


// =============================================
// 5. SCROLL REVEAL ANIMATIONS (Custom AOS)
// =============================================
function revealOnScroll() {
    const elements = document.querySelectorAll('[data-aos]');
    const windowHeight = window.innerHeight;

    elements.forEach((el) => {
        const elementTop = el.getBoundingClientRect().top;
        const delay = parseInt(el.getAttribute('data-delay')) || 0;

        if (elementTop < windowHeight - 80) {
            setTimeout(() => {
                el.classList.add('visible');
            }, delay);
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', () => {
    setTimeout(revealOnScroll, 200);
});


// =============================================
// 6. COUNTING ANIMATION FOR STATS
// =============================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const rect = counter.getBoundingClientRect();
        if (rect.top < window.innerHeight && !counter.classList.contains('counted')) {
            counter.classList.add('counted');
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current);
            }, 16);
        }
    });
}

window.addEventListener('scroll', animateCounters);
window.addEventListener('load', () => setTimeout(animateCounters, 1800));


// =============================================
// 7. 3D TILT EFFECT ON CARDS
// =============================================
document.querySelectorAll('.card-3d').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});


// =============================================
// 8. CARD GLOW FOLLOW MOUSE
// =============================================
document.querySelectorAll('.course-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
        const glow = card.querySelector('.card-glow');
        if (!glow) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0, 240, 255, 0.12) 0%, transparent 60%)`;
        glow.style.opacity = '1';
    });

    card.addEventListener('mouseleave', () => {
        const glow = card.querySelector('.card-glow');
        if (glow) glow.style.opacity = '0';
    });
});


// =============================================
// 9. CONTACT FORM HANDLER
// =============================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> <span>Message Sent!</span>';
        btn.style.background = 'linear-gradient(135deg, #39ff14, #00f0ff)';

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            contactForm.reset();
        }, 3000);
    });
}


// =============================================
// 10. SMOOTH SCROLL FOR ALL ANCHOR LINKS
// =============================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});


// =============================================
// 11. TYPED TEXT EFFECT (optional enhancement)
// =============================================
(function typeEffect() {
    const badge = document.querySelector('.hero-badge');
    if (!badge) return;

    const texts = [
        '#1 Computer Training Center',
        'Shaping Future Tech Leaders',
        'Learn AI, Python & More',
        'Your Career Starts Here',
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const current = texts[textIndex];
        const icon = '<i class="fas fa-rocket"></i> ';

        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }

        badge.innerHTML = icon + current.substring(0, charIndex);

        let speed = isDeleting ? 30 : 60;

        if (!isDeleting && charIndex === current.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            speed = 500;
        }

        setTimeout(type, speed);
    }

    setTimeout(type, 2500);
})();


// =============================================
// 12. PARALLAX EFFECT ON SCROLL
// =============================================
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const hero = document.querySelector('.hero-content');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - scrolled / (window.innerHeight * 0.8);
    }
});


// =============================================
// 13. CONSOLE EASTER EGG
// =============================================
console.log(
    '%c🚀 IT TRACK — Computer Center',
    'color: #00f0ff; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #00f0ff;'
);
console.log(
    '%cBuilt with ❤️ using HTML, CSS, JavaScript, Three.js & Python',
    'color: #7b2ff7; font-size: 12px;'
);
