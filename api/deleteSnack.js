import { promises as fs } from "fs";
const filePath = "./snacks.json"; // Adjust the path as necessary

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { id } = req.body; // Assuming ID is sent in the request body, adjust as necessary
    try {
      const data = await fs.readFile(filePath, "utf8");
      let snacks = JSON.parse(data);

      const filteredSnacks = snacks.filter((snack) => snack.id !== id);
      if (snacks.length === filteredSnacks.length) {
        return res.status(404).json({ message: "Snack not found" });
      }

      // Write the updated snacks list without the deleted snack
      await fs.writeFile(
        filePath,
        JSON.stringify(filteredSnacks, null, 2),
        "utf8"
      );

      res.status(200).json({ message: "Snack deleted successfully" });
    } catch (error) {
      console.error("Error deleting snack:", error);
      res.status(500).json({ message: "Failed to delete snack" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
