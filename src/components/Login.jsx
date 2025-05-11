import React from "react";
import { FcGoogle } from "react-icons/fc";
import "./css/login.css"; // Your custom styles
import Footer from "./pageComponents/Footer";
import Header from "./pageComponents/Header";

const loginWithGoogle = () => {
  window.location.href = 'https://sport-management-app-latest.onrender.com/api/v1/user/oauth2/authorization/google';
};

const Login = () => {
  return (
    <>
      <Header />
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="card p-4" style={{ width: "400px" }}>
          <div className="card-body text-center">
            <h2 className="mb-3">Login</h2>
            <p className="mb-4">Sign in to access your dashboard</p>

            <button
              className="btn btn-outline-dark d-flex align-items-center justify-content-center w-100"
              onClick={loginWithGoogle}
            >
              <FcGoogle size={24} className="me-2" />
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
