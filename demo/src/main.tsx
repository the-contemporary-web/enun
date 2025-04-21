import "./design/style/index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MainPage } from "ui";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MainPage />
  </StrictMode>,
);
