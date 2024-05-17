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
const meshes = [];
// Materials
var geometry;
var carouselMaterial, skydomeMaterial, lambertMaterial, phongMaterial, toonMaterial, normalMaterial, basicMaterial;
var innerRingMaterial, mediumRingMaterial, outerRingMaterial;
var seatMaterial;

// Object3Ds
var carousel, innerRing, mediumRing, outerRing;

// Lights
var directionalLight, ambientLight;

// Measurements
// L: width, h: height, c: length, r: radius
const r_cylinder = 6;
const h_cylinder = 5;

const r_skydome = 95;

const h_ring = 5;

const outerR_ring1 = 20;
const innerR_ring1 = 6;

const outerR_ring2 = 34;
const innerR_ring2 = outerR_ring1;

const outerR_ring3 = 48;
const innerR_ring3 = outerR_ring2;

// Rings movement
var moveInnerRing = false;
var innerRingDown = false;
var moveMediumRing = false;
var mediumRingDown = false;
var moveOuterRing = false;
var outerRingDown = false;

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
    scene.add(floor);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    createDirectionalLight();
    createAmbientLight();

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
    lambertMaterial = new THREE.MeshLambertMaterial();
    phongMaterial = new THREE.MeshPhongMaterial();
    toonMaterial = new THREE.MeshToonMaterial();
    normalMaterial = new THREE.MeshNormalMaterial();
    basicMaterial = new THREE.MeshBasicMaterial();
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createPerspectiveCamera() {
    'use strict';
    // PerspectiveCamera(fov, aspect, near, far)
    perspectiveCamera = new THREE.PerspectiveCamera(70,
        window.innerWidth / window.innerHeight, 1, 1000);
    perspectiveCamera.position.set(50, 65, 40);
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
    directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 2, 1);
    directionalLight.target.position.set(scene.position);
    scene.add(directionalLight);
}

function createAmbientLight() {
    ambientLight = new THREE.AmbientLight(0xd7930a)
    scene.add(ambientLight);
}
////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function addSkydome(x, y, z){
    'use strict';
    //SphereGeometry(radius, widthSegments, heightSegments)
    geometry = new THREE.SphereGeometry(r_skydome, 64, 32, 0, 2 * Math.PI, 0, Math.PI / 2);
    var mesh = new THREE.Mesh(geometry, skydomeMaterial);
    mesh.position.set(x, y, z);

    scene.add(mesh);
}

function createCarousel(x, y, z) {
    'use strict';

    carousel = new THREE.Object3D();
    carousel.userData = { rotationSpeed: Math.PI/12 };

    addCentralCylinder(carousel, x, h_cylinder/2 , z, r_cylinder, h_cylinder);
    addMobiusStrip();

    scene.add(carousel);
    carousel.position.set(x, y, z);

    createInnerRing(carousel, 0, h_cylinder + h_ring, 0);
    createMediumRing(carousel, 0, h_cylinder + 2*h_ring, 0);
    createOuterRing(carousel, 0, h_cylinder + 3*h_ring, 0);
}

function addCentralCylinder(obj, x, y, z, r, h) {
    'use strict';
    // CylinderGeometry(radiusTop, radiusBottom, height, radialSegments)
    geometry = new THREE.CylinderGeometry(r, r, h, 64);
    var cylinderMesh = new THREE.Mesh(geometry, carouselMaterial);
    meshes.push(cylinderMesh);
    cylinderMesh.position.set(x, y, z);
    obj.add(cylinderMesh);
}

function addMobiusStrip() {
    'use strict';
    // TODO
}

// podemos fazer um só metódo a partir destas 3?
function createInnerRing(obj, x, y, z) {
    'use strict';

    innerRing = new THREE.Object3D();
    innerRing.userData = { verticalSpeed: 2 }

    createRing(innerRing, 0, 0, 0, outerR_ring1, innerR_ring1, h_ring, innerRingMaterial);
    innerRing.rotation.x = Math.PI / 2;
    innerRing.position.set(x, y, z);
    var innerRingMesh;
    obj.add(innerRing);
}

