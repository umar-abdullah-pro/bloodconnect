import { useEffect, useState } from "react";
import { api } from "../services/api";

const ContactRequests = () => {
  const [requests, setRequests] = useState([]);

  const loadRequests = async () => {
    try {
      const data = await api("/contact-request/me");
      setRequests(data.requests);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleStatus = async (requestId, status) => {
    try {
      await api(`/contact-request/${requestId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      loadRequests();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <h1>Contact Requests</h1>

      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        requests.map((request) => (
          <div key={request._id}>
            <h3>{request.requesterId.name}</h3>

            <p>Blood Group: {request.bloodRequestId.bloodGroup}</p>
            <p>Units: {request.bloodRequestId.units}</p>
            <p>Urgency: {request.bloodRequestId.urgency}</p>

            <button onClick={() => handleStatus(request._id, "ACCEPTED")}>
              Accept
            </button>

            <button onClick={() => handleStatus(request._id, "REJECTED")}>
              Reject
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ContactRequests;
