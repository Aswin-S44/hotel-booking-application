import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, CardHeader, Spinner } from "react-bootstrap";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { TextFormInput } from "@/components";
import { useAuthContext } from "../../../../states/useAuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../../../config/env";

const UpdateEmail = () => {
  const { user } = useAuthContext();
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);


console.log("user>>>>>>>>>>>",user?.provider);



  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const emailSchema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    otp: yup.string().when("otpSent", {
      is: true,
      then: (schema) =>
        schema.required("OTP is required").length(6, "OTP must be 6 digits"),
    }),
  });

  const { control, handleSubmit, watch, setValue } = useForm({
    resolver: yupResolver(emailSchema),
    defaultValues: { email: "", otp: "" },
  });

  const newEmail = watch("email");
  const token = localStorage.getItem("token");

  const handleSendOtp = async (isResend = false) => {
    if (!newEmail)
      return Swal.fire("Error", "Please enter a new email", "error");

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/v1/auth/send-email-otp`,
        { newEmail },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        setOtpSent(true);
        setResendTimer(60);
        Swal.fire(
          isResend ? "Resent!" : "Sent!",
          "OTP has been sent to your new email.",
          "success"
        );
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to send OTP",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const onUpdateEmail = async (data) => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/v1/auth/update/email`,
        {
          newEmail: data.email,
          otp: data.otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        Swal.fire("Success", "Your email has been updated.", "success");
        setOtpSent(false);
        setResendTimer(0);
        setValue("otp", "");
        setValue("email", "");
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Update failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (<>

{user?.provider === "google" ? <></> : 
    <Card className="border">
      <CardHeader className="border-bottom">
        <h4 className="card-header-title">Update email</h4>
        {user?.email && (
          <p className="mb-0">
            Current email: <span className="text-primary">{user?.email}</span>
          </p>
        )}
      </CardHeader>

      <CardBody>
        <form
          onSubmit={
            otpSent ? handleSubmit(onUpdateEmail) : (e) => e.preventDefault()
          }
        >
          <TextFormInput
            name="email"
            label="New Email Address*"
            placeholder="Enter new email"
            control={control}
            disabled={otpSent}
          />

          {otpSent && (
            <div className="mt-3">
              <TextFormInput
                name="otp"
                label="Enter 6-Digit OTP*"
                placeholder="000000"
                control={control}
              />
              <div className="mt-2 text-start">
                {resendTimer > 0 ? (
                  <small className="text-muted">
                    Resend OTP in{" "}
                    <span className="fw-bold">{resendTimer}s</span>
                  </small>
                ) : (
                  <button
                    type="button"
                    className="btn btn-link p-0 text-decoration-none small"
                    onClick={() => handleSendOtp(true)}
                    disabled={loading}
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="text-end mt-3">
            {!otpSent ? (
              <Button
                variant="primary"
                onClick={() => handleSendOtp(false)}
                disabled={loading}
              >
                {loading ? <Spinner size="sm" /> : "Verify & Send OTP"}
              </Button>
            ) : (
              <Button variant="success" type="submit" disabled={loading}>
                {loading ? <Spinner size="sm" /> : "Confirm Update"}
              </Button>
            )}
          </div>
        </form>
      </CardBody>
    </Card>  }

</>
  );
};

export default UpdateEmail;
