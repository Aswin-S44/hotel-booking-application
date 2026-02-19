import {
  Button,
  Card,
  CardBody,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Image,
  Row,
} from "react-bootstrap";
import { Modal } from "react-bootstrap";
import {
  BsGeoAlt,
  BsInfoCircle,
  BsPencilSquare,
  BsSlashCircle,
  BsThreeDotsVertical,
  BsTrash3,
} from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { currency } from "@/states";
import { useState } from "react";
import axios from "axios";
const ListingCard = ({ roomListCard, setRooms }) => {
  const { location, roomThumbnail, listingName, price } = roomListCard;
  console.log("roomListCard-----------", roomListCard);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  console.log("token>>>>>>>>>>>>>", show);

  const handleDelete = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/v1/shops/rooms/${roomListCard?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRooms((prevRooms) =>
        prevRooms.filter((room) => room._id !== roomListCard._id)
      );

      setLoading(false);
      setShow(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Card className="border p-2">
      <Row className="g-4">
        <Col md={3} lg={2}>
          <Image
            src={roomThumbnail}
            className="card-img rounded-2"
            alt="Card image"
          />
        </Col>
        <Col md={9} lg={10}>
          <CardBody className="position-relative d-flex flex-column p-0 h-100">
            <Dropdown className="list-inline-item position-absolute top-0 end-0">
              <DropdownToggle
                as={Link}
                to=""
                className="arrow-none btn btn-sm btn-round btn-light"
              >
                <BsThreeDotsVertical />
              </DropdownToggle>
              <DropdownMenu
                align="end"
                className="min-w-auto shadow rounded"
                aria-labelledby="dropdownAction2"
              >
                <DropdownItem className="items-center">
                  <BsInfoCircle className="me-1" />
                  Report
                </DropdownItem>

                <DropdownItem className="items-center">
                  <BsSlashCircle className="me-1" />
                  Disable
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <h5 className="card-title mb-0 me-5">
              <Link to={`/hotel/room/${roomListCard?._id}`}>{listingName}</Link>
            </h5>
            <small>
              <BsGeoAlt className="me-2" />
              {[
                location?.street,
                location?.city,
                location?.state,
                location?.postalCode,
                location?.country,
              ]
                .filter(Boolean)
                .join(", ")}
            </small>

            <div className="d-sm-flex justify-content-sm-between align-items-center mt-3 mt-md-auto">
              <div className="d-flex align-items-center">
                <h5 className="fw-bold mb-0 me-1">
                  {currency}
                  {price}
                </h5>
                <span className="mb-0 me-2">/day</span>
              </div>
              <div className="hstack gap-2 mt-3 mt-sm-0">
                <Button
                  variant="primary"
                  size="sm"
                  className="mb-0 items-center"
                  onClick={() => {
                    navigate(`/listings/${roomListCard?.property}/edit`);
                  }}
                >
                  <BsPencilSquare className=" fa-fw me-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => setShow(true)}
                  variant="danger"
                  size="sm"
                  className="mb-0 items-center"
                >
                  <BsTrash3 className=" fa-fw me-1" />
                  Delete
                </Button>

                <Modal show={show} onHide={() => setShow(false)} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                    Are you sure you want to delete all rooms of this property?
                  </Modal.Body>

                  <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                      Cancel
                    </Button>

                    <Button
                      variant="danger"
                      onClick={handleDelete}
                      disabled={loading}
                    >
                      {loading ? "Deleting..." : "Yes, Delete"}
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </CardBody>
        </Col>
      </Row>
    </Card>
  );
};
export default ListingCard;
