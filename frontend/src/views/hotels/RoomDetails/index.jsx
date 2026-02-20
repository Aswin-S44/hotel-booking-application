import { PageMetaData } from "@/components";
import FooterWithLinks from "./components/FooterWithLinks";
import RoomGallery from "./components/RoomGallery";
import RoomSelection from "./components/RoomSelection";
import TopNavBar4 from "./components/TopNavBar4";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import HotelMediaGallery from "../HotelDetails/components/HotelMediaGallery";
import axios from "axios";
import TopNavBar from "../Home/components/TopNavBar";
import Footer from "../Home/components/Footer";

const RoomDetails = () => {
  const location = useLocation();
  const { id: propertyId } = useParams();
  const roomDetails = location.state?.rooms;
  const [rooms, setRooms] = useState([]);
  const [roomsDetail, setRoomsDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const roomId = location.pathname.split("/").pop();
  const [room, setRoom] = useState([]);
  const passignData = [roomsDetail[0]?.room.roomThumbnail || ""];

console.log("idid",id,roomId);


  useEffect(() => {
    const getRoomDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/customer/rooms/${roomId}`
        );

        // If API returns single room → wrap in array
        setRoom([response.data.data]);
        setRoomsDetail([response.data.data]);
      } catch (error) {
        console.error("Error fetching room:", error);
      }
    };

    if (roomId) {
      getRoomDetails();
    }
  }, [roomId]);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  useEffect(() => {
    if (rooms.length > 0) {
      const roomImages = rooms
        .map((room) => room.roomThumbnail)
        .filter(Boolean);

      setImages(roomImages);
    }
  }, [rooms]);

  if (loading) return null;

  return (
    <>
      <PageMetaData title="Hotel - Room Details" />
      <TopNavBar />
      <main>
        {/* <RoomGallery images={images ?? []} /> */}

        {!isMobile && <HotelMediaGallery gallery={passignData} />}

        <RoomSelection rooms={roomDetails ?? []} />
      </main>
      <FooterWithLinks />
      <Footer />
    </>
  );
};

export default RoomDetails;
