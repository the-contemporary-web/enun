import "./design/style/index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MainPage } from "ui";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("root element not found");

createRoot(rootElement).render(
  <StrictMode>
    <MainPage />
  </StrictMode>,
);
