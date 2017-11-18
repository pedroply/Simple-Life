

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
    this.energy = 100;
    this._eat = 0;
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

    var mesh = new THREE.Mesh(geometry,  new THREE.MeshBasicMaterial( { color: 0x00ffff } ));
    mesh.rotation.set(0,0, 3*Math.PI/4);
    mesh.position.set(1.5,0,0);
    this.creature.add(mesh);
    this.creature.add(new THREE.AxisHelper(5));
  }

  update(elapsedTime, objs, scene){
    'use strict';
    if(this.energy <= 0){
      scene.remove(this.creature);
      var i;
      for(i = 0; i < objs.length; i++){
        if(objs[i] = this){
          objs.splice(i, 1);
          break;
        }
      }
      console.log("im dead");
    }


    var inputs = new Array();
    var i;

    this.velocity[0] = this.absVelocity*Math.cos(this.creature.rotation.z);
    this.velocity[1] = this.absVelocity*Math.sin(this.creature.rotation.z);
    this.creature.position.x += this.velocity[0]*elapsedTime;
    this.creature.position.y += this.velocity[1]*elapsedTime;

    var direction = new THREE.Vector3(this.velocity[0], this.velocity[1], 0);
    direction.normalize();

    for(i = 0; i < objs.length; i++){
      var distance = this.creature.position.distanceTo(objs[i].getObject3D().position);
      if(this != objs[i] && distance < 35){
        var directionOther = new THREE.Vector3();
        directionOther.subVectors( objs[i].getObject3D().position, this.creature.position);
        directionOther.normalize();
        if(directionOther.angleTo(direction) < Math.PI/3 || directionOther.angleTo(direction) > 5*Math.PI/3){
          if(this._eat > 0.5){
            this.energy -= 1;
            if(distance < 5)
              objs[i].eaten(this);
            console.log("eating ");
          }
          else{
            inputs[0] = directionOther.angleTo(direction);
            inputs[1] = distance;
            inputs[2] = objs[i].getObject3D().children[0].material.color.r;
          }
        }
        else{
          inputs[0] = -1;
          inputs[1] = -1;
          inputs[2] = -1;
        }
      }
    }

    /*inputs[0] = Math.sqrt(Math.pow(this.creature.position.x-40, 2) + Math.pow(this.creature.position.y-40, 2));
    inputs[1] = this.creature.position.x-40;
    inputs[2] = this.creature.position.y-40;*/

    this.neuralNetwork.fitness += this.energy/100;

    var outputs = this.neuralNetwork.FeedForward(inputs);
    this.absVelocity = 10000 * outputs[0] * elapsedTime;
    this.creature.rotation.z = outputs[1];
    this._eat = outputs[2];
  }

  getObject3D(){
    'use strict';
    return this.creature;
  }

  eat(energy){
    this.energy += energy;
  }

  eaten(obj){
    obj.eat(5);
    this.energy -= 5;
  }

}
