const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);


const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 2).normalize();
scene.add(light);


let rocketBody, noseCone, fins = [];

function createRocketBody(color = "red") {
    if (rocketBody) scene.remove(rocketBody);
    const geometry = new THREE.CylinderGeometry(1, 1, 5, 32);
    const material = new THREE.MeshStandardMaterial({ color });
    rocketBody = new THREE.Mesh(geometry, material);
    scene.add(rocketBody);
}


function createFin(type, color) {
    const geometry = new THREE.BufferGeometry();
    let vertices;

    switch (type) {
        case "delta":
            vertices = new Float32Array([-1, 0, 0, 1, 0, 0, 2, 2, -3]);
            break;
        case "curved":
            vertices = new Float32Array([-1, 0, 0, 1, 0, 0, 0, 2, -2]);
            break;
        default:
            vertices = new Float32Array([-1, 0, 0, 1, 0, 0, 0, 1.5, -2]);
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({ color, side: THREE.DoubleSide });
    const fin = new THREE.Mesh(geometry, material);

    const edgeGeo = new THREE.EdgesGeometry(geometry);
    const edges = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: 0x000000 }));
    fin.add(edges);

    return fin;
}

function updateFins(type, color) {
    fins.forEach(fin => scene.remove(fin));
    fins = [];

    for (let i = 0; i < 3; i++) {
        const fin = createFin(type, color);
        fin.position.y = -2.5;
        fin.rotation.y = (i * Math.PI * 2) / 3;
        scene.add(fin);
        fins.push(fin);
    }
}


function createNose(type = "cone", color = "red") {
    if (noseCone) scene.remove(noseCone);

    let geometry;
    switch (type) {
        case "rounded":
            geometry = new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
            break;
        case "sharp":
            geometry = new THREE.ConeGeometry(0.6, 2.5, 32);
            break;
        default: 
            geometry = new THREE.ConeGeometry(1, 2, 32);
    }

    const material = new THREE.MeshStandardMaterial({ color });
    noseCone = new THREE.Mesh(geometry, material);
    noseCone.position.y = 3.5;
    scene.add(noseCone);
}

function updateRocket() {
    const finType = document.getElementById("finSelector").value;
    const finColor = document.getElementById("finColor").value;
    const bodyColor = document.getElementById("bodyColor").value;
    const noseType = document.getElementById("noseType").value;

    createRocketBody(bodyColor);
    updateFins(finType, finColor);
    createNose(noseType, bodyColor);
}


["finSelector", "finColor", "bodyColor", "noseType"].forEach(id => {
    document.getElementById(id).addEventListener("change", updateRocket);
});

camera.position.z = 10;
updateRocket();

function animate() {
    requestAnimationFrame(animate);
    rocketBody.rotation.y += 0.01;
    noseCone.rotation.y += 0.01;
    fins.forEach(fin => fin.rotation.y += 0.01);
    renderer.render(scene, camera);
}
animate();
