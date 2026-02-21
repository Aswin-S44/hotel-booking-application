import {
  Card,
  CardBody,
  Image,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { BsPencilSquare } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";
import { getUserMenuItems } from "@/helpers/menu";
import { FaSignOutAlt } from "react-icons/fa";
import clsx from "clsx";
import { useAuthContext } from "@/states";
import avatar1 from "@/assets/images/avatar/01.jpg";
import { useEffect, useState } from "react";
import { DEFAULT_AVATAR_IMAGE } from "../../constants/images";
import { API_BASE_URL } from "../../config/env";
const LeftPanel = () => {
  const { pathname } = useLocation();
  const { removeSession } = useAuthContext();
  const menuItems = getUserMenuItems();
  const [preview, setPreview] = useState(DEFAULT_AVATAR_IMAGE);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (data) {
          setProfile(data);
          setPreview(data.avatar || DEFAULT_AVATAR_IMAGE);
        }
      } catch (error) {
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <Card className="bg-light w-100">
      <div className="position-absolute top-0 end-0 p-3">
        {/* <OverlayTrigger
          overlay={<Tooltip>Edit profile</Tooltip>}
          placement="top"
        >
          <span>
            <BsPencilSquare />
          </span>
        </OverlayTrigger> */}
      </div>
      <CardBody className="p-3">
        <div className="text-center mb-3">
          <div className="avatar avatar-xl mb-2">
            <Image
              className="avatar-img rounded-circle border border-2 border-white"
              src={preview}
            />
          </div>
          <h6 className="mb-0">{profile?.name ?? ""}</h6>
          <Link to="" className="text-reset text-primary-hover small">
            {profile?.email ?? ""}
          </Link>
          <hr />
        </div>
        <ul className="nav nav-pills-primary-soft flex-column">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const activeItem = item.url == pathname;
            return (
              item.url &&
              Icon && (
                <li key={idx} className="nav-item">
                  <Link
                    className={clsx("nav-link items-center", {
                      active: activeItem,
                    })}
                    to={item.url}
                  >
                    <Icon className=" fa-fw me-2" />
                    {item.label}
                  </Link>
                </li>
              )
            );
          })}
          <li role="button" className="nav-item" onClick={removeSession}>
            <Link className="nav-link text-danger bg-danger-soft-hover" to="">
              <FaSignOutAlt className="me-2" />
              Sign Out
            </Link>
          </li>
        </ul>
      </CardBody>
    </Card>
  );
};
export default LeftPanel;
