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
let perspectiveCamera;
let scene, renderer, clock;

// Meshes
const meshes = [];
let mobiusStripMesh;

// Materials
let carouselMaterial, skydomeMaterial, innerRingMaterial, middleRingMaterial, outerRingMaterial, seatMaterial, mobiusStripMaterial;
let lambertMaterial, phongMaterial, toonMaterial, normalMaterial, basicMaterial, currentMaterial;

// Object3Ds
let carousel, innerRing, middleRing, outerRing;

// Lights
const pointLights = [];
const spotLights = [];
let directionalLight, ambientLight;
let reactingToLight = false;

// Colors
let newColor;

// Measurements
// h: height, r: radius
const r_cylinder = 6;
const h_cylinder = 20;

const r_skydome = 95;
const h_strip = 21;

const h_ring = 5;

const innerR_ring1 = 6;
const outerR_ring1 = 20;

const innerR_ring2 = outerR_ring1;
const outerR_ring2 = 34;

const innerR_ring3 = outerR_ring2;
const outerR_ring3 = 48;

// Rings movement
let moveInnerRing = true;
let innerRingDown = false;
let moveMiddleRing = true;
let middleRingDown = false;
let moveOuterRing = true;
let outerRingDown = false;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xb8cef2);
    let floor = new THREE.Mesh(new THREE.CylinderGeometry(r_skydome, r_skydome, 0.5), new THREE.MeshBasicMaterial({color: 0x102bb4, side: THREE.DoubleSide}));
    scene.add(floor);
    scene.position.set(0, -h_cylinder - 3*h_ring, 0)

    createDirectionalLight();
    createAmbientLight();

    createMaterials();

    addSkydome(0, 0, 0);
    createCarousel(0, 0, 0);
}

function createMaterials() {
    currentMaterial = new THREE.MeshBasicMaterial();
    carouselMaterial = new THREE.MeshBasicMaterial({ color: 0xEABE6C});
    innerRingMaterial = new THREE.MeshBasicMaterial({ color: 0xf9cb9c});
    middleRingMaterial = new THREE.MeshBasicMaterial({ color: 0xf6b26b});
    outerRingMaterial = new THREE.MeshBasicMaterial({ color: 0xe69138});
    skydomeMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/an_optical_poem.jpg'),
                            side: THREE.DoubleSide, transparent: true, opacity: 0.7});
    seatMaterial = new THREE.MeshBasicMaterial({ color: 0x741b47, side: THREE.DoubleSide});
    mobiusStripMaterial = new THREE.MeshBasicMaterial({ color: 0xBE4D25, side: THREE.DoubleSide});
    lambertMaterial = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide });
    phongMaterial = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, specular: new THREE.Color(0xffffff), shininess: 30});
    toonMaterial = new THREE.MeshToonMaterial({ side: THREE.DoubleSide});
    basicMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide});
    normalMaterial = new THREE.MeshNormalMaterial();
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createPerspectiveCamera() {
    'use strict';
    // PerspectiveCamera(fov, aspect, near, far)
    perspectiveCamera = new THREE.PerspectiveCamera(70,
        window.innerWidth / window.innerHeight, 1, 1000);
    perspectiveCamera.position.set(50, 65 - h_cylinder - 3*h_ring, 40);
    perspectiveCamera.lookAt(scene.position);
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
    ambientLight = new THREE.AmbientLight(0xd7930a, 3);
    scene.add(ambientLight);
}

function createPointLight(x, y, z) {
    let light = new THREE.PointLight(0xFFFFFF, 10, 100);
    light.position.set(x, y, z);
    scene.add(light);
    pointLights.push(light);
}

function createSpotLight(obj, mesh, x, y, z) {
    let spotLight = new THREE.SpotLight(0xFFFFFF, 200);
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
    let geometry = new THREE.SphereGeometry(r_skydome, 64, 32, 0, 2 * Math.PI, 0, Math.PI / 2);
    let skydomeMesh = new THREE.Mesh(geometry, skydomeMaterial);
    skydomeMesh.position.set(x, y, z);
    scene.add(skydomeMesh);
}

