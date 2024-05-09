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
var geometry, eixoMaterial, mesh, material, containerMaterial, containerBaseMaterial, dodecahedronCargoMaterial, icosahedronCargoMaterial, torusCargoMaterial;
var cabineMaterial, lancaMaterial, contraLancaMaterial, portaLancaMaterial, caboMaterial, tiranteMaterial, contraPesoMaterial, carroMaterial, garraMaterial;
var baseMaterial, cubeCargoMaterial, torusKnotMaterial;

// bounding volumes
var garraBoundingBox, cargo1BoundingSphere, cargo2BoundingSphere, cargo3BoundingSphere;

// measurements
var L_base = 9;
var h_base = 3;

var L_torre = 3;
var h_torre = 21;

var h_eixo = 3;

var L_lanca = 36;
var h_lanca = 3;

var L_contralanca = 9;
var h_contralanca = 3;

var h_porta_lanca = 6;

var L_contrapeso = 4.5;
var h_contrapeso = 1.5;
var c_contrapeso = 3;

var L_carro = 3;
var h_carro = 3;

var L_contentor = 20;
var h_contentor = 8;

var c_tirante1 = 35; // calculado à mão
var c_tirante2 = 12.1; // calculado à mão

var grandsonStartingX = 27;
var rt_cabo = 0.1; 
var rb_cabo = 0.1;

var initial_delta2 = 9;
var r_garra = 1.5;
var h_garra = 1.25;

var L_dedo_body = 0.5;
var h_dedo_body = 0.75;
var L_dedo_tip = 0.5;
var h_dedo_tip = 0.5;

// object3Ds
var father, son, grandson, greatgrandson;

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
    createDodecahedronCargo(-20, 2, -10);
    createIcosahedronCargo(10, 2.5, -17);
    createTorusCargo(-25, 2.5, 15);
    createCubeCargo(-5, 2.4, -16);
    createTorusKnotCargo(-6, 1, 20);
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

function createCamera6(x, y, z) {
    'use strict';
    // PerspectiveCamera(fov, aspect, near, far)
    camera6 = new THREE.PerspectiveCamera(70,
        window.innerWidth / window.innerHeight, 1, 1000);
    
    // mobile camera
    greatgrandson.add(camera6)
    camera6.position.x = x;
    camera6.position.y = y;
    camera6.position.z = z;
    camera6.rotation.x = -Math.PI/2
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

    material = new THREE.MeshBasicMaterial({ color: 0xEABE6C, wireframe: true });

    addBase(father, 0, 0, 0);
    addTorre(father, 0, h_torre/2 + h_base/2, 0);

    scene.add(father);
    father.add(new THREE.AxesHelper(10));


    father.position.x = x;
    father.position.y = y;
    father.position.z = z;

    createSon(father, 0, h_torre + h_base, 0);
}

function addBase(obj, x, y, z) {
    'use strict';
    // BoxGeometry(width, height, length)

    geometry = new THREE.BoxGeometry(L_base, h_base, L_base);
    baseMaterial = new THREE.MeshBasicMaterial({ color: 0x322C2B, wireframe: true });
    mesh = new THREE.Mesh(geometry, baseMaterial);
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
    son.userData = { positiveRotation: false, negativeRotation: false, speed: 0.8 } 

    addEixorotacao(son, 0, 0, 0);
    addLanca(son, L_lanca/2 - L_torre/2, h_lanca, 0);
    addContralanca(son, -L_torre*2, h_contralanca, 0);
    addPortalanca(son, 0, h_porta_lanca, 0);
    addContrapeso(son, -L_torre*(5/2), h_contrapeso/2, 0);
    addCabine(son, L_torre, 0, 0);
    addTirante(son, c_tirante1 / 2 - 0.25, h_porta_lanca + h_lanca / 2 - 0.2, 0, c_tirante1, 0);
    addTirante(son, - c_tirante2 / 2 + 0.8, h_porta_lanca + h_lanca / 2 - 0.2, 0, c_tirante2, 1);

    obj.add(son);
    son.add(new THREE.AxesHelper(10));

    son.position.x = x;
    son.position.y = y;
    son.position.z = z;

    createGrandson(son, grandsonStartingX, 0, 0);
}

