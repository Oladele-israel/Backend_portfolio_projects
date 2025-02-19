import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { ExtractLastStatusCheck } from "../components/utils/ExtractLastStatusCheck.js";

const baseURL = import.meta.env.VITE_API;

export const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [message, setMessage] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monitors, setMonitors] = useState([]);
  const [statusCheck, setStatusCheck] = useState([]);
  const [socket, setSocket] = useState(null); // Store socket instance in state

  axios.defaults.withCredentials = true;

  useEffect(() => {
    if (!userDetails?.id) return; // Ensure userDetails is available before initializing socket

    const newSocket = io(baseURL, {
      transports: ["websocket"],
      withCredentials: true,
      query: { userId: userDetails.id },
    });

    setSocket(newSocket); // Store the socket instance in state

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server:", newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err);
    });

    newSocket.on("websiteStatusUpdate", (data) => {
      console.log("Received real-time update: =====>", data);

      setStatusCheck((prev) => {
        const updatedStatusChecks = prev?.map((website) =>
          website.url === data.url
            ? {
                ...website,
                isUp: data.isUp,
                checkedAt: data.checkedAt,
                id: data.id,
              }
            : website
        );
        console.log("Updated status checks:", updatedStatusChecks);
        return updatedStatusChecks;
      });
    });

    return () => {
      newSocket.disconnect();
      console.log("Disconnected from WebSocket");
    };
  }, [userDetails]); // Run only when userDetails changes

  useEffect(() => {
    const websiteDetails = async () => {
      if (!userDetails?.id) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `${baseURL}/v1/web/userWebsites/${userDetails.id}`,
          {
            withCredentials: true,
          }
        );

        const websiteData = response.data.data;
        console.log("Fetched website data:", websiteData);

        const lastStatusChecks = ExtractLastStatusCheck(websiteData);
        setStatusCheck(lastStatusChecks);
      } catch (error) {
        console.log("Error fetching website details:", error);
      } finally {
        setLoading(false);
      }
    };

    websiteDetails();
  }, [userDetails]);

  const loginUser = async (credentials) => {
    try {
      const response = await axios.post(`${baseURL}/user/login`, credentials, {
        withCredentials: true,
      });
      setUserDetails(response.data.user);
      setMessage(response.data.message);
      setError(null);
    } catch (error) {
      setError(error);
      setMessage("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axios.get(`${baseURL}/user/authUser`, {
          withCredentials: true,
        });

        if (response?.data?.success) {
          setUserDetails(response.data.authUser);
          setMessage(response.data.message);
        } else {
          setMessage("Token validation failed.");
        }
      } catch (error) {
        if (error.response?.status === 401) {
          setMessage("Unauthorized: Please log in again.");
        } else {
          setMessage("Token validation failed.");
        }
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userDetails,
        setUserDetails,
        loading,
        setLoading,
        loginUser,
        monitors,
        setMonitors,
        error,
        message,
        statusCheck,
        setStatusCheck,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
