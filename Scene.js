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

function createScene(){
  'use strict';
  scene = new THREE.Scene();
  scene.add(new THREE.AxisHelper(10));

}

function createCamera(){
  'use strict';
  createOrtCamera();
  createPerspCamera();
}


function createPerspCamera(){
    camera[1] = new THREE.PerspectiveCamera(80, window.innerWidth/window.innerHeight, 1, 1000);
    camera[1].position.x = 40;
    camera[1].position.y = 30;
    camera[1].position.z = 30;
    camera[1].lookAt(scene.position);
}

function createOrtCamera(){
  if (window.innerWidth / window.innerHeight > ratio)
        camera[0] = new THREE.OrthographicCamera(-window.innerWidth / scale_height, window.innerWidth / scale_height, window.innerHeight / scale_height, -window.innerHeight / scale_height, 1, 100);
    else
        camera[0] = new THREE.OrthographicCamera(-window.innerWidth / scale_width, window.innerWidth / scale_width, window.innerHeight / scale_width, -window.innerHeight / scale_width, 1, 100);
  last_width = window.innerWidth;
  last_height = window.innerHeight;
  camera[0].position.x = 0;
  camera[0].position.y = 50;
  camera[0].position.z = 0;
  camera[0].lookAt(scene.position);
}

function onResize() {
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
}

function animate() {
  'use strict';
  elapsedTime = clock.getDelta();

  var i;
  for(i = 0; i<objs.length; i++){
    objs[i].update(elapsedTime);
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
