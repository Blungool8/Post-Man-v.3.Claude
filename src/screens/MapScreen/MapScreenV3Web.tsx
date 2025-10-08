/**
 * MapScreenV3Web - Versione web di MapScreenV3
 * 
 * react-native-maps non funziona su web
 * Mostra placeholder con info zona e percorsi caricati
 * Per testing completo: usa emulatore Android/iOS
 */

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useZoneData } from '../../hooks/useZoneData';

interface MapScreenV3WebProps {
  zoneId: number;
  zonePart: 'A' | 'B';
  onBack?: () => void;
}

const MapScreenV3Web: React.FC<MapScreenV3WebProps> = ({ zoneId, zonePart, onBack }) => {
  const {
    routes,
    stops,
    bounds,
    centerCoordinates,
    metadata,
    isLoading,
    error,
    loadZone,
    cleanupZone,
    hasZoneLoaded
  } = useZoneData();

  // Carica zona all'apertura
  useEffect(() => {
    console.log(`[MapScreenV3Web] Montaggio per Zona ${zoneId} - ${zonePart}`);
    loadZone(zoneId, zonePart);

    return () => {
      console.log(`[MapScreenV3Web] Smontaggio: CLEANUP Zona ${zoneId} - ${zonePart}`);
      cleanupZone();
    };
  }, [zoneId, zonePart]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingEmoji}>⏳</Text>
        <Text style={styles.loadingText}>
          Caricamento Zona {zoneId} - Sottozona {zonePart}...
        </Text>
        <Text style={styles.loadingSubtext}>
          Parsing KML in corso...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorEmoji}>❌</Text>
        <Text style={styles.errorTitle}>Errore Caricamento</Text>
        <Text style={styles.errorText}>{error}</Text>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Torna Indietro</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.headerBackButton} onPress={onBack}>
            <Text style={styles.headerBackText}>←</Text>
          </TouchableOpacity>
        )}
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>
            Zona {zoneId} - Sottozona {zonePart}
          </Text>
          {metadata && (
            <Text style={styles.headerSubtitle}>
              {metadata.documentName}
            </Text>
          )}
        </View>
      </View>

      {/* Web Notice */}
      <View style={styles.webNotice}>
        <Text style={styles.webNoticeEmoji}>💻</Text>
        <Text style={styles.webNoticeTitle}>
          Modalità Web - Testing UI/UX
        </Text>
        <Text style={styles.webNoticeText}>
          react-native-maps non è disponibile su web.
        </Text>
        <Text style={styles.webNoticeSubtext}>
          Per testare la mappa completa con GPS e percorsi,
          usa: <Text style={styles.codeText}>npm run android</Text> o <Text style={styles.codeText}>npm run ios</Text>
        </Text>
      </View>

      {/* KML Data Preview */}
      <ScrollView style={styles.previewContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✅ KML Caricato con Successo</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{routes.length}</Text>
              <Text style={styles.statLabel}>Percorsi</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stops.length}</Text>
              <Text style={styles.statLabel}>Fermate</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {routes.reduce((sum, r) => sum + r.coordinates.length, 0)}
              </Text>
              <Text style={styles.statLabel}>Punti Totali</Text>
            </View>
          </View>
        </View>

        {/* Bounds Info */}
        {bounds && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📍 Area Geografica</Text>
            <View style={styles.boundsInfo}>
              <Text style={styles.boundsText}>Nord: {bounds.north.toFixed(5)}°</Text>
              <Text style={styles.boundsText}>Sud: {bounds.south.toFixed(5)}°</Text>
              <Text style={styles.boundsText}>Est: {bounds.east.toFixed(5)}°</Text>
              <Text style={styles.boundsText}>Ovest: {bounds.west.toFixed(5)}°</Text>
            </View>
            {centerCoordinates && (
              <Text style={styles.centerText}>
                Centro: {centerCoordinates.latitude.toFixed(5)}, {centerCoordinates.longitude.toFixed(5)}
              </Text>
            )}
          </View>
        )}

        {/* Routes List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛣️ Percorsi Caricati</Text>
          {routes.map((route, index) => (
            <View key={index} style={styles.routeCard}>
              <Text style={styles.routeName}>{route.name}</Text>
              <Text style={styles.routePoints}>
                {route.coordinates.length} punti
              </Text>
            </View>
          ))}
          {routes.length === 0 && (
            <Text style={styles.emptyText}>Nessun percorso caricato</Text>
          )}
        </View>

        {/* Stops List */}
        {stops.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📌 Fermate</Text>
            {stops.map((stop, index) => (
              <View key={index} style={styles.stopCard}>
                <Text style={styles.stopName}>{stop.name}</Text>
                <Text style={styles.stopCoords}>
                  {stop.latitude.toFixed(5)}, {stop.longitude.toFixed(5)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Testing Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧪 Testing Info</Text>
          <Text style={styles.infoText}>
            ✅ UI/UX: Testabile su web (questa schermata)
          </Text>
          <Text style={styles.infoText}>
            ⚠️ GPS & Mappa: Richiede emulatore/device
          </Text>
          <Text style={styles.infoText}>
            📱 Comandi test:
          </Text>
          <Text style={styles.codeBlock}>
            npm run android{'\n'}
            npm run ios
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

MapScreenV3Web.displayName = 'MapScreenV3Web';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerBackButton: {
    marginRight: 10,
    padding: 5
  },
  headerBackText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold'
  },
  headerInfo: {
    flex: 1
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginTop: 2
  },
  webNotice: {
    backgroundColor: '#FFF3E0',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#FF9800'
  },
  webNoticeEmoji: {
    fontSize: 48,
    marginBottom: 10
  },
  webNoticeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 5
  },
  webNoticeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5
  },
  webNoticeSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5
  },
  codeText: {
    fontFamily: 'monospace',
    backgroundColor: '#FFE0B2',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  },
  loadingEmoji: {
    fontSize: 64,
    marginBottom: 20
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600'
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 5
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: 20
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 10
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20
  },
  previewContainer: {
    flex: 1
  },
  section: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  statCard: {
    alignItems: 'center',
    padding: 10
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3'
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5
  },
  boundsInfo: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  },
  boundsText: {
    fontSize: 13,
    color: '#333',
    fontFamily: 'monospace',
    marginVertical: 2
  },
  centerText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    textAlign: 'center'
  },
  routeCard: {
    backgroundColor: '#E3F2FD',
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3'
  },
  routeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2'
  },
  routePoints: {
    fontSize: 12,
    color: '#666',
    marginTop: 3
  },
  stopCard: {
    backgroundColor: '#FFF3E0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800'
  },
  stopName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F57C00'
  },
  stopCoords: {
    fontSize: 11,
    color: '#666',
    fontFamily: 'monospace',
    marginTop: 3
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 20
  },
  infoText: {
    fontSize: 13,
    color: '#333',
    marginBottom: 5
  },
  codeBlock: {
    fontFamily: 'monospace',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    fontSize: 12,
    color: '#333'
  },
  backButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20
  },
  backButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
  }
});

export default MapScreenV3Web;

