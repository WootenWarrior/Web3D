import * as THREE from "three";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.128/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.128/examples/jsm/controls/OrbitControls.js';

// Initialisation
const container = document.getElementById('threejs-container');
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({canvas: container, alpha: true});
renderer.setClearColor('#ffcc00', 1);
renderer.setPixelRatio(window.devicePixelRatio)
const width = window.innerWidth;
const height = window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
const loader = new GLTFLoader();
const clock = new THREE.Clock();
const listener = new THREE.AudioListener();
camera.add(listener);
const soundSource = new THREE.Audio(listener);
let activeModel;
let mixer;
let animations = [];

function init() {
    camera.position.z = 5;
    scene.add(ambientLight);
    renderer.setSize(width, height);
    ambientLight.position.set(0,0,0);
    scene.background = new THREE.Color(0xffcc00);
    console.log("init")
}
init();

function loadModel(modelPath, scale, onLoaded) {
    if (mixer) {
        mixer.stopAllAction();
    }
    loader.load(modelPath, function (gltf) {
        gltf.scene.scale.set(scale, scale, scale);
        activeModel = gltf.scene;
        mixer = new THREE.AnimationMixer(activeModel);
        animations = gltf.animations;
        scene.add(gltf.scene);

        if (onLoaded) onLoaded();
    });
    console.log(`model ${modelPath} loaded`)
}

function getModel() {
    const page = window.location.pathname.split("/").pop();
    switch (page) {
        case "bottle.html":
            return { path: "assets/bottle.glb", scale: 0.75, type : "bottle" };
        case "can.html":
            return { path: "assets/can.glb", scale: 0.5, type : "can" };
        case "cup.html":
            return { path: "assets/cup.glb", scale: 0.75, type : "cup" };
        default:
            return null; // No model for index/about or unknown page
    }
}
const modelInfo = getModel();
loadModel(modelInfo.path, modelInfo.scale);

window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    renderer.setSize(newWidth, newHeight);
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
});

let lights = {};
lights.spot = new THREE.SpotLight(0xffffff, 1, 20);
lights.spot.visible = true;
lights.spot.position.set(0,5,0);
lights.spotHelper = new THREE.SpotLightHelper(lights.spot);
lights.spotHelper.visible = false;
scene.add(lights.spot);
scene.add(lights.spotHelper);

let params = {
    spot : {
        enable: true,
        color: 0xffffff,
        intensity: 1,
        distance: 20,
        angle: Math.PI /2,
        penumbra: 0,
        helper: false,
        moving: false
    }
}

const gui = new dat.GUI({ autoplace: false });
const guiContainer = document.getElementById('GUI');
guiContainer.appendChild(gui.domElement);

const spot = gui.addFolder('Spot Light');
spot.open();
spot.add(params.spot, 'enable').onChange(value =>
    { lights.spot.visible = value });
spot.addColor(params.spot, 'color').onChange(
    value => lights.spot.color = new
    THREE.Color(value));
spot.add(params.spot,
    'distance').min(0).max(20).onChange( value =>
    lights.spot.distance = value);
spot.add(params.spot,
    'angle').min(0.1).max(6.28).onChange( value =>
    lights.spot.angle = value );
spot.add(params.spot,
    'intensity').min(0.1).max(5).onChange( value =>
    lights.spot.intensity = value );
spot.add(params.spot,
    'penumbra').min(0).max(1).onChange( value =>
    lights.spot.penumbra = value );
spot.add(params.spot, 'helper').onChange(value =>
    lights.spotHelper.visible = value);
spot.add(params.spot, 'moving');

function animate() {
    if (activeModel) {
        const deltaTime = clock.getDelta();
        if (mixer && animations.length > 0) {
            mixer.update(deltaTime);
        }
    }
    
    const time = clock.getElapsedTime();
    const delta = Math.sin(time)*5;
    if (params.spot.moving){
        lights.spot.position.x = delta;
        lights.spotHelper.update();
    }
	renderer.render( scene, camera );
}

function playAudio(audioPath) {
    if (soundSource.isPlaying) soundSource.stop();
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(audioPath, function(buffer) {
        soundSource.setBuffer(buffer);
        soundSource.setLoop(false);
        soundSource.setVolume(0.7);
        soundSource.play();
    });
}

renderer.setAnimationLoop( animate );

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0, 0);
controls.update();

const openButton = document.getElementById('open');
openButton.addEventListener('click', open);

const crushButton = document.getElementById('crush');
crushButton.addEventListener('click', crush);

const resetButton = document.getElementById('reset');
resetButton.addEventListener('click', reset);

function open() {
    console.log("opened")
    scene.remove(activeModel);
    switch (modelInfo.type) {
        case "bottle":
            loadModel("assets/bottleopen.glb", 0.75, playAnimation);
            playAudio("assets/sounds/bottleopen.mp3");
            break;
        case "can":
            loadModel("assets/canopen.glb", 0.75, playAnimation);
            playAudio("assets/sounds/canopen.mp3");
            break;
        case "cup":
            loadModel("assets/cupopen.glb", 0.75, playAnimation);
            break;
        default:
            console.log("Unknown model type: " + modelInfo.type)
            break;
    }
}

function crush() {
    console.log("crushed")
    scene.remove(activeModel);
    switch (modelInfo.type) {
        case "bottle":
            loadModel("assets/bottlecrush.glb", 0.75, playAnimation);
            playAudio("assets/sounds/crush.mp3");
            break;
        case "can":
            loadModel("assets/cancrush.glb", 0.75, playAnimation);
            playAudio("assets/sounds/crush.mp3");
            break;
        case "cup":
            loadModel("assets/cupcrush.glb", 0.75, playAnimation);
            break;
        default:
            console.log("Unknown model type: " + modelInfo.type)
            break;
    }
}

function reset() {
    if (soundSource.isPlaying) soundSource.stop();
    scene.remove(activeModel);
    loadModel(modelInfo.path, modelInfo.scale);
}

function playAnimation() {
    console.log(animations)
    animations.forEach(animation => {
        const action = mixer.clipAction(animation);
        action.timeScale = 1;
        action.reset();
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
        action.play();
    });
}

document.getElementById('wireframe').addEventListener('click', () => {
    console.log("wireframe");

    activeModel.traverse((child) => {
        if (child.isMesh) {
            child.material.wireframe = !child.material.wireframe;
        }
    });
});