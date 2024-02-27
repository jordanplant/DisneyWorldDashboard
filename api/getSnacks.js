import { promises as fs } from "fs";
const filePath = "./snacks.json"; // Adjust the path as necessary

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const data = await fs.readFile(filePath, "utf8");
      const snacks = JSON.parse(data);
      res.status(200).json(snacks);
    } catch (error) {
      console.error("Error getting snacks:", error);
      res.status(500).json({ message: "Failed to get snacks" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
