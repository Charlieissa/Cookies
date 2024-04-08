import { useState } from "react";
import { Button } from "antd";
import NavigationBar from "../components/NavigationBar";
import SignUp from "./SignUp";
import SignIn from "./SignIn";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [flagSignIn, setFlagSignIn] = useState(false);
  const [flagSignUp, setFlagSignUp] = useState(false);

  const handleSignIn = () => {
    setFlagSignIn(true);
    setShowSignIn(true);
    setShowSignUp(false);
  };

  const handleSignUp = () => {
    setFlagSignUp(true);
    setShowSignUp(true);
    setShowSignIn(false);
  };

  const handleSignOut = () => {
    localStorage.clear();
    location.reload();
  };

  return (
    <header>
      {localStorage.getItem("user") ? (
        <Button className="sign-out-button" onClick={handleSignOut}>
          Sign Out
        </Button>
      ) : (
        <div>
          <Button className="sign-out-button" onClick={handleSignIn}>
            Sign In
          </Button>
          <Button
            onClick={handleSignUp}
            style={{ backgroundColor: "palegoldenrod" }}
          >
            Sign Up
          </Button>
        </div>
      )}

      <div className="div-content">
        <h1 className="title">&#127850;</h1>
        <NavigationBar />
      </div>
      <SignIn />
      {showSignIn && <SignIn flag={flagSignIn} setFlag={setFlagSignIn} />}
      {showSignUp && <SignUp flag={flagSignUp} setFlag={setFlagSignUp} />}
    </header>
  );
};

export default Header;
