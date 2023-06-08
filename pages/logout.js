import { useEffect } from "react";
import { useUser } from "../context/user";

// Call useUser() on mount
const Logout = () => {
  const { logout } = useUser();

  useEffect(logout, []);

  return <p>Logging out</p>;
};

export default Logout;
