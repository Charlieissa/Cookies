/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button } from "antd";
import "../components/NavigationBar";

const Sort = ({ data, setData }) => {
  const [rateFlag, setRateFlag] = useState(true);
  const [dateFlag, setDateFlag] = useState(true);

  const sortByRate = () => {
    const sorted = [...data].sort((a, b) => {
      const rateA = a.rate_counter ? a.rate_amount / a.rate_counter : 0;
      const rateB = b.rate_counter ? b.rate_amount / b.rate_counter : 0;
      if (rateFlag) return rateB - rateA;
      else return rateA - rateB;
    });
    setRateFlag(!rateFlag);
    setData(sorted);
  };

  const sortByDate = () => {
    const sorted = [...data].sort((a, b) => {
      const timeA = new Date(a.create_time).getTime();
      const timeB = new Date(b.create_time).getTime();
      if (dateFlag) return timeB - timeA;
      else return timeA - timeB;
    });
    setDateFlag(!dateFlag);
    setData(sorted);
  };
  return (
    <div>
      <Button style={{ marginLeft: 50 }} onClick={sortByRate}>
        Sort by rate
      </Button>
      <Button style={{ marginLeft: 10 }} onClick={sortByDate}>
        Sort by date
      </Button>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      ></div>
    </div>
  );
};
export default Sort;
