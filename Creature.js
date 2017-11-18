

class Creature{

  constructor(neuralNetwork, name){
    'use strict'
    this.neuralNetwork = neuralNetwork;
    this.velocity = new Array();
    this.velocity[0] = 0;
    this.velocity[1] = 0;
    this.absVelocity = 0;
    this.creature = new THREE.Object3D();
    this.addMainBody();
    this.name = name;
  }

  addMainBody(){
    'use strict';
    var geometry = new THREE.Geometry();

    geometry.vertices.push( new THREE.Vector3(0, 0, 0) );
    geometry.vertices.push( new THREE.Vector3( 3, 0, 0) );
    geometry.vertices.push( new THREE.Vector3( 0, 3, 0) );

    geometry.faces.push( new THREE.Face3( 0, 1, 2));

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    var mesh = new THREE.Mesh(geometry/*,  new THREE.MeshBasicMaterial( { color: 0x00ffff } )*/);
    mesh.rotation.set(0,0, 3*Math.PI/4);
    mesh.position.set(1.5,0,0);
    this.creature.add(mesh);
    this.creature.add(new THREE.AxisHelper(5));
  }

  update(elapsedTime, objs){
    'use strict';
    var inputs = new Array();
    var i;

    this.velocity[0] = this.absVelocity*Math.cos(this.creature.rotation.z);
    this.velocity[1] = this.absVelocity*Math.sin(this.creature.rotation.z);
    this.creature.position.x += this.velocity[0]*elapsedTime;
    this.creature.position.y += this.velocity[1]*elapsedTime;

    var direction = new THREE.Vector3(this.velocity[0], this.velocity[1], 0);
    direction.normalize();

    for(i = 0; i < objs.length; i++){
      if(this != objs[i] && this.creature.position.distanceTo(objs[i].getObject3D().position) < 35){
        //console.log(this.name, " interseta o: ", objs[i].name, " distancia: ", this.creature.position.distanceTo(objs[i].getObject3D().position));
        var directionOther = new THREE.Vector3();
        directionOther.subVectors( objs[i].getObject3D().position, this.creature.position);
        directionOther.normalize();
        if(directionOther.angleTo(direction) < Math.PI/2 || directionOther.angleTo(direction) > 3*Math.PI/2)
          console.log("I see you ", objs[i].name);
        //console.log(directionOther.angleTo(direction));
      }
    }

    inputs[0] = Math.sqrt(Math.pow(this.creature.position.x-40, 2) + Math.pow(this.creature.position.y-40, 2));
    inputs[1] = this.creature.position.x-40;
    inputs[2] = this.creature.position.y-40;

    this.neuralNetwork.fitness += 1/inputs[0]+0.0001;

    var outputs = this.neuralNetwork.FeedForward(inputs);
    this.absVelocity = 10000 * outputs[0] * elapsedTime;
    this.creature.rotation.z = outputs[1];

  }

  getObject3D(){
    'use strict';
    return this.creature;
  }

}
