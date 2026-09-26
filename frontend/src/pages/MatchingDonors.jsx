import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";

const MatchingDonors = () => {
  const { requestId } = useParams();
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    api(`/blood-request/${requestId}/matches`)
      .then((data) => setDonors(data.donors))
      .catch((error) => console.error(error.message));
  }, [requestId]);

  const handleContactRequest = async (donorId) => {
    try {
      const response = await api("/contact-request", {
        method: "POST",
        body: JSON.stringify({
          donorId,
          bloodRequestId: requestId,
        }),
      });

      console.log(response);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <h1>Matching Donors</h1>

      {donors.length === 0 ? (
        <p>No matching donors found.</p>
      ) : (
        donors.map((donor) => (
          <div key={donor.donorId}>
            <h3>{donor.bloodGroup}</h3>

            <p>Distance: {donor.distanceInKm} km</p>
            <p>Priority: {donor.priorityScore}</p>
            <p>Status: {donor.isAvailable ? "Available" : "Unavailable"}</p>

            <button onClick={() => handleContactRequest(donor.donorId)}>
              Request Contact
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default MatchingDonors;
