import { PasswordFormInput, TextFormInput } from '@/components';
import { Col } from 'react-bootstrap';
import { FaFacebookF } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import useSignIn from './useSignIn';
import signInImg from '@/assets/images/element/signin.svg';
import logoIcon from '@/assets/images/logo-icon.svg';
import { developedByLink, currentYear } from '@/states';
import axios from "axios";
import { signInWithGoogle } from "@/firebase";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const {
    control,
    loading,
    login
  } = useSignIn();

const navigate = useNavigate();

const handleGoogleLogin = async () => {
  try {
    console.log("Button clicked"); // 👈 add this

    const idToken = await signInWithGoogle();
    console.log("Token received:", idToken); // 👈 add this

    const res = await axios.post(
      "http://localhost:5000/auth/google-login",
      { idToken },
      { withCredentials: true }
    );

    console.log("Backend response:", res.data);

    navigate("/agent/dashboard");
  } catch (error) {
    console.error("Google login failed:", error);
  }
};


  return <>
      <Col lg={6} className="d-flex align-items-center order-2 order-lg-1">
        <div className="p-3 p-lg-5">
          <img src={signInImg} />
        </div>

        <div className="vr opacity-1 d-none d-lg-block" />
      </Col>

      <Col lg={6} className="order-1">
        <div className="p-4 p-sm-7">
          <Link to="/">
            <img className="h-50px mb-4" src={logoIcon} alt="logo" />
          </Link>

          <h1 className="mb-2 h3">Welcome back</h1>
          <p className="mb-0">
            New here?<Link to="/auth/sign-up"> Create an account</Link>
          </p>

          <form  className="mt-4 text-start">
            <TextFormInput name="email" containerClass="mb-3" label="Enter email id" type="email" control={control} />

            <PasswordFormInput name="password" containerClass="mb-3" label="Enter password" control={control} />

            <div className="mb-3 d-sm-flex justify-content-between">
              <div className="d-flex gap-1">
                <input type="checkbox" className="form-check-input" id="rememberCheck" />
                <label className="form-check-label" htmlFor="rememberCheck">
                  Remember me?
                </label>
              </div>
              <Link to="/auth/forgot-password">Forgot password?</Link>
            </div>

            <div>
              <button type="submit" className="btn btn-primary w-100 mb-0" disabled={loading}>
                Login
              </button>
            </div>

            <div className="position-relative my-4">
              <hr />
              <p className="small bg-mode position-absolute top-50 start-50 translate-middle px-2">Or sign in with</p>
            </div>

            <div className="vstack gap-3">
              <button type="button" className="btn btn-light mb-0" onClick={handleGoogleLogin}>
                <FcGoogle size={16} className="fab fa-fw me-2" />
                Continue with Google
              </button>
              <button type="button" className="btn btn-light mb-0">
                <FaFacebookF size={16} className="fab fa-fw text-facebook me-2" />
                Continue with Facebook
              </button>
            </div>

            <div className="text-primary-hover text-body mt-3 text-center">
              {' '}
              Copyrights ©{currentYear} Booking. Build by{' '}
              <a href={developedByLink} target="_blank" className="text-body">
                StackBros
              </a>
              .{' '}
            </div>
          </form>
        </div>
      </Col>
    </>;
};
export default SignIn;