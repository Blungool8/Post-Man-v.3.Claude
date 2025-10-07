## 2025-10-07 — Setup Repository GitHub & Testing Environment

**Agent**: Claude Sonnet 4.5  
**Task**: Creare repository GitHub "Post-Man-v.3.Claude", setup ambiente, correzione linting, avvio testing workflow.  
**Durata**: 30min

**Implementato**:
- ✅ Creata repository GitHub: https://github.com/Blungool8/Post-Man-v.3.Claude
- ✅ Inizializzato Git locale e fatto push del progetto completo (68 files, 26,901 insertions)
- ✅ Verificato setup: Expo 54.0.8, dipendenze installate, TypeScript configurato
- ✅ Corretto 2 errori di linting:
  - Escaped apostrophe in LocationPermissionHandler.js
  - Aggiunto displayName a CustomStopMarker component
- ✅ Eseguito commit e push delle correzioni
- ✅ Avviato server Expo in modalità web per testing UI/UX

**File Modificati**:
- `src/components/LocationPermissionHandler.js` — fix apostrophe escape
- `src/components/Map/CustomStopMarker.js` — add displayName

**Controlli Qualità**:
- Type-check: ✅ Passed
- Linting: ✅ 0 errors, 22 warnings (accettabili)
- Dependencies: ✅ 908 packages installed, 0 vulnerabilities
- Git status: ✅ 2 commits pushed to main branch

**DoD Status**:
- Repository creata e configurata: ✅
- Ambiente di sviluppo pronto: ✅
- Linting errors risolti: ✅
- Server di testing avviato: ✅

**Note**:
- Workflow ibrido desktop-first attivo (sviluppo web + test emulatore)
- Server web disponibile su http://localhost:8081
- Pronto per testing funzionalità e sviluppo features

**Next Steps**:
- Testare UI base e MapView su browser
- Verificare caricamento KML esistente (CTD_CastelSanGiovanni_Z09_B.kml)
- Preparare testing su emulatore Android per funzionalità GPS
- Implementare features mancanti secondo PLANNING_V3_DETTAGLIATO.md

---

## 2025-10-05 — Allineamento v3 (KML unico + GPS-driven UI)

**Agent**: GPT-5 Thinking  
**Task**: Aggiornare documentazione a nuovo flusso **KML unico** (es. `Zona9_SottozonaB.kml`); abilitare fermate **solo con GPS** entro raggio; **Lista Fermate**; **+Fermata**; **banner dopo selezione**.  
**Durata**: 1h

**Implementato**:
- Creato `PRD_V3_COMPLETO.md` con requisiti v3 (KML unico, flussi aggiornati).
- Creato `PLANNING_V3_DETTAGLIATO.md` con milestone e T09 “richiesta file KML”.
- Aggiornato `AGENT_INSTRUCTIONS.md` (rimozione JSON/merge runtime; regole GPS; banner post-selezione).
- Coerenza con storico v2 mantenuta.

**File Creati/Aggiornati**:
- `pk/PRD_V3_COMPLETO.md` — nuovo.
- `pk/PLANNING_V3_DETTAGLIATO.md` — nuovo.
- `pk/AGENT_INSTRUCTIONS.md` — aggiornato per v3.

**DoD Status**:
- Flusso KML unico documentato: ✅
- Regole GPS/visibilità fermate: ✅
- Lista fermate & +Fermata: ✅
- Banner dopo selezione: ✅

**Note**:
- Il KML deve essere preparato e ottimizzato a monte (dimensione target ≤ 5 MB).
- Semplificazione polyline (DP) lato client solo come safety per file molto densi.

**Next Steps**:
- Attendere da Lorsa il file **`Zona9_SottozonaB.kml`** (T09).
- Implementare M1 (Loader/Parser/Validator) → M2 (rendering + markers GPS).
