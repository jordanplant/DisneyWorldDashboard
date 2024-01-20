// api/waitTimes.js
import fetch from "node-fetch";

export default async (req, res) => {
  try {
    const apiUrl = "https://queue-times.com/parks/6/queue_times.json";
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};
