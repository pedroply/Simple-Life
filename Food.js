

class Food{

  constructor(){
    'use strict'
    this.food = new THREE.Object3D();
    this.addMainBody();
    this.energy = 5;
  }

  addMainBody(){
    'use strict';
    var geometry = new THREE.Geometry();

    geometry.vertices.push( new THREE.Vector3( 0, 0, 0) );
    geometry.vertices.push( new THREE.Vector3( 1, 0, 0) );
    geometry.vertices.push( new THREE.Vector3( 0, 1, 0) );

    geometry.faces.push( new THREE.Face3( 0, 1, 2));

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    var mesh = new THREE.Mesh(geometry,  new THREE.MeshBasicMaterial( { color: 0x00ff00 } )*/);
    mesh.rotation.set(0,0, 3*Math.PI/4);
    mesh.position.set(0.5,0,0);
    this.food.add(mesh);
    this.food.add(new THREE.AxisHelper(2));
  }

  getObject3D(){
    'use strict';
    return this.food;
  }

  eaten(obj){
    obj.eat(this.energy);
    this.energy = 0;
  }

  eat(energy){

  }

  update(elapsedTime, objs, scene){
    if(energy <= 0){
      scene.remove(this.food);
      var i;
      for(i = 0; i < objs.length; i++){
        if(objs[i] = this){
          objs.splice(i, 1);
          break;
        }
      }
    }
  }

}
