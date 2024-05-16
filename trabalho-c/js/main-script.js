import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import * as Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';

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
var seatMaterial;

// Object3Ds
var carousel, ring1, ring2, ring3;

// Measurements
// L: width, h: height, c: length, r: radius
const r_cylinder = 6;
const h_cylinder = 12*2;

const r_skydome = 90;

const outerR_ring1 = 20;
const innerR_ring1 = 6;
const h_ring1 = 5;

const outerR_ring2 = 34;
const innerR_ring2 = outerR_ring1;
const h_ring2 = 5;

const outerR_ring3 = 48;
const innerR_ring3 = outerR_ring2;
const h_ring3 = 5;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(10));
    scene.background = new THREE.Color(0xb8cef2);
    let floor = new THREE.Mesh(new THREE.BoxGeometry(200, 200, 0.5), new THREE.MeshBasicMaterial({color: 0xC551E9, side: THREE.DoubleSide}));
    floor.rotateX(-Math.PI/2);
    floor.position.y = -1;
    scene.add(floor);


    createMaterials();

    addSkydome(0, 0, 0);

    createCarousel(0, 0, 0);
}

function createMaterials() {
    carouselMaterial = new THREE.MeshBasicMaterial({ color: 0xEABE6C, wireframe: false });
    ringMaterial = new THREE.MeshBasicMaterial({ color: 0x1D63EF, wireframe: false });    
    skydomeMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/an_optical_poem.jpg'), side: THREE.DoubleSide, transparent: true, opacity: 0.7});
    seatMaterial = new THREE.MeshBasicMaterial({ color: 0xF4D13B, wireframe: false});
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
    mesh = new THREE.Mesh(geometry, skydomeMaterial);
    mesh.position.set(x, y, z);

    scene.add(mesh);
}

function createCarousel(x, y, z) {
    'use strict';

    carousel = new THREE.Object3D();

    addCentralCylinder(carousel, x, h_cylinder/2 , z, r_cylinder, h_cylinder);
    addMobiusStrip();

    scene.add(carousel);
    carousel.position.set(x, y, z);

    createInnerRing(carousel, 0, h_cylinder/2, -2 * r_cylinder);
    createMediumRing(carousel, 0, h_cylinder/2, -2 * r_cylinder);
    createOuterRing(carousel, 0, h_cylinder/2, -2 * r_cylinder);
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
    createRing(ring1, x, y, z, outerR_ring1, innerR_ring1, h_ring1);
    ring1.rotation.x = Math.PI / 2;

    //addSeats(ring1, x, y, z/*, innerR_ring1 + 7*/) // +7 para os seats ficarem alinhados no meio do anel, (20-6)/2 = 7

    obj.add(ring1);

    
    ring1.position.x = x;
    ring1.position.y = y - (2 * r_cylinder);
    ring1.position.z = z;
}

function addSeats(obj, x, y, z/*, R_ring*/){
    'use strict';

    const seatFunctions = [
    // Esfera
    function(u, v) {
      const r = 1;
      const x = r * Math.sin(u) * Math.cos(v);
      const y = r * Math.sin(u) * Math.sin(v);
      const z = r * Math.cos(u);
      return new THREE.Vector3(x, y, z);
    },
    // Adicionar mais 7 funcoes de superficies parametricas aqui
    ];

    for (let i = 0; i < seatFunctions.length; i++){
        const geometry = new THREE.ParametricGeometry(seatFunctions[i], 50, 50);
        const mesh = new THREE.Mesh(geometry, seatMaterial);
        mesh.position.set(x, y, z);
        obj.add(mesh);
    }
}

function createMediumRing(obj, x, y, z) {
    'use strict';

    ring2 = new THREE.Object3D();

    // TODO
    createRing(ring2, x, y, z, outerR_ring2, innerR_ring2, h_ring2);
    ring2.rotation.x  = Math.PI / 2;
    obj.add(ring2);

    ring2.position.x = x;
    ring2.position.y = y - r_cylinder;
    ring2.position.z = z;
}

function createOuterRing(obj, x, y, z) {
    'use strict';

    ring3 = new THREE.Object3D();

    // TODO
    createRing(ring3, x, y, z, outerR_ring3, innerR_ring3, h_ring3)
    ring3.rotation.x  = Math.PI / 2;
    obj.add(ring3);

    ring3.position.x = x;
    ring3.position.y = y;
    ring3.position.z = z;
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