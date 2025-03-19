import * as THREE from "three";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.128/examples/jsm/loaders/GLTFLoader.js";

const container = document.getElementById('threejs-container');
const width = container.clientWidth;
const height = container.clientHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 5;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const loader = new GLTFLoader();
let bottleModel;
loader.load("assets/bottle.glb", function (gltf) {
    gltf.scene.scale.set(0.75, 0.75, 0.75);
    const sections = {plastic: "Plastic", logo: "logo", cap: "Bottlecap"}
    bottleModel = gltf.scene;
    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            console.log(child.name);
            if (child.name === "Mesh") {
                child.material = new THREE.MeshBasicMaterial({ color: "blue" });
            }
            if (child.name === "Mesh_2") {
                child.material = new THREE.MeshBasicMaterial({ color: "blue" });
            }
        }
    });
    scene.add(gltf.scene);
});

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.getElementById('threejs-container').appendChild(renderer.domElement);

window.addEventListener('resize', () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    renderer.setSize(newWidth, newHeight);
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
});

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

const cube = new THREE.Mesh( geometry, material );
cube.name = "Fred";

scene.add( cube );
cube.position.x = 2;

const clock = new THREE.Clock();

function animate() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    if (bottleModel) {
        const deltaTime = clock.getDelta();
        bottleModel.rotation.x = Math.sin(clock.elapsedTime) * 0.5;
        bottleModel.rotation.y += deltaTime * 0.5;
    }
	renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );