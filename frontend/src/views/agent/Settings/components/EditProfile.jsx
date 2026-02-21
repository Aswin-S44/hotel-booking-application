import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Image,
  Row,
  Spinner,
} from "react-bootstrap";
import { TextFormInput, FileFormInput } from "@/components";
import { Link } from "react-router-dom";
import UpdateEmail from "./UpdateEmail";
import UpdatePassword from "./UpdatePassword";
import Flatpicker from "@/components/Flatpicker";
import { useAuthContext } from "../../../../states/useAuthContext";
import { toast } from "react-hot-toast";
import { DEFAULT_AVATAR_IMAGE } from "../../../../constants/images";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../../../config/env";

const EditProfile = () => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [birthday, setBirthday] = useState(new Date());
  const [preview, setPreview] = useState(DEFAULT_AVATAR_IMAGE);
  const [submitting, setSubmitting] = useState(false);

  const profileSchema = yup.object({
    name: yup.string().required("Please enter your full name"),
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Please enter your email"),
    mobileNo: yup
      .string()
      .required("Please enter your mobile number")
      .matches(/^[0-9]+$/, "Mobile number must contain only digits")
      .min(10, "Mobile number must be at least 10 digits")
      .max(12, "Invalid mobile number"),
    location: yup.string().required("Please enter your location"),
    avatar: yup.mixed().nullable(),
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      mobileNo: "",
      location: "",
      avatar: null,
    },
  });

  const avatarFile = watch("avatar");

  useEffect(() => {
    if (avatarFile && avatarFile.length > 0) {
      const file = avatarFile[0];
      if (file instanceof File) {
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      }
    }
  }, [avatarFile]);

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

        if (response.ok) {
          reset({
            name: data.name || "",
            email: data.email || "",
            mobileNo: data.contactNumber || "",
            location: data.location || "",
            avatar: null,
          });
          if (data.birthday) setBirthday(new Date(data.birthday));
          setPreview(data.avatar || DEFAULT_AVATAR_IMAGE);
        }
      } catch (error) {
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [reset]);

  // Helper to convert file to base64 for JSON transmission
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const onSubmit = async (data) => {
    const token = localStorage.getItem("token");
    try {
      const url = `${API_BASE_URL}/api/v1/shops/profile`;

      // Construct plain JSON object
      const payload = {
        name: data.name,
        contactNumber: data.mobileNo,
        location: data.location,
        birthday: birthday.toISOString(),
      };

      // If a new avatar is selected, convert to base64 string
      if (avatarFile && avatarFile[0]) {
        payload.avatar = await toBase64(avatarFile[0]);
      }
      setSubmitting(true);
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      setSubmitting(false);
      if (response.ok) {
        Swal.fire({
          title: "Good job!",
          text: "You profile updated!",
          icon: "success",
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred during update");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Row className="g-4">
      <Col xs={12}>
        <Card className="border">
          <CardHeader className="border-bottom">
            <h5 className="card-header-title">Edit Profile</h5>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextFormInput
                name="name"
                label="Name *"
                placeholder="Name"
                containerClass="mb-3"
                control={control}
              />

              <div className="mb-3">
                <label className="form-label">Profile picture *</label>
                <div className="d-flex align-items-center">
                  <span className="avatar avatar-xl me-4 flex-shrink-0">
                    <Image
                      className="avatar-img rounded-circle border border-white border-3 shadow"
                      src={preview}
                      alt="avatar"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                    />
                  </span>
                  <div className="flex-grow-1">
                    <FileFormInput
                      name="avatar"
                      control={control}
                      label="Change Profile Picture"
                      showPreview={false}
                    />
                  </div>
                </div>
              </div>

              <TextFormInput
                name="email"
                type="email"
                label="Email id *"
                placeholder="Enter your email id"
                containerClass="mb-3"
                control={control}
                readOnly
              />
              <TextFormInput
                name="mobileNo"
                label="Mobile number *"
                placeholder="Enter your mobile number"
                containerClass="mb-3"
                control={control}
              />
              <TextFormInput
                name="location"
                label="Location *"
                placeholder="Enter your location"
                containerClass="mb-3"
                control={control}
              />
              <div>
                <label className="form-label">Birthday</label>
                <Flatpicker
                  placeholder="Enter your birth-date"
                  onChange={(date) => setBirthday(date[0])}
                  options={{
                    dateFormat: "d M Y",
                    defaultDate: birthday,
                  }}
                />
              </div>
              <div className="d-flex justify-content-end mt-4">
                <Link to="" className="btn text-secondary border-0 me-2">
                  Discard
                </Link>
                <Button variant="primary" type="submit" disabled={submitting}>
                  {submitting ? <>Please wait....</> : <> Save change</>}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </Col>
      <Col md={6}>
        <UpdateEmail />
      </Col>
      <Col md={6}>
        <UpdatePassword />
      </Col>
    </Row>
  );
};

export default EditProfile;
