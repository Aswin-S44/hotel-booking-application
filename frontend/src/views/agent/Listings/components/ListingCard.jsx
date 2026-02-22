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
  Badge,
} from "react-bootstrap";
import { Modal } from "react-bootstrap";
import {
  BsGeoAlt,
  BsPencilSquare,
  BsSlashCircle,
  BsThreeDotsVertical,
  BsTrash3,
  BsCheckCircle,
} from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { currency } from "@/states";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import { ToastContainer, toast } from "react-toastify";
import { API_BASE_URL } from "../../../../config/env";

const ListingCard = ({ roomListCard, setRooms }) => {
  const { location, roomThumbnail, listingName, price, isDisabled } =
    roomListCard;
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleDelete = async () => {
    try {
      Swal.fire({
        title: "Are you sure want to delete room ?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          setLoading(true);
          await axios.delete(
            `${API_BASE_URL}/api/v1/shops/rooms/${roomListCard?._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setRooms((prevRooms) =>
            prevRooms.filter((room) => room._id !== roomListCard._id)
          );
          // toast.success("Room deleted successfully");
          setLoading(false);
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        }
      });
    } catch (error) {
      // toast.error("Failed to delete room");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      setLoading(true);
      const newStatus = !isDisabled;

      await axios.patch(
        `${API_BASE_URL}/api/v1/shops/room/${roomListCard._id}`,
        {
          isDisabled: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room._id === roomListCard._id
            ? { ...room, isDisabled: newStatus }
            : room
        )
      );

      if (newStatus) {
        Swal.fire({
          title: "Disabled",
          text: "Room disabled successfully",
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Reactivated",
          text: "Room deactivated successfully",
          icon: "success",
        });
      }

      setLoading(false);
    } catch (error) {
      toast.error("Failed to update room status");
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="border p-2">
        <Row className="g-4">
          <Col md={3} lg={2} className="position-relative">
            <Image
              src={roomThumbnail}
              className="card-img rounded-2"
              alt="Card image"
            />
            {isDisabled && (
              <Badge
                bg="danger"
                className="position-absolute top-0 start-0 m-2"
              >
                Disabled
              </Badge>
            )}
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
                  <DropdownItem
                    className="items-center"
                    onClick={handleToggleStatus}
                  >
                    {isDisabled ? (
                      <div>
                        <BsCheckCircle className="me-1" />
                        Reactivate
                      </div>
                    ) : (
                      <div>
                        <BsSlashCircle className="me-1" />
                        Disable
                      </div>
                    )}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <h5 className="card-title mb-0 me-5">
                <Link to={`/hotel/room/${roomListCard?._id}`}>
                  {listingName}
                </Link>
                {isDisabled && (
                  <Badge bg="secondary" className="ms-2 fs-6 fw-light">
                    Disabled
                  </Badge>
                )}
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
                    onClick={handleDelete}
                    variant="danger"
                    size="sm"
                    className="mb-0 items-center"
                  >
                    <BsTrash3 className=" fa-fw me-1" />
                    Delete
                  </Button>
                </div>
              </div>
<<<<<<< HEAD
            </CardBody>
          </Col>
        </Row>
      </Card>
      {/* <ToastContainer /> */}
    </>
=======
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
                  onClick={handleDelete}
                  variant="danger"
                  size="sm"
                  className="mb-0 items-center"
                >
                  <BsTrash3 className=" fa-fw me-1" />
                  Delete
                </Button>
              </div>
            </div>
          </CardBody>
        </Col>
        {/* <ToastContainer /> */}
      </Row>
    </Card>
>>>>>>> 0ac12b2db5c92bdce0b8b832ebce9eec6aa328fa
  );
};

export default ListingCard;
