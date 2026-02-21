import { useState } from "react";
import { PasswordFormInput, TextFormInput } from "@/components";
import { Col } from "react-bootstrap";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import signInImg from "@/assets/images/element/signin.svg";
import logoIcon from "@/assets/images/logo-icon.svg";
import logo from "../../../assets/images/logo.png";

import { developedByLink, currentYear } from "@/states";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useAuthContext } from "../../../states/useAuthContext";
import axios from "axios";
import { signInWithGoogle } from "@/firebase";
import { API_BASE_URL } from "../../../config/env";

const SignIn = () => {
  const navigate = useNavigate();
  const { saveSession } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (result.status === 200) {
        const sessionData = {
          ...result.user,
          token: result.token,
        };

        saveSession(sessionData);

        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome back!",
          timer: 2000,
          showConfirmButton: false,
        });

        if (result?.user?.role === "customer") {
          navigate("/");
        } else if (result?.user?.role === "admin") {
          navigate("/agent/dashboard");
        } else {
          navigate("/auth/sign-in");
        }

        // navigate("/agent/dashboard");
      } else {
        Swal.fire({
          icon: "error",
          title: "Authentication Failed",
          text: result.message || "Invalid email or password",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const idToken = await signInWithGoogle();

      const res = await axios.post(
        `${API_BASE_URL}/api/v1/auth/google-login`,
        { idToken },
        { withCredentials: true }
      );

      // if (res.status === 200) {
      //   saveSession({
      //     ...res.data.user,
      //     token: res.data.token,
      //   });

      //   Swal.fire({
      //     icon: "success",
      //     title: "Login Successful",
      //     timer: 1500,
      //     showConfirmButton: false,
      //   });

      //   navigate("/agent/dashboard");
      // }
    } catch (error) {
      console.error("Google login failed:", error);

      Swal.fire({
        icon: "error",
        title: "Google Login Failed",
        text: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Col lg={6} className="d-flex align-items-center order-2 order-lg-1">
        <div className="p-3 p-lg-5">
          <img src={signInImg} alt="signin" />
        </div>
        <div className="vr opacity-1 d-none d-lg-block" />
      </Col>

      <Col lg={6} className="order-1">
        <div className="p-4 p-sm-7">
          <Link to="/">
            <img className="h-50px mb-4" src={logo} alt="logo" />
          </Link>

          <h1 className="mb-2 h3">Welcome back</h1>
          <p className="mb-0">
            New here?<Link to="/auth/sign-up"> Create an account</Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 text-start">
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

            <div className="mb-3 d-sm-flex justify-content-between">
              <div className="d-flex gap-1">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="rememberCheck"
                />
                <label className="form-check-label" htmlFor="rememberCheck">
                  Remember me?
                </label>
              </div>
              <Link to="/auth/forgot-password">Forgot password?</Link>
            </div>

            <div>
              <button
                type="submit"
                className="btn btn-primary w-100 mb-0"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

            <div className="position-relative my-4">
              <hr />
              <p className="small bg-mode position-absolute top-50 start-50 translate-middle px-2">
                Or sign in with
              </p>
            </div>

            <div className="vstack gap-3">
              <button
                type="button"
                className="btn btn-light mb-0"
                onClick={handleGoogleLogin}
              >
                <FcGoogle size={16} className="fab fa-fw me-2" />
                Continue with Google
              </button>
              {/* <button type="button" className="btn btn-light mb-0">
                <FaFacebookF
                  size={16}
                  className="fab fa-fw text-facebook me-2"
                />
                Continue with Facebook
              </button> */}
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
      </Col>
    </>
  );
};

export default SignIn;
