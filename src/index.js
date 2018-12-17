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
    // XXX I don't think it's enough to reload the page
    // because the user has to actually close all tabs first.
    // You need to 'registration.waiting.postMessage("skipWaiting");'
    // followed by a reload.
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
