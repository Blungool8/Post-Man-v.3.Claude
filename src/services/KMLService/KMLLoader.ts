/**
 * KMLLoader - Carica file KML da assets o storage
 * Milestone M1 - Task T10
 */

import { Platform } from 'react-native';

export interface KMLLoadResult {
  content: string;
  source: 'assets' | 'storage';
  fileName: string;
  size: number;
}

class KMLLoader {
  /**
   * Carica file KML da assets bundled
   * @param zoneId - ID della zona (es. 9)
   * @param part - Sottozona A o B
   * @returns Contenuto del file KML
   */
  static async loadFromAssets(zoneId: number, part: 'A' | 'B'): Promise<KMLLoadResult> {
    // Su web, usa versione web-compatible
    if (Platform.OS === 'web') {
      const KMLLoaderWeb = require('./KMLLoader.web').default;
      return KMLLoaderWeb.loadFromAssets(zoneId, part);
    }

    const fileName = `CTD_CastelSanGiovanni_Z${String(zoneId).padStart(2, '0')}_${part}.kml`;
    
    console.log(`[KMLLoader] Caricamento ${fileName} da assets...`);
    
    try {
      // Import condizionali solo su mobile
      const { Asset } = require('expo-asset');
      const FileSystem = require('expo-file-system');

      // Mappa statica dei file KML disponibili
      const kmlAssets: Record<string, any> = {
        'CTD_CastelSanGiovanni_Z09_B.kml': require('../../../assets/kml/CTD_CastelSanGiovanni_Z09_B.kml'),
        // Aggiungi altri file KML qui quando disponibili
        // 'CTD_CastelSanGiovanni_Z09_A.kml': require('../../../assets/kml/CTD_CastelSanGiovanni_Z09_A.kml'),
      };
      
      if (!kmlAssets[fileName]) {
        throw new Error(`File ${fileName} non trovato in assets`);
      }
      
      // Carica asset
      const asset = Asset.fromModule(kmlAssets[fileName]);
      await asset.downloadAsync();
      
      if (!asset.localUri) {
        throw new Error(`Asset ${fileName} non ha localUri`);
      }
      
      // Leggi contenuto file
      const content = await FileSystem.readAsStringAsync(asset.localUri);
      
      const result: KMLLoadResult = {
        content,
        source: 'assets',
        fileName,
        size: content.length
      };
      
      console.log(`[KMLLoader] ✅ ${fileName} caricato con successo (${result.size} bytes)`);
      return result;
      
    } catch (error) {
      console.error(`[KMLLoader] ❌ Errore caricamento ${fileName}:`, error);
      throw new Error(`Impossibile caricare ${fileName}: ${(error as Error).message}`);
    }
  }
  
  /**
   * Carica file KML da storage locale (per file importati dall'utente)
   * @param filePath - Percorso del file
   */
  static async loadFromStorage(filePath: string): Promise<KMLLoadResult> {
    // Su web, usa versione web-compatible
    if (Platform.OS === 'web') {
      const KMLLoaderWeb = require('./KMLLoader.web').default;
      return KMLLoaderWeb.loadFromStorage(filePath);
    }

    console.log(`[KMLLoader] Caricamento da storage: ${filePath}`);
    
    try {
      // Import condizionale solo su mobile
      const FileSystem = require('expo-file-system');

      const fileInfo = await FileSystem.getInfoAsync(filePath);
      
      if (!fileInfo.exists) {
        throw new Error(`File non trovato: ${filePath}`);
      }
      
      const content = await FileSystem.readAsStringAsync(filePath);
      const fileName = filePath.split('/').pop() || 'unknown.kml';
      
      const result: KMLLoadResult = {
        content,
        source: 'storage',
        fileName,
        size: content.length
      };
      
      console.log(`[KMLLoader] ✅ File caricato da storage (${result.size} bytes)`);
      return result;
      
    } catch (error) {
      console.error(`[KMLLoader] ❌ Errore caricamento da storage:`, error);
      throw new Error(`Impossibile caricare file: ${(error as Error).message}`);
    }
  }
  
  /**
   * Verifica se esiste un file KML per la zona/sottozona specificata
   */
  static async checkKMLExists(zoneId: number, part: 'A' | 'B'): Promise<boolean> {
    // Su web, usa versione web-compatible
    if (Platform.OS === 'web') {
      const KMLLoaderWeb = require('./KMLLoader.web').default;
      return KMLLoaderWeb.checkKMLExists(zoneId, part);
    }

    const fileName = `CTD_CastelSanGiovanni_Z${String(zoneId).padStart(2, '0')}_${part}.kml`;
    
    // Mappa statica dei file KML disponibili
    const kmlAssets: Record<string, any> = {
      'CTD_CastelSanGiovanni_Z09_B.kml': require('../../../assets/kml/CTD_CastelSanGiovanni_Z09_B.kml'),
      // Aggiungi altri file KML qui quando disponibili
    };
    
    return fileName in kmlAssets;
  }
}

export default KMLLoader;

