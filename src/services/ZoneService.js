import { ZONE_DATA, MAP_CONFIG, CTD_INFO } from '../config/ZoneConfig';
import KMLService from './KMLService/KMLService';

class ZoneService {
  // Ottieni tutte le zone disponibili
  static getAllZones() {
    return ZONE_DATA;
  }

  // Ottieni una zona specifica per ID
  static getZoneById(zoneId) {
    console.log(`ZoneService.getZoneById chiamato con zoneId: ${zoneId} (tipo: ${typeof zoneId})`);
    console.log('ZONE_DATA disponibili:', ZONE_DATA.map(z => ({ id: z.id, name: z.name })));
    
    // Test con conversione di tipo
    const zoneIdNumber = Number(zoneId);
    const zoneIdString = String(zoneId);
    
    console.log(`Tentativo 1: zone.id === ${zoneId} (${typeof zoneId})`);
    let result = ZONE_DATA.find(zone => zone.id === zoneId);
    
    if (!result) {
      console.log(`Tentativo 2: zone.id === ${zoneIdNumber} (${typeof zoneIdNumber})`);
      result = ZONE_DATA.find(zone => zone.id === zoneIdNumber);
    }
    
    if (!result) {
      console.log(`Tentativo 3: zone.id === ${zoneIdString} (${typeof zoneIdString})`);
      result = ZONE_DATA.find(zone => zone.id === zoneIdString);
    }
    
    if (!result) {
      console.log(`Tentativo 4: zone.id == ${zoneId} (conversione automatica)`);
      result = ZONE_DATA.find(zone => zone.id == zoneId);
    }
    console.log(`Risultato getZoneById(${zoneId}):`, result ? 'TROVATO' : 'NON TROVATO');
    
    if (!result) {
      console.error(`ZONA ${zoneId} NON TROVATA! Zone disponibili:`, ZONE_DATA.map(z => z.id));
    }
    
    return result;
  }

  // Ottieni informazioni CTD
  static getCTDInfo() {
    return CTD_INFO;
  }

  // Carica mappa per zona e parte (A o B)
  static async loadZoneMap(zoneId, part) {
    console.log(`ZoneService.loadZoneMap chiamato con zoneId: ${zoneId}, part: ${part}`);
    
    const zone = this.getZoneById(zoneId);
    if (!zone) {
      console.error(`Zona ${zoneId} non trovata`);
      throw new Error(`Zona ${zoneId} non trovata`);
    }

    if (!['A', 'B'].includes(part)) {
      console.error(`Parte ${part} non valida`);
      throw new Error('Parte deve essere A o B');
    }

    try {
      // Carica KML reale per la zona
      console.log(`[ZoneService] Caricamento KML per Zona ${zoneId} - Sottozona ${part}...`);
      const kmlData = await KMLService.loadKMLForZone(zoneId, part);
      
      const bounds = kmlData.parsed.bounds;
      const centerCoords = {
        latitude: (bounds.north + bounds.south) / 2,
        longitude: (bounds.east + bounds.west) / 2
      };
      
      console.log(`[ZoneService] KML caricato con successo:`);
      console.log(`  - Routes: ${kmlData.parsed.routes.length}`);
      console.log(`  - Stops: ${kmlData.parsed.stops.length}`);
      console.log(`  - Total points: ${kmlData.parsed.totalPoints}`);
      console.log(`  - Center: ${centerCoords.latitude}, ${centerCoords.longitude}`);

      const result = {
        zoneId,
        part,
        kmlData: kmlData.parsed,
        validation: kmlData.validation,
        routes: kmlData.parsed.routes,
        stops: kmlData.parsed.stops,
        bounds: kmlData.parsed.bounds,
        municipalities: zone.municipalities,
        estimatedStops: kmlData.parsed.stops.length || zone.estimatedStops,
        centerCoordinates: centerCoords,
        metadata: kmlData.parsed.metadata
      };
      
      console.log('[ZoneService] ✅ loadZoneMap completato con successo');
      return result;
      
    } catch (error) {
      console.error(`[ZoneService] ❌ Errore caricamento KML:`, error);
      
      // Fallback ai dati configurati se KML non disponibile
      console.warn(`[ZoneService] Fallback a dati predefiniti per Zona ${zoneId} - ${part}`);
      const centerCoords = MAP_CONFIG.gpsConfig.getCenterCoordinates(zoneId);
      
      return {
        zoneId,
        part,
        routes: [],
        stops: [],
        municipalities: zone.municipalities,
        estimatedStops: zone.estimatedStops,
        centerCoordinates: centerCoords,
        error: (error as Error).message
      };
    }
  }

