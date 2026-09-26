import { useEffect, useState } from "react";
import { api } from "../services/api";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);

  const loadRequests = async () => {
    try {
      const data = await api("/blood-request/my-requests");
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
      await api(`/blood-request/${requestId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      loadRequests();
    } catch (error) {
      console.error(error.message);
    }
  };

  const statusStyle = {
    OPEN: "bg-red-50 text-[#b4232c]",
    FULFILLED: "bg-emerald-50 text-emerald-700",
    CANCELLED: "bg-slate-100 text-slate-600",
    EXPIRED: "bg-amber-50 text-amber-700",
  };

  const urgencyStyle = {
    LOW: "bg-slate-100 text-slate-600",
    MEDIUM: "bg-blue-50 text-blue-700",
    HIGH: "bg-orange-50 text-orange-700",
    EMERGENCY: "bg-red-50 text-[#b4232c]",
  };

  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-[#b4232c]">
              Blood requests
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              My Requests
            </h1>

            <p className="mt-2 text-slate-500">
              Track and manage the blood requests you have created.
            </p>
          </div>

          <a
            href="/blood-request/create"
            className="w-fit rounded-xl bg-[#b4232c] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#991b1b]"
          >
            + New Request
          </a>
        </section>

        {/* Empty state */}
        {requests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              No blood requests yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Create a request when you need blood and we'll help you find
              compatible donors nearby.
            </p>

            <a
              href="/blood-request/create"
              className="mt-6 inline-block rounded-xl bg-[#b4232c] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#991b1b]"
            >
              Create Blood Request
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <article
                key={request._id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                {/* Top */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-slate-900 px-3 py-1 text-sm font-semibold text-white">
                        {request.bloodGroup}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          statusStyle[request.status]
                        }`}
                      >
                        {request.status}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          urgencyStyle[request.urgency]
                        }`}
                      >
                        {request.urgency}
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-slate-500">
                      Created {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs text-slate-400">Units needed</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">
                      {request.units}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Location
                    </p>
                    <p className="mt-1 text-sm text-slate-700">
                      {request.location.coordinates[1]},{" "}
                      {request.location.coordinates[0]}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Required by
                    </p>
                    <p className="mt-1 text-sm text-slate-700">
                      {request.requiredBy
                        ? new Date(request.requiredBy).toLocaleString()
                        : "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Request ID
                    </p>
                    <p className="mt-1 truncate text-sm text-slate-500">
                      {request._id}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                {request.status === "OPEN" && (
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
                    <button
                      onClick={() =>
                        (window.location.href = `/blood-requests/${request._id}/matches`)
                      }
                      className="rounded-xl bg-[#b4232c] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#991b1b]"
                    >
                      Find Donors
                    </button>

                    <button
                      onClick={() => handleStatus(request._id, "FULFILLED")}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      Mark Fulfilled
                    </button>

                    <button
                      onClick={() => handleStatus(request._id, "CANCELLED")}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-[#b4232c]"
                    >
                      Cancel Request
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

export default MyRequests;
