/**
 * KMLLoaderSimple - Versione semplificata per test
 * Carica KML di test hardcoded per evitare problemi di asset loading
 */

export interface KMLLoadResult {
  content: string;
  source: 'assets' | 'storage' | 'test';
  fileName: string;
  size: number;
}

class KMLLoaderSimple {
  static async loadFromAssets(zoneId: number, part: 'A' | 'B'): Promise<KMLLoadResult> {
    const fileName = `CTD_CastelSanGiovanni_Z${String(zoneId).padStart(2, '0')}_${part}.kml`;
    
    console.log(`[KMLLoaderSimple] Caricamento ${fileName} (versione test)...`);
    
    // KML di test hardcoded per Zona 9-B
    const testKML = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Zona 9 Sottozona B - Test</name>
    <description>Mappa di test per Castel San Giovanni</description>
    <Placemark>
      <name>Percorso Test 1</name>
      <LineString>
        <coordinates>
          9.4294,45.0544,0
          9.4304,45.0554,0
          9.4314,45.0564,0
        </coordinates>
      </LineString>
    </Placemark>
    <Placemark>
      <name>Percorso Test 2</name>
      <LineString>
        <coordinates>
          9.4324,45.0574,0
          9.4334,45.0584,0
          9.4344,45.0594,0
        </coordinates>
      </LineString>
    </Placemark>
    <Placemark>
      <name>Fermata Test 1</name>
      <Point>
        <coordinates>9.4294,45.0544,0</coordinates>
      </Point>
    </Placemark>
    <Placemark>
      <name>Fermata Test 2</name>
      <Point>
        <coordinates>9.4334,45.0584,0</coordinates>
      </Point>
    </Placemark>
  </Document>
</kml>`;

    const result: KMLLoadResult = {
      content: testKML,
      source: 'test',
      fileName,
      size: testKML.length
    };

    console.log(`[KMLLoaderSimple] ✅ ${fileName} caricato (${result.size} bytes)`);
    return result;
  }

  static async loadFromStorage(filePath: string): Promise<KMLLoadResult> {
    console.warn('[KMLLoaderSimple] loadFromStorage non implementato.');
    throw new Error('Caricamento da storage non supportato.');
  }

  static async checkKMLExists(zoneId: number, part: 'A' | 'B'): Promise<boolean> {
    // Per ora restituisce sempre true per i test
    return true;
  }
}

export default KMLLoaderSimple;
