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
    return (
      <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-5 py-10">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-lg font-semibold text-slate-900">
              Contact details unavailable
            </h1>

            <p className="mt-2 text-sm text-slate-500">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  if (!contact) {
    return (
      <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-5 py-10">
        <div className="mx-auto max-w-2xl">
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-2xl">
        <section className="mb-8">
          <p className="mb-2 text-sm font-medium text-[#b4232c]">
            Donor connection
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Donor Contact
          </h1>

          <p className="mt-2 text-slate-500">
            Contact details are shared because the donor accepted your request.
          </p>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-xl font-semibold text-[#b4232c]">
                {contact.name?.charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Donor
                </p>

                <h2 className="mt-1 text-xl font-semibold text-slate-900">
                  {contact.name}
                </h2>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Phone number
              </p>

              <p className="mt-2 text-lg font-semibold text-slate-900">
                {contact.phone}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Please contact the donor directly to coordinate the donation.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ContactDetails;
