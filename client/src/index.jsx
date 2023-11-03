import React from "react";
import ReactDOM from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Provider } from "react-redux";

import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Chat from "./pages/Chat.jsx";

import "./styles/global.css";
import "./styles/bootstrap.css";
import store from "./services/ReduxStore.js";
import PrivateRoute from "./components/private-route/PrivateRoute.jsx";
import SocketProvider from "./context/socket.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<Home />} />
      <Route element={<PrivateRoute />}>
        <Route path="/chat" element={<Chat />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SocketProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </SocketProvider>
  </React.StrictMode>
);
