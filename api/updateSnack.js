import { promises as fs } from "fs";
const filePath = "./snacks.json"; // Adjust the path as necessary

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { id, title, completed } = req.body;
    try {
      const data = await fs.readFile(filePath, "utf8");
      let snacks = JSON.parse(data);

      const snackIndex = snacks.findIndex((snack) => snack.id === id);
      if (snackIndex === -1) {
        return res.status(404).json({ message: "Snack not found" });
      }

      // Update the snack
      snacks[snackIndex] = { ...snacks[snackIndex], title, completed };

      // Write the updated snacks back to the file
      await fs.writeFile(filePath, JSON.stringify(snacks, null, 2), "utf8");

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
