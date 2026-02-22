import {
  SelectFormInput,
  TextAreaFormInput,
  TextFormInput,
} from "@/components";
import Swal from "sweetalert2";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Image,
} from "react-bootstrap";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

import axios from "axios";
import avatar1 from "@/assets/images/avatar/01.jpg";
import Flatpicker from "@/components/Flatpicker";
import { DEFAULT_AVATAR_IMAGE } from "../../../../constants/images";
import { API_BASE_URL } from "../../../../config/env";

const CustomerInformation = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profileImagePath, setProfileImagePath] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [providor, setProvidor] = useState();
  const [preview, setPreview] = useState(DEFAULT_AVATAR_IMAGE);

  const informationSchema = yup.object({
    name: yup.string().required("Please enter your full name"),
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Please enter your email"),
  });

  const { control, handleSubmit, setValue, watch } = useForm({
    resolver: yupResolver(informationSchema),
    defaultValues: {
      name: "",
      email: "",
      contactNumber: "",
      location: "",
      birthday: "",
    },
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  // Update preview when a new file is selected
  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedFile]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE_URL}/api/v1/customer/profile/details`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setLoading(false);
      if (!res.data || res.data.status !== 200) {
        return;
      }

      const data = res.data.data;
console.log("data>>>>>>>>>>>>",data);

      if (!data) return;
setProvidor(data.providor)
      // Prefilling data based on your API response structure
      setValue("name", data.name || "");
      setValue("email", data.email || "");
      setValue("contactNumber", data.contactNumber || "");
      setValue("location", data.location || "");

      if (data.birthday) {
        setValue("birthday", data.birthday.split("T")[0]);
      }

      if (data.avatar) {
        setProfileImagePath(data.avatar);
        setPreview(data.avatar);
      }
    } catch (error) {
      console.log(
        "Profile fetch error:",
        error.response?.data || error.message
      );
    }
  };

  // Helper to convert file to base64 for JSON transmission
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const payload = {
        name: data.name,
        contactNumber: data.contactNumber,
        location: data.location,
        birthday: data.birthday,
      };

      // If a new file is selected, convert to base64 string
      if (selectedFile) {
        payload.avatar = await toBase64(selectedFile);
      }

      await axios.patch(`${API_BASE_URL}/api/v1/auth/profile`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSubmitting(false);
      await fetchProfile();
      Swal.fire({
        title: "Good job!",
        text: "You profile updated!",
        icon: "success",
      });
    } catch (error) {
      setSubmitting(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Something went wrong!",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <>Loading....</>;
  }

  return (
    <Card className="border">
      <CardHeader className="border-bottom">
        <h4 className="card-header-title">Personal Information</h4>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
          <Col xs={12}>
            <label className="form-label">
              Upload your profile photo<span className="text-danger">*</span>
            </label>
            <div className="d-flex align-items-center">
              <label
                className="position-relative me-4"
                htmlFor="uploadfile-1"
                title="Replace this pic"
              >
                <span className="avatar avatar-xl">
                  <Image
                    className="avatar-img rounded-circle border border-white border-3 shadow"
                    src={preview}
                    onError={(e) => {
                      e.target.src = DEFAULT_AVATAR_IMAGE;
                    }}
                  />
                </span>
              </label>

              <label
                className="btn btn-sm btn-primary-soft mb-0"
                htmlFor="uploadfile-1"
              >
                Change
              </label>
              <input
                id="uploadfile-1"
                className="form-control d-none"
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </div>
          </Col>

          <TextFormInput
            name="name"
            label="Full Name*"
            placeholder="Enter your full name"
            containerClass="col-md-6"
            control={control}
          />
          <TextFormInput
            name="email"
            type="email"
            label="Email address*"
            placeholder="Enter your email id"
            containerClass="col-md-6"
            control={control}
            readOnly
          />
          <TextFormInput
            name="contactNumber"
            label="Mobile number*"
            placeholder="Enter your mobile number"
            containerClass="col-md-6"
            control={control}
          />

          <Col md={6}>
            <label className="form-label">
              Date of Birth<span className="text-danger">*</span>
            </label>
            <Flatpicker
              value={watch("birthday")}
              placeholder="Enter date of birth"
              options={{ dateFormat: "Y-m-d" }}
              onChange={(selectedDates, dateStr) => {
                setValue("birthday", dateStr);
              }}
            />
          </Col>

          <TextAreaFormInput
            name="location"
            label="location"
            spellCheck="false"
            rows={3}
            containerClass="col-12"
            control={control}
          />

          <Col xs={12} className="text-end">
            <Button
              variant="primary"
              type="submit"
              className="mb-0"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </Col>
        </form>
      </CardBody>
    </Card>
  );
};

export default CustomerInformation;
