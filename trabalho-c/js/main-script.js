import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import * as Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

// Cameras, scene, renderer and clock
var perspectiveCamera, stereoCamera;
var scene, renderer, clock;

// Meshes
var mesh;

// Materials
var geometry;
var carouselMaterial;
var skydomeMaterial;
var ringMaterial;

// Object3Ds
var carousel, ring1, ring2, ring3;

// Measurements
// L: width, h: height, c: length, r: radius
const r_cylinder = 6;
const h_cylinder = 12;

const r_skydome = 90;

const outerR_ring1 = 20;
const innerR_ring2 = 6;
const h_ring1 = 5;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(10));
    scene.background = new THREE.Color(0xb8cef2);
    let floor = new THREE.Mesh(new THREE.BoxGeometry(200, 200, 1), new THREE.MeshBasicMaterial({color: 0xC551E9, side: THREE.DoubleSide}));
    floor.rotateX(-Math.PI/2);
    floor.position.y = -1;
    scene.add(floor);


    createMaterials();

    addSkydome(0, 0, 0);

    createCarousel(0, 0, 0);
}

function createMaterials() {
    carouselMaterial = new THREE.MeshBasicMaterial({ color: 0xEABE6C, wireframe: false });
    skydomeMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/an_optical_poem.jpg'), side: THREE.DoubleSide});
    ringMaterial = new THREE.MeshBasicMaterial({ color: 0x1D63EF, wireframe: false });
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createPerspectiveCamera() {
    'use strict';
    // PerspectiveCamera(fov, aspect, near, far)
    perspectiveCamera = new THREE.PerspectiveCamera(70,
        window.innerWidth / window.innerHeight, 1, 1000);
    perspectiveCamera.position.set(50, 50, 50);
    perspectiveCamera.lookAt(scene.position);
}

function createStereoCamera() {
    'use strict';
    // StereoCamera()
    stereoCamera = THREE.StereoCamera();
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function addSkydome(x, y, z){
    'use strict';
    //SphereGeometry(radius, widthSegments, heightSegments)
    geometry = new THREE.SphereGeometry(r_skydome, 64, 32, 0, 2 * Math.PI, 0, Math.PI / 2);

    skydomeMaterial.transparent = true;
    skydomeMaterial.opacity = 0.6;

    mesh = new THREE.Mesh(geometry, skydomeMaterial);
    mesh.position.set(x, y, z);

    scene.add(mesh);
}

function createCarousel(x, y, z) {
    'use strict';

    carousel = new THREE.Object3D();

    addCentralCylinder(carousel, x, y, z, r_cylinder, h_cylinder);
    addMobiusStrip();

    scene.add(carousel);
    carousel.position.set(x, y, z);

    createInnerRing(carousel, 0, h_cylinder, z);
    createRing2(carousel);
    createRing3(carousel);
}

function addCentralCylinder(obj, x, y, z, r, h) {
    'use strict';
    // CylinderGeometry(radiusTop, radiusBottom, height, radialSegments)
    geometry = new THREE.CylinderGeometry(r, r, h, 64);
    mesh = new THREE.Mesh(geometry, carouselMaterial);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addMobiusStrip() {
    'use strict';
    // TODO
}

function createInnerRing(obj, x, y, z) {
    'use strict';

    ring1 = new THREE.Object3D();

    // TODO
    createRing(ring1, x, y + 3, z, outerR_ring1, innerR_ring2, h_ring1);
    ring1.rotation.x = Math.PI / 2;
    obj.add(ring1);

    
    ring1.position.x = x;
    ring1.position.y = y - 1;
    ring1.position.z = z - 15;
}

function createRing2() {
    'use strict';

    ring2 = new THREE.Object3D();

    // TODO
}

function createRing3() {
    'use strict';

    ring3 = new THREE.Object3D();

    // TODO
}

function createRing(obj, x, y, z, outerRadius, innerRadius, h) {
    'use strict';
    var shape = new THREE.Shape();
    shape.moveTo(outerRadius, 0);
    shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);
    
    var holePath = new THREE.Path();
    holePath.moveTo(innerRadius, 0);
    holePath.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);

    shape.holes.push(holePath);
    
    const extrudeSettings = {
        bevelEnabled: false,
        depth: h
    };

    var innerRingGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    mesh = new THREE.Mesh(innerRingGeometry, ringMaterial);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';

}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';

}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';

}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
    renderer.render(scene, perspectiveCamera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    /* Ponto 8
    document.body.appendChild(VRButton.createButton(renderer));
    renderer.xr.enabled = true;
    renderer.setAnimationLoop( function () {
        renderer.render(scene, camera);
    } );
    createStereoCamera();
    */

    createScene();
    createPerspectiveCamera();

    const controls = new OrbitControls(perspectiveCamera, renderer.domElement);
    
    render(); // pode-se tirar?

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

    update();
    render();

    requestAnimationFrame(animate);
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        currentCamera.aspect = window.innerWidth / window.innerHeight;
        currentCamera.updateProjectionMatrix();
    }
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

    switch(e.keyCode) {
        case 49: // 1
            break;
        case 50: // 2
            break;
        case 51: // 3
            break;
        case 68: // D/d
            break;
        case 80: // P/p
            break;
        case 83: // S/s
            break;
        case 81: // Q/q
            break;
        case 87: // W/w
            break;
        case 69: // E/e
            break;
        case 82: // R/r
            break;
        case 84: // T/t
            break;
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

    switch(e.keyCode) {
        case 49: // 1
            break;
        case 50: // 2
            break;
        case 51: // 3
            break;
    }
}

init();
animate();