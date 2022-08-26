import "./App.css";
import React, { Fragment, useState, useRef, useEffect } from "react";
import axios from "axios";

import SelectBox from "./components/SelectBox";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const [models, setModels] = useState(['No Models']);
  const [selectedModel, setSelectedModel] = useState('');
  const [serverData, setServerData] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const hiddenFileInput = useRef(null);

  useEffect(() => {
    getModels();
  }, []);

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


  const handleClick = (e) => {
    e.preventDefault();
    hiddenFileInput.current.click();
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    for (let index = 0; index < selectedFiles.length; ++index) {
      formData.append(selectedFiles[index].name, selectedFiles[index]);
    }
    formData.append("MODEL_NAME", selectedModel);
    const response = await axios({
      method: "post",
      url: "http://localhost:5000/api/getlang",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
    ///const responseData = await response.json();
    console.log(response.data);
    setServerData(response.data);
    setLoading(false);
  };

  const fileSelectHandler = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const language_classification_divs = [];
  if (serverData.length !== 0 && loading === false) {
    language_classification_divs.push(
      <p className="language margin-bottom" key="lang">
        Languages Detected:
      </p>
    );
    [...selectedFiles].forEach((item) => {
      let filename = item.name;
      language_classification_divs.push(
        <Fragment>
          <p className="language " key={filename}>{`"${filename}": ${serverData[filename]}`}</p>
          <p className="language margin-bottom" key={`${filename}-weights`}>
            {`Confidence: 
            English: ${Math.round(serverData[`${filename}-eng`] * 100)}%
            Spanish: ${Math.round(serverData[`${filename}-spa`] * 100)}%
            German: ${Math.round(serverData[`${filename}-ger`] * 100)}%
            `}
          </p>
        </Fragment>
      );
    });
  }

  return (
    <div className="wrapper">
      <h1 className="title">Language Detector</h1>
      <form onSubmit={(e) => submitHandler(e)} className="form">
        <div className="row">
          <p>Select a model</p>
          <SelectBox options={models} changeHandler={setSelectedModel} />
        </div>
        <input
          ref={hiddenFileInput}
          className="form__input"
          type="file"
          name="file"
          onChange={fileSelectHandler}
          multiple="multiple"
        />
        <button className="form__button" onClick={handleClick}>
          Upload Audio
        </button>
        {selectedFiles.length !== 0 && (
          <Fragment>
            <p key="1" className="filename">{`Files uploaded:`}</p>
            {[...selectedFiles].map((item, index) => {
              return (
                <p className="filename" key={index}>
                  "{item.name}"
                </p>
              );
            })}
            <button key="2" type="submit" className="form__button">
              Detect Languages
            </button>
          </Fragment>
        )}
      </form>
      {loading && <LoadingSpinner />}
      {serverData.length !== 0 && loading === false && (
        <div className="languages__wrapper">{language_classification_divs}</div>
      )}
    </div>
  );
}

export default App;

//{serverData.map((language, index) => {
//  return <p className="language" key={index}>{`${language}: ${language}`}</p>;
//})}
