// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let controls;
let renderer;
let scene;
let newMaterial;
let standardMaterial;
let newStandard;
let pointsMaterial;
let skyboxTexture, skyboxMaterial, refractorySkybox;
let raycaster;
let mouse;
let INTERSECTED;
let cube;
let deer;
let datGUI;

const mixers = [];
const clock = new THREE.Clock();

function init() {

  container = document.querySelector( '#scene-container' );

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xFEFAD4 );
  //scene.fog = new THREE.Fog( 0xFEFAD4, 10, 200);
  //scene.fog = new THREE.FogExp2( 0xFEFAD4, 0.01);
  //8FB9A8  0x8FB9A8

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  const cubeGeometry = new THREE.CubeGeometry(10, 10, 10);
  const cubMaterial = new THREE.MeshLambertMaterial({color: 0xF3FFE2});
  cube = new THREE.Mesh(cubeGeometry, cubMaterial);
  cube.position.set(55, 5, 50);
  scene.add(cube);

  createSkybox();
  //manualSkyBox();
  createCamera();
  createControls();
  createLights();
  loadDeer();
  createPlane();
  createMaterial();
  loadPavilion();
  addGUI();
  createRenderer();

  renderer.setAnimationLoop( () => {

    update();
    render();

  } );

}

function createSkybox(){

  skyboxTexture = new THREE.CubeTextureLoader()
 					.setPath( 'js/three.js-master/examples/textures/cube/MilkyWay/' ) 
         .load( [ 'dark-s_nx.jpg', 'dark-s_nx.jpg', 'dark-s_ny.jpg', 'dark-s_ny.jpg', 'dark-s_nz.jpg', 'dark-s_nz.jpg' ] ); 

  skyboxTexture.mapping = THREE.CuberRefractionMapping;
  //other mappings to try:
/*
THREE.UVMapping
THREE.CubeReflectionMapping
THREE.CubeRefractionMapping
THREE.EquirectangularReflectionMapping
THREE.EquirectangularRefractionMapping
THREE.CubeUVReflectionMapping
THREE.CubeUVRefractionMapping
*/

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

  camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 10, 1000 );
  //camera.position.set( -55, 30, 5);
  // console.log(camera);
  camera.position.set( -7, 30, -1 );


//  12.804123138522439, 28.14408844095024, -63.31210370834743
//  -55, 10, 50

}

function createControls() {

  controls = new THREE.OrbitControls( camera, container );
  controls.target.set(0, 10, 0);

}

function createLights() {

  const ambientLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 5 );
  const mainLight = new THREE.DirectionalLight( 0xaca3bf, -3 );
  mainLight.position.set( 50, 100, 100 );
  mainLight.castShadow = true;
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 50;
  mainLight.shadow.mapSize.height = 50;
  var d = 30;
  mainLight.shadow.camera.left = -d;
  mainLight.shadow.camera.right = d;
  mainLight.shadow.camera.top = d;
  mainLight.shadow.camera.bottom = -d;
  mainLight.shadow.camera.far = 100;

  scene.add( ambientLight, mainLight );

}

function createMaterial(){
  //let diffuseColor = 0xfcfafa;
  newMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, skinning: true});
  standardMaterial = new THREE.MeshStandardMaterial({ color:0x8e80ab, skinning: true});
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load( 'textures/rose.jpg' );
        texture.encoding = THREE.sRGBEncoding;
        texture.anisotropy = 16;
  const imgTexture = new THREE.TextureLoader().load('textures/wave-textures-white-background-vector_53876-60286.jpg');
        imgTexture.wrapS = imgTexture.wrapT = THREE.RepeatWrapping;
        imgTexture.anisotropy = 16;

  skyboxMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, envMap: scene.background});

  newStandard = new THREE.MeshPhongMaterial({
    color: 0xfcfafa,
    //envMap: skyboxTexture,
    // envMap: scene.background,
    //refractionRatio: 0.5,
    skinning: true,
    size:1000
  });
  //newStandard.envMap.mapping = THREE.CubeRefractionMapping;
//   newStandard = new THREE.MeshStandardMaterial({
//     //map: texture,
//     color: 0xfcfafa,
//     //bumpMap: imgTexture,
//     //bumpScale: 1,
//     //displacementMap: imgTexture,
//     //displacementScale: 1,
//     envMap: scene.background,
//     refractionRatio: 0.95,
//     skinning: true
//   });
// //  pointsMaterial = new THREE.pointsMaterial({
// //    color: diffuseColor,
// //    sizeAttenuation: true,
// //    size: 0.1
// //  });
//     newStandard.envMap.mapping = THREE.CubeRefractionMapping;

  refractorySkybox = new THREE.MeshPhongMaterial({
    envMap: skyboxTexture,
    reflectivity: 0.9,
    skinning: true
  })

}

function loadPavilion() {

  const loader = new THREE.GLTFLoader();
  const onLoad = ( gltf, position, material ) => {

    const model = gltf.scene.children[ 0 ];

    model.position.copy( position );
    model.scale.set(0.1, 0.1, 0.1);

    object = gltf.scene;
    object.traverse((child) => {
       if (child.isMesh){
         child.material = material;
       }
    });
    scene.add( model );

  };

  // the loader will report the loading progress to this function
  const onProgress = () => {
  };

  // the loader will send any error messages to this function, and we'll log
  // them to to console
  const onError = ( errorMessage ) => { console.log( errorMessage ); };

  // load the first model. Each model is loaded asynchronously,
  // so don't make any assumption about which one will finish loading first
  const parrotPosition = new THREE.Vector3( -7, 5, -1 );
  loader.load( 'models/quinta_da_regaleira_pavilion copy/scene.gltf', gltf => onLoad( gltf, parrotPosition, refractorySkybox), onProgress, onError );

}

