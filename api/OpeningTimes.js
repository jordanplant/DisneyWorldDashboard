import fetch from 'node-fetch';

const validParkIds = [
  "75ea578a-adc8-4116-a54d-dccb60765ef9", // Magic Kingdom
  "288747d1-8b4f-4a64-867e-ea7c9b27bad8", // Hollywood Studios
  "47f90d2c-e191-4239-a466-5892ef59a88b", // EPCOT
  "1c84a229-8862-4648-9c71-378ddd2c7693", // Animal Kingdom
  "b070cbc5-feaa-4b87-a8c1-f94cca037a18", // Typhoon Lagoon
  "ead53ea5-22e5-4095-9a83-8c29300d7c63", // Blizzard Beach
  "e8d0207f-da8a-4048-bec8-117aa946b2c2", // Disneyland Paris Resort
  "dae968d5-630d-4719-8b06-3d107e944401", // Disneyland Paris
  "ca888437-ebb4-4d50-aed2-d227f7096968", // Walt Disney Studios Paris
  "3cc919f1-d16d-43e0-8c3f-1dd269bd1a42", // Tokyo Disneyland
  "67b290d5-3478-4f23-b601-2f8fb71ba803", // Tokyo DisneySea
  "ddc4357c-c148-4b36-9888-07894fe75e83", // Shanghai Disneyland
  "bd0eb47b-2f02-4d4d-90fa-cb3a68988e3b", // Hong Kong Disneyland
  "7340550b-c14d-4def-80bb-acdb51d49a66", // Disneyland Anaheim
  "832fcd51-ea19-4e77-85c7-75d5843b127c"  // California Adventure
];

export default async (req, res) => {
  const { parkId } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!parkId || !validParkIds.includes(parkId)) {
    return res.status(400).json({ error: "Invalid park ID" });
  }

  const apiUrl = `https://api.themeparks.wiki/v1/entity/${parkId}/schedule`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5-second timeout

    const response = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(response.status).json({ error: `API Error: ${response.statusText}` });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    if (error.name === 'AbortError') {
      return res.status(408).json({ error: "Request Timeout" });
    }
    console.error("An error occurred:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};
