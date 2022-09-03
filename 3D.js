import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/DRACOLoader.js';
import Stats from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/libs/stats.module';
import { Water } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/objects/Water.js';
import { MeshSurfaceSampler } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/math/MeshSurfaceSampler.js';

/**
 * Debug
 */
//const gui = new dat.GUI()

const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
const loadingManager = new THREE.LoadingManager();

const progressContainer = document.getElementById("progress");
const progressBar = document.getElementById("progress-bar");

loadingManager.onProgress = function(url, loaded, total) {
    progressBar.style.width = (loaded / total) * 100 + "%";
}
loadingManager.onLoad = function(url, loaded, total){
    progressContainer.style.display = "none";
    document.getElementById("start-button").style.display = "block";
    
}

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://unpkg.com/three@0.136.0/examples/js/libs/draco/');

// GLTF loader
const gltfLoader = new GLTFLoader(loadingManager)
gltfLoader.setDRACOLoader(dracoLoader)

//Water
const waterGeometry = new THREE.PlaneBufferGeometry(1000, 1000)
const waveGeometry = new THREE.PlaneBufferGeometry(42, 42, 50, 50);
const waterMaterial = new THREE.MeshLambertMaterial ( {color: 0x757BFD})
waterMaterial.color.convertSRGBToLinear();
const waves = new THREE.Mesh(waveGeometry, waterMaterial);
const water = new THREE.Mesh(waterGeometry, waterMaterial);

waves.receiveShadow = true;
waves.castShadow = true;
waves.rotation.x = -Math.PI / 2;
waves.position.y = -1;
waves.scale.z = 0.02;
scene.add(waves);

water.receiveShadow = true;
water.rotation.x = -Math.PI / 2;
water.position.y = -1;
scene.add(water);

const count = waveGeometry.attributes.position.count;

// Models

// gltfLoader.load(
//     '/models/island.glb', 
//     function(gltf){
//         var city = gltf.scene;
//         gltf.scene.traverse( function( node ) {
//             if ( node.isMesh ) { 
//                 node.castShadow = true;
//                 node.receiveShadow = true;
//             }
//         } );
//         scene.add(city)
// });

gltfLoader.load(
    '/models/treeline.glb', 
    function(gltf){
        var surface = gltf.scene.children[0];
        var sampler = new MeshSurfaceSampler(surface).build();
        /* Sample the coordinates */
        const tempPosition = new THREE.Vector3();
        const tempObject = new THREE.Object3D();

gltfLoader.load(
    '/models/flower.glb', 
    function(gltf){

    var blossom = gltf.scene.getObjectByName( 'Blossom');
    var stem = gltf.scene.getObjectByName( 'Stem');

    let blossomMaterial = new THREE.MeshLambertMaterial();
    const color = new THREE.Color();
    const blossomPalette = [ 0xFFCCD2, 0xFFDBDF, 0xFFFFFF  ];

        for ( let i = 0; i < 500; i ++ ) {

                sampler.sample(tempPosition);
                tempObject.position.set(tempPosition.x, tempPosition.y-0.03, tempPosition.z);
                tempObject.scale.setScalar(Math.random() * 0.03 + 0.03);
                tempObject.updateMatrix();

                color.setHex( blossomPalette[ Math.floor( Math.random() * blossomPalette.length ) ] );
                
                var instancedBlossom = new THREE.InstancedMesh( blossom.geometry, blossomMaterial, 1 );
                var instancedStem = new THREE.InstancedMesh( stem.geometry, stem.material, 1 );

                instancedBlossom.setMatrixAt(0, tempObject.matrix);
                instancedBlossom.position.y = instancedBlossom.position.y - 0.03;
                instancedStem.setMatrixAt(0, tempObject.matrix);
                instancedBlossom.setColorAt(0, color.convertSRGBToLinear());

                instancedBlossom.castShadow = true;
                instancedStem.castShadow = true;
                instancedBlossom.receiveShadow = true;
                scene.add( instancedBlossom );
                scene.add( instancedStem );

    }
});
});


