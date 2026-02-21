import { currency } from '@/states';
import { useState } from 'react';
import { Card, CardBody, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Image, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { BsGeoAlt } from 'react-icons/bs';
import { FaCopy, FaFacebookSquare, FaHeart, FaLinkedin, FaShareAlt, FaStar, FaStarHalfAlt, FaTwitterSquare } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Toast, ToastContainer } from "react-bootstrap";
const WishCard = ({
  wishCard
}) => {
  const {
    address,
    image,
    name,
    price,
    rating
  } = wishCard;

  console.log("wishCard ???", wishCard);

  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);


  const safeRating = Math.max(
    0,
    Math.min(5, Number(rating) || 0)
  );
const handleCopyLink = async () => {
  const fullUrl = `${window.location.origin}/hotels/detail/${wishCard?._id}`;

  try {
    await navigator.clipboard.writeText(fullUrl);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 1500);
  } catch (err) {
    console.error("Copy failed");
  }
};

  return <>
  <Card className="shadow p-2">
    <Row className="g-0">
      <Col md={3}>
        <Image src={wishCard?.thumbnail} className="card-img rounded-2" alt="Card image" style={{ objectFit: "cover", maxHeight: "150px" }} />
      </Col>
      <Col md={9}>
        <CardBody className="py-md-2 d-flex flex-column h-100">
          <div className="d-flex justify-content-between align-items-center">
            <ul className="list-inline small mb-1">
              {Array.from({ length: Math.floor(safeRating) }).map((_, idx) => (
                <li key={idx} className="list-inline-item me-1 small">
                  <FaStar size={16} className="text-warning" />
                </li>
              ))}

              {!Number.isInteger(safeRating) && (
                <li className="list-inline-item me-1 small">
                  <FaStarHalfAlt size={15} className="text-warning" />
                </li>
              )}

              {Array.from({ length: 5 - Math.ceil(safeRating) }).map((_, idx) => (
                <li key={idx} className="list-inline-item me-1 small">
                  <FaStar size={16} />
                </li>
              ))}
            </ul>
            <ul className="list-inline mb-0 items-center gap-1">
              <li className="list-inline-item">
                <Link to="" className="btn btn-sm btn-round btn-danger mb-0">
                  <FaHeart size={10} className="fa-fw" />
                </Link>
              </li>
              <Dropdown className="list-inline-item">
                <DropdownToggle as={Link} to="" className="arrow-none btn btn-sm btn-round btn-light mb-0">
                  <FaShareAlt size={10} />
                </DropdownToggle>
                <DropdownMenu align="end" className="min-w-auto shadow rounded">

                  <DropdownItem href="">
                    <FaTwitterSquare className="me-2" />
                    Twitter
                  </DropdownItem>

                  <DropdownItem href="">
                    <FaFacebookSquare className="me-2" />
                    Facebook
                  </DropdownItem>

                  <DropdownItem href="">
                    <FaLinkedin className="me-2" />
                    LinkedIn
                  </DropdownItem>
                 <DropdownItem onClick={handleCopyLink}>
  <FaCopy className="me-2" />
  Copy link
</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </ul>
          </div>
          <h5 className="card-title mb-1">
            <Link to={`/hotels/detail/${wishCard?._id}`}>{wishCard?.listingName}</Link>
          </h5>
          <small className="items-center">
            <BsGeoAlt className=" me-2" />
            {wishCard?.location?.street}, {wishCard?.location?.city}, {wishCard?.location?.state}, {wishCard?.location?.country} - {wishCard?.location?.postalCode}
          </small>
          <div className="d-sm-flex justify-content-sm-between align-items-center mt-3 mt-md-auto">
            <div className="d-flex align-items-center">
              <h5 className="fw-bold mb-0 me-1">
                {currency}
                {wishCard?.basePrice}
              </h5>
              <span className="mb-0 me-2">/day</span>
            </div>
            <div className="mt-3 mt-sm-0">
              <Link to={`/hotels/detail/${wishCard?._id}`} className="btn btn-sm btn-dark w-100 mb-0">
                View hotel
              </Link>
            </div>
          </div>
        </CardBody>
      </Col>
    </Row>
  </Card>
  
 <ToastContainer position="top-end" className="p-3">
  <Toast
    show={showToast}
    bg="success"
    style={{ minWidth: "200px", width: "220px" }}
  >
    <Toast.Body className="text-white text-center">
      Link copied ✓
    </Toast.Body>
  </Toast>
</ToastContainer>
  </>;
};
export default WishCard;