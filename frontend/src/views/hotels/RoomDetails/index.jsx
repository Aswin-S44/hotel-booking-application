import { PageMetaData } from "@/components";
import FooterWithLinks from "./components/FooterWithLinks";
import RoomGallery from "./components/RoomGallery";
import RoomSelection from "./components/RoomSelection";
import TopNavBar4 from "./components/TopNavBar4";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import HotelMediaGallery from "../HotelDetails/components/HotelMediaGallery";
import axios from "axios";

const RoomDetails = () => {
  const location = useLocation();
  const { id: propertyId } = useParams();
  const roomDetails = location.state?.rooms;

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);

const roomId = location.pathname.split("/").pop();
  const [room, setRoom] = useState([]);

  
console.log("++++++++++++", room);


  useEffect(() => {
    const getRoomDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/customer/rooms/${roomId}`
        );
console.log("getRoomDetails response",response);


        // If API returns single room → wrap in array
        setRoom([response.data.data]);
      } catch (error) {
        console.error("Error fetching room:", error);
      }
    };

    if (roomId) {
      getRoomDetails();
    }
  }, [roomId]);




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
      <TopNavBar4 />
      <main>
        {/* <RoomGallery images={images ?? []} /> */}
        <HotelMediaGallery gallery={images} />
        <RoomSelection rooms={roomDetails ?? []} />
      </main>
      <FooterWithLinks />
    </>
  );
};

export default RoomDetails;
