import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import * as Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

// Cameras, scene, renderer and clock
var camera1, camera2, camera3, camera4, camera5, camera6, currentCamera, tempCamera, previousCamera;
var scene, renderer, clock;

// Meshes
var mesh, cubeCargoMesh, dodecahedronCargoMesh, icosahedronCargoMesh, torusCargoMesh, torusKnotCargoMesh;

// Materials
var geometry;
var cubeCargoMaterial,  icosahedronCargoMaterial, torusCargoMaterial, torusKnotCargoMaterial, dodecahedronCargoMaterial;
var containerBaseMaterial, containerMaterial;
var metalMaterial, concreteMaterial, cableMaterial, cabinMaterial, trolleyMaterial, clawMaterial;
var containerBaseMaterial, containerMaterial;

// Object3Ds
var father, son, grandson, greatgrandson;

// Radii (for collision detection)
const greatGrandSonRadius = 1.5; 
const cubeRadius = 2;
const icosahedronRadius = 3;
const dodecahedronRadius = 3.5;
const torusRadius = 4;
const torusKnotRadius = 2;

// Measurements
// L: width, h: height, c: length

const L_base = 9;
const h_base = 3;

const L_tower = 3;
const h_tower = 36;

const h_axis = 1;

const L_frontJib = 45;
const h_frontJib = 3;

const L_counterJib = 9;
const h_counterJib = 3;

const h_towerPeak = 6;

const L_counterWeight = 4.5;
const h_counterWeight = 1.5;
const c_counterWeight = 2;

const L_trolley = 3;
const h_trolley = 1.5;

const L_container = 20;
const h_container = 6;
const c_container = 8;

const c_frontCable = 35;
const c_counterCable = 12.1;

const initial_delta1 = 27;
const trolleyCableRadius = 0.1; 

const initial_delta2 = 9;
const hookRadius = 1.5  ;
const h_hook = 1.25;

const L_clawBody = 0.5;
const h_clawBody = 0.75;
const L_clawTip = 0.5;
const h_clawTip = 0.5;

// Other vars (used for the animation)
var animating = false;
var part2 = false;
var rotateNegative = false;

// HUD
const views_keys = {
    'Front camera (1)' : false,
    'Side camera (2)' : false,
    'Top camera (3)' : false,
    'Fixed orthographic camera (4)' : false,
    'Fixed perspective camera (5)' : false,
    'Mobile camera (6)' : false,
    'Wireframe mode on/off (7)' : false,
};

const movement_keys = {
    'Positive rotation (Q)' : false,
    'Negative rotation (A)' : false,
    'Outwards trolley movement (W)' : false,
    'Inwards trolley movement (S)' : false,
    'Upwards cable movement (E)' : false,
    'Downwards cable movement (D)' : false,
    'Claws opening (R)' : false,
    'Claws closing (F)' : false,
};

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    // define the background and add a floor to the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xb8cef2);
    let floor = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 2), new THREE.MeshBasicMaterial({color: 0x999999, side: THREE.DoubleSide}));
    floor.rotateX(-Math.PI/2);
    floor.position.y = -1;
    scene.add(floor);

    createMaterials();

    createFather(0, h_base/2, 0);

    createContainer(25, 0, 10);

    createDodecahedronCargo(-20, 2.7, -10);
    createIcosahedronCargo(10, 2.5, -17);
    createTorusCargo(-25, 2.7, 15);
    createCubeCargo(-5, 2, -16);
    createTorusKnotCargo(-6, 1.7, 20);
}

