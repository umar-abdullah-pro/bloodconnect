import { useEffect, useState } from "react";
import { api } from "../services/api";
import LoadingScreen from "../components/LoadingScreen";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const DonorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [location, setLocation] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

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

  const searchLocation = async () => {
    if (!location.trim()) return;

    try {
      const data = await api("/location/search", {
        method: "POST",
        body: JSON.stringify({ location }),
      });

      setLocationResults(data.results);
    } catch (error) {
      console.error(error.message);
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const data = await api("/location/reverse", {
            method: "POST",
            body: JSON.stringify({
              latitude: coords.latitude,
              longitude: coords.longitude,
            }),
          });

          const locationName = data.locationName;

          setLocation(locationName);

          setSelectedLocation({
            latitude: coords.latitude,
            longitude: coords.longitude,
            label: locationName,
          });

          setLocationResults([]);
        } catch (error) {
          console.error(error.message);
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error("Location error:", error.message);
        setLocationLoading(false);
      },
    );
  };

  const selectLocation = (result) => {
    setSelectedLocation({
      latitude: result.lat,
      longitude: result.lon,
      label: result.formatted,
    });

    setLocation(result.formatted);
    setLocationResults([]);
  };

  const createProfile = async (event) => {
    event.preventDefault();

    if (!selectedLocation) {
      console.error("Please select a location");
      return;
    }

    const formData = new FormData(event.target);

    try {
      await api("/donor", {
        method: "POST",
        body: JSON.stringify({
          bloodGroup: formData.get("bloodGroup"),
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          locationName: selectedLocation.label,
        }),
      });

      event.target.reset();
      setLocation("");
      setSelectedLocation(null);
      loadProfile();
    } catch (error) {
      console.error(error.message);
    }
  };

  const toggleAvailability = async () => {
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
        <div className="mx-auto max-w-4xl text-sm text-slate-500">
          <LoadingScreen/>
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
            onSubmit={createProfile}
            className="rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="space-y-6 p-6 sm:p-8">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Blood group
                </label>

                <select
                  name="bloodGroup"
                  defaultValue=""
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#b4232c] focus:ring-2 focus:ring-red-100"
                >
                  <option value="" disabled>
                    Select blood group
                  </option>

                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Location
                </label>

                <div className="flex gap-2">
                  <input
                    value={location}
                    onChange={(event) => {
                      setLocation(event.target.value);
                      setSelectedLocation(null);
                    }}
                    placeholder="Search city, area or address"
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#b4232c] focus:ring-2 focus:ring-red-100"
                  />

                  <button
                    type="button"
                    onClick={searchLocation}
                    className="shrink-0 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                  >
                    Search
                  </button>
                </div>

                <button
                  type="button"
                  onClick={useCurrentLocation}
                  disabled={locationLoading}
                  className="mt-3 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {locationLoading
                    ? "Finding your location..."
                    : "📍 Use my current location"}
                </button>

                {locationResults.length > 0 && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                    {locationResults.map((result, index) => (
                      <button
                        key={`${result.lat}-${result.lon}-${index}`}
                        type="button"
                        onClick={() => selectLocation(result)}
                        className="block w-full border-b border-slate-100 px-4 py-3 text-left last:border-0 hover:bg-slate-50"
                      >
                        <p className="text-sm font-medium text-slate-900">
                          {result.formatted}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {result.city || result.state || result.country}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                {selectedLocation && (
                  <div className="mt-3 rounded-xl bg-emerald-50 p-4">
                    <p className="text-sm font-medium text-emerald-700">
                      ✓ Location selected
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      {selectedLocation.label}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-100 bg-slate-50/60 p-6">
              <button
                type="submit"
                className="rounded-xl bg-[#b4232c] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#991b1b]"
              >
                Create Donor Profile
              </button>
            </div>
          </form>
        </div>
      </main>
    );
  }

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
            <div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-xl font-semibold text-[#b4232c]">
                {profile.bloodGroup}
              </div>

              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                Blood Donor
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your donor information
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-3 py-1.5 text-sm font-medium ${
                profile.isAvailable
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {profile.isAvailable
                ? "Available to donate"
                : "Currently unavailable"}
            </span>
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
                {profile.locationName}
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
                onClick={toggleAvailability}
                className={`rounded-xl px-4 py-2.5 text-sm font-medium ${
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
