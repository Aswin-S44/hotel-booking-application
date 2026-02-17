import { useRef, useState } from "react";
import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import forgotPassImg from "@/assets/images/element/forgot-pass.svg";
import logoIcon from "@/assets/images/logo-icon.svg";
import { developedByLink, currentYear } from "@/states";
import { forwardRef } from "react";
const OTPInput = forwardRef(({ value, onChange, onKeyDown }, ref) => {
  return (
    <input
      ref={ref}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={1}
      className="form-control text-center p-3"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
    />
  );
});
const otpLength = 5;
const TwoFactorAuth = () => {
  const [values, setValues] = useState(Array(otpLength).fill(""));
  const inputsRef = useRef([]);
  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
    if (value && index < otpLength - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };
  const handleKeyDown = (index) => (e) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < otpLength - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const otp = values.join("");
  };
  return (
    <>
      <Col lg={6} className="d-md-flex align-items-center order-2 order-lg-1">
        <div className="p-3 p-lg-5">
          <img src={forgotPassImg} alt="Forgot Password" />
        </div>
        <div className="vr opacity-1 d-none d-lg-block" />
      </Col>

      <Col lg={6} className="order-1">
        <div className="p-4 p-sm-7">
          <Link to="/">
            <img className="mb-4 h-50px" src={logoIcon} alt="logo" />
          </Link>

          <h1 className="mb-2 h3">Two factor authentication</h1>
          <p className="mb-sm-0">
            We have to send a code to <b>example@gmail.com</b>
          </p>

          <form onSubmit={handleSubmit} className="mt-sm-4">
            <p className="mb-1">Enter the code we have sent you:</p>

            <div className="d-flex justify-content-between gap-1 gap-sm-3 mb-2">
              {values.map((value, index) => (
                <OTPInput
                  key={index}
                  ref={(el) => {
                    inputsRef.current[index] = el;
                  }}
                  value={value}
                  onChange={(val) => handleChange(index, val)}
                  onKeyDown={handleKeyDown(index)}
                />
              ))}
            </div>

            <div className="d-sm-flex justify-content-between small mb-4">
              <span>Don't get a code?</span>
              <Link
                to=""
                className="btn btn-sm btn-link p-0 text-decoration-underline mb-0"
              >
                Click to resend
              </Link>
            </div>

            <button type="submit" className="btn btn-primary w-100 mb-0">
              Verify and Process
            </button>

            <div className="text-primary-hover mt-3 text-center">
              Copyrights ©{currentYear} Booking. Build by{" "}
              <a
                href={developedByLink}
                target="_blank"
                className="text-body"
                rel="noreferrer"
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
export default TwoFactorAuth;
