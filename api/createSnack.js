export default async function handler(req, res) {
  if (req.method === "POST") {
    const API_KEY = process.env.BIN_KEY;
    const BIN_ID = process.env.BIN_ID;
    const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

    try {
      // Fetch the current list of snacks from JSONBin.io
      const fetchResponse = await fetch(`${JSONBIN_URL}/latest`, {
        method: "GET",
        headers: {
          "X-Master-Key": API_KEY,
        },
      });

      if (!fetchResponse.ok) {
        throw new Error("Failed to fetch current snacks");
      }

      const fetchData = await fetchResponse.json();
      const snacks = fetchData.record || [];

      // Add the new snack with 'completed' explicitly set to false
      const newSnack = {
        ...req.body,
        id: new Date().getTime().toString(),
        completed: false,
      };

      snacks.push(newSnack);

      // Update the bin with the new list of snacks
      const updateResponse = await fetch(JSONBIN_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": API_KEY,
        },
        body: JSON.stringify(snacks),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update snacks");
      }

      // Respond with the newly added snack
      res.status(201).json(newSnack);
    } catch (error) {
      console.error("Error in JSONBin.io operation:", error);
      res.status(500).json({ message: "Failed to create snack" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
