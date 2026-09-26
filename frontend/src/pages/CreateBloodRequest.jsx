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
      const response = await api("/blood-request", {
        method: "POST",
        body: JSON.stringify(data),
      });

      console.log(response);
      event.target.reset();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Blood Request</h1>

      <select name="bloodGroup" required defaultValue="">
        <option value="" disabled>
          Select Blood Group
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

      <input name="units" type="number" min="1" placeholder="Units" required />

      <input
        name="latitude"
        type="number"
        step="any"
        placeholder="Latitude"
        required
      />

      <input
        name="longitude"
        type="number"
        step="any"
        placeholder="Longitude"
        required
      />

      <select name="urgency" defaultValue="MEDIUM">
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
        <option value="EMERGENCY">Emergency</option>
      </select>

      <input name="requiredBy" type="datetime-local" />

      <button type="submit">Create Request</button>
    </form>
  );
};

export default CreateBloodRequest;
