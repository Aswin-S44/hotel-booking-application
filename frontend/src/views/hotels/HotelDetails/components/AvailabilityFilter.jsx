import { SelectFormInput } from '@/components';
import Flatpicker from '@/components/Flatpicker';
import { useToggle } from '@/hooks';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Col, Container, Dropdown, DropdownDivider, DropdownMenu, DropdownToggle, Offcanvas, OffcanvasHeader } from 'react-bootstrap';
import { BsDashCircle, BsPencilSquare, BsPlusCircle, BsSearch } from 'react-icons/bs';
import { useNavigate, useSearchParams } from 'react-router-dom';
const AvailabilityFilter = () => {
  const {
    isOpen,
    toggle
  } = useToggle();
  const initialValue = {
    location: 'San Jacinto, USA',
    stayFor: [new Date(), new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)],
    guests: {
      adults: 2,
      rooms: 1,
      children: 0
    }
  };
   const [formValue, setFormValue] = useState(() => {
    const stored = localStorage.getItem('searchData');
    return stored ? JSON.parse(stored) : initialValue;
  });
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();


useEffect(() => {
  localStorage.setItem('searchData', JSON.stringify(formValue));
}, [formValue]);

useEffect(() => {
  const locationFromUrl = searchParams.get("location");
  if (locationFromUrl) {
    setFormValue((prev) => ({
      ...prev,
      location: locationFromUrl,
    }));
  }
}, [searchParams]);



  const updateGuests = (type, increase = true) => {
    const val = formValue.guests[type];
    setFormValue({
      ...formValue,
      guests: {
        ...formValue.guests,
        [type]: increase ? val + 1 : val > 1 ? val - 1 : 0
      }
    });
  };
  const getGuestsValue = () => {
    let value = '';
    const guests = formValue.guests;
    if (guests.adults) {
      value += guests.adults + (guests.adults > 1 ? ' Adults ' : ' Adult ');
    }
    if (guests.children) {
      value += guests.children + (guests.children > 1 ? ' Children ' : ' Child ');
    }
    if (guests.rooms) {
      value += guests.rooms + (guests.rooms > 1 ? ' Rooms ' : ' Room ');
    }
    return value;
  };
  const FilterInput = () => {




  const handleSearch = async (e) => {
    e.preventDefault();

    if (!formValue.location || formValue.location === "-1") {
      alert("Please select a location");
      return;
    }
    console.log("Selected location:", formValue.location);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/customer/search-location`,
        {
          params: {
            location: formValue.location,
          },
        }
      );

      console.log("Search Result:", response.data);

      navigate(`/hotels/grid?location=${formValue.location}`, {
        state: { hotels: response.data.data },
      });

    } catch (error) {
      console.error("Search error:", error);
    }
  };





    return <div className="bg-light p-4 rounded w-100">
      <form className="row g-4">
        <Col md={6} lg={4}>
          <div className="form-size-lg form-fs-md">
            <label className="form-label">Location</label>
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
              <option value="San Jacinto, USA">San Jacinto, USA</option>
              <option value="North Dakota, Canada">North Dakota, Canada</option>
              <option value="West Virginia, Paris">West Virginia, Paris</option>
              <option value="United States">United States</option>
            </SelectFormInput>
          </div>
        </Col>
        <Col md={6} lg={3}>
          <div className="form-fs-md">
            <label className="form-label">Check in - out</label>
            <Flatpicker value={formValue.stayFor} getValue={val => setFormValue({
              ...formValue,
              stayFor: val
            })} options={{
              mode: 'range',
              dateFormat: 'd M'
            }} className="form-control-lg" />
          </div>
        </Col>
        <Col md={6} lg={3}>
          <div className="form-fs-md">
            <div className="w-100">
              <label className="form-label">Guests &amp; rooms</label>
              <Dropdown className="guest-selector me-2">
                <DropdownToggle as="input" className="form-guest-selector form-control-lg form-control selection-result" value={getGuestsValue()} onChange={() => { }} />
                <DropdownMenu className="guest-selector-dropdown">
                  <li className="d-flex justify-content-between">
                    <div>
                      <h6 className="mb-0">Adults</h6>
                      <small>Ages 13 or above</small>
                    </div>
                    <div className="hstack gap-1 align-items-center">
                      <Button variant="link" className="adult-remove p-0 mb-0" onClick={() => updateGuests('adults', false)}>
                        <BsDashCircle className=" fs-5 fa-fw" />
                      </Button>
                      <h6 className="guest-selector-count mb-0 adults">{formValue.guests.adults ?? 0}</h6>
                      <Button variant="link" className="adult-add p-0 mb-0" onClick={() => updateGuests('adults')}>
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
                      <Button variant="link" type="button" className="btn btn-link child-remove p-0 mb-0" onClick={() => updateGuests('children', false)}>
                        <BsDashCircle className="fs-5 fa-fw" />
                      </Button>
                      <h6 className="guest-selector-count mb-0 child">{formValue.guests.children ?? 0}</h6>
                      <Button variant="link" type="button" className="btn btn-link child-add p-0 mb-0" onClick={() => updateGuests('children')}>
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
                      <Button variant="link" type="button" className="room-remove p-0 mb-0" onClick={() => updateGuests('rooms', false)}>
                        <BsDashCircle className=" fs-5 fa-fw" />
                      </Button>
                      <h6 className="guest-selector-count mb-0 rooms">{formValue.guests.rooms ?? 0}</h6>
                      <Button variant="link" type="button" className="btn btn-link room-add p-0 mb-0" onClick={() => updateGuests('rooms')}>
                        <BsPlusCircle className=" fs-5 fa-fw" />
                      </Button>
                    </div>
                  </li>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </Col>
        <Col md={6} lg={2} className="mt-md-auto">
          <Button onClick={handleSearch} variant="primary" size="lg" className="w-100 mb-0 flex-centered" href="">
            <BsSearch className="fa-fw me-1" />
            Search
          </Button>
        </Col>
      </form>
    </div>;
  };
  return <div className="py-3 py-sm-0">
    <Container>
      <div className="d-none d-sm-block">
        <FilterInput />
      </div>
      <Button variant="primary" onClick={toggle} className="d-sm-none w-100 mb-0" type="button">
        <BsPencilSquare className=" me-2" />
        Edit Search
      </Button>
      <Offcanvas show={isOpen} onHide={toggle} placement="top" className="offcanvas-sm" tabIndex={-1}>
        <OffcanvasHeader>
          <h5 className="offcanvas-title" id="offcanvasEditsearchLabel">
            Edit search
          </h5>
          <button type="button" onClick={toggle} className="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#offcanvasEditsearch" aria-label="Close" />
        </OffcanvasHeader>
        <div className="offcanvas-body p-2">
          <FilterInput />
        </div>
      </Offcanvas>
    </Container>
  </div>;
};
export default AvailabilityFilter;