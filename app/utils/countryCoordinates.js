const countryCoordinates = {
  "United States": { lat: 37.0902, long: -95.7129 },
  "Canada": { lat: 56.1304, long: -106.3468 },
  "United Kingdom": { lat: 55.3781, long: -3.4360 },
  "Australia": { lat: -25.2744, long: 133.7751 },
  "India": { lat: 20.5937, long: 78.9629 },
  "Japan": { lat: 36.2048, long: 138.2529 },
  "Germany": { lat: 51.1657, long: 10.4515 },
  "France": { lat: 46.6034, long: 1.8883 },
  "Brazil": { lat: -14.2350, long: -51.9253 },
  "South Africa": { lat: -30.5595, long: 22.9375 },
  "China": { lat: 35.8617, long: 104.1954 },
  "Russia": { lat: 61.5240, long: 105.3188 },
  "Mexico": { lat: 23.6345, long: -102.5528 },
  "Italy": { lat: 41.8719, long: 12.5674 },
  "Spain": { lat: 40.4637, long: -3.7492 },
  "Finland": { lat: 61.9241, long: 25.7482 },
  "Denmark": { lat: 56.2639, long: 9.5018 },
  "Iceland": { lat: 64.9631, long: -19.0208 },
  "Israel": { lat: 31.0461, long: 34.8516 },
  "Netherlands": { lat: 52.3676, long: 4.9041 },
  "Sweden": { lat: 60.1282, long: 18.6435 },
  "Norway": { lat: 60.4720, long: 8.4689 },
  "Switzerland": { lat: 46.8182, long: 8.2275 },
  "Luxembourg": { lat: 49.8153, long: 6.1296 },
  "New Zealand": { lat: -40.9006, long: 174.8860 },
  "Austria": { lat: 47.5162, long: 14.5501 },
  "Ireland": { lat: 53.1424, long: -7.6921 },
  "Europe": { lat: 54.5260, long: 15.2551 },
  "Costa Rica": { lat: 9.7489, long: -83.7534 },
  // Add more countries as needed
};

export function getCountryCoordinates(countryName) {
  return countryCoordinates[countryName] || null;
} 