import Flatpicker from "@/components/Flatpicker";
import { SelectFormInput } from "@/components/form";
import axios from "axios";
import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Dropdown,
  DropdownDivider,
  DropdownMenu,
  DropdownToggle,
  FormLabel,
  Row,
} from "react-bootstrap";
import {
  BsCalendar,
  BsDashCircle,
  BsGeoAlt,
  BsPerson,
  BsPlusCircle,
  BsSearch,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { availableLocations } from "../../../../constants/datas";

const AvailabilityFilter = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialValue = {
    location: "San Jacinto, USA",
    stayFor: [new Date(), new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)],
    guests: {
      adults: 2,
      rooms: 1,
      children: 0,
    },
  };
  const [formValue, setFormValue] = useState(() => {
    const stored = localStorage.getItem("searchData");
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem("searchData", JSON.stringify(formValue));
  }, [formValue]);

  const updateGuests = (type, increase = true) => {
    const val = formValue.guests[type];
    setFormValue({
      ...formValue,
      guests: {
        ...formValue.guests,
        [type]: increase ? val + 1 : val > 1 ? val - 1 : 0,
      },
    });
  };
  const getGuestsValue = () => {
    let value = "";
    const guests = formValue.guests;
    if (guests.adults) {
      value += guests.adults + (guests.adults > 1 ? " Adults " : " Adult ");
    }
    if (guests.children) {
      value +=
        guests.children + (guests.children > 1 ? " Children " : " Child ");
    }
    if (guests.rooms) {
      value += guests.rooms + (guests.rooms > 1 ? " Rooms " : " Room ");
    }
    return value;
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!formValue.location || formValue.location === "-1") {
      alert("Please select a location");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/customer/search-location`,
        {
          params: {
            location: formValue.location,
          },
        }
      );

      navigate(`/hotels/grid?location=${formValue.location}`, {
        state: { hotels: response.data.data },
      });
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  return (
    <Row>
      <Col xl={10} className="position-relative mt-n3 mt-xl-n9">
        <h6 className="d-none d-xl-block mb-3">Checks Availability</h6>

        <Card
          as="form"
          className="shadow rounded-3 position-relative p-4 pe-md-5 pb-5 pb-md-4"
        >
          <Row className="g-4 align-items-center">
            <Col lg={4}>
              <div className="form-control-border form-control-transparent form-fs-md flex-centered gap-2">
                <BsGeoAlt size={37} />

                <div className="flex-grow-1">
                  <FormLabel className="form-label">Location</FormLabel>

                  <SelectFormInput
                    value={formValue.location}
                    onChange={(value) =>
                      setFormValue({
                        ...formValue,
                        location: value,
                      })
                    }
                  >
                    <option value="">Select location</option>

                    {availableLocations.map((item) => (
                      <option key={item.district} value={item.district}>
                        {item.district}
                      </option>
                    ))}
                  </SelectFormInput>
                </div>
              </div>
            </Col>

            <Col lg={4}>
              <div className="flex-centered">
                <div>
                  <BsCalendar size={37} className=" me-2" />
                </div>

                <div className="form-control-border form-control-transparent form-fs-md">
                  <FormLabel className="form-label">Check in - out</FormLabel>
                  <Flatpicker
                    value={formValue.stayFor}
                    getValue={(val) => {
                      setFormValue({
                        ...formValue,
                        stayFor: val,
                      });
                    }}
                    options={{
                      mode: "range",
                      dateFormat: "d M",
                      closeOnSelect: false,
                    }}
                  />
                </div>
              </div>
            </Col>

            <Col lg={4}>
              <div className="form-control-border form-control-transparent form-fs-md flex-centered">
                <div>
                  <BsPerson size={37} className=" me-2" />
                </div>

                <div className="w-100">
                  <label className="form-label">Guests &amp; rooms</label>
                  <Dropdown className="guest-selector me-2">
                    <DropdownToggle
                      as="input"
                      className="form-guest-selector form-control selection-result"
                      value={getGuestsValue()}
                      onChange={() => {}}
                    />

                    <DropdownMenu
                      className="guest-selector-dropdown"
                      renderOnMount
                    >
                      <li className="d-flex justify-content-between">
                        <div>
                          <h6 className="mb-0">Adults</h6>
                          <small>Ages 13 or above</small>
                        </div>
                        <div className="hstack gap-1 align-items-center">
                          <Button
                            variant="link"
                            className="adult-remove p-0 mb-0"
                            onClick={() => updateGuests("adults", false)}
                          >
                            <BsDashCircle className=" fs-5 fa-fw" />
                          </Button>
                          <h6 className="guest-selector-count mb-0 adults">
                            {formValue.guests.adults ?? 0}
                          </h6>
                          <Button
                            variant="link"
                            className="adult-add p-0 mb-0"
                            onClick={() => updateGuests("adults")}
                          >
                            <BsPlusCircle className=" fs-5 fa-fw" />
                          </Button>
                        </div>
                      </li>

                      <DropdownDivider />

                      <li className="d-flex justify-content-between">
                        <div>
                          <h6 className="mb-0">Children</h6>
                          <small>Ages 13 below</small>
                        </div>
                        <div className="hstack gap-1 align-items-center">
                          <Button
                            variant="link"
                            type="button"
                            className="btn btn-link child-remove p-0 mb-0"
                            onClick={() => updateGuests("children", false)}
                          >
                            <BsDashCircle className="  fs-5 fa-fw" />
                          </Button>
                          <h6 className="guest-selector-count mb-0 child">
                            {formValue.guests.children ?? 0}
                          </h6>
                          <Button
                            variant="link"
                            type="button"
                            className="btn btn-link child-add p-0 mb-0"
                            onClick={() => updateGuests("children")}
                          >
                            <BsPlusCircle className=" fs-5 fa-fw" />
                          </Button>
                        </div>
                      </li>

                      <DropdownDivider />

                      <li className="d-flex justify-content-between">
                        <div>
                          <h6 className="mb-0">Rooms</h6>
                          <small>Max room 8</small>
                        </div>
                        <div className="hstack gap-1 align-items-center">
                          <Button
                            variant="link"
                            type="button"
                            className="room-remove p-0 mb-0"
                            onClick={() => updateGuests("rooms", false)}
                          >
                            <BsDashCircle className=" fs-5 fa-fw" />
                          </Button>
                          <h6 className="guest-selector-count mb-0 rooms">
                            {formValue.guests.rooms ?? 0}
                          </h6>
                          <Button
                            variant="link"
                            type="button"
                            className="btn btn-link room-add p-0 mb-0"
                            onClick={() => updateGuests("rooms")}
                          >
                            <BsPlusCircle className=" fs-5 fa-fw" />
                          </Button>
                        </div>
                      </li>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </Col>
          </Row>

          <div className="btn-position-md-middle">
            <button
              type="submit"
              className="icon-lg btn btn-round btn-primary mb-0 flex-centered"
              onClick={handleSearch}
            >
              <BsSearch className=" fa-fw" />
            </button>
          </div>
        </Card>
      </Col>
    </Row>
  );
};
export default AvailabilityFilter;