gltfLoader.load(
    '/models/treeline.glb', 
    function(gltf){
        var surface = gltf.scene.children[0];
        var sampler = new MeshSurfaceSampler(surface).build();
        /* Sample the coordinates */
        const tempPosition = new THREE.Vector3();
        const tempObject = new THREE.Object3D();

gltfLoader.load(
    '/models/tree.glb', 
    function(gltf){

    var tree = gltf.scene.getObjectByName( 'tree');
    let treeMaterial = new THREE.MeshLambertMaterial();
    const color = new THREE.Color();
    const treePalette = [ 0x320DAA, 0x411BC7, 0x5028E3 ];

        for ( let i = 0; i < 100; i ++ ) {
                sampler.sample(tempPosition);
                tempObject.position.set(tempPosition.x, tempPosition.y, tempPosition.z);
                tempObject.rotation.x = Math.PI/2;
                tempObject.rotation.z = Math.random() * Math.PI;
                tempObject.scale.setScalar(Math.random() * .05 + .04);
                tempObject.updateMatrix();

                color.setHex( treePalette[ Math.floor( Math.random() * treePalette.length ) ] );

                
                var instancedTree = new THREE.InstancedMesh( tree.geometry, treeMaterial, 1 );
                instancedTree.setMatrixAt(0, tempObject.matrix);
                instancedTree.setColorAt(0, color.convertSRGBToLinear());

                instancedTree.castShadow = true;
                instancedTree.receiveShadow = true;
                scene.add( instancedTree );

    }
});
});

var car;
gltfLoader.load(
    '/models/scooter.glb', function(gltf){
        car = gltf.scene;
        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) { 
                node.castShadow = true;
                node.receiveShadow = true;
            }
        } );
        scene.add(car);
        car.scale.set(.32,.32,.32);
});

var mixer3;
var action3;
gltfLoader.load(
    '/models/joshua.glb', function(gltf){
        var joshua = gltf.scene;

        //Playing Animation
        mixer3 = new THREE.AnimationMixer( joshua );
        action3 = mixer3.clipAction( gltf.animations[ 1 ] );
        action3.timeScale = 1;
        action3.play();
        

        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) { 
                node.castShadow = true;
                node.receiveShadow = true;
            }
        } );
        scene.add(joshua);
        joshua.scale.set(.48,.48,.48);
        joshua.position.set(-3.5,0,10);
        joshua.rotation.y = 0;
});

const shirtColor = new THREE.Color();
const shirtPalette = [ 0xFA6D6D, 0xffffff, 0x757BFD ];
const skinPalette = [ 0x8d5524, 0xc68642, 0xe0ac69, 0xf1c27d, 0xffdbac ];

for ( let i = 0; i < 8; i ++ ) {
    gltfLoader.load(
    '/models/man.glb', function(gltf){
        var man = gltf.scene;
        man.scale.set(.49,.49,.49);
        man.position.set(-8.5+ Math.random()*2-1, 0, 4.5 + Math.random()*2-1);
        man.rotation.y = Math.random()*36;
        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) { 
                node.castShadow = true;
                node.receiveShadow = true;
            }
        } );
        gltf.scene.getObjectByName( "shirt" ).traverse( function( node ) {
            if ( node.isMesh ) { 
                shirtColor.setHex( shirtPalette[ Math.floor( Math.random() * shirtPalette.length ) ] );
                node.material.color.set( shirtColor ).convertSRGBToLinear();
                
            }
        } );
        gltf.scene.getObjectByName( "body" ).traverse( function( node ) {
            if ( node.isMesh ) { 
                shirtColor.setHex( skinPalette[ Math.floor( Math.random() * skinPalette.length ) ] );
                node.material.color.set( shirtColor ).convertSRGBToLinear();
            }
        } );
        scene.add(man);
    });
    }


var moose;
var mixer;
var action;
// gltfLoader.load(
//     '/models/moose.glb', function(gltf){
//         moose = gltf.scene;
//         moose.scale.set(.8,.8,.8);
//         moose.position.set(6,0,-7.5);
//         moose.rotation.y = Math.PI/2;

//         //Playing Animation
//         mixer = new THREE.AnimationMixer( moose );
//         action = mixer.clipAction( gltf.animations[ 20 ] );
//         action.timeScale = 1;
//         action.play();
        
//         gltf.scene.traverse( function( node ) {
//             if ( node.isMesh ) { 
//                 node.castShadow = true;
//                 node.receiveShadow = true;
//             }
//         } );
//         scene.add(moose);
// });

var cyclist;
var mixer2;
var action2;
gltfLoader.load(
    '/models/cyclist.glb', function(gltf){
        cyclist = gltf.scene;
        cyclist.scale.set(.33,.33,.33);

        //Playing Animation
        mixer2 = new THREE.AnimationMixer( cyclist );
        action2 = mixer2.clipAction( gltf.animations[ 0 ] );
        action2.timeScale = 0;
        action2.play();
        
        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) { 
                node.castShadow = true;
                node.receiveShadow = true;
            }
        } );
        scene.add(cyclist);
});

var bird;
var mixer4;
var action4;
gltfLoader.load(
    '/models/seagull.glb', function(gltf){
        bird = gltf.scene;
        bird.scale.set(8,8,8);
        bird.position.y = 4;

        mixer4 = new THREE.AnimationMixer( bird );
        action4 = mixer4.clipAction( gltf.animations[ 0 ] );
        action4.timeScale = 6;
        action4.play();

        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) { 
                node.castShadow = true;
                node.receiveShadow = true;
            }
        } );
        scene.add(bird);
});


