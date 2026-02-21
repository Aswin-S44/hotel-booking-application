import { currency } from "@/states";
import ReactApexChart from "react-apexcharts";
import { Card, Col, Row } from "react-bootstrap";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../config/env";

const EarningChart = ({ selectedDate }) => {
  const [earningData, setEarningData] = useState({
    earningsCurrentMonth: 0,
    earningsLastMonth: 0,
  });

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/shops/earning-statuses?date=${selectedDate}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data) setEarningData(response.data);
      } catch (error) {
        console.error("Error fetching chart earnings", error);
      }
    };
    fetchEarnings();
  }, [selectedDate]); // Dependency added here

  // Logic to determine which month index to highlight in the chart
  const monthIndex = parseInt(selectedDate.split("-")[1]) - 1;
  const chartData = new Array(12).fill(0);
  chartData[monthIndex] = earningData.earningsCurrentMonth;

  const calculateDiff = () => {
    const current = earningData.earningsCurrentMonth;
    const last = earningData.earningsLastMonth;
    if (last === 0) return current > 0 ? 100 : 0;
    return (((current - last) / last) * 100).toFixed(2);
  };

  const percentageDiff = calculateDiff();
  const isGrowth = percentageDiff >= 0;

  const chartOpts = {
    colors: ["#2163e8"],
    series: [
      {
        name: "Earnings",
        data: [
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          earningData.earningsCurrentMonth,
        ],
      },
    ],
    chart: {
      height: 320,
      type: "area",
      toolbar: { show: false },
    },
    grid: {
      strokeDashArray: 4,
      position: "back",
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" },
    legend: {
      show: true,
      horizontalAlign: "right",
      position: "top",
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
  };

  return (
    <Card className="card-body border overflow-hidden">
      <Row className="g-4">
        <Col sm={6} md={4}>
          <span className="badge text-bg-dark">Current Month</span>
          <h4 className="text-primary my-2">
            {currency}
            {earningData.earningsCurrentMonth.toLocaleString()}
          </h4>
          <p className="mb-0 items-center">
            <span
              className={`me-1 items-center ${
                isGrowth ? "text-success" : "text-danger"
              }`}
            >
              {Math.abs(percentageDiff)}%
              {isGrowth ? <BsArrowUp /> : <BsArrowDown />}
            </span>
            vs last month
          </p>
        </Col>
        <Col sm={6} md={4}>
          <span className="badge text-bg-dark">Last Month</span>
          <h4 className="my-2">
            {currency}
            {earningData.earningsLastMonth.toLocaleString()}
          </h4>
          <p className="mb-0 items-center">Performance of previous month</p>
        </Col>
      </Row>
      <ReactApexChart
        height={320}
        type="area"
        options={chartOpts}
        series={chartOpts.series}
      />
    </Card>
  );
};

export default EarningChart;
