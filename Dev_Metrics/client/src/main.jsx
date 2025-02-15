import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./Layout/Layout.jsx";
import Signup from "./components/auth/Signup.jsx";
import Login from "./components/auth/Login.jsx";
import Onboarding from "./components/auth/Onboarding.jsx";
import App from "../src/App.jsx";
import DashboardHome from "./components/dashboard/DashboardHome.jsx";
import CreateMonitor from "./components/dashboard/CreateMonitor.jsx";
import WebsiteDetails from "./components/dashboard/WebDetails.jsx";
import IncidentPage from "./components/dashboard/IncidentPage.jsx";
import { AuthContextProvider } from "./contexts/authContext.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";

/*creating the browser router */
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <DashboardHome />,
      },
      {
        path: "create_monitor",
        element: <CreateMonitor />,
      },
      {
        path: "web_details",
        element: <WebsiteDetails />,
      },
      {
        path: "incident",
        element: <IncidentPage />,
      },
      {
        path: "profile",
        element: <Onboarding />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router}></RouterProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
