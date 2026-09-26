import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";

const ContactDetails = () => {
  const { requestId } = useParams();
  const [contact, setContact] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/contact-request/${requestId}/contact`)
      .then((data) => setContact(data.contact))
      .catch((error) => setError(error.message));
  }, [requestId]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!contact) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Donor Contact</h1>

      <p>Name: {contact.name}</p>
      <p>Phone: {contact.phone}</p>
    </div>
  );
};

export default ContactDetails;
