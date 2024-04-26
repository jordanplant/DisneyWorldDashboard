// Fetch and compile menu data for multiple slugs
export default async function handler(req, res) {
    try {
      // Assuming you have a function to fetch and compile menu data
      const compiledMenu = await fetchAndCompileMenuData();
  
      if (!compiledMenu) {
        throw new Error('Failed to compile menu data');
      }
  
      // Pass the compiled menu data to the next step (getCompiledMenu or elsewhere)
      res.status(200).json(compiledMenu);
    } catch (error) {
      console.error('Error fetching compiled menu data:', error);
      res.status(500).json({ error: 'Failed to fetch compiled menu data' });
    }
  }
  
  async function fetchAndCompileMenuData() {
    try {
      // Fetch and compile data for multiple slugs using your existing logic
      const slugs = [
        'caseys-corner',
        'columbia-harbour-house',
        'cosmic-ray-starlight-cafe',
        'pecos-bill-tall-tale-inn-and-cafe',
        'pinocchio-village-haus',
        'golden-oak-outpost',
        'gastons-tavern',
        'sleepy-hollow',
        'friars-nook',
        'main-street-bakery',
        'lunching-pad',
        'tortuga-tavern',
      ];
      
  
      if (!slugs || !Array.isArray(slugs) || slugs.length === 0) {
        throw new Error('No slugs provided');
      }
  
      const dataPromises = slugs.map(slug => fetchMenuData(slug));
      const dataArray = await Promise.all(dataPromises);
      const compiledData = {};
      dataArray.forEach(item => {
        if (item && item.slug && item.data) {
          compiledData[item.slug] = item.data;
        }
      });
  
      return compiledData;
    } catch (error) {
      console.error('Error fetching and compiling menu data:', error);
      return null;
    }
  }
  
  async function fetchMenuData(slug) {
    const apiUrl = `https://disneyworld.disney.go.com/dining/dinemenu/api/menu?slug=${slug}&language=en`;
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch menu data for slug: ${slug}`);
      }
  
      const menuData = await response.json();
      return { slug, data: menuData };
    } catch (error) {
      console.error(`Error fetching menu data for slug ${slug}:`, error);
      return null;
    }
  }
  