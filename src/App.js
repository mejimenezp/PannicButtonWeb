import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Features from "./components/Features";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Privacidad from "./pages/privacidadTerms";
import Soporte from "./pages/soporte";   
import Admin from "./pages/AdminUser";
import AdminContacts from "./pages/AdminContac";
import AdminDashboard from "./pages/AdminDashboard";

import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "./assets/css/style.css";
import "./assets/css/Contact.css";
import "./assets/css/Features.css";
import "./assets/css/Home.css";
import "./assets/css/about.css";
import "./assets/css/Footer.css";


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Página principal con todas las secciones */}
        <Route path="/" element={
          <>
            <Home />
            <Features />
            <About />
            <Contact />
          </>
        } />

        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/soporte" element={<Soporte />} />
        <Route path="/admin" element={<AdminDashboard/>} />
        <Route path="/adminUsers" element={<Admin/>} />
        <Route path="/adminContacts" element={<AdminContacts/>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
