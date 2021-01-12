
//importing the code utilized
//THREE imports in the library, includes scenes, camera, and renderer
import * as THREE from '../build/three.module.js';

//GLTFLoader imports in a loader that processes the 3d model to be implemented into the program
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
//OrbitControls imports in controls so user can move around the scene
import { OrbitControls } from './jsm/controls/OrbitControls.js';
//Transform Controls imports in a seperate control that will help with collisions
import { TransformControls } from './jsm/controls/TransformControls.js';


//declare variables for the 3d components
let scene, renderer, camera, stats, controls;
let model, skeleton, mixer, clock;


//declare variables for collision detection
let pastPosX,pastPosY,pastPosZ;

//initilize user starts facing front
let isFront = true;



init();

function init() {

	const container = document.getElementById( 'container' );

	// of Camera
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 1, 3, 7 );
	camera.lookAt( 0, 2, 0 );

	//initialize clock and scene
	clock = new THREE.Clock();
	scene = new THREE.Scene();

	//scene background can be changed to white, blue, and black by changing color
	let color = "white";
	//blue background
	if(color=="blue"){
		scene.background = new THREE.Color( "rgb(174, 214, 241)" );
	}else if(color=="black"){
		scene.background = new THREE.Color( "rgb(0, 0, 0)" );
	}else{
		scene.background = new THREE.Color( "rgb(247, 239, 238)" );
	}
	
	//adding fog to the scene
	scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );

	//initializing and adding lighting to the scene
	const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
	hemiLight.position.set( 0, 20, 0 );
	scene.add( hemiLight );
	const dirLight = new THREE.DirectionalLight( 0xffffff );
	dirLight.position.set(  8, 15,  6 );
	dirLight.castShadow = true;
	dirLight.shadow.camera.top = 2;
	dirLight.shadow.camera.bottom =  2;
	dirLight.shadow.camera.left =  2;
	dirLight.shadow.camera.right = 2;
	dirLight.shadow.camera.near = 0.1;
	dirLight.shadow.camera.far = 40;
	scene.add( dirLight );

	//loading the 3d human model into the website
	const loader = new GLTFLoader();
	loader.load('models/scene.gltf', function(gltf){
          var humanModel = gltf.scene.children[0];
          humanModel.scale.set(0.01,0.01,0.01);

          //add model to scene
          scene.add(gltf.scene);

          //adding shadows to the model
          humanModel.traverse( function ( object ) {
          	if ( object.isMesh ) object.castShadow = true;

          } );

          //creates animation loop to render the model
          animateHuman();
        });
	//intiialize the renderer
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.shadowMap.enabled = true;
	container.appendChild( renderer.domElement );

	//initialize the controls
	controls = new OrbitControls( camera, renderer.domElement );
	controls.addEventListener('change', render);

	//disables the zooming of 3d model
	controls.enableZoom = false;

	

	

	window.addEventListener( 'resize', onWindowResize, false );
	//collision detection
	console.log(document.getElementById("container").firstChild);
	document.getElementById("container").firstChild.addEventListener('mousedown', collisionDetection);

}

function render() {

      renderer.render( scene, camera );

  }

function collisionDetection(){
	console.log(camera.position);
}
//interprets what objects the mouse intersects 
function onDocumentMouseDown( e ) {
	
  e.preventDefault();
  console.log("ran")
  var mouseVector = new THREE.Vector3();
  mouseVector.x = 2 * (e.clientX / SCREEN_WIDTH) - 1;
  mouseVector.y = 1 - 2 * ( e.clientY / SCREEN_HEIGHT );
  var raycaster = projector.pickingRay( mouseVector.clone(), camera );
  var intersects = raycaster.intersectObject( TARGET );
  for( var i = 0; i < intersects.length; i++ ) {
    var intersection = intersects[ i ],
    obj = intersection.object;
    console.log("Intersected object", obj);
  }
}



function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	//renderer.setSize helps determine the size of canvas without changing inner
	renderer.setSize( window.innerWidth, window.innerHeight );

}
function animateHuman() {
	//prevent the user from moving below the ground
	controls.addEventListener('change', groundCheck);
	

	//determines if the user is facing the fron or the back
    renderer.render(scene,camera);
    requestAnimationFrame(animateHuman);
  }

function groundCheck() {
	var minMoveValue=1.5;
	
	
	
	if(pastPosY!= null && pastPosY>camera.position.y){
		if( camera.position.y<minMoveValue  ){
			//camera.position.x=pastPosX;
			//camera.position.y=pastPosY;
			//camera.position.z=pastPosZ;
		}
		
	}
	
	pastPosX = camera.position.x;
	pastPosY = camera.position.y;
	pastPosZ = camera.position.z;
}
