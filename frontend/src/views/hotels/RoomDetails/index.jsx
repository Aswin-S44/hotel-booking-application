import { PageMetaData } from "@/components";
import FooterWithLinks from "./components/FooterWithLinks";
import RoomGallery from "./components/RoomGallery";
import RoomSelection from "./components/RoomSelection";
import TopNavBar4 from "./components/TopNavBar4";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const RoomDetails = () => {
  const location = useLocation();
  const { id: propertyId } = useParams();
  const roomDetails = location.state?.rooms;

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (propertyId) {
      const fetchHotelRooms = async () => {
        try {
          setLoading(true);
          const response = await fetch(
            `http://localhost:5000/api/v1/customer/rooms/property/${propertyId}`
          );
          const result = await response.json();

          if (result && result.data && result.data?.rooms) {
            setRooms(result.data?.rooms);
          }
        } catch (error) {
          console.error("Error fetching hotels:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchHotelRooms();
    }
  }, [propertyId]);

  const images = rooms.map((room) => room.roomThumbnail).filter(Boolean);
  console.log("images------------", images);
  if (loading) return null;

  return (
    <>
      <PageMetaData title="Hotel - Room Details" />
      <TopNavBar4 />
      <main>
        <RoomGallery images={images ?? []} />
        <RoomSelection rooms={roomDetails ?? []} />
      </main>
      <FooterWithLinks />
    </>
  );
};

export default RoomDetails;
