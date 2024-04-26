import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const developmentApiUrl = process.env.DEVELOPMENT_API_URL;
const productionApiUrl = process.env.PRODUCTION_API_URL;

// Fetch data from the specified API URL
async function fetchData(apiUrl) {
  try {
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
// Extract specific information from the JSON data
function extractData(jsonData) {
    try {
      const extractedData = [];
  
      for (const key in jsonData) {
        const restaurant = jsonData[key];
        const mealPeriods = restaurant.mealPeriods || [];
  
        mealPeriods.forEach(meal => {
          meal.groups.forEach(group => {
            group.items.forEach(item => {
              const extractedItem = {
                restaurantLocation: restaurant.location || 'Location Not Available',
                restaurantName: restaurant.name || 'Name Not Available',
                itemTitle: item.title || 'Title Not Available',
                itemPrice: item.priceValue || 0,
                itemDescription: item.description || 'Description Not Available',
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
    // Determine the API URL based on the environment
    const apiUrl = process.env.NODE_ENV === 'development' ? developmentApiUrl : productionApiUrl;

    if (!apiUrl) {
      throw new Error('API URL not defined for the current environment');
    }

    // Fetch data using the fetchData function
    const fetchedData = await fetchData(apiUrl);

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
