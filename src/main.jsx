import App from "./App";
import React from "react";
import store from "./store";
<<<<<<< HEAD
import 'bootstrap/dist/css/bootstrap.min.css'
=======
>>>>>>> ccc46c449c7b88d96706a7a04dd4d76f73543425
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
