import { Button, Card, CardBody, CardHeader, Col, Container, Image, Row } from 'react-bootstrap';
import { BsBell, BsTrash } from 'react-icons/bs';
import { recentActivities } from './data';
import { BsChat, BsCheckLg } from 'react-icons/bs';
import { Modal } from 'react-bootstrap';

import { useEffect, useState, Fragment } from "react";
import clsx from 'clsx';
import { PageMetaData } from '@/components';
const Activities = () => {

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleteId, setDeleteId] = useState(null);



  console.log("activities", activities);

  const handleView = (activity) => {
    setSelectedActivity(activity);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedActivity(null);
  };



  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/v1/shops/activity",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch activities");
      }

      setActivities(data?.data || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
 const confirmDelete = async () => {
  try {
    const token = localStorage.getItem("token");

    await fetch(
      `http://localhost:5000/api/v1/shops/activity/${deleteId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setActivities(prev => prev.filter(item => item._id !== deleteId));
  } catch (err) {
    console.log(err);
  } finally {
    setShowDeleteModal(false);
    setDeleteId(null);
  }
};


  useEffect(() => {
    fetchActivities();
  }, []);


  const formatActivityDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    let relativeTime = "";

    if (diffDays === 0) {
      relativeTime = "Today";
    } else if (diffDays === 1) {
      relativeTime = "1 Day ago";
    } else {
      relativeTime = `${diffDays} Days ago`;
    }

    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    return `${relativeTime}, ${formattedDate}`;
  };


  return <>
    <PageMetaData title="Agent Activities" />

    <section className="pt-0 new-added-section-padding">
      <Container className="vstack gap-4">
        <Row>
          <Col xs={12}>
            <h1 className="fs-4 mb-0 items-center gap-1">
              <BsBell className=" fa-fw me-1" />
              Activities
            </h1>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Card className="border">
              <CardHeader className="border-bottom">
                <h5 className="card-header-title">Recent Activities</h5>
              </CardHeader>
              <CardBody>
                {activities.map((activity, idx) => {
                  const Icon = activity.icon;
                  return <Fragment key={idx}>
                    <div className="d-sm-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-sm-center me-4 ms-sm-0">
                        <div className="avatar flex-shrink-0">
                          {/* {Icon && <div className={clsx('avatar-img rounded-circle', activity.variant)}>
                                  <span className="position-absolute top-50 start-50 translate-middle fw-bold flex-centered">
                                    <Icon className=" fs-5" />
                                  </span>
                                </div>}

                              {activity.image && <Image className="avatar-img rounded-circle" src={activity.image} />} */}

                          <div className={clsx('avatar-img rounded-circle text-bg-info')}>
                            <span className="position-absolute top-50 start-50 translate-middle fw-bold flex-centered">
                              <BsCheckLg className=" fs-5" />
                            </span>
                          </div>

                        </div>
                        <div className="ms-3">
                          <h6 className="fw-light m-0">
                            {activity.description}
                          </h6>

                          <small>{formatActivityDate(activity.createdAt)}  </small>
                        </div>
                      </div>
                      <div className="d-flex gap-2 mt-2 mt-sm-0">
                        <Button
                          variant="primary-soft"
                          size="sm"
                          onClick={() => handleView(activity)}
                        >
                          View
                        </Button>

                        <Button
  variant="danger-soft"
  size="sm"
  onClick={() => {
    setDeleteId(activity._id);
    setShowDeleteModal(true);
  }}
>
  <BsTrash />
</Button>

                      </div>
                    </div>
                    {recentActivities.length - 1 != idx && <hr />}
                  </Fragment>;
                })}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
    <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Activity Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {selectedActivity && (
          <>
            <p><strong>Description:</strong> {selectedActivity.description}</p>
            <p><strong>Type:</strong> {selectedActivity.type}</p>
            <p><strong>Created At:</strong> {formatActivityDate(selectedActivity.createdAt)}</p>
            {selectedActivity.fromUser && (
              <p><strong>From:</strong> {selectedActivity.fromUser.name}</p>
            )}
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>

<Modal
  show={showDeleteModal}
  onHide={() => setShowDeleteModal(false)}
  centered
>
  <Modal.Header closeButton>
    <Modal.Title>Confirm Delete</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    Are you sure you want to delete this activity?
  </Modal.Body>

  <Modal.Footer>
    <Button
      variant="secondary"
      onClick={() => setShowDeleteModal(false)}
    >
      Cancel
    </Button>

    <Button
      variant="danger"
      onClick={confirmDelete}
    >
      Yes, Delete
    </Button>
  </Modal.Footer>
</Modal>

  </>;
};
export default Activities;