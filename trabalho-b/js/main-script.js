import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import * as Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

// cameras, scene, renderer and clock
var camera1, camera2, camera3, camera4, camera5, camera6, currentCamera;
var scene, renderer, clock;

// meshes
var geometry, mesh, material, containerMaterial;

// measures
var L_base = 9;
var h_base = 3;
var L_torre = 3;
var h_torre = 21;
var h_eixo = 3;
var L_lanca = 36;
var h_lanca = 3;

var L_contralanca = L_lanca/4;
var h_contralanca = h_lanca;

var h_porta_lanca = h_eixo*2;

var L_contrapeso = L_contralanca/2;
var h_contrapeso = h_contralanca/2;
var c_contrapeso = L_contrapeso*(2/3);

var L_contentor = 20;
var h_contentor = 8;

// object3Ds
var father, son;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    scene = new THREE.Scene();
    scene.background = new THREE.Color('skyblue');

    scene.add(new THREE.AxesHelper(10));

    createFather(0, 0, 0);
    createContainer(25, 0, 10);

}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera1() {
    'use strict';
    // OrthographicCamera(left, right, top, bottom, near, far)
    camera1 = new THREE.OrthographicCamera(window.innerWidth / -20,
        window.innerWidth / 20, window.innerHeight / 20, 
        window.innerHeight / -20, 1, 1000);
    
    camera1.position.x = 0;
    camera1.position.y = 0;
    camera1.position.z = 50;
    camera1.lookAt(scene.position);
}

function createCamera2() {
    'use strict';
    // OrthographicCamera(left, right, top, bottom, near, far)
    camera2 = new THREE.OrthographicCamera(window.innerWidth / -20,
        window.innerWidth / 20, window.innerHeight /20, 
        window.innerHeight / -20, 1, 1000);
    
    camera2.position.x = 50;
    camera2.position.y = 0;
    camera2.position.z = 0;
    camera2.lookAt(scene.position);
}

function createCamera3() {
    'use strict';
    // OrthographicCamera(left, right, top, bottom, near, far)
    camera3 = new THREE.OrthographicCamera(window.innerWidth / -20,
        window.innerWidth / 20, window.innerHeight /20, 
        window.innerHeight / -20, 1, 1000);
    
    camera3.position.x = 0;
    camera3.position.y = 50;
    camera3.position.z = 0;
    camera3.lookAt(scene.position);
}

function createCamera4() {
    'use strict';
    // OrthographicCamera(left, right, top, bottom, near, far)
    camera4 = new THREE.OrthographicCamera(window.innerWidth / -20,
        window.innerWidth / 20, window.innerHeight /20, 
        window.innerHeight / -20, 1, 1000);
    
    camera4.position.x = 50;
    camera4.position.y = 50;
    camera4.position.z = 50;
    camera4.lookAt(scene.position);
}

function createCamera5() {
    'use strict';
    // PerspectiveCamera(fov, aspect, near, far)
    camera5 = new THREE.PerspectiveCamera(70,
        window.innerWidth / window.innerHeight, 1, 1000);
    
    camera5.position.x = 50;
    camera5.position.y = 50;
    camera5.position.z = 50;
    camera5.lookAt(scene.position);
}

function createCamera6() {
    'use strict';
    // PerspectiveCamera(fov, aspect, near, far)
    camera6 = new THREE.PerspectiveCamera(70,
        window.innerWidth / window.innerHeight, 1, 1000);
    
    // mobile camera
    camera6.position.x = 3;
    camera6.position.y = 50;
    camera6.position.z = 3;
    camera6.lookAt(scene.position);
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
function createFather(x, y, z) {
    'use strict';

    father = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x663300, wireframe: true });

    addBase(father, 0, 0, 0);
    addTorre(father, 0, h_torre/2 + h_base/2, 0);

    scene.add(father);

    father.position.x = x;
    father.position.y = y;
    father.position.z = z;

    createSon(father, x, y + h_torre/2 + h_base/2, z);
}

