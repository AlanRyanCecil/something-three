let scene = new THREE.Scene(),
    width = window.innerWidth,
    height = window.innerHeight,
    // container = document.getElementById('world'),
    // width = container.clientWidth,
    // height = width / 2,
    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 300),
    ambient = new THREE.AmbientLight(0xECF4F7, 1.8),
    sceneObjects = [],
    intersects;

let skyColor = 0x67B2DC;

// scene.fog = new THREE.Fog(0xE6E0D5, 5, 20);


camera.position.set(38, 28, 38);
console.log(camera);

let renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(width, height);
renderer.setClearColor(skyColor);
renderer.shadowMapEnabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;
renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;
document.body.appendChild(renderer.domElement);
// container.appendChild(renderer.domElement);

let controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, -5, 0);
// controls.autoRotate = true;
controls.autoRotateSpeed = -4;

let loader = new THREE.GLTFLoader();
loader.load('static/blenderFiles/world.glb', function(gltf) {
    gltf.scene.traverse(function(node) {
        if (node instanceof THREE.Mesh) {
            console.log('Mesh:', node.name);
            node.castShadow = true;
            node.receiveShadow = true;
            sceneObjects.push(node);
        }
        if (node instanceof THREE.DirectionalLight) {
            console.log('light:', node);
            node.shadow.mapSize.width = 2048;
            node.shadow.mapSize.height = 2048;
            node.castShadow = true;
            node.intensity = node.intensity * 0.3;
        }
        if (node.name == 'sky') {
            console.log('sky:', node);
            node.castShadow = false;
            node.receiveShadow = false;
        }
    });
    scene.add(gltf.scene);
});

let raycaster = new THREE.Raycaster(),
    mouse = new THREE.Vector2();

let colorTimer = null;

function onMouseDown(event) {
    console.log('camera position:', camera.position);
    if (colorTimer) {
        return;
    }
    mouse.x = (event.offsetX / width) * 2 - 1;
    mouse.y = -(event.offsetY / height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects(sceneObjects);
    if (intersects.length) {
        // clickColor(intersects[0]);
    }
}
window.addEventListener('mousedown', onMouseDown, false);

let sceneArray = [
    ambient,
];

sceneArray.forEach(x => scene.add(x));

function animate() {
    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
}

animate();

function clickColor(mesh) {
    let originalColor = new THREE.Color(mesh.object.material.color);
    mesh.object.material.color.set(Math.random() * 0xFFFFFF);
    colorTimer = setTimeout(function() {
        mesh.object.material.color.set(originalColor);
        colorTimer = null;
    }, 200);
}

function animateVector3(vectorToAnimate, target, options) {
    options = options || {};
    var to = target || THREE.Vector3(),
        easing = options.easing || TWEEN.Easing.Quadratic.In,
        duration = options.duration || 2000;
    var tweenVector3 = new TWEEN.Tween(vectorToAnimate)
        .to({
            x: to.x,
            y: to.y,
            z: to.z,
        }, duration)
        .easing(easing)
        .onUpdate(function(d) {
            if (options.update) {
                options.update(d);
            }
        })
        .onComplete(function() {
            if (options.callback) options.callback();
        });
    tweenVector3.start();
    return tweenVector3;
}

function degToRad(deg) {
    return deg * (Math.PI / 180);
}