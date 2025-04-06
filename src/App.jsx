// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register"; // Correctly import Register component
import Login from "./components/Login";
import Home from "./components/Home"; // Correctly import Home component
import Landing from "./components/Landing";

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/home" element={<Home />} />   {/* Home route */}
          <Route path="/register" element={<Register />} />  {/* Register route */}
          <Route path="/login" element={<Login />} />  {/* Login route */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
