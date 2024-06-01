export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { id, title, price, location, completed, rating } = req.body;

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
      const snackIndex = snacks.findIndex((snack) => snack.id === id);

      if (snackIndex === -1) {
        return res.status(404).json({ message: "Snack not found" });
      }

      // Update the snack
      snacks[snackIndex] = { ...snacks[snackIndex], title, price, location, completed, rating }; // Add rating to updated snack object

      // Update the bin with the new list of snacks
      await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": API_KEY,
        },
        body: JSON.stringify(snacks),
      });

      res.status(200).json(snacks[snackIndex]);
    } catch (error) {
      console.error("Error updating snack:", error);
      res.status(500).json({ message: "Failed to update snack" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
