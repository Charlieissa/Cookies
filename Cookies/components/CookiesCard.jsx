import { useState } from "react";
import {
  Button,
  Card,
  Space,
  notification,
  Rate,
  Spin,
  Image,
  Popconfirm,
} from "antd";
import { WhatsappShareButton, WhatsappIcon } from "react-share";
import { v4 as uuidv4 } from "uuid";
import "./CookiesCard.css";
const displayNames = {
  name: "Cookie Name",
  baker_name: "Baker Name",
  create_time: "Create Time",
  calories: "Calories",
  preparation_time: "Preparation Time",
  website: "Website",
};
import RecipeModal from "./RecipeModal";

const removeCookie = async (e, d) => {
  try {
    // Make a GET request using the fetch API
    const response = await fetch("http://localhost:3001/removeCookie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(d),
    });
    // Check if the request was successful (status code 200-299)
    if (response.ok) {
      notification.success({
        message: "Success",
        description: "Cookie removed successfully!",
        duration: 3,
      });
      location.reload();
    } else {
      notification.error({
        message: "Error",
        description:
          "There was an error editing the cookie, check with Charlie.",
      });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
function preparationTime(time) {
  if (time > 60) return (time / 60).toFixed(2) + " hours";
  if (time === "0") return "Not available";
  else return time + " minutes";
}
const CookiesCard = (data) => {
  const [modalVisibleRecipe, setModalVisibleRecipe] = useState(false);
  const [modalDataRecipe, setModalDataRecipe] = useState();
  const showModalRecipe = (modalData) => {
    setModalDataRecipe(modalData);
    setModalVisibleRecipe(true);
  };
  const handleModalCancelRecipe = () => {
    setModalVisibleRecipe(false);
  };
  const handleRate = async (e, d) => {
    const data = { rateAmount: e, cookieId: d.cookie_id };
    try {
      // Make a GET request using the fetch API
      const response = await fetch("http://localhost:3001/rateCookie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const msg = await response.json();
      if (msg === "Cookie Rated") {
        notification.success({
          message: "Success",
          description: "Cookie rated successfully!",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const currentUrl = window.location.href;
  return (
    <Space direction="vertical" size={20}>
      <div className="card-container" key={uuidv4()}>
        {data.props.map((d) => (
          <Card title={d.name} className="card-style" key={uuidv4()}>
            <Image
              src={d.image_path}
              placeholder={<Spin size="large" />}
              alt={d.name}
              style={{ width: "100%", height: "200px" }}
            />

            {Object.keys(d)
              .sort()
              .filter((key) => displayNames[key])
              .map((key) => (
                <p key={key}>
                  <strong>{displayNames[key]}: </strong>
                  {key === "create_time"
                    ? new Date(d[key]).toLocaleString()
                    : key === "preparation_time"
                    ? preparationTime(d[key])
                    : d[key]}
                </p>
              ))}

            <Rate
              disabled={
                localStorage.getItem("user") &&
                localStorage.getItem("id") === d.baker_id
                  ? false
                  : true
              }
              defaultValue={d.rate_amount / d.rate_counter}
              onChange={(e) => handleRate(e, d)}
            />
            <span style={{ marginLeft: 20 }}>
              {d.rate_amount ? d.rate_amount + " people rated cookie" : ""}
            </span>
            <Button
              className="recipe-button"
              size="large"
              onClick={() => showModalRecipe(d)}
            >
              Show Recipes
            </Button>
            <WhatsappShareButton
              url={"http://localhost:5173"}
              style={{ marginTop: 10 }}
              title={currentUrl + "\n" + d.name + "\n" + d.ingredients + "\n"}
            >
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
            {localStorage.getItem("user") === "Charlie" ? (
              <Popconfirm
                title="Delete cookie"
                description="Are you sure to delete this cookie?"
                onConfirm={(e) => removeCookie(e, d)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  danger
                  style={{
                    marginTop: 30,
                    backgroundColor: "red",
                    color: "black",
                    marginLeft: 220,
                  }}
                >
                  Remove
                </Button>
              </Popconfirm>
            ) : (
              ""
            )}
          </Card>
        ))}
      </div>
      <RecipeModal
        visible={modalVisibleRecipe}
        onCancel={handleModalCancelRecipe}
        data={modalDataRecipe}
      />
    </Space>
  );
};

export default CookiesCard;