function loadDeer() {

  //const material = new THREE.MeshBasicMaterial({
  //  color: 0x8FB9A8
  //});
  const loader = new THREE.GLTFLoader();

  // A reusable function to set up the models. We're passing in a position parameter
  // so that they can be individually placed around the scene
  const onLoad = ( gltf, position, material ) => {

    const model = gltf.scene.children[ 0 ];
    model.position.copy( position );
    //model.scale.set(1000, 1000, 1000);

    deer = model;

    const deerFolder = datGUI.addFolder("deer")

    deerFolder.add(deer.rotation, "x", 0, Math.PI * 2, 0.01)
    deerFolder.add(deer.rotation, "y", 0, Math.PI * 2, 0.01)
    deerFolder.add(deer.rotation, "z", 0, Math.PI * 2, 0.01)
    deerFolder.open()

    const animation = gltf.animations[ 0 ];

    const mixer = new THREE.AnimationMixer( model );
    mixers.push( mixer );

    var clips = gltf.animations;
    clips.forEach( function ( clip ) { 
      mixer.clipAction( clip ).play();
    }); 

    // console.log(mesh);
    // console.log(model.children[0])

    let object = gltf.scene;
    // console.log(object);
    object.traverse((child) => {
      if (child.isMesh){
        child.material = material;
      }
    });
    scene.add( object );

  };

  // the loader will report the loading progress to this function
  const onProgress = () => {};

  // the loader will send any error messages to this function, and we'll log
  // them to to console
  const onError = ( errorMessage ) => { console.log( errorMessage ); };

  // load the first model. Each model is loaded asynchronously,
  // so don't make any assumption about which one will finish loading first
  const deerPosition = new THREE.Vector3( -9, 0, -10 );
  loader.load( 'models/blendergallery.glb', gltf => onLoad( gltf, deerPosition, newStandard), onProgress, onError );

}

function createPlane() {
  const geometry = new THREE.PlaneBufferGeometry(500, 500, 0, 0);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load( 'textures/grasslight-big.jpg', function (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  });
  texture.repeat.set(5, 5);
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = 16;

  const material = new THREE.MeshStandardMaterial( {
    map: texture,
    bumpMap: texture,
    bumpScale: 5,
    //color: diffuseColor
  } );
  mesh = new THREE.Mesh( geometry, material );
  mesh.rotation.x = - Math.PI / 2.2;
  mesh.position.y = 0;
  mesh.receiveShadow = true;
  //mesh.castShadow = true;
  scene.add( mesh );
}

//function createSphere() {

//  var geometry = new THREE.SphereBufferGeometry(2, 60, 60);
//  var material = new THREE.MeshLambertMaterial({
//    color: 0xFCD0BA,
//    emissive: 0xe00ba4B,
//    //0xfcf4ca
//    emissiveIntensity: 10,
//    skinning: true

//  });
//  mesh.position.y = -3.5;
//  mesh.position.x = 20;
//  mesh.position.z = 30
  //var light = new THREE.PointLight(0xfcf4ca, 0.00005);
  //scene.add(light);
//  scene.add( mesh );
//}

function createRenderer() {

  // create a WebGLRenderer and set its width and height
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( container.clientWidth, container.clientHeight );
  renderer.setPixelRatio( window.devicePixelRatio );

  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;
  renderer.shadowMap.enable = true;

  renderer.physicallyCorrectLights = true;

  container.appendChild( renderer.domElement );

}

function update() {

  const delta = clock.getDelta();

  for ( const mixer of mixers ) {

    mixer.update( delta );

  }

}

function handleOnHover() {
  // update the picking ray with the camera and mouse position
  raycaster.setFromCamera( mouse, camera );

  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children, true );

  if ( intersects.length > 0 ) {

    if ( INTERSECTED != intersects[ 0 ].object ) {

      if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

      INTERSECTED = intersects[ 0 ].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex( 0xff0000 );

    }

  } else {

    if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

    INTERSECTED = null;

  }

}

function addGUI() {
  // var interface = new function () {
  //   cube.rotationX = 0.01;
  //   cube.rotationY = 0.01;
  //   cube.rotationZ = 0.01;
  // }
  datGUI = new dat.GUI();
  // datGUI.add("interface,rotationX", 0, 1);
  // datGUI.add("interface,rotationY", 0, 1);
  // datGUI.add("interface,rotationZ", 0, 1);

  const cubeFolder = datGUI.addFolder("Cube")

  cubeFolder.add(cube.rotation, "x", 0, Math.PI * 2, 0.01)
  cubeFolder.add(cube.rotation, "y", 0, Math.PI * 2, 0.01)
  cubeFolder.add(cube.rotation, "z", 0, Math.PI * 2, 0.01)
  cubeFolder.open();

}

function render() {
  //console.log(camera.position);
  handleOnHover() ;
  // object.traverse((child) => { 
  //   if (child.isMesh) {
  //     object.rotation.x = 0.1;
  //   }
  // });

  // cube.rotation.x = interface.rotationX;
  // cube.rotation.y = interface.rotationY;
  // cube.rotation.z = interface.rotationZ;

  renderer.render( scene, camera );
}

function onMouseMove( event ) {  
  	// calculate mouse position in normalized device coordinates 
    // (-1 to +1) for both components  
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1; 
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  }



function onWindowResize() {
//  if (object.position.x <= targetPositionX) { 
//    object.position.x += 0.001;
       // You decide on the increment, higher value will mean the objects moves faster
//     }
//     targetPositin= Pavilion.x deer
  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  renderer.setSize( container.clientWidth, container.clientHeight );

}


window.addEventListener( 'resize', onWindowResize );
window.addEventListener( 'mousemove', onMouseMove, false );

init();
