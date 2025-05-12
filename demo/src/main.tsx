import "./design/style/index.css";

import { PaneRepository } from "core/repository/PaneRepository";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MainPage } from "ui";

const preloads = [PaneRepository.preload()];

void Promise.all(preloads).then(() => {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("root element not found");

  createRoot(rootElement).render(
    <StrictMode>
      <MainPage />
    </StrictMode>,
  );
});
