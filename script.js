import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/postprocessing/EffectComposer.js';
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader";
import { GUI } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/libs/lil-gui.module.min.js';
import { OBJLoader } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/OBJLoader";
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';
import { OutlinePass } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/postprocessing/OutlinePass.js';
import { RenderPass } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/postprocessing/RenderPass.js';
import Stats from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/libs/stats.module.js';
import { UnrealBloomPass } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/postprocessing/UnrealBloomPass.js';

var base, beam, camera, canvas, composer, light, mouse, mytexture_mat, mytexture_load_one, mytexture_one, inset_load_one, inset_one, inset_mat_one, wireframe_mat, object, plane, pointOfIntersection, raycaster, renderer, scene, target;
var selectedObjects = []

init();
lights();
effects();
mousetracking();
animate();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, 1, 1, 400);
  camera.position.set(0, 0, 5);
  base = new THREE.Object3D();
  scene.add(base);
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor(0x0d0d0d);
  composer = new EffectComposer(renderer);
  canvas = renderer.domElement;
  document.body.appendChild(canvas);
  window.addEventListener( 'resize', onWindowResize );
  createMaterials();
  createLamp(mytexture_load_one, mytexture_one, inset_load_one, inset_one, inset_mat_one);
}

function createMaterials() {
  const normalLoader = new THREE.TextureLoader();
  normalLoader.crossOrigin = '';
  const normalMapTexture = normalLoader.load('https://cdn.glitch.global/b1638880-ad84-4bbc-a82e-97d961c93b6a/Untitled-13.jpg?v=1653439015895');
  normalMapTexture.wrapS = THREE.RepeatWrapping;
  normalMapTexture.wrapT = THREE.RepeatWrapping;
  normalMapTexture.repeat.set(10, 10);

  mytexture_mat = new THREE.MeshPhysicalMaterial({
    roughness: 0.6,
    transmission: 1,
    thickness: 0.2,
    clearcoat: 0.1,
    clearcoatRoughness: 0.7,
    normalMap: normalMapTexture,
    clearcoatNormalMap: normalMapTexture,
  });

  mytexture_mat.depthWrite = false;
  mytexture_mat.side = THREE.DoubleSide;
  mytexture_mat.emmissiveIntensity = 0;

  inset_mat_one = new THREE.MeshPhysicalMaterial({
    color: 0xdb1f93,
    roughness: 0,
    transmission: 0,
    thickness: 0.5,
  });
  inset_mat_one.transparency = true;
  inset_mat_one.opacity = 0.0001;
  inset_mat_one.emissive = new THREE.Color( 0xdb1f93 );
  inset_mat_one.emmissiveIntensity = 100;
}


function createLamp(tload, tobj, iload, iobj, imat) {
  tload = new GLTFLoader().setPath( 'https://cdn.glitch.global/b1638880-ad84-4bbc-a82e-97d961c93b6a/netart.glb?v=1662149109675' );
  tload.load( 'only_texture.glb', function ( gltf ) {
    tobj = gltf.scene;
    tobj.position.set(0, 0, 0);
    tobj.traverse((child) => {
      if ( child instanceof THREE.Mesh ) {
        child.material = mytexture_mat;
      }
    })
    base.add( tobj );
    tobj.position.set(0, 0.25, 0);
  });

  iload = new GLTFLoader().setPath( 'https://cdn.glitch.global/b1638880-ad84-4bbc-a82e-97d961c93b6a/inner_netart.glb?v=1662151222618' );
  iload.load( 'only_inset.glb', function ( gltf ) {
    iobj = gltf.scene;
    iobj.traverse((child) => {
      if ( child instanceof THREE.Mesh ) {
        child.material = imat;
      }
    })
    base.add( iobj );
    iobj.position.set(0, 0.25, 0);
  });
}

function lights() {
  var light = new THREE.AmbientLight( 0x404040, 100 )
  scene.add( light );
}

function effects() {
  var renderPass = new RenderPass(scene, camera);

  const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );

  bloomPass.threshold = 0.1;
  bloomPass.strength = 0.4;
  bloomPass.radius = 0.1;
  composer.addPass(renderPass);
  composer.addPass(bloomPass);
}

function mousetracking() {
  plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -2);
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  target = new THREE.Vector2();
  pointOfIntersection = new THREE.Vector3();
  canvas.addEventListener("mousemove", onMouseMove, false);
}

function onMouseMove(event) {
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
}

function resize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize( width, height );
  composer.setSize( width, height );
}

function animate() {
    requestAnimationFrame( animate );
    target.x += ( mouse.x - target.x ) * 0.08;
    target.y += ( mouse.y - target.y ) * 0.08;
    raycaster.setFromCamera(target, camera);
    raycaster.ray.intersectPlane(plane, pointOfIntersection);
    base.lookAt(pointOfIntersection);
    if (resize(renderer)) {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera);
    composer.render(scene, camera);
}
