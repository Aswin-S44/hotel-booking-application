import { NavItem, NavLink } from "react-bootstrap";
import {
  BsBriefcase,
  BsHouseDoor,
  BsPercent,
  BsPersonCircle,
} from "react-icons/bs";
import { Link } from "react-router-dom";
import { RiHotelLine } from "react-icons/ri";
import { RxCalendar } from "react-icons/rx";
const Footer = () => {
  return (
    <div className="navbar navbar-mobile">
      <ul className="navbar-nav">
        <NavItem>
          <NavLink active as={Link} to="/">
            <BsHouseDoor className=" fa-fw" />
            <span className="mb-0 nav-text">Home</span>
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink as={Link} to="/hotels/grid?location=United%20States">
            <RiHotelLine className=" fa-fw" />
            <span className="mb-0 nav-text">Hotels</span>
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink as={Link} to="/user/bookings">
            <BsBriefcase className=" fa-fw" />
            <span className="mb-0 nav-text">Bookings</span>
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink as={Link} to="/customer/profile">
            <BsPersonCircle className=" fa-fw" />
            <span className="mb-0 nav-text">Account</span>
          </NavLink>
        </NavItem>
      </ul>
    </div>
  );
};
export default Footer;
