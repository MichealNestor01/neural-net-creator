import React, {useState, useEffect} from "react";
import SelectBox from "./SelectBox";

import axios from "axios";

import matrix1 from "../static/matrix1.png";

function TestModel() {
  const [models, setModels] = useState(['No Models']);
  const [selectedModel, setSelectedModel] = useState('');
  const [datasets, setDatasets] = useState(['No Datasets']);
  const [selectedDataset, setSelectedDataset] = useState('');
  const [image, setImage] = useState('');
  const [test, setTest] = useState("");
  const [train, setTrain] = useState("");

  useEffect(() => {
    getDatasets();
    getModels();
    setImage(`http://localhost:5000/api/getImage/error.png`)
  }, []);


  const getDatasets = async () => {
    const response = await axios({
      method: "get",
      url: "http://localhost:5000/api/getDatasets"
    });
    if (response.data.length > 0) {
      setDatasets(response.data);
      setSelectedDataset(response.data[0]);
    }
  }

  const getModels = async () => {
    const response = await axios({
      method: "get",
      url: "http://localhost:5000/api/getModels"
    });
    if (response.data.length > 0) {
      setModels(response.data);
      setSelectedModel(response.data[0]);
    }
  }

  const testModel = async () => {
    const data = {
      "model":selectedModel,
      "dataset":selectedDataset
    };
    const response = await axios({
      method: "post",
      url: "http://localhost:5000/api/testModel",
      data: data,
    });
    console.log(response.data)
    setTest(response.data.test)
    setTrain(response.data.train)
    setImage(`http://localhost:5000/api/getImage/confusionmatrix-${selectedModel}-${selectedDataset}.png`)
  }

  return (
    <section className="datasetpage margin-bottom">
      <div className="row margin-top margin-botom">
        <p>Select a dataset</p>
        <SelectBox options={datasets} changeHandler={setSelectedDataset} />
      </div>
      <div className="row margin-top margin-bottom">
        <p>Select a model</p>
        <SelectBox options={models} changeHandler={setSelectedModel} />
      </div>
      <button className="datasetpage__button margin-top" onClick={testModel}>Test Model</button>
      <p className="margin-top">Model accuracy on training set: {train !== "" && `${train.toString().substring(0, 5)}%`}</p>
      <p className="margin-bottom">Model accuracy on test set: {test !== "" && `${test.toString().substring(0, 5)}%`}</p>
      <p className="margin-bottom margin-top">Confusion Matrix:</p>
      <img src={image} className="datasetpage__image"/>
    </section>
  );
}

export default TestModel;
