// js/particles.js
class ParticleBackground {
    constructor() {
        this.init();
    }

    async init() {
        // Only load Three.js if WebGL is supported
        if (!this.isWebGLSupported() || window.innerWidth < 768) {
            console.log('3D background disabled for mobile or unsupported browsers');
            return;
        }

        try {
            // Dynamically import Three.js (reduces initial load)
            const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js');
            this.setupScene(THREE);
        } catch (error) {
            console.log('Could not load 3D background:', error);
        }
    }

    isWebGLSupported() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && 
                (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    setupScene(THREE) {
        // Scene setup
        this.scene = new THREE.Scene();
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 15;
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        
        // Add canvas to background
        const canvasContainer = document.createElement('div');
        canvasContainer.id = 'particle-canvas';
        canvasContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
        `;
        document.body.prepend(canvasContainer);
        canvasContainer.appendChild(this.renderer.domElement);
        
        // Create particles
        this.createParticles(THREE);
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // Handle resize
        window.addEventListener('resize', () => this.onResize(THREE));
        
        // Start animation
        this.animate();
    }

    createParticles(THREE) {
        const particleCount = 1500;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        // Your color scheme (blue/teal theme)
        const color1 = { r: 0, g: 180, b: 255 }; // Blue
        const color2 = { r: 0, g: 220, b: 200 }; // Teal
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            // Random positions in a sphere
            const radius = 20;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i + 2] = radius * Math.cos(phi);
            
            // Color gradient
            const mix = Math.random();
            colors[i] = (color1.r * (1 - mix) + color2.r * mix) / 255;
            colors[i + 1] = (color1.g * (1 - mix) + color2.g * mix) / 255;
            colors[i + 2] = (color2.b * (1 - mix) + color1.b * mix) / 255;
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.particles) {
            this.particles.rotation.x += 0.001;
            this.particles.rotation.y += 0.002;
        }
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    onResize(THREE) {
        if (!this.camera || !this.renderer) return;
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    new ParticleBackground();
});