# Geovisor GIS Portátil para Desarrolladores

Este es un geovisor GIS totalmente portátil basado en los lineamientos del repositorio [Geo-Developers/GIS_para_desarrolladores](https://github.com/Geo-Developers/GIS_para_desarrolladores).

## Características

- ✅ **Totalmente portátil**: No requiere instalación de software adicional
- ✅ **Ejecución directa**: Simplemente abra `index.html` en cualquier navegador web
- ✅ **Sistemas de referencia incluidos**:
  - EPSG:4326 (WGS 84 - coordenadas geográficas)
  - EPSG:3857 (Web Mercator - usado por Google Maps, OpenStreetMap)
  - EPSG:25830 (ETRS89 / UTM zone 30N - oficial para España peninsular)
  - EPSG:23030 (ED50 / UTM zone 30N - sistema anterior para España)
- ✅ **Tipos de datos GIS implementados**:
  - Vectorial: Puntos (ciudades), líneas (ríos), polígonos (fronteras)
  - Raster: Capas base de OpenStreetMap y OpenTopoMap
- ✅ **Interfaz completa**: Control de capas, información de coordenadas, selección de proyecciones

## Cómo ejecutar

1. **Navegue a la carpeta del geovisor**:
   ```
   cd "D:\Aplicaciones de Desarrollo Amazon GIS\Modelos Geovisores\Modelo 1\geovisor"
   ```

2. **Abra el archivo index.html**:
   - **Opción 1**: Haga doble clic en `index.html`
   - **Opción 2**: Arrastre `index.html` a su navegador web
   - **Opción 3**: Desde la línea de comandos en Windows:
     ```
     start index.html
     ```

3. **Disfrute del geovisor**:
   - Explore el mapa de España
   - Active/desactive capas de datos (fronteras, ciudades, ríos)
   - Cambie entre diferentes sistemas de referencia
   - Vea las coordenadas en tiempo real al mover el mapa

## Estructura del proyecto

```
geovisor/
├── index.html          # Página principal
├── app.js              # Lógica de la aplicación
├── lib/                # Bibliotecas locales (para portabilidad)
│   ├── leaflet.css     # Estilos de Leaflet
│   ├── leaflet.js      # Funcionalidad de Leaflet
│   └── proj4.js        # Transformación de coordenadas
└── README.md           # Este archivo
```

## Tecnologías utilizadas

- **Leaflet.js**: Biblioteca líder para mapas interactivos
- **Proj4js**: Biblioteca para transformación entre sistemas de referencia de coordenadas
- **HTML5/CSS3/JavaScript**: Tecnologías web estándar

## Personalización

Para agregar sus propios datos o modificar la aplicación:

1. Edite `app.js` para cambiar los datos de ejemplo o agregar nuevas funcionalidades
2. Modifique el estilo en la sección `<style>` de `index.html`
3. Agregue más capas de datos siguiendo el patrón existente en `app.js`

## Notas importantes

- Este geovisor usa datos de ejemplo simplificados para demostrar los conceptos
- Para usar datos reales, reemplace los objetos GeoJSON en `loadSampleData()` con sus propios datos
- La transformación entre sistemas de referencia actualmente muestra información pero no reproyecta el mapa (requiría integración más profunda con Proj4js y proj4leaflet para una implementación completa)

---
*Creado como parte del proyecto GIS_para_desarrolladores - Mayo 2026*