let scene = new THREE.Scene(),
    width = window.innerWidth,
    height = window.innerHeight,
    camera = new THREE.PerspectiveCamera(80, width / height, 0.1, 1000);

let loader = new THREE.OBJLoader();
let gltfLoader = new THREE.GLTFLoader();

let gltfScene, gltfCamera;
gltfLoader.load('static/blenderFiles/exportTest.glb', function(gltf) {
    console.log('GLTF:', gltf.cameras);
    gltfScene = gltf.scene;
    // scene.add(gltfScene);
    console.log(gltfScene);
});




let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

function onMouseMove(event) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

window.addEventListener('mousemove', onMouseMove, false);
















let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(width, height);
renderer.shadowMapEnabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(0x110033);
renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;
console.log(renderer);
document.body.appendChild(renderer.domElement);
controls = new THREE.OrbitControls(camera, renderer.domElement);

let ambient = new THREE.AmbientLight(0xffffff, 0.5);

let point = new THREE.PointLight(0xffffff, 0.8);
point.position.set(0, 16, 0);
point.castShadow = true;
point.shadow.mapSize.width = 2048;
point.shadow.mapSize.height = 2048;

let floor = new THREE.Mesh(
    new THREE.PlaneGeometry(32, 32),
    new THREE.MeshPhongMaterial({color: 0xD79B33, side: THREE.DoubleSide})
    );
floor.receiveShadow = true;
floor.position.y = -2;
floor.rotation.x = degToRad(90);
floor.rotation.z = degToRad(45);

let wall = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshPhongMaterial({color: 0x7F00FF, side: THREE.DoubleSide})
    );
wall.position.set(0, 2, -3);
wall.rotation.z = degToRad(45);

let box = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1.6, 1),
    new THREE.MeshLambertMaterial({color: 0x00A8FF})
    );
box.position.set(0, 1.2, 0);
box.castShadow = true;
console.log(box);

let sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1),
    new THREE.MeshNormalMaterial({wireframe: true})
    );

camera.position.z = 5;

let sceneArray = [
    ambient,
    point,
    // floor,
    sphere,
    // wall,
    // box,
];

sceneArray.forEach(x => scene.add(x));

function animate() {
    requestAnimationFrame(animate);

    controls.update();
    raycaster.setFromCamera(mouse, camera);

    box.rotation.x += 0.011;
    box.rotation.y += 0.01;
    box.rotation.z += 0.04;

    renderer.render(scene, camera);
}

animate();

function degToRad(deg) {
    return deg * (Math.PI / 180);
}