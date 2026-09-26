import { api } from "../services/api";

const CreateBloodRequest = () => {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const data = {
      bloodGroup: formData.get("bloodGroup"),
      units: Number(formData.get("units")),
      latitude: Number(formData.get("latitude")),
      longitude: Number(formData.get("longitude")),
      urgency: formData.get("urgency"),
      requiredBy: formData.get("requiredBy") || undefined,
    };

    try {
      await api("/blood-request", {
        method: "POST",
        body: JSON.stringify(data),
      });

      event.target.reset();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <section className="mb-8">
          <p className="mb-2 text-sm font-medium text-[#b4232c]">
            Blood request
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Create a Blood Request
          </h1>

          <p className="mt-2 text-slate-500">
            Provide the details below so compatible donors can be found near
            your location.
          </p>
        </section>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          {/* Blood Details */}
          <section className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Blood details
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Tell us what type and quantity of blood is required.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Blood group
                </label>

                <select
                  name="bloodGroup"
                  required
                  defaultValue=""
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

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Units required
                </label>

                <input
                  name="units"
                  type="number"
                  min="1"
                  placeholder="e.g. 2"
                  required
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#b4232c] focus:ring-2 focus:ring-red-100"
                />
              </div>
            </div>
          </section>

          <div className="border-t border-slate-100" />

          {/* Location */}
          <section className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Request location
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Location is used to find nearby compatible donors.
              </p>
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
          </section>

          <div className="border-t border-slate-100" />

          {/* Urgency */}
          <section className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Request priority
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Help donors understand how urgently blood is needed.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Urgency
                </label>

                <select
                  name="urgency"
                  defaultValue="MEDIUM"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#b4232c] focus:ring-2 focus:ring-red-100"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="EMERGENCY">Emergency</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Required by
                </label>

                <input
                  name="requiredBy"
                  type="datetime-local"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#b4232c] focus:ring-2 focus:ring-red-100"
                />
              </div>
            </div>
          </section>

          {/* Submit */}
          <div className="flex justify-end border-t border-slate-100 bg-slate-50/60 p-6 sm:p-8">
            <button
              type="submit"
              className="rounded-xl bg-[#b4232c] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#991b1b]"
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
