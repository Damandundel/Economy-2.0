let scene, camera, renderer, rocket, nose, controls;
const noseVariants = {
    cone1: { height: 1, radius: 0.5, segments: 32 },
    cone2: { height: 0.8, radius: 0.6, segments: 32 },
    cone3: { height: 1.2, radius: 0.4, segments: 32 }
};

function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x16213e);
    
    // Camera setup - higher and further back
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 3, 8);
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('threejs-container').appendChild(renderer.domElement);
    
    // OrbitControls for mouse interaction
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 5;
    controls.maxDistance = 15;
    controls.maxPolarAngle = Math.PI * 0.9;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5);
    scene.add(hemisphereLight);
    
    // Create rocket
    createRocket();
    
    // Add subtle auto-rotation when not interacting
    let autoRotate = true;
    let autoRotateSpeed = 0.2;
    
    controls.addEventListener('start', () => {
        autoRotate = false;
    });
    
    controls.addEventListener('end', () => {
        autoRotate = true;
    });
    
    // Event listeners
    window.addEventListener('resize', onWindowResize);
    
    // Control listeners
    document.getElementById('noseDropdown').addEventListener('change', updateNose);
    document.getElementById('colorDropdown').addEventListener('change', updateNoseColor);
    document.getElementById('resetView').addEventListener('click', resetView);
    
    // Start animation
    animate();
    
    function animate() {
        requestAnimationFrame(animate);
        
        if (autoRotate && !controls.enabled) {
            rocket.rotation.y += autoRotateSpeed * 0.01;
        }
        
        controls.update();
        renderer.render(scene, camera);
    }
}

function createRocket() {
    // Rocket body
    const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 32);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xaaaaaa,
        metalness: 0.3,
        roughness: 0.7
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1.5;
    body.castShadow = true;
    
    // Fins
    const finGeometry = new THREE.BoxGeometry(0.1, 0.5, 1);
    const finMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x666666,
        metalness: 0.2,
        roughness: 0.8
    });
    
    const fin1 = new THREE.Mesh(finGeometry, finMaterial);
    fin1.position.set(0.5, 1.5, 0);
    fin1.rotation.z = Math.PI / 4;
    
    const fin2 = new THREE.Mesh(finGeometry, finMaterial);
    fin2.position.set(-0.5, 1.5, 0);
    fin2.rotation.z = -Math.PI / 4;
    
    const fin3 = new THREE.Mesh(finGeometry, finMaterial);
    fin3.position.set(0, 1.5, 0.5);
    fin3.rotation.x = Math.PI / 4;
    
    const fin4 = new THREE.Mesh(finGeometry, finMaterial);
    fin4.position.set(0, 1.5, -0.5);
    fin4.rotation.x = -Math.PI / 4;
    
    // Initial nose cone
    const noseParams = noseVariants.cone1;
    const noseGeometry = new THREE.ConeGeometry(
        noseParams.radius, 
        noseParams.height, 
        noseParams.segments
    );
    const noseMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xff0000,
        metalness: 0.5,
        roughness: 0.5
    });
    nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.y = 3 + noseParams.height/2;
    nose.castShadow = true;
    
    // Rocket group
    rocket = new THREE.Group();
    rocket.add(body);
    rocket.add(fin1);
    rocket.add(fin2);
    rocket.add(fin3);
    rocket.add(fin4);
    rocket.add(nose);
    scene.add(rocket);
    
    // Add grid helper
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);
}

function updateNose() {
    const selectedNose = document.getElementById('noseDropdown').value;
    const params = noseVariants[selectedNose];
    
    // Remove old nose
    rocket.remove(nose);
    
    // Create new nose
    const noseGeometry = new THREE.ConeGeometry(
        params.radius, 
        params.height, 
        params.segments
    );
    const currentColor = nose.material.color.getHex();
    const noseMaterial = new THREE.MeshPhongMaterial({ 
        color: currentColor,
        metalness: 0.5,
        roughness: 0.5
    });
    nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.y = 3 + params.height/2;
    nose.castShadow = true;
    
    rocket.add(nose);
}

function updateNoseColor() {
    const color = document.getElementById('colorDropdown').value;
    nose.material.color.set(color);
}

function resetView() {
    controls.reset();
    camera.position.set(0, 3, 8);
    controls.update();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize the scene
init();