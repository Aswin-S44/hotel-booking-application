import { SelectFormInput, TextAreaFormInput, TextFormInput } from '@/components';
import { Button, Card, CardBody, CardHeader, Col, Image } from 'react-bootstrap';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';

import axios from 'axios';
import avatar1 from '@/assets/images/avatar/01.jpg';
import Flatpicker from '@/components/Flatpicker';

const PersonalInformation = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profileImagePath, setProfileImagePath] = useState(null);






  const informationSchema = yup.object({
    name: yup.string().required('Please enter your full name'),
    email: yup.string().email('Please enter a valid email').required('Please enter your email'),
    mobileNo: yup.number().required('Please enter your mobile number'),
    address: yup.string().required('Please enter your address')
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch
  } = useForm({
    resolver: yupResolver(informationSchema),
    defaultValues: {
      name: 'Jacqueline Miller',
      email: 'hello@gmail.com',
      mobileNo: 222555666,
      address: '2119 N Division Ave, New Hampshire, York, United States',
      nationality: '',
      dateOfBirth: '',
      gender: 'Male'
    }
  });



  useEffect(() => {
    fetchProfile();
  }, []);

const fetchProfile = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/v1/customer/profile/details",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    if (!res.data || res.data.status === false) {
      console.log("User not authenticated or profile not found");
      return;
    }

    const data = res.data.data;

    if (!data) return;

    setValue("name", data.fullName || "");
    setValue("email", data.email || "");
    setValue("mobileNo", data.mobileNumber || "");
    setValue("address", data.address || "");
    setValue("nationality", data.nationality || "");
    setValue("dateOfBirth", data.dateOfBirth || "");
    setValue("gender", data.gender || "Male");

    if (data.profileImage) {
      setProfileImagePath(data.profileImage);
    }

  } catch (error) {
    console.log("Profile fetch error:", error.response?.data || error.message);
  }
};


  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("fullName", data.name);
      formData.append("email", data.email);
      formData.append("mobileNumber", data.mobileNo);
      formData.append("address", data.address);
      formData.append("nationality", data.nationality);
      formData.append("dateOfBirth", data.dateOfBirth);
      formData.append("gender", data.gender);

      if (selectedFile) {
        formData.append("profileImage", selectedFile);
      }

      await axios.put("http://localhost:5000/api/v1/customer/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      await fetchProfile();
      alert("Profile updated successfully");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
              <label className="position-relative me-4" htmlFor="uploadfile-1" title="Replace this pic">
                <span className="avatar avatar-xl">
                  <Image
                    className="avatar-img rounded-circle border border-white border-3 shadow"
                    src={
                      selectedFile
                        ? URL.createObjectURL(selectedFile)
                        : profileImagePath
                          ? `http://localhost:5000/${profileImagePath}`
                          : avatar1
                    }

                  />
                </span>
              </label>

              <label className="btn btn-sm btn-primary-soft mb-0" htmlFor="uploadfile-1">
                Change
              </label>
              <input
                id="uploadfile-1"
                className="form-control d-none"
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </div>
          </Col>

          <TextFormInput name="name" label="Full Name*" placeholder="Enter your full name" containerClass="col-md-6" control={control} />
          <TextFormInput name="email" type="email" label="Email address*" placeholder="Enter your email id" containerClass="col-md-6" control={control} />
          <TextFormInput name="mobileNo" label="Mobile number*" placeholder="Enter your mobile number" containerClass="col-md-6" control={control} />

          <Col md={6}>
            <label className="form-label">
              Nationality<span className="text-danger">*</span>
            </label>
            <SelectFormInput
              className="form-select"
              onChange={(e) => setValue("nationality", e.target.value)}
            >
              <option value="">Select your country</option>
              <option value="USA">USA</option>
              <option value="Paris">Paris</option>
              <option value="India">India</option>
              <option value="UK">UK</option>
            </SelectFormInput>
          </Col>

          <Col md={6}>
            <label className="form-label">
              Date of Birth<span className="text-danger">*</span>
            </label>
            <Flatpicker
              placeholder="Enter date of birth"
              options={{ dateFormat: 'Y-m-d' }}
              onChange={(date) => setValue("dateOfBirth", date[0])}
            />
          </Col>

          <Col md={6}>
            <label className="form-label">
              Select Gender<span className="text-danger">*</span>
            </label>
            <div className="d-flex gap-4">
              {["Male", "Female", "Others"].map((item) => (
                <div className="form-check radio-bg-light" key={item}>
                  <input
                    className="form-check-input"
                    type="radio"
                    value={item}
                    checked={watch("gender") === item}
                    onChange={(e) => setValue("gender", e.target.value)}
                  />
                  <label className="form-check-label">
                    {item}
                  </label>
                </div>
              ))}
            </div>
          </Col>

          <TextAreaFormInput name="address" label="Address" spellCheck="false" rows={3} containerClass="col-12" control={control} />

          <Col xs={12} className="text-end">
            <Button variant="primary" type="submit" className="mb-0" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </Col>
        </form>
      </CardBody>
    </Card>
  );
};

export default PersonalInformation;
