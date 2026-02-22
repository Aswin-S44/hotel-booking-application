import { useState } from "react";
import { PasswordFormInput, TextFormInput } from "@/components";
import { Col, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import signInImg from "@/assets/images/element/signin.svg";
import logoIcon from "../../../assets/images/logo.png";
import { developedByLink, currentYear } from "@/states";
import { API_BASE_URL } from "../../../config/env";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/signup`, {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (response.status === 200) {
        navigate("/auth/sign-in");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Col lg={6} className="d-md-flex align-items-center order-2 order-lg-1">
        <div className="p-3 p-lg-5">
          <img src={signInImg} alt="signin"  />
        </div>
        <div className="vr opacity-1 d-none d-lg-block" />
      </Col>

      <div className="col-lg-6 order-1">
        <div className="p-3 p-lg-5">
          <a href="/hotels/home">
          <img src={logoIcon} className="h-40px mb-4" alt="logo"  style={{
    filter: "drop-shadow(2px 0 0 white) drop-shadow(-2px 0 0 white) drop-shadow(0 2px 0 white) drop-shadow(0 -2px 0 white)"
  }} /></a>
          <h1 className="fs-2">Create New Account</h1>
          <p className="mb-0">
            Already a member?<Link to="/auth/sign-in"> Log in</Link>
          </p>

          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 text-start">
            <TextFormInput
              name="name"
              containerClass="mb-3"
              label="Full Name"
              type="text"
              control={control}
            />
            <TextFormInput
              name="email"
              containerClass="mb-3"
              label="Enter email id"
              type="email"
              control={control}
            />
            <PasswordFormInput
              name="password"
              containerClass="mb-3"
              label="Enter password"
              control={control}
            />
            <PasswordFormInput
              name="confirmPassword"
              containerClass="mb-3"
              label="Confirm password"
              control={control}
            />

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100 mb-0"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <div className="position-relative my-4">
              <hr />
              <p className="small position-absolute top-50 start-50 translate-middle bg-mode px-1 px-sm-2">
                Or sign in with
              </p>
            </div>

            <div className="vstack gap-3">
              <button type="button" className="btn btn-light mb-0">
                <FcGoogle size={16} className="fab fa-fw me-2" />
                Continue with Google
              </button>
            </div>

            <div className="text-primary-hover text-body mt-3 text-center">
              Copyrights ©{currentYear} Booking. Build by{" "}
              <a
                href={developedByLink}
                target="_blank"
                rel="noreferrer"
                className="text-body"
              >
                StackBros
              </a>
              .
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
