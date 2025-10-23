const sampleListings = [
  // Original 29 Listings with new images
  {
    title: "Cozy Beachfront Cottage",
    description:
      "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 1500,
    location: "Malibu",
    country: "United States",
    geometry:{
      type: 'Point', coordinates: [ -118.689423, 34.035591 ] 
    },
    category: "Trending", 
  },
  {
    title: "Modern Loft in Downtown",
    description:
      "Stay in the heart of the city in this stylish loft apartment. Perfect for urban explorers!",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 1200,
    location: "New York City",
    country: "United States",
    geometry:{
      type: 'Point', coordinates: [ -74.0059945, 40.7127492 ]
    },
    category: "Rooms", 
  },
  {
    title: "Mountain Retreat",
    description:
      "Unplug and unwind in this peaceful mountain cabin. Surrounded by nature, it's a perfect place to recharge.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1876044/pexels-photo-1876044.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 1000,
    location: "Aspen",
    country: "United States",
    geometry:{
      type: 'Point', coordinates: [ -106.823561, 39.191113 ]
    },
    category: "Mountain", 
  },
  {
    title: "Historic Villa in Tuscany",
    description:
      "Experience the charm of Tuscany in this beautifully restored villa. Explore the rolling hills and vineyards.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1648771/pexels-photo-1648771.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 2500,
    location: "Florence",
    country: "Italy",
    geometry:{
      type: 'Point', coordinates: [ 11.255576, 43.769871 ]
    },
    category: "Iconic Cities", 
  },
  {
    title: "Secluded Treehouse Getaway",
    description:
      "Live among the treetops in this unique treehouse retreat. A true nature lover's paradise.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/2440939/pexels-photo-2440939.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 800,
    location: "Portland",
    country: "United States",
    geometry:{
      type: 'Point', coordinates: [ -122.674195, 45.520247 ]
    },
    category: "Camping", 
  },
  {
    title: "Beachfront Paradise",
    description:
      "Step out of your door onto the sandy beach. This beachfront condo offers the ultimate relaxation.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 2000,
    location: "Cancun",
    country: "Mexico",
    geometry:{
      type: 'Point', coordinates: [ -86.851047, 21.161785 ]
    },
    category: "Amazing pools", 
  },
  {
    title: "Rustic Cabin by the Lake",
    description:
      "Spend your days fishing and kayaking on the serene lake. This cozy cabin is perfect for outdoor enthusiasts.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1127119/pexels-photo-1127119.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 900,
    location: "Lake Tahoe",
    country: "United States",
    geometry:{
      coordinates: [ -120.12787, 39.267319 ], type: 'Point'
    },
    category: "Mountain", 
  },
  {
    title: "Luxury Penthouse with City Views",
    description:
      "Indulge in luxury living with panoramic city views from this stunning penthouse apartment.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 3500,
    location: "Los Angeles",
    country: "United States",
    geometry:{
      type: 'Point', coordinates: [ -118.242766, 34.053691 ]
    },
    category: "Rooms", 
  },
  {
    title: "Ski-In/Ski-Out Chalet",
    description:
      "Hit the slopes right from your doorstep in this ski-in/ski-out chalet in the Swiss Alps.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/6580703/pexels-photo-6580703.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 3000,
    location: "Verbier",
    country: "Switzerland",
    geometry:{
      type: 'Point', coordinates: [ 7.228548, 46.096795 ]
    },
    category: "Mountain", 
  },
  {
    title: "Safari Lodge in the Serengeti",
    description:
      "Experience the thrill of the wild in a comfortable safari lodge. Witness the Great Migration up close.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 4000,
    location: "Serengeti National Park",
    country: "Tanzania",
    geometry:{
      coordinates: [ 34.8333, 2.3333 ], type: 'Point'
    },
    category: "Camping", 
  },
  {
    title: "Historic Canal House",
    description:
      "Stay in a piece of history in this beautifully preserved canal house in Amsterdam's iconic district.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 1800,
    location: "Amsterdam",
    country: "Netherlands",
    geometry:{
      type: 'Point', coordinates: [ 4.9, 52.378 ]
    },
    category: "Rooms", 
  },
  {
    title: "Private Island Retreat",
    description:
      "Have an entire island to yourself for a truly exclusive and unforgettable vacation experience.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1483024/pexels-photo-1483024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 10000,
    location: "Fiji",
    country: "Fiji",
    geometry:{
      type: 'Point', coordinates: [ 178.0, -17.7134 ]
    },
    category: "Amazing pools", 
  },
  {
    title: "Charming Cottage in the Cotswolds",
    description:
      "Escape to the picturesque Cotswolds in this quaint and charming cottage with a thatched roof.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 1200,
    location: "Cotswolds",
    country: "United Kingdom",
    geometry:{
      type: 'Point', coordinates: [ -1.8949, 51.8488 ] 
    },
    category: "Farms", 
  },
  {
    title: "Historic Brownstone in Boston",
    description:
      "Step back in time in this elegant historic brownstone located in the heart of Boston.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/2082090/pexels-photo-2082090.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 2200,
    location: "Boston",
    country: "United States",
    geometry:{
      type: 'Point', coordinates: [ -71.058291, 42.360253 ]
    },
    category: "Rooms", 
  },
  {
    title: "Beachfront Bungalow in Bali",
    description:
      "Relax on the sandy shores of Bali in this beautiful beachfront bungalow with a private pool.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 1800,
    location: "Bali",
    country: "Indonesia",
    geometry:{
      type: 'Point', coordinates: [ 115.2191175, -8.6524973 ]
    },
    category: "Rooms", 
  },
  {
    title: "Mountain View Cabin in Banff",
    description:
      "Enjoy breathtaking mountain views from this cozy cabin in the Canadian Rockies.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 1500,
    location: "Banff",
    country: "Canada",
    geometry:{
      type: 'Point', coordinates: [ -115.56825, 51.177778 ]
    },
    category: "Mountain", 
  },
  {
    title: "Art Deco Apartment in Miami",
    description:
      "Step into the glamour of the 1920s in this stylish Art Deco apartment in South Beach.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 1600,
    location: "Miami",
    country: "United States",
    geometry:{
      coordinates: [ -80.18537321875, 25.76513515625 ], type: 'Point'
    },
    category: "Rooms", 
  },
  {
    title: "Tropical Villa in Phuket",
    description:
      "Escape to a tropical paradise in this luxurious villa with a private infinity pool in Phuket.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/3149826/pexels-photo-3149826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 3000,
    location: "Phuket",
    country: "Thailand",
    geometry:{
      type: 'Point', coordinates: [ 98.386793, 7.888931 ]
    },
    category: "Amazing pools", 
  },
  {
    title: "Historic Castle in Scotland",
    description:
      "Live like royalty in this historic castle in the Scottish Highlands. Explore the rugged beauty of the area.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/402028/pexels-photo-402028.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 4000,
    location: "Scottish Highlands",
    country: "United Kingdom",
    geometry:{
      coordinates: [ -4.228937, 57.477415 ], type: 'Point'
    },
    category: "Castles", 
  },
  {
    title: "Desert Oasis in Dubai",
    description:
      "Experience luxury in the middle of the desert in this opulent oasis in Dubai with a private pool.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 5000,
    location: "Dubai",
    country: "United Arab Emirates",
    geometry:{
      type: 'Point', coordinates: [ 55.292491, 25.265347 ]
    },
    category: "Iconic Cities", 
  },
  {
    title: "Rustic Log Cabin in Montana",
    description:
      "Unplug and unwind in this cozy log cabin surrounded by the natural beauty of Montana.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/101808/pexels-photo-101808.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 1100,
    location: "Montana",
    country: "United States",
    geometry:{
      type: 'Point', coordinates: [ -109.172599073804, 47.0725146587006 ]
    },
    category: "Camping", 
  },
  {
    title: "Beachfront Villa in Greece",
    description:
      "Enjoy the crystal-clear waters of the Mediterranean in this beautiful beachfront villa on a Greek island.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/2096983/pexels-photo-2096983.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 2500,
    location: "Mykonos",
    country: "Greece",
    geometry:{
      type: 'Point', coordinates: [ 25.334045, 37.440817 ]
    },
    category: "Rooms", 
  },
  {
    title: "Eco-Friendly Treehouse Retreat",
    description:
      "Stay in an eco-friendly treehouse nestled in the forest. It's the perfect escape for nature lovers.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 750,
    location: "Costa Rica",
    country: "Costa Rica",
    geometry:{
      coordinates: [ -84.092347, 9.932191 ], type: 'Point'
    },
    category: "Camping", 
  },
  {
    title: "Historic Cottage in Charleston",
    description:
      "Experience the charm of historic Charleston in this beautifully restored cottage with a private garden.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 1600,
    location: "Charleston",
    country: "United States",
    geometry:{
      type: 'Point', coordinates: [ -79.940273, 32.787601 ] 
    },
    category: "Rooms", 
  },
  {
    title: "Modern Apartment in Tokyo",
    description:
      "Explore the vibrant city of Tokyo from this modern and centrally located apartment.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1813502/pexels-photo-1813502.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 2000,
    location: "Tokyo",
    country: "Japan",
    geometry:{
      type: 'Point', coordinates: [ 139.1485991, 35.76478424 ]
    },
    category: "Rooms", 
  },
  {
    title: "Lakefront Cabin in New Hampshire",
    description:
      "Spend your days by the lake in this cozy cabin in the scenic White Mountains of New Hampshire.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 1200,
    location: "New Hampshire",
    country: "United States",
    geometry:{
      type: 'Point', coordinates: [ -71.5783054333969, 43.6898878153712 ]
    },
    category: "Rooms", 
  },
  {
    title: "Luxury Villa in the Maldives",
    description:
      "Indulge in luxury in this overwater villa in the Maldives with stunning views of the Indian Ocean.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 6000,
    location: "Maldives",
    country: "Maldives",
    geometry:{
      coordinates: [ 73.2207, 3.2028 ], type: 'Point'
    },
    category: "Boats", 
  },
  {
    title: "Ski Chalet in Aspen",
    description:
      "Hit the slopes in style with this luxurious ski chalet in the world-famous Aspen ski resort.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/2082087/pexels-photo-2082087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 4000,
    location: "Aspen",
    country: "United States",
    geometry:{
      type: 'Point', coordinates: [ -106.823561, 39.191113 ]
    },
    category: "Mountain", 
  },
  {
    title: "Secluded Beach House in Costa Rica",
    description:
      "Escape to a secluded beach house on the Pacific coast of Costa Rica. Surf, relax, and unwind.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 1800,
    location: "Costa Rica",
    country: "Costa Rica",
    geometry:{
      coordinates: [ -84.092347, 9.932191 ], type: 'Point' 
    },
    category: "Rooms", 
  },
  // New Listings (71)
  
  // Category: Arctic (10)
  {
    title: "Northern Lights Igloo",
    description: "Watch the Aurora Borealis from your bed in this glass igloo.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/364096/pexels-photo-364096.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 4500,
    location: "Rovaniemi",
    country: "Finland",
    geometry: { type: 'Point', coordinates: [ 25.7294, 66.5039 ] },
    category: "Arctic",
  },
  {
    title: "Cozy Cabin in Tromsø",
    description: "A warm, modern cabin perfect for northern lights hunting.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 2800,
    location: "Tromsø",
    country: "Norway",
    geometry: { type: 'Point', coordinates: [ 18.9553, 69.6492 ] },
    category: "Arctic",
  },
  {
    title: "Icelandic Hideaway",
    description: "Remote cabin near Reykjavik with private hot tub.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1102915/pexels-photo-1102915.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 3200,
    location: "Reykjavik",
    country: "Iceland",
    geometry: { type: 'Point', coordinates: [ -21.9426, 64.1466 ] },
    category: "Arctic",
  },
  {
    title: "Svalbard Expedition Base",
    description: "A simple, rugged base for exploring the high arctic.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1666067/pexels-photo-1666067.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 2000,
    location: "Longyearbyen",
    country: "Norway",
    geometry: { type: 'Point', coordinates: [ 15.4669, 78.2232 ] },
    category: "Arctic",
  },
  {
    title: "Greenland Icefjord House",
    description: "Stunning views of the Ilulissat Icefjord.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1638324/pexels-photo-1638324.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 3500,
    location: "Ilulissat",
    country: "Greenland",
    geometry: { type: 'Point', coordinates: [ -51.1000, 69.2167 ] },
    category: "Arctic",
  },
  {
    title: "Swedish Lapland Retreat",
    description: "Stay at the famous Icehotel in Jukkasjärvi.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/373406/pexels-photo-373406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 5000,
    location: "Kiruna",
    country: "Sweden",
    geometry: { type: 'Point', coordinates: [ 20.2252, 67.8557 ] },
    category: "Arctic",
  },
  {
    title: "Abisko Aurora Sky Station",
    description: "Lodge near one of the best places on earth to see the aurora.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/259646/pexels-photo-259646.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 3100,
    location: "Abisko",
    country: "Sweden",
    geometry: { type: 'Point', coordinates: [ 18.8322, 68.3496 ] },
    category: "Arctic",
  },
  {
    title: "Modern Nuuk Apartment",
    description: "Explore the capital of Greenland from this central apartment.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 2200,
    location: "Nuuk",
    country: "Greenland",
    geometry: { type: 'Point', coordinates: [ -51.7216, 64.1836 ] },
    category: "Arctic",
  },
  {
    title: "Fairbanks Log Cabin",
    description: "Classic Alaskan log cabin, perfect for winter adventures.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1034584/pexels-photo-1034584.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 2600,
    location: "Fairbanks",
    country: "United States",
    geometry: { type: 'Point', coordinates: [ -147.7164, 64.8401 ] },
    category: "Arctic",
  },
  {
    title: "Alta Riverfront Cabin",
    description: "Peaceful cabin known for salmon fishing and northern lights.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/460775/pexels-photo-460775.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 2750,
    location: "Alta",
    country: "Norway",
    geometry: { type: 'Point', coordinates: [ 23.2715, 69.9689 ] },
    category: "Arctic",
  },
  
  // Category: Castles (9 new)
  {
    title: "Scottish Highland Castle",
    description: "Live like a laird in the Eilean Donan Castle.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1835718/pexels-photo-1835718.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 7000,
    location: "Kyle of Lochalsh",
    country: "United Kingdom",
    geometry: { type: 'Point', coordinates: [ -5.5161, 57.2740 ] },
    category: "Castles",
  },
  {
    title: "Bavarian Fairytale Castle",
    description: "Stay in a guest house with views of Neuschwanstein.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/2790396/pexels-photo-2790396.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 4500,
    location: "Schwangau",
    country: "Germany",
    geometry: { type: 'Point', coordinates: [ 10.7498, 47.5576 ] },
    category: "Castles",
  },
  {
    title: "French Abbey Fortress",
    description: "A unique guesthouse on the island of Mont Saint-Michel.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1098460/pexels-photo-1098460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 3800,
    location: "Mont Saint-Michel",
    country: "France",
    geometry: { type: 'Point', coordinates: [ -1.5114, 48.6360 ] },
    category: "Castles",
  },
  {
    title: "Royal Prague Castle Quarters",
    description: "Stay in a historic building within the Prague Castle complex.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 4200,
    location: "Prague",
    country: "Czechia",
    geometry: { type: 'Point', coordinates: [ 14.4012, 50.0901 ] },
    category: "Castles",
  },
  {
    title: "Spanish Fairytale Fortress",
    description: "A room with a view of the Alcázar of Segovia.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 3300,
    location: "Segovia",
    country: "Spain",
    geometry: { type: 'Point', coordinates: [ -4.1325, 40.9529 ] },
    category: "Castles",
  },
  {
    title: "Loire Valley Château",
    description: "Elegant suite in a historic château in the Loire Valley.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 4800,
    location: "Chambord",
    country: "France",
    geometry: { type: 'Point', coordinates: [ 1.5172, 47.6162 ] },
    category: "Castles",
  },
  {
    title: "Japanese Castle Stay",
    description: "Traditional ryokan near the magnificent Himeji Castle.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 3900,
    location: "Himeji",
    country: "Japan",
    geometry: { type: 'Point', coordinates: [ 134.6940, 34.8394 ] },
    category: "Castles",
  },
  {
    title: "Dracula's Castle Guesthouse",
    description: "A spooky stay in a guesthouse near Bran Castle.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/2067569/pexels-photo-2067569.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 2500,
    location: "Bran",
    country: "Romania",
    geometry: { type: 'Point', coordinates: [ 25.3672, 45.5149 ] },
    category: "Castles",
  },
  {
    title: "Windsor Royal Quarters",
    description: "A luxury apartment overlooking Windsor Castle.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/2440471/pexels-photo-2440471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 5500,
    location: "Windsor",
    country: "United Kingdom",
    geometry: { type: 'Point', coordinates: [ -0.6038, 51.4839 ] },
    category: "Castles",
  },
  
  // Category: Farms (9 new)
  {
    title: "Napa Valley Vineyard",
    description: "A luxurious suite on a working vineyard. Wine tasting included.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/159844/cellular-tissue-wine-hospitality-159844.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 5500,
    location: "Napa Valley",
    country: "United States",
    geometry: { type: 'Point', coordinates: [ -122.2855, 38.2975 ] },
    category: "Farms",
  },
  {
    title: "Provence Lavender Farm",
    description: "Charming guesthouse surrounded by fields of lavender.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/414493/pexels-photo-414493.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 3400,
    location: "Provence",
    country: "France",
    geometry: { type: 'Point', coordinates: [ 5.2423, 43.9316 ] },
    category: "Farms",
  },
  {
    title: "South African Winery Stay",
    description: "Stay in a Cape Dutch manor on a Stellenbosch wine estate.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/208695/pexels-photo-208695.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 3200,
    location: "Stellenbosch",
    country: "South Africa",
    geometry: { type: 'Point', coordinates: [ 18.8601, -33.9360 ] },
    category: "Farms",
  },
  {
    title: "Vermont Dairy Farm",
    description: "A rustic farm-stay. Help milk the cows and collect eggs.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1423600/pexels-photo-1423600.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 1800,
    location: "Stowe",
    country: "United States",
    geometry: { type: 'Point', coordinates: [ -72.6834, 44.4654 ] },
    category: "Farms",
  },
  {
    title: "Tuscan Agriturismo",
    description: "An authentic Italian farm stay with cooking classes.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/208701/pexels-photo-208701.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 2900,
    location: "Siena",
    country: "Italy",
    geometry: { type: 'Point', coordinates: [ 11.3307, 43.3188 ] },
    category: "Farms",
  },
  {
    title: "Amish Country Farmhouse",
    description: "A simple, peaceful stay in Lancaster County.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1359000/pexels-photo-1359000.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 1500,
    location: "Lancaster",
    country: "United States",
    geometry: { type: 'Point', coordinates: [ -76.3055, 40.0421 ] },
    category: "Farms",
  },
  {
    title: "Margaret River Winery",
    description: "Modern apartment overlooking vineyards in Western Australia.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/971316/pexels-photo-971316.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 3300,
    location: "Margaret River",
    country: "Australia",
    geometry: { type: 'Point', coordinates: [ 115.0768, -33.9548 ] },
    category: "Farms",
  },
  {
    title: "Irish Country Farm",
    description: "A cozy B&B on a working sheep farm in The Burren.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/509922/pexels-photo-509922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 1900,
    location: "The Burren",
    country: "Ireland",
    geometry: { type: 'Point', coordinates: [ -9.0770, 53.0339 ] },
    category: "Farms",
  },
  {
    title: "Palouse Rolling Hills",
    description: "A modern home with vast views of the Palouse wheat fields.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/60006/spring-tree-meadow-green-60006.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 2400,
    location: "Palouse",
    country: "United States",
    geometry: { type: 'Point', coordinates: [ -117.1818, 46.8819 ] },
    category: "Farms",
  },

  // Category: Boats (9 new)
  {
    title: "Amsterdam Canal Houseboat",
    description: "Live like a local on this charming houseboat in Jordaan.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1117210/pexels-photo-1117210.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 2700,
    location: "Amsterdam",
    country: "Netherlands",
    geometry: { type: 'Point', coordinates: [ 4.8970, 52.3779 ] },
    category: "Boats",
  },
  {
    title: "Halong Bay Junk Boat",
    description: "A private cabin on a traditional junk boat. All meals included.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/2404044/pexels-photo-2404044.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 3100,
    location: "Halong Bay",
    country: "Vietnam",
    geometry: { type: 'Point', coordinates: [ 107.1629, 20.9103 ] },
    category: "Boats",
  },
  {
    title: "Kerala Backwaters Houseboat",
    description: "A traditional Kettuvallam. Includes a personal chef.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1543804/pexels-photo-1543804.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 2400,
    location: "Alappuzha",
    country: "India",
    geometry: { type: 'Point', coordinates: [ 76.3388, 9.4981 ] },
    category: "Boats",
  },
  {
    title: "Seattle Lake Union Houseboat",
    description: "The iconic 'Sleepless in Seattle' experience.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1484674/pexels-photo-1484674.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 3000,
    location: "Seattle",
    country: "United States",
    geometry: { type: 'Point', coordinates: [ -122.3211, 47.6256 ] },
    category: "Boats",
  },
  {
    title: "Whitsundays Sailing Yacht",
    description: "Charter a private yacht to explore Whitehaven Beach.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/937803/pexels-photo-937803.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 8000,
    location: "Airlie Beach",
    country: "Australia",
    geometry: { type: 'Point', coordinates: [ 148.7154, -20.2676 ] },
    category: "Boats",
  },
  {
    title: "Croatian Gulet Charter",
    description: "Sail the Adriatic coast with a full crew on a wooden gulet.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/94918/pexels-photo-94918.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 9500,
    location: "Split",
    country: "Croatia",
    geometry: { type: 'Point', coordinates: [ 16.4402, 43.5081 ] },
    category: "Boats",
  },
  {
    title: "Nile River Dahabiya",
    description: "A luxury sailboat cruise between Luxor and Aswan.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/163143/sand-big-bend-landscape-dusk-163143.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 6000,
    location: "Luxor",
    country: "Egypt",
    geometry: { type: 'Point', coordinates: [ 32.6396, 25.6872 ] },
    category: "Boats",
  },
  {
    title: "Amazon Riverboat Expedition",
    description: "Explore the rainforest from a comfortable riverboat.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/709825/pexels-photo-709825.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 4300,
    location: "Manaus",
    country: "Brazil",
    geometry: { type: 'Point', coordinates: [ -60.0217, -3.1190 ] },
    category: "Boats",
  },
  {
    title: "Sausalito Houseboat",
    description: "Artsy and unique houseboat with views of San Francisco.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 2800,
    location: "Sausalito",
    country: "United States",
    geometry: { type: 'Point', coordinates: [ -122.4842, 37.8591 ] },
    category: "Boats",
  },

  // Category: Trending (9 new)
  {
    title: "Kyoto Ryokan",
    description: "Traditional Japanese inn with tatami mats and onsen.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/2507007/pexels-photo-2507007.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 4800,
    location: "Kyoto",
    country: "Japan",
    geometry: { type: 'Point', coordinates: [ 135.7681, 35.0116 ] },
    category: "Trending",
  },
  {
    title: "Santorini Cave House",
    description: "Iconic white cave house in Oia with a private hot tub.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 6000,
    location: "Santorini",
    country: "Greece",
    geometry: { type: 'Point', coordinates: [ 25.4315, 36.3932 ] },
    category: "Trending",
  },
  {
    title: "Marrakesh Riad",
    description: "A tranquil, traditional riad in the heart of the Medina.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/2029670/pexels-photo-2029670.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 2200,
    location: "Marrakesh",
    country: "Morocco",
    geometry: { type: 'Point', coordinates: [ -7.9811, 31.6295 ] },
    category: "Trending",
  },
  {
    title: "Lisbon Tile Apartment",
    description: "A bright, beautiful apartment with traditional Azulejo tiles.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/2079246/pexels-photo-2079246.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 1900,
    location: "Lisbon",
    country: "Portugal",
    geometry: { type: 'Point', coordinates: [ -9.1393, 38.7223 ] },
    category: "Trending",
  },
  {
    title: "Seoul Hanok Stay",
    description: "Experience traditional Korean life in a Bukchon Hanok.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 2400,
    location: "Seoul",
    country: "South Korea",
    geometry: { type: 'Point', coordinates: [ 126.9780, 37.5665 ] },
    category: "Trending",
  },
  {
    title: "Tulum Jungle Cabana",
    description: "Eco-chic cabana just steps from the beach.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 3100,
    location: "Tulum",
    country: "Mexico",
    geometry: { type: 'Point', coordinates: [ -87.4651, 20.2114 ] },
    category: "Trending",
  },
  {
    title: "Copenhagen Hygge Apartment",
    description: "A perfectly cozy, minimalist Danish design apartment.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 2600,
    location: "Copenhagen",
    country: "Denmark",
    geometry: { type: 'Point', coordinates: [ 12.5683, 55.6761 ] },
    category: "Trending",
  },
  {
    title: "Austin Airstream",
    description: "A quirky, stylishly renovated Airstream trailer.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/275484/pexels-photo-275484.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 1700,
    location: "Austin",
    country: "United States",
    geometry: { type: 'Point', coordinates: [ -97.7431, 30.2672 ] },
    category: "Trending",
  },
  {
    title: "Sedona Dome House",
    description: "A unique geodesic dome home with red rock views.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 2900,
    location: "Sedona",
    country: "United States",
    geometry: { type: 'Point', coordinates: [ -111.7610, 34.8700 ] },
    category: "Trending",
  },

  // Category: Iconic Cities (7 new)
  {
    title: "Eiffel Tower View Apartment",
    description: "A chic Parisian apartment with a stunning view.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/2082092/pexels-photo-2082092.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 5000,
    location: "Paris",
    country: "France",
    geometry: { type: 'Point', coordinates: [ 2.3522, 48.8566 ] },
    category: "Iconic Cities",
  },
  {
    title: "London Shard Penthouse",
    description: "Luxury apartment near the Shard with city views.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/3288102/pexels-photo-3288102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 6500,
    location: "London",
    country: "United Kingdom",
    geometry: { type: 'Point', coordinates: [ -0.1276, 51.5074 ] },
    category: "Iconic Cities",
  },
  {
    title: "Roman Colosseum Apartment",
    description: "Stay just steps away from the ancient Colosseum.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 4000,
    location: "Rome",
    country: "Italy",
    geometry: { type: 'Point', coordinates: [ 12.4964, 41.9028 ] },
    category: "Iconic Cities",
  },
  {
    title: "Sydney Opera House View",
    description: "A modern flat in The Rocks with Opera House views.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/206172/pexels-photo-206172.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 5200,
    location: "Sydney",
    country: "Australia",
    geometry: { type: 'Point', coordinates: [ 151.2093, -33.8688 ] },
    category: "Iconic Cities",
  },
  {
    title: "Prague Old Town Square Apt",
    description: "Historic apartment right on the Old Town Square.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/2082089/pexels-photo-2082089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 3500,
    location: "Prague",
    country: "Czechia",
    geometry: { type: 'Point', coordinates: [ 14.4378, 50.0755 ] },
    category: "Iconic Cities",
  },
  {
    title: "Barcelona Gothic Quarter",
    description: "A stylish flat in the heart of the Gothic Quarter.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 3100,
    location: "Barcelona",
    country: "Spain",
    geometry: { type: 'Point', coordinates: [ 2.1686, 41.3874 ] },
    category: "Iconic Cities",
  },
  {
    title: "San Francisco Painted Lady",
    description: "A room in a classic Victorian house near Alamo Square.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/210552/pexels-photo-210552.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 3300,
    location: "San Francisco",
    country: "United States",
    geometry: { type: 'Point', coordinates: [ -122.4194, 37.7749 ] },
    category: "Iconic Cities",
  },

  // Category: Amazing pools (7 new)
  {
    title: "Ubud Jungle Villa",
    description: "A stunning villa with a private infinity pool over the jungle.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/221457/pexels-photo-221457.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 4200,
    location: "Ubud",
    country: "Indonesia",
    geometry: { type: 'Point', coordinates: [ 115.2631, -8.5069 ] },
    category: "Amazing pools",
  },
  {
    title: "Singapore Skypark Pool",
    description: "Access to the world's most famous rooftop infinity pool.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 7000,
    location: "Singapore",
    country: "Singapore",
    geometry: { type: 'Point', coordinates: [ 103.8561, 1.2869 ] },
    category: "Amazing pools",
  },
  {
    title: "Cabo Oceanview Villa",
    description: "A luxury villa with a pool that blends into the ocean.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 6800,
    location: "Cabo San Lucas",
    country: "Mexico",
    geometry: { type: 'Point', coordinates: [ -109.9167, 22.8905 ] },
    category: "Amazing pools",
  },
  {
    title: "Santorini Caldera Pool",
    description: "A private plunge pool overlooking the caldera in Oia.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/2507016/pexels-photo-2507016.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 6200,
    location: "Oia",
    country: "Greece",
    geometry: { type: 'Point', coordinates: [ 25.3753, 36.4616 ] },
    category: "Amazing pools",
  },
  {
    title: "Palm Springs Desert Modern",
    description: "A mid-century modern home with a perfect pool.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 3900,
    location: "Palm Springs",
    country: "United States",
    geometry: { type: 'Point', coordinates: [ -116.5453, 33.8303 ] },
    category: "Amazing pools",
  },
  {
    title: "Lake Como Villa",
    description: "Historic villa with a grand pool on Lake Como.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/210265/pexels-photo-210265.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 8000,
    location: "Bellagio",
    country: "Italy",
    geometry: { type: 'Point', coordinates: [ 9.2568, 45.9881 ] },
    category: "Amazing pools",
  },
  {
    title: "Sardinia Costa Smeralda",
    description: "A villa with a pool carved into the coastal rocks.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/707582/pexels-photo-707582.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 7500,
    location: "Porto Cervo",
    country: "Italy",
    geometry: { type: 'Point', coordinates: [ 9.5296, 41.0827 ] },
    category: "Amazing pools",
  },

  // Category: Mountain (6 new)
  {
    title: "Zermatt Matterhorn View",
    description: "A chalet with a direct, stunning view of the Matterhorn.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/534124/pexels-photo-534124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 4800,
    location: "Zermatt",
    country: "Switzerland",
    geometry: { type: 'Point', coordinates: [ 7.7451, 46.0207 ] },
    category: "Mountain",
  },
  {
    title: "Queenstown Lake View",
    description: "Modern apartment overlooking Lake Wakatipu.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 3600,
    location: "Queenstown",
    country: "New Zealand",
    geometry: { type: 'Point', coordinates: [ 168.6626, -45.0312 ] },
    category: "Mountain",
  },
  {
    title: "Jackson Hole Teton Cabin",
    description: "A luxury cabin at the base of the Teton range.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1571470/pexels-photo-1571470.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 4300,
    location: "Jackson Hole",
    country: "United States",
    geometry: { type: 'Point', coordinates: [ -110.7624, 43.4799 ] },
    category: "Mountain",
  },
  {
    title: "Chamonix Mont Blanc Chalet",
    description: "A classic ski chalet in Chamonix, France.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 4100,
    location: "Chamonix",
    country: "France",
    geometry: { type: 'Point', coordinates: [ 6.8694, 45.9237 ] },
    category: "Mountain",
  },
  {
    title: "Patagonia Eco-Dome",
    description: "A unique dome shelter in Torres del Paine National Park.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1105754/pexels-photo-1105754.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 3700,
    location: "Torres del Paine",
    country: "Chile",
    geometry: { type: 'Point', coordinates: [ -72.9497, -50.9423 ] },
    category: "Mountain",
  },
  {
    title: "Whistler Creekside Condo",
    description: "A cozy condo with ski-in/ski-out access in Whistler.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 3200,
    location: "Whistler",
    country: "Canada",
    geometry: { type: 'Point', coordinates: [ -122.9574, 50.1163 ] },
    category: "Mountain",
  },

  // Category: Camping (6 new)
  {
    title: "Joshua Tree Glamping",
    description: "A luxury safari tent under the desert stars.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 2200,
    location: "Joshua Tree",
    country: "United States",
    geometry: { type: 'Point', coordinates: [ -116.1654, 33.8734 ] },
    category: "Camping",
  },
  {
    title: "Wadi Rum Bedouin Camp",
    description: "An authentic desert camp experience with jeep tours.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 1900,
    location: "Wadi Rum",
    country: "Jordan",
    geometry: { type: 'Point', coordinates: [ 35.4184, 29.5732 ] },
    category: "Camping",
  },
  {
    title: "Yellowstone Yurt",
    description: "A comfortable yurt just outside Yellowstone National Park.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/3288104/pexels-photo-3288104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 2000,
    location: "West Yellowstone",
    country: "United States",
    geometry: { type: 'Point', coordinates: [ -111.1042, 44.6621 ] },
    category: "Camping",
  },
  {
    title: "Moab Desert Tent",
    description: "Glamping tent near Arches National Park.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1571469/pexels-photo-1571469.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 2400,
    location: "Moab",
    country: "United States",
    geometry: { type: 'Point', coordinates: [ -109.5497, 38.5733 ] },
    category: "Camping",
  },
  {
    title: "Lake District Camping Pod",
    description: "A cozy wooden camping pod in the beautiful Lake District.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 1300,
    location: "Lake District",
    country: "United Kingdom",
    geometry: { type: 'Point', coordinates: [ -3.0886, 54.4501 ] },
    category: "Camping",
  },
  {
    title: "Yosemite Canvas Tent",
    description: "A classic canvas tent in Curry Village, Yosemite Valley.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/2082091/pexels-photo-2082091.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 1600,
    location: "Yosemite",
    country: "United States",
    geometry: { type: 'Point', coordinates: [ -119.5383, 37.8651 ] },
    category: "Camping",
  },

  // Category: Rooms (0 new, 10 total)
  // I will add 10 new "Other" category listings to balance
  
  // Category: Other (10 new)
  {
    title: "Finnish Design Apartment",
    description: "A minimalist apartment in the heart of Helsinki's Design District.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 2300,
    location: "Helsinki",
    country: "Finland",
    geometry: { type: 'Point', coordinates: [ 24.9384, 60.1699 ] },
    category: "Other",
  },
  {
    title: "Cave Hotel in Cappadocia",
    description: "A unique hotel room carved into the rock formations of Cappadocia.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 2800,
    location: "Göreme",
    country: "Turkey",
    geometry: { type: 'Point', coordinates: [ 34.8297, 38.6449 ] },
    category: "Other",
  },
  {
    title: "Rio de Janeiro Penthouse",
    description: "Stunning penthouse with views of Copacabana Beach.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 4500,
    location: "Rio de Janeiro",
    country: "Brazil",
    geometry: { type: 'Point', coordinates: [ -43.1729, -22.9068 ] },
    category: "Other",
  },
  {
    title: "Buenos Aires Polo Estancia",
    description: "A grand room on a traditional polo ranch outside the city.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/2082090/pexels-photo-2082090.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed again
    },
    price: 3300,
    location: "Buenos Aires",
    country: "Argentina",
    geometry: { type: 'Point', coordinates: [ -58.3816, -34.6037 ] },
    category: "Other",
  },
  {
    title: "Converted Warehouse in Berlin",
    description: "An industrial-chic apartment in a converted warehouse in Kreuzberg.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 2100,
    location: "Berlin",
    country: "Germany",
    geometry: { type: 'Point', coordinates: [ 13.4050, 52.5200 ] },
    category: "Other",
  },
  {
    title: "Rooftop Apartment in Athens",
    description: "A modern apartment with a private rooftop terrace overlooking the Acropolis.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/271795/pexels-photo-271795.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 2900,
    location: "Athens",
    country: "Greece",
    geometry: { type: 'Point', coordinates: [ 23.7275, 37.9838 ] },
    category: "Other",
  },
  {
    title: "Geodesic Dome in the Woods",
    description: "A unique and secluded dome home for a true escape.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 1700,
    location: "Asheville",
    country: "United States",
    geometry: { type: 'Point', coordinates: [ -82.5515, 35.5951 ] },
    category: "Other",
  },
  {
    title: "Converted Church",
    description: "Stay in a beautifully renovated historic church.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/2082088/pexels-photo-2082088.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 3600,
    location: "Hudson",
    country: "United States",
    geometry: { type: 'Point', coordinates: [ -73.7887, 42.2529 ] },
    category: "Other",
  },
  {
    title: "Lighthouse Keeper's Cottage",
    description: "A remote and romantic cottage at the base of a working lighthouse.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 3100,
    location: "Isle of Skye",
    country: "United Kingdom",
    geometry: { type: 'Point', coordinates: [ -6.2155, 57.4124 ] },
    category: "Other",
  },
  {
    title: "Tranquil Zen Retreat",
    description: "A minimalist home with a Japanese garden, perfect for meditation.",
    image: {
      filename: "listingimage",
      url: "https://images.pexels.com/photos/271753/pexels-photo-271753.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Changed
    },
    price: 2800,
    location: "Kyoto",
    country: "Japan",
    geometry: { type: 'Point', coordinates: [ 135.7580, 34.9858 ] },
    category: "Other",
  }
];

module.exports = { data: sampleListings };