function createMaterials() {
    metalMaterial = new THREE.MeshBasicMaterial({ color: 0xEABE6C, wireframe: true });
    concreteMaterial = new THREE.MeshBasicMaterial({ color: 0x5B5655, wireframe: true });  
    cableMaterial = new THREE.MeshBasicMaterial({ color: 0x322C2B, wireframe: true });
    cabinMaterial = new THREE.MeshBasicMaterial({ color: 0xEBEBE9, wireframe: true });
    trolleyMaterial = new THREE.MeshBasicMaterial({ color: 0xFDB336, wireframe: true });    
    clawMaterial = new THREE.MeshBasicMaterial({ color: 0x322C2B, wireframe: true });

    torusKnotCargoMaterial = new THREE.MeshBasicMaterial({color: 0xF06292, wireframe: true});
    cubeCargoMaterial = new THREE.MeshBasicMaterial({color: 0xE77828, wireframe: true});
    torusCargoMaterial = new THREE.MeshBasicMaterial({color: 0xaacc00, wireframe: true});
    dodecahedronCargoMaterial = new THREE.MeshBasicMaterial({ color: 0x45c58a, wireframe: true});
    icosahedronCargoMaterial = new THREE.MeshBasicMaterial({color: 0xcc4d97, wireframe: true});

    containerMaterial = new THREE.MeshBasicMaterial({ color: 0xB53A31, wireframe: true});
    containerBaseMaterial = new THREE.MeshBasicMaterial({ color: 0x6A0300, wireframe: true});
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createOrthographicCamera(x, y, z) {
    'use strict';
    // OrthographicCamera(left, right, top, bottom, near, far)
    tempCamera = new THREE.OrthographicCamera(window.innerWidth / -20,
        window.innerWidth / 20, window.innerHeight / 20, 
        window.innerHeight / -20, 1, 1000);
    tempCamera.position.set(x, y, z);
    return tempCamera;
}

function createPerspectiveCamera(x, y, z) {
    'use strict';
    // PerspectiveCamera(fov, aspect, near, far)
    tempCamera = new THREE.PerspectiveCamera(70,
        window.innerWidth / window.innerHeight, 1, 1000);
    tempCamera.position.set(x, y, z);
    return tempCamera;
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

    addBoxGeometry(father, 0, 0, 0, L_base, h_base, L_base, concreteMaterial); // base
    addBoxGeometry(father, 0, h_tower/2 + h_base/2, 0, L_tower, h_tower, L_tower, metalMaterial); // tower

    scene.add(father);
    father.position.set(x, y, z);

    createSon(father, 0, h_tower + h_base - h_axis, 0);
}

function createSon(obj, x, y, z) {
    'use strict';

    son = new THREE.Object3D();
    son.userData = { positiveRotation: false, negativeRotation: false, speed: Math.PI/4, crane_angle: 0 } 

    addRotationAxis(son, 0, 0, 0);
    addBoxGeometry(son, L_frontJib/2 - L_tower/2, h_frontJib - h_axis, 0, L_frontJib, h_frontJib, h_frontJib, metalMaterial); // front jib
    addBoxGeometry(son, -L_tower*2, h_counterJib - h_axis, 0, L_counterJib, h_counterJib, h_counterJib, metalMaterial); // counter jib
    addTowerPeak(son, 0, h_towerPeak - h_axis * 2, 0);
    addBoxGeometry(son, -L_tower*(5/2), h_counterWeight/2 - h_axis, 0, L_counterWeight, h_counterWeight, c_counterWeight, concreteMaterial); // counterweight
    addBoxGeometry(son, L_tower, -h_axis, 0, L_tower, L_tower, L_tower, cabinMaterial); // cabin
    addJibCable(son, c_frontCable/2 - 0.25, h_towerPeak + h_frontJib/2 - 0.2 - h_axis, 0, c_frontCable, 0);
    addJibCable(son, - c_counterCable/2 + 0.8, h_towerPeak + h_frontJib/2 - 0.2 - h_axis, 0, c_counterCable, 1);

    obj.add(son);

    son.position.x = x;
    son.position.y = y;
    son.position.z = z;

    createGrandson(son, initial_delta1, h_axis - h_trolley + 0.3, 0);
}

function addRotationAxis(obj, x, y, z) {
    'use strict';
    // CylinderGeometry(radiusTop, radiusBottom, height, heightSegments)
    geometry = new THREE.CylinderGeometry(L_tower/2 - 0.2, L_tower/2 - 0.2, h_axis, 16);
    mesh = new THREE.Mesh(geometry, clawMaterial);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addTowerPeak(obj, x, y, z) {
    'use strict';
    geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array( [
        L_tower/2, -h_axis/2,  L_tower/2,   // v0
        L_tower/2, -h_axis/2,  -L_tower/2,  // v1
        -L_tower/2, -h_axis/2,  -L_tower/2, // v2
        -L_tower/2, -h_axis/2,  L_tower/2,  // v3
        0, h_towerPeak - h_axis/2, 0       // v4
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

    mesh = new THREE.Mesh(geometry, metalMaterial);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addJibCable(obj, x, y, z, c_tirante, direction) {
    'use strict';

    geometry = new THREE.CylinderGeometry(0.1,0.1, c_tirante);
    mesh = new THREE.Mesh(geometry, cableMaterial);
    mesh.position.set(x, y, z);
    var angle = ((Math.PI/2) - Math.asin(h_towerPeak / c_tirante));
    mesh.rotation.z = angle; // Rotate around the Z axis 

    mesh.rotation.y = Math.PI * direction; // Direction will either be 0 or 1 i.e either rotates (y) or doesnt
    obj.add(mesh);
}

function createGrandson(obj, x, y, z) {
    'use strict';
    
    grandson = new THREE.Object3D();
    grandson.userData = {movingOut: false, movingIn: false,
                        maxCarTranslationLimit: L_frontJib - initial_delta1 - L_trolley,
                        minCarTranslationLimit: - initial_delta1 + L_trolley + L_tower,
                        horizontal_speed: 5,
                        horizontal_desloc: 0}

    addBoxGeometry(grandson, 0, 0, 0, L_trolley, h_trolley, h_frontJib, trolleyMaterial); // trolley
    addTrolleyCable(grandson, 0, -initial_delta2/2, 0);

    obj.add(grandson);

    grandson.position.x = x;
    grandson.position.y = y;
    grandson.position.z = z;

    createGreatGrandson(grandson, 0, -initial_delta2, 0);
}

function addTrolleyCable(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CylinderGeometry(trolleyCableRadius, trolleyCableRadius, initial_delta2);
    mesh = new THREE.Mesh(geometry, cableMaterial);
    mesh.position.set(x, y, z);
    mesh.name = "cable";
    obj.add(mesh);
}

function createGreatGrandson(obj, x, y, z) {
    'use strict';
    
    greatgrandson = new THREE.Object3D();
    greatgrandson.userData = {cableGoingDown: false, cableGoingUp: false,
                        maxCableTranslationLimit: h_hook * 5,
                        minCableTranslationLimit: -h_tower + h_base + h_hook + h_trolley + 3,/*-(h_tower/2 + 10),*/
                        vertical_speed: 5, 
                        vertical_desloc: 0, //remover
                        openClaw: false, closeClaw: false,
                        claw_speed: 0.5,
                        claw_angle: 0,
                        maxAngleLimit: Math.PI/1.3,
                        minAngleLimit: -Math.PI/4,
                        }

    addClaw(greatgrandson, 0, 0, 0);
    addClawFinger(greatgrandson, -L_clawBody/2 - L_clawTip/2, -h_clawBody/3, L_clawBody/2 + L_clawTip/2, '1');
    addClawFinger(greatgrandson, L_clawBody/2 + L_clawTip/2, -h_clawBody/3, L_clawBody/2 + L_clawTip/2, '2');
    addClawFinger(greatgrandson, L_clawBody/2 + L_clawTip/2, -h_clawBody/3, -L_clawBody/2 - L_clawTip/2, '3');
    addClawFinger(greatgrandson, -L_clawBody/2 - L_clawTip/2, -h_clawBody/3, -L_clawBody/2 - L_clawTip/2, '4');
    camera6 = createPerspectiveCamera(0, -L_clawBody, 0);
    greatgrandson.add(camera6)
    camera6.rotation.x = -Math.PI/2;

    obj.add(greatgrandson);

    greatgrandson.position.x = x;
    greatgrandson.position.y = y;
    greatgrandson.position.z = z;
}

function addClaw(obj, x, y, z) {
    'use strict';
    geometry = new THREE.CylinderGeometry(hookRadius, hookRadius, h_hook, 20);
    mesh = new THREE.Mesh(geometry, clawMaterial);
    mesh.position.set(x, y, z);
    mesh.name = "garra";
    obj.add(mesh);
}

function addClawFinger(obj, x, y, z, number) {
    'use strict';
    
    var dedo = new THREE.Group();
    // dedo é composto por body(articulação) e tip(ponta)
    var geometry_body = new THREE.BoxGeometry(L_clawBody, h_clawBody, L_clawBody);
    var mesh_body = new THREE.Mesh(geometry_body, clawMaterial);
    mesh_body.position.set(x, y, z);

    var geometry_tip = new THREE.BufferGeometry();
    const vertices = new Float32Array( [
        L_clawTip/2, -h_clawTip/2,  L_clawTip/2,   // v0
        L_clawTip/2, -h_clawTip/2,  -L_clawTip/2,  // v1
        -L_clawTip/2, -h_clawTip/2,  -L_clawTip/2, // v2
        -L_clawTip/2, -h_clawTip/2,  L_clawTip/2,  // v3
        0,  -h_clawBody - h_clawTip, 0              // v4
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

    var mesh_tip = new THREE.Mesh(geometry_tip, metalMaterial);
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
    scene.add(container);

    addBoxGeometry(container, x, y + 0.1, z, L_container, 0.3, c_container, containerBaseMaterial); // container base
    addBoxGeometry(container, x, y + h_container/2, z - c_container/2, L_container, h_container, 0.3, containerMaterial); // wall 1
    addBoxGeometry(container, x, y + h_container/2, z + c_container/2, L_container, h_container, 0.3, containerMaterial); // wall 2
    addBoxGeometry(container, x + L_container/2, y + h_container/2, z, 0.3, h_container, c_container, containerMaterial); // wall 3
    addBoxGeometry(container, x - L_container/2, y + h_container/2, z, 0.3, h_container, c_container, containerMaterial); // wall 4
}

function addBoxGeometry(obj, x, y, z, L, h, c, mat) {
    'use strict';
    // BoxGeometry(width, height, length)
    geometry = new THREE.BoxGeometry(L, h, c);
    mesh = new THREE.Mesh(geometry, mat);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function createDodecahedronCargo(x, y, z) {
    'use strict';
    geometry = new THREE.DodecahedronGeometry(3);
    dodecahedronCargoMesh = new THREE.Mesh(geometry, dodecahedronCargoMaterial);
    dodecahedronCargoMesh.position.set(x, y, z);
    scene.add(dodecahedronCargoMesh);
}

function createIcosahedronCargo(x, y, z) {
    'use strict';
    geometry = new THREE.IcosahedronGeometry(3);
    icosahedronCargoMesh = new THREE.Mesh(geometry, icosahedronCargoMaterial);
    icosahedronCargoMesh.position.set(x, y, z);
    scene.add(icosahedronCargoMesh);
}

function createTorusCargo(x, y, z) {
    'use strict';
    geometry = new THREE.TorusGeometry(2.4, 1.5, 7, 10, 10);
    torusCargoMesh = new THREE.Mesh(geometry, torusCargoMaterial);
    torusCargoMesh.position.set(x, y, z);
    scene.add(torusCargoMesh);
}

function createCubeCargo(x, y, z) {
    'use strict';
    geometry = new THREE.BoxGeometry(3, 3, 3);
    cubeCargoMesh = new THREE.Mesh(geometry, cubeCargoMaterial);
    cubeCargoMesh.position.set(x, y, z);
    scene.add(cubeCargoMesh);
}

function createTorusKnotCargo(x, y, z) {
    'use strict';
    geometry = new THREE.TorusKnotGeometry();
    torusKnotCargoMesh = new THREE.Mesh(geometry, torusKnotCargoMaterial);
    torusKnotCargoMesh.position.set(x, y, z);
    scene.add(torusKnotCargoMesh);
}


//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function hasCollision(rA, rB, objA, lock) {
    var lockCoords = new THREE.Vector3();
    lock.getWorldPosition(lockCoords);

    return Math.pow((rA + rB), 2) >= Math.pow((lockCoords.x - objA.position.x), 2) +
         Math.pow((lockCoords.y - objA.position.y),2) + Math.pow((lockCoords.z - objA.position.z),2);
}
    

function checkCollisions(){
    'use strict';

    // check collision with cube
    if (hasCollision(cubeRadius, greatGrandSonRadius, cubeCargoMesh, greatgrandson)) {
        animating = true;
        greatgrandson.attach(cubeCargoMesh);
        return cubeCargoMesh;
    }
    // check collision with dodecahedron
    if (hasCollision(dodecahedronRadius, greatGrandSonRadius, dodecahedronCargoMesh, greatgrandson)) {
        animating = true;
        greatgrandson.attach(dodecahedronCargoMesh);
        return dodecahedronCargoMesh;
    }
    // check collision with icosahedron
    if (hasCollision(icosahedronRadius, greatGrandSonRadius, icosahedronCargoMesh, greatgrandson)) {
        animating = true;
        greatgrandson.attach(icosahedronCargoMesh);
        return icosahedronCargoMesh;
    }
    // check collision with Torus
    if (hasCollision(torusRadius, greatGrandSonRadius, torusCargoMesh, greatgrandson)) {
        animating = true;
        greatgrandson.attach(torusCargoMesh);
        return torusCargoMesh;
    }
    // check collision with TorusKnot
    if (hasCollision(torusKnotRadius, greatGrandSonRadius, torusKnotCargoMesh, greatgrandson)) {
        animating = true;
        greatgrandson.attach(torusKnotCargoMesh);
        return torusKnotCargoMesh;
    }

}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(mesh, timeElapsed){
    'use strict';

    // part1 - claw closing
    if (!part2 && greatgrandson.userData.claw_angle < greatgrandson.userData.maxAngleLimit) {
        let inc = greatgrandson.userData.claw_speed * timeElapsed;
        greatgrandson.children.forEach (child => {
            if (child.name === '1') {
                child.rotateOnAxis(new THREE.Vector3(-1, 0, -1), -inc);
                greatgrandson.userData.claw_angle += inc;
            }
            if (child.name === '2') {
                child.rotateOnAxis(new THREE.Vector3(1, 0, -1), inc);
                greatgrandson.userData.claw_angle += inc;
            }
            if (child.name === '3') {
                child.rotateOnAxis(new THREE.Vector3(1, 0, 1), -inc);
                greatgrandson.userData.claw_angle += inc;
            }
            if (child.name === '4') {
                child.rotateOnAxis(new THREE.Vector3(-1, 0, 1), inc);
                greatgrandson.userData.claw_angle += inc;
            }
        })
        return;
    }

    // part2 - claw going up
    if (!part2 && greatgrandson.userData.vertical_desloc < -5) {
        let inc = greatgrandson.userData.vertical_speed * timeElapsed
        greatgrandson.translateY(inc);
        grandson.children.forEach (child => {
            if (child.name === "cable") {
                child.scale.y -= inc/child.geometry.parameters.height;
                child.translateY(inc/2);
            }
        });
        greatgrandson.userData.vertical_desloc += inc;
        return;
    }
    part2 = true;

    // part3 - crane rotating
    if (!rotateNegative && son.userData.crane_angle > -0.40) {
        let inc = son.userData.speed * timeElapsed;
        son.rotateY(-inc);
        son.userData.crane_angle -= inc;
        return;
    } else if (son.userData.crane_angle < -0.40) {
        let inc = son.userData.speed * timeElapsed;
        son.rotateY(inc);
        son.userData.crane_angle += inc;
        rotateNegative = true;
        return;
    }

    // part4 - car moving
    if (grandson.userData.horizontal_desloc < -0.2) {
        let inc = grandson.userData.horizontal_speed * timeElapsed;
        grandson.translateX(inc);
        grandson.userData.horizontal_desloc += inc;
        return;
    }

    // part5 - claw going down
    if (greatgrandson.userData.vertical_desloc > -23) {
        let inc = greatgrandson.userData.vertical_speed * timeElapsed;
        greatgrandson.translateY(-inc);
        grandson.children.forEach (child => {
            if (child.name === "cable") {
                child.scale.y += inc/child.geometry.parameters.height;
                child.translateY(-inc/2);
            }
        });
        greatgrandson.userData.vertical_desloc -= inc;
        return;
    }
    
    // part6 - claw opening
    if (greatgrandson.userData.claw_angle > 0) {
        let inc = greatgrandson.userData.claw_speed * timeElapsed;
        greatgrandson.children.forEach (child => {
            if (child.name === '1') {
                child.rotateOnAxis(new THREE.Vector3(-1, 0, -1), inc);
                greatgrandson.userData.claw_angle -= inc;
            }
            if (child.name === '2') {
                child.rotateOnAxis(new THREE.Vector3(1, 0, -1), -inc);
                greatgrandson.userData.claw_angle -= inc;
            }
            if (child.name === '3') {
                child.rotateOnAxis(new THREE.Vector3(1, 0, 1), inc);
                greatgrandson.userData.claw_angle -= inc;
            }
            if (child.name === '4') {
                child.rotateOnAxis(new THREE.Vector3(-1, 0, 1), -inc);
                greatgrandson.userData.claw_angle -= inc;
            }
        })
        return;
    }

    mesh.parent.remove(mesh);

    part2 = false;
    rotateNegative = false;
    animating = false;
}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';

    var timeElapsed = clock.getDelta();

    // Top section rotation
    if (son.userData.positiveRotation) {
        let inc = son.userData.speed * timeElapsed;
        son.rotateY(inc);
        son.userData.crane_angle += inc;
    }

    if (son.userData.negativeRotation) {
        let inc = son.userData.speed * timeElapsed;
        son.rotateY(-inc);
        son.userData.crane_angle -= inc;
    }
    
    // Car movement
    if (grandson.userData.movingOut && (grandson.userData.horizontal_desloc < grandson.userData.maxCarTranslationLimit)) {
        let inc = grandson.userData.horizontal_speed * timeElapsed;
        grandson.translateX(inc);
        grandson.userData.horizontal_desloc += inc;
    }

    if (grandson.userData.movingIn && (grandson.userData.horizontal_desloc > grandson.userData.minCarTranslationLimit)) {
        let inc = grandson.userData.horizontal_speed * timeElapsed;
        grandson.translateX(-inc);
        grandson.userData.horizontal_desloc -= inc;
    }
    
    // Cable going upwards
    if (greatgrandson.userData.cableGoingUp && (greatgrandson.userData.vertical_desloc < greatgrandson.userData.maxCableTranslationLimit)) {
        let inc = greatgrandson.userData.vertical_speed * timeElapsed;
        greatgrandson.translateY(inc);
        grandson.children.forEach (child => {
            if (child.name === "cable") {
                child.scale.y -= inc/child.geometry.parameters.height;
                child.translateY(inc/2);
            }
        });
        greatgrandson.userData.vertical_desloc += inc;
    }

    // Cable going downwards
    if (greatgrandson.userData.cableGoingDown && (greatgrandson.userData.vertical_desloc > greatgrandson.userData.minCableTranslationLimit)) {
        let inc = greatgrandson.userData.vertical_speed * timeElapsed;
        greatgrandson.translateY(-inc);
        grandson.children.forEach (child => {
            if (child.name === "cable") {
                child.scale.y += inc/child.geometry.parameters.height;
                child.translateY(-inc/2);
            }
        });
        greatgrandson.userData.vertical_desloc -= inc;
    }

    // Claw closing
    if (greatgrandson.userData.closeClaw && (greatgrandson.userData.claw_angle < greatgrandson.userData.maxAngleLimit)) {
        let inc = greatgrandson.userData.claw_speed * timeElapsed;
        greatgrandson.children.forEach (child => {
            if (child.name === '1') {
                child.rotateOnAxis(new THREE.Vector3(-1, 0, -1), -inc);
                greatgrandson.userData.claw_angle += inc;
            }
            if (child.name === '2') {
                child.rotateOnAxis(new THREE.Vector3(1, 0, -1), inc);
                greatgrandson.userData.claw_angle += inc;
            }
            if (child.name === '3') {
                child.rotateOnAxis(new THREE.Vector3(1, 0, 1), -inc);
                greatgrandson.userData.claw_angle += inc;
            }
            if (child.name === '4') {
                child.rotateOnAxis(new THREE.Vector3(-1, 0, 1), inc);
                greatgrandson.userData.claw_angle += inc;
            }
        })
    }

    // Claw opening
    if (greatgrandson.userData.openClaw && greatgrandson.userData.claw_angle > greatgrandson.userData.minAngleLimit) {
        let inc = greatgrandson.userData.claw_speed * timeElapsed;
        greatgrandson.children.forEach (child => {
            if (child.name === '1') {
                child.rotateOnAxis(new THREE.Vector3(-1, 0, -1), inc);
                greatgrandson.userData.claw_angle -= inc;
            }
            if (child.name === '2') {
                child.rotateOnAxis(new THREE.Vector3(1, 0, -1), -inc);
                greatgrandson.userData.claw_angle -= inc;
            }
            if (child.name === '3') {
                child.rotateOnAxis(new THREE.Vector3(1, 0, 1), inc);
                greatgrandson.userData.claw_angle -= inc;
            }
            if (child.name === '4') {
                child.rotateOnAxis(new THREE.Vector3(-1, 0, 1), -inc);
                greatgrandson.userData.claw_angle -= inc;
            }
        })
    }

    updateViewKeys();
    updateMovementKeys();

    if (!animating) {
        mesh = checkCollisions();
    }
    if (animating) {
        handleCollisions(mesh, timeElapsed);
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

    camera1 = createOrthographicCamera(0, h_tower/2, 50);
    camera1.lookAt(0, h_tower/2, 0);
    camera2 = createOrthographicCamera(50, h_tower/2, 0);
    camera2.lookAt(0, h_tower/2, 0);
    camera3 = createOrthographicCamera(0, 50, 0);
    camera3.lookAt(scene.position);
    camera4 = createOrthographicCamera(50, 50, 50);
    camera4.lookAt(0, 17, 0);
    camera5 = createPerspectiveCamera(50, 50, 50);
    camera5.lookAt(scene.position);

    currentCamera = camera4;
    views_keys['Fixed orthographic camera (4)'] = true;
    previousCamera = 'Fixed orthographic camera (4)';

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
            views_keys[previousCamera] = false;
            currentCamera = camera1;
            views_keys['Front camera (1)'] = !views_keys['Front camera (1)'];
            previousCamera = 'Front camera (1)';
            break;
        case 50: // 2
            views_keys[previousCamera] = false;
            currentCamera = camera2;
            views_keys['Side camera (2)'] = !views_keys['Side camera (2)'];
            previousCamera = 'Side camera (2)';
            break;
        case 51: // 3
            views_keys[previousCamera] = false;         
            currentCamera = camera3;
            views_keys['Top camera (3)'] = !views_keys['Top camera (3)'];
            previousCamera = 'Top camera (3)';
            break;
        case 52: // 4
            views_keys[previousCamera] = false;
            currentCamera = camera4;
            views_keys['Fixed orthographic camera (4)'] = !views_keys['Fixed orthographic camera (4)'];
            previousCamera = 'Fixed orthographic camera (4)';
            break;
        case 53: // 5
            views_keys[previousCamera] = false;
            currentCamera = camera5;
            views_keys['Fixed perspective camera (5)'] = !views_keys['Fixed perspective camera (5)'];
            previousCamera = 'Fixed perspective camera (5)';
            break;
        case 54: // 6
            views_keys[previousCamera] = false;
            currentCamera = camera6;
            views_keys['Mobile camera (6)'] = !views_keys['Mobile camera (6)'];
            previousCamera = 'Mobile camera (6)'
            break;
        case 55: // 7
            const materials = [
                concreteMaterial,
                containerMaterial,
                dodecahedronCargoMaterial,
                icosahedronCargoMaterial,
                torusCargoMaterial,
                containerBaseMaterial,
                cabinMaterial,
                metalMaterial,
                cableMaterial,
                trolleyMaterial,
                clawMaterial,
                torusKnotCargoMaterial,
                cubeCargoMaterial
                ];
        
            materials.forEach(function(mat) {
                mat.wireframe = !mat.wireframe;
            });
            views_keys['Wireframe mode on/off (7)'] = !views_keys['Wireframe mode on/off (7)'];
            break;
        // superior section rotation
        case 81: // Q/q
            if (animating) break;
            son.userData.positiveRotation = true;
            movement_keys['Positive rotation (Q)'] = true;
            break;
        case 65: // A/a
            if (animating) break;
            son.userData.negativeRotation = true;
            movement_keys['Negative rotation (A)'] = true;
            break;
        // car movement
        case 87: // W/w
            if (animating) break;
            grandson.userData.movingOut = true;
            movement_keys['Outwards trolley movement (W)'] = true;
            break;
        case 83: // S/s
            if (animating) break;
            grandson.userData.movingIn = true;
            movement_keys['Inwards trolley movement (S)'] = true;
            break;
        // claw's vertical movement
        case 69: // E/e
            if (animating) break;
            greatgrandson.userData.cableGoingUp = true;
            movement_keys['Upwards cable movement (E)'] = true;
            break;
        case 68: // D/d
            if (animating) break;
            greatgrandson.userData.cableGoingDown = true;
            movement_keys['Downwards cable movement (D)'] = true;
            break;
        //claw's opening/closing movement
        case 82: // R/r
            if (animating) break;
            greatgrandson.userData.openClaw = true;
            movement_keys['Claws opening (R)'] = true;
            break;
        case 70: // F/f
            if (animating) break;
            greatgrandson.userData.closeClaw = true;
            movement_keys['Claws closing (F)'] = true;
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
            movement_keys['Positive rotation (Q)'] = false;
            break;
        case 65: // A/a
            son.userData.negativeRotation = false;
            movement_keys['Negative rotation (A)'] = false;
            break;
        // car movement
        case 87: // W/w
            grandson.userData.movingOut = false;
            movement_keys['Outwards trolley movement (W)'] = false;
            break;
        case 83: // S/s
            grandson.userData.movingIn = false;
            movement_keys['Inwards trolley movement (S)'] = false;
            break;
        // claw's vertical movement
        case 69: // E/e
            greatgrandson.userData.cableGoingUp = false;
            movement_keys['Upwards cable movement (E)'] = false;
            break;
        case 68: // D/d
            greatgrandson.userData.cableGoingDown = false;
            movement_keys['Downwards cable movement (D)'] = false;
            break;
        //claw's opening/closing movement
        case 82: // R/r
            greatgrandson.userData.openClaw = false;
            movement_keys['Claws opening (R)'] = false;
            break;
        case 70: // F/f
            greatgrandson.userData.closeClaw = false;
            movement_keys['Claws closing (F)'] = false;
            break;
    }
}

///////////////////////
/*        HUD        */
///////////////////////
function updateViewKeys() {
    const viewKeysDiv = document.getElementById('views');
    let views_text = '';
    views_text += '<span style="color":black>View:</span><br>';

    for (const key in views_keys) {
        const active = views_keys[key];
        const color = active ? 'red' : 'white';

        views_text += `<span style="color:${color};">${key}</span><br>`;
    }

    viewKeysDiv.innerHTML = views_text;
}

function updateMovementKeys() {
    const movementKeysDiv = document.getElementById('movement');
    let movement_text = '';
    movement_text += '<span style="color":black>Movement:</span><br>';

    for (const key in movement_keys) {
        const active = movement_keys[key];
        const color = active ? 'red' : 'white';

        movement_text += `<span style="color:${color};">${key}</span><br>`;
    }

    movementKeysDiv.innerHTML = movement_text;
}


init();
animate();