function createCarousel(x, y, z) {
    'use strict';

    carousel = new THREE.Object3D();
    carousel.userData = { rotationSpeed: Math.PI/12 };

    addCentralCylinder(carousel, 0, h_cylinder/2, 0, r_cylinder, h_cylinder);
    addMobiusStrip(carousel, 0, h_cylinder + h_strip, 0);
    
    createPointLight(0.0, h_cylinder + h_strip, 2.6);
    createPointLight(-4.0, h_cylinder + h_strip, 2.4);
    createPointLight(-5.4, h_cylinder + h_strip, 0.0);
    createPointLight(-4.0, h_cylinder + h_strip, -4.6);
    createPointLight(0.0, h_cylinder + h_strip, -4.4);
    createPointLight(3.8, h_cylinder + h_strip, -2.4);
    createPointLight(4.0, h_cylinder + h_strip, 0.0);
    createPointLight(3.6, h_cylinder + h_strip, 1.2);
    
    scene.add(carousel);
    carousel.position.set(x, y, z);

    //createInnerRing(carousel, 0, h_cylinder + h_ring, 0);
    //createMiddleRing(carousel, 0, h_cylinder + 2*h_ring, 0);
    //createOuterRing(carousel, 0, h_cylinder + 3*h_ring, 0);

    innerRing = createCarouselRing(carousel, 0, h_cylinder + h_ring, 0, outerR_ring1, innerR_ring1, 4, innerRingMaterial);
    middleRing = createCarouselRing(carousel, 0, h_cylinder + 2*h_ring, 0, outerR_ring2, innerR_ring2, 3, middleRingMaterial);
    outerRing = createCarouselRing(carousel, 0, h_cylinder + 3*h_ring, 0, outerR_ring3, innerR_ring3, 2, outerRingMaterial);
}

function addCentralCylinder(obj, x, y, z, r, h) {
    'use strict';
    // CylinderGeometry(radiusTop, radiusBottom, height, radialSegments)
    let geometry = new THREE.CylinderGeometry(r, r, h, 64);
    let cylinderMesh = new THREE.Mesh(geometry, carouselMaterial);
    cylinderMesh.userData.originalColor = carouselMaterial.color.clone();
    meshes.push(cylinderMesh);
    cylinderMesh.position.set(x, y, z);
    obj.add(cylinderMesh);
}

function addMobiusStrip(obj, x, y, z) {
    'use strict';
    let geometry = new THREE.BufferGeometry();
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
        1, 0, 2,
        2, 0, 3,
        2, 3, 4,
        4, 3, 5,
        4, 5, 6,
        6, 5, 7,
        6, 7, 8,
        8, 7, 9,
        8, 9, 10,
        10, 9, 11,
        10, 11, 12,
        12, 11, 13,
        12, 13, 14,
        14, 13, 15,
        14, 15, 16,
        16, 15, 17,
        16, 17, 18,
        18, 17, 19,
        18, 19, 20,
        20, 19, 21,
        20, 21, 22,
        22, 21, 23,
        22, 23, 24,
        24, 23, 25,
        24, 25, 26,
        26, 25, 27,
        26, 27, 28,
        28, 27, 29,
        28, 29, 30,
        30, 29, 31,
        30, 31, 32,
        32, 31, 1,
        32, 1, 0,
    ];
    geometry.setIndex(indices);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();

    mobiusStripMesh = new THREE.Mesh(geometry, mobiusStripMaterial);
    mobiusStripMesh.userData.originalColor = mobiusStripMaterial.color.clone();
    mobiusStripMesh.position.set(x, y, z);
    obj.add(mobiusStripMesh);
}

// podemos fazer um só metódo a partir destas 3?
function createInnerRing(obj, x, y, z) {
    'use strict';

    innerRing = new THREE.Object3D();
    innerRing.userData = { verticalSpeed: 4 }
    addRing(innerRing, 0, 0, 0, outerR_ring1, innerR_ring1, h_ring, innerRingMaterial);
    innerRing.rotation.x = Math.PI / 2;
    innerRing.position.set(x, y, z);

    addSeats(innerRing, 0, 0, 0, (outerR_ring1-innerR_ring1) - r_cylinder/2);

    obj.add(innerRing);
}

