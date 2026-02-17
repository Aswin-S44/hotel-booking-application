import {
  Card,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Image,
  OverlayTrigger,
  Popover,
  PopoverBody,
  Row,
} from "react-bootstrap";
import {
  BsArrowBarDown,
  BsCalculator,
  BsCreditCard,
  BsCreditCard2FrontFill,
  BsInfoCircleFill,
} from "react-icons/bs";
import { Link } from "react-router-dom";
import { currency } from "@/states";
import visa from "@/assets/images/element/visa.svg";
import { useEffect, useState } from "react";
import axios from "axios";

const EarningStatistics = () => {
  const [loading, setLoading] = useState(false);
  const [earningStatus, setEarningStatus] = useState({
    salesThisMonth: 0,
    earningsCurrentMonth: 0,
    earningsLastMonth: 0,
  });

  useEffect(() => {
    const fetchEarningStatus = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/v1/shops/earning-statuses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // FIXED: Access response.data directly because backend returns the object directly
        if (response.data) {
          setEarningStatus(response.data);
        }
      } catch (error) {
        console.error("Error fetching earning stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEarningStatus();
  }, []);

  return (
    <Row className="g-4">
      <Col md={6} lg={3}>
        <Card className="card-body border p-4 h-100">
          <h6 className="mb-0">Sales this month</h6>
          <h3 className="mb-2 mt-2">{earningStatus.salesThisMonth}</h3>
          <Link to="" className="mt-auto">
            View transaction
          </Link>
        </Card>
      </Col>

      <Col md={6} lg={3}>
        <Card className="card-body border p-4 h-100">
          <h6 className="mb-0">Earnings this month</h6>
          <h3 className="mb-2 mt-2">
            {currency}
            {earningStatus.earningsCurrentMonth.toLocaleString()}
          </h3>
          <p className="mb-0 mt-auto text-success">
            Last month: {currency}
            {earningStatus.earningsLastMonth.toLocaleString()}
          </p>
        </Card>
      </Col>

      {/* To be paid section - Commented as requested 
      <Col md={6} lg={3}>
        <Card className="card-body border p-4 h-100">
          <h6>
            To be paid
            <OverlayTrigger
              trigger="click"
              overlay={
                <Popover>
                  <PopoverBody>After US royalty withholding tax</PopoverBody>
                </Popover>
              }
            >
              <span className="ms-1">
                <BsInfoCircleFill className=" small" />
              </span>
            </OverlayTrigger>
          </h6>
          <h3>{currency}15,356</h3>
          <p className="mb-0 mt-auto">Expected payout on 05/10/2022</p>
        </Card>
      </Col> 
      */}

      <Col lg={6}>
        <Card className="bg-primary p-4">
          <div className="d-flex justify-content-between align-items-start text-white">
            <Image className="w-40px" src={visa} />
            <Dropdown>
              <DropdownToggle
                as={Link}
                to=""
                className="arrow-none text-white"
                id="creditcardDropdown"
              >
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle fill="currentColor" cx="12.5" cy="3.5" r="2.5" />
                  <circle
                    fill="currentColor"
                    opacity="0.5"
                    cx="12.5"
                    cy="11.5"
                    r="2.5"
                  />
                  <circle
                    fill="currentColor"
                    opacity="0.3"
                    cx="12.5"
                    cy="19.5"
                    r="2.5"
                  />
                </svg>
              </DropdownToggle>
              <DropdownMenu align="end" aria-labelledby="creditcardDropdown">
                <DropdownItem href="">
                  <BsCreditCard2FrontFill className=" me-2 fw-icon" />
                  Edit card
                </DropdownItem>
                <DropdownItem href="">
                  <BsCreditCard className=" me-2 fw-icon" />
                  Add new card
                </DropdownItem>
                <DropdownItem href="">
                  <BsArrowBarDown className=" me-2 fw-icon" />
                  Withdrawal money
                </DropdownItem>
                <DropdownItem href="">
                  <BsCalculator className=" me-2 fw-icon" />
                  Currency converter
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="mt-4 text-white">
            <span>Total Earnings</span>
            <h3 className="text-white mb-0">
              {currency}
              {earningStatus.earningsCurrentMonth.toLocaleString()}
            </h3>
          </div>
          <h5 className="text-white mt-4">**** **** **** 1569</h5>
          <div className="d-flex justify-content-between text-white">
            <span>Valid thru: 12/26</span>
            <span>CVV: ***</span>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default EarningStatistics;
