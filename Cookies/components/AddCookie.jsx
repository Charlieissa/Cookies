import { Button, Form, Input, Upload, notification } from "antd";
import { format } from "date-fns";
import "./AddCookie.css";
const AddCookie = () => {
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const onFinish = async (e) => {
    e.preventDefault;
    const formattedTimestamp = format(new Date(), "yyyy-MM-dd HH:mm:ss");

    const data = {
      cookieName: e.cookieName,
      ingredients: e.ingredients,
      steps: e.steps,
      prep: e.prepTime,
      bakeTime: e.bakeTime,
      calories: e.calories,
      createDate: formattedTimestamp,
      baker_id: localStorage.getItem("id"),
      website: e.website ? e.website : " ",
    };
    try {
      // Make a GET request using the fetch API
      const response = await fetch("http://localhost:3001/addCookie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

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
  return (
    <div className="main-content">
      <Form
        className="form-container"
        name="Cookies"
        labelCol={{
          span: 9,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="upload"
          label="Upload"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            name="picture"
            action="http://localhost:3001/savepic"
            listType="picture"
          >
            <Button>Add cookie pic</Button>
          </Upload>
        </Form.Item>
        <Form.Item label="Cookie name:" name="cookieName">
          <Input />
        </Form.Item>

        <Form.Item label="Ingredients:" name="ingredients">
          <Input.TextArea />
        </Form.Item>

        <Form.Item label="Steps:" name="steps">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Preparation time:" name="prepTime">
          <Input />
        </Form.Item>
        <Form.Item label="Bake time:" name="bakeTime">
          <Input />
        </Form.Item>
        <Form.Item label="Calories:" name="calories">
          <Input />
        </Form.Item>
        <Form.Item label="Website:" name="website">
          <Input />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 15,
            span: 6,
          }}
        >
          <Button className="addButton" type="primary" htmlType="submit">
            Add Cookie &#127850;
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddCookie;
