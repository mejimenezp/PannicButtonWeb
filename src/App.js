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
import AdminGeo from "./pages/AdminGeo";
import Login from "./pages/Login";
import PrivateRoute from "./routes/PrivateRoute";
import ContratoUsuario from "./pages/ContratoUsuario";

import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "./assets/css/style.css";
import "./assets/css/Contact.css";
import "./assets/css/Features.css";
import "./assets/css/Home.css";

import "./assets/css/Footer.css";


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Página principal con todas las secciones */}
        <Route path="/" element={<>< About/><Features /><Contact /></>} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/contrato-usuario" element={<ContratoUsuario />} />
        <Route path="/soporte" element={<Soporte />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas según rol */}
        <Route path="/admin" element={<PrivateRoute role="4"><AdminDashboard /></PrivateRoute>} />
        <Route path="/adminUsers" element={<PrivateRoute role="4"><Admin /></PrivateRoute>} />
        <Route path="/adminContacts" element={<PrivateRoute role="4"><AdminContacts /></PrivateRoute>} />
        <Route path="/adminGeo" element={<PrivateRoute role="4"><AdminGeo /></PrivateRoute>} />
        <Route path="/soporte" element={<PrivateRoute role="2"><Soporte /></PrivateRoute>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
