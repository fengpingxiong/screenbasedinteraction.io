// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let controls;
let renderer;
let scene;
let refractorySkybox;
const mixers = [];

function init() {

  container = document.querySelector('#scene-container');
  scene = new THREE.Scene();

  createCamera();
  createControls();
  createLights();
  createSkybox();
  // manualSkyBox();
  createRenderer();

  renderer.setAnimationLoop(() => {
    update();
    render();
  });
}

function createSkybox() {
  const skyboxTexture = new THREE.CubeTextureLoader()
    .setPath('js/three.js-master/examples/textures/cube/skyboxsun25deg/')
    .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);

  refractorySkybox = new THREE.MeshPhongMaterial({
    envMap: skyboxTexture,
    reflectivity: 0.5,
    color: "white",
    skinning: true
  })

  skyboxTexture.mapping = THREE.CuberRefractionMapping;

  scene.background = skyboxTexture;
}

// function manualSkyBox() {
//
//   var textureLoader = new THREE.TextureLoader();
//
//   var texture0 = textureLoader.load( 'js/three.js-master/examples/textures/cube/Park2/negx.jpg' );
//   var texture1 = textureLoader.load( 'js/three.js-master/examples/textures/cube/Park2/negy.jpg' );
//   var texture2 = textureLoader.load( 'js/three.js-master/examples/textures/cube/Park2/negz.jpg' );
//   var texture3 = textureLoader.load( 'js/three.js-master/examples/textures/cube/Park2/posx.jpg' );
//   var texture4 = textureLoader.load( 'js/three.js-master/examples/textures/cube/Park2/posy.jpg' );
//   var texture5 = textureLoader.load( 'js/three.js-master/examples/textures/cube/Park2/posz.jpg' );
//
//   var materials = [
//     new THREE.MeshBasicMaterial( { map: texture0 } ),
//     new THREE.MeshBasicMaterial( { map: texture1 } ),
//     new THREE.MeshBasicMaterial( { map: texture2 } ),
//     new THREE.MeshBasicMaterial( { map: texture3 } ),
//     new THREE.MeshBasicMaterial( { map: texture4 } ),
//     new THREE.MeshBasicMaterial( { map: texture5 } )
//   ];
//
//   var faceMaterial = new THREE.MeshFaceMaterial( materials );
//   faceMaterial.side = THREE.DoubleSide;
//   var geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
//   var ManualSkyBox = new THREE.Mesh( geometry, faceMaterial );
//   ManualSkyBox.scale.set(800, 800, 800);
//   scene.add( ManualSkyBox );
//
// }

function createCamera() {
  camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 500);
  camera.position.set(-9, 13, 40);
}

function createControls() {
  controls = new THREE.OrbitControls(camera, container);
  // const controls = new THREE.FirstPersonControls(camera);
  // const controls = new PointerLockControls(camera, renderer.domElement);
  // controls.lookSpeed = 0.1;
  // controls.movementSpeed = 10;
  // const clock = new THREE.Clock(true);
  // controls = new THREE.flyControls(camera, HTMLElement);
  controls.target.set(0, 10, 0);
}

function createLights() {
  const mainLight = new THREE.DirectionalLight(0xaca3bf, -3);
  mainLight.position.set(50, 100, 100);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 50;
  mainLight.shadow.mapSize.height = 50;

  const ambientLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 5);
  scene.add(ambientLight, mainLight);
}


function createRenderer() {

  // create a WebGLRenderer and set its width and height
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;
  renderer.shadowMap.enable = true;

  renderer.physicallyCorrectLights = true;

  container.appendChild(renderer.domElement);
}

function update() {
  const clock = new THREE.Clock();
  const delta = clock.getDelta();
  for (const mixer of mixers) {
    mixer.update(delta);
  }
}

function render() {
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix(); // update the camera's frustum
  renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener('resize', onWindowResize);

init();
