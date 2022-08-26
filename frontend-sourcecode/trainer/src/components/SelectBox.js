import React from "react";
// hooks
import { useState } from "react";

// this is a simple select box component
const SelectBox = ({ options, changeHandler, screenWidth }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [current, setCurrent] = useState(0);

  let suffix = "__desktop";
  if (screenWidth < 1250) {
    suffix = "__mobile";
  }

  // get the current option
  const selectedOption = options[current];

  // showBoxHandler toggles show options
  const showBoxHandler = () => {
    setShowOptions(!showOptions);
  };

  // setup the classes
  let selectionClasses = `selectBox__selections selectBox__selections${suffix}`;
  let arrowClasses = `selectBox__arrow selectBox__arrow${suffix}`;
  let optionClasses = `selectBox__option selectBox__option${suffix}`;

  // if the toggle is on edit the classes
  if (showOptions) {
    selectionClasses = `selectBox__selections selectBox__selections${suffix} selectBox__selections__visible`;
    arrowClasses = `selectBox__arrow selectBox__arrow${suffix} selectBox__arrow__rotate`;
    optionClasses = `selectBox__option selectBox__option${suffix} selectBox__option__visible`;
  }

  // map the options to divs
  let selectOptions = options.map((option, index) => {
    return (
      <p
        key={index}
        id={index}
        className={optionClasses}
        onClick={(e) => {
          setCurrent(e.target.id);
          showBoxHandler();
          changeHandler(option);
        }}
      >
        {option}
      </p>
    );
  });

  // return the select box component
  return (
    <div className={`selectBox__wrapper selectBox__wrapper${suffix}`}>
      <section className="selectBox__container" onClick={showBoxHandler}>
        <p className="selectBox__text">{selectedOption}</p>
        <div className={arrowClasses}>{"<"}</div>
      </section>
      <div className={selectionClasses}>{selectOptions}</div>
    </div>
  );
};

export default SelectBox;
