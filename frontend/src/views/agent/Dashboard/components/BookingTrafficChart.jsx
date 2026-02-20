import { getColor } from "@/utils";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardBody, CardHeader } from "react-bootstrap";
import { FaCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
const BookingTrafficChart = ({ shopID }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchTraffic = async () => {
      const res = await axios.get(
        `http://localhost:5000/api/v1/shops/traffic/${shopID}`
      );
      setData(res.data);
    };

    fetchTraffic();
  }, [shopID]);

  const series = data.map((item) => item.percentage);

  const labels = data.map((item) => {
    if (item.name === "organic") return "Organic";
    if (item.name === "google") return "Google";
    if (item.name === "social_media") return "Social media";
    if (item.name === "referral") return "Referral program";
    return item.name;
  });

  const chartOpts = {
    series: series,
    labels: labels,
    chart: {
      height: 200,
      width: 200,
      type: "donut",
      sparkline: {
        enabled: true,
      },
    },
    colors: [
      getColor("--bs-primary"),
      getColor("--bs-success"),
      getColor("--bs-warning"),
      getColor("--bs-danger"),
    ],
    tooltip: {
      theme: "dark",
    },
    legend: {
      show: false,
    },
  };

  // const chartOpts = {
  //   series: [70, 15, 10, 5],
  //   labels: ['Organic', 'Google', 'Social media', 'Referral'],
  //   chart: {
  //     height: 200,
  //     width: 200,
  //     offsetX: 0,
  //     type: 'donut',
  //     sparkline: {
  //       enabled: true
  //     }
  //   },
  //   colors: [getColor('--bs-primary'), getColor('--bs-success'), getColor('--bs-warning'), getColor('--bs-danger')],
  //   tooltip: {
  //     theme: 'dark'
  //   },
  //   responsive: [{
  //     breakpoint: 480,
  //     options: {
  //       chart: {
  //         width: 200,
  //         height: 200
  //       },
  //       legend: {
  //         position: 'bottom'
  //       }
  //     }
  //   }]
  // };
  return (
    <Card className="border h-100">
      <CardHeader className="border-bottom d-flex justify-content-between align-items-center">
        <h5 className="card-header-title">Booking Traffic</h5>
        <Link to="" className="btn btn-link p-0 mb-0">
          View all
        </Link>
      </CardHeader>
      <CardBody className="p-3">
        <div className="d-flex justify-content-center">
          {/* <ReactApexChart className="mt-2" type="donut" width={200} height={200} options={chartOpts} series={chartOpts.series} /> */}
          <ReactApexChart
            type="donut"
            width={200}
            height={200}
            options={chartOpts}
            series={series}
          />

          <div
            className="d-flex justify-content-center"
            id="ChartTrafficViews"
          />
        </div>
        <ul className="list-group list-group-borderless align-items-center mt-3">
          <li className="list-group-item">
            <FaCircle className="text-primary me-2" />
            Organic
          </li>
          <li className="list-group-item">
            <FaCircle className="text-success me-2" />
            Google
          </li>
          <li className="list-group-item">
            <FaCircle className="text-warning me-2" />
            Social media
          </li>
          <li className="list-group-item">
            <FaCircle className="text-danger me-2" />
            Referral program
          </li>
        </ul>
      </CardBody>
    </Card>
  );
};
export default BookingTrafficChart;
