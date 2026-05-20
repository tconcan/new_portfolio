import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Background from "./components/Background";
import Home from "./pages/Home";
import Projects from "./pages/Projects";

function App() {
  return (
    <div className="bg-gray-950 text-white min-h-screen pt-14 sm:pt-16 opacity-95">
      <Navbar />
      <Background />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </div>
  );
}

export default App;
