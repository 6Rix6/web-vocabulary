import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./pages/Home";
import Vocabulary from "./pages/Vocabulary";
import Test from "./pages/Test";
import { BrowserRouter, Route, Routes } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vocabulary" element={<Vocabulary />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
