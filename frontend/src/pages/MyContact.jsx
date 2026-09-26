import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

const MyContacts = () => {
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api("/contact-request/me")
      .then((data) => setContacts(data.requests))
      .catch((error) => console.error(error.message));
  }, []);

  return (
    <div>
      <h1>My Contacts</h1>

      {contacts.length === 0 ? (
        <p>No accepted contacts.</p>
      ) : (
        contacts.map((contact) => (
          <div key={contact._id}>
            <h3>{contact.bloodRequestId.bloodGroup}</h3>

            <p>Units: {contact.bloodRequestId.units}</p>
            <p>Urgency: {contact.bloodRequestId.urgency}</p>

            <button
              onClick={() =>
                navigate(`/contact-requests/${contact._id}/contact`)
              }
            >
              View Donor Contact
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default MyContacts;
