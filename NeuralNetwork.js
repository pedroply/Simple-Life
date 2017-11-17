

class NeuralNetwork{

  constructor(obj){
    var i;

    this.fitness = 0;

    if(obj instanceof NeuralNetwork){
      var layers = obj;
      for(i = 0; i < layers.length; i++){
        this.layers[i] = layers[i];
      }

      this.InitNeurons();
      this.InitWeights();
    }
    else{
      var copyNetwork = obj;
      for(i = 0; i < copyNetwork.layers.length; i++){
        this.layers[i] = copyNetwork.layers[i];
      }

      this.InitNeurons();
      this.InitWeights();
      this.CopyWeights(copyNetwork.weights);
    }
  }

  CopyWeights(copyWeights){
    var i, j, k;
    for(i = 0; i < this.weights.length; i++){
      for(j = 0; j < this.weights[i].length; j++){
        for(k = 0; k < this.weights[i][j].length; k++){
          this.weights[i][j][k] = copyWeights[i][j][k];
        }
      }
    }
  }

  InitNeurons(){
    var i;
    for(i = 0; i < this.layers.Length; i++){
      this.neurons[this.neuronsList.length] = [this.layers[i]]
    }
  }

  InitWeights(){
    var i, j, k;

    for(i = 1; i < this.layers.length; i++){
      var layerWeightsList = [];
      var neuronsInPreviousLayer = this.layers[i-1];

      for(j = 0; j < this.neurons[i].length; j++){

        var neuronWeights;

        for(k = 0; k < neuronsInPreviousLayer; k++){
          neuronWeights[k] = Math.random()-0.5;
        }

        layerWeightsList[layerWeightsList.length] = neuronWeights;

      }

      this.weights[this.weights.length] = layerWeightsList;

    }
  }

  FeedForward(inputs){
    var i, j, k;

    for(i = 0; i < inputs.length; i++){
      this.neurons[0][i] = inputs[i];
    }

    for(i = 1; i < layers.length; i++){
      for(j = 0; j < this.neurons[i].length; j++){
        var value = 0;

        for(k = 0; k < this.neurons[i-1].length; k++){
          value += this.weights[i-1][j][k] * neurons[i-1][k];
        }

        this.neurons[i][j] = Math.Tanh(value);

      }
    }

    return this.neurons[neurons.length-1];

  }

  Mutate(){
    var i, j, k;

    for(i = 0; i < this.weights.length; i++){
      for(j = 0; j < this.weights[i].length; j++){
        for(k = 0; k < this.weights[i][j].length; k++){
          var random = Math.random()*100;

          if(random <= 2){
            this.weights[i][j][k] *= -1;
          }
          else if(random <= 4){
            this.weights[i][j][k] = Math.random()-0.5;
          }
          else if(random <= 6){
            this.weights[i][j][k] *= Math.random()+1;
          }
          else if(random <= 8){
            this.weights[i][j][k] *= Math.random();
          }
        }
      }
    }
  }

  CompareTo(obj){
    if(obj instanceof NeuralNetwork){
      if(this.fitness > obj.fitness){
        return 1;
      }
      else if(this.fitness < obj.fitness){
        return -1;
      }
      else{
        return 0;
      }
    }
    return 1;
  }

}
