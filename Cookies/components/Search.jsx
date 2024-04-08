/* eslint-disable react/prop-types */
import { Input, Button } from "antd"; // Import Input and Button from your component library

const Search = ({ handleInputChange, handleSearch, placeholder }) => {
  return (
    <div className="wrapper-div">
      <Input
        type="text"
        className="signup-input"
        style={{ width: "100%" }}
        onChange={handleInputChange}
        placeholder={placeholder}
      />
      <Button
        className="recipe-button"
        onClick={handleSearch}
        style={{ marginLeft: 20, height: 50, width: 200, marginTop: 0 }}
      >
        Search
      </Button>
    </div>
  );
};

export default Search;
