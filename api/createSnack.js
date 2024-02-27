import { promises as fs } from "fs";
const filePath = "./snacks.json"; // Adjust the path as necessary

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Read the existing snacks
      const data = await fs.readFile(filePath, "utf8");
      const snacks = JSON.parse(data);

      // Add the new snack
      const newSnack = { ...req.body, id: new Date().getTime().toString() }; // Simple ID generation
      snacks.push(newSnack);

      // Write the updated snacks back to the file
      await fs.writeFile(filePath, JSON.stringify(snacks, null, 2), "utf8");

      res.status(201).json(newSnack);
    } catch (error) {
      console.error("Error creating snack:", error);
      res.status(500).json({ message: "Failed to create snack" });
    }
  } else {
    // Handle any requests other than POST
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