var robot;
gltfLoader.load(
    '/models/robot.glb', function(gltf){
        robot = gltf.scene;
        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) { 
                node.castShadow = true;
                node.receiveShadow = true;
            }
        } );
        scene.add(robot);
        robot.scale.set(.5,.5,.5);
        robot.position.set(0,.75,-9.5);
        robot.rotation.y = -Math.PI/2;
});

// const textureLoader = new THREE.TextureLoader();
// const smokeGeo = new THREE.PlaneGeometry(1, 1);
// const smokeParticles = [];
// // load a resource
// textureLoader.load(
//     // resource URL
//     "/img/smoke.png",

//     // onLoad callback
//     function (smokeTexture) {
//         // in this example we create the material when the texture is loaded
//         const smokeMaterial = new THREE.MeshBasicMaterial({
//             map: smokeTexture,
//             transparent: true
//         });

//         const particleCount = 8;
//         for (let p = 0; p < particleCount; p++) {
//             var particle = new THREE.Mesh(smokeGeo, smokeMaterial);
//             particle.position.set(
//                 -6.5 + p * .01 - particleCount*.005,
//                 1.1,
//                 -8 + p * .01 - particleCount*.005,
//             );
//             particle.rotation.z = Math.random() * 360;
//             scene.add(particle);
//             smokeParticles.push(particle);
//         }
//     },

// );




// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(0,3,16);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0,0,0);
controls.enablePan = false;
controls.minPolarAngle = Math.PI/2.4;
controls.maxPolarAngle = Math.PI/2.15;
controls.minDistance = 15;
controls.maxDistance = 24;
controls.enableDamping = true;
controls.rotateSpeed = 0.25;

// Renderer
THREE.Cache.enabled = true;

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
let pixelRatio = Math.min(window.devicePixelRatio, 2);
renderer.setPixelRatio(pixelRatio);
//renderer.setClearColor( 0xFFDBE7, 1 );
//scene.background = null;
renderer.setClearColor(0x000000, 0);
scene.background = null;

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;


window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

// Lights
const hemiLight = new THREE.HemisphereLight( 0xffd4e5, 0xffd4e5, 0.75 );
hemiLight.color.setHSL( 0.9, 1 , 1 );
hemiLight.groundColor.setHSL( 0.9, 1, 0.85 );
hemiLight.position.set( 0, 500, 0 );
scene.add( hemiLight );


const light = new THREE.DirectionalLight(0xffd4e5, 0.5, 100);
light.position.set(2,6.5,2);
light.castShadow = true;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 0.5; 
light.shadow.camera.far = 14;
light.shadow.camera.top = 15;
light.shadow.camera.bottom = -15;
light.shadow.camera.left = -15;
light.shadow.camera.right = 15;
light.shadow.normalBias = 0.02;
scene.add(light);
scene.add( light.target );

// const helper = new THREE.CameraHelper( light.shadow.camera );
// scene.add( helper );

// Cursor
const cursor = {
    x: 0,
    y: 0
}


window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = - (event.clientY / sizes.height - 0.5)
})


let scrollSpeed = (function(){

    let lastPos, newPos, delta
  
    function clear() {
      lastPos = null;
      delta = 0;
    }
  
    clear();
    
    return function(){
      newPos = controls.getAzimuthalAngle();
      if ( lastPos != null ){ // && newPos < maxScroll 
        delta = newPos -  lastPos;
      }
      if (delta == 1 || delta == -1 ) delta = 0;
      if (delta < -1) { 
          //if ( cyclist ) cyclist.rotation.z = -Math.PI/1;
          delta = -delta; 
        }
      //else if (delta > 1) cyclist.rotation.z = 0;
      if ( action2 )  action2.timeScale = delta*200;

      lastPos = newPos;
      return delta;
    
    };
})();


/**
 * Animate
 */

let i = 0;
let f = -0.1;
let g = 0.8;
let h = 0.5;
const sign1 = document.getElementById("sign1");
const sign2 = document.getElementById("sign2");
const sign3 = document.getElementById("sign3");
const sign4 = document.getElementById("sign4");
const project1 = document.getElementById("project1");
const project2 = document.getElementById("project2");
const project3 = document.getElementById("project3");
const project4 = document.getElementById("project4");
let counttx = 0, countup = true;
const clock = new THREE.Clock(); 


