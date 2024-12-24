document.addEventListener('DOMContentLoaded', function () {
    var coordinates = geoCoordinates;
    var map = L.map('map').setView([coordinates[1], coordinates[0]], 13); // [latitude, longitude]
    
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Place the marker on the map using the coordinates
    L.marker([coordinates[1], coordinates[0]]).addTo(map)
      .bindPopup('<b>Listing Location</b><br>your Location will here.')
      .openPopup();
});
