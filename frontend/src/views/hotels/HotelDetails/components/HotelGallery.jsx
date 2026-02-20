import { useState, useEffect } from "react";
import { GlightBox } from "@/components";
import { useToggle } from "@/hooks";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalHeader,
  Row,
} from "react-bootstrap";
import {
  BsExclamationOctagonFill,
  BsEyeFill,
  BsFullscreen,
  BsGeoAlt,
  BsPinMapFill,
  BsXLg,
} from "react-icons/bs";
import { FaFacebookSquare, FaShareAlt, FaTwitterSquare } from "react-icons/fa";
import { FaCopy, FaHeart, FaLinkedin } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";

import HotelMediaGallery from "./HotelMediaGallery";

import { ToastContainer, toast } from "react-toastify";

const HotelGallery = ({ hotelDetails, gallery }) => {
  const { isOpen, toggle } = useToggle();
  const { id } = useParams();
  const { isOpen: alertVisible, hide: hideAlert } = useToggle(true);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const existingFav = JSON.parse(localStorage.getItem("fav")) || [];
    setIsFav(existingFav.includes(id));
  }, [id]);

  const handleAddToFav = () => {
    const existingFav = JSON.parse(localStorage.getItem("fav")) || [];

    let updatedFav;

    if (existingFav.includes(id)) {
      updatedFav = existingFav.filter((item) => item !== id);
      localStorage.setItem("fav", JSON.stringify(updatedFav));
      setIsFav(false);
      toast.error("Removed from favourites");
    } else {
      updatedFav = [...existingFav, id];
      localStorage.setItem("fav", JSON.stringify(updatedFav));
      setIsFav(true);
      toast.success("Added to favourites");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied");
  };

  const longitude = hotelDetails?.address?.coordinates?.coordinates?.[0];
  const latitude = hotelDetails?.address?.coordinates?.coordinates?.[1];

  return (
    <>
      <section className="py-0 pt-sm-5">
        <Container className="position-relative">
          <Row className="mb-3">
            <Col xs={12}>
              <div className="d-lg-flex justify-content-lg-between mb-1">
                <div className="mb-2 mb-lg-0">
                  <h1 className="fs-2">{hotelDetails?.name ?? ""}</h1>
                  <p className="fw-bold mb-0 items-center flex-wrap">
                    <BsGeoAlt className=" me-2" />
                    {`${hotelDetails?.address?.street}, ${hotelDetails?.address?.city}, ${hotelDetails?.address?.state}, ${hotelDetails?.address?.country}, ${hotelDetails?.address?.postalCode}`}
                    <Link
                      to=""
                      onClick={toggle}
                      className="ms-3 text-decoration-underline items-center"
                      data-bs-toggle="modal"
                      data-bs-target="#mapmodal"
                    >
                      <BsEyeFill className="me-1" />
                      View On Map
                    </Link>
                  </p>
                </div>
                <ul className="list-inline text-end">
                  <li className="list-inline-item">
                    <Button
                      variant="light"
                      size="sm"
                      className="px-2"
                      onClick={handleAddToFav}
                    >
                      <FaHeart
                        className={`fa-fw ${isFav ? "text-danger" : ""}`}
                      />
                    </Button>
                  </li>

                  <FaShareAlt
                    className="fa-fw"
                    onClick={handleCopyLink}
                    style={{ cursor: "pointer" }}
                  />
                </ul>
              </div>
            </Col>
          </Row>
          {/* <Alert
            show={alertVisible}
            variant="danger"
            className="d-flex justify-content-between align-items-center rounded-3 fade show mb-4 mb-0 pe-2 py-3"
            role="alert"
          >
            <div className="items-center">
              <span className="alert-heading h5 mb-0 me-2">
                <BsExclamationOctagonFill />
              </span>
              <span>
                <strong className="alert-heading me-2">Covid Policy:</strong>You
                may require to present an RT-PCR negative test report at the
                hotel
              </span>
            </div>
            <Button
              variant="link"
              onClick={hideAlert}
              type="button"
              className="pb-0 pt-1 text-end"
              data-bs-dismiss="alert"
              aria-label="Close"
            >
              <BsXLg className=" text-dark" />
            </Button>
          </Alert> */}
        </Container>
      </section>

      <section className="card-grid pt-0">
        {/* <Container>
          <Row className="g-2">
            <Col md={6}>
              <GlightBox
                data-glightbox
                data-gallery="gallery"
                image={gallery14}
              >
                <Card
                  className="card-grid-lg card-element-hover card-overlay-hover overflow-hidden"
                  style={{
                    backgroundImage: `url(${gallery14})`,
                    backgroundPosition: "center left",
                    backgroundSize: "cover",
                  }}
                >
                  <div className="hover-element position-absolute w-100 h-100">
                    <BsFullscreen
                      size={28}
                      className=" fs-6 text-white position-absolute top-50 start-50 translate-middle bg-dark rounded-1 p-2 lh-1"
                    />
                  </div>
                </Card>
              </GlightBox>
            </Col>
            <Col md={6}>
              <Row className="g-2">
                <Col xs={12}>
                  <GlightBox
                    data-glightbox
                    data-gallery="gallery"
                    image={gallery13}
                  >
                    <Card
                      className="card-grid-sm card-element-hover card-overlay-hover overflow-hidden"
                      style={{
                        backgroundImage: `url(${gallery13})`,
                        backgroundPosition: "center left",
                        backgroundSize: "cover",
                      }}
                    >
                      <div className="hover-element position-absolute w-100 h-100">
                        <BsFullscreen
                          size={28}
                          className=" fs-6 text-white position-absolute top-50 start-50 translate-middle bg-dark rounded-1 p-2 lh-1"
                        />
                      </div>
                    </Card>
                  </GlightBox>
                </Col>
                <Col md={6}>
                  <GlightBox
                    data-glightbox
                    data-gallery="gallery"
                    image={gallery12}
                  >
                    <Card
                      className="card-grid-sm card-element-hover card-overlay-hover overflow-hidden"
                      style={{
                        backgroundImage: `url(${gallery12})`,
                        backgroundPosition: "center left",
                        backgroundSize: "cover",
                      }}
                    >
                      <div className="hover-element position-absolute w-100 h-100">
                        <BsFullscreen
                          size={28}
                          className="bifs-6 text-white position-absolute top-50 start-50 translate-middle bg-dark rounded-1 p-2 lh-1"
                        />
                      </div>
                    </Card>
                  </GlightBox>
                </Col>
                <Col md={6}>
                  <Card
                    className="card-grid-sm overflow-hidden"
                    style={{
                      backgroundImage: `url(${gallery11})`,
                      backgroundPosition: "center left",
                      backgroundSize: "cover",
                    }}
                  >
                    <div className="bg-overlay bg-dark opacity-7" />
                    <GlightBox
                      data-glightbox
                      data-gallery="gallery"
                      image={gallery11}
                      className="stretched-link z-index-9"
                    />
                    <GlightBox
                      data-glightbox
                      data-gallery="gallery"
                      image={gallery15}
                    />
                    <GlightBox
                      data-glightbox
                      data-gallery="gallery"
                      image={gallery16}
                    />
                    <div className="card-img-overlay d-flex h-100 w-100">
                      <h6 className="card-title m-auto fw-light text-decoration-underline">
                        <Link to="" className="text-white">
                          View all
                        </Link>
                      </h6>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container> */}

        <HotelMediaGallery gallery={gallery} />
      </section>

      <Modal size="lg" centered show={isOpen} onHide={toggle} className="fade">
        <ModalHeader>
          <h5 className="modal-title" id="mapmodalLabel">
            View Our Hotel Location
          </h5>
          <button type="button" onClick={toggle} className="btn-close" />
        </ModalHeader>
        <div className="modal-body p-0">
          {latitude && longitude && (
            <iframe
              className="w-100"
              height={400}
              src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
              style={{ border: 0 }}
              title="map"
              loading="lazy"
            />
          )}
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-sm btn-primary mb-0 items-center"
          >
            <BsPinMapFill className="me-2" />
            View In Google Map
          </button>
        </div>
      </Modal>
      <ToastContainer />
    </>
  );
};
export default HotelGallery;
