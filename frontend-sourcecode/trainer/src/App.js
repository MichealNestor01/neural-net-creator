import "./App.css";
import React, { Fragment } from "react";
import { useState, useRef } from "react";
import axios from "axios";

import TestModel from "./components/TestModel";
import TrainModel from "./components/TrainModel";
import UploadDataset from "./components/UploadDataset";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const [selectedMode, setSelectedMode] = useState("none");

  return (
    <div className="wrapper">
      <h1 className="title">Language Model Trainer</h1>
      <section className="selector">
        <p>Select a mode</p>
        <div className="row">
          <button
            className={selectedMode === "upload" ? "selector__button underline" : "selector__button"}
            onClick={() => setSelectedMode("upload")}
          >
            Dataset Setup
          </button>
          <button
            className={selectedMode === "train" ? "selector__button underline" : "selector__button"}
            onClick={() => setSelectedMode("train")}
          >
            Create a model
          </button>
          <button
            className={selectedMode === "test" ? "selector__button underline" : "selector__button"}
            onClick={() => setSelectedMode("test")}
          >
            Test a model
          </button>
        </div>
      </section>
      {selectedMode === "upload" && <UploadDataset />}
      {selectedMode === "test" && <TestModel />}
      {selectedMode === "train" && <TrainModel />}
    </div>
  );
}

export default App;
