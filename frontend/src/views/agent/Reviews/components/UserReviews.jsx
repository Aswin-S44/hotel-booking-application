import { Card, CardBody, CardFooter, CardHeader } from "react-bootstrap";
import { userReviews } from "../data";
import ReviewCard from "./ReviewCard";
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
const UserReviews = () => {
  const [reviews, setReviews] = useState([
    {
      _id: "65cb...f123",
      fromId: {
        _id: "65ca...a111",
        firstName: "John",
        lastName: "Doe",
        profilePic: "https://example.com/user.jpg",
        email: "john@example.com",
      },
      propertyId: {
        _id: "65c9...b222",
        listingName: "Luxury Beachfront Villa",
        location: {
          country: "USA",
          state: "California",
          city: "Malibu",
          street: "123 Ocean Drive",
          postalCode: "90265",
        },
        thumbnail: "https://example.com/property.jpg",
      },
      roomId: {
        _id: "65c8...c333",
        roomName: "Ocean View Suite",
        roomThumbnail: "https://example.com/room.jpg",
        price: 250,
      },
      feedback: "Amazing stay, very clean!",
      rating: 5,
      reviewImages: [
        "https://example.com/review1.jpg",
        "https://example.com/review2.jpg",
      ],
      createdAt: "2024-05-15T10:00:00.000Z",
      updatedAt: "2024-05-15T10:00:00.000Z",
    },
    ,
  ]);

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // useEffect(() => {
  //   const fetchReviews = async () => {
  //     try {
  //       const response = await fetch(
  //         "http://localhost:5000/api/v1/shops/reviews",
  //         {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       const result = await response.json();

  //       if (result) {
  //         setReviews(result?.reviews);
  //       }
  //       setLoading(false);
  //     } catch (error) {
  //       console.error(error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchReviews();
  // }, [token]);

  if (loading) return <div>Loading...</div>;

  return (
    <Card className="border rounded-3">
      <CardHeader className="border-bottom">
        <h5 className="card-header-title">User Reviews</h5>
      </CardHeader>
      <CardBody>
        {reviews.map((review, idx) => {
          return (
            <Fragment key={idx}>
              <ReviewCard review={review} />
              {reviews.length - 1 != idx && <hr />}
            </Fragment>
          );
        })}
      </CardBody>
      <CardFooter className="pt-0">
        <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
          <p className="mb-sm-0 text-center text-sm-start">
            Showing 1 to 8 of 20 entries
          </p>
          <nav
            className="mb-sm-0 d-flex justify-content-center"
            aria-label="navigation"
          >
            <ul className="pagination pagination-sm pagination-primary-soft mb-0">
              <li className="page-item disabled">
                <Link className="page-link" to="" tabIndex={-1}>
                  Prev
                </Link>
              </li>
              <li className="page-item">
                <Link className="page-link" to="">
                  1
                </Link>
              </li>
              <li className="page-item active">
                <Link className="page-link" to="">
                  2
                </Link>
              </li>
              <li className="page-item disabled">
                <Link className="page-link" to="">
                  ..
                </Link>
              </li>
              <li className="page-item">
                <Link className="page-link" to="">
                  15
                </Link>
              </li>
              <li className="page-item">
                <Link className="page-link" to="">
                  Next
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </CardFooter>
    </Card>
  );
};
export default UserReviews;
