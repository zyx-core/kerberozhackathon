document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('three-bg');

    // Scene setup
    const scene = new THREE.Scene();
    // Soft white fog to blend with background if needed, but keeping it dark style for now
    // scene.fog = new THREE.FogExp2(0x0a192f, 0.002); 

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 500;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Leaf Texture Generator (Procedural leaf shape using Canvas)
    function createLeafTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(16, 4);
        ctx.bezierCurveTo(4, 8, 4, 24, 16, 28);
        ctx.bezierCurveTo(28, 24, 28, 8, 16, 4);
        ctx.fill();

        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }

    const leafTexture = createLeafTexture();
    const leafGeo = new THREE.PlaneGeometry(15, 15);

    // Variety of leaf colors (Greens and slightly yellowish for variety)
    const leafColors = [
        0x00ff88, // Neon green (keeping theme)
        0x4caf50, // Standard green
        0x8bc34a, // Light green
        0x00e676  // Bright green
    ];

    const leafCount = 200;
    const leaves = [];

    for (let i = 0; i < leafCount; i++) {
        const material = new THREE.MeshBasicMaterial({
            map: leafTexture,
            color: leafColors[Math.floor(Math.random() * leafColors.length)],
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7,
            alphaTest: 0.5
        });

        const leaf = new THREE.Mesh(leafGeo, material);

        // Random starting position
        leaf.position.x = Math.random() * 2000 - 1000;
        leaf.position.y = Math.random() * 2000 - 1000;
        leaf.position.z = Math.random() * 1000 - 500;

        // Random rotation
        leaf.rotation.x = Math.random() * Math.PI;
        leaf.rotation.y = Math.random() * Math.PI;
        leaf.rotation.z = Math.random() * Math.PI;

        // Custom velocity properties for falling and swaying
        leaf.userData = {
            velocity: {
                y: -(Math.random() * 2 + 1), // Falling speed
                x: (Math.random() - 0.5) * 1.5, // Sway speed
                z: (Math.random() - 0.5) * 1.5  // Depth sway
            },
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.05,
                y: (Math.random() - 0.5) * 0.05,
                z: (Math.random() - 0.5) * 0.05
            }
        };

        scene.add(leaf);
        leaves.push(leaf);
    }

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        leaves.forEach(leaf => {
            // Move position
            leaf.position.y += leaf.userData.velocity.y;
            leaf.position.x += Math.sin(Date.now() * 0.001 + leaf.position.y * 0.01) * 0.5; // Sine wave sway
            leaf.position.z += Math.cos(Date.now() * 0.001 + leaf.position.y * 0.01) * 0.5;

            // Rotate (tumble)
            leaf.rotation.x += leaf.userData.rotationSpeed.x;
            leaf.rotation.y += leaf.userData.rotationSpeed.y;
            leaf.rotation.z += leaf.userData.rotationSpeed.z;

            // Reset if out of view (bottom)
            if (leaf.position.y < -1000) {
                leaf.position.y = 1000;
                leaf.position.x = Math.random() * 2000 - 1000;
                leaf.position.z = Math.random() * 1000 - 500;
            }
        });

        renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
