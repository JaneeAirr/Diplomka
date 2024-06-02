import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { VisionUIControllerProvider } from "context";

ReactDOM.render(
  <Router>
    <VisionUIControllerProvider>
      <App />
    </VisionUIControllerProvider>
  </Router>,
  document.getElementById("root")
);
