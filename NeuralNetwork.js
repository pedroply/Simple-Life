

class NeuralNetwork{

  constructor(obj){
    var i;

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

}