function createMiddleRing(obj, x, y, z) {
    'use strict';

    middleRing = new THREE.Object3D();
    middleRing.userData = { verticalSpeed: 3 }
    addRing(middleRing, 0, 0, 0, outerR_ring2, innerR_ring2, h_ring, middleRingMaterial);
    middleRing.rotation.x  = Math.PI / 2;
    middleRing.position.set(x, y, z);

    addSeats(middleRing, 0, 0, 0, (outerR_ring2-innerR_ring1) - r_cylinder/2);

    obj.add(middleRing);

}

function createCarouselRing(obj, x, y, z, outerRadius, innerRadius, speed, material) {
    'use strict';

    let ring = new THREE.Object3D();
    ring.userData = { verticalSpeed: speed };
    addRing(ring, 0, 0, 0, outerRadius, innerRadius, h_ring, material);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(x, y, z);

    addSeats(ring, 0, 0, 0, (outerRadius - innerR_ring1) - r_cylinder / 2);

    obj.add(ring);

    return ring;
}

function createOuterRing(obj, x, y, z) {
    'use strict';

    outerRing = new THREE.Object3D();
    outerRing.userData = { verticalSpeed: 2 }
    addRing(outerRing, 0, 0, 0, outerR_ring3, innerR_ring3, h_ring, outerRingMaterial)
    outerRing.rotation.x  = Math.PI / 2;
    outerRing.position.set(x, y, z);

    addSeats(outerRing, 0, 0, 0, (outerR_ring3-innerR_ring1) - r_cylinder/2);

    obj.add(outerRing);
}

function addRing(obj, x, y, z, outerRadius, innerRadius, h, mat) {
    'use strict';
    let shape = new THREE.Shape();
    shape.moveTo(outerRadius, 0);
    shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);
    
    let holePath = new THREE.Path();
    holePath.moveTo(innerRadius, 0);
    holePath.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);

    shape.holes.push(holePath);
    
    const extrudeSettings = {
        bevelEnabled: false,
        depth: h
    };

    let ringGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    let mesh = new THREE.Mesh(ringGeometry, mat);
    mesh.userData.originalColor = mat.color.clone();
    meshes.push(mesh);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function createSeatGeometries(){

    const geometries = [];

    const scaleFactor = Math.random() * 0.2 + 0.9;

    // Esfera
    geometries.push(function sphere( u, v, target ) {

        const r = 3.5 * scaleFactor;
        u *= Math.PI;
        v *= 2 * Math.PI;

        const x = r * Math.sin( u ) * Math.cos( v );
        const y = r * Math.sin( u ) * Math.sin( v );
        const z =  r * Math.cos( u );

        target.set( x, y, z);
    });

    // Cilindro
    geometries.push(function cylinder(u, v, target) {
        const r = 2 * scaleFactor;
        const h = 6 * scaleFactor;
    
        const x = r * Math.cos(v * 2 * Math.PI);
        const y = h * (u - 0.5);
        const z = r * Math.sin(v * 2 * Math.PI);
    
        target.set(x, y, z);
    });

    // Cone
    geometries.push(function cone(u, v, target) {
        const r = 2 * scaleFactor;
        const h = 4 * scaleFactor;
    
        const x = (1 - u) * r * Math.cos(v * 2 * Math.PI);
        const y = h * (u - 0.5);
        const z = (1 - u) * r * Math.sin(v * 2 * Math.PI);
    
        target.set(x, y, z);
    });

    // Tronco de Cone
    geometries.push(function truncatedCone(u, v, target) {
        const rT = 1 * scaleFactor;
        const rB= 2 * scaleFactor;
        const h = 4 * scaleFactor;
    
        const r = (1 - u) * rB + u * rT;
        const x = r * Math.cos(v * 2 * Math.PI);
        const y = h * (u - 0.5);
        const z = r * Math.sin(v * 2 * Math.PI);
    
        target.set(x, y, z);
    });

    // Toroide
    geometries.push(function torus(u, v, target) {
        const R = 3 * scaleFactor;
        const r = 0.75 * scaleFactor;

        u *= 2 * Math.PI;
        v *= 2 * Math.PI;

        const x = (R + r * Math.cos(v)) * Math.cos(u);
        const y = (R + r * Math.cos(v)) * Math.sin(u);
        const z = r * Math.sin(v);

        target.set(x, y, z);
    });

    // Hiperboloide de uma Folha
    geometries.push(function hyperboloidOneSheet(u, v, target) {
        const a = 0.375 * scaleFactor;
        const b = 0.375 * scaleFactor;
        const c = 0.75 * scaleFactor;
    
        v *= 2 * Math.PI;
        u = (u - 0.5) * 4;
    
        const x = a * Math.cosh(u) * Math.cos(v);
        const y = b * Math.cosh(u) * Math.sin(v);
        const z = c * Math.sinh(u);
    
        target.set(x, y, z);
    });

    // Cone Inclinado
    geometries.push(function inclinedCone(u, v, target) {
        const r = 2 * scaleFactor;
        const h = 6 * scaleFactor;
    
        const x = (1 - u) * r * Math.cos(v * 2 * Math.PI);
        const y = h * (u - 0.5);
        const z = (1 - u) * r * Math.sin(v * 2 * Math.PI) + 2 * u;
    
        target.set(x, y, z);
    });

    // Parábola
    geometries.push(function paraboloid(u, v, target) {
        const a = 1.5 * scaleFactor;
        const b = 1.5 * scaleFactor;
        const c = 1.5 * scaleFactor; 

        u = (u - 0.5) * 2;
        v = (v - 0.5) * 2;

        const x = a * u;
        const y = b * v;
        const z = c * (u * u + v * v);

        target.set(x, y, z);
    });

    return geometries;
}

