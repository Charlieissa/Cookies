import { useEffect, useState } from "react";
import { Button, Modal, Input, notification } from "antd";
const { TextArea } = Input;
import StringToList from "./StringToList";
import "./CookiesCard.css";
import PropTypes from "prop-types";
const RecipeModal = ({ visible, onCancel, data }) => {
  const [editableIngredients, setEditableIngredients] = useState();
  const [editableDirections, setEditableDirections] = useState();
  const resetDefault = () => {
    setEditableIngredients(data.ingredients);
    setEditableDirections(data.directions);
  };
  RecipeModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    data: PropTypes.shape({
      ingredients: PropTypes.string.isRequired,
      directions: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      baker_id: PropTypes.number.isRequired,
    }),
  };
  const handleSave = async (e, d) => {
    d.ingredients = editableIngredients;
    d.directions = editableDirections;
    try {
      // Make a GET request using the fetch API
      const response = await fetch("http://localhost:3001/editCookie", {
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
          description: "Cookie edited successfully!",
        });
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

  useEffect(() => {
    if (data ? editableIngredients !== data.ingredients : false) {
      setEditableDirections(data ? data.directions : "");
      setEditableIngredients(data ? data.ingredients : "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div>
      <Modal
        open={visible}
        title={
          <div className="custom-modal-title">
            {data ? data.name + " recipe" : ""}
          </div>
        }
        onCancel={onCancel}
        footer={
          data ? (
            localStorage.getItem("id") == data.baker_id ? (
              <>
                <Button key="cancel" onClick={onCancel}>
                  Cancel
                </Button>
                <Button
                  key="save"
                  onClick={(e) => handleSave(e, data)}
                  disabled={
                    data
                      ? data.ingredients === editableIngredients
                        ? data.directions === editableDirections
                        : ""
                      : ""
                  }
                >
                  Save
                </Button>
                <Button key="default" onClick={resetDefault}>
                  Reset to default
                </Button>
              </>
            ) : null
          ) : null
        }
      >
        <div>
          {data ? (
            localStorage.getItem("id") == data.baker_id ? (
              <div>
                <h4>Ingredients:</h4>
                <TextArea
                  autoSize="true"
                  value={editableIngredients}
                  onChange={(e) => setEditableIngredients(e.target.value)}
                />
                <h4>Steps:</h4>
                <TextArea
                  autoSize="true"
                  value={editableDirections}
                  onChange={(e) => setEditableDirections(e.target.value)}
                />
              </div>
            ) : (
              <div>
                <h4>Ingredients:</h4>
                <StringToList inputString={editableIngredients} />
                <h4>Steps:</h4>
                <StringToList inputString={editableDirections} />
              </div>
            )
          ) : (
            ""
          )}
        </div>
      </Modal>
    </div>
  );
};
export default RecipeModal;
