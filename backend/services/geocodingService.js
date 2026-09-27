const geocodeLocation = async (location) => {
  const url = new URL(
    "https://api.geoapify.com/v1/geocode/search",
  );

  url.searchParams.set("text", location);
  url.searchParams.set("filter", "countrycode:in");
  url.searchParams.set("limit", "5");
  url.searchParams.set("format", "json");
  url.searchParams.set("apiKey", process.env.GEOAPIFY_API_KEY);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Geocoding service failed");
  }

  const data = await response.json();

  return data.results;
};

module.exports = { geocodeLocation };