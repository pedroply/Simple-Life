var camera, scene, renderer, material, mesa_mesh, aspectratio, objs = new Array();

var clock = new THREE.Clock;

var ratio = 2.07;
var scale = 0.0115;
var scale_width;
var scale_height;
var last_width;
var last_height;

var camera = new Array(2);
var cameraViewCar = 0;

var elapsedTime;
var timeCount = 0;
var foodTime = 0;
var generationNumber = 0;
var populationSize = 20;
var layers = [3, 10, 10, 3];
var neuralNetworks;
var mouse = new THREE.Vector2();
var mouseWorld = new THREE.Vector3();

function createScene(){
  'use strict';
  scene = new THREE.Scene();
  scene.add(new THREE.AxisHelper(10));
  InitCreaturesNeuralNetworks();
  CreateCreatures();
  for(var i = 0; i < 20; i++){
    objs[objs.length] = new Food((Math.random()-0.5)*80, (Math.random()-0.5)*80);
    scene.add(objs[objs.length-1].getObject3D());
  }
  /*var geometry = new THREE.CircleGeometry( 5, 32 );
  var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
  var circle = new THREE.Mesh( geometry, material );
  circle.position.x = 40;
  circle.position.y = 40;
  circle.position.z = 0;
  scene.add( circle );*/
}

function createCamera(){
  'use strict';
  createOrtCamera();
  createPerspCamera();
}


function createPerspCamera(){
  'use strict';
  camera[1] = new THREE.PerspectiveCamera(80, window.innerWidth/window.innerHeight, 1, 1000);
  camera[1].position.x = 0;
  camera[1].position.y = 0;
  camera[1].position.z = 50;
  camera[1].lookAt(scene.position);
}

function createOrtCamera(){
  'use strict';
  if (window.innerWidth / window.innerHeight > ratio)
        camera[0] = new THREE.OrthographicCamera(-window.innerWidth / scale_height, window.innerWidth / scale_height, window.innerHeight / scale_height, -window.innerHeight / scale_height, 1, 100);
    else
        camera[0] = new THREE.OrthographicCamera(-window.innerWidth / scale_width, window.innerWidth / scale_width, window.innerHeight / scale_width, -window.innerHeight / scale_width, 1, 100);
  last_width = window.innerWidth;
  last_height = window.innerHeight;
  camera[0].position.x = 0;
  camera[0].position.y = 0;
  camera[0].position.z = 50;
  camera[0].lookAt(scene.position);
}

function onResize() {
  'use strict';
  renderer.setSize(window.innerWidth, window.innerHeight);
  scale_width = (window.innerWidth * scale_width) / last_width;
  scale_height = (window.innerHeight * scale_height) / last_height;
  last_width = window.innerWidth;
  last_height = window.innerHeight;

  if(cameraViewCar == 0){
    if (window.innerWidth / window.innerHeight > ratio)
        resizeOrtCamera(scale_height);
    else
        resizeOrtCamera(scale_width);
      }

  else if(cameraViewCar == 1){
    camera[1].aspect = window.innerWidth / window.innerHeight;
    camera[1].updateProjectionMatrix();
  }
  else{
    camera[2].aspect = window.innerWidth / window.innerHeight;
    camera[2].updateProjectionMatrix();
  }
}

/*OrthographicCamera resize function*/
function resizeOrtCamera(scale) {
  'use strict';
  camera[0].left = -window.innerWidth / scale;
  camera[0].right = window.innerWidth / scale;
  camera[0].top = window.innerHeight / scale;
  camera[0].bottom = -window.innerHeight / scale;
  camera[0].updateProjectionMatrix();
}

function render(){
  'use strict';
  renderer.render(scene, camera[cameraViewCar]);
}

function init(){
  'use strict';
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  aspectratio = window.innerWidth / window.innerHeight;
  document.body.appendChild(renderer.domElement);
  scale_width = window.innerWidth * scale;
  scale_height = window.innerHeight * scale * ratio;

  createScene();
  createCamera();

  window.addEventListener('resize', onResize);
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener( 'mousemove', onMouseMove, false );
}

function animate() {
  'use strict';
  var i;
  elapsedTime = clock.getDelta();
  timeCount += elapsedTime;
  foodTime += elapsedTime;
  if(timeCount > 10){

    neuralNetworks.sort(function(a, b){
      return a.CompareTo(b);
    });

    console.log("worst: ", neuralNetworks[0].fitness, "\nbest: ", neuralNetworks[neuralNetworks.length-1].fitness);

    for(i = 0; i < populationSize/2; i++){
      neuralNetworks[i] = new NeuralNetwork(neuralNetworks[i+populationSize/2]);
      neuralNetworks[i].Mutate();

      neuralNetworks[i + populationSize/2] = new NeuralNetwork(neuralNetworks[i+populationSize/2]);
    }

    for(i = 0; i < populationSize; i++){
      neuralNetworks[i].fitness = 0;
    }

    for(i = 0; i < objs.length; i++){
      scene.remove(objs[i].getObject3D());
    }
    objs = new Array();
    CreateCreatures();

    for(i = 0; i < 20; i++){
      objs[objs.length] = new Food((Math.random()-0.5)*80, (Math.random()-0.5)*80);
      scene.add(objs[objs.length-1].getObject3D());
    }

    generationNumber++;
    console.log("generation number: ", generationNumber);
    timeCount = 0;
    elapsedTime = clock.getDelta();
  }

  if(foodTime > 0.5){
    objs[objs.length] = new Food((Math.random()-0.5)*80, (Math.random()-0.5)*80);
    scene.add(objs[objs.length-1].getObject3D());
    foodTime = 0;
  }

  for(i = 0; i<objs.length; i++){
    objs[i].update(elapsedTime, objs, scene);
  }

  render();

  requestAnimationFrame( animate );
}

function onKeyDown(e) {
    'use strict';
    switch (e.keyCode) {
		case 38:  //cima seta
		  gas = true;
		  break;
	}
}

function onKeyUp(e){
  'use strict';
  switch (e.keyCode) {
		case 38:  //cima seta
		  gas = false;
		  break;
	}
}

function InitCreaturesNeuralNetworks(){
  'use strict';
  if (populationSize % 2 != 0)
    populationSize += 1;

  neuralNetworks = new Array();
  var i;
  for(i = 0; i < populationSize; i++){
    var nn = new NeuralNetwork(layers);
    neuralNetworks[neuralNetworks.length] = nn;
  }
}

function CreateCreatures(){
  'use strict';
  var i;
  for(i = 0; i < populationSize; i++){
    objs[i] = new Creature(neuralNetworks[i], i);
    scene.add(objs[i].getObject3D());
  }
}

function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  var raycaster = new THREE.Raycaster();
  // update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera[cameraViewCar] );

	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects( scene.children, true );

	for ( var i = 0; i < intersects.length; i++ ) {

		//console.log(intersects[ i ].object);

	}

  mouseWorld = new THREE.Vector3( mouse.x, mouse.y, -1 ).unproject( camera[cameraViewCar] );

}
