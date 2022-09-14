import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/DRACOLoader.js';
import Stats from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/libs/stats.module';
import { MeshSurfaceSampler } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/math/MeshSurfaceSampler.js';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';

/**
 * Debug
 */
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

// Models

var island;
gltfLoader.load(
    '/models/island.glb', 
    function(gltf){
        island = gltf.scene;
        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) { 
                node.castShadow = true;
                node.receiveShadow = true;
            }
        } );
        scene.add(island)
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
    '/models/flower.glb', 
    function(gltf){

    var blossom = gltf.scene.getObjectByName( 'Blossom');
    var stem = gltf.scene.getObjectByName( 'Stem');

    let blossomMaterial = new THREE.MeshLambertMaterial({
        emissive: new THREE.Color(0xBDD1FF).convertSRGBToLinear(),
        emissiveIntensity: 0.5,
    });
    const color = new THREE.Color();
    const blossomPalette = [ 0xBDD1FF, 0xD5E1FF, 0xEEF2FF  ];

        for ( let i = 0; i < 500; i ++ ) {

                sampler.sample(tempPosition);
                tempObject.position.set(tempPosition.x, tempPosition.y-0.03, tempPosition.z);
                tempObject.scale.setScalar(Math.random() * 0.03 + 0.02);
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

        for ( let i = 0; i < 80; i ++ ) {
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
const shirtPalette = [ 0xFA6D6D, 0xffffff ];
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
    

var clapper;
var mixer;
var action;
gltfLoader.load(
    '/models/clapper.glb', function(gltf){
        clapper = gltf.scene;
        clapper.scale.set(1.4, 1.4, 1.4);
        clapper.position.set(9.5, 0, -1);
        clapper.rotation.y = Math.PI/8;

        //Playing Animation
        mixer = new THREE.AnimationMixer( clapper );
        action = mixer.clipAction( gltf.animations[ 0 ] );
        action.play();
        
        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) { 
                node.castShadow = true;
                node.receiveShadow = true;
            }
        } );
        scene.add(clapper);
});

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
var mixer5;
var action5;
gltfLoader.load(
    '/models/robo.glb', function(gltf){
        robot = gltf.scene;
        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) { 
                node.castShadow = true;
                node.receiveShadow = true;
            }
        } );

        mixer5 = new THREE.AnimationMixer( robot );
        action5 = mixer5.clipAction( gltf.animations[ 14 ] );
        action5.play();

        robot.scale.set(.5,.5,.5);
        robot.position.set(0,0,-9.5);
        robot.rotation.y = -Math.PI;

        scene.add(robot);
});



// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(0,24,16);
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
renderer.setClearColor( 0xffffff, 0);
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


document.getElementById("start-button").onclick = function() {
    document.getElementById("loadingscreen").classList.add("hidden");

    new TWEEN.Tween(camera.position)
    .to( { x: 0, y:3, z:16 }, 1200)
    .easing(TWEEN.Easing.Cubic.Out)
    .start()
  ;
}

// Lights
const hemiLight = new THREE.HemisphereLight( 0xfff, 0xfff, 0.6 );
hemiLight.color.setHSL( 0.6, 1 , 0.6 );
hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
hemiLight.position.set( 0, 500, 0 );
scene.add( hemiLight );

// const helper2 = new THREE.CameraHelper( spotLight.shadow.camera );
// scene.add( helper2 );

let shadowMapSize = 13;
const sunLight = new THREE.DirectionalLight(0xffffff, 1, 100);
sunLight.position.set(0,12,12);
sunLight.color.setHSL( 0.1, 1, 0.95 );
sunLight.visible = true;
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 0.5; 
sunLight.shadow.camera.far = shadowMapSize*2;
sunLight.shadow.camera.top = shadowMapSize;
sunLight.shadow.camera.bottom = -shadowMapSize;
sunLight.shadow.camera.left = -shadowMapSize;
sunLight.shadow.camera.right = shadowMapSize;
sunLight.shadow.normalBias = 0.02;
scene.add(sunLight);
scene.add( sunLight.target );

// const helper = new THREE.CameraHelper( sunLight.shadow.camera );
// scene.add( helper );

const spotLight = new THREE.SpotLight(0xffffff, 4, 6, Math.PI/4, 1, 1);
spotLight.position.set( 0, 3.5, 0 );
spotLight.visible = false;
spotLight.castShadow = false;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 0.5; 
spotLight.shadow.camera.far = 2;
spotLight.shadow.normalBias = 0.02;
scene.add( spotLight );
scene.add( spotLight.target );

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
      if ( action2 )  action2.timeScale = delta*160;

      lastPos = newPos;
      return delta;
    
    };
})();


//Interaction with Objects

// window.addEventListener('click', onDocumentMouseDown, false);

// var raycaster = new THREE.Raycaster();
// var mouse = new THREE.Vector2();
// function onDocumentMouseDown( event ) {
// event.preventDefault();
// mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
// mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
// raycaster.setFromCamera( mouse, camera );
// var intersects = raycaster.intersectObjects( scene.children );
// if ( intersects.length > 0 ) {
//     console.log (intersects[1].object.name);
// }}
    

//Darkmode

const checkbox = document.getElementById('myCheckbox');
const spans = document.getElementById("menuToggle").getElementsByTagName('span');



checkbox.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    spotLight.visible = false;
    spotLight.castShadow = false;
    sunLight.visible = true;
    sunLight.castShadow = true;
    canvas.style.background = 'linear-gradient(0deg, hsl(200, 50%,100%) 50%, hsl(214,80%,70%) 100%)';
    hemiLight.intensity = 0.6;

    document.body.style.color = "black";

    for (const span of spans) {
        span.style.background = "black";
    }

  } else {
    spotLight.visible = true;
    spotLight.castShadow = true;
    sunLight.visible = false;
    sunLight.castShadow = false;
    canvas.style.background = 'linear-gradient(0deg, hsl(220, 50%,20%) 50%, hsl(220,80%,5%) 100%)';
    hemiLight.intensity = 0.01;

    document.body.style.color = "white";

    for (const span of spans) {
        span.style.background = "white";
    }

  }
})

/**
 * Animate
 */
let azimuthalAngle;
let i = 0;
let g = 0.8;

const sign1 = document.getElementById("sign1");
const sign2 = document.getElementById("sign2");
const sign3 = document.getElementById("sign3");
const sign4 = document.getElementById("sign4");
const project1 = document.getElementById("project1");
const project2 = document.getElementById("project2");
const project3 = document.getElementById("project3");
const project4 = document.getElementById("project4");

// let counttx = 0, countup = true;
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

    // Update cyclist position
    azimuthalAngle = controls.getAzimuthalAngle();

    spotLight.position.x = Math.sin(azimuthalAngle) * 12.4;
    spotLight.position.z = Math.cos(azimuthalAngle) * 12.4;
    spotLight.target.position.x = Math.sin(azimuthalAngle) * 9;
    spotLight.target.position.z = Math.cos(azimuthalAngle) * 9;

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


    // Animation Mixer
    const delta = clock.getDelta();
    if ( mixer ) mixer.update( delta );
    if ( mixer2 ) mixer2.update( delta );
    if ( mixer3 ) mixer3.update( delta );
    if ( mixer4 ) mixer4.update( delta );
    if ( mixer5 ) mixer5.update( delta );

    TWEEN.update();
    scrollSpeed();

    // Render
    stats.begin()
    renderer.render(scene, camera)
    stats.end()

 
     // Call tick again on the next frame
     window.requestAnimationFrame(tick)
 }
 
 tick()