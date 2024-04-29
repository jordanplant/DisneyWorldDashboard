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
        // "yesake",
        // "blaze-pizza",
        // "coca-cola-rooftop-beverage-bar",
        // "front-porch-bar-at-house-of-blues-restaurant",
        // "joffreys-coffee-tea-smoothie",
        // "bb-wolfs-sausage-co",
        // "vivoli-il-gelato",
        // "sprinkles",
        // "the-basket",
        // "marketplace-snacks",
        // "smokehouse",
        // "dockside-margaritas",
        // "ghirardelli-soda-fountain",
        // "cookes-of-dublin",
        // "joffreys-coffee-tea-company",
        // "erin-mckennas-bakery-nyc",
        // "polite-pig",
        // "sunshine-churros-marketplace",
        // "gideons-bakehouse",
        // "salt-and-straw",

        // "jock-lindseys-hangar-bar",
        // "earl-of-sandwich",
        // "everglazed-donuts",
        // "wetzels-pretzels-west-side",
        // "food-trucks",
        // "wetzels-pretzels",
        // "pizza-ponte",
        // "morimoto-asia-street-food",
        // "eet-by-maneet-chauhan",
        // "amorettes-patisserie",
        // "daily-poutine",
        // "haagen-dazs-west-side",
        // "pepe",
        // "swirls-on-the-water",
        // "d-luxe-burger",
        // "sunshine-churros-west-side",
        // "the-ganachery",
        // "4-rivers-cantina-food-truck",
        // "chicken-guy",
        // "mara",

        "cape-town-lounge-and-wine-bar",
        "victoria-falls-lounge",
        "restaurantosaurus",
        "dino-bite-snacks",
        "quality-beverages",
        "yak-and-yeti-local-foods-cafe",
        "drinkwallah",
        "harambe-fruit-market",
        "eight-spoon-cafe",
        "mahindi",
        "anandapur-ice-cream-truck",
        "caravan-road",
        "trilo-bites",
        "nomad-lounge",
        "creature-comforts",
        "satuli-canteen",
        "pongu-pongu",
        "trek-snacks",
        "harambe-market",
        "dawa-bar",
        "pizzafari",
        "kusafiri-coffee-shop-and-bakery",
        "smiling-crocodile",
        "thirsty-river-bar",
        "tamu-tamu-refreshments",

        // "isle-of-java",
        // "terra-treats",
        // "flame-tree-barbecue",
        // "warung-outpost",
        // "boardwalk-joes-marvelous-margaritas",
        // "pizza-window",
        // "abracadabar",
        // "boardwalk-ice-cream",
        // "boardwalk-deli",
        // "funnel-cake-cart",
        // "backlot-express",
        // "woodys-lunchbox",
        // "baseline-tap-house",
        // "market",
        // "dockside-diner",
        // "neighborhood-bakery",
        // "docking-bay-7-food-and-cargo",
        // "epic-eats",
        // "rosies-all-american-cafe",
        // "ronto-roasters",
        // "pizzerizzo",
        // "kat-sakas-kettle",
        // "hollywood-scoops",
        // "hollywood-brown-derby-lounge",
        // "tune-in-lounge",
        // "anaheim-produce",
        // "abc-commissary",
        // "milk-stand",
        // "krnr-the-rock-station",
        // "trolley-car-cafe",
        // "catalina-eddies",
        // "fairfax-fare",
        // "l-artisan-des-glaces",
        // "sommerfest",
        // "africa-coolpost",
        // "popcorn-at-canada-pavilion",
        // "rose-and-crown-pub",
        // "kabuki-cafe",
        // "block-hans",
        // "refreshment-port",
        // "connections-eatery",
        // "the-land-cart",
        // "crepes-a-emporter",
        // "oasis-sweets-sips",
        // "choza-de-margarita",
        // "les-halles-boulangerie-patisserie",
        // "lotus-blossom-cafe",
        // "joy-of-tea",
        // "uk-beer-cart",
        // "les-vins-des-chefs-de-france",
        // "yorkshire-county-fish-shop",
        // "cava-del-tequila",
        // "regal-eagle-smokehouse",
        // "tangierine-cafe",
        // "fife-and-drum-tavern",

        // "katsura-grill",
        // "test-track-cool-wash",
        // "flower-garden-festival-outdoor-kitchens-allergy-friendly",
        // "cantina-de-san-angel",
        // "spice-road-table-bar",
        // "funnel-cake",
        // "connections-cafe",
        // "gelateria-toscana",
        // "sunshine-seasons",
        // "kringla-bakeri-og-kafe",
        // "sunshine-tree-terrace",
        // "prince-eric-village-market",
        // "liberty-square-market",
        // "main-street-bakery",
        // "tortuga-tavern",
        // "lunching-pad",
        // "pecos-bill-tall-tale-inn-and-cafe",
        // "storybook-treats",
        // "auntie-gravitys-galactic-goodies",
        // "westward-ho",
        // "sleepy-hollow",
        // "cheshire-cafe",
        // "golden-oak-outpost",
        // "cool-ship",
        // "pinocchio-village-haus",
        // "columbia-harbour-house",
        // "friars-nook",
        // "caseys-corner",
        // "cosmic-ray-starlight-cafe",
        // "plaza-ice-cream-parlor",
        // "gastons-tavern",
        // "aloha-isle",

        // "gasparilla-island-grill",
        // "enchanted-rose-lounge",
        // "steakhouse-71-lounge",
        // "contempo-cafe",
    
      
        // "outer-rim",

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