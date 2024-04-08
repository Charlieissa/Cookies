import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddCookie from "../components/AddCookie";
import "./App.css";
import Explore from "../components/Explore";
import Header from "../components/Header";
import Home from "../components/Home";
import ManageCookies from "../components/ManageCookies";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-cookie" element={<AddCookie />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/manage-cookie" element={<ManageCookies />} />
      </Routes>
    </Router>
  );
};

export default App;
