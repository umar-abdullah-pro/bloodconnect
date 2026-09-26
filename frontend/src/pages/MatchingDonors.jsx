import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";

const MatchingDonors = () => {
  const { requestId } = useParams();
  const [donors, setDonors] = useState([]);
  const [requestedDonors, setRequestedDonors] = useState([]);

  useEffect(() => {
    api(`/blood-request/${requestId}/matches`)
      .then((data) => setDonors(data.donors))
      .catch((error) => console.error(error.message));
  }, [requestId]);

  const handleContactRequest = async (donorId) => {
    try {
      await api("/contact-request", {
        method: "POST",
        body: JSON.stringify({
          donorId,
          bloodRequestId: requestId,
        }),
      });

      setRequestedDonors((prev) => [...prev, donorId]);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8">
          <p className="mb-2 text-sm font-medium text-[#b4232c]">
            Donor matching
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Matching Donors
          </h1>

          <p className="mt-2 text-slate-500">
            Compatible donors are ranked using availability, distance and
            donation history.
          </p>
        </section>

        {donors.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              No matching donors found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              There are currently no available compatible donors within the
              matching area.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {donors.map((donor, index) => {
              const isRequested = requestedDonors.includes(donor.donorId);

              return (
                <article
                  key={donor.donorId}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-lg font-semibold text-[#b4232c]">
                        {donor.bloodGroup}
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Donor #{index + 1}
                        </p>

                        <h2 className="mt-1 font-semibold text-slate-900">
                          Compatible donor
                        </h2>
                      </div>
                    </div>

                    <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                      Available
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-400">Distance</p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {donor.distanceInKm} km
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-400">Priority</p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {donor.priorityScore}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-slate-100 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Last donation
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      {donor.latestDonationDate
                        ? new Date(
                            donor.latestDonationDate,
                          ).toLocaleDateString()
                        : "No donation history"}
                    </p>
                  </div>

                  <button
                    disabled={isRequested}
                    onClick={() => handleContactRequest(donor.donorId)}
                    className={`mt-5 w-full rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                      isRequested
                        ? "cursor-not-allowed bg-emerald-50 text-emerald-700"
                        : "bg-[#b4232c] text-white hover:bg-[#991b1b]"
                    }`}
                  >
                    {isRequested ? "Contact Request Sent" : "Request Contact"}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default MatchingDonors;
