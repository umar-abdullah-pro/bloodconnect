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

      setRequests((prev) =>
        prev.map((request) =>
          request._id === requestId ? { ...request, status } : request,
        ),
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-5xl">
        <section className="mb-8">
          <p className="mb-2 text-sm font-medium text-[#b4232c]">
            Donor connections
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Contact Requests
          </h1>

          <p className="mt-2 text-slate-500">
            Review requests from people who need your help.
          </p>
        </section>

        {requests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              No contact requests
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              When someone requests your contact for a blood donation, it will
              appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <article
                key={request._id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-lg font-semibold text-[#b4232c]">
                      {request.bloodRequestId.bloodGroup}
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Contact request
                      </p>

                      <h2 className="mt-1 font-semibold text-slate-900">
                        {request.requesterId.name}
                      </h2>
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1.5 text-xs font-medium ${
                      request.status === "PENDING"
                        ? "bg-amber-50 text-amber-700"
                        : request.status === "ACCEPTED"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-[#b4232c]"
                    }`}
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

                {request.status === "PENDING" && (
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
                    <button
                      onClick={() => handleStatus(request._id, "ACCEPTED")}
                      className="rounded-xl bg-[#b4232c] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#991b1b]"
                    >
                      Accept Request
                    </button>

                    <button
                      onClick={() => handleStatus(request._id, "REJECTED")}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-[#b4232c]"
                    >
                      Reject
                    </button>
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

export default ContactRequests;
