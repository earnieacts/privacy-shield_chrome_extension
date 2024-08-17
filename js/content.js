// Spoof User-Agent
Object.defineProperty(navigator, 'userAgent', {
    get: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  });
  
  // Spoof Geolocation
  navigator.geolocation.getCurrentPosition = function(success, error) {
    success({
      coords: {
        latitude: 37.7749, // Fake latitude
        longitude: -122.4194 // Fake longitude
      }
    });
  };
  