function addCabine(obj, x, y, z) {
    'use string';

    geometry = new THREE.BoxGeometry(L_torre, 3, L_torre);
    cabineMaterial = new THREE.MeshBasicMaterial({ color: 0xEABE6C, wireframe: true });
    mesh = new THREE.Mesh(geometry, cabineMaterial);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addTirante(obj, x, y, z, c_tirante, direction) {
    'use strict';

    geometry = new THREE.CylinderGeometry(0.1,0.1, c_tirante);
    tiranteMaterial = new THREE.MeshBasicMaterial({ color: 0x322C2B, wireframe: true });
    mesh = new THREE.Mesh(geometry, tiranteMaterial);
    mesh.position.set(x, y, z);
    var angle = ((Math.PI/2) - Math.asin(h_porta_lanca / c_tirante));
    mesh.rotation.z = angle; // Rotate around the Z axis 

    mesh.rotation.y = Math.PI * direction; // Direction will either be 0 or 1
    obj.add(mesh);
}

function addEixorotacao(obj, x, y, z) {
    'use strict';
    // CylinderGeometry(radiusTop, radiusBottom, height, heightSegments)
    eixoMaterial = new THREE.MeshBasicMaterial({ color: 0xFEEFAD, wireframe: true });
    geometry = new THREE.CylinderGeometry(L_torre/2 - 0.2, L_torre/2 - 0.2, h_eixo, 16);
    mesh = new THREE.Mesh(geometry, eixoMaterial);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addLanca(obj, x, y, z) {
    'use strict';
    // BoxGeometry(width, height, length)
    geometry = new THREE.BoxGeometry(L_lanca, h_lanca, h_lanca);
    lancaMaterial = new THREE.MeshBasicMaterial({ color: 0xEABE6C, wireframe: true });
    mesh = new THREE.Mesh(geometry, lancaMaterial);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addContralanca(obj, x, y, z) {
    'use strict';
    // BoxGeometry(width, height, length)
    geometry = new THREE.BoxGeometry(L_contralanca, h_contralanca, h_contralanca);
    contraLancaMaterial = new THREE.MeshBasicMaterial({ color: 0xEABE6C, wireframe: true });
    mesh = new THREE.Mesh(geometry, contraLancaMaterial);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addPortalanca(obj, x, y, z) {
    'use strict';
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

    portaLancaMaterial = new THREE.MeshBasicMaterial({ color: 0xEABE6C, wireframe: true });
    mesh = new THREE.Mesh(geometry, portaLancaMaterial);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addContrapeso(obj, x, y, z) {
    'use strict';
    // BoxGeometry(width, height, length)
    geometry = new THREE.BoxGeometry(L_contrapeso, h_contrapeso, c_contrapeso - 1);
    contraPesoMaterial = new THREE.MeshBasicMaterial({ color: 0xF6E9B2, wireframe: true });
    mesh = new THREE.Mesh(geometry, contraPesoMaterial);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function createGrandson(obj, x, y, z) {
    'use strict';
    
    grandson = new THREE.Object3D();
    grandson.userData = {movingOut: false, movingIn: false,
                        maxCarTranslationLimit: L_lanca - grandsonStartingX - L_carro,
                        minCarTranslationLimit: - grandsonStartingX + L_carro + L_torre,
                        horizontal_speed: 5,
                        horizontal_desloc: 0}

    addCarro(grandson, 0, 0, 0);
    addCabo(grandson, 0, -initial_delta2/2, 0);

    obj.add(grandson);
    grandson.add(new THREE.AxesHelper(10));

    grandson.position.x = x;
    grandson.position.y = y;
    grandson.position.z = z;

    createGreatGrandson(grandson, 0, -initial_delta2, 0);
}

function addCarro(obj, x, y, z) {
    'use strict';
    // BoxGeometry(width, height, length)
    geometry = new THREE.BoxGeometry(L_carro, h_carro, h_lanca);
    carroMaterial = new THREE.MeshBasicMaterial({ color: 0xFEEFAD, wireframe: true });
    mesh = new THREE.Mesh(geometry, carroMaterial);
    mesh.position.set(x, y, z);
    mesh.name = "carro";
    obj.add(mesh);
}

function addCabo(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CylinderGeometry(rt_cabo, rb_cabo, initial_delta2);
    caboMaterial = new THREE.MeshBasicMaterial({ color: 0x322C2B, wireframe: true });
    mesh = new THREE.Mesh(geometry, caboMaterial);
    mesh.position.set(x, y, z);
    mesh.name = "cabo";
    obj.add(mesh);
}

function createGreatGrandson(obj, x, y, z) {
    'use strict';
    
    greatgrandson = new THREE.Object3D();
    greatgrandson.userData = {cableGoingDown: false, cableGoingUp: false,
                        maxCableTranslationLimit: h_garra * 6,
                        minCableTranslationLimit: -(h_torre/2),
                        vertical_speed: 5, vertical_desloc: 0,
                        openClaw: false, closeClaw: false,
                        claw_speed: 0.5}

    addGarra(greatgrandson, 0, 0, 0);
    addDedo(greatgrandson, -L_dedo_body/2 - L_dedo_tip/2, -h_dedo_body/3, L_dedo_body/2 + L_dedo_tip/2, '1');
    addDedo(greatgrandson, L_dedo_body/2 + L_dedo_tip/2, -h_dedo_body/3, L_dedo_body/2 + L_dedo_tip/2, '2');
    addDedo(greatgrandson, L_dedo_body/2 + L_dedo_tip/2, -h_dedo_body/3, -L_dedo_body/2 - L_dedo_tip/2, '3');
    addDedo(greatgrandson, -L_dedo_body/2 - L_dedo_tip/2, -h_dedo_body/3, -L_dedo_body/2 - L_dedo_tip/2, '4');
    createCamera6(0, - L_dedo_body, 0);

    obj.add(greatgrandson);
    greatgrandson.add(new THREE.AxesHelper(10));

    greatgrandson.position.x = x;
    greatgrandson.position.y = y;
    greatgrandson.position.z = z;

    garraBoundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    garraBoundingBox.setFromObject(greatgrandson);
}

function addGarra(obj, x, y, z) {
    'use strict';
    geometry = new THREE.CylinderGeometry(r_garra, r_garra, h_garra, 20);
    garraMaterial = new THREE.MeshBasicMaterial({ color: 0x322C2B, wireframe: true });
    mesh = new THREE.Mesh(geometry, garraMaterial);
    mesh.position.set(x, y, z);
    mesh.name = "garra";
    obj.add(mesh);
}

function addDedo(obj, x, y, z, number) {
    'use strict';
    
    var dedo = new THREE.Group();
    // dedo é composto por body(articulação) e tip(ponta)
    var geometry_body = new THREE.BoxGeometry(L_dedo_body, h_dedo_body, L_dedo_body);
    var mesh_body = new THREE.Mesh(geometry_body, material);
    mesh_body.position.set(x, y, z);

    var geometry_tip = new THREE.BufferGeometry();
    const vertices = new Float32Array( [
        L_dedo_tip/2, -h_dedo_tip/2,  L_dedo_tip/2,   // v0
        L_dedo_tip/2, -h_dedo_tip/2,  -L_dedo_tip/2,  // v1
        -L_dedo_tip/2, -h_dedo_tip/2,  -L_dedo_tip/2, // v2
        -L_dedo_tip/2, -h_dedo_tip/2,  L_dedo_tip/2,  // v3
        0,  -h_dedo_body - h_dedo_tip, 0              // v4
    ] );
    const indices = [
        0, 1, 2,
        2, 3, 0,
        0, 4, 1,
        1, 4, 2,
        2, 4, 3,
        3, 4, 0,
        
    ];
    geometry_tip.setIndex( indices );
    geometry_tip.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

    var mesh_tip = new THREE.Mesh(geometry_tip, material);
    mesh_tip.position.set(x, y, z);
       
    dedo.add(mesh_body);
    dedo.add(mesh_tip);
    dedo.name = number;
    dedo.position.set(x, y, z);
    obj.add(dedo);
}

function createContainer(x, y, z) {
    'use strict';

    var container = new THREE.Object3D();
    containerMaterial = new THREE.MeshBasicMaterial({ color: 0xE72929, wireframe: true});
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
    containerBaseMaterial = new THREE.MeshBasicMaterial({ color: 0xC40C0C, wireframe: true});
    mesh = new THREE.Mesh(geometry, containerBaseMaterial);
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

function createDodecahedronCargo(x, y, z) {
    'use strict';

    var dodecahedronCargo = new THREE.Object3D();
    dodecahedronCargoMaterial = new THREE.MeshBasicMaterial({ color: 0x45c58a, wireframe: true});
    scene.add(dodecahedronCargo);

    geometry = new THREE.DodecahedronGeometry(3);
    mesh = new THREE.Mesh(geometry, dodecahedronCargoMaterial);
    mesh.position.set(x, y, z);
    dodecahedronCargo.add(mesh);
}

function createIcosahedronCargo(x, y, z) {
    'use strict';

    var isocahedronCargo = new THREE.Object3D();
    icosahedronCargoMaterial = new THREE.MeshBasicMaterial({color: 0xcc4d97, wireframe: true});
    scene.add(isocahedronCargo);

    geometry = new THREE.IcosahedronGeometry(3);
    mesh = new THREE.Mesh(geometry, icosahedronCargoMaterial);
    mesh.position.set(x, y, z);
    isocahedronCargo.add(mesh);
}

function createTorusCargo(x, y, z) {
    'use strict';

    var torusCargo = new THREE.Object3D();
    torusCargoMaterial = new THREE.MeshBasicMaterial({color: 0xaacc00, wireframe: true});
    scene.add(torusCargo);

    geometry = new THREE.TorusGeometry(2.4, 1.5, 7, 10, 10);
    mesh = new THREE.Mesh(geometry, torusCargoMaterial);
    mesh.position.set(x, y, z);
    torusCargo.add(mesh);
}

function createCubeCargo(x, y, z) {
    'use strict';

    var cubeCargo = new THREE.Object3D();
    cubeCargoMaterial = new THREE.MeshBasicMaterial({color: 0xE77828, wireframe: true});
    scene.add(cubeCargo);

    geometry = new THREE.BoxGeometry(5, 5, 5);
    mesh = new THREE.Mesh(geometry, cubeCargoMaterial);
    mesh.position.set(x, y, z);
    cubeCargo.add(mesh);
}

function createTorusKnotCargo(x, y, z) {
    'use strict';

    var torusKnotCargo = new THREE.Object3D();
    torusKnotMaterial = new THREE.MeshBasicMaterial({color: 0xF06292, wireframe: true});
    scene.add(torusKnotCargo);

    geometry = new THREE.TorusKnotGeometry();
    mesh = new THREE.Mesh(geometry, torusKnotMaterial);
    mesh.position.set(x, y, z);
    torusKnotCargo.add(mesh);
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

    var timeElapsed = clock.getDelta();

    greatgrandson.children.forEach (child => {
        if (child.name === "garra") {
            // atualizar posição da esfera
        }
    })

    // Top section rotation
    if (son.userData.positiveRotation) {
        son.rotateY(son.userData.speed * timeElapsed);
    }

    if (son.userData.negativeRotation) {
        son.rotateY(-(son.userData.speed * timeElapsed));
    }
    
    // Car movement
    if (grandson.userData.movingOut && (grandson.userData.horizontal_desloc < grandson.userData.maxCarTranslationLimit)) {
        grandson.translateX(grandson.userData.horizontal_speed * timeElapsed);
        grandson.userData.horizontal_desloc += (grandson.userData.horizontal_speed * timeElapsed);
    }

    if (grandson.userData.movingIn && (grandson.userData.horizontal_desloc > grandson.userData.minCarTranslationLimit)) {
        grandson.translateX(-(grandson.userData.horizontal_speed * timeElapsed));
        grandson.userData.horizontal_desloc -= (grandson.userData.horizontal_speed * timeElapsed);
    }
    
    // Cable going upwards
    if (greatgrandson.userData.cableGoingUp && (greatgrandson.userData.vertical_desloc < greatgrandson.userData.maxCableTranslationLimit)) {
            greatgrandson.translateY(greatgrandson.userData.vertical_speed * timeElapsed);
            grandson.children.forEach (child => {
                if (child.name === "cabo") {
                    child.scale.y -= (greatgrandson.userData.vertical_speed * timeElapsed)/child.geometry.parameters.height;
                    child.translateY((greatgrandson.userData.vertical_speed * timeElapsed)/2);
                }
            });
            greatgrandson.userData.vertical_desloc += greatgrandson.userData.vertical_speed * timeElapsed;
    }

    // Cable going downwards
    if (greatgrandson.userData.cableGoingDown && (greatgrandson.userData.vertical_desloc > greatgrandson.userData.minCableTranslationLimit)) {
            greatgrandson.translateY(-(greatgrandson.userData.vertical_speed * timeElapsed));
            grandson.children.forEach (child => {
                if (child.name === "cabo") {
                    child.scale.y += (greatgrandson.userData.vertical_speed * timeElapsed)/child.geometry.parameters.height;
                    child.translateY(-((greatgrandson.userData.vertical_speed * timeElapsed)/2));
                }
            });
            greatgrandson.userData.vertical_desloc -= greatgrandson.userData.vertical_speed * timeElapsed;
            console.log("###############################################################")
            console.log("Minimum X:", garraBoundingBox.min.x);
            console.log("Minimum Y:", garraBoundingBox.min.y);
            console.log("Minimum Z:", garraBoundingBox.min.z);

            console.log("Maximum X:", garraBoundingBox.max.x);
            console.log("Maximum Y:", garraBoundingBox.max.y);
            console.log("Maximum Z:", garraBoundingBox.max.z);
;    }

    // Claw closing
    if (greatgrandson.userData.closeClaw) {
        greatgrandson.children.forEach (child => {
            if (child.name === '1') {
                child.rotateOnAxis(new THREE.Vector3(-1, 0, -1),  -(greatgrandson.userData.claw_speed * timeElapsed));
            }
            if (child.name === '2') {
                child.rotateOnAxis(new THREE.Vector3(1, 0, -1),  greatgrandson.userData.claw_speed * timeElapsed);
            }
            if (child.name === '3') {
                child.rotateOnAxis(new THREE.Vector3(1, 0, 1), -(greatgrandson.userData.claw_speed * timeElapsed));
            }
            if (child.name === '4') {
                child.rotateOnAxis(new THREE.Vector3(-1, 0, 1), greatgrandson.userData.claw_speed * timeElapsed);
            }
        })
    }

    // Claw opening
    if (greatgrandson.userData.openClaw) {
        greatgrandson.children.forEach (child => {
            if (child.name === '1') {
                child.rotateOnAxis(new THREE.Vector3(-1, 0, -1), greatgrandson.userData.claw_speed * timeElapsed);
            }
            if (child.name === '2') {
                child.rotateOnAxis(new THREE.Vector3(1, 0, -1), -(greatgrandson.userData.claw_speed * timeElapsed));
            }
            if (child.name === '3') {
                child.rotateOnAxis(new THREE.Vector3(1, 0, 1), greatgrandson.userData.claw_speed * timeElapsed);
            }
            if (child.name === '4') {
                child.rotateOnAxis(new THREE.Vector3(-1, 0, 1), -(greatgrandson.userData.claw_speed * timeElapsed));
            }
        })
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

    currentCamera = camera1;

    const controls = new OrbitControls(currentCamera, renderer.domElement);

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
        // camera switching
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
            var materials = [
                baseMaterial,
                material,
                containerMaterial,
                dodecahedronCargoMaterial,
                icosahedronCargoMaterial,
                torusCargoMaterial,
                containerBaseMaterial,
                eixoMaterial,
                cabineMaterial,
                lancaMaterial,
                contraLancaMaterial,
                portaLancaMaterial,
                caboMaterial,
                tiranteMaterial,
                carroMaterial,
                contraPesoMaterial,
                garraMaterial,
                torusKnotMaterial,
                cubeCargoMaterial
                ];
        
            materials.forEach(function(mat) {
                mat.wireframe = !mat.wireframe;
            });
            break;
        // superior section rotation
        case 81: // Q/q
            son.userData.positiveRotation = true;
            break;
        case 65: // A/a
            son.userData.negativeRotation = true;
            break;
        // car movement
        case 87: // W/w
            grandson.userData.movingOut = true;
            break;
        case 83: // S/s
            grandson.userData.movingIn = true;
            break;
        // claw's vertical movement
        case 69: // E/e
            greatgrandson.userData.cableGoingUp = true;
            break;
        case 68: // D/d
            greatgrandson.userData.cableGoingDown = true;
            break;
        //claw's opening/closing movement
        case 82: // R/r
            greatgrandson.userData.openClaw = true;
            break;
        case 70: // F/f
            greatgrandson.userData.closeClaw = true;
            break;
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

    switch(e.keyCode) {
        // superior section rotation
        case 81: // Q/q
            son.userData.positiveRotation = false;
            break;
        case 65: // A/a
            son.userData.negativeRotation = false;
            break;
        // car movement
        case 87: // W/w
            grandson.userData.movingOut = false;
            break;
        case 83: // S/s
        case 115: // s
            grandson.userData.movingIn = false;
            break;
        // claw's vertical movement
        case 69: // E/e
            greatgrandson.userData.cableGoingUp = false;
            break;
        case 68: // D/d
            greatgrandson.userData.cableGoingDown = false;
            break;
        //claw's opening/closing movement
        case 82: // R/r
            greatgrandson.userData.openClaw = false;
            break;
        case 70: // F/f
            greatgrandson.userData.closeClaw = false;
            break;
    }
}

init();
animate();