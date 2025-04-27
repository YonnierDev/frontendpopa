import App from "./App";
<<<<<<< HEAD
import React from "react";
import store from "./store";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
=======
>>>>>>> 4c6738033daad045332ce1cc617753bbd4797571

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
