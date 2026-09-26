import { useEffect, useState } from "react";
import { api } from "../services/api";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    api("/blood-request/me")
      .then((data) => setRequests(data.requests))
      .catch((error) => console.error(error.message));
  }, []);

  return (
    <div>
      <h1>My Blood Requests</h1>

      {requests.length === 0 ? (
        <p>No blood requests found.</p>
      ) : (
        requests.map((request) => (
          <div key={request._id}>
            <h3>{request.bloodGroup}</h3>

            <p>Units: {request.units}</p>
            <p>Urgency: {request.urgency}</p>
            <p>Status: {request.status}</p>

            {request.status === "OPEN" && (
              <button
                onClick={() =>
                  (window.location.href = `/blood-requests/${request._id}/matches`)
                }
              >
                Find Donors
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyRequests;
