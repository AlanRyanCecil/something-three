let scene = new THREE.Scene(),
    width = window.innerWidth,
    height = window.innerHeight,
    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000),
    sceneObjects = [],
    intersects;


camera.position.set(0, 1, -2);
console.log('camera:', camera);

let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(width, height);
renderer.setClearColor(0xE6E0D5);
renderer.shadowMapEnabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;
renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;
console.log('renderer:', renderer);
document.body.appendChild(renderer.domElement);

let controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1, -8);

let loader = new THREE.GLTFLoader();
loader.load('static/blenderFiles/blenderScene.glb', function(gltf) {
    gltf.scene.traverse(function(node) {
        console.log('type:', node.name);
        if (node instanceof THREE.Mesh) {
            node.castShadow = true;
            node.receiveShadow = true;
            sceneObjects.push(node);
        }
        if (node instanceof THREE.DirectionalLight) {
            node.castShadow = true;
            node.intensity = node.intensity * 1;
        }
        if (node.name === 'floor') {
            node.material = new THREE.ShadowMaterial();
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
    intersects = raycaster.intersectObjects(sceneObjects);
    if (intersects.length) {
        animateVector3(intersects[0].object.position, new THREE.Vector3(120, 12, 12));

        let originalColor = new THREE.Color(intersects[0].object.material.color);
        intersects[0].object.material.color.set(0x333333);
        colorTimer = setTimeout(function() {
            intersects[0].object.material.color.set(originalColor);
            colorTimer = null;
        }, 200);
    }
}
window.addEventListener('mousedown', onMouseDown, false);

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
    mesh.object.material.color.set(0xFFFFFF);
    let colorChange = new TWEEN.Tween()
    setTimeout(function() {
        mesh.object.material.color.set(originalColor);
    }, 300);
}

function animateVector3(vectorToAnimate, target, options){
    options = options || {};
    var to = target || THREE.Vector3(),
        easing = options.easing || TWEEN.Easing.Quadratic.In,
        duration = options.duration || 2000;
    var tweenVector3 = new TWEEN.Tween(vectorToAnimate)
        .to({ x: to.x, y: to.y, z: to.z, }, duration)
        .easing(easing)
        .onUpdate(function(d) {
            if(options.update){ 
                options.update(d);
            }
         })
        .onComplete(function(){
          if(options.callback) options.callback();
        });
    tweenVector3.start();
    return tweenVector3;
}

function degToRad(deg) {
    return deg * (Math.PI / 180);
}