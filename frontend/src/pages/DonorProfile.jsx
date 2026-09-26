import { useEffect, useState } from "react";
import { api } from "../services/api";

const DonorProfile = () => {
  const [profile, setProfile] = useState(null);

  const loadProfile = async () => {
    try {
      const data = await api("/donor/me");
      setProfile(data.donorProfile);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleAvailability = async () => {
    try {
      await api("/donor/availability", {
        method: "PATCH",
        body: JSON.stringify({
          isAvailable: !profile.isAvailable,
        }),
      });

      loadProfile();
    } catch (error) {
      console.error(error.message);
    }
  };

  if (!profile) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>My Donor Profile</h1>

      <p>Blood Group: {profile.bloodGroup}</p>

      <p>
        Location: {profile.location.coordinates[1]},{" "}
        {profile.location.coordinates[0]}
      </p>

      <p>Status: {profile.isAvailable ? "Available" : "Unavailable"}</p>

      <button onClick={handleAvailability}>
        {profile.isAvailable ? "Go Unavailable" : "Go Available"}
      </button>
    </div>
  );
};

export default DonorProfile;
