let scene = new THREE.Scene(),
    width = window.innerWidth,
    height = window.innerHeight,
    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000),
    intersects;

camera.position.set(0, 1, -2);
console.log('camera:', camera);

let loader = new THREE.GLTFLoader();
loader.load('static/blenderFiles/blenderScene.glb', function(gltf) {
    gltf.scene.traverse(function(node) {
        if (node instanceof THREE.Mesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }

        if (node instanceof THREE.SpotLight) {
            node.castShadow = true;
            node.intensity = node.intensity * 10;
        }
    });
    console.log('gltf:', gltf);
    scene.add(gltf.scene);
    console.log('scene:', scene);
});

let raycaster = new THREE.Raycaster(),
    mouse = new THREE.Vector2();

let colorTimer = null;
function onMouseDown(event) {
    if (colorTimer) { return; }
    console.log(event);
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects(scene.children[0].children);
    if (intersects.length) {
        let originalColor = new THREE.Color(intersects[0].object.material.color);
        intersects[0].object.material.color.set(0x333333);
        colorTimer = setTimeout(function() {
            intersects[0].object.material.color.set(originalColor);
            colorTimer = null;
        }, 200);
    }
}
window.addEventListener('mousedown', onMouseDown, false);

let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(width, height);
renderer.shadowMapEnabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;
renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;
console.log('renderer:', renderer);
document.body.appendChild(renderer.domElement);

let controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1, -8);

let sceneArray = [
];

sceneArray.forEach(x => scene.add(x));

function animate() {
    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
}

animate();

function clickColor(mesh) {
    let originalColor = mesh.object.material.color;
    mesh.object.material.color.set(0x666666);
    setTimeout(function() {
        mesh.object.material.color.set(originalColor);
    }, 300);
}


function degToRad(deg) {
    return deg * (Math.PI / 180);
}