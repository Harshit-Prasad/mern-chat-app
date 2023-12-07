import React, { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./services/ReduxStore.js";
import PrivateRoute from "./components/private-route/PrivateRoute.jsx";
import SocketProvider from "./context/socket.jsx";
import "./styles/bootstrap.css";
import "./styles/global.css";
import ChatErrorBoundary from "./components/error-boundaries/ChatErrorBoundary.jsx";
import PageLoader from "./components/ui/Loading/PageLoader.jsx";
import NotFound from "./pages/NotFound.jsx";

const Home = lazy(() => wait(0).then(() => import("./pages/Home.jsx")));
const Chat = lazy(() => wait(0).then(() => import("./pages/Chat.jsx")));

function wait(time) {
  return new Promise((res) => {
    setTimeout(res, time);
  });
}

function AppLayout() {
  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
      <ToastContainer />
    </>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<AppLayout />}>
      <Route index={true} path="/" element={<Home />} />
      <Route element={<PrivateRoute />}>
        <Route
          path="/chat"
          element={<Chat />}
          errorElement={<ChatErrorBoundary />}
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default function App() {
  return (
    <SocketProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </SocketProvider>
  );
}
