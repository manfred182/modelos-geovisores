// Initialize the map
const map = L.map('map').setView([4.5709, -74.2973], 6); // Approximate center of Colombia

// Add a tile layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Variables to store layers
let municipalityLayer = null;
let searchMarker = null;
let departmentLayer = null;

// Function to convert WKT to GeoJSON using wicket
function wktToGeoJSON(wkt) {
    try {
        const parser = new WKT();
        return parser.read(wkt);
    } catch (e) {
        console.error('Error parsing WKT:', e);
        return null;
    }
}

// Function to search for municipalities
async function searchMunicipality(term) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<div class="loading">Buscando...</div>';
    
    try {
        const response = await fetch(`http://localhost:8001/api/mpio/search/${encodeURIComponent(term)}/`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        
        // Clear previous results
        resultsDiv.innerHTML = '';
        
        if (data.results && data.results.length > 0) {
            data.results.forEach(municipio => {
                const div = document.createElement('div');
                div.className = 'result-item';
                div.innerHTML = `
                    <h3>${municipio.nombre_mpio}</h3>
                    <p>Código: ${municipio.codigo_mpio}, Departamento: ${municipio.codigo_dpto}</p>
                `;
                div.onclick = () => {
                    showMunicipality(municipio);
                };
                resultsDiv.appendChild(div);
            });
        } else {
            resultsDiv.innerHTML = '<div class="error">No se encontraron municipios</div>';
        }
    } catch (error) {
        console.error('Error searching municipality:', error);
        resultsDiv.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    }
}

// Function to show a municipality on the map
function showMunicipality(municipio) {
    // Remove previous marker and layer
    if (searchMarker) {
        map.removeLayer(searchMarker);
    }
    if (municipalityLayer) {
        map.removeLayer(municipalityLayer);
    }
    
    // Fetch full municipality detail to get geometry
    fetch(`http://localhost:8001/api/mpio/${municipio.codigo_mpio}/`)
        .then(response => response.json())
        .then(municipioDetail => {
            if (municipioDetail.geometry) {
                // Convert WKT to GeoJSON
                const geoJSON = wktToGeoJSON(municipioDetail.geometry);
                if (geoJSON) {
                    municipalityLayer = L.geoJSON(geoJSON, {
                        style: {
                            color: '#3498db',
                            weight: 2,
                            fillOpacity: 0.1
                        }
                    }).addTo(map);
                    map.fitBounds(municipalityLayer.getBounds());
                    
                    // Add a marker at the centroid
                    const bounds = municipalityLayer.getBounds();
                    const center = bounds.getCenter();
                    searchMarker = L.marker(center).addTo(map)
                        .bindPopup(`<b>${municipioDetail.nombre_mpio}</b><br>${municipioDetail.codigo_mpio}`)
                        .openPopup();
                } else {
                    console.error('Could not parse geometry');
                    // Fallback to just showing a marker at a known point? We don't have coordinates without geometry.
                }
            } else {
                console.error('No geometry in response');
            }
        })
        .catch(err => {
            console.error('Error fetching municipality detail:', err);
            document.getElementById('results').innerHTML = `<div class="error">Error al obtener detalles: ${err.message}</div>`;
        });
}

// Function to load department boundaries for context (optional)
function loadDepartments() {
    fetch('http://localhost:8001/api/dpto/')
        .then(response => response.json())
        .then(data => {
            if (data.results) {
                // We'll create a layer group for departments
                const departmentLayers = data.results.map(depto => {
                    if (depto.geometry) {
                        const geoJSON = wktToGeoJSON(depto.geometry);
                        if (geoJSON) {
                            return L.geoJSON(geoJSON, {
                                style: {
                                    color: '#95a5a6',
                                    weight: 1,
                                    fillOpacity: 0.05
                                }
                            });
                        }
                    }
                    return null;
                }).filter(layer => layer !== null);
                
                if (departmentLayers.length > 0) {
                    departmentLayer = L.featureGroup(departmentLayers);
                    departmentLayer.addTo(map);
                }
            }
        })
        .catch(err => console.error('Error loading departments:', err));
}

// Event listener for search button
document.getElementById('search-button').addEventListener('click', () => {
    const term = document.getElementById('search-input').value.trim();
    if (term) {
        searchMunicipality(term);
    }
});

// Allow pressing Enter to search
document.getElementById('search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('search-button').click();
    }
});

// Load department boundaries on map load
loadDepartments();

// If the backend is not available, show an error message
setTimeout(() => {
    // Check if we've loaded any departments after 5 seconds
    if (!departmentLayer || departmentLayer.getLayers().length === 0) {
        // You could add a warning here, but for now just console log
        console.warn('Backend may not be available or no data returned');
    }
}, 5000);