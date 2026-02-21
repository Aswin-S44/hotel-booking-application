import { Col, Container, Row } from "react-bootstrap";
import { BsGraphUpArrow } from "react-icons/bs";
import EarningChart from "./components/EarningChart";
import EarningStatistics from "./components/EarningStatistics";
import InvoiceHistory from "./components/InvoiceHistory";
import { PageMetaData, SelectFormInput } from "@/components";
import { useState } from "react";
import { format, subMonths } from "date-fns";

const Earnings = () => {
  // Generate last 12 months for the dropdown
  const months = Array.from({ length: 12 }).map((_, i) => {
    const date = subMonths(new Date(), i);
    return {
      label: format(date, "MMMM yyyy"),
      value: format(date, "yyyy-MM"),
    };
  });

  const [selectedDate, setSelectedDate] = useState(months[0].value);

  return (
    <>
      <PageMetaData title="Agent Earnings" />

      <section className="pt-0">
        <Container className="vstack gap-4">
          <Row className="align-items-center">
            <Col md={8}>
              <h1 className="fs-4 mb-0 items-center gap-1">
                <BsGraphUpArrow className=" fa-fw me-1" />
                Earnings
              </h1>
            </Col>
            <Col md={4}>
              <select
                className="form-select"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </Col>
          </Row>

          <EarningStatistics selectedDate={selectedDate} />

          <Row>
            <Col xs={12}>
              <EarningChart selectedDate={selectedDate} />
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <InvoiceHistory selectedDate={selectedDate} />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Earnings;
