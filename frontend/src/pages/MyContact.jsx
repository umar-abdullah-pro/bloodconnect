import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

const MyContacts = () => {
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api("/contact-request/contacts")
      .then((data) => setContacts(data.contacts))
      .catch((error) => console.error(error.message));
  }, []);

  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-5xl">
        <section className="mb-8">
          <p className="mb-2 text-sm font-medium text-[#b4232c]">
            Donor connections
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            My Contacts
          </h1>

          <p className="mt-2 text-slate-500">
            View donors who have accepted your contact requests.
          </p>
        </section>

        {contacts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              No accepted contacts
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Accepted donor connections will appear here once a donor agrees to
              share their contact details.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {contacts.map((contact) => (
              <article
                key={contact._id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-lg font-semibold text-[#b4232c]">
                      {contact.bloodRequestId.bloodGroup}
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Accepted donor
                      </p>

                      <h2 className="mt-1 font-semibold text-slate-900">
                        Blood donation connection
                      </h2>
                    </div>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                    Accepted
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-400">Blood group</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {contact.bloodRequestId.bloodGroup}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-400">Units needed</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {contact.bloodRequestId.units}
                    </p>
                  </div>

                  <div className="col-span-2 rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-400">Urgency</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {contact.bloodRequestId.urgency}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate(`/contact-requests/${contact._id}/contact`)
                  }
                  className="mt-5 w-full rounded-xl bg-[#b4232c] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#991b1b]"
                >
                  View Donor Contact
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyContacts;
