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
const seatMeshes = [];
var mesh, cylinderMesh, mobiusStripMesh, innerRingMesh, middleRingMesh, outerRingMesh, skydomeMesh;

// Materials
var geometry;
var carouselMaterial, skydomeMaterial, mobiusStripMaterial;
var lambertMaterial, phongMaterial, toonMaterial, normalMaterial, basicMaterial, currentMaterial;
var innerRingMaterial, middleRingMaterial, outerRingMaterial, seatMaterial;

// Object3Ds
var carousel, innerRing, middleRing, outerRing;

// Lights
const pointLights = [];
const spotLights = [];
var light1, light2, light3, light4, light5, light6, light7, light8;
var directionalLight, ambientLight, spotLight;
var reactingToLight = false;

// Colors
var newColor;

// Measurements
// L: width, h: height, c: length, r: radius
const r_cylinder = 6;
const h_cylinder = 5;

const r_skydome = 95;
const h_strip = 21;

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
var moveMiddleRing = false;
var middleRingDown = false;
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
    currentMaterial = new THREE.MeshBasicMaterial();
    carouselMaterial = new THREE.MeshBasicMaterial({ color: 0xEABE6C, wireframe: false });
    innerRingMaterial = new THREE.MeshBasicMaterial({ color: 0xDD761C, wireframe: false });
    middleRingMaterial = new THREE.MeshBasicMaterial({ color: 0xFEB941, wireframe: false });
    outerRingMaterial = new THREE.MeshBasicMaterial({ color: 0xFDE49E, wireframe: false });
    skydomeMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/an_optical_poem.jpg'), side: THREE.DoubleSide, transparent: true, opacity: 0.7});
    seatMaterial = new THREE.MeshBasicMaterial({ color: 0xB95743, wireframe: false, side: THREE.DoubleSide});
    mobiusStripMaterial = new THREE.MeshLambertMaterial({ color: 0xEABE6C, side: THREE.DoubleSide, wireframe: false });
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

function createPointLight(x, y, z, light) {
    light = new THREE.PointLight( 0xff0000, 10, 300 );
    light.position.set(x, y, z);
    scene.add(light);
    pointLights.push(light);
}

