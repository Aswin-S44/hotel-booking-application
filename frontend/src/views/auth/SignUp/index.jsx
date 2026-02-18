import { useState } from "react";
import { PasswordFormInput, TextFormInput } from "@/components";
import { Col, Alert, Form } from "react-bootstrap"; // Added Form
import { useForm, Controller } from "react-hook-form"; // Added Controller
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import signInImg from "@/assets/images/element/signin.svg";
import logoIcon from "@/assets/images/logo-icon.svg";
import { developedByLink, currentYear } from "@/states";

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { control, handleSubmit, watch, trigger } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      otp: "",
    },
    mode: "onChange", // Helps with real-time validation
  });

  const emailValue = watch("email");

  const onSendOTP = async (data) => {
    // Validate first step fields before proceeding
    const isStep1Valid = await trigger([
      "name",
      "email",
      "password",
      "confirmPassword",
    ]);
    if (!isStep1Valid) return;

    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:5000/api/v1/auth/send-otp", {
        email: data.email,
      });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const onVerifyAndSignUp = async (data) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/verify-otp",
        {
          name: data.name,
          email: data.email,
          password: data.password,
          otp: data.otp,
        }
      );
      if (response.data) {
        navigate("/auth/sign-in");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Col lg={6} className="d-md-flex align-items-center order-2 order-lg-1">
        <div className="p-3 p-lg-5">
          <img src={signInImg} alt="signin" />
        </div>
        <div className="vr opacity-1 d-none d-lg-block" />
      </Col>

        <form onSubmit={onSubmit} className="mt-4 text-start">
          <TextFormInput name="email" containerClass="mb-3" label="Enter email id" type="email" control={control} />

          <PasswordFormInput name="password" containerClass="mb-3" label="Enter password" control={control} />

          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}

          <form
            onSubmit={
              step === 1
                ? handleSubmit(onSendOTP)
                : handleSubmit(onVerifyAndSignUp)
            }
            className="mt-4 text-start"
          >
            {step === 1 ? (
              <>
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
                  {loading ? "Sending..." : "Send Verification Code"}
                </button>
              </>
            ) : (
              <>
                <p className="text-muted">
                  Enter the 6-digit code sent to <strong>{emailValue}</strong>
                </p>

                {/* Replaced TextFormInput with direct Controller for OTP to fix typing issue */}
                <Form.Group className="mb-3">
                  <Form.Label>Enter OTP</Form.Label>
                  <Controller
                    name="otp"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        type="text"
                        placeholder="000000"
                        autoFocus // Automatically focus when step 2 opens
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    )}
                  />
                </Form.Group>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-100 mb-0"
                >
                  {loading ? "Verifying..." : "Verify & Create Account"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn btn-link w-100 mt-2"
                >
                  Back to Edit Details
                </button>
              </>
            )}

            {step === 1 && (
              <>
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
                  <button type="button" className="btn btn-light mb-0">
                    <FaFacebookF
                      size={16}
                      className="fab fa-fw text-facebook me-2"
                    />
                    Continue with Facebook
                  </button>
                </div>
              </>
            )}

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

export default SignUp;