function createMediumRing(obj, x, y, z) {
    'use strict';

    mediumRing = new THREE.Object3D();
    mediumRing.userData = { verticalSpeed: 2 }

    createRing(mediumRing, 0, 0, 0, outerR_ring2, innerR_ring2, h_ring, mediumRingMaterial);
    mediumRing.rotation.x  = Math.PI / 2;
    mediumRing.position.set(x, y, z);
    var mediumRingMesh;
    obj.add(mediumRing);

}

function createOuterRing(obj, x, y, z) {
    'use strict';

    outerRing = new THREE.Object3D();
    outerRing.userData = { verticalSpeed: 2 }

    createRing(outerRing, 0, 0, 0, outerR_ring3, innerR_ring3, h_ring, outerRingMaterial)
    outerRing.rotation.x  = Math.PI / 2;
    outerRing.position.set(x, y, z);

    obj.add(outerRing);
}

function createRing(obj, x, y, z, outerRadius, innerRadius, h, geo, mesh) {
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

    var ringGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    var mesh = new THREE.Mesh(ringGeometry, geo);
    meshes.push(mesh);
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

    var timeElapsed = clock.getDelta();

    let inc = carousel.userData.rotationSpeed * timeElapsed;
    carousel.rotateY(inc);

    // inner ring movement
    if (moveInnerRing && !innerRingDown) {
        if (innerRing.position.y > h_cylinder) {
            inc = innerRing.userData.verticalSpeed * timeElapsed;
            innerRing.position.y -= inc
        } else {
            moveInnerRing = false;
            innerRingDown = true;
        }
    } else if (moveInnerRing && innerRingDown) {
        if (innerRing.position.y < h_cylinder + h_ring) {
            inc = innerRing.userData.verticalSpeed * timeElapsed;
            innerRing.position.y += inc
        } else {
            moveInnerRing = false;
            innerRingDown = false;
        }
    }

    // medium ring movement
    if (moveMediumRing && !mediumRingDown) {
        if (mediumRing.position.y > h_cylinder) {
            inc = mediumRing.userData.verticalSpeed * timeElapsed;
            mediumRing.position.y -= inc
        } else {
            moveMediumRing = false;
            mediumRingDown = true;
        }
    } else if (moveMediumRing && mediumRingDown) {
        if (mediumRing.position.y < h_cylinder + 2*h_ring) {
            inc = mediumRing.userData.verticalSpeed * timeElapsed;
            mediumRing.position.y += inc
        } else {
            moveMediumRing = false;
            mediumRingDown = false;
        }
    }

    // outer ring movement
    if (moveOuterRing && !outerRingDown) {
        if (outerRing.position.y > h_cylinder) {
            inc = outerRing.userData.verticalSpeed * timeElapsed;
            outerRing.position.y -= inc
        } else {
            moveOuterRing = false;
            outerRingDown = true;
        }
    } else if (moveOuterRing && outerRingDown) {
        if (outerRing.position.y < h_cylinder + 3*h_ring) {
            inc = outerRing.userData.verticalSpeed * timeElapsed;
            outerRing.position.y += inc
        } else {
            moveOuterRing = false;
            outerRingDown = false;
        }
    }
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
    clock = new THREE.Clock();

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
            moveInnerRing = !moveInnerRing;
            break;
        case 50: // 2
            moveMediumRing = !moveMediumRing;
            break;
        case 51: // 3
            moveOuterRing = !moveOuterRing;
            break;
        case 68: // D/d
            directionalLight.visible = !directionalLight.visible;
            break;
        case 80: // P/p
            break;
        case 83: // S/s
            break;
        case 81: // Q/q
            meshes.forEach(mesh => {
                lambertMaterial.color.copy(mesh.material.color);
                mesh.material = (mesh.material === lambertMaterial) ? basicMaterial : lambertMaterial.clone();
            });
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