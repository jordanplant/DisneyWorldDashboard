export default async function handler(req, res) {
  if (req.method === "POST") {
    const API_KEY = process.env.BIN_KEY;
    const ITIN_BIN_ID = process.env.ITIN_BIN_ID;
    const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${ITIN_BIN_ID}`;

    try {
      // Ensure the request body is properly parsed
      const { date, park, time, activity } = req.body;

      // Check if all required fields are present
      if (!park || !time || !activity) {
        throw new Error("Missing required fields in the request body");
      }

      // Generate a unique ID for the new itinerary entry using timestamp
      const id = new Date().getTime().toString();

      // Fetch the current itinerary from JSONBin.io
      const fetchResponse = await fetch(`${JSONBIN_URL}/latest`, {
        method: "GET",
        headers: {
          "X-Master-Key": API_KEY,
        },
      });

      if (!fetchResponse.ok) {
        throw new Error("Failed to fetch current itinerary");
      }

      const fetchData = await fetchResponse.json();
      const itinerary = Array.isArray(fetchData.record) ? fetchData.record : [];

      // Create a new itinerary entry
      const newEntry = {
        id,
        date,
        park,
        time,
        activity,
      };

      itinerary.push(newEntry);

      // Update the bin with the new itinerary
      const updateResponse = await fetch(JSONBIN_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": API_KEY,
        },
        body: JSON.stringify(itinerary),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update itinerary");
      }

      // Respond with the newly added itinerary entry
      res.status(201).json(newEntry);
    } catch (error) {
      console.error("Error in JSONBin.io operation:", error);
      res.status(500).json({ message: "Failed to create itinerary entry" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
