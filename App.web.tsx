/**
 * App.web.tsx - Versione web dell'app
 * NESSUNA dipendenza da moduli nativi
 */

import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  Modal,
  TextInput
} from 'react-native';
import { ZONE_DATA, CTD_INFO } from './src/config/ZoneConfig';

// Type definitions
interface Zone {
  id: number;
  name: string;
  description: string;
  area: string;
  mapImage: string;
  realMapPath: string;
  municipalities: string[];
  estimatedStops: number;
  deliveryDays: string[];
  workingDays: string[];
}

export default function App() {
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [showZonePartModal, setShowZonePartModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [selectedZonePart, setSelectedZonePart] = useState<'A' | 'B' | null>(null);
  const [showMap, setShowMap] = useState(false);

  const handleSelectZone = () => {
    setShowZoneModal(true);
  };

  const handleZoneSelected = (zone: Zone) => {
    setSelectedZone(zone);
    setShowZoneModal(false);
    setShowZonePartModal(true);
  };

  const handleZonePartSelected = (part: 'A' | 'B') => {
    setSelectedZonePart(part);
    setShowZonePartModal(false);
    setShowMap(true);
  };

  const handleBackToMain = () => {
    setShowMap(false);
    setSelectedZone(null);
    setSelectedZonePart(null);
  };

  // Mostra schermata mappa (versione web semplificata)
  if (showMap && selectedZone && selectedZonePart) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        
        {/* Header */}
        <View style={styles.mapHeader}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToMain}>
            <Text style={styles.backButtonText}>← Indietro</Text>
          </TouchableOpacity>
          <Text style={styles.mapHeaderTitle}>
            Zona {selectedZone.id} - Sottozona {selectedZonePart}
          </Text>
        </View>

        {/* Web Notice */}
        <View style={styles.webNotice}>
          <Text style={styles.webNoticeEmoji}>💻</Text>
          <Text style={styles.webNoticeTitle}>Modalità Web - Preview UI</Text>
          <Text style={styles.webNoticeText}>
            Mappa e GPS non disponibili su web
          </Text>
          <Text style={styles.webNoticeSubtext}>
            Per testing completo usa:
          </Text>
          <View style={styles.codeContainer}>
            <Text style={styles.codeBlock}>npm run android</Text>
          </View>
        </View>

        {/* Info */}
        <ScrollView style={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>📋 Zona Selezionata</Text>
            <Text style={styles.infoText}>• Zona: {selectedZone.id}</Text>
            <Text style={styles.infoText}>• Nome: {selectedZone.name}</Text>
            <Text style={styles.infoText}>• Sottozona: {selectedZonePart}</Text>
            <Text style={styles.infoText}>
              • File KML: CTD_CastelSanGiovanni_Z{String(selectedZone.id).padStart(2, '0')}_{selectedZonePart}.kml
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>✨ Funzionalità Implementate</Text>
            <Text style={styles.featureText}>✅ KML Loader & Parser (M1)</Text>
            <Text style={styles.featureText}>✅ Polyline Rendering - 14 percorsi (M2)</Text>
            <Text style={styles.featureText}>✅ Marker GPS-driven 200m radius (M2)</Text>
            <Text style={styles.featureText}>✅ Toggle visibilità marker (M2)</Text>
            <Text style={styles.featureText}>✅ Camera Fit automatico (M2)</Text>
            <Text style={styles.featureText}>✅ Cleanup cambio zona (M2)</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>📱 Test su Mobile</Text>
            <Text style={styles.testText}>
              Su emulatore/device vedrai:
            </Text>
            <Text style={styles.bulletText}>• 🗺️ Mappa con 14 percorsi blu</Text>
            <Text style={styles.bulletText}>• 📍 GPS tracking real-time</Text>
            <Text style={styles.bulletText}>• 🎯 Marker entro 200m</Text>
            <Text style={styles.bulletText}>• 🔘 Controlli visibilità</Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Schermata principale
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.title}>🗺️ Post-Man</Text>
        <Text style={styles.subtitle}>Gestione Percorsi Postali</Text>
        <Text style={styles.version}>v3.0 Claude AI - Web Preview</Text>
      </View>

      <View style={styles.ctdInfo}>
        <Text style={styles.ctdTitle}>📍 {CTD_INFO.name}</Text>
        <Text style={styles.ctdAddress}>{CTD_INFO.address}</Text>
        <Text style={styles.ctdPhone}>📞 {CTD_INFO.phone}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleSelectZone}
        >
          <Text style={styles.primaryButtonText}>🗺️ Seleziona Zona</Text>
        </TouchableOpacity>

        <View style={styles.webWarning}>
          <Text style={styles.webWarningText}>
            ⚠️ Limitazioni Web: Mappa e GPS richiedono emulatore/device
          </Text>
        </View>
      </View>

      {/* Modal Selezione Zona */}
      <Modal
        visible={showZoneModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowZoneModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleziona Zona</Text>
            
            <ScrollView style={styles.zoneList}>
              {ZONE_DATA.map((zone) => (
                <TouchableOpacity
                  key={zone.id}
                  style={styles.zoneItem}
                  onPress={() => handleZoneSelected(zone)}
                >
                  <Text style={styles.zoneName}>Zona {zone.id}</Text>
                  <Text style={styles.zoneDesc}>{zone.description}</Text>
                  <Text style={styles.zoneArea}>{zone.area}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowZoneModal(false)}
            >
              <Text style={styles.modalCloseText}>Chiudi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Selezione A/B */}
      <Modal
        visible={showZonePartModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowZonePartModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedZone && `${selectedZone.name}`}
            </Text>
            <Text style={styles.modalSubtitle}>Seleziona Sottozona (Piano)</Text>

            <View style={styles.partButtons}>
              <TouchableOpacity
                style={[styles.partButton, styles.partButtonA]}
                onPress={() => handleZonePartSelected('A')}
              >
                <Text style={styles.partButtonText}>A</Text>
                <Text style={styles.partButtonSubtext}>Piano A</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.partButton, styles.partButtonB]}
                onPress={() => handleZonePartSelected('B')}
              >
                <Text style={styles.partButtonText}>B</Text>
                <Text style={styles.partButtonSubtext}>Piano B</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => {
                setShowZonePartModal(false);
                setSelectedZone(null);
              }}
            >
              <Text style={styles.modalCancelText}>Annulla</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 5,
  },
  version: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  ctdInfo: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  ctdTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  ctdAddress: {
    fontSize: 13,
    color: '#666',
    marginBottom: 3,
  },
  ctdPhone: {
    fontSize: 13,
    color: '#666',
  },
  actions: {
    padding: 20,
  },
  primaryButton: {
    backgroundColor: '#2196F3',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  webWarning: {
    backgroundColor: '#FFF3E0',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  webWarningText: {
    fontSize: 13,
    color: '#E65100',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  zoneList: {
    maxHeight: 400,
  },
  zoneItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  zoneName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
  zoneDesc: {
    fontSize: 13,
    color: '#666',
    marginTop: 3,
  },
  zoneArea: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  partButtons: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  partButton: {
    flex: 1,
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
  },
  partButtonA: {
    backgroundColor: '#4CAF50',
  },
  partButtonB: {
    backgroundColor: '#FF9800',
  },
  partButtonText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  partButtonSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 5,
  },
  modalCloseButton: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  modalCloseText: {
    fontSize: 14,
    color: '#666',
  },
  modalCancelButton: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    color: '#666',
  },
  // Map Screen Styles
  mapHeader: {
    backgroundColor: '#2196F3',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  mapHeaderTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  webNotice: {
    backgroundColor: '#FFF3E0',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#FF9800',
  },
  webNoticeEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  webNoticeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 5,
  },
  webNoticeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  webNoticeSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  codeContainer: {
    alignItems: 'center',
  },
  codeBlock: {
    fontFamily: 'monospace',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    paddingLeft: 10,
  },
  testText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  bulletText: {
    fontSize: 13,
    color: '#333',
    marginBottom: 6,
    paddingLeft: 10,
  },
});

