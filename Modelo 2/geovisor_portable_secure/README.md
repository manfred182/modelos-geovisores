# Visor Geográfico I2D - Portable

Este es un visor geográfico portable que consume las APIs del backend del Visor I2D para mostrar información geográfica de departamentos y municipios de Colombia.

## Requisitos

- Un navegador web moderno
- Acceso al backend del Visor I2D ejecutándose en `http://localhost:8001` (o modificar la URL en el script.js si el backend está en otra dirección)

## Cómo usar

1. Asegúrese de que el backend del Visor I2D esté ejecutándose y accesible en `http://localhost:8001`
2. Abra el archivo `index.html` en su navegador web
3. Use el cuadro de búsqueda para encontrar municipios por nombre
4. Haga clic en un resultado para ver el municipio en el mapa

## Funcionalidades

- Búsqueda de municipios por nombre (con manejo de acentos)
- Visualización de límites municipales en el mapa
- Información básica del municipio (código, nombre, departamento)
- Capas opcionales de departamentos para contexto

## Personalización

Para cambiar la URL del backend, edite el archivo `script.js` y reemplace las instancias de `http://localhost:8001` por la URL de su backend.

## Tecnologías utilizadas

- Leaflet.js para el mapa interactivo
- Wicket.js para convertir WKT a GeoJSON
- HTML5, CSS3, JavaScript vanilla

## Notas

Este visor es una interfaz de consumo de las APIs del backend. Para un funcionamiento completo, el backend debe estar disponible y ejecutándose con las migraciones de base de datos aplicadas.

Para ejecutar el backend localmente, consulte la documentación del repositorio original.