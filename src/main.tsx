import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './styles/globals.css';
import { AppShell } from "./components/common/AppShell";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
