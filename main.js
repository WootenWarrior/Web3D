import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';

const width = window.innerWidth;
const height = window.innerHeight;

const container = document.getElementById('threejs-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 5;

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
const material2 = new THREE.MeshBasicMaterial( { color: 0xFF00FF } );
const material3 = new THREE.MeshBasicMaterial( { color: 0x00FFFF } );
const cube = new THREE.Mesh( geometry, material );
const cube2 = new THREE.Mesh( geometry, material2 );
const cube3 = new THREE.Mesh( geometry, material3 );
scene.add( cube );
scene.add( cube2 );
scene.add( cube3 );

cube.position.set(0 , 0, 0);
cube2.position.set(2 , 0, 0);
cube3.position.set(-2 , 0, 0);

var clock = new THREE.Clock();
var time = 0;
var delta = 0;

function animate() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    delta = clock.getDelta();
    time += delta;
    cube.rotation.x = time * 4;
    cube.position.y = 0.5 + Math.abs(Math.sin(time * 3)) * 2;
    cube2.rotation.x = time * 4;
    cube2.position.y = 0.5 + Math.abs(Math.sin(time * 3)) * 2;
    cube3.rotation.x = time * 4;
    cube3.position.y = 0.5 + Math.abs(Math.sin(time * 3)) * 2;
	renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );