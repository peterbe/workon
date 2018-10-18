import React from "react";
import ReactDOM from "react-dom";
import { toast } from "bulma-toast";
import "./index.css";
import "./font-face.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<App />, document.getElementById("root"));

serviceWorker.register({
  onUpdate: registration => {
    toast({
      message: "New version available if you refresh the page.",
      type: "is-info",
      dismissible: true,
      closeOnClick: false,
      pauseOnHover: true,
      duration: 20000
    });
    // window.location.reload();
  }
});
