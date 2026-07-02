// Inicializar el mapa
const map = L.map('map').setView([40.4168, -3.7038], 6); // Centrado en España

// Definir proyecciones soportadas
const projections = {
    EPSG4326: {
        code: 'EPSG:4326',
        name: 'WGS 84 (Geográficas)',
        bounds: [[-90, -180], [90, 180]]
    },
    EPSG3857: {
        code: 'EPSG:3857',
        name: 'Web Mercator',
        bounds: [[-85.0511287798066, -179.99999999999997], [85.0511287798066, 179.99999999999997]]
    },
    EPSG25830: {
        code: 'EPSG:25830',
        name: 'ETRS89 / UTM zone 30N',
        bounds: [[37.5, -6.0], [44.0, 6.0]] // Aproximado para España peninsular
    },
    EPSG23030: {
        code: 'EPSG:23030',
        name: 'ED50 / UTM zone 30N',
        bounds: [[36.0, -9.0], [44.0, 3.0]] // Aproximado para España peninsular
    }
};

// Capas base
const baseLayers = {
    "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }),
    "OpenTopoMap": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    })
};

// Capas de ejemplo (simuladas con GeoJSON)
const overlayLayers = {
    "Fronteras España": L.geoJSON(null, {
        style: {
            color: '#ff7800',
            weight: 2,
            opacity: 0.7
        }
    }),
    "Ciudades Principales": L.geoJSON(null, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 8,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        }
    }),
    "Ríos Principales": L.geoJSON(null, {
        style: {
            color: '#0066ff',
            weight: 3,
            opacity: 0.7
        }
    })
};

// Añadir capa base por defecto
baseLayers["OpenStreetMap"].addTo(map);

// Control de capas
const layerControl = L.control.layers(baseLayers, overlayLayers, {
    collapsed: false
}).addTo(map);

// Función para actualizar información de proyección
function updateProjectionInfo() {
    const center = map.getCenter();
    const zoom = map.getZoom();
    const projectionText = `
        Centro: ${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}<br>
        Zoom: ${zoom}<br>
        CRS actual: ${map.options.crs.code || 'Desconocido'}
    `;
    document.getElementById('projection-info-text').innerHTML = projectionText;
}

// Actualizar información cuando cambie la vista
map.on('moveend', updateProjectionInfo);
map.on('zoomend', updateProjectionInfo);

// Inicializar información de proyección
updateProjectionInfo();

// Cargar datos de ejemplo (simulados)
function loadSampleData() {
    // Fronteras de España (simplificado)
    const spainBorders = {
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [-9.5, 36.0],
                [-9.5, 43.5],
                [3.5, 43.5],
                [3.5, 36.0],
                [-9.5, 36.0]
            ]]
        }
    };

    // Ciudades principales
    const cities = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "name": "Madrid",
                    "population": 3223000
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [-3.7038, 40.4168]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "name": "Barcelona",
                    "population": 1620000
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [2.1734, 41.3851]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "name": "Valencia",
                    "population": 790000
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [-0.3763, 39.4699]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "name": "Sevilla",
                    "population": 690000
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [-5.9845, 37.3891]
                }
            }
        ]
    };

    // Ríos principales (simplificado)
    const rivers = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "name": "Tajo",
                    "length": 1007
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [-5.0, 40.0],
                        [-4.0, 39.5],
                        [-3.0, 39.0],
                        [-2.0, 38.5],
                        [-1.0, 38.0]
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "name": "Ebro",
                    "length": 930
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [-1.0, 43.0],
                        [0.0, 42.5],
                        [1.0, 42.0],
                        [2.0, 41.5],
                        [3.0, 41.0]
                    ]
                }
            }
        ]
    };

    // Añadir datos a las capas
    overlayLayers["Fronteras España"].clearLayers().addData(spainBorders);
    overlayLayers["Ciudades Principales"].clearLayers().addData(cities);
    overlayLayers["Ríos Principales"].clearLayers().addData(rivers);
}

// Cargar datos al iniciar
loadSampleData();

// Control de proyecciones personalizado
function createProjectionControl() {
    const container = L.DomUtil.create('div', 'leaflet-control-layers');
    container.style.background = 'white';
    container.style.padding = '10px';
    container.style.borderRadius = '5px';
    container.style.boxShadow = '0 0 15px rgba(0,0,0,0.2)';
    container.style.maxHeight = '80vh';
    container.style.overflowY = 'auto';
    container.style.width = '200px';
    
    const title = L.DomUtil.create('h3', '', container);
    title.textContent = 'Proyecciones';
    title.style.marginTop = '0';
    
    const form = L.DomUtil.create('form', '', container);
    
    Object.keys(projections).forEach(key => {
        const proj = projections[key];
        const label = L.DomUtil.create('label', '', form);
        label.style.display = 'block';
        label.style.marginBottom = '5px';
        
        const radio = L.DomUtil.create('input', '', label);
        radio.type = 'radio';
        radio.name = 'projection';
        radio.value = key;
        if (key === 'EPSG3857') radio.checked = true; // Valor por defecto
        
        label.appendChild(document.createTextNode(' ' + proj.name));
        
        radio.addEventListener('change', function() {
            if (this.checked) {
                changeProjection(proj.code);
            }
        });
    });
    
    return container;
}

// Función para cambiar proyección (simplificada)
function changeProjection(crsCode) {
    // En una implementación real, cambiaríamos el CRS del mapa
    // Aquí solo actualizamos la información mostrada
    alert(`Cambiando a proyección: ${crsCode}\nNota: Esta es una demostración simplificada.\nEn una implementación completa, se cambiaría el CRS del mapa.`);
    updateProjectionInfo();
}

// Añadir control de proyecciones al mapa
const projectionControl = L.control.createProjectionControl = function() {
    return createProjectionControl();
};
L.control.createProjectionControl = createProjectionControl;
const projControl = L.control.createProjectionControl();
projControl.addTo(map);

// Actualizar información de proyección al iniciar
setTimeout(updateProjectionInfo, 100);