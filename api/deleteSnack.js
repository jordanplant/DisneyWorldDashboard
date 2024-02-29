export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { id } = req.body; // Assuming ID is sent in the request body
    const API_KEY = process.env.BIN_KEY;
    const BIN_ID = process.env.BIN_ID;
    const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`;

    try {
      // Fetch the current list of snacks
      const fetchResponse = await fetch(JSONBIN_URL, {
        method: "GET",
        headers: { "X-Master-Key": API_KEY },
      });

      if (!fetchResponse.ok) throw new Error("Failed to fetch current snacks");

      const { record: snacks } = await fetchResponse.json();

      const filteredSnacks = snacks.filter((snack) => snack.id !== id);
      if (snacks.length === filteredSnacks.length) {
        return res.status(404).json({ message: "Snack not found" });
      }

      // Update the bin with the filtered list
      await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": API_KEY,
        },
        body: JSON.stringify(filteredSnacks),
      });

      res.status(200).json({ message: "Snack deleted successfully" });
    } catch (error) {
      console.error("Error in operation:", error);
      res.status(500).json({ message: "Failed to delete snack" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
