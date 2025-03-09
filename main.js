import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';

const width = window.innerWidth;
const height = window.innerHeight;

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.getElementById('threejs-container').appendChild(renderer.domElement);