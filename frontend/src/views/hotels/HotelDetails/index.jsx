import { PageMetaData } from "@/components";
import AboutHotel from "./components/AboutHotel";
import AvailabilityFilter from "./components/AvailabilityFilter";
import FooterWithLinks from "./components/FooterWithLinks";
import HotelGallery from "./components/HotelGallery";
import TopNavBar4 from "./components/TopNavBar4";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
const HotelDetails = () => {
  const { id } = useParams();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchHotelDetails = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/v1/customer/property/${id}`
          );
          const result = await response.json();
          console.log("result----------", result ? result : "no result");
          if (result && result.data) {
            setHotel(result.data);
          }
        } catch (error) {
          console.error("Error fetching hotels:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchHotelDetails();
    }
  }, [id]);

  if (loading) return null;

  return (
    <>
      <PageMetaData title="Hotel - Details" />

      <TopNavBar4 />

      <main>
        {loading ? (
          <>Loading</>
        ) : !hotel ? (
          <>No details found</>
        ) : (
          <>
            <AvailabilityFilter />
            <HotelGallery
              hotelDetails={{
                name: hotel?.listingName,
                address: hotel?.location,
              }}
              gallery={hotel?.gallery}
            />

            <AboutHotel
              hotelDetails={{
                about: hotel?.shortDescription,
                amenities: hotel?.amenities ?? [],
                rate: hotel?.basePrice,
                rating: hotel?.starRating ?? 0,
                totalRooms: hotel?.rooms?.length ?? 0,
                rooms: hotel?.rooms,
              }}
            />
          </>
        )}
      </main>

      <FooterWithLinks />
    </>
  );
};
export default HotelDetails;
