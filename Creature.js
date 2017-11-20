

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
    this.ate = 0;
    this.bite = 0;
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
        if(objs[i] == this){
          objs.splice(i, 1);
          break;
        }
      }
      console.log("im dead");
    }
    else{

      var inputs = new Array();
      var i;

      this.velocity[0] = this.absVelocity*Math.cos(this.creature.rotation.z);
      this.velocity[1] = this.absVelocity*Math.sin(this.creature.rotation.z);
      this.creature.position.x += this.velocity[0]*elapsedTime;
      this.creature.position.y += this.velocity[1]*elapsedTime;

      if(this._eat > 0.5){
        //this.energy -= 1;
        this.bite += 1;
      }

      var direction = new THREE.Vector3(this.velocity[0], this.velocity[1], 0);
      direction.normalize();

      for(i = 0; i < objs.length; i++){
        var distance = this.creature.position.distanceTo(objs[i].getObject3D().position);
        if(this != objs[i] && distance < 35){
          var directionOther = new THREE.Vector3();
          directionOther.subVectors( objs[i].getObject3D().position, this.creature.position);
          directionOther.normalize();
          if(directionOther.angleTo(direction) < Math.PI/3 || directionOther.angleTo(direction) > 5*Math.PI/3){
            if(this._eat > 0.5 && distance < 5 && objs[i] instanceof Food){
                objs[i].eaten(this);
                this.ate += 1;
            }
            else{ //alterar para o mais proximo ou meter break
              inputs[0] = directionOther.angleTo(direction);
              inputs[1] = distance;
              inputs[2] = objs[i].getObject3D().children[0].material.color.r;
              break;
            }
          }
          else{
            inputs[0] = -1;
            inputs[1] = -1;
            inputs[2] = -1;
          }
        }
      }

      this.neuralNetwork.fitness = (this.ate*100000+1)/(this.bite+1) + this.bite;

      var outputs = this.neuralNetwork.FeedForward(inputs);
      this.absVelocity = 10000 * outputs[0] * elapsedTime;
      this.creature.rotation.z = outputs[1];
      this._eat = outputs[2];
    }
  }

  getObject3D(){
    'use strict';
    return this.creature;
  }

  eat(energy){
    this.energy += energy;
  }

  eaten(obj){
    /*obj.eat(5);
    this.energy -= 5;*/
  }

}
