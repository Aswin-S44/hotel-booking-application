import { useState, useMemo } from "react";
import { SelectFormInput } from "@/components";
import { Card, CardBody, CardHeader, Col } from "react-bootstrap";
import RoomCard from "./RoomCard";
import { hotelRooms } from "../data";

const RoomOptions = ({ rooms, features }) => {
  const [sortBy, setSortBy] = useState("-1");

  const sortedRooms = useMemo(() => {
    if (!rooms) return [];
    const roomsCopy = [...rooms];

    if (sortBy === "Most popular") {
      // Sort by high discount first
      return roomsCopy.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    }

    if (sortBy === "Top rated") {
      // Sort by less price (ascending)
      return roomsCopy.sort((a, b) => (a.price || 0) - (b.price || 0));
    }

    return roomsCopy;
  }, [rooms, sortBy]);

  return (
    <Card className="bg-transparent" id="room-options">
      <CardHeader className="border-bottom bg-transparent px-0 pt-0">
        <div className="d-sm-flex justify-content-sm-between align-items-center">
          <h3 className="mb-2 mb-sm-0">Room Options</h3>
          <Col sm={4}>
            <form className="form-control-bg-light">
              <SelectFormInput
                className="form-select form-select-sm js-choice border-0"
                value={sortBy}
                onChange={(val) => setSortBy(val)}
              >
                <option value="-1">Select Option</option>
                {/* <option>Recently search</option> */}
                <option value="Most popular">Most popular</option>
                <option value="Top rated">Top rated</option>
              </SelectFormInput>
            </form>
          </Col>
        </div>
      </CardHeader>
      <CardBody className="pt-4 p-0">
        <div className="vstack gap-4">
          {/* {hotelRooms.map((room, idx) => {
            return (
              <RoomCard
                key={idx}
                features={room.features}
                images={room.images}
                id={room.id}
                name={room.name}
                price={room.price}
                sale={room.sale}
                schemes={room.schemes}
              />
            );
          })} */}

          {sortedRooms.map((room, idx) => {
            return (
              <RoomCard
                key={room._id || idx}
                features={features ?? []}
                images={[room?.roomThumbnail]}
                room={room}
                id={room._id}
                name={room?.roomName ?? ""}
                price={room?.price ?? 0}
                sale={room.isAvailable}
                schemes={""}
                rooms={rooms}
              />
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};
export default RoomOptions;
