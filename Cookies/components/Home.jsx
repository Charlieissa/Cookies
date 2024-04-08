import { useEffect, useState } from "react";
import Search from "./Search";
import Sort from "./Sort";
import CoockiesCard from "../components/CookiesCard";
import "../components/NavigationBar";

const Home = () => {
  const [data, setData] = useState([]);
  const [searchInput, setSearchInput] = useState();

  useEffect(() => {
    fetch("http://localhost:3001/")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  }, []);

  const handleSearch = async () => {
    if (!searchInput) return;
    const arrSearchInput = searchInput.trim().split(" ");
    fetch("http://localhost:3001/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ searchArray: arrSearchInput }),
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data.cookies);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleInputChange = (e) => {
    if (!e.target.value) {
      fetch("http://localhost:3001/")
        .then((res) => res.json())
        .then((data) => setData(data))
        .catch((err) => console.log(err));
    }
    setSearchInput(e.target.value);
  };
  return (
    <div>
      <Search
        handleInputChange={handleInputChange}
        handleSearch={handleSearch}
        placeholder="Search for cookie by name or ingredients"
      />
      <Sort data={data} setData={setData} />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {data ? <CoockiesCard props={data} /> : ""}
      </div>
    </div>
  );
};
export default Home;
