import React from "react";
import { Container, Button } from "react-bootstrap";
import { FiSearch } from "react-icons/fi";

const NotFound = ({ title, description }) => {
  return (
    <Container className="d-flex flex-column align-items-center justify-content-center text-center py-5 shadow-sm rounded-4 bg-light border border-dashed">
      <div
        className="mb-4 d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10"
        style={{ width: "80px", height: "80px" }}
      >
        <FiSearch size={40} className="text-primary" />
      </div>

      <h3 className="fw-bold text-dark mb-2">{title}</h3>
      <p className="text-muted mx-auto mb-4" style={{ maxWidth: "400px" }}>
        {description}
      </p>

      <Button
        variant="primary"
        className="px-4 py-2 fw-semibold shadow-sm"
        onClick={() => window.location.reload()}
      >
        Refresh Page
      </Button>
    </Container>
  );
};

export default NotFound;