  // Ottieni fermate per zona dal KML
  static async getStopsForZone(zoneId, part) {
    console.log(`ZoneService.getStopsForZone chiamato con zoneId: ${zoneId}, part: ${part}`);
    
    const zone = this.getZoneById(zoneId);
    if (!zone) {
      console.error(`Zona ${zoneId} non trovata in getStopsForZone`);
      return [];
    }

    try {
      // Carica fermate dal KML usando KMLService
      const stops = await KMLService.getStopsForZone(zoneId, part);
      
      // Arricchisci fermate con dati aggiuntivi
      const enrichedStops = stops.map((stop, index) => ({
        ...stop,
        address: `${stop.name}, ${zone.municipalities[0]}, PC`,
        status: 'pending',
        zone: zoneId,
        part: part
      }));

      console.log(`[ZoneService] ✅ ${enrichedStops.length} fermate caricate dal KML per zona ${zoneId} parte ${part}`);
      return enrichedStops;
      
    } catch (error) {
      console.error(`[ZoneService] ❌ Errore caricamento fermate:`, error);
      
      // Fallback a fermate di esempio se KML non disponibile
      console.warn(`[ZoneService] Fallback a fermate di esempio`);
      const centerCoords = MAP_CONFIG.gpsConfig.getCenterCoordinates(zoneId);
      
      const exampleStops = [
        {
          id: `${zoneId}_${part}_1`,
          name: `Fermata esempio 1`,
          address: `${zone.municipalities[0]}, PC`,
          latitude: centerCoords.latitude + 0.002,
          longitude: centerCoords.longitude + 0.002,
          status: 'pending',
          zone: zoneId,
          part: part
        },
        {
          id: `${zoneId}_${part}_2`,
          name: `Fermata esempio 2`,
          address: `${zone.municipalities[0]}, PC`,
          latitude: centerCoords.latitude - 0.002,
          longitude: centerCoords.longitude - 0.002,
          status: 'pending',
          zone: zoneId,
          part: part
        }
      ];
      
      return exampleStops;
    }
  }

  // Trova fermate vicine alla posizione GPS
  static async findNearbyStops(userLocation, zoneId, part, radius = 1000) {
    const allStops = await this.getStopsForZone(zoneId, part);
    
    return allStops.filter(stop => {
      const distance = this.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        stop.latitude,
        stop.longitude
      );
      return distance <= radius;
    });
  }

  // Calcola distanza tra due punti (formula Haversine)
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Raggio della Terra in metri
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distanza in metri
  }

  // Ottimizza percorso per fermate (algoritmo semplice)
  static optimizeRoute(stops, startLocation) {
    if (!stops || stops.length === 0) return [];

    // Algoritmo Nearest Neighbor semplice
    const route = [];
    const unvisited = [...stops];
    let currentLocation = startLocation;

    while (unvisited.length > 0) {
      // Trova la fermata più vicina
      let nearestIndex = 0;
      let nearestDistance = this.calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        unvisited[0].latitude,
        unvisited[0].longitude
      );

      for (let i = 1; i < unvisited.length; i++) {
        const distance = this.calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          unvisited[i].latitude,
          unvisited[i].longitude
        );
        
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = i;
        }
      }

      // Aggiungi la fermata più vicina al percorso
      const nearestStop = unvisited.splice(nearestIndex, 1)[0];
      route.push(nearestStop);
      currentLocation = {
        latitude: nearestStop.latitude,
        longitude: nearestStop.longitude
      };
    }

    return route;
  }

  // Salva configurazione zona nel database locale
  static async saveZoneConfiguration(zoneId, part, configuration) {
    // Implementazione per salvare nel database SQLite
    // Per ora simuliamo il salvataggio
    console.log(`Salvando configurazione per Zona ${zoneId} - Parte ${part}:`, configuration);
    return true;
  }

  // Carica configurazione zona dal database locale
  static async loadZoneConfiguration(zoneId, part) {
    // Implementazione per caricare dal database SQLite
    // Per ora simuliamo il caricamento
    console.log(`Caricando configurazione per Zona ${zoneId} - Parte ${part}`);
    return null;
  }

  // Verifica se una zona è disponibile per la parte specificata
  static isZonePartAvailable(zoneId, part) {
    const zone = this.getZoneById(zoneId);
    if (!zone) return false;
    
    return zone.deliveryDays.includes(part);
  }

  // Ottieni statistiche zona
  static getZoneStats(zoneId, part) {
    const zone = this.getZoneById(zoneId);
    if (!zone) return null;

    return {
      totalStops: zone.estimatedStops,
      completedStops: Math.floor(Math.random() * zone.estimatedStops),
      pendingStops: zone.estimatedStops - Math.floor(Math.random() * zone.estimatedStops),
      municipalities: zone.municipalities.length,
      workingDays: zone.workingDays.length
    };
  }
}

export default ZoneService;
