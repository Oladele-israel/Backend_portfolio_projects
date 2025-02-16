import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const baseURL = import.meta.env.VITE_API;

// Create context
export const AuthContext = createContext();

// Export the context
export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [message, setMessage] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  axios.defaults.withCredentials = true;

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
        console.log(response);
        if (response?.data?.success) {
          setUserDetails(response.data.authUser); // Ensure the key matches the server response
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
        error,
        message,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
