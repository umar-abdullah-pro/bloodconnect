import { useEffect, useState } from "react";
import { api } from "../services/api";

const SentContactRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    api("/contact-request/sent")
      .then((data) => setRequests(data.requests))
      .catch((error) => console.error(error.message));
  }, []);

  const statusStyle = {
    PENDING: "bg-amber-50 text-amber-700",
    ACCEPTED: "bg-emerald-50 text-emerald-700",
    REJECTED: "bg-red-50 text-[#b4232c]",
  };

  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-5xl">
        <section className="mb-8">
          <p className="mb-2 text-sm font-medium text-[#b4232c]">
            Donor connections
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Sent Requests
          </h1>

          <p className="mt-2 text-slate-500">
            Track the contact requests you have sent to donors.
          </p>
        </section>

        {requests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              No sent requests
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Contact requests you send to donors will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <article
                key={request._id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Donor
                    </p>

                    <h2 className="mt-1 font-semibold text-slate-900">
                      {request.donorId.name}
                    </h2>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1.5 text-xs font-medium ${statusStyle[request.status]}`}
                  >
                    {request.status}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-400">Blood group</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {request.bloodRequestId.bloodGroup}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-400">Units needed</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {request.bloodRequestId.units}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-400">Urgency</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {request.bloodRequestId.urgency}
                    </p>
                  </div>
                </div>

                {request.status === "REJECTED" && (
                  <div className="mt-5 rounded-xl bg-red-50 p-4">
                    <p className="text-sm font-medium text-[#b4232c]">
                      This donor rejected your contact request.
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      You can try another compatible donor for this request.
                    </p>
                  </div>
                )}

                {request.status === "PENDING" && (
                  <div className="mt-5 rounded-xl bg-amber-50 p-4">
                    <p className="text-sm font-medium text-amber-700">
                      Waiting for donor response.
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default SentContactRequests;
