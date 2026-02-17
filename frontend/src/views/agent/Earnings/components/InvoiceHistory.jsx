import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { SelectFormInput } from "@/components";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { BsCloudDownload, BsInfoCircleFill } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { currency } from "@/states";
import clsx from "clsx";

const InvoiceHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalEntries: 0,
    limit: 10,
  });

  useEffect(() => {
    fetchInvoiceHistory();
  }, [pagination.currentPage, sort]);

  const fetchInvoiceHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/v1/shops/invoices`,
        {
          params: {
            page: pagination.currentPage,
            sort: sort,
            search: search,
            limit: 10,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHistory(response.data.data);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.data.pagination.totalPages,
        totalEntries: response.data.pagination.totalEntries,
      }));
    } catch (error) {
      console.error("Error fetching invoice history", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, currentPage: 1 });
    fetchInvoiceHistory();
  };

  const downloadPDF = (invoice) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("INVOICE", 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    autoTable(doc, {
      startY: 40,
      head: [["Description", "Details"]],
      body: [
        ["Invoice ID", `#${invoice.paymentId || "N/A"}`],
        ["Billing Date", invoice.date],
        ["Total Amount", `${currency}${invoice.amount}`],
        ["Payment Status", (invoice.status || "").toUpperCase()],
      ],
      theme: "striped",
      headStyles: { fillColor: [51, 122, 183] },
    });

    doc.save(`Invoice_${invoice.paymentId?.slice(-6)}.pdf`);
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "cancelled":
        return "bg-danger text-danger";
      case "pending":
        return "text-warning bg-warning";
      default:
        return "text-success bg-success";
    }
  };

  return (
    <Card className="border rounded-3">
      <CardHeader className="border-bottom">
        <h5 className="card-header-title">Invoice history</h5>
      </CardHeader>
      <CardBody>
        <Row className="g-3 align-items-center justify-content-between mb-3">
          <Col md={8}>
            <form className="rounded position-relative" onSubmit={handleSearch}>
              <input
                className="form-control pe-5"
                type="search"
                placeholder="Search Status (e.g. booked)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="btn border-0 px-3 py-0 position-absolute top-50 end-0 translate-middle-y"
                type="submit"
              >
                <FaSearch className=" fs-6" />
              </button>
            </form>
          </Col>
          <Col md={3}>
            <SelectFormInput
              className="form-select"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPagination({ ...pagination, currentPage: 1 });
              }}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </SelectFormInput>
          </Col>
        </Row>
        <div className="table-responsive border-0">
          <table className="table align-middle p-4 mb-0 table-hover">
            <thead className="table-light">
              <tr>
                <th className="border-0 rounded-start">Invoice ID</th>
                <th className="border-0">Date</th>
                <th className="border-0">Amount</th>
                <th className="border-0">Status</th>
                <th className="border-0 rounded-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : history.length > 0 ? (
                history.map((invoice, idx) => (
                  <tr key={idx}>
                    <td> #{invoice.paymentId?.slice(-6) || "N/A"} </td>
                    <td> {invoice.date} </td>
                    <td>
                      {currency}
                      {invoice.amount}
                      <Dropdown as="span" className="ms-1">
                        <DropdownToggle
                          as={Link}
                          to=""
                          className="arrow-none h6 mb-0"
                        >
                          <BsInfoCircleFill />
                        </DropdownToggle>
                        <DropdownMenu
                          align="end"
                          className="dropdown-w-sm shadow rounded"
                        >
                          <li className="px-2 d-flex justify-content-between">
                            <span className="small">Subtotal</span>
                            <span className="h6 mb-0 small">
                              {currency}
                              {invoice.amount}
                            </span>
                          </li>
                        </DropdownMenu>
                      </Dropdown>
                    </td>
                    <td>
                      <div
                        className={clsx(
                          "badge bg-opacity-10",
                          getStatusClass(invoice.status)
                        )}
                      >
                        {invoice.status}
                      </div>
                    </td>
                    <td>
                      <OverlayTrigger overlay={<Tooltip>Download PDF</Tooltip>}>
                        <button
                          onClick={() => downloadPDF(invoice)}
                          className="btn btn-light btn-round mb-0 border-0"
                        >
                          <BsCloudDownload />
                        </button>
                      </OverlayTrigger>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardBody>
      <CardFooter className="pt-0">
        <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
          <p className="mb-sm-0">
            Showing {history.length} of {pagination.totalEntries} entries
          </p>
          <nav>
            <ul className="pagination pagination-sm pagination-primary-soft mb-0">
              <li
                className={clsx(
                  "page-item",
                  pagination.currentPage === 1 && "disabled"
                )}
              >
                <button
                  className="page-link"
                  onClick={() =>
                    setPagination({
                      ...pagination,
                      currentPage: pagination.currentPage - 1,
                    })
                  }
                >
                  Prev
                </button>
              </li>
              {[...Array(pagination.totalPages)].map((_, i) => (
                <li
                  key={i}
                  className={clsx(
                    "page-item",
                    pagination.currentPage === i + 1 && "active"
                  )}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      setPagination({ ...pagination, currentPage: i + 1 })
                    }
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li
                className={clsx(
                  "page-item",
                  pagination.currentPage === pagination.totalPages && "disabled"
                )}
              >
                <button
                  className="page-link"
                  onClick={() =>
                    setPagination({
                      ...pagination,
                      currentPage: pagination.currentPage + 1,
                    })
                  }
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </CardFooter>
    </Card>
  );
};

export default InvoiceHistory;
