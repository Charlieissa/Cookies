import { useState } from "react";
import { Modal, notification } from "antd";

const SignUp = (flag) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { username, email, password } = formData;
  const showModal = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
    });
    setIsModalOpen(true);
  };
  if (!isModalOpen & flag.flag) {
    showModal(true);
  }
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleCancel = () => {
    flag.setFlag(false);
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    try {
      const response = await fetch("http://localhost:3001/addUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      const msg = await response.json();
      if (msg === "User inserted successfully") {
        notification.success({
          message: "Success",
          description: "User added successfully!",
          duration: 3,
        });
        flag.setFlag(false);
      }
      if (msg === "Username or email already exists") {
        notification.error({
          message: "Error",
          description: "Email/ Username already exist!",
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
  return (
    <Modal
      title={<div className="custom-modal-title">Sign Up</div>}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div
        style={{ display: "flex", flexDirection: "column", padding: 10 }}
        className="cool-modal"
      >
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
          type="email"
          name="email"
          placeholder="Email"
          value={email}
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
export default SignUp;
