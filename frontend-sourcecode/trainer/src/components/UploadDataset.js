import React, { Fragment, useState, useRef, useEffect } from "react";
import SelectBox from "./SelectBox";
import axios from "axios";

function UploadDataset() {
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState("");
  const [serverResponse, setServerResponse] = useState("");

  useEffect(() => {
    getDatasets();
  }, []);

  const getDatasets = async () => {
    const response = await axios({
      method: "get",
      url: "http://localhost:5000/api/getDatasets"
    });
    setDatasets(response.data);
    if (response.data.length > 0) {
      setSelectedDataset(response.data[0]);
    }
  }

  const generateFeatures = async () => {
    const data = {"dataset":selectedDataset};
    const response = await axios({
      method: "post",
      url: "http://localhost:5000/api/generateFeatures",
      data: data,
    });
    setServerResponse(response.data)
  }

  return (
    <Fragment>
      <div className="datasetpage">
        <button className="datasetpage__button margin-top" onClick={getDatasets}>
          Scan for datasets
        </button>
        {datasets.length > 0 &&
          <Fragment>
            <div className="row margin-top">
              <p>Select a dataset</p>
              <SelectBox options={datasets} changeHandler={setSelectedDataset} />
            </div>
            <button className="datasetpage__button margin-top" onClick={generateFeatures}>
              Generate Features
            </button>
          </Fragment>
        }
      </div>
      {serverResponse !== "" && <div className="datasetpage margin-top"><p className="margin-top margin-bottom">{serverResponse}</p></div>}
    </Fragment>
  );
}

export default UploadDataset;