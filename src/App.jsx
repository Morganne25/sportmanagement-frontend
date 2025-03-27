// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register"; // Correctly import Register component
import Login from "./components/Login";
import Home from "./components/Home"; // Correctly import Home component

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />} />   {/* Home route */}
          <Route path="/register" element={<Register />} />  {/* Register route */}
          <Route path="/" element={<Login />} />  {/* Login route */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
