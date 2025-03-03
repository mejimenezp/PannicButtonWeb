import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Features from "./components/Features";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Privacidad from "./pages/privacidadTerms"; // ✅ Nueva Página

import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "./assets/css/style.css";
import "./assets/css/Contact.css";
import "./assets/css/Features.css";
import "./assets/css/Home.css";
import "./assets/css/about.css";

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

        {/* Nueva página de privacidad */}
        <Route path="/privacidad" element={<Privacidad />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
