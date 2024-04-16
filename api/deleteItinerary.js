export default async function handler(req, res) {
    if (req.method === "DELETE") {
      const { id } = req.body;
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
  
        // Remove the itinerary entry
        itinerary.splice(entryIndex, 1);
  
        // Update the bin with the new itinerary
        await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Master-Key": API_KEY,
          },
          body: JSON.stringify(itinerary),
        });
  
        res.status(200).json({ message: "Entry deleted successfully" });
      } catch (error) {
        console.error("Error deleting itinerary entry:", error);
        res.status(500).json({ message: "Failed to delete itinerary entry" });
      }
    } else {
      res.setHeader("Allow", ["DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  