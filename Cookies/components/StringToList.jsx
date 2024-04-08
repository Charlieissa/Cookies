import React from "react";

const StringToList = ({ inputString }) => {
  console.log(inputString);
  // Convert the string to an array of characters
  const words = inputString ? inputString.split("\n") : "";

  return (
    <ul>
      {words ? words.map((word, index) => <li key={index}>{word}</li>) : ""}
    </ul>
  );
};

export default StringToList;
