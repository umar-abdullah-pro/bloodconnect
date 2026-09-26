import { useEffect, useState } from "react";
import { api } from "../services/api";

const DonorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      const data = await api("/donor/me");
      setProfile(data.donorProfile);
    } catch (error) {
      if (error.message !== "Donor profile not found") {
        console.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const data = {
      bloodGroup: formData.get("bloodGroup"),
      latitude: Number(formData.get("latitude")),
      longitude: Number(formData.get("longitude")),
    };

    try {
      await api("/donor", {
        method: "POST",
        body: JSON.stringify(data),
      });

      event.target.reset();
      loadProfile();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleAvailability = async () => {
    try {
      await api("/donor/availability", {
        method: "PATCH",
        body: JSON.stringify({
          isAvailable: !profile.isAvailable,
        }),
      });

      loadProfile();
    } catch (error) {
      console.error(error.message);
    }
  };

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-5 py-10">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-5 py-10">
        <div className="mx-auto max-w-3xl">
          <section className="mb-8">
            <p className="mb-2 text-sm font-medium text-[#b4232c]">
              Donor account
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Create Donor Profile
            </h1>

            <p className="mt-2 text-slate-500">
              Add your blood group and location so you can be matched with
              nearby blood requests.
            </p>
          </section>

          <form
            onSubmit={handleCreate}
            className="rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <section className="p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  Donor details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  This information is used for donor matching.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Blood group
                  </label>

                  <select
                    name="bloodGroup"
                    defaultValue=""
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#b4232c] focus:ring-2 focus:ring-red-100"
                  >
                    <option value="" disabled>
                      Select blood group
                    </option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Latitude
                    </label>

                    <input
                      name="latitude"
                      type="number"
                      step="any"
                      placeholder="e.g. 28.6139"
                      required
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#b4232c] focus:ring-2 focus:ring-red-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Longitude
                    </label>

                    <input
                      name="longitude"
                      type="number"
                      step="any"
                      placeholder="e.g. 77.2090"
                      required
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#b4232c] focus:ring-2 focus:ring-red-100"
                    />
                  </div>
                </div>
              </div>
            </section>

            <div className="flex justify-end border-t border-slate-100 bg-slate-50/60 p-6 sm:p-8">
              <button
                type="submit"
                className="rounded-xl bg-[#b4232c] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#991b1b]"
              >
                Create Donor Profile
              </button>
            </div>
          </form>
        </div>
      </main>
    );
  }

  const [longitude, latitude] = profile.location.coordinates;

  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-4xl">
        <section className="mb-8">
          <p className="mb-2 text-sm font-medium text-[#b4232c]">
            Donor account
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            My Donor Profile
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your blood group, location and donor availability.
          </p>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-6 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-xl font-semibold text-[#b4232c]">
                {profile.bloodGroup}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Blood Donor
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your donor information
                </p>
              </div>
            </div>

            <div
              className={`w-fit rounded-full px-3 py-1.5 text-sm font-medium ${
                profile.isAvailable
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {profile.isAvailable
                ? "Available to donate"
                : "Currently unavailable"}
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Blood Group
              </p>

              <p className="mt-2 text-lg font-semibold text-slate-900">
                {profile.bloodGroup}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Availability
              </p>

              <p className="mt-2 text-lg font-semibold text-slate-900">
                {profile.isAvailable ? "Available" : "Unavailable"}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Registered Location
              </p>

              <p className="mt-2 text-sm text-slate-700">
                Latitude: {latitude}
              </p>

              <p className="mt-1 text-sm text-slate-700">
                Longitude: {longitude}
              </p>
            </div>
          </div>

          <div className="border-t border-slate-100 bg-slate-50/60 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-medium text-slate-900">
                  Donation availability
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Update this whenever you are or aren't available to help.
                </p>
              </div>

              <button
                onClick={handleAvailability}
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  profile.isAvailable
                    ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    : "bg-[#b4232c] text-white hover:bg-[#991b1b]"
                }`}
              >
                {profile.isAvailable ? "Go Unavailable" : "Become Available"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default DonorProfile;