function addBase(obj, x, y, z) {
    'use strict';
    // BoxGeometry(width, height, length)
    geometry = new THREE.BoxGeometry(L_base, h_base, L_base);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addTorre(obj, x, y, z) {
    'use strict';
    // BoxGeometry(width, height, length)
    geometry = new THREE.BoxGeometry(L_torre, h_torre, L_torre);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function createSon(obj, x, y, z) {
    'use strict';

    son = new THREE.Object3D();
    son.userData = { rotating: false, step: 0.02 } // pi/6 radians

    addEixorotacao(son, x, y, z);
    addLanca(son, x, y, z);
    addContralanca(son, x, y, z);
    addPortalanca(son, x, y, z);
    addContrapeso(son, x, y, z);
    // addCabine();
    // addTirante1();
    // addTirante2();

    obj.add(son);

    son.position.x = x;
    son.position.y = y;
    son.position.z = z;
}

function addEixorotacao(obj, x, y, z) {
    'use strict';
    // CylinderGeometry(radiusTop, radiusBottom, height, heightSegments)
    geometry = new THREE.CylinderGeometry(L_torre/2, L_torre/2, h_eixo, 16);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addLanca(obj, x, y, z) {
    'use strict';
    // BoxGeometry(width, height, length)
    geometry = new THREE.BoxGeometry(L_lanca, h_lanca, h_lanca);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x + L_lanca/2 - L_torre/2, y + h_eixo, z);
    obj.add(mesh);
}

function addContralanca(obj, x, y, z){
    'use strict';
    // BoxGeometry(width, height, length)
    geometry = new THREE.BoxGeometry(L_lanca/4, h_lanca, h_lanca);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x - L_torre*2, y + h_eixo, z);
    obj.add(mesh);
}

function addPortalanca(obj, x, y, z){
    'use strict'
    geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array( [
        L_torre/2, -h_eixo/2,  L_torre/2,   // v0
        L_torre/2, -h_eixo/2,  -L_torre/2,  // v1
        -L_torre/2, -h_eixo/2,  -L_torre/2, // v2
        -L_torre/2, -h_eixo/2,  L_torre/2,  // v3
        0, h_porta_lanca - h_eixo/2, 0       // v4
    ] );
    const indices = [
        0, 1, 2,
        2, 3, 0,
        0, 4, 1,
        1, 4, 2,
        2, 4, 3,
        3, 4, 0,
        
    ];
    geometry.setIndex( indices );
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y + h_eixo*2, z);
    obj.add(mesh);
}

function addContrapeso(obj, x, y, z){
    'use strict';
    // BoxGeometry(width, height, length)
    geometry = new THREE.BoxGeometry(L_contrapeso, h_contrapeso, c_contrapeso - 1);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x - L_torre*(5/2), y + h_eixo/4, z);
    obj.add(mesh);
}

function createContainer(x, y, z) {
    'use strict';

    var container = new THREE.Object3D();
    containerMaterial = new THREE.MeshBasicMaterial({ color: 0xfb0000, wireframe: true});
    scene.add(container);

    addContainerBase(container, x, y, z);
    addContainerWall(container, x, y + h_contentor / 2, z - h_contentor / 2, L_contentor, h_contentor, 0.3); // PAREDE DIREITA
    addContainerWall(container, x, y + h_contentor / 2, z + h_contentor / 2, L_contentor, h_contentor, 0.3); // PAREDE ESQUERDA
    addContainerWall(container, x + L_contentor / 2, y + h_contentor / 2, z, 0.3, h_contentor, h_contentor);
    addContainerWall(container, x - L_contentor / 2, y + h_contentor / 2, z, 0.3, h_contentor, h_contentor);
}

function addContainerBase(obj, x, y, z) {
    'use strict';
    geometry = new THREE.BoxGeometry(L_contentor, 0.3, h_contentor);
    mesh = new THREE.Mesh(geometry, containerMaterial);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addContainerWall(obj, x, y, z, largura, altura, espessura) {
    'use strict';
    geometry = new THREE.BoxGeometry(largura, altura, espessura);
    mesh = new THREE.Mesh(geometry, containerMaterial);
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
    if (son.userData.rotating) {
        son.rotateOnAxis(new THREE.Vector3(0, 1, 0), son.userData.step);
    }
}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
    renderer.render(scene, currentCamera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    clock = new THREE.Clock();
    document.body.appendChild(renderer.domElement);

    createScene();
    createCamera1();
    createCamera2();
    createCamera3();
    createCamera4();
    createCamera5();
    createCamera6();

    currentCamera = camera1;

    render();

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
            currentCamera = camera1;
            break;
        case 50: // 2
            currentCamera = camera2;
            break;
        case 51: // 3
            currentCamera = camera3;
            break;
        case 52: // 4
            currentCamera = camera4;
            break;
        case 53: // 5
            currentCamera = camera5;
            break;
        case 54: // 6
            currentCamera = camera6;
            break;
        case 55: // 7
            material.wireframe = !material.wireframe;
            containerMaterial.wireframe = !containerMaterial.wireframe;
            break;
        case 81: // Q
        case 113: // q
            son.userData.rotating = true;
            break;
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

    switch(e.keyCode) {
        case 81: // Q
        case 113: // q
            son.userData.rotating = false;
            break;
    }
}

init();
animate();