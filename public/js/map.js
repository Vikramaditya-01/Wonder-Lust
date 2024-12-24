document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('map').setView([28.6139, 77.2090], 13);  //  New Delhi, Zoom Level 13 [latitude, longitude]
    
    // Add OSM tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add a marker (optional)
    L.marker([28.6139, 77.2090]).addTo(map)   
      .bindPopup('<b>New Delhi</b><br>Capital of India.')
      .openPopup();
});