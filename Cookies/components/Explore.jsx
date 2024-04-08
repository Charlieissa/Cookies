/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import axios from "axios";
import { Button, Input, Card, Image, notification, Spin, Modal } from "antd";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import "./Explore.css";
const Explore = () => {
  const [searchRecipe, setSearchRecipe] = useState();
  const [dataRecipe, setDataRecipe] = useState();
  const [modalVisibleRecipe, setModalVisibleRecipe] = useState(false);
  const [modalDataRecipe, setModalDataRecipe] = useState();

  const showModalRecipe = (modalData) => {
    setModalDataRecipe(modalData);
    setModalVisibleRecipe(true);
  };
  const handleModalCancelRecipe = () => {
    setModalVisibleRecipe(false);
  };
  const searchRecipes = async (query) => {
    const response = await axios.get("https://api.edamam.com/search", {
      params: {
        q: query,

        app_id: "d449fa21",

        app_key: "f7fe2bfad855ae8f36da67e426310a5d",

        from: 0,

        to: 50,
      },
    });

    setDataRecipe(response.data.hits);
  };
  const handleInputChange = (e) => {
    setSearchRecipe(e.target.value);
  };
  const handleSearch = () => {
    containerRef.current.scrollLeft = -4000;
    searchRecipes(searchRecipe);
  };

  const addCookie = async (e, d) => {
    e.preventDefault;
    if (!localStorage.getItem("id")) {
      notification.error({
        message: "Error",
        description: "Only users can add Cookie, sign in to continue",
      });
      return;
    }
    const recipeIngredient = d.recipe.ingredientLines.join("\n");
    const recipeInstruction = d.recipe.instructionLines
      ? d.recipe.instructionLines.join("\n")
      : "";
    const formattedTimestamp = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const data = {
      cookieName: d.recipe.label,
      ingredients: recipeIngredient,
      steps: recipeInstruction,
      prep: d.recipe.totalTime,
      image: d.recipe.image,
      bakeTime: 0,
      calories: d.recipe.calories.toFixed(2),
      createDate: formattedTimestamp,
      baker_id: localStorage.getItem("id"),
      website: d.recipe.url,
    };
    try {
      // Make a GET request using the fetch API
      const response = await fetch(
        "http://localhost:3001/addCookieFromWebsite",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      // Check if the request was successful (status code 200-299)
      if (response.ok) {
        const data = await response.json();
        console.log("Data fetched:", data);
        notification.success({
          message: "Success",
          description: "Cookie added successfully",
        });
      } else {
        console.error("Failed to fetch data. Status:", response.status);
        notification.error({
          message: "Error",
          description: "Something went wrong, try again later!",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      notification.error({
        message: "Error",
        description: "Something went wrong, try again later!",
      });
    }
  };
  const containerRef = useRef(null);
  const RecipeModal = ({ visible, onCancel, data }) => {
    return (
      <div>
        {data ? (
          <Modal
            open={visible}
            title={
              <div className="custom-modal-title">
                {data ? data.recipe.label + " recipe" : ""}
              </div>
            }
            onCancel={onCancel}
          >
            <div>
              <div style={{ marginBottom: "10px" }}>
                <strong>Ingredients:</strong>
                <ul>
                  {data.recipe.ingredientLines.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>{" "}
              <div style={{ marginBottom: "10px" }}>
                <strong>Instructions:</strong>
                <ul>
                  {data.recipe.instructionLines
                    ? data.recipe.instructionLines.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))
                    : ""}
                </ul>
              </div>
            </div>
          </Modal>
        ) : (
          ""
        )}
      </div>
    );
  };
  function preparationTime(time) {
    if (time >= 60) return (time / 60).toFixed(2) + " hours";
    if (time === 0) return "Not available";
    else return time + " minutes";
  }
  const handleScroll = (scrollOffset) => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += scrollOffset;
    }
  };
  return (
    <div>
      <div className="wrapper-div">
        <Input
          type="text"
          className="signup-input"
          style={{ width: "100%" }}
          onChange={handleInputChange}
          placeholder="Explore new cookie, example search for: Caramel cookie  "
        />
        <Button
          className="recipe-button"
          onClick={handleSearch}
          style={{ marginLeft: 20, height: 50, width: 200, marginTop: 0 }}
        >
          Search
        </Button>
      </div>
      <div className="card-album" ref={containerRef}>
        {dataRecipe ? (
          <div>
            <Button className="scroll-button" onClick={() => handleScroll(400)}>
              <RightOutlined />
            </Button>
            <Button
              className="scroll-button"
              style={{ left: 0 }}
              onClick={() => handleScroll(-400)}
            >
              <LeftOutlined />
            </Button>{" "}
          </div>
        ) : (
          ""
        )}
        {dataRecipe
          ? dataRecipe.map((d) => (
              <Card
                title={d.recipe.label}
                // className="card-style"
                className="card-style floating-card"
                style={{ marginRight: 40, marginLeft: 50, height: "100%" }}
                key={uuidv4()}
              >
                <Image
                  src={d.recipe.image}
                  placeholder={<Spin size="large" />}
                  alt={d.recipe.name}
                  style={{ width: "100%", height: "auto", maxHeight: "400px" }}
                />
                <div style={{ fontSize: 18 }}>
                  <h2>{d.recipe.label}</h2>
                  <div style={{ marginBottom: "10px" }}>
                    <strong>Source:</strong> {d.recipe.source}
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <strong>Total Time:</strong>{" "}
                    {preparationTime(d.recipe.totalTime)}
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <strong>Calories:</strong> {d.recipe.calories.toFixed(2)}
                  </div>

                  <div style={{ marginBottom: "10px" }}>
                    <strong>Website:</strong>{" "}
                    <a
                      href={d.recipe.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {d.recipe.url}
                    </a>
                  </div>
                </div>
                <Button
                  onClick={() => showModalRecipe(d)}
                  style={{ marginRight: 20 }}
                >
                  Show recipe
                </Button>
                <Button onClick={(e) => addCookie(e, d)}>Add to website</Button>
                <RecipeModal
                  visible={modalVisibleRecipe}
                  onCancel={handleModalCancelRecipe}
                  data={modalDataRecipe}
                />
              </Card>
            ))
          : ""}
      </div>
    </div>
  );
};

export default Explore;
