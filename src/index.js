import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./font-face.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<App />, document.getElementById("root"));

serviceWorker.register({
  onUpdate: registration => {
    window.location.reload();
  }
});
