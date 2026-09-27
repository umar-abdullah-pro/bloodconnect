import { useState } from "react";
import { api } from "../services/api";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const urgencyLevels = ["LOW", "MEDIUM", "HIGH", "EMERGENCY"];

const CreateBloodRequest = () => {
  const [location, setLocation] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

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

          setLocation(data.locationName);

          setSelectedLocation({
            latitude: coords.latitude,
            longitude: coords.longitude,
            label: data.locationName,
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedLocation) {
      console.error("Please select a location");
      return;
    }

    const formData = new FormData(event.target);

    const data = {
      bloodGroup: formData.get("bloodGroup"),
      units: Number(formData.get("units")),
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      urgency: formData.get("urgency"),
      requiredBy: formData.get("requiredBy") || undefined,
    };

    try {
      await api("/blood-request", {
        method: "POST",
        body: JSON.stringify(data),
      });

      event.target.reset();
      setLocation("");
      setSelectedLocation(null);
      setLocationResults([]);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-3xl">
        <section className="mb-8">
          <p className="mb-2 text-sm font-medium text-[#b4232c]">
            Blood request
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Create Blood Request
          </h1>

          <p className="mt-2 text-slate-500">
            Tell us what blood is needed and where it is required.
          </p>
        </section>

        <form
          onSubmit={handleSubmit}
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
                Units needed
              </label>

              <input
                name="units"
                type="number"
                min="1"
                required
                placeholder="e.g. 2"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#b4232c] focus:ring-2 focus:ring-red-100"
              />
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

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Urgency
              </label>

              <select
                name="urgency"
                defaultValue="MEDIUM"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#b4232c] focus:ring-2 focus:ring-red-100"
              >
                {urgencyLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Required by
              </label>

              <input
                name="requiredBy"
                type="datetime-local"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#b4232c] focus:ring-2 focus:ring-red-100"
              />
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-100 bg-slate-50/60 p-6">
            <button
              type="submit"
              className="rounded-xl bg-[#b4232c] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#991b1b]"
            >
              Create Blood Request
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateBloodRequest;
