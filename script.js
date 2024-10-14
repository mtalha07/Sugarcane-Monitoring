document.addEventListener("DOMContentLoaded", function () {
    var map = L.map('map').setView([30.3753, 69.3451], 6); // Coordinates of Pakistan as an example

    // Load a base map (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    var bounds = [[28.494650644, 70.01325594], [28.542171522, 70.07730582]];
    map.fitBounds(bounds);

    // Create the GeoJSON layer for the provided vector data
    var geoJsonLayer = L.geoJSON(vectorlayer, {
        onEachFeature: function (feature, layer) {
            // Set up click event for each polygon to display field info
            layer.on('click', function () {
                var area = turf.area(layer.toGeoJSON()); // Calculate area in square meters
                var areaInHectares = area / 10000; // Convert to hectares
                
                // Update the field info panel with the selected polygon's properties
                document.getElementById('ownerName').textContent = feature.properties.Owner;
                document.getElementById('cropStatus').textContent = feature.properties.Status;
                // Assuming 'Phase' and 'Last Update' are additional properties, update them accordingly:
                document.getElementById('phenologyPhase').textContent = feature.properties.Phase || "N/A"; 
                document.getElementById('lastUpdate').textContent = feature.properties.LastUpdate || "N/A";

                // Optionally, bind and open a popup showing the area in hectares
                var popupContent = "<b>Area:</b> " + areaInHectares.toFixed(2) + " hectares";
                layer.bindPopup(popupContent).openPopup();
            });
        }
    }).addTo(map);

    document.addEventListener("DOMContentLoaded", function () {
        const navbarToggle = document.querySelector('.navbar-toggle');
        const navbarMenu = document.querySelector('.navbar-menu');
    
        navbarToggle.addEventListener('click', function () {
            navbarMenu.classList.toggle('active');
        });
    });
    
    // Search button event listener
    document.getElementById('searchButton').addEventListener('click', function () {
        var searchValue = document.getElementById('searchInput').value.toLowerCase();
        
        // Clear any previously highlighted layers
        geoJsonLayer.eachLayer(function (layer) {
            geoJsonLayer.resetStyle(layer); // Reset the style of all layers
        });

        // Find and highlight matching polygons
        geoJsonLayer.eachLayer(function (layer) {
            var owner = layer.feature.properties.Owner.toLowerCase();

            if (owner.includes(searchValue)) {
                // Update the field info panel with the first matching result
                document.getElementById('ownerName').textContent = layer.feature.properties.Owner;
                document.getElementById('cropStatus').textContent = layer.feature.properties.Status;
                document.getElementById('phenologyPhase').textContent = layer.feature.properties.Phase || "N/A"; 
                document.getElementById('lastUpdate').textContent = layer.feature.properties.LastUpdate || "N/A";

                // Zoom to the matched polygon and highlight it
                map.fitBounds(layer.getBounds());

                // Change style of the matched polygon (e.g., change color or add a border)
                layer.setStyle({
                    color: 'red', // Highlight color for the polygon
                    weight: 3
                });
            }
        });
    });
});
