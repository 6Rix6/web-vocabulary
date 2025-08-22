import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import BaseLayout from "./layouts/BaseLayout";
import Home from "./pages/Home";
import Vocabulary from "./pages/Vocabulary";
import { BrowserRouter, Route, Routes } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <BaseLayout>
              <Home />
            </BaseLayout>
          }
        />
        <Route
          path="/vocabulary"
          element={
            <BaseLayout>
              <Vocabulary />
            </BaseLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
