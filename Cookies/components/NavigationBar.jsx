import { Link } from "react-router-dom";
import { notification } from "antd";
import "./NavigationBar.css";
const handleNoUser = () => {
  notification.error({
    message: "Error",
    description: "Only users can add Cookie, sign in to continue",
  });
};
const HandleAddCookie = () => {
  if (localStorage.getItem("user")) {
    return (
      <>
        <li className="nav-item">
          <Link to="/add-cookie" className="nav-links">
            Add Cookie
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/manage-cookie" className="nav-links">
            My Cookies
          </Link>
        </li>
      </>
    );
  } else {
    return (
      <>
        <li className="nav-item">
          <Link className="nav-links" onClick={handleNoUser}>
            Add Cookie
          </Link>
        </li>
      </>
    );
  }
};

const NavigationBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container"></div>
      <ul className={`nav-menu`}>
        <li className="nav-item">
          <Link to="/" className="nav-links">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/explore" className="nav-links">
            Explore
          </Link>
        </li>
        <HandleAddCookie />
      </ul>
    </nav>
  );
};

export default NavigationBar;
