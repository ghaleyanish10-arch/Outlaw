import React from "react";
import Navbar from "./components/Navbar/Navbar.jsx";
import Hero from "./components/Hero/Hero.jsx";
import Ticker from "./components/Ticker/Ticker.jsx";
import Tournaments from "./components/Tournaments/Tournaments.jsx";
import SupportedTitles from "./components/SupportedTitles/SupportedTitles.jsx";
import CTA from "./components/CTA/CTA.jsx";
import Footer from "./components/Footer/Footer.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Ticker />
      <Tournaments />
      <SupportedTitles />
      <CTA />
      <Footer />
    </>
  );
}