function shuffleIndices(){
    const indices = [0 , 1, 2, 3, 4, 5, 6, 7];
    for (let i = 0; i < indices.length - 1; i++){
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices
}

function addSeats(obj, x, y, z, R_ring){
    'use strict';

    const seatFunctions = createSeatGeometries();

    const angleIncrement = 45;

    const randomIndices = shuffleIndices();

    for (let i = 0; i < seatFunctions.length; i++){
        const angle = i * angleIncrement * (Math.PI / 180);
        x = R_ring * Math.cos(angle);
        y = R_ring * Math.sin(angle);
        z = -6;

        let geometry = new ParametricGeometry(seatFunctions[randomIndices[i]], 50, 50);
        let mesh = new THREE.Mesh(geometry, seatMaterial);

        mesh.userData.rotationSpeed = 0.005;
        mesh.userData.rotateAxis = new THREE.Vector3(Math.random() * 0.1 + 1, 1, 0).normalize();
        mesh.userData.originalColor = seatMaterial.color.clone();
        mesh.name = "seat";

        mesh.position.set(x, y, z);
        mesh.rotation.x = - Math.PI/2;
        meshes.push(mesh);
        
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

    meshes.forEach(mesh => {
        if (mesh.name === "seat"){
            mesh.rotateOnAxis(mesh.userData.rotateAxis, mesh.userData.rotationSpeed);
        }
    });

    // inner ring movement
    if (moveInnerRing && !innerRingDown) {
        if (innerRing.position.y > h_cylinder/2) {
            inc = innerRing.userData.verticalSpeed * timeElapsed;
            innerRing.position.y -= inc
        } else {
            innerRingDown = true;
        }
    } else if (moveInnerRing && innerRingDown) {
        if (innerRing.position.y < h_cylinder + h_ring) {
            inc = innerRing.userData.verticalSpeed * timeElapsed;
            innerRing.position.y += inc
        } else {
            innerRingDown = false;
        }
    }

    // middle ring movement
    if (moveMiddleRing && !middleRingDown) {
        if (middleRing.position.y > h_cylinder/2) {
            inc = middleRing.userData.verticalSpeed * timeElapsed;
            middleRing.position.y -= inc
        } else {
            middleRingDown = true;
        }
    } else if (moveMiddleRing && middleRingDown) {
        if (middleRing.position.y < h_cylinder + 2*h_ring) {
            inc = middleRing.userData.verticalSpeed * timeElapsed;
            middleRing.position.y += inc
        } else {
            middleRingDown = false;
        }
    }

    // outer ring movement
    if (moveOuterRing && !outerRingDown) {
        if (outerRing.position.y > h_cylinder/2) {
            inc = outerRing.userData.verticalSpeed * timeElapsed;
            outerRing.position.y -= inc
        } else {
            outerRingDown = true;
        }
    } else if (moveOuterRing && outerRingDown) {
        if (outerRing.position.y < h_cylinder + 3*h_ring) {
            inc = outerRing.userData.verticalSpeed * timeElapsed;
            outerRing.position.y += inc
        } else {
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
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    clock = new THREE.Clock();

    renderer.xr.enabled = true;
    document.body.appendChild(VRButton.createButton(renderer));
    
    createScene();
    createPerspectiveCamera();

    const controls = new OrbitControls(perspectiveCamera, renderer.domElement);

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

    update();
    render();

    renderer.setAnimationLoop(animate);
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
                mesh.material = lambertMaterial.clone();
                mesh.material.color.copy(newColor);
            });
            newColor = mobiusStripMesh.userData.originalColor.clone();
            mobiusStripMesh.material = lambertMaterial.clone();
            mobiusStripMesh.material.color.copy(newColor);

            reactingToLight = true;
            currentMaterial = lambertMaterial;
            break;
        case 87: // W/w
            meshes.forEach(mesh => {
                newColor = mesh.userData.originalColor.clone();
                mesh.material = phongMaterial.clone();
                mesh.material.color.copy(newColor);

            });
            newColor = mobiusStripMesh.userData.originalColor.clone()
            mobiusStripMesh.material = phongMaterial.clone();
            mobiusStripMesh.material.color.copy(newColor);

            reactingToLight = true;
            currentMaterial = phongMaterial;
            break;
        case 69: // E/e
            meshes.forEach(mesh => {
                newColor = mesh.userData.originalColor.clone()
                mesh.material = toonMaterial.clone();
                mesh.material.color.copy(newColor);
            });
            newColor = mobiusStripMesh.userData.originalColor.clone();
            mobiusStripMesh.material = toonMaterial;
            mobiusStripMesh.material.color.copy(newColor);

            reactingToLight = true;
            currentMaterial = toonMaterial;
            break;
        case 82: // R/r
            meshes.forEach(mesh => {
                mesh.material = normalMaterial.clone();
            });
            mobiusStripMesh.material = normalMaterial.clone();

            reactingToLight = true;
            currentMaterial = normalMaterial;
            break;
        case 84: // T/t
            if (reactingToLight) {
                meshes.forEach(mesh => {
                    newColor = mesh.userData.originalColor.clone()
                    mesh.material = basicMaterial.clone();
                    mesh.material.color.copy(newColor);
                })
                newColor = mobiusStripMesh.userData.originalColor.clone()
                mobiusStripMesh.material = basicMaterial.clone();
                mobiusStripMesh.material.color.copy(newColor);

                reactingToLight = false;
            } else {
                meshes.forEach(mesh => {
                    newColor = mesh.userData.originalColor.clone();
                    let newMaterial = currentMaterial.clone();
                    newMaterial.color = newColor;
                    newMaterial.side = THREE.DoubleSide;
                    mesh.material = newMaterial;
                })
                newColor = mobiusStripMesh.userData.originalColor.clone()
                let newMaterial = currentMaterial.clone();
                newMaterial.color = newColor;
                newMaterial.side = THREE.DoubleSide;
                mobiusStripMesh.material = newMaterial;

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
}

init();
animate();