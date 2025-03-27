import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function login(event) {
    event.preventDefault();
    try {
      await axios
        .post("http://localhost:8080/api/v1/user/login", {
          email: email,
          password: password,
        })
        .then((res) => {
          console.log(res.data);

          if (res.data.message === "Email not exists") {
            alert("Email not exists");
          } else if (res.data.message === "Login Success") {
            navigate("/home");
          } else {
            alert("Incorrect Email or Password");
          }
        })
        .catch((fail) => {
          console.error(fail); // Error!
        });
    } catch (err) {
      alert(err);
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4" style={{ width: "400px" }}>
        <div className="card-body">
          <div className="text-center mb-4">
            <h2>Login</h2>
            <hr />
          </div>

          <form>
            <div className="form-group mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary" onClick={login}>
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;