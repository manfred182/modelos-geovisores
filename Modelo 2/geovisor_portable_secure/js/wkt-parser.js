// Simple WKT Parser for POLYGON and MULTIPOLYGON
// Supports basic WKT format without SRID, Z, or M coordinates

class SimpleWKTParser {
    static parse(wkt) {
        wkt = wkt.trim();
        
        // Handle POLYGON
        if (wkt.startsWith('POLYGON')) {
            return this.parsePolygon(wkt);
        }
        
        // Handle MULTIPOLYGON
        if (wkt.startsWith('MULTIPOLYGON')) {
            return this.parseMultiPolygon(wkt);
        }
        
        // Handle POINT (for fallback)
        if (wkt.startsWith('POINT')) {
            return this.parsePoint(wkt);
        }
        
        throw new Error(`Unsupported WKT type: ${wkt.substring(0, 10)}...`);
    }
    
    static parsePolygon(wkt) {
        const match = wkt.match(/POLYGON\s*\(\((.+)\)\)$/i);
        if (!match) {
            throw new Error('Invalid POLYGON format');
        }
        
        const coordsStr = match[1];
        const rings = coordsStr.split('),(').map(ring => 
            ring.trim().split(',').map(pair => {
                const coords = pair.trim().split(/\s+/);
                return [parseFloat(coords[0]), parseFloat(coords[1])];
            })
        );
        
        return {
            type: 'Polygon',
            coordinates: rings
        };
    }
    
    static parseMultiPolygon(wkt) {
        const match = wkt.match(/MULTIPOLYGON\s*\((.+)\)$/i);
        if (!match) {
            throw new Error('Invalid MULTIPOLYGON format');
        }
        
        const content = match[1];
        // Split by '),(' but handle nested parentheses
        const polygons = [];
        let depth = 0;
        let current = '';
        
        for (let i = 0; i < content.length; i++) {
            const char = content[i];
            if (char === '(') {
                depth++;
                if (depth > 1) current += char;
            } else if (char === ')') {
                depth--;
                if (depth > 0) current += char;
                if (depth === 0) {
                    polygons.push(current);
                    current = '';
                    // Skip the comma if present
                    if (i + 1 < content.length && content[i + 1] === ',') {
                        i++;
                    }
                }
            } else {
                if (depth > 0) current += char;
            }
        }
        
        // Handle case where there's only one polygon
        if (polygons.length === 0 && content.trim() !== '') {
            polygons.push(content.trim());
        }
        
        const coordinates = polygons.map(poly => {
            // Remove outer parentheses
            let cleanPoly = poly.trim();
            if (cleanPoly.startsWith('(') && cleanPoly.endsWith(')')) {
                cleanPoly = cleanPoly.substring(1, cleanPoly.length - 1);
            }
            
            const rings = cleanPoly.split('),(').map(ring => {
                let cleanRing = ring.trim();
                if (cleanRing.startsWith('(') && cleanRing.endsWith(')')) {
                    cleanRing = cleanRing.substring(1, cleanRing.length - 1);
                }
                return cleanRing.split(',').map(pair => {
                    const coords = pair.trim().split(/\s+/);
                    return [parseFloat(coords[0]), parseFloat(coords[1])];
                });
            });
            
            return rings;
        });
        
        return {
            type: 'MultiPolygon',
            coordinates: coordinates
        };
    }
    
    static parsePoint(wkt) {
        const match = wkt.match(/POINT\s*\((.+)\)$/i);
        if (!match) {
            throw new Error('Invalid POINT format');
        }
        
        const coords = match[1].trim().split(/\s+/);
        return {
            type: 'Point',
            coordinates: [parseFloat(coords[0]), parseFloat(coords[1])]
        };
    }
}

// Make available globally
window.SimpleWKTParser = SimpleWKTParser;