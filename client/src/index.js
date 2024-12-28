import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store ,{persistor}from "./redux_toolkit/store";
import 'bootstrap/dist/css/bootstrap.min.css';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
     <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
        <ToastContainer 
          position="bottom-left"
          autoClose={3000} // Thời gian đóng tự động
          pauseOnHover
        />
      </BrowserRouter>
      </PersistGate>
  </Provider>
);
