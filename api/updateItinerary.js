export default async function handler(req, res) {
    if (req.method === "PUT") {
      const { id, date, park, time, activity } = req.body;
      const API_KEY = process.env.BIN_KEY;
      const BIN_ID = process.env.ITIN_BIN_ID;
      const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`;
  
      try {
        // Fetch the current itinerary
        const fetchResponse = await fetch(JSONBIN_URL, {
          method: "GET",
          headers: { "X-Master-Key": API_KEY },
        });
  
        if (!fetchResponse.ok) throw new Error("Failed to fetch current itinerary");
  
        const { record: itinerary } = await fetchResponse.json();
        const entryIndex = itinerary.findIndex((entry) => entry.id === id);
  
        if (entryIndex === -1) {
          return res.status(404).json({ message: "Entry not found" });
        }
  
        // Update the itinerary entry
        itinerary[entryIndex] = { id, date, park, time, activity };
  
        // Update the bin with the new itinerary
        await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Master-Key": API_KEY,
          },
          body: JSON.stringify(itinerary),
        });
  
        res.status(200).json(itinerary[entryIndex]);
      } catch (error) {
        console.error("Error updating itinerary entry:", error);
        res.status(500).json({ message: "Failed to update itinerary entry" });
      }
    } else {
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  