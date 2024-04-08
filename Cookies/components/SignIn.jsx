import { useState } from "react";
import { Modal, notification } from "antd";

const SignIn = (flag) => {
  const [isModalSignInOpen, setIsModalSignInOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { username, password } = formData;
  if (!isModalSignInOpen & flag.flag) {
    setIsModalSignInOpen(true);
  }
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSignInOk = async () => {
    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const msg = await response.json();
      console.log(msg.msg);
      if (msg.msg === "Login successful") {
        localStorage.setItem("user", username);
        localStorage.setItem("id", msg.id);
        notification.success({
          message: "Success",
          description: "User login successfully!",
          duration: 3,
        });
        location.reload();
        handleSignInCancel();
      }
      if (msg === "Incorrect password") {
        notification.error({
          message: "Error",
          description: "Incorrect password !",
          duration: 3,
        });
      }
      if (msg === "User not found") {
        notification.error({
          message: "Error",
          description: "User not found !",
          duration: 3,
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Something went wrong, try again!",
        duration: 3,
      });
    }
  };
  const handleSignInCancel = () => {
    flag.setFlag(false);
    setIsModalSignInOpen(false);
  };
  return (
    <Modal
      className="cool-modal"
      title={<div className="custom-modal-title">Sign In</div>}
      open={isModalSignInOpen}
      onOk={handleSignInOk}
      onCancel={handleSignInCancel}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <input
          className="signup-input"
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={handleChange}
        />
        <input
          className="signup-input"
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handleChange}
        />
      </div>
    </Modal>
  );
};
export default SignIn;
