import React, {useState, useEffect, Fragment} from "react";
import SelectBox from "./SelectBox";
import axios from "axios";

function TrainModel() {
  const [datasets, setDatasets] = useState(['No Datasets']);
  const [selectedDataset, setSelectedDataset] = useState('');
  const [serverResponse, setServerResponse] = useState('');
  const [modelName, setModelName] = useState('');

  useEffect(() => {
    getDatasets();
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

  const generateModel = async () => {
    if (modelName !== "") {
      const data = {
        "dataset":selectedDataset,
        "name":modelName
      };
      const response = await axios({
        method: "post",
        url: "http://localhost:5000/api/generateModel",
        data: data,
      });
      setServerResponse(response.data)
    }
  }

  return (
    <Fragment>
      <section className="datasetpage">
        <div className="row margin-top margin-botom">
          <p>Select a dataset</p>
          <SelectBox options={datasets} changeHandler={setSelectedDataset} />
        </div>
        <div className="row margin-top margin-bottom">
          <input type="text" className="datasetpage__input" placeholder="Enter New Model Name" onChange={(e) => setModelName(e.target.value)} />
          <button className="datasetpage__button" onClick={generateModel}>Create MLP Model</button>
        </div>
      </section>
      {serverResponse !== "" && <div className="datasetpage margin-top"><p className="margin-top margin-bottom">{serverResponse}</p></div>}
    </Fragment>
  );
}

export default TrainModel;
