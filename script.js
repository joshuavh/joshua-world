//import './loader.css'
//import './style.css'
import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/DRACOLoader.js';
//import * as dat from 'dat.gui'
//import Stats from 'stats.js'


//Sanity
let PROJECT_ID = "jidqpryp";
let DATASET = "production";
let QUERY = encodeURIComponent('*[_type == "project"]');

let URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`;

// fetch the content
fetch(URL)
  .then((res) => res.json())
  .then(({ result }) => {
    let projecttitles = document.getElementsByClassName("projecttitle");
    let subtitles = document.getElementsByClassName("subtitle");
    let firstTextfield = document.getElementsByClassName("firstTextfield");
    let secondTextfield = document.getElementsByClassName("secondTextfield");
    let meta = document.getElementsByClassName("metainfo");

    console.log(result);

    for (let i = 0; i < projecttitles.length; i++) {
        projecttitles[i].textContent = result[i].title;
        subtitles[i].textContent = result[i].subtitle;
        firstTextfield[i].textContent = result[i].firsttextfield;
        secondTextfield[i].textContent = result[i].secondtextfield;
        meta[i].textContent = result[i].metainfo;
    }
  })
  .catch((err) => console.error(err));
  
/**
 * Debug
 */
//const gui = new dat.GUI()
/*
const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
*/
//npdocument.body.appendChild(stats.dom)

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
loadingManager.onLoad = function(url, loaded, total){
    var loader = document.getElementById("loader-wrapper");
    loader.style.display = "none";
}

// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

// GLTF loader
const gltfLoader = new GLTFLoader(loadingManager)
gltfLoader.setDRACOLoader(dracoLoader)


//Materials
const streetMaterial = new THREE.MeshLambertMaterial( { color: 0xff80ab } );
streetMaterial.color.convertSRGBToLinear();

//Objects 

const dummyMesh = new THREE.Object3D;

const ringGeometry = new THREE.RingGeometry( 11, 12.2, 60 );
const street = new THREE.Mesh( ringGeometry, streetMaterial );
street.receiveShadow = true;
scene.add( street );
street.rotation.x = -Math.PI/2;
street.position.y = 0.001;

// Models

const dummyMatrix = new THREE.Matrix4();

gltfLoader.load(
    '/models/city2.glb', 
    function(gltf){
        var city = gltf.scene;
        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) { 
                node.castShadow = true;
                node.receiveShadow = true;
            }
        } );
        scene.add(city)
        city.scale.set(.5,.5,.5);
        city.rotation.y = -0.55;

});

gltfLoader.load(
    '/models/portal.glb', 
    function(gltf){
        var portal = gltf.scene;
        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) { 
                node.castShadow = true;
                node.receiveShadow = true;
            }
        } );
        scene.add(portal)
        portal.scale.set(.3,.3,.3);
        portal.position.x = -8.5;
        portal.position.z = -4;
        portal.rotation.y = 1.1;
});

var car;
gltfLoader.load(
    '/models/car.glb', function(gltf){
        car = gltf.scene;
        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) { 
                node.castShadow = true;
                node.receiveShadow = true;
            }
        } );
        scene.add(car);
        car.scale.set(.12,.18,.18);
});

var mixer3;
var action3;
gltfLoader.load(
    '/models/joshua.glb', function(gltf){
        var joshua = gltf.scene;

        //Playing Animation
        mixer3 = new THREE.AnimationMixer( joshua );
        action3 = mixer3.clipAction( gltf.animations[ 0 ] );
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
        joshua.position.set(0,0,10.5);
        joshua.rotation.y = 0;
});


gltfLoader.load(
    '/models/truck.glb', 
    function(gltf){
        var truck = gltf.scene;
        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) { 
                node.castShadow = true;
                node.receiveShadow = true;
            }
        } );
        scene.add(truck);
        truck.scale.set(.85,.85,.85);
        truck.position.x = 6;
        truck.position.z = 7.7;
        truck.rotation.y = 0.66;
});

gltfLoader.load(
    '/models/stage.glb', 
    function(gltf){
        var stage = gltf.scene;
        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) { 
                node.castShadow = true;
                node.receiveShadow = true;
            }
        } );
        scene.add(stage);
        stage.scale.set(.45,.45,.45);
        stage.position.x = 7.5;
        stage.rotation.y = Math.PI/2;
});

const shirtColor = new THREE.Color();
const shirtPalette = [ 0xEB50AD, 0xffffff, 0xA02EE2 ];
const skinPalette = [ 0x8d5524, 0xc68642, 0xe0ac69, 0xf1c27d, 0xffdbac ];

for ( let i = 0; i < 8; i ++ ) {
    gltfLoader.load(
    '/models/man.glb', function(gltf){
        var man = gltf.scene;
        man.scale.set(.48,.48,.48);
        man.position.set(9.5 + Math.random()*1.5-.75, 0, 0 + Math.random()*4-2);
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

gltfLoader.load(
    '/models/tree.glb', function(gltf){
        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) {
                //node.material.color.convertSRGBToLinear();
            }
        } );
        for ( let i = 0; i < 100; i ++ ) {
        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) {
                const instancedTree = new THREE.InstancedMesh( node.geometry, node.material, 1 );
                instancedTree.setMatrixAt( 0, dummyMatrix);
                instancedTree.castShadow = true;
                instancedTree.receiveShadow = true;
                scene.add( instancedTree );

                instancedTree.position.x = Math.sin(i/18 * Math.PI) * 13.2 + Math.random()*2-1;
                instancedTree.position.y = 0;
                instancedTree.position.z = Math.cos(i/18 * Math.PI) * 13.2 + Math.random()*2-1;
                instancedTree.rotation.x = Math.PI/2;
                instancedTree.rotation.z = Math.random() * Math.PI;
                
                let size = Math.random()*0.01 + 0.05;
                instancedTree.scale.set(size,size,size);
            }
        } );
        }
});

for ( let i = 0; i < 64; i ++ ) {
gltfLoader.load(
    '/models/flower.glb', function(gltf){
        var flower = gltf.scene;
        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) { 
                node.castShadow = true;
                node.receiveShadow = true;
            }
            flower.position.x = Math.sin(i/9.5 * Math.PI) * 9.5 + Math.random()*2-1;
            flower.position.y = 0;
            flower.position.z = Math.cos(i/9.5 * Math.PI) * 9.5 + Math.random()*2-1;
            flower.rotation.y = Math.random() * 360;
            let size = Math.random()*0.2 + 0.2;
            flower.scale.set(size,size,size);
        } );

        scene.add(flower);
    });
}


var girl;
var mixer;
var action;
gltfLoader.load(
    '/models/girl.glb', function(gltf){
        girl = gltf.scene;
        girl.scale.set(.06,.06,.06);

        //Playing Animation
        mixer = new THREE.AnimationMixer( girl );
        action = mixer.clipAction( gltf.animations[ 0 ] );
        action.timeScale = 1.5;
        action.play();
        
        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) { 
                node.castShadow = true;
                node.receiveShadow = true;
            }
        } );
        scene.add(girl);
});

var cyclist;
var mixer2;
var action2;
gltfLoader.load(
    '/models/cyclist.glb', function(gltf){
        cyclist = gltf.scene;
        cyclist.scale.set(.3,.3,.3);

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
        robot.position.set(-9.2,.75,4);
        robot.rotation.y = -Math.PI/2;
});

var rocks;
gltfLoader.load(
    '/models/rocks.glb', function(gltf){
        rocks = gltf.scene;
        
        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) { 
                node.castShadow = true;
                node.receiveShadow = true;
            }
        } );
        scene.add(rocks);
        rocks.scale.set(1.5,1.5,1.5);
        rocks.position.set(1,.72,-9);
        rocks.rotation.y = Math.PI;
});


// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(0,4,15);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0,0,0);
controls.enableZoom = false;
controls.enablePan = false;
controls.maxPolarAngle = Math.PI/2.3;
controls.minPolarAngle = Math.PI/2.3;
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
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor( 0xffd4e5, 1 );
//scene.background = null;

renderer.outputEncoding = THREE.sRGBEncoding;

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


// Lights
const hemiLight = new THREE.HemisphereLight( 0xffd4e5, 0xffd4e5, 0.75 );
hemiLight.color.setHSL( 0.9, 1 , 1 );
hemiLight.groundColor.setHSL( 0.9, 1, 0.85 );
hemiLight.position.set( 0, 500, 0 );
scene.add( hemiLight );


const light = new THREE.DirectionalLight(0xffd4e5, 0.5, 100);
light.position.set(3,8,3);
light.castShadow = true;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 1; 
light.shadow.camera.far = 16;
light.shadow.camera.top = 12;
light.shadow.camera.bottom = -12;
light.shadow.camera.left = -12;
light.shadow.camera.right = 12;
light.shadow.normalBias = 0.02;
scene.add(light);
scene.add( light.target );

//const helper = new THREE.CameraHelper( light.shadow.camera );
//scene.add( helper );

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
const start = document.getElementById("start");
const sausage = document.getElementById("sausage");
const syng = document.getElementById("syng");
const rubiks = document.getElementById("rubiks");
const tyfa = document.getElementById("tyfa");
const seismic = document.getElementById("seismic");
const fabric = document.getElementById("fabric");
let counttx = 0, countup = true;
const clock = new THREE.Clock(); 


const tick = () =>
 {
    // Update controls
    controls.update()

    if ( car ) {
        car.position.x = -Math.sin(i * Math.PI * 1) * 11.8;
        car.position.z = -Math.cos(i * Math.PI * 1) * 11.8;
        car.rotation.y = i * Math.PI + Math.PI/2;
        i -= 0.002;
    }

    if ( girl ) {
        girl.position.x = Math.sin(f * Math.PI * 1) * 10.8;
        girl.position.z = Math.cos(f * Math.PI * 1) * 10.8;
        girl.rotation.y = f * Math.PI + Math.PI/2;
        f += 0.0002;
    }

    if ( bird ) {
        bird.position.x = Math.sin(g * Math.PI * 1) * 8;
        bird.position.z = Math.cos(g * Math.PI * 1) * 8;
        bird.rotation.y = g * Math.PI - Math.PI/2;
        g -= 0.0008;
    }

    // Robot Animation
    if (countup) { counttx += .01; 
        if (counttx >= 0) countup = false;}
        else { counttx -= .01; if (counttx <= -2) countup = true; }
        if ( robot ) robot.rotation.y = counttx;

    // Update cyclist position
    const vector3D = new THREE.Vector3(0, 0, -4);
    vector3D.applyMatrix4(camera.matrixWorld);
    const azimuthalAngle = controls.getAzimuthalAngle();

    if ( cyclist ) {
        cyclist.position.lerp(vector3D, 1)
        cyclist.position.y = 0;
        //console.log(azimuthalAngle);
        cyclist.rotation.y = azimuthalAngle ;
    }

    if (azimuthalAngle >= -0.1 && azimuthalAngle < 0.1) {
        start.style.display = "block";
      }
    else {
        start.style.display = "none";
    }


    if (azimuthalAngle >= 0.45 && azimuthalAngle < 0.85) {
        sausage.style.display = "block";
      }
      else { sausage.style.display = "none";}


    if (azimuthalAngle >= -0.8 && azimuthalAngle < -0.4) {
        syng.style.display = "block";
      }
      else { syng.style.display = "none";}

    if (azimuthalAngle >= 1.35 && azimuthalAngle < 1.75) {
        rubiks.style.display = "block";
      }
      else { rubiks.style.display = "none";}

    if (azimuthalAngle >= -1.4 && azimuthalAngle < -1) {
        tyfa.style.display = "block";
      }
    else { tyfa.style.display = "none";}

    if (azimuthalAngle >= 2.8 && azimuthalAngle < 3.14) {
        seismic.style.display = "block";
      }
    else { seismic.style.display = "none";}

    if (azimuthalAngle >= -2.2 && azimuthalAngle < -1.8) {
        fabric.style.display = "block";
      }
    else { fabric.style.display = "none";}


    // Animation Mixer
    const delta = clock.getDelta();
    if ( mixer ) mixer.update( delta );
    if ( mixer2 ) mixer2.update( delta );
    if ( mixer3 ) mixer3.update( delta );
    if ( mixer4 ) mixer4.update( delta );



    scrollSpeed();

     // Render
     //stats.begin()
     renderer.render(scene, camera)
     //stats.end()
 
     // Call tick again on the next frame
     window.requestAnimationFrame(tick)
 }
 
 tick()