import { useEffect, useState } from "react";
import { api } from "../services/api";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api("/auth/me")
      .then((data) => setUser(data.user))
      .catch((error) => console.error(error.message));
  }, []);

  const handleLogout = async () => {
    try {
      await api("/auth/logout", {
        method: "POST",
      });

      window.location.href = "/login";
    } catch (error) {
      console.error(error.message);
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>

      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <p>Role: {user.role}</p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