function createSpotLight(obj, mesh, x, y, z) {
    spotLight = new THREE.SpotLight(0xFFFFFF, 200);
    spotLight.position.set(x, y, z);
    spotLight.target = mesh;
    spotLight.angle = 0.7;
	spotLight.distance = 10;
    spotLight.visible = false;

    obj.add(spotLight);
    spotLights.push(spotLight);
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
function addSkydome(x, y, z){
    'use strict';
    //SphereGeometry(radius, widthSegments, heightSegments)
    geometry = new THREE.SphereGeometry(r_skydome, 64, 32, 0, 2 * Math.PI, 0, Math.PI / 2);
    skydomeMesh = new THREE.Mesh(geometry, skydomeMaterial);
    skydomeMesh.position.set(x, y, z);

    scene.add(skydomeMesh);
}

function createCarousel(x, y, z) {
    'use strict';

    carousel = new THREE.Object3D();
    carousel.userData = { rotationSpeed: Math.PI/12 };

    addCentralCylinder(carousel, 0, h_cylinder/2, 0, r_cylinder, h_cylinder);
    addMobiusStrip(carousel, 0, h_cylinder + h_strip, 0);
    
    createPointLight(0.6, h_cylinder + h_strip + 2.0, 1.8, light1);
    createPointLight(-1.4, h_cylinder + h_strip + 2.0, 2.0, light2);
    createPointLight(-4.2, h_cylinder + h_strip + 2.2, 1.6, light3);
    createPointLight(-4.4, h_cylinder + h_strip + 3.0, -2.4, light4);
    createPointLight(-2.6, h_cylinder + h_strip + 3.2, -2.4, light5);
    createPointLight(-0.4, h_cylinder + h_strip + 0.6, -1.0, light6);
    createPointLight(1.4, h_cylinder + h_strip - 1.0, -0.6, light7);
    createPointLight(3.4, h_cylinder + h_strip - 2.6, -0.2, light8);
    
    scene.add(carousel);
    carousel.position.set(x, y, z);

    createInnerRing(carousel, 0, h_cylinder + h_ring, 0);
    createMiddleRing(carousel, 0, h_cylinder + 2*h_ring, 0);
    createOuterRing(carousel, 0, h_cylinder + 3*h_ring, 0);
}

function addCentralCylinder(obj, x, y, z, r, h) {
    'use strict';
    // CylinderGeometry(radiusTop, radiusBottom, height, radialSegments)
    geometry = new THREE.CylinderGeometry(r, r, h, 64);
    cylinderMesh = new THREE.Mesh(geometry, carouselMaterial);
    cylinderMesh.userData.originalColor = carouselMaterial.color.clone();
    meshes.push(cylinderMesh);
    cylinderMesh.position.set(x, y, z);
    obj.add(cylinderMesh);
}

function addMobiusStrip(obj, x, y, z) {
    'use strict';
    geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array( [
        0.6, 2.0,  1.8, // v0
        1.0, -2.0, 2.0, // v1
        0.0, -2.0, 2.0, // v2
        -1.4, 2.0, 2.0, // v3
        -2.2, -2.0, 1.8, // v4
        -3.0, 2.2, 2.2, // v5
        -3.4, -1.8, 1.2, // v6
        -4.2, 2.2, 1.6, // v7
        -4.6, -1.0, 0.0, // v8
        -5.0, 2.4, -0.2, // v9
        -4.8, -0.8, -1.0, // v10
        -4.4, 3.0, -2.4, // v11
        -4.0, 0.4, -3.6, // v12
        -3.6, 3.6, -2.8, // v13
        -3.0, 2.2, -4.4, // v14
        -2.6, 3.2, -2.4, // v15
        -2.0, 2.4, -4.8, // v16
        -1.6, 2.4, -1.8, // v17
        -1.0, 2.4, -4.8, // v18
        -0.4, 0.6, -1.0, // v19
        0.4, 1.8, -4.6, // v20
        0.2, 0.0, -0.8, // v21
        1.2, 1.4, -4.2, // v22
        1.4, -1.0, -0.6, // v23
        2.2, 1.0, -3.8, // v24 
        2.4, -2.2, -0.6, // v25
        3.2, 1.4, -3.0, // v26
        3.4, -2.6, -0.2, // v27
        3.2, 1.8, -2.0, // v28
        2.6, -2.0, 1.2, // v29
        2.0, 2.0, 0.4, // v30
        1.6, -2.0, 1.8, // v31
        1.2, 2.0, 1.2, // v32
    ] );
    const indices = [
        0, 1, 2,
        0, 2, 3,
        2, 3, 4,
        3, 4, 5,
        4, 5, 6,
        5, 6, 7,
        6, 7, 8,
        7, 8, 9,
        8, 9, 10,
        9, 10, 11,
        10, 11, 12,
        11, 12, 13,
        12, 13, 14,
        13, 14, 15,
        14, 15, 16,
        15, 16, 17,
        16, 17, 18,
        17, 18, 19,
        18, 19, 20,
        19, 20, 21,
        20, 21, 22,
        21, 22, 23,
        22, 23, 24,
        23, 24, 25,
        24, 25, 26,
        25, 26, 27,
        26, 27, 28,
        27, 28, 29,
        28, 29, 30,
        29, 30, 31,
        30, 31, 32,
        31, 32, 1,
        32, 1, 0,
    ];
    geometry.setIndex(indices);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    mobiusStripMesh = new THREE.Mesh(geometry, mobiusStripMaterial);
    mobiusStripMesh.position.set(x, y, z);
    obj.add(mobiusStripMesh);
}

// podemos fazer um só metódo a partir destas 3?
function createInnerRing(obj, x, y, z) {
    'use strict';

    innerRing = new THREE.Object3D();
    innerRing.userData = { verticalSpeed: 2 }
    addRing(innerRing, 0, 0, 0, outerR_ring1, innerR_ring1, h_ring, innerRingMaterial, innerRingMesh);
    innerRing.rotation.x = Math.PI / 2;
    innerRing.position.set(x, y, z);

    addSeats(innerRing, 0, 0, 0, (outerR_ring1-innerR_ring1) - r_cylinder/2);

    obj.add(innerRing);
}

function createMiddleRing(obj, x, y, z) {
    'use strict';

    middleRing = new THREE.Object3D();
    middleRing.userData = { verticalSpeed: 2 }
    addRing(middleRing, 0, 0, 0, outerR_ring2, innerR_ring2, h_ring, middleRingMaterial, middleRingMesh);
    middleRing.rotation.x  = Math.PI / 2;
    middleRing.position.set(x, y, z);

    addSeats(middleRing, 0, 0, 0, (outerR_ring2-innerR_ring1) - r_cylinder/2);

    obj.add(middleRing);

}

function createOuterRing(obj, x, y, z) {
    'use strict';

    outerRing = new THREE.Object3D();
    outerRing.userData = { verticalSpeed: 2 }
    addRing(outerRing, 0, 0, 0, outerR_ring3, innerR_ring3, h_ring, outerRingMaterial, outerRingMesh)
    outerRing.rotation.x  = Math.PI / 2;
    outerRing.position.set(x, y, z);

    addSeats(outerRing, 0, 0, 0, (outerR_ring3-innerR_ring1) - r_cylinder/2);

    obj.add(outerRing);
}

function addRing(obj, x, y, z, outerRadius, innerRadius, h, mat, mesh) {
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
    mesh = new THREE.Mesh(ringGeometry, mat);
    mesh.userData.originalColor = mat.color.clone();
    meshes.push(mesh);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function createSeatGeometries(){

    const geometries = [];

    // Esfera
    geometries.push(function sphere( u, v, target ) {

        const r = 3.5;
        u *= Math.PI;
        v *= 2 * Math.PI;

        const x = r * Math.sin( u ) * Math.cos( v );
        const y = r * Math.sin( u ) * Math.sin( v );
        const z =  r * Math.cos( u );

        target.set( x, y, z);
    });

    // Cilindro
    geometries.push(function cylinder(u, v, target) {
        const r = 2;
        const h = 6;
    
        const x = r * Math.cos(v * 2 * Math.PI);
        const y = h * (u - 0.5);
        const z = r * Math.sin(v * 2 * Math.PI);
    
        target.set(x, y, z);
    });

    // Cone
    geometries.push(function cone(u, v, target) {
        const r = 2;
        const h = 4;
    
        const x = (1 - u) * r * Math.cos(v * 2 * Math.PI);
        const y = h * (u - 0.5);
        const z = (1 - u) * r * Math.sin(v * 2 * Math.PI);
    
        target.set(x, y, z);
    });

    // Tronco de Cone
    geometries.push(function truncatedCone(u, v, target) {
        const rT = 1;
        const rB= 2;
        const h = 4;
    
        const r = (1 - u) * rB + u * rT;
        const x = r * Math.cos(v * 2 * Math.PI);
        const y = h * (u - 0.5);
        const z = r * Math.sin(v * 2 * Math.PI);
    
        target.set(x, y, z);
    });

    // Cone Inclinado
    geometries.push(function inclinedCone(u, v, target) {
        const r = 2;
        const h = 6;
    
        const x = (1 - u) * r * Math.cos(v * 2 * Math.PI);
        const y = h * (u - 0.5);
        const z = (1 - u) * r * Math.sin(v * 2 * Math.PI) + 2 * u;
    
        target.set(x, y, z);
    });

    // Hiperboloide de uma Folha
    geometries.push(function hyperboloidOneSheet(u, v, target) {
        const a = 0.375;
        const b = 0.375;
        const c = 0.75;
    
        v *= 2 * Math.PI;
        u = (u - 0.5) * 4;
    
        const x = a * Math.cosh(u) * Math.cos(v);
        const y = b * Math.cosh(u) * Math.sin(v);
        const z = c * Math.sinh(u);
    
        target.set(x, y, z);
    });

    return geometries;
}

function addSeats(obj, x, y, z, R_ring){
    'use strict';

    const seatFunctions = createSeatGeometries();

    const angleIncrement = 45;

    for (let i = 0; i < seatFunctions.length; i++){
        const angle = i * angleIncrement * (Math.PI / 180);
        x = R_ring * Math.cos(angle);
        y = R_ring * Math.sin(angle);
        z = - 6;

        geometry = new ParametricGeometry(seatFunctions[i], 50, 50);
        mesh = new THREE.Mesh(geometry, seatMaterial);

        mesh.userData.rotationSpeed = 0.005;
        mesh.userData.rotateAxis = new THREE.Vector3(Math.random() * 1, 1, 0);
        mesh.userData.originalColor = seatMaterial.color.clone();

        mesh.position.set(x, y, z);
        mesh.rotation.x = - Math.PI/2;
        seatMeshes.push(mesh);
        
        createSpotLight(obj, mesh, x, y, 0);
        
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

    seatMeshes.forEach(mesh => {
        mesh.rotateOnAxis(mesh.userData.rotateAxis, mesh.userData.rotationSpeed);
    });

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

    // middle ring movement
    if (moveMiddleRing && !middleRingDown) {
        if (middleRing.position.y > h_cylinder) {
            inc = middleRing.userData.verticalSpeed * timeElapsed;
            middleRing.position.y -= inc
        } else {
            moveMiddleRing = false;
            middleRingDown = true;
        }
    } else if (moveMiddleRing && middleRingDown) {
        if (middleRing.position.y < h_cylinder + 2*h_ring) {
            inc = middleRing.userData.verticalSpeed * timeElapsed;
            middleRing.position.y += inc
        } else {
            moveMiddleRing = false;
            middleRingDown = false;
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
        perspectiveCamera.aspect = window.innerWidth / window.innerHeight;
        perspectiveCamera.updateProjectionMatrix();
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
            moveMiddleRing = !moveMiddleRing;
            break;
        case 51: // 3
            moveOuterRing = !moveOuterRing;
            break;
        // remover tecla 7 depois
        case 55: // 7
            mobiusStripMaterial.wireframe = !mobiusStripMaterial.wireframe;
            break;
        case 68: // D/d
            directionalLight.visible = !directionalLight.visible;
            break;
        // remover tecla A depois
        case 65: // A/a
            ambientLight.visible = !ambientLight.visible;
            break;
        case 80: // P/p
            pointLights.forEach(pointLight => {
                pointLight.visible = !pointLight.visible;
            })
            break;
        case 83: // S/s
            spotLights.forEach(spotLight => {
                spotLight.visible = !spotLight.visible;
            })

            break;
        case 81: // Q/q
            meshes.forEach(mesh => {
                newColor = mesh.userData.originalColor.clone()
                lambertMaterial = new THREE.MeshLambertMaterial({ color: newColor, side: THREE.DoubleSide });
                mesh.material = lambertMaterial;
            });
            seatMeshes.forEach(smesh => {
                newColor = smesh.userData.originalColor.clone();
                lambertMaterial = new THREE.MeshLambertMaterial({ color: newColor, side: THREE.DoubleSide });
                smesh.material = lambertMaterial;
            });
            reactingToLight = true;
            currentMaterial = lambertMaterial;
            break;
        case 87: // W/w
            meshes.forEach(mesh => {
                newColor = mesh.userData.originalColor.clone()
                phongMaterial = new THREE.MeshPhongMaterial({ color: newColor, side: THREE.DoubleSide});
                mesh.material = phongMaterial;
            });
            seatMeshes.forEach(smesh => {
                newColor = smesh.userData.originalColor.clone();
                phongMaterial = new THREE.MeshPhongMaterial({ color: newColor, side: THREE.DoubleSide });
                smesh.material = phongMaterial;
            });
            reactingToLight = true;
            currentMaterial = phongMaterial;
            break;
        case 69: // E/e
            meshes.forEach(mesh => {
                newColor = mesh.userData.originalColor.clone()
                toonMaterial = new THREE.MeshToonMaterial({ color: newColor, side: THREE.DoubleSide});
                mesh.material = toonMaterial;
            });
            seatMeshes.forEach(smesh => {
                newColor = smesh.userData.originalColor.clone();
                toonMaterial = new THREE.MeshToonMaterial({ color: newColor, side: THREE.DoubleSide});
                smesh.material = toonMaterial;
            });
            reactingToLight = true;
            currentMaterial = toonMaterial;
            break;
        case 82: // R/r
            meshes.forEach(mesh => {
                normalMaterial = new THREE.MeshNormalMaterial();
                mesh.material = normalMaterial;
            });
            seatMeshes.forEach(smesh => {
                normalMaterial = new THREE.MeshNormalMaterial();
                smesh.material = normalMaterial;
            });
            reactingToLight = true;
            currentMaterial = normalMaterial;
            break;
        case 84: // T/t
            if (reactingToLight) {
                meshes.forEach(mesh => {
                    newColor = mesh.userData.originalColor.clone()
                    basicMaterial = new THREE.MeshBasicMaterial({ color: newColor, side: THREE.DoubleSide});
                    mesh.material = basicMaterial;
                })
                seatMeshes.forEach(smesh => {
                    newColor = smesh.userData.originalColor.clone()
                    basicMaterial = new THREE.MeshBasicMaterial({ color: newColor, side: THREE.DoubleSide});
                    smesh.material = basicMaterial;
                })
                reactingToLight = false;
            } else {
                meshes.forEach(mesh => {
                    newColor = mesh.userData.originalColor.clone();
                    let newMaterial = currentMaterial.clone();
                    newMaterial.color = newColor;
                    mesh.material = newMaterial;
                })
                seatMeshes.forEach(smesh => {
                    newColor = smesh.userData.originalColor.clone()
                    let newMaterial = currentMaterial.clone();
                    newMaterial.color = newColor;
                    smesh.material = newMaterial;
                })
                reactingToLight = true;
            }
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