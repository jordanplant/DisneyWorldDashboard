import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

// Fetch data from the specified API URL
async function fetchData() {
  try {
    const apiUrl = 'https://disney-world-dashboard.vercel.app/api/getMenu'; // Set the API URL

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${apiUrl}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

// Extract specific information from the JSON data
function extractData(jsonData) {
  try {
    const parkNameMapping = {
      'Disney Springs': 'Disney Springs',
      'Disney\'s Animal Kingdom Theme Park': 'Animal Kingdom',
      'Disney\'s Hollywood Studios': 'Hollywood Studios',
      'EPCOT': 'EPCOT',
      'Magic Kingdom Park': 'Magic Kingdom'
    };

    const extractedData = [];

    for (const key in jsonData) {
      const restaurant = jsonData[key];
      const mealPeriods = restaurant.mealPeriods || [];

      mealPeriods.forEach(meal => {
        meal.groups.forEach(group => {
          group.items.forEach(item => {
            const location = restaurant.location || 'null';
            const [mainLocation, subLocation] = location.split(',').map(part => part.trim()); // Split by comma and trim whitespace
            
            // Replace park name if it exists in the mapping
            const renamedLocation = parkNameMapping[mainLocation] || mainLocation;
            
            const extractedItem = {
              restaurantLocation: renamedLocation,
              subLocation: subLocation || 'null', // If there's no sub-location, set a default value
              restaurantName: restaurant.name || 'null',
              itemTitle: item.title || 'null',
              itemPrice: item.priceValue || 0,
              itemDescription: item.description || 'null',
            };
            extractedData.push(extractedItem);
          });
        });
      });
    }

    return extractedData;
  } catch (error) {
    console.error('Error extracting data:', error);
    return [];
  }
}



// Handler function to fetch and return menu data
export default async function handler(req, res) {
  try {
    // Fetch data using the fetchData function
    const fetchedData = await fetchData();

    if (!fetchedData) {
      throw new Error('Failed to fetch data');
    }

    // Extract specific information from the fetched data
    const extractedData = extractData(fetchedData);

    res.status(200).json(extractedData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
