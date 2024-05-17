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
var innerRingMaterial, mediumRingMaterial, outerRingMaterial;
var seatMaterial;

// Object3Ds
var carousel, ring1, ring2, ring3;

// Measurements
// L: width, h: height, c: length, r: radius
const r_cylinder = 6;
const h_cylinder = 6;

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
    let floor = new THREE.Mesh(new THREE.BoxGeometry(200, 200, 0.5), new THREE.MeshBasicMaterial({color: 0x6DC5D1, side: THREE.DoubleSide}));
    floor.rotateX(-Math.PI/2);
    floor.position.y = -1;
    const axesHelper = new THREE.AxesHelper( 5 );
    const directionalLight = createDirectionalLight();
    const ambientLight = createAmbientLight();
    scene.add(directionalLight);
    scene.add(ambientLight);
    scene.add( axesHelper );
    scene.add(floor);


    createMaterials();

    addSkydome(0, 0, 0);

    createCarousel(0, 0, 0);
}

function createMaterials() {
    carouselMaterial = new THREE.MeshBasicMaterial({ color: 0xEABE6C, wireframe: false });
    innerRingMaterial = new THREE.MeshBasicMaterial({ color: 0xDD761C, wireframe: false });
    mediumRingMaterial = new THREE.MeshBasicMaterial({ color: 0xFEB941  , wireframe: false });
    outerRingMaterial = new THREE.MeshBasicMaterial({ color: 0xFDE49E, wireframe: false });
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
    perspectiveCamera.position.set(50, 55, 40);
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

function createDirectionalLight() {
    const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
    light.position.set(1, 2, 1);
    light.target.position.set(0, 0, 0);
}

function createAmbientLight() {
    return new THREE.AmbientLight( 0xd7930a );
}
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

    createInnerRing(carousel, 0, h_cylinder + h_ring1, 0);
    createMediumRing(carousel, 0, h_cylinder + h_ring1 + h_ring2, 0);
    createOuterRing(carousel, 0, h_cylinder + h_ring1 + h_ring2 + h_ring3, 0);
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

    createRing(ring1, 0, 0, 0, outerR_ring1, innerR_ring1, h_ring1, innerRingMaterial);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.set(x, y, z);

    obj.add(ring1);
}

function createMediumRing(obj, x, y, z) {
    'use strict';

    ring2 = new THREE.Object3D();

    createRing(ring2, 0, 0, 0, outerR_ring2, innerR_ring2, h_ring2, mediumRingMaterial);
    ring2.rotation.x  = Math.PI / 2;
    ring2.position.set(x, y, z);

    obj.add(ring2);

}

function createOuterRing(obj, x, y, z) {
    'use strict';

    ring3 = new THREE.Object3D();

    createRing(ring3, 0, 0, 0, outerR_ring3, innerR_ring3, h_ring3, outerRingMaterial)
    ring3.rotation.x  = Math.PI / 2;
    ring3.position.set(x, y, z);

    obj.add(ring3);
}

function createRing(obj, x, y, z, outerRadius, innerRadius, h, geo) {
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
    mesh = new THREE.Mesh(innerRingGeometry, geo);
    mesh.position.set(x, y, z);
    obj.add(mesh);
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