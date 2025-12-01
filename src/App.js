// import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Background from "./components/Background";
import Hero from "./components/Hero";
import About from "./components/About";
// import Experience from "./components/Experience";
import Involvement from "./components/Involvement";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="bg-gray-950 text-white min-h-screen pt-16 opacity-95">
      <Navbar />
      <Background />
      <Hero />
      <About />
      {/* <Experience /> */}
      <Involvement />
      <Footer />
    </div>
  );
}

export default App;
