import { useEffect, useState } from "react";
import CookiesCard from "./CookiesCard";
import Search from "./Search";
import Sort from "./Sort";
const ManageCookies = () => {
  const [userCookies, setUserCookies] = useState();
  const [searchTerm, setSearchTerm] = useState("");

  const userId = localStorage.getItem("id");

  useEffect(() => {
    fetch(`http://localhost:3001/manageCookies?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setUserCookies(data))
      .catch((err) => console.log(err));
  }, [userId]);
  const handleInputChange = (e) => {
    if (!e.target.value) {
      fetch("http://localhost:3001/")
        .then((res) => res.json())
        .then((data) => setUserCookies(data))
        .catch((err) => console.log(err));
    }
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    const results = userCookies.filter((cookie) =>
      cookie.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setUserCookies(results);
  };

  return (
    <div>
      <Search
        handleInputChange={handleInputChange}
        handleSearch={handleSearch}
        placeholder="Search for cookie by name"
      />
      <Sort data={userCookies} setData={setUserCookies} />

      {userCookies ? <CookiesCard props={userCookies} /> : <div></div>}
    </div>
  );
};

export default ManageCookies;
