import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const PrivateRoute = () => {
  const { token } = useContext(UserContext);

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
