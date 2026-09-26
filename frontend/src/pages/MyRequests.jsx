import { useEffect, useState } from "react";
import { api } from "../services/api";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    api("/blood-request/my-requests")
      .then((data) => setRequests(data.requests))
      .catch((error) => console.error(error.message));
  }, []);

  const handleStatus = async (requestId, status) => {
    try {
      await api(`/blood-request/${requestId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      window.location.reload();
    } catch (error) {
      console.error(error.message);
    }
  };

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
              <>
                <button
                  onClick={() =>
                    (window.location.href = `/blood-requests/${request._id}/matches`)
                  }
                >
                  Find Donors
                </button>

                <button onClick={() => handleStatus(request._id, "FULFILLED")}>
                  Mark Fulfilled
                </button>

                <button onClick={() => handleStatus(request._id, "CANCELLED")}>
                  Cancel Request
                </button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyRequests;