const tick = () =>
 {
    // Update controls
    controls.update()

    if ( car ) {
        car.position.x = -Math.sin(i * Math.PI) * 11.8;
        car.position.z = -Math.cos(i * Math.PI) * 11.8;
        car.rotation.y = i * Math.PI + Math.PI/2;
        i -= 0.001;
    }

    if ( bird ) {
        bird.position.x = Math.sin(g * Math.PI) * 8;
        bird.position.z = Math.cos(g * Math.PI) * 8;
        bird.rotation.y = g * Math.PI - Math.PI/2;
        g -= 0.001;
    }

    // Robot Animation
    if (countup) { counttx += .01; 
        if (counttx >= 0) countup = false;}
        else { counttx -= .01; if (counttx <= -2) countup = true; }
        if ( robot ) robot.rotation.y = counttx;

    // Update cyclist position
    const azimuthalAngle = controls.getAzimuthalAngle();

    if ( cyclist ) {
        cyclist.position.x = Math.sin(azimuthalAngle) * 11.4;
        cyclist.position.z = Math.cos(azimuthalAngle) * 11.4;
        cyclist.rotation.y = azimuthalAngle;
    }

    if (azimuthalAngle >= 0.1 || azimuthalAngle < -0.1) {
        document.getElementById("instructions").classList.add("hidden");
      }

    if (azimuthalAngle >= 0.2 && azimuthalAngle < 0.6) {
        sign1.classList.remove("hidden");
        sign1.classList.add("visible");
      }
      else {  
        sign1.classList.add("hidden");
        sign1.classList.remove("visible");
    }

    if (azimuthalAngle >= 0.8 && azimuthalAngle < 1.2) {
        project1.classList.remove("hidden");
        project1.classList.add("visible");
      }
      else {  
        project1.classList.add("hidden");
        project1.classList.remove("visible");
    }

    if (azimuthalAngle >= 1.6 && azimuthalAngle < 1.9) {
        sign2.classList.remove("hidden");
        sign2.classList.add("visible");
      }
      else {  
        sign2.classList.add("hidden");
        sign2.classList.remove("visible");
    }

    if (azimuthalAngle >= 2.2 && azimuthalAngle < 2.6) {
        sign3.classList.remove("hidden");
        sign3.classList.add("visible");
      }
      else {  
        sign3.classList.add("hidden");
        sign3.classList.remove("visible");
    }

    if (azimuthalAngle >= 3 && azimuthalAngle < 3.2) {
        project2.classList.remove("hidden");
        project2.classList.add("visible");
      }
      else {  
        project2.classList.add("hidden");
        project2.classList.remove("visible");
    }

    if (azimuthalAngle >= -2.6 && azimuthalAngle < -2.3) {
        sign4.classList.remove("hidden");
        sign4.classList.add("visible");
      }
      else {  
        sign4.classList.add("hidden");
        sign4.classList.remove("visible");
    }

    if (azimuthalAngle >= -2 && azimuthalAngle < -1.6) {
        project3.classList.remove("hidden");
        project3.classList.add("visible");
      }
      else {  
        project3.classList.add("hidden");
        project3.classList.remove("visible");
    }

    if (azimuthalAngle >= -1.4 && azimuthalAngle < -1) {
        project4.classList.remove("hidden");
        project4.classList.add("visible");
      }
      else {  
        project4.classList.add("hidden");
        project4.classList.remove("visible");
    }

    if (azimuthalAngle >= -0.5 && azimuthalAngle < -0.2) {
        contact.classList.remove("hidden");
        contact.classList.add("visible");
      }
      else {  
        contact.classList.add("hidden");
        contact.classList.remove("visible");
    }

    //Water
    // const now = Date.now() / 300
    // for (let i = 0; i < count; i++){
    //     const x = waveGeometry.attributes.position.getX(i);
    //     const y = waveGeometry.attributes.position.getY(i);
    //     const xsin = Math.sin(x + now)
    //     const ycos = Math.cos(y + now)
    //     waveGeometry.attributes.position.setZ(i, xsin + ycos)
    // }
    // waveGeometry.computeVertexNormals()
    // waveGeometry.attributes.position.needsUpdate = true;


    // Animation Mixer
    const delta = clock.getDelta();
    if ( mixer ) mixer.update( delta );
    if ( mixer2 ) mixer2.update( delta );
    if ( mixer3 ) mixer3.update( delta );
    if ( mixer4 ) mixer4.update( delta );

    //Smoke
    // var sp = smokeParticles.length;
    // while (sp--) {
    //     smokeParticles[sp].rotation.z += delta * .5;
    //     smokeParticles[sp].rotation.y = azimuthalAngle;
    // }

      

    scrollSpeed();

    // Render
    stats.begin()
    renderer.render(scene, camera)
    stats.end()
 
     // Call tick again on the next frame
     window.requestAnimationFrame(tick)
 }
 
 tick()