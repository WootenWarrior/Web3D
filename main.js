import * as THREE from "three";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.128/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.128/examples/jsm/controls/OrbitControls.js';

// Initialisation
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const container = document.getElementById('threejs-container');
const width = container.clientWidth;
const height = container.clientHeight;
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
const loader = new GLTFLoader();
const clock = new THREE.Clock();
let activeModel;

function init() {
    camera.position.z = 5;
    scene.add(ambientLight);
    scene.add(directionalLight);
    renderer.setSize(width, height);
    document.getElementById('threejs-container').appendChild(renderer.domElement);
    console.log("init")
}
init();

function loadModel(modelPath, scale) {
    loader.load(modelPath, function (gltf) {
        gltf.scene.scale.set(scale, scale, scale);
        activeModel = gltf.scene;
        const mixer = new THREE.AnimationMixer(activeModel);
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                console.log(child.name);
            }
        });
        scene.add(gltf.scene);
    });
}

loadModel('assets/cup.glb', 0.75);

window.addEventListener('resize', () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    renderer.setSize(newWidth, newHeight);
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
});

function animate() {
    if (activeModel) {
        const deltaTime = clock.getDelta();
        activeModel.rotation.x = Math.sin(clock.elapsedTime) * 0.5;
        activeModel.rotation.y += deltaTime * 0.5;
    }
	renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0, 0);
controls.update();