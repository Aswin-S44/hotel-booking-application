import { PageMetaData, SelectFormInput } from '@/components';
import { Button, Card, CardBody, CardHeader, Col } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import WishCard from './components/WishCard';
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';

const Wishlist = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("recent");


const handleRemoveAll = () => {
  localStorage.removeItem("fav");
  setProperties([]);
};

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);

        const favIds = JSON.parse(localStorage.getItem("fav")) || [];

        if (favIds.length === 0) {
          setProperties([]);
          return;
        }

        const res = await axios.post(
          "http://localhost:5000/api/v1/customer/favorites",
          { ids: favIds }
        );

        setProperties(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);


  
  const sortedProperties = useMemo(() => {
    let sorted = [...properties];

    switch (sortOption) {
      case "priceLow":
        sorted.sort((a, b) => a.basePrice - b.basePrice);
        break;

      case "priceHigh":
        sorted.sort((a, b) => b.basePrice - a.basePrice);
        break;

      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;

      default:
        break;
    }

    return sorted;
  }, [properties, sortOption]);

  return (
    <>
      <PageMetaData title="User Wishlist" />

      <Card className="border bg-transparent">
        <CardHeader className="bg-transparent border-bottom">
          <h4 className="card-header-title">My Wishlist</h4>
        </CardHeader>

        <CardBody className="vstack gap-4">
          <form className="d-flex justify-content-between flex-wrap gap-2">
            <Col xs={6} xl={3}>
              <SelectFormInput
                className="form-select form-select-sm border-0"
                value={sortOption}
               onChange={(value) => setSortOption(value)}
              >
                <option value="recent">Recently Added</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </SelectFormInput>
            </Col>

            <Button variant="danger-soft" className="mb-0 items-center" onClick={handleRemoveAll}>
              <FaTrash className="me-2" />
              Remove all
            </Button>
          </form>

          {sortedProperties.length === 0 && !loading ? (
  <div className="text-center py-5">
    <img
      src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
      alt="empty"
      width="120"
      className="mb-3 opacity-75"
    />
    <h5 className="fw-bold">Your wishlist is empty</h5>
    <p className="text-muted mb-3">
      Looks like you haven't added any properties yet.
    </p>
    <a href='/hotels/home'>
    <Button variant="primary">
      Explore Properties
    </Button></a>
  </div>
) : (
  sortedProperties.map((card, idx) => (
    <WishCard key={idx} wishCard={card} />
  ))
)}
        </CardBody>
      </Card>
    </>
  );
};

export default Wishlist;