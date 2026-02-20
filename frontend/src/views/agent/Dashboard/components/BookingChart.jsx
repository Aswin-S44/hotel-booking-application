import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardBody, CardHeader } from "react-bootstrap";
import axios from "axios";

const BookingChart = () => {
  const [chartData, setChartData] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]); 

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/v1/shops/stats/graph`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (data.success) {
          setChartData(data.data);
        }
      } catch (error) {
        console.error("Error fetching graph stats", error);
      }
    };
    fetchStats();
  }, []);

  const chartOpts = {
    colors: ["#2163e8"],
    chart: {
      height: 320,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    grid: {
      strokeDashArray: 4,
      position: "back",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
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
    tooltip: {
      x: {
        format: "MM",
      },
    },
  };

  const series = [
    {
      name: "Bookings",
      data: chartData,
    },
  ];

  return (
    <Card className="border h-100">
      <CardHeader className="border-bottom">
        <h5 className="card-header-title">Booking stats</h5>
      </CardHeader>
      <CardBody>
        <ReactApexChart
          className="mt-2"
          type="area"
          height={320}
          options={chartOpts}
          series={series}
        />
      </CardBody>
    </Card>
  );
};

export default BookingChart;
